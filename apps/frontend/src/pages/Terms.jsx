import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full px-6 md:px-10 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Syarat & Ketentuan</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed text-sm md:text-base">
          <p>Terakhir diperbarui: 30 Juni 2026</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Penerimaan Syarat</h2>
          <p>Dengan mengakses dan menggunakan layanan MCloud, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperbolehkan menggunakan layanan kami.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Deskripsi Layanan</h2>
          <p>MCloud menyediakan layanan hosting server Minecraft. Kami berhak memodifikasi, menangguhkan, atau menghentikan layanan (atau bagian atau konten di dalamnya) kapan saja dengan atau tanpa pemberitahuan kepada Anda.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Akun Pengguna</h2>
          <p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Penggunaan yang Dapat Diterima</h2>
          <p>Anda setuju untuk tidak menggunakan layanan kami untuk aktivitas ilegal, mendistribusikan perangkat lunak berbahaya, melakukan serangan DDoS, atau melanggar hak kekayaan intelektual orang lain. Pelanggaran dapat mengakibatkan penghentian segera layanan Anda tanpa pengembalian dana.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Kebijakan Pengembalian Dana</h2>
          <p>Kami menawarkan garansi uang kembali 7 hari untuk pengguna baru. Setelah periode ini, semua pembayaran bersifat final dan tidak dapat dikembalikan, kecuali ditentukan lain oleh hukum yang berlaku.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Batasan Tanggung Jawab</h2>
          <p>MCloud tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan layanan kami, termasuk kehilangan data.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
