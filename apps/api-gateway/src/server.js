import http from 'node:http';

const PORT = 3000;

const routes = {
  '/api/auth': { targetHost: 'localhost', targetPort: 3001, stripPrefix: '/api/auth' },
  '/api/servers': { targetHost: 'localhost', targetPort: 3003, stripPrefix: '/api/servers' },
  '/api/payments': { targetHost: 'localhost', targetPort: 3002, stripPrefix: '/api/payments' },
  '/api/plans': { targetHost: 'localhost', targetPort: 3002, stripPrefix: '/api' },
  '/api/admin/users': { targetHost: 'localhost', targetPort: 3001, stripPrefix: '/api' },
  '/api/admin/servers': { targetHost: 'localhost', targetPort: 3003, stripPrefix: '/api' },
  '/api/admin/logs': { targetHost: 'localhost', targetPort: 3003, stripPrefix: '/api' },
  '/api/admin/plans': { targetHost: 'localhost', targetPort: 3002, stripPrefix: '/api' },
  '/api/admin/resource-pool': { targetHost: 'localhost', targetPort: 3002, stripPrefix: '/api' },
  '/api/admin/transactions': { targetHost: 'localhost', targetPort: 3002, stripPrefix: '/api' },
  '/api/transactions': { targetHost: 'localhost', targetPort: 3002, stripPrefix: '/api' }
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  let matchedRoute = null;
  let targetConfig = null;

  for (const [prefix, config] of Object.entries(routes)) {
    if (req.url.startsWith(prefix)) {
      matchedRoute = prefix;
      targetConfig = config;
      break;
    }
  }

  if (matchedRoute) {
    let targetPath = req.url;
    if (targetConfig.stripPrefix) {
      targetPath = targetPath.replace(targetConfig.stripPrefix, '');
    }
    if (!targetPath) targetPath = '/';
    
    const proxyOptions = {
      hostname: targetConfig.targetHost,
      port: targetConfig.targetPort,
      path: targetPath,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(proxyOptions, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error(`API Gateway proxy error: ${err.message}`);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad Gateway', details: err.message }));
    });

    req.pipe(proxyReq, { end: true });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Gateway route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
