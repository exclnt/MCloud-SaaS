import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import { db } from '../../../../database/db.js';
import { servers } from '../../../../database/schema.js';
import { desc, eq } from 'drizzle-orm';

const execAsync = promisify(exec);

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
};

const START_PORT = 19132;

export const getNextPort = () => {
  const latestServer = db.select().from(servers).orderBy(desc(servers.port)).get();
  if (latestServer && latestServer.port) {
    return latestServer.port + 1;
  }
  return START_PORT;
};

export const createContainer = async (userId, config) => {
  const port = getNextPort();
  const containerName = `mcloud_${userId}_${port}`;
  const localIp = getLocalIp();
  
  let expiresAtVal = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  if (config.expiresAt === null || config.permanent === true || config.duration === 'permanent') {
    expiresAtVal = null;
  } else if (config.days || config.durationDays) {
    const daysToAdd = parseInt(config.days || config.durationDays);
    expiresAtVal = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
  } else if (config.expiresAt) {
    expiresAtVal = new Date(config.expiresAt);
  }

  // Simpan ke DB dulu dengan status 'error' sebagai langkah pengaman
  const newServer = db.insert(servers).values({
    userId,
    name: config.name,
    status: 'error',
    ip: localIp,
    port,
    memoryLimit: config.memoryLimit || '500m',
    version: config.version || 'latest',
    seed: config.seed || '',
    difficulty: config.difficulty || 'easy',
    gamemode: config.gamemode || 'survival',
    expiresAt: expiresAtVal
  }).returning().get();
  
  const memLimit = config.memoryLimit || '500m';
  const cmd = `docker run -d -e EULA=TRUE -e SERVER_ALLOW_LIST=false -e SERVER_WHITE_LIST=false -p ${port}:19132/udp -v mcloud_${userId}_${port}_data:/data -e VERSION="${newServer.version}" -e SERVER_NAME="${newServer.name}" -e LEVEL_SEED="${newServer.seed}" -e DIFFICULTY="${newServer.difficulty}" -e GAMEMODE="${newServer.gamemode}" --memory="${memLimit}" --name ${containerName} itzg/minecraft-bedrock-server`;
  
  try {
    await execAsync(cmd);
    
    // Auto-setup UFW firewall rule for the port
    try {
      await execAsync(`sudo -n ufw allow ${port}/udp`);
    } catch (fwErr) {
      console.warn(`Failed to set ufw rule: ${fwErr.message}`);
    }
    
    // Jika sukses, update status ke running
    db.update(servers).set({ status: 'running' }).where(eq(servers.id, newServer.id)).run();
    newServer.status = 'running';
    return newServer;
  } catch (error) {
    console.error(`Failed to create container: ${error.message}`);
    // Status tetap 'error' di DB, namun kita kembalikan servernya agar muncul di UI pengguna
    return newServer;
  }
};

export const stopContainer = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  try {
    await execAsync(`docker stop ${containerName}`);
  } catch (e) {
    console.warn(`Docker stop failed: ${e.message}`);
  }
  
  db.update(servers).set({ status: 'stopped' }).where(eq(servers.id, server.id)).run();
  return { message: 'Server stopped' };
};

export const startContainer = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  
  try {
    await execAsync(`docker start ${containerName}`);
  } catch (e) {
    // Jika gagal karena container belum dibuat sebelumnya, jalankan perintah docker run
    if (e.message.includes('No such container')) {
      const cmd = `docker run -d -e EULA=TRUE -e SERVER_ALLOW_LIST=false -e SERVER_WHITE_LIST=false -p ${port}:19132/udp -v mcloud_${server.userId}_${port}_data:/data -e VERSION="${server.version}" -e SERVER_NAME="${server.name}" -e LEVEL_SEED="${server.seed}" -e DIFFICULTY="${server.difficulty}" -e GAMEMODE="${server.gamemode}" --memory="500m" --name ${containerName} itzg/minecraft-bedrock-server`;
      await execAsync(cmd);
    } else {
      throw e;
    }
  }
  
  db.update(servers).set({ status: 'running' }).where(eq(servers.id, server.id)).run();
  return { message: 'Server started' };
};

export const restartContainer = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  await execAsync(`docker restart ${containerName}`);
  
  db.update(servers).set({ status: 'running' }).where(eq(servers.id, server.id)).run();
  return { message: 'Server restarted' };
};

