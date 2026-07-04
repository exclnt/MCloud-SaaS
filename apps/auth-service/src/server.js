import http from 'node:http';
import bcrypt from 'bcrypt';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { db } from '../../../database/db.js';
import { users, activity_logs, transactions, servers, settings } from '../../../database/schema.js';
import { parseJSON } from './utils/parser.js';
import { generateToken, verifyToken } from './utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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

const PORT = parseInt(process.env.AUTH_SERVICE_PORT || 3001);
const HOST = process.env.AUTH_SERVICE_HOST || 'localhost';

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && (req.url === '/health' || req.url === '/api/auth/health')) {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'ONLINE',
      service: 'auth-service',
      port: PORT,
      uptime: process.uptime(),
      timestamp: Date.now()
    }));
  }

  if (req.method === 'POST' && req.url === '/register') {
    try {
      const modeObj = db.select().from(settings).where(eq(settings.key, 'maintenance_mode')).get();
      if (modeObj && modeObj.value === 'true') {
        res.statusCode = 503;
        return res.end(JSON.stringify({ error: 'Sistem sedang dalam mode pemeliharaan. Pendaftaran akun baru ditutup sementara.' }));
      }

      const body = await parseJSON(req);
      const { email, username, password } = body;

      if (!email || !username || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Email, username, and password are required' }));
      }

      // Check if user exists
      const existingUser = db.select().from(users).where(eq(users.username, username)).get();
      if (existingUser) {
        res.statusCode = 409;
        return res.end(JSON.stringify({ error: 'Username already exists' }));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const role = username === 'admin' ? 'admin' : 'user';
      const newUser = db.insert(users).values({
        email,
        username,
        password: hashedPassword,
        role
      }).returning().get();

      logActivity(newUser.id, 'register');

      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'User registered successfully', userId: newUser.id, role }));
    } catch (error) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
  }

  if (req.method === 'POST' && req.url === '/login') {
    try {
      const body = await parseJSON(req);
      const { username, password } = body;

      const user = db.select().from(users).where(eq(users.username, username)).get();
      if (!user) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }

      const modeObj = db.select().from(settings).where(eq(settings.key, 'maintenance_mode')).get();
      if (modeObj && modeObj.value === 'true' && user.role !== 'admin') {
        res.statusCode = 503;
        return res.end(JSON.stringify({ error: 'Sistem sedang dalam mode pemeliharaan. Akses login saat ini HANYA terbuka untuk Administrator Sistem.' }));
      }

      logActivity(user.id, 'login');

      const token = generateToken({ id: user.id, username: user.username, email: user.email, role: user.role });
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Login successful', token, role: user.role }));
    } catch (error) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
  }

  if (req.method === 'PUT' && (req.url === '/update-profile' || req.url === '/update-password')) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Invalid token' }));
    }

    try {
      const body = await parseJSON(req);
      const user = db.select().from(users).where(eq(users.id, decoded.id)).get();
      if (!user) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'User not found' }));
      }

      if (req.url === '/update-profile') {
        const { username, email } = body;
        db.update(users).set({ username, email }).where(eq(users.id, decoded.id)).run();
        logActivity(user.id, 'update_profile', { username, email });
        
        const newToken = generateToken({ id: user.id, username, email, role: user.role });
        res.statusCode = 200;
        return res.end(JSON.stringify({ message: 'Profile updated', token: newToken, role: user.role }));
      } 
      
      if (req.url === '/update-password') {
        const { currentPassword, newPassword } = body;
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Kata sandi saat ini salah' }));
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        db.update(users).set({ password: hashed }).where(eq(users.id, decoded.id)).run();
        logActivity(user.id, 'update_password');
        res.statusCode = 200;
        return res.end(JSON.stringify({ message: 'Password updated' }));
      }
    } catch (error) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  if (req.method === 'GET' && req.url === '/admin/users') {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const allUsers = db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt
      }).from(users).all();
      res.statusCode = 200;
      return res.end(JSON.stringify({ users: allUsers }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  if (req.method === 'POST' && req.url === '/admin/users') {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const body = await parseJSON(req);
      const { email, username, password, role = 'user' } = body;
      if (!email || !username || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Email, username, and password are required' }));
      }
      const existingUser = db.select().from(users).where(eq(users.username, username)).get();
      if (existingUser) {
        res.statusCode = 409;
        return res.end(JSON.stringify({ error: 'Username already exists' }));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = db.insert(users).values({
        email,
        username,
        password: hashedPassword,
        role: username === 'admin' ? 'admin' : role
      }).returning().get();
      logActivity(decoded.id, 'admin_create_user', { createdUserId: newUser.id, username });
      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt } }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  if (req.method === 'PUT' && req.url.startsWith('/admin/users/')) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    const targetId = parseInt(req.url.split('/admin/users/')[1]);
    if (isNaN(targetId)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Invalid user ID' }));
    }
    try {
      const body = await parseJSON(req);
      const { email, username, role, password } = body;
      const targetUser = db.select().from(users).where(eq(users.id, targetId)).get();
      if (!targetUser) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'User not found' }));
      }
      const updateData = {};
      if (email !== undefined) updateData.email = email;
      if (username !== undefined) updateData.username = username;
      if (role !== undefined) updateData.role = role;
      if (password && password.trim() !== '') {
        updateData.password = await bcrypt.hash(password, 10);
      }
      db.update(users).set(updateData).where(eq(users.id, targetId)).run();
      logActivity(decoded.id, 'admin_update_user', { targetUserId: targetId, updates: { email, username, role, passwordChanged: !!password } });
      const updatedUser = db.select({ id: users.id, username: users.username, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).where(eq(users.id, targetId)).get();
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'User updated successfully', user: updatedUser }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  if (req.method === 'DELETE' && req.url.startsWith('/admin/users/')) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    const targetId = parseInt(req.url.split('/admin/users/')[1]);
    if (isNaN(targetId)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Invalid user ID' }));
    }
    if (targetId === decoded.id) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Cannot delete your own admin account' }));
    }
    try {
      try {
        const provisioningUrl = process.env.PROVISIONING_SERVICE_URL || 'http://localhost:3003';
        await fetch(`${provisioningUrl}/admin/users/${targetId}/cleanup`, {
          method: 'POST',
          headers: { Authorization: authHeader }
        });
      } catch (cleanErr) {
        console.error("Failed to cleanup docker servers for user:", cleanErr.message);
      }
      
      db.delete(activity_logs).where(eq(activity_logs.userId, targetId)).run();
      db.delete(transactions).where(eq(transactions.userId, targetId)).run();
      db.delete(users).where(eq(users.id, targetId)).run();
      
      logActivity(decoded.id, 'admin_delete_user', { targetUserId: targetId });
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'User deleted successfully' }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`Auth Service is running on http://${HOST}:${PORT}`);
});
