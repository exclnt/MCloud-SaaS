import http from 'node:http';
import { parseJSON } from './utils/parser.js';
import { verifyToken } from '../../auth-service/src/utils/jwt.js';
import { createContainer, startContainer, stopContainer, restartContainer, deleteContainer, syncServerStatuses, getServerLogs, getServerStats, rebuildContainer } from './services/dockerService.js';
import { db } from '../../../database/db.js';
import { servers } from '../../../database/schema.js';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import fs from 'node:fs';

const upload = multer({ dest: '/tmp/' });

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

  const url = req.url.split('?')[0];

  if (req.method === 'GET' && url === '/') {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    try {
      const userServers = db.select().from(servers).where(eq(servers.userId, user.id)).all();
      const syncedServers = await syncServerStatuses(userServers);
      res.statusCode = 200;
      return res.end(JSON.stringify(syncedServers));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url === '/public') {
    try {
      const publicServersList = db.select().from(servers).where(eq(servers.visibility, 'public')).all();
      const syncedServers = await syncServerStatuses(publicServersList);
      res.statusCode = 200;
      return res.end(JSON.stringify(syncedServers));
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
      if (!body.name) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Server name is required' }));
      }
      
      const newServer = await createContainer(user.id, body);
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

  if (req.method === 'DELETE' && url.match(/^\/(\d+)$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const result = await deleteContainer(port);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url.match(/^\/(\d+)\/logs$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)\/logs$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const logs = await getServerLogs(port);
      res.statusCode = 200;
      return res.end(JSON.stringify({ logs }));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url.match(/^\/(\d+)\/stats$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)\/stats$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const stats = await getServerStats(port);
      res.statusCode = 200;
      return res.end(JSON.stringify(stats));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'PUT' && url.match(/^\/(\d+)\/config$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    
    const portMatch = url.match(/^\/(\d+)\/config$/);
    const port = parseInt(portMatch[1]);
    
    try {
      const body = await parseJSON(req);
      const result = await rebuildContainer(port, body);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url.match(/^\/(\d+)\/players$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/players$/)[1]);
    try {
      const { getOnlinePlayers } = await import('./services/dockerService.js');
      const players = await getOnlinePlayers(port);
      res.statusCode = 200;
      return res.end(JSON.stringify(players));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/command$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/command$/)[1]);
    try {
      const body = await parseJSON(req);
      if (!body.command) throw new Error("Command is required");
      const { sendServerCommand } = await import('./services/dockerService.js');
      const result = await sendServerCommand(port, body.command);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/ban$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/ban$/)[1]);
    try {
      const body = await parseJSON(req);
      if (!body.playerName) throw new Error("Player name is required");
      const { banPlayer } = await import('./services/dockerService.js');
      const result = await banPlayer(port, body.playerName);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url.match(/^\/(\d+)\/files$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/files$/)[1]);
    const path = new URL(req.url, `http://${req.headers.host}`).searchParams.get('path') || '';
    
    try {
      const { listFiles } = await import('./services/dockerService.js');
      const files = await listFiles(port, path);
      res.statusCode = 200;
      return res.end(JSON.stringify(files));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url.match(/^\/(\d+)\/files\/read$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/files\/read$/)[1]);
    const path = new URL(req.url, `http://${req.headers.host}`).searchParams.get('path') || '';
    
    try {
      const { readFile } = await import('./services/dockerService.js');
      const result = await readFile(port, path);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/files\/write$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/files\/write$/)[1]);
    
    try {
      const body = await parseJSON(req);
      const { writeFile } = await import('./services/dockerService.js');
      const result = await writeFile(port, body.path, body.content);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/files\/delete$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/files\/delete$/)[1]);
    
    try {
      const body = await parseJSON(req);
      const { deleteFile } = await import('./services/dockerService.js');
      const result = await deleteFile(port, body.path);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/(\d+)\/files\/upload$/)) {
    const user = authMiddleware(req, res);
    if (!user) return;
    const port = parseInt(url.match(/^\/(\d+)\/files\/upload$/)[1]);
    
    // multer middleware needs standard req/res behavior, wrapping it in a Promise
    await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    try {
      if (!req.file) throw new Error("No file uploaded");
      const path = req.body.path || '';
      const filename = req.file.originalname || 'uploaded_file';
      const filePath = req.file.path;
      
      const { uploadFileToVolume } = await import('./services/dockerService.js');
      const result = await uploadFileToVolume(port, path, filePath, filename);
      
      // cleanup tmp file
      fs.unlinkSync(filePath);
      
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// Auto-Kick Banned Players Loop
setInterval(async () => {
  try {
    const { getOnlinePlayers, sendServerCommand } = await import('./services/dockerService.js');
    const activeServers = db.select().from(servers).where(eq(servers.status, 'running')).all();
    
    for (const server of activeServers) {
      const onlinePlayers = await getOnlinePlayers(server.port);
      if (onlinePlayers.length > 0) {
        // Fetch banned players for this server
        const { banned_players } = await import('../../../database/schema.js');
        const bannedList = db.select().from(banned_players).where(eq(banned_players.serverId, server.id)).all();
        const bannedNames = bannedList.map(b => b.playerName);
        
        for (const player of onlinePlayers) {
          if (bannedNames.includes(player)) {
            console.log(`Auto-kicking banned player ${player} from server ${server.id}`);
            await sendServerCommand(server.port, `kick "${player}" "You are permanently banned from this server."`);
          }
        }
      }
    }
  } catch (e) {
    console.error("Auto-kick loop error:", e);
  }
}, 10000); // Check every 10 seconds

server.listen(PORT, () => {
  console.log(`Provisioning Service is running on http://localhost:${PORT}`);
});
