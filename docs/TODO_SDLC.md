# 📋 TODO_SDLC.md (Microservices + SQLite + Drizzle ORM)

## Fase 1: Local Environment, Monorepo & Database Setup

- [x] 1.1 Install Node.js dan Docker Desktop lokal.
- [x] 1.2 Inisialisasi _root_ Monorepo (buat `package.json` dengan _script_ `concurrently`).
- [x] 1.3 Setup folder `database/`. Install `drizzle-orm`, `drizzle-kit`, dan `better-sqlite3`.
- [x] 1.4 Buat `schema.js` (tabel `users`, `servers`, `transactions`) dan jalankan migrasi Drizzle untuk men-generate `sqlite.db`.
- [x] 1.5 Setup folder `apps/` dan inisialisasi `package.json` untuk 4 backend service dan 1 frontend.

## Fase 2: API Gateway & Auth Service

- [x] 2.1 Buat `auth-service` (Port 3001) dengan Native HTTP untuk Register, Login, & JWT. Konek ke `sqlite.db` via Drizzle.
- [x] 2.2 Buat `api-gateway` (Port 3000) sebagai _reverse proxy_ manual yang meneruskan _request_ `/api/auth` ke `auth-service`.
- [x] 2.3 Tes _flow_ Register & Login via API Gateway (Postman / cURL).

## Fase 3: Provisioning Service (Docker)

- [ ] 3.1 Buat `provisioning-service` (Port 3003) dengan `child_process.exec` untuk _run/stop/restart_ Docker.
- [ ] 3.2 Bikin logika _auto-assign_ UDP Port (cek port terakhir via Drizzle ORM) pada `provisioning-service`.
- [ ] 3.3 Tambahkan _routing_ `/api/servers` di `api-gateway` untuk diteruskan ke `provisioning-service`.

## Fase 4: Payment Service & Automation

- [ ] 4.1 Buat `payment-service` (Port 3002) untuk generate Midtrans Snap Token (`POST /checkout`) & insert ke tabel `transactions`.
- [ ] 4.2 Setup ngrok di port 3000 dan routing Webhook di `api-gateway` (`/api/payments/webhook`) menuju `payment-service`.
- [ ] 4.3 Buat sistem komunikasi internal: Saat Webhook sukses di `payment-service`, kirim internal HTTP request ke `provisioning-service` untuk men-trigger pembuatan container Docker.

## Fase 5: Frontend Dashboard

- [ ] 5.1 Bikin UI Login & Register (konek ke `http://localhost:3000/api/auth`).
- [ ] 5.2 Bikin UI Dashboard List Server & Kontrol (konek ke `http://localhost:3000/api/servers`).
- [ ] 5.3 Bikin UI Checkout & Integrasi Snap Midtrans (konek ke `http://localhost:3000/api/checkout`).

## Fase 6: Final E2E Test Lokal

- [ ] 6.1 Jalankan `npm run dev` dari _root_ untuk menyalakan API Gateway, semua Microservices, dan Frontend secara bersamaan.
- [ ] 6.2 Test Full Flow: Register -> Beli -> Simulasi bayar Midtrans -> Webhook ngrok -> Docker nyala -> Main Minecraft via `127.0.0.1:PORT_DINAMIS`.
