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
  register: async (email, username, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  updateProfile: async (data) => {
    const res = await fetch(`${API_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    return result;
  },
  updatePassword: async (data) => {
    const res = await fetch(`${API_URL}/auth/update-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    return result;
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  stopServer: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/stop`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  restartServer: async (port) => {
    const res = await fetch(`${API_URL}/servers/${port}/restart`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
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
  },
  // Admin Endpoints
  getAdminStats: async () => {
    const res = await fetch(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getAllUsers: async () => {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getAllServers: async () => {
    const res = await fetch(`${API_URL}/admin/servers`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getActivityLogs: async () => {
    const res = await fetch(`${API_URL}/admin/logs`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getPlans: async () => {
    const res = await fetch(`${API_URL}/plans`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  updatePlan: async (planId, config) => {
    const res = await fetch(`${API_URL}/admin/plans/${planId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getResourcePool: async () => {
    const res = await fetch(`${API_URL}/admin/resource-pool`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  updateResourcePool: async (totalRamMB) => {
    const res = await fetch(`${API_URL}/admin/resource-pool`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ totalRamMB })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  createAdminUser: async (userData) => {
    const res = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  },
  updateAdminUser: async (userId, userData) => {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data;
  },
  deleteAdminUser: async (userId) => {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
    return data;
  },
  createAdminServer: async (serverData) => {
    const res = await fetch(`${API_URL}/admin/servers/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(serverData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create server');
    return data;
  },
  extendAdminServer: async (serverId, days) => {
    const res = await fetch(`${API_URL}/admin/servers/${serverId}/extend`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ days })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to extend server');
    return data;
  },
  getUserTransactions: async () => {
    const res = await fetch(`${API_URL}/transactions`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user transactions');
    return data;
  },
  getTransaction: async (id) => {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch transaction detail');
    return data;
  },
  syncTransaction: async (id) => {
    const res = await fetch(`${API_URL}/transactions/${id}/sync`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sync transaction status');
    return data;
  },
  getAdminTransactions: async () => {
    const res = await fetch(`${API_URL}/admin/transactions`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin transactions');
    return data;
  },
  getSettings: async () => {
    const res = await fetch(`${API_URL}/settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data;
  },
  updateSettings: async (settingsData) => {
    const res = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  }
};
