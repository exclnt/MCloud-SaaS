import http from 'node:http';
import { parseJSON } from './utils/parser.js';
import { snap } from './config/midtrans.js';
import { db } from '../../../database/db.js';
import { transactions, users, servers, plans, activity_logs } from '../../../database/schema.js';
import { verifyToken, generateToken } from '../../auth-service/src/utils/jwt.js';
import { eq } from 'drizzle-orm';

function logActivity(userId, action, details = null) {
  try {
    db.insert(activity_logs).values({
      userId,
      action,
      details: details ? JSON.stringify(details) : null
    }).run();
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
}

const PORT = 3002;

const authMiddleware = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Invalid or expired token' }));
    return null;
  }
  return user;
};

// Internal communication function to call provisioning-service
const triggerProvisioning = (userId, username, transactionId, configString) => {
  const token = generateToken({ id: userId, username });
  const baseConfig = configString ? JSON.parse(configString) : {};
  const payload = JSON.stringify({ name: `Bedrock_trx_${transactionId}`, ...baseConfig });
  
  const options = {
    hostname: 'localhost',
    port: 3003,
    path: '/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Provisioning triggered for user ${userId}. Response: ${data}`);
    });
  });
  
  req.on('error', (e) => {
    console.error(`Error triggering provisioning for user ${userId}: ${e.message}`);
  });
  
  req.write(payload);
  req.end();
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const url = req.url;

  if (req.method === 'POST' && url === '/checkout') {
    const user = authMiddleware(req, res);
    if (!user) return;

    try {
      const body = await parseJSON(req);
      const amount = body.amount || 50000;
      const config = body.config ? JSON.stringify(body.config) : null;

      const trx = db.insert(transactions).values({
        userId: user.id,
        amount,
        config,
        status: 'pending'
      }).returning().get();

      const parameter = {
        transaction_details: {
          order_id: `MCLOUD-${trx.id}-${Date.now()}`,
          gross_amount: amount
        },
        credit_card: { secure: true },
        customer_details: {
          first_name: user.username,
          email: `${user.username}@mcloud.local`
        }
      };

      const transaction = await snap.createTransaction(parameter);
      
      db.update(transactions)
        .set({ snapToken: transaction.token })
        .where(eq(transactions.id, trx.id))
        .run();

      res.statusCode = 200;
      return res.end(JSON.stringify({ 
        transactionId: trx.id, 
        token: transaction.token,
        redirect_url: transaction.redirect_url 
      }));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url === '/webhook') {
    try {
      const body = await parseJSON(req);
      const transactionStatus = body.transaction_status;
      const orderId = body.order_id;
      
      const trxIdMatch = orderId.match(/^MCLOUD-(\d+)-/);
      if (!trxIdMatch) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid order_id format' }));
      }
      
      const trxId = parseInt(trxIdMatch[1]);
      const trxRecord = db.select().from(transactions).where(eq(transactions.id, trxId)).get();
      
      if (!trxRecord) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Transaction not found' }));
      }

      if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
        db.update(transactions).set({ status: 'success' }).where(eq(transactions.id, trxId)).run();
        
        const userRecord = db.select().from(users).where(eq(users.id, trxRecord.userId)).get();
        if (userRecord) {
          const configData = trxRecord.config ? JSON.parse(trxRecord.config) : {};
          if (configData.renew && configData.serverId) {
            // Handle server renewal
            const serverToRenew = db.select().from(servers).where(eq(servers.id, configData.serverId)).get();
            if (serverToRenew) {
              let currentExpiry = Date.now();
              if (serverToRenew.expiresAt) {
                const t = new Date(serverToRenew.expiresAt).getTime();
                if (t > 1000000000000) currentExpiry = t; // Ensure it's a valid modern date
              }
              // Add days based on config, default 30
              const daysToAdd = configData.days || 30;
              const newExpiry = new Date(currentExpiry + (daysToAdd * 24 * 60 * 60 * 1000));
              db.update(servers).set({ expiresAt: newExpiry }).where(eq(servers.id, serverToRenew.id)).run();
              console.log(`Server ${serverToRenew.id} renewed for ${daysToAdd} days.`);
            }
          } else {
            // New server provisioning
            triggerProvisioning(userRecord.id, userRecord.username, trxId, trxRecord.config);
          }
        }
        
      } else if (transactionStatus === 'cancel' || transactionStatus === 'expire' || transactionStatus === 'deny') {
        db.update(transactions).set({ status: 'failed' }).where(eq(transactions.id, trxId)).run();
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Webhook received' }));
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url === '/plans') {
    try {
      const allPlans = db.select().from(plans).all();
      res.statusCode = 200;
      return res.end(JSON.stringify(allPlans));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'PUT' && url.match(/^\/admin\/plans\/(\d+)$/)) {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    const match = url.match(/^\/admin\/plans\/(\d+)$/);
    const planId = parseInt(match[1]);
    
    try {
      const body = await parseJSON(req);
      db.update(plans).set({
        price: body.price,
        discount: body.discount
      }).where(eq(plans.id, planId)).run();
      
      logActivity(user.id, 'update_plan', { planId, price: body.price, discount: body.discount });
      
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Plan updated' }));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Payment Service is running on http://localhost:${PORT}`);
});
