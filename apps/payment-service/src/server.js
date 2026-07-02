import http from 'node:http';
import { parseJSON } from './utils/parser.js';
import { snap, coreApi } from './config/midtrans.js';
import { db } from '../../../database/db.js';
import { transactions, users, servers, plans, activity_logs, settings } from '../../../database/schema.js';
import { verifyToken, generateToken } from '../../auth-service/src/utils/jwt.js';
import { eq, desc } from 'drizzle-orm';

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

function parseRamToMB(ramStr) {
  if (!ramStr) return 0;
  const str = ramStr.toString().toLowerCase().trim();
  if (str.endsWith('g') || str.endsWith('gb')) {
    const val = parseFloat(str);
    return isNaN(val) ? 0 : Math.round(val * 1024);
  }
  if (str.endsWith('m') || str.endsWith('mb')) {
    const val = parseFloat(str);
    return isNaN(val) ? 0 : Math.round(val);
  }
  const val = parseInt(str);
  return isNaN(val) ? 0 : val;
}

function getResourcePoolStats() {
  let totalRamMB = 8192;
  try {
    const setting = db.select().from(settings).where(eq(settings.key, 'total_available_ram')).get();
    if (setting && setting.value !== undefined) {
      totalRamMB = parseInt(setting.value) || 0;
    }
  } catch (err) {
    console.error('Failed to read total_available_ram:', err.message);
  }

  let usedRamMB = 0;
  try {
    const allServers = db.select().from(servers).all();
    for (const s of allServers) {
      usedRamMB += parseRamToMB(s.memoryLimit);
    }
  } catch (err) {
    console.error('Failed to calculate used RAM:', err.message);
  }

  const availableRamMB = Math.max(0, totalRamMB - usedRamMB);
  return { totalRamMB, usedRamMB, availableRamMB };
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

const formatTransactionObj = (trx) => {
  if (!trx) return trx;
  let cfg = {};
  try {
    if (trx.config) cfg = typeof trx.config === 'string' ? JSON.parse(trx.config) : trx.config;
  } catch (e) {}

  const orderId = cfg.orderId || (trx.snapToken ? `MCLOUD-${trx.id}` : `TRX-${trx.id}`);
  
  let planName = cfg.planName || cfg.plan || '-';
  if (planName === '-') {
    if (cfg.renew) {
      planName = 'Perpanjangan Server';
    } else if (cfg.memoryLimit || cfg.ram) {
      const ram = String(cfg.memoryLimit || cfg.ram).toLowerCase();
      if (ram === '500m' || ram === '500mb') planName = 'Villager';
      else if (ram === '1g' || ram === '1gb') planName = 'Spider';
      else if (ram === '2g' || ram === '2gb') planName = 'Slime';
      else if (ram === '4g' || ram === '4gb') planName = 'Wither';
      else planName = `Custom (${ram.toUpperCase()})`;
    } else if (trx.amount) {
      if (trx.amount === 15000 || trx.amount === 30000) planName = 'Villager';
      else if (trx.amount === 25000 || trx.amount === 40000) planName = 'Spider';
      else if (trx.amount === 50000 || trx.amount === 80000) planName = 'Slime';
      else if (trx.amount === 100000 || trx.amount === 160000) planName = 'Wither';
      else planName = 'Layanan MCloud';
    }
  }

  return {
    ...trx,
    orderId,
    planName
  };
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
      if (res.statusCode >= 400) {
        logActivity(userId, 'provisioning_failed', { transactionId, status: 'failed', error: data });
        try {
          const trx = db.select().from(transactions).where(eq(transactions.id, transactionId)).get();
          if (trx) {
            const cfg = trx.config ? JSON.parse(trx.config) : {};
            cfg.provisioningError = `Gagal provisioning (Docker/Runtime error): ${data}`;
            db.update(transactions).set({ config: JSON.stringify(cfg) }).where(eq(transactions.id, transactionId)).run();
          }
        } catch (err) {}
      } else {
        logActivity(userId, 'provisioning_success', { transactionId, status: 'success' });
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`Error triggering provisioning for user ${userId}: ${e.message}`);
    logActivity(userId, 'provisioning_failed', { transactionId, status: 'failed', error: e.message });
    try {
      const trx = db.select().from(transactions).where(eq(transactions.id, transactionId)).get();
      if (trx) {
        const cfg = trx.config ? JSON.parse(trx.config) : {};
        cfg.provisioningError = `Gagal provisioning (Docker runtime luring/mati): ${e.message}`;
        db.update(transactions).set({ config: JSON.stringify(cfg) }).where(eq(transactions.id, transactionId)).run();
      }
    } catch (err) {}
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

      if (!body.config?.renew) {
        const pool = getResourcePoolStats();
        const ramMB = parseRamToMB(body.config?.memoryLimit || '500m');
        if (pool.totalRamMB <= 0) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Penyewaan server baru sedang ditutup sementara oleh Admin.' }));
        }
        if (ramMB > pool.availableRamMB) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ 
            error: "Stok paket saat ini sedang habis. Silakan pilih paket lain atau coba lagi nanti." 
          }));
        }
      }

      const trx = db.insert(transactions).values({
        userId: user.id,
        amount,
        config,
        status: 'pending'
      }).returning().get();

      const origin = req.headers.origin || 'http://localhost:5173';
      const orderId = `MCLOUD-${trx.id}-${Date.now()}`;
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        credit_card: { secure: true },
        customer_details: {
          first_name: user.username,
          email: `${user.username}@mcloud.local`
        },
        callbacks: {
          finish: `${origin}/transaction/${trx.id}`,
          error: `${origin}/transaction/${trx.id}`,
          unfinish: `${origin}/transaction/${trx.id}`
        }
      };

      const transaction = await snap.createTransaction(parameter);
      
      const updatedConfigObj = body.config || {};
      updatedConfigObj.orderId = orderId;
      
      db.update(transactions)
        .set({ snapToken: transaction.token, config: JSON.stringify(updatedConfigObj) })
        .where(eq(transactions.id, trx.id))
        .run();

      logActivity(user.id, 'create_order', { transactionId: trx.id, orderId, amount, status: 'pending' });

      res.statusCode = 200;
      return res.end(JSON.stringify({ 
        transactionId: trx.id, 
        token: transaction.token,
        redirect_url: transaction.redirect_url 
      }));
    } catch (e) {
      logActivity(user.id, 'create_order_failed', { error: e.message, status: 'failed' });
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/transactions\/(\d+)\/sync$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const match = url.match(/^\/transactions\/(\d+)\/sync$/);
    const trxId = parseInt(match[1]);
    try {
      const trxRecord = db.select().from(transactions).where(eq(transactions.id, trxId)).get();
      if (!trxRecord) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Transaction not found' }));
      }
      if (trxRecord.userId !== user.id && user.role !== 'admin') {
        res.statusCode = 403;
        return res.end(JSON.stringify({ error: 'Forbidden' }));
      }
      
      if (trxRecord.status !== 'pending') {
        res.statusCode = 200;
        return res.end(JSON.stringify(formatTransactionObj(trxRecord)));
      }

      let orderId = null;
      if (trxRecord.config) {
        try {
          const cfg = JSON.parse(trxRecord.config);
          orderId = cfg.orderId;
        } catch (e) {}
      }
      
      if (!orderId) {
        res.statusCode = 200;
        return res.end(JSON.stringify(formatTransactionObj(trxRecord)));
      }

      try {
        const statusRes = await coreApi.transaction.status(orderId);
        const transactionStatus = statusRes.transaction_status;
        console.log(`Syncing trx ${trxId} (${orderId}), status from Midtrans: ${transactionStatus}`);

        if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
          db.update(transactions).set({ status: 'success' }).where(eq(transactions.id, trxId)).run();
          logActivity(trxRecord.userId, 'payment_success_sync', { transactionId: trxId, amount: trxRecord.amount, status: 'success' });
          
          const userRecord = db.select().from(users).where(eq(users.id, trxRecord.userId)).get();
          if (userRecord) {
            const configData = trxRecord.config ? JSON.parse(trxRecord.config) : {};
            if (configData.renew && configData.serverId) {
              const serverToRenew = db.select().from(servers).where(eq(servers.id, configData.serverId)).get();
              if (serverToRenew) {
                let currentExpiry = Date.now();
                if (serverToRenew.expiresAt) {
                  const t = new Date(serverToRenew.expiresAt).getTime();
                  if (t > 1000000000000) currentExpiry = t;
                }
                const daysToAdd = configData.days || 30;
                const newExpiry = new Date(currentExpiry + (daysToAdd * 24 * 60 * 60 * 1000));
                db.update(servers).set({ expiresAt: newExpiry }).where(eq(servers.id, serverToRenew.id)).run();
                logActivity(userRecord.id, 'renew_server_success', { serverId: serverToRenew.id, days: daysToAdd, status: 'success' });
              } else {
                logActivity(userRecord.id, 'renew_server_failed', { serverId: configData.serverId, error: 'Server not found', status: 'failed' });
              }
            } else {
              triggerProvisioning(userRecord.id, userRecord.username, trxId, trxRecord.config);
            }
          }
        } else if (transactionStatus === 'cancel' || transactionStatus === 'expire' || transactionStatus === 'deny') {
          db.update(transactions).set({ status: 'failed' }).where(eq(transactions.id, trxId)).run();
          logActivity(trxRecord.userId, 'payment_failed_sync', { transactionId: trxId, status: 'failed', reason: transactionStatus });
        }
      } catch (err) {
        console.error('Error syncing status with Midtrans API:', err.message);
      }

      const updatedTrx = db.select().from(transactions).where(eq(transactions.id, trxId)).get();
      res.statusCode = 200;
      return res.end(JSON.stringify(formatTransactionObj(updatedTrx)));
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
        logActivity(trxRecord.userId, 'payment_success', { transactionId: trxId, amount: trxRecord.amount, status: 'success' });
        
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
              logActivity(userRecord.id, 'renew_server_success', { serverId: serverToRenew.id, days: daysToAdd, status: 'success' });
            } else {
              logActivity(userRecord.id, 'renew_server_failed', { serverId: configData.serverId, error: 'Server not found', status: 'failed' });
            }
          } else {
            // New server provisioning
            triggerProvisioning(userRecord.id, userRecord.username, trxId, trxRecord.config);
          }
        }
        
      } else if (transactionStatus === 'cancel' || transactionStatus === 'expire' || transactionStatus === 'deny') {
        db.update(transactions).set({ status: 'failed' }).where(eq(transactions.id, trxId)).run();
        logActivity(trxRecord.userId, 'payment_failed', { transactionId: trxId, amount: trxRecord.amount, status: 'failed', reason: transactionStatus });
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
      const pool = getResourcePoolStats();
      const enrichedPlans = allPlans.map(p => {
        const ramMB = parseRamToMB(p.ram);
        const isAvailable = pool.totalRamMB > 0 && ramMB <= pool.availableRamMB;
        let reason = "Tersedia";
        if (pool.totalRamMB <= 0) {
          reason = "Penyewaan server baru sedang ditutup oleh Admin";
        } else if (!isAvailable) {
          reason = "Stok paket saat ini sedang habis";
        }
        return {
          ...p,
          ramMB,
          available: isAvailable,
          reason,
          poolStats: pool
        };
      });
      res.statusCode = 200;
      return res.end(JSON.stringify(enrichedPlans));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url === '/admin/resource-pool') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const pool = getResourcePoolStats();
      const allServers = db.select().from(servers).all();
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...pool, totalServers: allServers.length }));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'PUT' && url === '/admin/resource-pool') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const body = await parseJSON(req);
      const totalRamMB = parseInt(body.totalRamMB);
      if (isNaN(totalRamMB) || totalRamMB < 0) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Total RAM harus angka positif (dalam MB)' }));
      }
      
      const existing = db.select().from(settings).where(eq(settings.key, 'total_available_ram')).get();
      if (!existing) {
        db.insert(settings).values({ key: 'total_available_ram', value: String(totalRamMB) }).run();
      } else {
        db.update(settings).set({ value: String(totalRamMB) }).where(eq(settings.key, 'total_available_ram')).run();
      }
      
      logActivity(user.id, 'update_resource_pool', { totalRamMB });
      
      const updatedPool = getResourcePoolStats();
      const allServers = db.select().from(servers).all();
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Resource pool updated', pool: { ...updatedPool, totalServers: allServers.length } }));
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

  if (req.method === 'GET' && url === '/transactions') {
    const user = authMiddleware(req, res);
    if (!user) return;
    try {
      const userTransactions = db.select().from(transactions)
        .where(eq(transactions.userId, user.id))
        .orderBy(desc(transactions.createdAt))
        .all();
      res.statusCode = 200;
      return res.end(JSON.stringify(userTransactions.map(formatTransactionObj)));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url.startsWith('/transactions/')) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const trxId = parseInt(url.split('/')[2]);
    try {
      const userTransaction = db.select().from(transactions)
        .where(eq(transactions.id, trxId))
        .get();
      if (!userTransaction || (userTransaction.userId !== user.id && user.role !== 'admin')) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Transaction not found' }));
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(formatTransactionObj(userTransaction)));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url === '/admin/transactions') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const allTransactions = db.select({
        id: transactions.id,
        userId: transactions.userId,
        amount: transactions.amount,
        status: transactions.status,
        snapToken: transactions.snapToken,
        config: transactions.config,
        createdAt: transactions.createdAt,
        username: users.username,
        email: users.email
      }).from(transactions)
        .leftJoin(users, eq(transactions.userId, users.id))
        .orderBy(desc(transactions.createdAt))
        .all();
      res.statusCode = 200;
      return res.end(JSON.stringify(allTransactions.map(formatTransactionObj)));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url === '/settings') {
    try {
      const allSettings = db.select().from(settings).all();
      const settingsMap = {
        social_discord: 'https://discord.gg/mcloud',
        social_whatsapp: 'https://wa.me/6281234567890',
        social_instagram: 'https://instagram.com/mcloud.id',
        social_twitter: 'https://x.com/mcloud_id',
        social_email: 'support@mcloud.id'
      };
      for (const item of allSettings) {
        settingsMap[item.key] = item.value;
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(settingsMap));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if ((req.method === 'PUT' || req.method === 'POST') && url === '/admin/settings') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const body = await parseJSON(req);
      for (const [key, value] of Object.entries(body)) {
        if (value === undefined || value === null) continue;
        const valStr = String(value);
        const existing = db.select().from(settings).where(eq(settings.key, key)).get();
        if (!existing) {
          db.insert(settings).values({ key, value: valStr }).run();
        } else {
          db.update(settings).set({ value: valStr }).where(eq(settings.key, key)).run();
        }
      }
      logActivity(user.id, 'update_settings', body);
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Settings updated successfully' }));
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
