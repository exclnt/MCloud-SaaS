
---

## Product Requirements Document (PRD) - Local Microservices MVP

**Nama Produk:** BedrockHost SaaS (Local MVP)
**Platform:** Web-based Dashboard (Akses via `localhost`)
**Target Rilis:** Local Proof of Concept (PoC)

### 1. Tujuan Produk

Membangun dan menguji sistem otomatisasi (provisioning) hosting Minecraft Bedrock secara *end-to-end* di lingkungan lokal. Sistem dirancang menggunakan arsitektur *Microservices Monorepo* agar ringan saat *development* namun siap di-*scale* ke production. Sistem harus bisa menerima simulasi pembayaran, mengalokasikan port secara dinamis, dan menyalakan container game langsung di komputer pengembang.

### 2. Target Pengguna (Untuk Fase Ini)

* **Developer (Kamu):** Untuk melakukan *testing* fitur, *debugging* kode native Node.js, bereksperimen dengan Microservices, dan validasi arsitektur Docker secara lokal tanpa biaya server.

### 3. Arsitektur & Tech Stack (Lokal)

* **Arsitektur:** Microservices Monorepo (Dijalankan bersamaan via `concurrently` di *root*).
* **Frontend:** React, Vite, Tailwind CSS (Berjalan di `localhost:5173`).
* **Backend (Native Node.js `node:http`):**
* `api-gateway` (Port 3000): Reverse proxy manual.
* `auth-service` (Port 3001): Autentikasi & JWT.
* `payment-service` (Port 3002): Midtrans Checkout & Webhook.
* `provisioning-service` (Port 3003): Eksekutor Docker & Port Management.


* **Database:** SQLite (File `.db` lokal di folder `database/`).
* **ORM:** Drizzle ORM + `better-sqlite3`.
* **Infrastruktur Simulator:** Docker Desktop / Docker Engine (Lokal).
* **Tunneling Service:** **ngrok** (Meneruskan Webhook Midtrans ke `localhost:3000`).
* **Payment Gateway:** Midtrans Sandbox Mode.

### 4. Fitur Utama (Local MVP Scope)

* **Autentikasi Lokal (`auth-service`):** Register & Login. Password di-*hash* dengan bcrypt dan disimpan di SQLite. Otentikasi menggunakan JWT.
* **Simulasi Pembayaran (`payment-service`):** Generate Snap Token Midtrans. Menyelesaikan pembayaran via simulator Sandbox. Menerima notifikasi *settlement* via Webhook (ngrok).
* **Automated Provisioning (`provisioning-service`):** Otomatis mengeksekusi perintah CLI `docker run` saat di-*trigger* oleh Payment Service yang sukses. Mengunduh *image* Bedrock dan menyalakan server.
* **Manajemen Port Dinamis:** Alokasi port UDP secara otomatis dengan mengecek data port terakhir di database SQLite menggunakan Drizzle ORM (mulai dari `19132`, `19133`, dst).
* **Server Dashboard Frontend:**
* Menampilkan IP (`127.0.0.1`) dan Port dinamis.
* Kontrol *power* server: Start, Stop, Restart (meneruskan request via API Gateway ke Provisioning Service).



### 5. Non-Functional Requirements (NFR) - Lokal

* **Konektivitas Webhook:** API Gateway harus bisa menerima *payload* JSON dari Midtrans via ngrok, lalu me-routing dengan tepat ke `payment-service`.
* **Komunikasi Antar Service:** Pembagian *port* yang jelas untuk mencegah bentrok di `localhost`.
* **Docker Permission:** User OS yang menjalankan Node.js harus bisa mengeksekusi `docker` CLI.
* **Isolasi Resource:** Container Bedrock dijalankan dengan flag `--memory="2g"` agar RAM komputer lokal tidak habis saat *testing*.

---

## Contoh Tampilan Informasi Server di Dashboard Lokal

> **Server Name:** Lokal SMP
> **Status:** Running
> **IP Address:** `127.0.0.1` *(Akses langsung dari game Minecraft di PC yang sama)* > **Port:** `19132` (UDP)
> **Memory Limit:** 2 GB

---
