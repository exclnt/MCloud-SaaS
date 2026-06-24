import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { db } from '../../../../database/db.js';
import { servers } from '../../../../database/schema.js';
import { desc, eq } from 'drizzle-orm';

const execAsync = promisify(exec);

const START_PORT = 19132;

export const getNextPort = () => {
  const latestServer = db.select().from(servers).orderBy(desc(servers.port)).get();
  if (latestServer && latestServer.port) {
    return latestServer.port + 1;
  }
  return START_PORT;
};

export const createContainer = async (userId, serverName) => {
  const port = getNextPort();
  const containerName = `mcloud_${userId}_${port}`;
  
  // Docker run command for Bedrock server
  const cmd = `docker run -d -e EULA=TRUE -p ${port}:19132/udp --memory="2g" --name ${containerName} itzg/minecraft-bedrock-server`;
  
  try {
    await execAsync(cmd);
    
    // Save to DB
    const newServer = db.insert(servers).values({
      userId,
      name: serverName,
      status: 'running',
      ip: '127.0.0.1',
      port,
      memoryLimit: '2g'
    }).returning().get();
    
    return newServer;
  } catch (error) {
    console.error(`Failed to create container: ${error.message}`);
    throw error;
  }
};

export const stopContainer = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  await execAsync(`docker stop ${containerName}`);
  
  db.update(servers).set({ status: 'stopped' }).where(eq(servers.id, server.id)).run();
  return { message: 'Server stopped' };
};

export const startContainer = async (port) => {
  const server = db.select().from(servers).where(eq(servers.port, port)).get();
  if (!server) throw new Error('Server not found');
  
  const containerName = `mcloud_${server.userId}_${port}`;
  await execAsync(`docker start ${containerName}`);
  
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
