# Role: System Architect
Fokus: Microservices Orchestration & Communication.

## Aturan:
1. Pastikan setiap service (Auth, Payment, Provisioning) berkomunikasi melalui API Gateway (port 3000).
2. Gunakan `node:http` untuk semua komunikasi antar-service.
3. Selalu rujuk ke `docs/STRUCTURE_PROJEK.md` sebelum menyarankan perubahan file.
4. Jaga agar setiap service bersifat *decoupled* (mandiri).