# STRUCTURE_PROJEK.md (Microservices Monorepo)

```text
bedrock-saas/
├── AGENT.md
├── README.md # Root README (Project Overview & Quick Start)
├── package.json # Root package.json (Runner 'npm run dev')
├── docs/ 
│ ├── PRD.md
│ ├── SETUP.md
│ ├── STRUCTURE_PROJEK.md
│ └── TODO_SDLC.md
│
├── database/ # Folder khusus Drizzle ORM & SQLite
│ ├── schema.js # Definisi tabel (users, servers, transactions)
│ ├── migrate.js # Script untuk run migration
│ ├── db.js # Inisialisasi koneksi better-sqlite3 + Drizzle
│ └── sqlite.db # File database akan otomatis terbuat di sini
│
└── apps/
 ├── api-gateway/ # Port 3000: Routing request ke microservices
 │ ├── package.json
 │ └── src/
 │ └── server.js # Native node:http reverse proxy
 │
 ├── auth-service/ # Port 3001: Register, Login, JWT
 │ ├── package.json
 │ └── src/
 │ ├── utils/ # jwt.js, parser.js
 │ └── server.js # Native node:http (import db dari root/database)
 │
 ├── payment-service/ # Port 3002: Midtrans Webhook & Snap
 │ ├── package.json
 │ └── src/
 │ ├── config/ # midtrans.js
 │ ├── utils/ # parser.js
 │ └── server.js # Native node:http
 │
 ├── provisioning-service/ # Port 3003: Eksekusi Docker & Port Manager
 │ ├── package.json
 │ └── src/
 │ ├── services/ # dockerService.js
 │ ├── utils/ # parser.js
 │ └── server.js # Native node:http
 │
 └── frontend/ # Port 5173: React + Vite + Tailwind
 ├── .env
 ├── package.json
 ├── src/
 │ ├── components/ # UI Card, Buttons
 │ ├── pages/ # Login, Dashboard, Checkout
 │ ├── services/ # API calls ke http://localhost:3000 (Gateway)
 │ └── App.jsx
 └── README.md
```