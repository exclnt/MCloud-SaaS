import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full px-6 md:px-10 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Kebijakan Privasi</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed text-sm md:text-base">
          <p>Terakhir diperbarui: 30 Juni 2026</p>
          
          <p>MCloud menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda saat Anda menggunakan layanan kami.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun, melakukan pembelian, atau menghubungi dukungan pelanggan. Ini mungkin termasuk nama, alamat email, dan informasi penagihan Anda.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>Kami menggunakan informasi yang kami kumpulkan untuk mengoperasikan, memelihara, dan menyediakan fitur-fitur Layanan, serta untuk memproses transaksi dan mengirimkan pemberitahuan terkait.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Perlindungan Data</h2>
          <p>Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Data kata sandi disimpan dalam format terenkripsi dengan menggunakan teknologi hashing modern.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Berbagi Informasi</h2>
          <p>Kami tidak menjual, memperdagangkan, atau menyewakan informasi identitas pribadi pengguna kepada pihak ketiga. Kami mungkin membagikan informasi agregat yang tidak terkait dengan identitas pribadi apa pun mengenai pengunjung dan pengguna dengan mitra bisnis tepercaya kami.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Cookie</h2>
          <p>Kami menggunakan cookie dan teknologi pelacakan serupa untuk melacak aktivitas di layanan kami dan menyimpan informasi tertentu untuk meningkatkan dan menganalisis layanan kami.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
