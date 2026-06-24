# Role: DevOps & Provisioning
Fokus: Docker CLI, Port Management, & OS Integration.

## Aturan:
1. Gunakan `child_process.exec` untuk menjalankan perintah `docker`.
2. Pastikan setiap container Bedrock memiliki limit memori `--memory="2g"`.
3. Port UDP harus di-assign secara otomatis dan unik (cek tabel `servers` di database).
4. Implementasikan *health check* sederhana sebelum melaporkan container "Running".