import http from 'node:http';
import { parseJSON } from './utils/parser.js';
import { verifyToken } from '../../auth-service/src/utils/jwt.js';
import { createContainer, startContainer, stopContainer, restartContainer } from './services/dockerService.js';
import { db } from '../../../database/db.js';
import { servers } from '../../../database/schema.js';
import { eq } from 'drizzle-orm';

const PORT = 3003;

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

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const url = req.url;

  if (req.method === 'GET' && url === '/') {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    try {
      const userServers = db.select().from(servers).where(eq(servers.userId, user.id)).all();
      res.statusCode = 200;
      return res.end(JSON.stringify(userServers));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url === '/create') {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    try {
      const body = await parseJSON(req);
      const serverName = body.name || `Server_${user.username}_${Date.now()}`;
      const newServer = await createContainer(user.id, serverName);
      res.statusCode = 201;
      return res.end(JSON.stringify(newServer));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/start$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)\/start$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const result = await startContainer(port);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/stop$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)\/stop$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const result = await stopContainer(port);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/restart$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)\/restart$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const result = await restartContainer(port);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Provisioning Service is running on http://localhost:${PORT}`);
});
