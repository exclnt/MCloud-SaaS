import http from 'node:http';
import { parseJSON } from './utils/parser.js';
import { verifyToken } from '../../auth-service/src/utils/jwt.js';
import { createContainer, startContainer, stopContainer, restartContainer, deleteContainer, deleteUserContainers, extendServer, syncServerStatuses, getServerLogs, getServerStats, rebuildContainer } from './services/dockerService.js';
import { db } from '../../../database/db.js';
import { servers, users, activity_logs, transactions } from '../../../database/schema.js';
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

  if (req.method === 'GET' && url === '/admin/servers') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const allServers = db.select({
        id: servers.id,
        name: servers.name,
        status: servers.status,
        ip: servers.ip,
        port: servers.port,
        memoryLimit: servers.memoryLimit,
        owner: users.username,
        userId: servers.userId,
        createdAt: servers.createdAt,
        expiresAt: servers.expiresAt
      }).from(servers).leftJoin(users, eq(servers.userId, users.id)).all();
      
      const syncedServers = await syncServerStatuses(allServers);
      res.statusCode = 200;
      return res.end(JSON.stringify(syncedServers));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url === '/admin/servers/create') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const body = await parseJSON(req);
      const targetUserId = body.userId || body.targetUserId;
      if (!targetUserId) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'targetUserId is required' }));
      }
      if (!body.name) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Server name is required' }));
      }
      const newServer = await createContainer(parseInt(targetUserId), body);
      logActivity(user.id, 'admin_create_server', { targetUserId, serverId: newServer.id, name: body.name, status: 'success' });
      try {
        db.insert(transactions).values({
          userId: parseInt(targetUserId),
          amount: 0,
          status: 'admin_manual',
          config: JSON.stringify({
            type: 'admin_create',
            serverName: body.name,
            memoryLimit: body.memoryLimit || '1g',
            days: body.days || 30,
            adminUsername: user.username,
            note: 'Server dibuat secara manual oleh Admin'
          })
        }).run();
      } catch (err) {
        console.error('Failed to log transaction for admin create server:', err.message);
      }
      res.statusCode = 201;
      return res.end(JSON.stringify(newServer));
    } catch (e) {
      logActivity(user.id, 'admin_create_server_failed', { targetUserId: body?.userId || body?.targetUserId, name: body?.name, error: e.message, status: 'failed' });
      try {
        if (body?.userId || body?.targetUserId) {
          db.insert(transactions).values({
            userId: parseInt(body.userId || body.targetUserId),
            amount: 0,
            status: 'failed',
            config: JSON.stringify({
              type: 'admin_create',
              serverName: body?.name || 'Unknown Server',
              adminUsername: user.username,
              note: `Gagal membuat server oleh Admin: ${e.message}`
            })
          }).run();
        }
      } catch (err) {
        console.error('Failed to log failed transaction for admin create:', err.message);
      }
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'PUT' && url.match(/^\/admin\/servers\/(\d+)\/extend$/)) {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    const match = url.match(/^\/admin\/servers\/(\d+)\/extend$/);
    const serverId = parseInt(match[1]);
    try {
      const body = await parseJSON(req);
      const updated = await extendServer(serverId, body.days);
      logActivity(user.id, 'admin_extend_server', { serverId, days: body.days, status: 'success' });
      try {
        db.insert(transactions).values({
          userId: updated.userId,
          amount: 0,
          status: 'admin_manual',
          config: JSON.stringify({
            type: 'admin_extend',
            serverId: serverId,
            serverName: updated.name,
            days: body.days,
            adminUsername: user.username,
            note: `Masa aktif diperpanjang (${body.days} hari / permanen) oleh Admin`
          })
        }).run();
      } catch (err) {
        console.error('Failed to log transaction for admin extend server:', err.message);
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(updated));
    } catch (e) {
      logActivity(user.id, 'admin_extend_server_failed', { serverId, error: e.message, status: 'failed' });
      try {
        const srvRecord = db.select().from(servers).where(eq(servers.id, serverId)).get();
        if (srvRecord) {
          db.insert(transactions).values({
            userId: srvRecord.userId,
            amount: 0,
            status: 'failed',
            config: JSON.stringify({
              type: 'admin_extend',
              serverId: serverId,
              serverName: srvRecord.name,
              adminUsername: user.username,
              note: `Gagal perpanjang server oleh Admin: ${e.message}`
            })
          }).run();
        }
      } catch (err) {
        console.error('Failed to log failed transaction for admin extend:', err.message);
      }
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'POST' && url.match(/^\/admin\/(?:users|servers\/user)\/(\d+)\/cleanup$/)) {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    const match = url.match(/^\/admin\/(?:users|servers\/user)\/(\d+)\/cleanup$/);
    const targetUserId = parseInt(match[1]);
    try {
      const result = await deleteUserContainers(targetUserId);
      logActivity(user.id, 'admin_cleanup_user_containers', { targetUserId, status: 'success' });
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      logActivity(user.id, 'admin_cleanup_user_containers_failed', { targetUserId, error: e.message, status: 'failed' });
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (req.method === 'GET' && url === '/admin/logs') {
    const user = authMiddleware(req, res);
    if (!user || user.role !== 'admin') {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden' }));
    }
    try {
      const logs = db.select({
        id: activity_logs.id,
        action: activity_logs.action,
        details: activity_logs.details,
        createdAt: activity_logs.createdAt,
        username: users.username
      }).from(activity_logs).leftJoin(users, eq(activity_logs.userId, users.id)).orderBy(desc(activity_logs.createdAt)).limit(100).all();
      
      res.statusCode = 200;
      return res.end(JSON.stringify({ logs }));
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
      logActivity(user.id, 'create_server', { serverId: newServer.id, name: body.name, status: 'success' });
      res.statusCode = 201;
      return res.end(JSON.stringify(newServer));
    } catch (e) {
      logActivity(user.id, 'create_server_failed', { name: body?.name, error: e.message, status: 'failed' });
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
      logActivity(user.id, 'start_server', { port, status: 'success' });
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      logActivity(user.id, 'start_server_failed', { port, error: e.message, status: 'failed' });
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
      logActivity(user.id, 'stop_server', { port, status: 'success' });
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      logActivity(user.id, 'stop_server_failed', { port, error: e.message, status: 'failed' });
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
      logActivity(user.id, 'restart_server', { port, status: 'success' });
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      logActivity(user.id, 'restart_server_failed', { port, error: e.message, status: 'failed' });
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
      logActivity(user.id, 'delete_server', { port, status: 'success' });
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    } catch (e) {
      logActivity(user.id, 'delete_server_failed', { port, error: e.message, status: 'failed' });
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
