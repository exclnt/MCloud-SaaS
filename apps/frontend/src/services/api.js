const API_URL = 'http://localhost:3000/api';

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
  getServers: async () => {
    const res = await fetch(`${API_URL}/servers/`, {
      headers: getAuthHeaders()
    });
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
  checkout: async (amount) => {
    const res = await fetch(`${API_URL}/payments/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }
};
