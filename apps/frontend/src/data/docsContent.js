export const docsCategories = [
  {
    id: 'getting-started',
    title: 'Memulai & Panduan Dasar',
    description: 'Panduan langkah demi langkah untuk membuat, mengonfigurasi, dan menyalakan server Minecraft pertama Anda.',
    icon: 'Play',
    articles: [
      {
        slug: 'membuat-server',
        title: 'Cara Membuat Server Pertama & Memilih Paket',
        content: `
# Cara Membuat Server Pertama di MCloud

Selamat datang di MCloud! Platform hosting Minecraft kami didesain khusus untuk memberikan performa maksimal dengan latensi terendah di Indonesia. Proses aktivasi server sepenuhnya otomatis dan hanya membutuhkan waktu kurang dari 60 detik.

## 1. Memilih Spesifikasi Paket yang Tepat

Sebelum memesan, pastikan Anda memilih paket yang sesuai dengan jumlah pemain dan jenis modpack yang akan dimainkan:

- **Paket Villager (500MB RAM / Penyimpanan Permanen):** Sangat cocok untuk server bertahan hidup (survival) pribadi bersama beberapa teman dekat tanpa plugin berat (Rp 30.000/bulan).
- **Paket Spider (1GB RAM / Penyimpanan Permanen):** Ideal untuk server skala menengah dengan tambahan plugin dasar (seperti Essentials, WorldGuard, dan Economy) (Rp 40.000/bulan).
- **Paket Slime (2GB RAM / Penyimpanan Permanen):** Sempurna untuk server komunitas dengan sistem ekonomi, plugin kustom, atau minigame ringan (Rp 50.000/bulan).
- **Paket Wither (4GB RAM / Penyimpanan Permanen):** Performa maksimal untuk server berskala besar, modpack (Forge/Fabric), dan menampung banyak pemain secara bersamaan tanpa lag (Rp 60.000/bulan).

## 2. Proses Pemesanan & Pembayaran Instan

1. Buka menu **Buat Server** atau **Pricing** dari dasbor MCloud Anda.
2. Tentukan nama server, lokasi node (Indonesia / Singapura), serta jenis perangkat lunak awal (misalnya: Paper 1.20.4).
3. Pilih siklus penagihan bulanan atau tahunan (hemat hingga 20% untuk berlangganan tahunan).
4. Selesaikan pembayaran menggunakan metode instan seperti **QRIS** (GoPay, DANA, OVO, ShopeePay), **Virtual Account Bank**, atau Saldo Akun MCloud Anda.

## 3. Server Aktif Otomatis!

Setelah pembayaran terverifikasi oleh sistem, mesin *provisioning* MCloud akan segera membuat kontainer terisolasi untuk server Anda. Dalam hitungan detik, status server akan berubah menjadi **Running** dan Anda dapat langsung mengakses Dasbor Manajemen Server.
        `
      },
      {
        slug: 'bergabung-ke-server',
        title: 'Cara Bergabung ke Server Minecraft',
        content: `
# Cara Bergabung ke Server Minecraft Anda

Setelah server menyala, Anda dan teman-teman Anda sudah bisa langsung masuk ke dalam permainan.

## 1. Menemukan Alamat IP & Port Server

1. Buka Dasbor MCloud dan masuk ke tab **My Servers**.
2. Klik tombol **Kelola** pada server yang ingin dimainkan.
3. Pada halaman **Overview**, perhatikan panel informasi di sebelah kiri atas. Anda akan melihat **IP & Port** server Anda (contoh: \`103.152.240.12:25565\` atau \`play.namaserver.mcloud.id:25565\`).
4. Klik tombol **Salin IP** untuk menyalin alamat tersebut ke *clipboard*.

## 2. Bergabung dari Minecraft Java Edition

1. Buka game Minecraft Java Edition di komputer Anda (pastikan versi game cocok dengan versi server).
2. Pilih menu **Multiplayer**, lalu klik tombol **Add Server**.
3. Pada kolom **Server Name**, masukkan nama bebas (misal: Server MCloud Saya).
4. Pada kolom **Server Address**, tempel (*paste*) alamat IP dan Port yang telah disalin tadi.
5. Klik **Done**, pilih server tersebut dari daftar, lalu klik **Join Server**.

## 3. Menggunakan Domain Kustom (Tanpa Port)

Jika Anda memiliki domain sendiri (misal: \`play.komunitasmu.com\`), Anda dapat mengarahkannya ke server MCloud menggunakan **A Record** (jika menggunakan port default 25565) atau **SRV Record** pada pengaturan DNS domain Anda agar pemain tidak perlu mengetikkan angka port di belakang alamat IP.
        `
      },
      {
        slug: 'cross-play-bedrock',
        title: 'Panduan Cross-Play Java & Bedrock Edition',
        content: `
# Panduan Cross-Play Minecraft Java & Bedrock Edition

Apakah Anda ingin bermain bersama teman yang menggunakan HP Android, iPhone, iPad, Windows 10/11 Edition, atau Konsol (PlayStation / Xbox / Switch)? Di MCloud, Anda bisa menggabungkan pemain Java dan Bedrock dalam satu server yang sama!

## 1. Persyaratan Sistem

Untuk mengaktifkan fitur *cross-play*, server Anda **wajib** menggunakan berbasis Java seperti **Paper**, **Purpur**, atau jaringan **Velocity/BungeeCord**. Server Vanilla biasa atau Forge murni tidak mendukung fitur ini secara langsung.

## 2. Memasang Plugin GeyserMC & Floodgate

1. Buka situs resmi GeyserMC dan unduh versi terbaru dari plugin **Geyser-Spigot.jar** dan **Floodgate-Spigot.jar**.
2. Masuk ke Dasbor MCloud Anda, buka server, dan klik menu **File Manager**.
3. Buka folder \`plugins\` dan unggah (*upload*) kedua berkas \`.jar\` tersebut ke dalamnya.
4. Kembali ke halaman Konsol atau Overview, lalu klik tombol **Restart** server.

## 3. Cara Pemain Bedrock Bergabung

Setelah server menyala kembali, GeyserMC akan secara otomatis membuka *gateway* untuk pemain Bedrock:

- **Alamat IP / Server Address:** Gunakan IP server MCloud Anda (tanpa port).
- **Port Bedrock:** Gunakan angka port server Anda (misal: \`25565\` atau port khusus yang dialokasikan).
- Pemain Bedrock kini bisa langsung masuk tanpa perlu memiliki akun Java Edition (berkat plugin Floodgate)!
        `
      }
    ]
  },
  {
    id: 'server-management',
    title: 'Manajemen & Pengaturan Server',
    description: 'Pelajari cara mengelola file, memantau konsol terminal interaktif, dan mengatur konfigurasi server.',
    icon: 'Server',
    articles: [
      {
        slug: 'menggunakan-file-manager',
        title: 'Web File Manager & Ekstraksi ZIP',
        content: `
# Menggunakan Web File Manager MCloud

MCloud menyediakan fitur Web File Manager bawaan yang sangat responsif, memungkinkan Anda mengelola seluruh berkas server langsung dari browser tanpa perlu menginstal aplikasi FTP tambahan seperti FileZilla.

## Fitur Utama File Manager

- **Editor Teks Sintaks Highlight:** Klik pada berkas konfigurasi apa pun (seperti \`server.properties\`, \`bukkit.yml\`, atau berkas \`.json\` / \`.yml\` di dalam folder plugin) untuk membukanya di editor teks modern. Setelah selesai mengedit, cukup klik tombol **Simpan Perubahan**.
- **Upload & Drag-and-Drop:** Anda dapat mengunggah berkas dengan mengklik tombol **Upload** atau langsung menyeret berkas dari komputer Anda ke dalam area tabel berkas di browser.
- **Ekstraksi ZIP Instan:** Untuk mengunggah banyak berkas atau dunia (*world*) sekaligus, kompres berkas tersebut menjadi format \`.zip\` di komputer Anda, unggah ke File Manager, lalu klik ikon **Ekstrak** pada menu aksi berkas. Sistem akan mengekstrak seluruh isinya secara cepat di server.

## Tips Keamanan Berkas

Jangan pernah membagikan atau mengunduh berkas \`usercache.json\` atau folder yang berisi data sensitif pemain kepada pihak yang tidak dikenal untuk mencegah kebocoran informasi akun komunitas Anda.
        `
      },
      {
        slug: 'membaca-konsol',
        title: 'Konsol Real-Time xterm.js & WebSocket',
        content: `
# Memantau Konsol Server Real-Time

Konsol adalah pusat kendali utama server Minecraft Anda. Di Dasbor MCloud, kami mengintegrasikan terminal **xterm.js** dengan koneksi **WebSocket latensi rendah** sehingga setiap log yang terjadi di server ditampilkan secara instan tanpa jeda.

## Memahami Log Server

Saat server berjalan, Anda akan melihat baris-baris teks dengan kode warna tertentu:

- **[INFO]:** Log informasi normal, seperti pemain yang bergabung, obrolan (*chat*), atau aktivitas rutin plugin.
- **[WARN] (Kuning):** Peringatan sistem, biasanya terjadi jika ada server yang sedikit tertinggal (*running behind / tick lag*) atau konfigurasi plugin yang kurang optimal. Server tetap berjalan normal.
- **[ERROR] / [FATAL] (Merah):** Kesalahan serius, seperti bentrokan versi plugin, *out of memory* (kehabisan RAM), atau berkas dunia yang rusak (*corrupt*). Jika server gagal menyala, selalu periksa baris berwarna merah di konsol.

## Mengirim Perintah (Command) dari Browser

Anda dapat mengetikkan perintah Minecraft langsung pada kolom input di bawah konsol (tanpa tanda garis miring \`/\` di depannya):

- \`op <nama_pemain>\`: Memberikan hak operator (admin penuh) kepada pemain di dalam game.
- \`whitelist add <nama_pemain>\`: Menambahkan pemain ke dalam daftar putih server tertutup.
- \`save-all\`: Memaksa server menyimpan seluruh data dunia dan pemain ke penyimpanan NVMe saat itu juga.
- \`stop\`: Mematikan server secara aman dengan menyimpan seluruh progress permainan terlebih dahulu.
        `
      },
      {
        slug: 'konfigurasi-server-properties',
        title: 'Mengatur server.properties & Parameter Game',
        content: `
# Konfigurasi Parameter Server (server.properties)

Berkas \`server.properties\` adalah berkas pengaturan utama yang mengontrol aturan main di dunia Minecraft Anda. Di Dasbor MCloud, Anda dapat mengubahnya dengan mudah melalui menu **Server Settings** atau mengedit berkasnya secara manual di **File Manager**.

## Pengaturan Penting yang Sering Diubah

- **motd (Message of The Day):** Teks pesan sambutan berwarna yang muncul di bawah nama server Anda pada daftar multiplayer pemain. Anda bisa menggunakan kode warna Minecraft (misal: \`\\u00A7aSelamat Datang di \\u00A7eServer Kami!\`).
- **max-players:** Batas maksimal kapasitas pemain yang dapat masuk ke server secara bersamaan (misal: \`20\` atau \`50\`).
- **view-distance & simulation-distance:** Jarak pandang *chunk* pemain. Untuk menjaga performa server tetap ringan tanpa *lag*, kami merekomendasikan angka \`6\` hingga \`8\`.
- **online-mode:** Jika diatur ke \`true\`, hanya pemain dengan akun Minecraft resmi (premium) yang dapat bergabung. Jika diatur ke \`false\`, pemain dari *launcher* non-premium (offline mode) dapat bergabung (pastikan Anda memasang plugin keamanan seperti AuthMe jika menggunakan mode offline).
- **pvp:** Atur ke \`true\` untuk mengizinkan pertarungan antar pemain, atau \`false\` untuk mematikan damage antar pemain.
- **difficulty:** Tingkat kesulitan permainan (\`peaceful\`, \`easy\`, \`normal\`, atau \`hard\`).
        `
      },
      {
        slug: 'sub-users-kolaborator',
        title: 'Manajemen Sub-Users & Hak Akses Kolaborator',
        content: `
# Manajemen Sub-Users (Kolaborator Server)

Apakah Anda memiliki tim admin, developer plugin, atau moderator yang membantu mengelola server? Di MCloud, Anda tidak perlu memberikan alamat email atau kata sandi akun utama Anda kepada mereka!

## Cara Mengundang Kolaborator

1. Buka Dasbor Server Anda dan masuk ke menu **Sub-Users** (atau menu **Pengaturan → Kolaborator**).
2. Klik tombol **Undang Sub-User Baru**.
3. Masukkan alamat email rekan Anda (pastikan rekan Anda telah memiliki akun terdaftar di MCloud).
4. Tentukan hak akses (*permissions*) spesifik yang ingin Anda berikan kepada mereka.
5. Klik **Kirim Undangan**. Rekan Anda akan langsung melihat server tersebut di dasbor mereka sendiri!

## Pilihan Hak Akses (Permissions)

Anda dapat mengontrol secara ketat apa saja yang bisa dilakukan oleh setiap kolaborator:

- **Power Control:** Izin untuk menekan tombol Start, Stop, dan Restart server.
- **Console Access:** Izin untuk melihat log konsol real-time dan mengirim perintah terminal.
- **File Manager:** Izin untuk melihat, mengedit, mengunggah, atau menghapus berkas server.
- **Backup & Restore:** Izin untuk membuat atau memulihkan snapshot cadangan server.
- **Settings & Allocations:** Izin untuk mengubah parameter server, nama server, dan pengaturan jaringan.

Anda dapat mencabut atau mengubah hak akses kolaborator kapan saja hanya dengan satu klik dari dasbor utama Anda.
        `
      }
    ]
  },
  {
    id: 'plugins-mods',
    title: 'Plugin, Modpack & Kustomisasi',
    description: 'Panduan menambahkan fitur kustom, memasang modpack Forge/Fabric, serta mengoptimalkan alokasi RAM.',
    icon: 'Puzzle',
    articles: [
      {
        slug: 'cara-pasang-plugin',
        title: 'Cara Memasang Plugin (Paper, Purpur, Velocity)',
        content: `
# Cara Memasang Plugin di Server Minecraft

Plugin adalah ekstensi tambahan yang memungkinkan Anda menambahkan fitur-fitur seru seperti sistem ekonomi, klaim tanah (*land claim*), mini-games, hingga proteksi anti-cheat **tanpa mengharuskan pemain mengunduh mod apa pun** di komputer mereka!

## 1. Memilih Perangkat Lunak Server yang Tepat

Pastikan server Anda menggunakan mesin berbasis Bukkit/Spigot seperti **Paper**, **Purpur**, atau **Spigot**. Kami sangat merekomendasikan **Paper** atau **Purpur** karena efisiensi penggunaannya terhadap CPU dan RAM jauh lebih optimal dibanding Spigot biasa.

## 2. Langkah-Langkah Pemasangan Plugin

1. Unduh berkas plugin berformat \`.jar\` dari sumber terpercaya seperti **SpigotMC**, **Modrinth**, **Hangar**, atau **BukkitDev**.
2. Buka menu **File Manager** pada dasbor server Anda di MCloud.
3. Cari dan buka folder bernama \`plugins\`.
4. Klik tombol **Upload** atau seretberkas \`.jar\` plugin tersebut dari komputer Anda ke dalam folder \`plugins\`.
5. Kembali ke halaman utama server dan klik **Restart**.
6. Setelah server menyala, ketik perintah \`plugins\` (atau \`/pl\` di dalam game) untuk memeriksa apakah plugin telah aktif. Plugin yang berhasil dimuat akan berwarna **hijau**.

## Rekomendasi Plugin Wajib untuk Server Baru

- **EssentialsX:** Menyediakan ratusan perintah dasar seperti \`/home\`, \`/spawn\`, \`/warp\`, \`/tpa\`, dan sistem uang (*economy*).
- **LuckPerms:** Plugin manajemen hak akses (*permissions*) dan pangkat (*prefix/rank*) terbaik dengan antarmuka editor web interaktif.
- **WorldGuard & WorldEdit:** Memungkinkan Anda memproteksi area *spawn* agar tidak bisa dihancurkan oleh pemain biasa.
- **SkinRestorer:** Mengembalikan tampilan skin pemain pada server yang menggunakan mode offline / cross-play.
        `
      },
      {
        slug: 'instalasi-modpack',
        title: 'Instalasi Custom Modpack (Forge, Fabric, Neoforge)',
        content: `
# Cara Memasang Modpack (Forge, Fabric, Neoforge)

Bagi Anda yang menyukai petualangan dengan blok baru, monster kustom, dimensi sihir, atau teknologi industri, MCloud mendukung penuh instalasi modpack untuk Minecraft Java Edition.

## 1. Memilih Mesin Modding

Di halaman **Server Settings**, Anda dapat mengubah tipe server menjadi:

- **Forge / Neoforge:** Mesin modding klasik dan terpopuler, cocok untuk modpack besar dari CurseForge.
- **Fabric:** Mesin modding modern yang sangat ringan dan cepat, terkenal dengan mod optimasi seperti Sodium dan Lithium.

## 2. Memasang Modpack dari CurseForge / Modrinth

1. Unduh **Server Pack** (bukan Client Pack!) dari halaman modpack di CurseForge atau Modrinth. Server pack biasanya berisi folder \`mods\`, \`config\`, dan library pendukung tanpa mod khusus klien (seperti minimap atau shader).
2. Di File Manager MCloud, hapus berkas dunia lama jika Anda ingin memulai dari awal yang bersih.
3. Unggah arsip \`.zip\` Server Pack tersebut ke File Manager, lalu klik **Ekstrak**.
4. Pastikan folder \`mods\` sudah berada di direktori utama server Anda dan berisi berkas-berkas \`.jar\` dari mod yang ingin dimainkan.
5. Klik **Start** atau **Restart** server. Proses pertama kali nyala mungkin memakan waktu 2 - 5 menit karena server perlu membuat konfigurasi dan dunia baru.

## Catatan Penting untuk Server Modpack

Server modpack membutuhkan konsumsi memori (RAM) yang lebih besar dibanding server Vanilla biasa. Untuk modpack dengan banyak mod, kami sangat menyarankan menggunakan paket **Slime (2GB RAM)** atau **Wither (4GB RAM)** agar terhindar dari *crash* akibat kehabisan memori (*OutOfMemoryError*).
        `
      },
      {
        slug: 'optimasi-ram-jvm',
        title: 'Optimasi Alokasi RAM & Performa Server',
        content: `
# Optimasi Performa & Alokasi RAM Server

Mengalami *lag*, balok yang terlambat hancur (*block lag*), atau mob yang bergerak patah-patah? Berikut adalah panduan praktis dari tim teknis MCloud untuk memaksimalkan performa server Anda.

## 1. Menggunakan Paper atau Purpur

Jika Anda masih menggunakan Vanilla atau Spigot standar, beralihlah ke **Paper** atau **Purpur**. Kedua perangkat lunak ini berisi ribuan *patch* optimasi asinkron yang mampu melipatgandakan kinerja server tanpa mengubah mekanisme gameplay dasar Minecraft.

## 2. Mengatur Jarak Pandang (View Distance)

Jarak pandang yang terlalu tinggi adalah penyebab utama *lag* pada server multiplayer. Setiap pemain yang berjalan akan memuat ribuan *chunk* baru ke dalam RAM.

- Buka berkas \`server.properties\` atau \`config/paper-world-defaults.yml\`.
- Atur \`view-distance\` ke angka **6** atau **7**.
- Atur \`simulation-distance\` (jarak di mana tanaman tumbuh dan mob bergerak) ke angka **4** atau **5**.

## 3. Memasang Mod & Plugin Optimasi

- Untuk server **Paper/Purpur**, pasang plugin **FerriteCore** atau **Spark** untuk memantau penggunaan CPU secara mendetail dengan perintah \`/spark profiler\`.
- Untuk server **Fabric**, pasang mod **Lithium**, **FerriteCore**, dan **Krypton** di dalam folder \`mods\` server Anda. Mod ini mampu menghemat penggunaan RAM hingga 40%!

## 4. Pre-Generation Dunia (Chunky)

Sebelum membuka server untuk umum, pasang plugin **Chunky** dan jalankan perintah \`/chunky start\`. Plugin ini akan membuat *chunk* peta secara otomatis terlebih dahulu, sehingga saat pemain menjelajah, CPU server tidak terbebani oleh proses *world generation* yang berat.
        `
      }
    ]
  },
  {
    id: 'billing-support',
    title: 'Billing, Pembayaran & Bantuan',
    description: 'Panduan mengenai metode pembayaran QRIS, siklus tagihan, kalkulasi prorata, dan pengajuan tiket bantuan.',
    icon: 'CreditCard',
    articles: [
      {
        slug: 'metode-pembayaran-qris',
        title: 'Pembayaran Instan via QRIS & Virtual Account',
        content: `
# Metode Pembayaran & Verifikasi Instan

MCloud menghadirkan sistem pembayaran otomatis yang terintegrasi langsung dengan gerbang pembayaran teraman di Indonesia. Setiap transaksi diproses secara *real-time* 24 jam sehari, 7 hari seminggu tanpa perlu konfirmasi manual atau mengirim bukti transfer!

## Metode Pembayaran yang Didukung

- **QRIS (Quick Response Code Indonesian Standard):** Scan kode QR menggunakan aplikasi e-Wallet apa pun (GoPay, OVO, DANA, ShopeePay, LinkAja) atau Mobile Banking (BCA mobile, Livin' by Mandiri, BRImo, myBCA, dll).
- **Virtual Account Bank (VA):** Transfer langsung ke rekening Virtual Account BCA, Mandiri, BNI, BRI, Permata, atau BSI dengan pengecekan otomatis.
- **Saldo Akun MCloud (Wallet):** Anda dapat mengisi deposit saldo di Area Klien terlebih dahulu untuk perpanjangan otomatis yang super cepat.

## Apa yang Harus Dilakukan Setelah Membayar?

1. Setelah Anda menyelesaikan pembayaran di aplikasi bank atau e-Wallet, jangan tutup halaman *checkout* di browser Anda.
2. Dalam waktu 5 - 15 detik, sistem akan menerima notifikasi dari bank, mengubah status tagihan menjadi **Lunas (Paid)**, dan langsung mengaktifkan server Anda saat itu juga.
3. Anda akan menerima email tanda terima resmi beserta rincian login ke dasbor server Anda.
        `
      },
      {
        slug: 'siklus-tagihan-prorata',
        title: 'Siklus Perpanjangan, Prorata & Masa Tenggang',
        content: `
# Kebijakan Tagihan, Prorata & Masa Tenggang Layanan

Kami berkomitmen untuk transparan dalam setiap penagihan layanan hosting Anda. Berikut adalah penjelasan mengenai alur siklus masa aktif server di MCloud.

## 1. Siklus Tagihan Perpanjangan (Renewal)

- Tagihan perpanjangan akan diterbitkan secara otomatis oleh sistem **7 hari** sebelum tanggal jatuh tempo (*due date*) masa aktif server Anda berakhir.
- Anda akan menerima pengingat melalui email dan notifikasi di Dasbor Klien agar Anda memiliki waktu yang cukup untuk memperpanjang layanan.

## 2. Masa Tenggang (Grace Period & Suspension)

- Jika tagihan belum dibayar hingga tanggal jatuh tempo pukul 23:59 WIB, layanan server Anda akan masuk ke status **Suspended** (dinonaktifkan sementara). Pada tahap ini, pemain tidak dapat bergabung, namun **seluruh data dunia dan plugin Anda tetap aman dan tidak dihapus**.
- MCloud memberikan **Masa Tenggang (Grace Period) selama 3 hari** setelah tanggal suspend. Selama masa tenggang ini, Anda dapat melunasi invoice perpanjangan di Area Klien, dan server akan otomatis aktif kembali dalam hitungan detik dengan seluruh data yang utuh!
- **Peringatan:** Jika melewati masa tenggang 3 hari tanpa pembayaran, sistem otomatis akan menghapus kontainer dan penyimpanan server secara permanen untuk membebaskan alokasi SSD pada node kami.

## 3. Kalkulasi Prorata saat Upgrade Spesifikasi

Ingin melakukan *upgrade* dari paket Spider (1GB) ke Wither (4GB) di pertengahan bulan? Sistem MCloud menggunakan kalkulasi **Prorata (Prorated Calculation)** yang adil:

- Anda **tidak perlu membayar penuh** harga paket baru!
- Sistem hanya akan menghitung selisih biaya antara paket lama dan paket baru berdasarkan sisa hari masa aktif Anda.
- Setelah tagihan prorata terbayar, spesifikasi RAM dan NVMe server Anda langsung meningkat secara otomatis tanpa menghilangkan data dunia sedikit pun.
        `
      },
      {
        slug: 'sistem-tiket-bantuan',
        title: 'Mengajukan Tiket Bantuan & Komunitas Discord',
        content: `
# Pusat Bantuan & Komunitas MCloud

Mengalami kendala teknis atau memiliki pertanyaan yang belum terjawab di dokumentasi ini? Tim Engineer dan Customer Support MCloud selalu siap membantu Anda!

## 1. Menggunakan Tiket Bantuan CS (Client Area)

Untuk kendala teknis yang memerlukan pengecekan akun atau spesifikasi server, mengajukan Tiket Bantuan adalah cara tercepat:

1. Masuk ke **Client Area** dan klik menu **Tiket Bantuan** (atau klik ikon **Pusat Bantuan** di pojok kanan atas dasbor).
2. Klik tombol **Buat Tiket Baru**.
3. Pilih departemen yang sesuai (*Dukungan Teknis Server*, *Billing & Pembayaran*, atau *Pertanyaan Umum*).
4. Pilih server yang mengalami kendala dari menu *dropdown*.
5. Tuliskan subjek dan deskripsi kendala Anda secara jelas. Anda juga dapat **melampirkan tangkapan layar (screenshot)** atau berkas *log error* agar teknisi kami dapat menganalisis masalah dengan lebih tepat.
6. Klik **Kirim Tiket**. Anda akan mendapatkan balasan secara *real-time* dengan sistem sinkronisasi otomatis kami!

## 2. Bergabung ke Komunitas Discord MCloud

Komunitas Discord resmi kami adalah tempat berkumpulnya ribuan pemilik server, developer plugin, dan pemain Minecraft dari seluruh Indonesia:

- **Channel #general & #server-showcase:** Promosikan server Minecraft yang baru Anda buat kepada komunitas!
- **Channel #community-support:** Bertanya dan berdiskusi sesama pemilik server mengenai rekomendasi plugin, konfigurasi modpack, dan tips arsitektur server.
- **Channel #announcements & #changelog:** Dapatkan informasi rilis fitur terbaru MCloud dan pembaruan sistem secara langsung.

[Klik di sini untuk bergabung ke Discord Resmi MCloud](https://discord.gg/mcloud)
        `
      }
    ]
  },
  {
    id: 'security-network',
    title: 'Keamanan & Proteksi Jaringan',
    description: 'Pelajari bagaimana sistem Anti-DDoS berlapis melindungi server Anda dan cara melakukan backup cadangan.',
    icon: 'Shield',
    articles: [
      {
        slug: 'proteksi-anti-ddos',
        title: 'Proteksi Anti-DDoS Game Shield Multi-Layer',
        content: `
# Proteksi Anti-DDoS Khusus Game Server

Serangan siber seperti DDoS (Distributed Denial of Service) adalah ancaman nyata bagi server game populer. Di MCloud, keamanan infrastruktur dan kenyamanan bermain Anda adalah prioritas utama kami.

## Bagaimana Game Shield MCloud Bekerja?

Seluruh node server MCloud dilengkapi dengan filter perangkat keras dan perangkat lunak berlapis berkapasitas mitigasi hingga **Multi-Terabits per detik (Tbps)**:

- **Filter Layer 3 & Layer 4 (Network & Transport Layer):** Secara otomatis mendeteksi dan memblokir serangan anomali volumetrik seperti SYN Flood, ICMP Flood, dan UDP Flood seketika di gerbang jaringan utama kami sebelum mencapai node server Anda.
- **Game-Specific Layer 7 Filtering:** Filter kami didesain khusus untuk membedakan lalu lintas paket data Minecraft sah (*legitimate player packets*) dengan paket serangan bot spam pada port **25565 (Java)** dan **19132 (Bedrock)**.
- **Latensi Tetap Rendah (Low Latency):** Proses mitigasi dan pembersihan lalu lintas (*traffic scrubbing*) dilakukan secara instan di pusat data lokal Indonesia dan Singapura, sehingga ping pemain di dalam game tetap stabil tanpa kejutan *spike* atau *packet loss*.

Anda tidak perlu mengaktifkan atau membayar biaya tambahan apa pun—proteksi **Anti-DDoS Enterprise ini telah aktif 24/7 secara gratis** pada seluruh paket hosting MCloud!
        `
      },
      {
        slug: 'backup-restore-snapshot',
        title: 'Manajemen Snapshot Cadangan & Restore Data',
        content: `
# Manajemen Cadangan (Backup & Snapshot)

Mencegah kehilangan data akibat kesalahan build, eksploitasi bug oleh pemain, atau kerusakan plugin adalah hal yang sangat penting. MCloud menyediakan sistem cadangan (*backup snapshot*) yang praktis dan andal.

## 1. Snapshot Cadangan Otomatis

Sistem kami secara otomatis melakukan pencadangan (*snapshot*) berkala terhadap seluruh direktori server Anda di latar belakang ke server penyimpanan terpisah (*offsite storage*). Jika terjadi kegagalan perangkat keras atau kendala masif, data Anda tetap terlindungi dengan aman.

## 2. Membuat Backup Manual (Dasbor Server)

Anda juga dapat membuat cadangan manual kapan saja, misalnya sebelum melakukan *reset world*, memperbarui versi Minecraft ke rilis terbaru, atau mencoba plugin eksperimental:

1. Buka Dasbor Server Anda di MCloud dan masuk ke tab **Backups**.
2. Klik tombol **Buat Backup Baru**.
3. Berikan nama atau catatan cadangan (misal: \`Backup sebelum update Paper 1.20.4\`).
4. Klik **Mulai Backup**. Sistem akan mengompresi seluruh berkas dunia, plugin, dan konfigurasi server ke dalam arsip yang aman.

## 3. Cara Memulihkan (Restore) Cadangan

Jika eksperimen Anda mengalami kendala dan Anda ingin mengembalikan kondisi server persis seperti waktu cadangan dibuat:

1. Pada tab **Backups**, cari snapshot cadangan yang ingin dipulihkan.
2. Klik tombol **Restore (Pulihkan)**.
3. Konfirmasi tindakan Anda. Sistem akan mematikan server sementara, menimpa berkas yang rusak dengan berkas cadangan, dan menyalakan kembali server dalam kondisi prima!
        `
      }
    ]
  }
];

export const getAllArticles = () => {
  let all = [];
  docsCategories.forEach(cat => {
    cat.articles.forEach(art => {
      all.push({ ...art, categoryId: cat.id, categoryTitle: cat.title });
    });
  });
  return all;
};

export const getArticleBySlug = (categoryId, slug) => {
  const cat = docsCategories.find(c => c.id === categoryId);
  if (!cat) return null;
  const article = cat.articles.find(a => a.slug === slug);
  if (!article) return null;
  return { ...article, categoryId: cat.id, categoryTitle: cat.title };
};
