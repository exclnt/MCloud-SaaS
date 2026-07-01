export const docsCategories = [
  {
    id: 'getting-started',
    title: 'Memulai',
    description: 'Panduan dasar untuk membuat dan menyalakan server pertama Anda.',
    icon: 'Play',
    articles: [
      {
        slug: 'membuat-server',
        title: 'Cara Membuat Server Pertama',
        content: `
# Cara Membuat Server Pertama di MCloud

Selamat datang di MCloud! Mengaktifkan server Minecraft Anda sangatlah mudah dan hanya membutuhkan beberapa langkah.

## 1. Memilih Paket
Buka menu **Buat Server** dari dasbor Anda. Pilih paket yang sesuai dengan kebutuhan Anda. Untuk bermain bersama 3-5 teman, paket **Slime (2GB RAM)** sangat direkomendasikan.

## 2. Menyelesaikan Pembayaran
Setelah memilih paket, Anda akan diarahkan ke halaman pembayaran. Kami mendukung berbagai metode pembayaran seperti QRIS, e-Wallet, dan Virtual Account.

## 3. Server Menyala!
Setelah pembayaran berhasil, sistem kami akan langsung menyebarkan (deploy) server Anda dalam hitungan detik. Anda bisa kembali ke Dasbor untuk melihat status server Anda.
        `
      },
      {
        slug: 'bergabung-ke-server',
        title: 'Cara Bergabung ke Server',
        content: `
# Cara Bergabung ke Server Minecraft Anda

Setelah server menyala, Anda pasti ingin segera masuk dan bermain!

1. Buka Dasbor MCloud dan klik server Anda.
2. Pada halaman **Pengaturan Server**, cari bagian **IP & Port** (contoh: \`192.168.1.1:25565\`).
3. Buka game Minecraft Anda, pilih menu **Multiplayer**, lalu klik **Add Server**.
4. Masukkan **IP:Port** tersebut ke dalam kolom Server Address.
5. Klik **Done** dan bergabunglah ke dunia Anda!
        `
      }
    ]
  },
  {
    id: 'server-management',
    title: 'Manajemen Server',
    description: 'Pelajari cara mengelola file, console, dan pengaturan server.',
    icon: 'Server',
    articles: [
      {
        slug: 'menggunakan-file-manager',
        title: 'Menggunakan File Manager',
        content: `
# Menggunakan File Manager

File Manager MCloud memungkinkan Anda mengedit, menghapus, atau mengunggah file langsung dari browser.

- **Mengedit File:** Klik pada file (seperti \`server.properties\`) untuk membuka teks editor.
- **Membuat Folder:** Klik tombol folder baru di bagian atas.
- **Mengunggah File:** Gunakan tombol **Upload** atau seret-dan-lepas (drag-and-drop) file Anda ke dalam area File Manager.
        `
      },
      {
        slug: 'membaca-konsol',
        title: 'Membaca Konsol',
        content: `
# Membaca Konsol Server

Konsol adalah jendela utama untuk melihat apa yang sedang terjadi di server Anda secara real-time.

- Pesan **[INFO]** biasanya adalah informasi normal.
- Pesan **[WARN]** berarti ada sesuatu yang tidak biasa, tapi server masih bisa berjalan.
- Pesan **[ERROR]** berarti ada kesalahan fatal, seperti plugin yang bentrok atau dunia yang rusak (corrupt).

Jika Anda melihat pesan \`Done (1.234s)! For help, type "help"\`, itu tandanya server Anda telah berhasil menyala dengan sempurna.
        `
      }
    ]
  },
  {
    id: 'plugins-mods',
    title: 'Plugin & Mod',
    description: 'Panduan menambahkan fitur kustom ke server Anda.',
    icon: 'Puzzle',
    articles: [
      {
        slug: 'cara-pasang-plugin',
        title: 'Cara Memasang Plugin (Paper/Spigot)',
        content: `
# Cara Memasang Plugin

Plugin memungkinkan Anda menambahkan fitur ekonomi, perlindungan tanah, atau minigame tanpa mengharuskan pemain mengunduh apapun!

1. Pastikan versi server Anda menggunakan perangkat lunak yang mendukung plugin, seperti **Paper** atau **Spigot**.
2. Unduh plugin berformat \`.jar\` dari situs resmi seperti SpigotMC.
3. Buka **File Manager** di MCloud dan cari folder \`plugins\`.
4. Unggah file \`.jar\` tersebut ke dalam folder \`plugins\`.
5. **Restart** server Anda. Plugin akan aktif secara otomatis!
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
