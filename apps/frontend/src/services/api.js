const API_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  register: async (username, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  createServer: async (config) => {
    const res = await fetch(`${API_URL}/servers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getServers: async () => {
    const res = await fetch(`${API_URL}/servers`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getPublicServers: async () => {
    const res = await fetch(`${API_URL}/servers/public`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  startServer: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/start`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },
  stopServer: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/stop`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },
  restartServer: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/restart`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },
  checkout: async (amount, config = {}) => {
    const res = await fetch(`${API_URL}/payments/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, config })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  deleteServer: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getServerLogs: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/logs`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getServerStats: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/stats`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  updateServerConfig: async (port, config) => {
    const res = await fetch(`${API_URL}/servers/${port}/config`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getOnlinePlayers: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/players`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  sendCommand: async (port, command) => {
    const res = await fetch(`${API_URL}/servers/${port}/command`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ command })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  banPlayer: async (port, playerName) => {
    const res = await fetch(`${API_URL}/servers/${port}/ban`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ playerName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getFiles: async (port, path = '') => {
    const res = await fetch(`${API_URL}/servers/${port}/files?path=${encodeURIComponent(path)}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  readFile: async (port, path) => {
    const res = await fetch(`${API_URL}/servers/${port}/files/read?path=${encodeURIComponent(path)}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  writeFile: async (port, path, content) => {
    const res = await fetch(`${API_URL}/servers/${port}/files/write`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ path, content })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  deleteFile: async (port, path) => {
    const res = await fetch(`${API_URL}/servers/${port}/files/delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ path })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  uploadFile: async (port, path, file) => {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('file', file);
    
    // Omit Content-Type header so the browser sets it to multipart/form-data with boundary
    const headers = getAuthHeaders();
    delete headers['Content-Type'];

    const res = await fetch(`${API_URL}/servers/${port}/files/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }
};