export const deleteContainer = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  try {
    // Force remove the container and its volumes
    await execAsync(`docker rm -f ${containerName}`);
  } catch (e) {
    console.warn(`Docker rm failed: ${e.message}`);
  }
  
  // Auto-remove UFW firewall rule for the port
  try {
    await execAsync(`sudo -n ufw delete allow ${port}/udp`);
  } catch (fwErr) {
    console.warn(`Failed to remove ufw rule: ${fwErr.message}`);
  }
  
  db.delete(servers).where(eq(servers.id, server.id)).run();
  return { message: 'Server deleted successfully' };
};

export const deleteUserContainers = async (userId) => {
  const userServers = db.select().from(servers).where(eq(servers.userId, userId)).all();
  for (const s of userServers) {
    try {
      await deleteContainer(s.port);
    } catch (err) {
      console.warn(`Failed to delete container for port ${s.port}:`, err.message);
    }
  }
  return { message: `Deleted ${userServers.length} servers for user ${userId}` };
};

export const extendServer = async (serverId, days) => {
  const server = db.select().from(servers).where(eq(servers.id, serverId)).get();
  if (!server) throw new Error('Server not found');
  
  let newExpires = null;
  if (days === null || days === 'permanent' || days === 0) {
    newExpires = null;
  } else {
    const baseDate = server.expiresAt && new Date(server.expiresAt) > new Date() ? new Date(server.expiresAt) : new Date();
    newExpires = new Date(baseDate.getTime() + parseInt(days) * 24 * 60 * 60 * 1000);
  }
  db.update(servers).set({ expiresAt: newExpires }).where(eq(servers.id, serverId)).run();
  const updated = db.select().from(servers).where(eq(servers.id, serverId)).get();
  return updated;
};

export const syncServerStatuses = async (userServers) => {
  if (!userServers || userServers.length === 0) return userServers;
  
  try {
    const { stdout } = await execAsync('docker ps --format "{{.Names}}"');
    const runningContainers = stdout.split('\n').map(name => name.trim()).filter(Boolean);
    
    for (const server of userServers) {
      const containerName = `mcloud_${server.userId}_${server.port}`;
      const isRunning = runningContainers.includes(containerName);
      
      if (isRunning && server.status !== 'running') {
        db.update(servers).set({ status: 'running' }).where(eq(servers.id, server.id)).run();
        server.status = 'running';
      } else if (!isRunning && server.status === 'running') {
        db.update(servers).set({ status: 'stopped' }).where(eq(servers.id, server.id)).run();
        server.status = 'stopped';
      }
    }
    return userServers;
  } catch (e) {
    // Jangan spam terminal dengan log panjang, cukup beri peringatan singkat
    console.warn('Docker daemon is unreachable. Marking all running servers as error.');
    
    // Jika Docker Desktop mati total, berarti semua server dipastikan ikut mati
    for (const server of userServers) {
      if (server.status === 'running') {
        db.update(servers).set({ status: 'error' }).where(eq(servers.id, server.id)).run();
        server.status = 'error';
      }
    }
    return userServers;
  }
};

export const getServerLogs = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  try {
    const { stdout, stderr } = await execAsync(`docker logs --tail 100 ${containerName}`);
    return stdout + stderr;
  } catch (e) {
    return 'Failed to fetch logs: ' + e.message;
  }
};

export const getServerStats = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  if (server.status !== 'running') return { memory: 0, cpu: 0, disk: 0 };
  
  const containerName = `mcloud_${server.userId}_${port}`;
  try {
    const { stdout } = await execAsync(`docker stats --no-stream --format '{"memory":"{{.MemUsage}}","cpu":"{{.CPUPerc}}"}' ${containerName}`);
    const raw = JSON.parse(stdout);
    
    // Parse memory (e.g. "374.7MiB / 500MiB" or "500KiB / 500MiB")
    let memoryVal = 0;
    if (raw.memory) {
      const memStr = raw.memory.split(' / ')[0];
      const val = parseFloat(memStr);
      if (memStr.includes('GiB')) memoryVal = val * 1024;
      else if (memStr.includes('MiB')) memoryVal = val;
      else if (memStr.includes('KiB')) memoryVal = val / 1024;
      else if (memStr.includes('B')) memoryVal = val / (1024 * 1024);
    }
    
    // Parse cpu (e.g. "5.76%")
    let cpuVal = 0;
    if (raw.cpu) {
      cpuVal = parseFloat(raw.cpu.replace('%', ''));
    }
    
    return { memory: memoryVal, cpu: cpuVal, disk: 0 };
  } catch (e) {
    return { memory: 0, cpu: 0, disk: 0 };
  }
};

