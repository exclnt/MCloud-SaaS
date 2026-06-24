import http from 'node:http';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../../../database/db.js';
import { users } from '../../../database/schema.js';
import { parseJSON } from './utils/parser.js';
import { generateToken } from './utils/jwt.js';

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST' && req.url === '/register') {
    try {
      const body = await parseJSON(req);
      const { username, password } = body;

      if (!username || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Username and password are required' }));
      }

      // Check if user exists
      const existingUser = db.select().from(users).where(eq(users.username, username)).get();
      if (existingUser) {
        res.statusCode = 409;
        return res.end(JSON.stringify({ error: 'Username already exists' }));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = db.insert(users).values({
        username,
        password: hashedPassword
      }).returning().get();

      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'User registered successfully', userId: newUser.id }));
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

      const token = generateToken({ id: user.id, username: user.username });
      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Login successful', token }));
    } catch (error) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Auth Service is running on http://localhost:${PORT}`);
});
