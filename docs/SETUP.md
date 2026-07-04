# 🚀 MCloud SaaS - Setup & Installation Documentation

Dokumen ini berisi panduan lengkap langkah demi langkah untuk melakukan instalasi, konfigurasi environment, inisialisasi database, serta menjalankan ekosistem mikroservis **MCloud SaaS** di lingkungan pengembangan lokal (*local development*).

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Arsitektur & Pemetaan Port](#2-arsitektur--pemetaan-port)
3. [Langkah Instalasi](#3-langkah-instalasi)
4. [Konfigurasi Environment (.env)](#4-konfigurasi-environment-env)
5. [Inisialisasi & Migrasi Database](#5-inisialisasi--migrasi-database)
6. [Membuat Akun Admin](#6-membuat-akun-admin)
7. [Menjalankan Aplikasi](#7-menjalankan-aplikasi)
8. [Health Check & Debugging](#8-health-check--debugging)
9. [Troubleshooting Umum](#9-troubleshooting-umum)

---

## 1. Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem Anda telah terinstal spesifikasi berikut:

- **Sistem Operasi**: Linux / macOS / Windows (WSL2 disarankan untuk integrasi Docker yang optimal).
- **Node.js**: Versi **v18.x** atau **v20.x** (LTS) ke atas.
- **Package Manager**: `npm` (bawaan Node.js).
- **Docker Engine**: Docker Daemon **wajib berjalan** di latar belakang karena *Provisioning Service* membutuhkan akses ke *Docker socket* untuk membuat dan mengelola kontainer server game.
- **Git**: Untuk manajemen kontrol versi.

---

## 2. Arsitektur & Pemetaan Port

MCloud menggunakan arsitektur monorepo mikroservis berbasis native `node:http` (tanpa framework eksternal berat) dan React + Vite untuk frontend.

| Service | Folder | Port | Deskripsi Tugas |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `apps/api-gateway` | `3000` | *Reverse proxy* utama yang menjembatani Frontend dengan seluruh backend microservices. |
| **Auth Service** | `apps/auth-service` | `3001` | Autentikasi, otorisasi, penerbitan/verifikasi JWT, dan manajemen akun pengguna. |
| **Payment Service** | `apps/payment-service` | `3002` | Integrasi pembayaran Snap Midtrans, *webhook handler*, manajemen transaksi, dan *resource pool*. |
| **Provisioning Service** | `apps/provisioning-service` | `3003` | Orkestrasi kontainer Docker (server Minecraft Bedrock), file manager kontainer, dan sistem tiket. |
| **Frontend App** | `apps/frontend` | `5173` | Antarmuka pengguna berbasis React 19, Vite, dan Tailwind CSS. |

---

## 3. Langkah Instalasi

1. **Clone Repositori Projek**
   ```bash
   git clone <url-repository-anda>
   cd mcloud
   ```

2. **Instalasi Dependensi Root (Backend & Drizzle ORM)**
   Jalankan perintah berikut di folder akar (*root*) projek untuk menginstal dependensi backend dan *tooling* monorepo:
   ```bash
   npm install
   ```

3. **Instalasi Dependensi Frontend**
   Masuk ke folder frontend atau gunakan flag `--prefix` untuk menginstal dependensi React:
   ```bash
   npm install --prefix apps/frontend
   ```
   *Alternatif:*
   ```bash
   cd apps/frontend
   npm install
   cd ../..
   ```

---

## 4. Konfigurasi Environment (.env)

Projek ini menggunakan file konfigurasi terpusat pada akar repositori (`/.env`).

1. **Salin File Template Environment**
   ```bash
   cp .env.example .env
   ```

2. **Penjelasan & Kustomisasi Variabel Lingkungan**
   Buka file `.env` dengan editor teks dan sesuaikan nilainya:

   ```ini
   # --- Application Environment ---
   NODE_ENV=development

   # --- Microservices Ports & Hosts ---
   GATEWAY_HOST=localhost
   GATEWAY_PORT=3000
   GATEWAY_URL=http://localhost:3000

   AUTH_SERVICE_HOST=localhost
   AUTH_SERVICE_PORT=3001
   AUTH_SERVICE_URL=http://localhost:3001

   PAYMENT_SERVICE_HOST=localhost
   PAYMENT_SERVICE_PORT=3002
   PAYMENT_SERVICE_URL=http://localhost:3002

   PROVISIONING_SERVICE_HOST=localhost
   PROVISIONING_SERVICE_PORT=3003
   PROVISIONING_SERVICE_URL=http://localhost:3003

   FRONTEND_HOST=localhost
   FRONTEND_PORT=5173
   FRONTEND_URL=http://localhost:5173

   # --- Database Configuration ---
   # Lokasi file SQLite akan disimpan secara lokal
   DATABASE_URL=./database/sqlite.db

   # --- Security & Authentication (JWT) ---
   # Ganti dengan string rahasia yang kuat dan unik
   JWT_SECRET=mcloud-secret-key-super-secure
   JWT_EXPIRES_IN=24h

   # --- Payment Gateway (Midtrans) ---
   MIDTRANS_IS_PRODUCTION=false
   MIDTRANS_SERVER_KEY=Mid-server-YOUR_SERVER_KEY
   MIDTRANS_CLIENT_KEY=Mid-client-YOUR_CLIENT_KEY

   # --- Provisioning & Docker ---
   # Akses socket Docker untuk komunikasi container lokal
   # Pada Linux/macOS: unix:///var/run/docker.sock
   # Pada Windows (Docker Desktop TCP): tcp://127.0.0.1:2375 atau unix:///var/run/docker.sock (WSL)
   DOCKER_HOST=unix:///var/run/docker.sock
   ```

---

## 5. Inisialisasi & Migrasi Database

MCloud menggunakan **SQLite** (`better-sqlite3`) yang dikelola menggunakan **Drizzle ORM**. File database akan dibuat secara otomatis di dalam folder `database/sqlite.db`.

1. **Migrasi / Sinkronisasi Skema Database**
   Untuk menyinkronkan definisi skema (`database/schema.js`) langsung ke database SQLite:
   ```bash
   npm run db:push
   ```
   *Atau jika ingin menjalankan script migrasi manual:*
   ```bash
   npm run db:migrate
   ```

2. **Seeding Data Dummy (Opsional untuk Testing/Development)**
   Jika Anda membutuhkan data dummy untuk pengetesan tampilan (pengguna, server game, transaksi, dan riwayat aktivitas), jalankan:
   ```bash
   npm run db:seed:faker
   ```
   > **Catatan:** Untuk menghapus seluruh data yang ada dan melakukan reset ulang seeding dari awal, gunakan:
   > ```bash
   > npm run db:reset:seed
   > ```

---

## 6. Membuat Akun Admin

Untuk dapat mengakses Dashboard Administrator, Anda perlu membuat akun dengan *role* `admin`. Projek menyediakan script otomatis untuk membuat akun admin bawaan:

```bash
node create_admin.js
```

**Kredensial Default Admin yang Dibuat:**
- **Username**: `admin`
- **Email**: `admin@mcloud.local`
- **Password**: `0987654321`
- **Role**: `admin`

> 💡 **Tips Keamanan:** Segera ubah kata sandi admin default tersebut melalui panel profil aplikasi setelah Anda berhasil login pertama kali!

---

## 7. Menjalankan Aplikasi

Anda dapat menjalankan seluruh ekosistem mikroservis beserta frontend secara serentak menggunakan satu perintah berkat utilitas `concurrently`.

### Menjalankan Semua Service Serentak (Mode Development)
Dari folder akar (*root*) projek, jalankan:

```bash
npm run dev
```

Perintah di atas akan secara otomatis mengaktifkan:
1. **Frontend Vite Server** -> `http://localhost:5173`
2. **API Gateway (Watch Mode)** -> `http://localhost:3000`
3. **Auth Service (Watch Mode)** -> `http://localhost:3001`
4. **Payment Service (Watch Mode)** -> `http://localhost:3002`
5. **Provisioning Service (Watch Mode)** -> `http://localhost:3003`

### Menjalankan Service Secara Terpisah (Untuk Debugging Manual)
Jika Anda perlu mengisolasi atau mendebug service tertentu di terminal terpisah:

```bash
# Terminal 1: API Gateway
node --watch apps/api-gateway/src/server.js

# Terminal 2: Auth Service
node --watch apps/auth-service/src/server.js

# Terminal 3: Payment Service
node --watch apps/payment-service/src/server.js

# Terminal 4: Provisioning Service
node --watch apps/provisioning-service/src/server.js

# Terminal 5: Frontend Vite App
npm run dev --prefix apps/frontend
```

---

## 8. Health Check & Debugging

Untuk memastikan bahwa API Gateway dan seluruh mikroservis di belakangnya telah berjalan dan saling terhubung dengan baik, buka endpoint pemantauan kesehatan sistem melalui browser atau `curl`:

```bash
curl http://localhost:3000/api/admin/system-health
```

**Contoh Response Sukses:**
```json
{
  "status": "success",
  "timestamp": 1751628000000,
  "services": [
    { "service": "API Gateway", "port": 3000, "status": "ONLINE", "latency": "1ms" },
    { "service": "Auth Service", "port": 3001, "status": "ONLINE", "latency": "3ms" },
    { "service": "Payment Service", "port": 3002, "status": "ONLINE", "latency": "4ms" },
    { "service": "Provisioning Service", "port": 3003, "status": "ONLINE", "latency": "5ms" },
    { "service": "Frontend Application", "port": 5173, "status": "ONLINE", "latency": "< 5ms" },
    { "service": "Docker Engine Runtime", "port": "unix.sock", "status": "ONLINE", "note": "v27.0.3 (0/10 kontainer aktif)" }
  ]
}
```

---

## 9. Troubleshooting Umum

### ❌ Error: `connect ECONNREFUSED 127.0.0.1:300X` di API Gateway
- **Penyebab**: Mikroservis target (misal port `3002` atau `3003`) belum menyala, mengalami crash, atau mati saat proses *startup*.
- **Solusi**:
  1. Pastikan tidak ada proses lain yang memakai port `3000` - `3003` dan `5173` sebelum menjalankan aplikasi.
  2. Periksa log terminal service yang bersangkutan untuk melihat pesan error spesifik (seperti *syntax error* atau masalah koneksi database).

### ❌ Error: `EACCES` atau `ENOENT` pada `docker.sock` di Provisioning Service
- **Penyebab**: Service tidak memiliki izin (*permission*) untuk mengakses daemon Docker, atau Docker belum dijalankan di sistem operasi Anda.
- **Solusi**:
  1. Pastikan aplikasi Docker Desktop / daemon Docker Linux sudah aktif (`sudo systemctl status docker`).
  2. Pastikan user terminal Anda memiliki hak akses ke grup docker (`sudo usermod -aG docker $USER`), atau sesuaikan path `DOCKER_HOST` pada file `.env`.

### ❌ Error: `ERR_STREAM_WRITE_AFTER_END: write after end`
- **Penyebab**: Terjadi panggilan `res.end()` ganda pada *native HTTP request response* di Node.js (misalnya oleh middleware otentikasi yang gagal sekaligus oleh handler rute).
- **Solusi**: Pastikan selalu menyertakan `return;` setelah pemanggilan middleware otentikasi di setiap handler rute:
  ```javascript
  const user = authMiddleware(req, res);
  if (!user) return; // Wajib dihentikan agar tidak melanjutkan eksekusi ke bawah
  ```