export const rebuildContainer = async (port, config) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const updatedConfig = {
    name: config.name !== undefined ? config.name : server.name,
    seed: config.seed !== undefined ? config.seed : server.seed,
    difficulty: config.difficulty !== undefined ? config.difficulty : server.difficulty,
    gamemode: config.gamemode !== undefined ? config.gamemode : server.gamemode,
    visibility: config.visibility !== undefined ? config.visibility : server.visibility,
    tags: config.tags !== undefined ? config.tags : server.tags,
    motd: config.motd !== undefined ? config.motd : server.motd
  };

  db.update(servers).set(updatedConfig).where(eq(servers.id, server.id)).run();

  const needsRebuild = config.name !== undefined || config.seed !== undefined || config.difficulty !== undefined || config.gamemode !== undefined;
  
  if (!needsRebuild) {
    return { message: 'Server metadata updated (no restart needed)' };
  }
  
  const containerName = `mcloud_${server.userId}_${port}`;
  
  try {
    await execAsync(`docker rm -f ${containerName}`);
  } catch (e) {}
  
  const cmd = `docker run -d -e EULA=TRUE -e SERVER_ALLOW_LIST=false -e SERVER_WHITE_LIST=false -p ${port}:19132/udp -v mcloud_${server.userId}_${port}_data:/data -e VERSION="${server.version}" -e SERVER_NAME="${updatedConfig.name}" -e LEVEL_SEED="${updatedConfig.seed}" -e DIFFICULTY="${updatedConfig.difficulty}" -e GAMEMODE="${updatedConfig.gamemode}" --memory="${server.memoryLimit || '500m'}" --name ${containerName} itzg/minecraft-bedrock-server`;
  await execAsync(cmd);
  
  db.update(servers).set({ status: 'running' }).where(eq(servers.id, server.id)).run();
  return { message: 'Server rebuilt with new settings' };
};

export const sendServerCommand = async (port, commandString) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server || server.status !== 'running') throw new Error('Server not running');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  try {
    // Escape quotes in commandString
    const safeCmd = commandString.replace(/"/g, '\\"');
    await execAsync(`docker exec ${containerName} send-command "${safeCmd}"`);
    
    const safeEcho = `> ${commandString}`.replace(/'/g, "'\\''");
    await execAsync(`docker exec ${containerName} sh -c "echo '${safeEcho}' > /proc/1/fd/1"`).catch(() => {});
    
    return { message: 'Command sent' };
  } catch (e) {
    throw new Error('Failed to send command: ' + e.message);
  }
};

export const getOnlinePlayers = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server || server.status !== 'running') return [];

  const containerName = `mcloud_${server.userId}_${port}`;
  try {
    // Force a "list" command to the server so it outputs the current players to the log
    await execAsync(`docker exec ${containerName} send-command "list"`).catch(() => {});
    
    // Wait for the server to process and print to logs
    await new Promise(r => setTimeout(r, 500));
    
    const { stdout, stderr } = await execAsync(`docker logs --tail 50 ${containerName}`);
    const logs = stdout + stderr;
    const lines = logs.split('\n');
    
    let onlinePlayers = [];
    
    // Look for the last occurrence of "players online:"
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const match = line.match(/players online:\s*(.*)/i);
      if (match) {
        const namesStr = match[1].trim();
        if (namesStr) {
          onlinePlayers = namesStr.split(',').map(n => n.trim()).filter(Boolean);
        }
        break;
      }
    }
    
    // Fallback to connection tracking if the list command output isn't found
    if (onlinePlayers.length === 0 && !logs.includes('players online:')) {
      const { stdout: allStdout, stderr: allStderr } = await execAsync(`docker logs --tail 2000 ${containerName}`);
      const allLogs = allStdout + allStderr;
      const allLines = allLogs.split('\n');
      const activePlayers = new Set();
      for (const line of allLines) {
        const connectMatch = line.match(/Player connected:\s*([^,]+)/);
        if (connectMatch) activePlayers.add(connectMatch[1].trim());
        const disconnectMatch = line.match(/Player disconnected:\s*([^,]+)/);
        if (disconnectMatch) activePlayers.delete(disconnectMatch[1].trim());
      }
      onlinePlayers = Array.from(activePlayers);
    }
    
    return onlinePlayers;
  } catch (e) {
    if (e.message.includes('Docker daemon is unreachable') || e.message.includes('500 Internal Server Error')) {} 
    else console.warn(`Could not fetch players: ${e.message.split('\\n')[0]}`);
    return [];
  }
};

export const banPlayer = async (port, playerName) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');

  // Add to ban list in DB
  // First check if already banned to prevent duplicates
  const { banned_players } = await import('../../../../database/schema.js');
  const { and } = await import('drizzle-orm');
  
  const existing = db.select().from(banned_players).where(
    and(eq(banned_players.serverId, server.id), eq(banned_players.playerName, playerName))
  ).get();

  if (!existing) {
    db.insert(banned_players).values({
      serverId: server.id,
      playerName,
      reason: "Banned by admin"
    }).run();
  }

  // Kick immediately if online
  if (server.status === 'running') {
    await sendServerCommand(port, `kick "${playerName}" "You have been banned."`);
  }
  
  return { message: `${playerName} has been banned` };
};

export const listFiles = async (port, path = '') => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');

  const safePath = path.replace(/[^a-zA-Z0-9\-_./]/g, '');
  if (safePath.includes('..')) throw new Error('Invalid path');

  const volumeName = `mcloud_${server.userId}_${port}_data`;
  
  try {
    const cmd = `docker run --rm -v ${volumeName}:/data alpine sh -c "ls -lp /data/${safePath}"`;
    const { stdout } = await execAsync(cmd);
    
    const lines = stdout.trim().split('\n');
    const files = [];
    
    for (const line of lines) {
      if (line.startsWith('total ') || line.trim() === '') continue;
      
      const parts = line.split(/\s+/);
      if (parts.length >= 9) {
        const type = line[0] === 'd' ? 'directory' : 'file';
        const size = parts[4];
        const name = parts.slice(8).join(' ').replace(/\/$/, '');
        
        files.push({ name, type, size });
      }
    }
    
    return files;
  } catch (e) {
    if (e.message.includes('No such file')) return [];
    throw new Error('Failed to list files: ' + e.message);
  }
};

export const readFile = async (port, path) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');

  const safePath = path.replace(/[^a-zA-Z0-9\-_./]/g, '');
  if (safePath.includes('..')) throw new Error('Invalid path');

  const volumeName = `mcloud_${server.userId}_${port}_data`;
  try {
    const cmd = `docker run --rm -v ${volumeName}:/data alpine cat /data/${safePath}`;
    const { stdout } = await execAsync(cmd);
    return { content: stdout };
  } catch (e) {
    throw new Error('Failed to read file: ' + e.message);
  }
};

export const writeFile = async (port, path, content) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');

  const safePath = path.replace(/[^a-zA-Z0-9\-_./]/g, '');
  if (safePath.includes('..')) throw new Error('Invalid path');

  const volumeName = `mcloud_${server.userId}_${port}_data`;
  try {
    const base64Content = Buffer.from(content).toString('base64');
    const cmd = `docker run --rm -v ${volumeName}:/data alpine sh -c "echo '${base64Content}' | base64 -d > /data/${safePath}"`;
    await execAsync(cmd);
    return { message: 'File saved successfully' };
  } catch (e) {
    throw new Error('Failed to write file: ' + e.message);
  }
};

export const deleteFile = async (port, path) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');

  const safePath = path.replace(/[^a-zA-Z0-9\-_./]/g, '');
  if (safePath.includes('..')) throw new Error('Invalid path');

  const volumeName = `mcloud_${server.userId}_${port}_data`;
  try {
    const cmd = `docker run --rm -v ${volumeName}:/data alpine rm -rf /data/${safePath}`;
    await execAsync(cmd);
    return { message: 'File deleted successfully' };
  } catch (e) {
    throw new Error('Failed to delete file: ' + e.message);
  }
};

export const uploadFileToVolume = async (port, path, filePath, filename) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');

  const safePath = path.replace(/[^a-zA-Z0-9\-_./]/g, '');
  if (safePath.includes('..')) throw new Error('Invalid path');

  const volumeName = `mcloud_${server.userId}_${port}_data`;
  
  try {
    const isZip = filename.endsWith('.zip') || filename.endsWith('.mcworld');
    
    if (isZip) {
      // Create a temporary container, mount volume, and bind mount the local file
      const cmd = `docker run --rm -v ${volumeName}:/data -v "${filePath}":/tmp/upload.zip alpine sh -c "unzip -o /tmp/upload.zip -d /data/${safePath} || true"`;
      await execAsync(cmd);
      return { message: 'World extracted successfully' };
    } else {
      // Just copy the file directly
      const cmd = `docker run --rm -v ${volumeName}:/data -v "${filePath}":/tmp/upload_file alpine sh -c "cp /tmp/upload_file /data/${safePath}/${filename}"`;
      await execAsync(cmd);
      return { message: 'File uploaded successfully' };
    }
  } catch (e) {
    throw new Error('Failed to upload/extract file: ' + e.message);
  }
};
