import { db } from './db.js';
import { 
  users, 
  servers, 
  transactions, 
  banned_players, 
  plans, 
  activity_logs, 
  settings, 
  tickets, 
  ticket_messages 
} from './schema.js';
import { eq, ne } from 'drizzle-orm';
import { fakerID_ID as faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const isReset = process.argv.includes('--reset');

async function seed() {
  console.log('🚀 Memulai proses seeding MCloud Database menggunakan @faker-js/faker...\n');

  if (isReset) {
    console.log('🧹 [Reset Mode] Membersihkan data lama (kecuali akun Admin)...');
    db.delete(ticket_messages).run();
    db.delete(tickets).run();
    db.delete(activity_logs).run();
    db.delete(banned_players).run();
    db.delete(transactions).run();
    db.delete(servers).run();
    db.delete(users).where(ne(users.role, 'admin')).run();
    console.log('✅ Pembersihan selesai.\n');
  }

  // 1. Seed Plans & Settings
  console.log('📦 Memeriksa & mengisi Paket Layanan (Plans) default...');
  const defaultPlans = [
    { name: 'Villager', ram: '500m', price: 15000, discount: 0 },
    { name: 'Spider', ram: '1g', price: 25000, discount: 0 },
    { name: 'Slime', ram: '2g', price: 50000, discount: 10 },
    { name: 'Wither', ram: '4g', price: 100000, discount: 20 },
  ];
  for (const p of defaultPlans) {
    const existing = db.select().from(plans).where(eq(plans.name, p.name)).get();
    if (!existing) {
      db.insert(plans).values(p).run();
    }
  }

  console.log('⚙️ Memeriksa & mengisi Pengaturan Sistem (Settings) default...');
  const defaultSettings = [
    { key: 'total_available_ram', value: '8192' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'maintenance_title', value: 'Pemeliharaan Sistem MCloud' },
    { key: 'maintenance_message', value: 'Kami sedang melakukan pemeliharaan rutin untuk meningkatkan performa dan stabilitas server. Silakan kembali dalam beberapa saat.' },
    { key: 'maintenance_eta', value: 'Segera' },
    { key: 'social_discord', value: 'https://discord.gg/mcloud' },
    { key: 'social_whatsapp', value: 'https://wa.me/6281234567890' },
    { key: 'social_instagram', value: 'https://instagram.com/mcloud.id' },
    { key: 'social_twitter', value: 'https://x.com/mcloud_id' },
    { key: 'social_email', value: 'support@mcloud.id' },
  ];
  for (const s of defaultSettings) {
    const existing = db.select().from(settings).where(eq(settings.key, s.key)).get();
    if (!existing) {
      db.insert(settings).values(s).run();
    }
  }

  // 2. Ensure Admin User
  console.log('👑 Memeriksa Akun Administrator...');
  let adminUser = db.select().from(users).where(eq(users.role, 'admin')).get();
  if (!adminUser) {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const res = db.insert(users).values({
      email: 'admin@mcloud.id',
      username: 'admin',
      password: adminPasswordHash,
      role: 'admin',
      createdAt: new Date(),
    }).run();
    adminUser = db.select().from(users).where(eq(users.id, res.lastInsertRowid)).get();
    console.log('   ✅ Akun Admin baru dibuat (username: admin, password: admin123)');
  } else {
    console.log(`   ✅ Akun Admin tersedia (username: ${adminUser.username})`);
  }

  // 3. Generate Users
  console.log('👥 Menggenerate 20 Akun Pengguna (Users)...');
  const userPasswordHash = bcrypt.hashSync('password123', 10);
  const createdUsers = [];
  
  // Also include admin in users list for some logs/tickets
  createdUsers.push(adminUser);

  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = `${firstName.toLowerCase()}${faker.number.int({ min: 10, max: 999 })}_${i}`;
    const email = `${username}@gmail.com`;
    const createdAt = faker.date.recent({ days: 60 });

    const existing = db.select().from(users).where(eq(users.username, username)).get();
    if (!existing) {
      const res = db.insert(users).values({
        email,
        username,
        password: userPasswordHash,
        role: 'user',
        createdAt,
      }).run();
      const newUser = db.select().from(users).where(eq(users.id, res.lastInsertRowid)).get();
      createdUsers.push(newUser);
    }
  }
  console.log(`   ✅ Berhasil menyiapkan ${createdUsers.length} akun pengguna (Password default user: password123).`);

  // 4. Generate Servers
  console.log('🎮 Menggenerate 25 Server Minecraft Dummy...');
  const serverNames = [
    'Nusantara SMP', 'Skyblock Legends', 'Crafting Realm', 'Aether Survival',
    'IndoCraft SMP', 'Pixelmon Galaxy', 'Anarchy Nusantara', 'Minigame Arena',
    'Vanilla Plus SMP', 'Hardcore Legends', 'Bedwars Indo', 'Creative Builders',
    'Kingdom Wars SMP', 'RLCraft Indo', 'Cobblemon Realm', 'SkyWars Masters',
    'Survive And Thrive', 'Dungeon Quest SMP', 'Blocky Universe', 'Emerald SMP',
    'Diamond Realm', 'Garuda SMP', 'Redstone Engineers', 'Parkour Paradise', 'Mystic RPG Realm'
  ];
  const statuses = ['running', 'stopped', 'starting'];
  const memoryLimits = ['500m', '1g', '2g', '4g'];
  const gamemodes = ['survival', 'creative', 'adventure'];
  const difficulties = ['easy', 'normal', 'hard'];
  const versions = ['1.20.4', '1.20.2', '1.19.4', 'latest'];
  const tagList = ['survival,economy', 'pvp,minigames', 'creative,building', 'anarchy,pvp', 'rpg,custom-mobs', 'vanilla,chill'];

  const createdServers = [];
  let basePort = 25565;

  for (let i = 0; i < 25; i++) {
    const randomUser = createdUsers[faker.number.int({ min: 1, max: createdUsers.length - 1 })]; // avoid admin for server ownership mostly
    const name = serverNames[i] || `${faker.word.adjective()} Realm ${i}`;
    const status = i < 12 ? 'running' : (i < 22 ? 'stopped' : 'starting');
    const port = basePort + i;
    const createdAt = faker.date.recent({ days: 45 });

    // Check if port exists
    const existingPort = db.select().from(servers).where(eq(servers.port, port)).get();
    if (!existingPort && randomUser) {
      const res = db.insert(servers).values({
        userId: randomUser.id,
        name,
        status,
        ip: '127.0.0.1',
        port,
        memoryLimit: faker.helpers.arrayElement(memoryLimits),
        seed: String(faker.number.int({ min: 10000000, max: 99999999 })),
        difficulty: faker.helpers.arrayElement(difficulties),
        gamemode: faker.helpers.arrayElement(gamemodes),
        version: faker.helpers.arrayElement(versions),
        visibility: faker.helpers.arrayElement(['public', 'private']),
        tags: faker.helpers.arrayElement(tagList),
        motd: `§aWelcome to §l${name}§r! §eJoin our Discord!`,
        createdAt,
        expiresAt: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
      }).run();
      const newServer = db.select().from(servers).where(eq(servers.id, res.lastInsertRowid)).get();
      if (newServer) createdServers.push(newServer);
    }
  }
  console.log(`   ✅ Berhasil menggenerate ${createdServers.length} Server Minecraft dummy.`);

  // 5. Generate Transactions
  console.log('💳 Menggenerate 50 Riwayat Transaksi...');
  const amounts = [15000, 25000, 50000, 100000];
  const trxStatuses = ['success', 'success', 'success', 'pending', 'failed']; // 60% success rate
  const createdTrx = [];

  for (let i = 0; i < 50; i++) {
    const randomUser = createdUsers[faker.number.int({ min: 1, max: createdUsers.length - 1 })];
    if (!randomUser) continue;
    
    const amount = faker.helpers.arrayElement(amounts);
    const status = faker.helpers.arrayElement(trxStatuses);
    // Spread timestamps over last 60 days for nice chart graph
    const createdAt = faker.date.recent({ days: 60 });
    const planName = amount === 15000 ? 'Villager' : (amount === 25000 ? 'Spider' : (amount === 50000 ? 'Slime' : 'Wither'));
    const configObj = {
      planName,
      ram: planName === 'Villager' ? '500m' : (planName === 'Spider' ? '1g' : (planName === 'Slime' ? '2g' : '4g')),
      serverName: `${randomUser.username}'s Server`,
      duration: 1
    };

    const res = db.insert(transactions).values({
      userId: randomUser.id,
      amount,
      status,
      snapToken: `mock-snap-${faker.string.alphanumeric(16)}`,
      config: JSON.stringify(configObj),
      createdAt,
    }).run();
    createdTrx.push(res.lastInsertRowid);
  }
  console.log(`   ✅ Berhasil menggenerate ${createdTrx.length} transaksi (mendukung grafik pendapatan admin).`);

  // 6. Generate Support Tickets & Messages
  console.log('🎟️ Menggenerate 15 Tiket Dukungan & Obrolan...');
  const ticketSubjects = [
    { sub: 'Server lag saat pemain di atas 10 orang', cat: 'teknis', prio: 'high' },
    { sub: 'Gagal melakukan pembayaran Virtual Account', cat: 'pembayaran', prio: 'high' },
    { sub: 'Cara memasang plugin WorldEdit & Guard?', cat: 'pertanyaan', prio: 'low' },
    { sub: 'Request upgrade RAM paket Slime ke Wither', cat: 'pembayaran', prio: 'medium' },
    { sub: 'Console server tiba-tiba berhenti (Crash)', cat: 'teknis', prio: 'high' },
    { sub: 'Apakah bisa custom domain / IP untuk server?', cat: 'pertanyaan', prio: 'medium' },
    { sub: 'Cara ganti versi Minecraft dari 1.20 ke 1.19', cat: 'teknis', prio: 'low' },
    { sub: 'Konfirmasi pembayaran melalui QRIS', cat: 'pembayaran', prio: 'medium' },
    { sub: 'Pemain dengan nama Xx_Cheater_xX melakukan griefing', cat: 'lainnya', prio: 'high' },
    { sub: 'Bantuan setup whitelist server private', cat: 'teknis', prio: 'low' },
    { sub: 'Kapan ada promo diskon bulanan lagi?', cat: 'pertanyaan', prio: 'low' },
    { sub: 'Server Stuck di status Starting sudah 15 menit', cat: 'teknis', prio: 'high' },
    { sub: 'Cara memperpanjang masa aktif server', cat: 'pembayaran', prio: 'medium' },
    { sub: 'Apakah tersedia proteksi DDoS untuk paket basic?', cat: 'pertanyaan', prio: 'medium' },
    { sub: 'Lupa password FTP / file manager server', cat: 'teknis', prio: 'medium' }
  ];
  const ticketStatuses = ['open', 'in_progress', 'resolved', 'closed'];

  let ticketCount = 0;
  for (let i = 0; i < 15; i++) {
    const randomUser = createdUsers[faker.number.int({ min: 1, max: createdUsers.length - 1 })];
    if (!randomUser) continue;

    const tData = ticketSubjects[i] || { sub: `Pertanyaan umum #${i}`, cat: 'lainnya', prio: 'medium' };
    const status = faker.helpers.arrayElement(ticketStatuses);
    const createdAt = faker.date.recent({ days: 20 });
    const updatedAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * faker.number.int({ min: 1, max: 24 }));

    const res = db.insert(tickets).values({
      userId: randomUser.id,
      serverId: createdServers.length > 0 ? createdServers[faker.number.int({ min: 0, max: createdServers.length - 1 })].id : null,
      subject: tData.sub,
      category: tData.cat,
      priority: tData.prio,
      status,
      createdAt,
      updatedAt
    }).run();

    const ticketId = res.lastInsertRowid;
    ticketCount++;

    // Message 1: From user
    db.insert(ticket_messages).values({
      ticketId,
      senderId: randomUser.id,
      senderRole: 'user',
      message: `Halo admin, mengenai "${tData.sub}", mohon bantuannya karena saya mengalami kendala ini sejak kemarin. Terima kasih!`,
      createdAt: new Date(createdAt.getTime() + 1000 * 60 * 5)
    }).run();

    // Message 2: From admin
    db.insert(ticket_messages).values({
      ticketId,
      senderId: adminUser.id,
      senderRole: 'admin',
      message: `Halo kak @${randomUser.username}, terima kasih telah menghubungi tim MCloud! Kami sedang melakukan pengecekan pada sistem kami. Mohon ditunggu sebentar ya.`,
      createdAt: new Date(createdAt.getTime() + 1000 * 60 * 30)
    }).run();

    // Message 3: If resolved/closed, final reply
    if (status === 'resolved' || status === 'closed') {
      db.insert(ticket_messages).values({
        ticketId,
        senderId: adminUser.id,
        senderRole: 'admin',
        message: `Kendala tersebut sudah kami perbaiki dan normal kembali ya kak! Ticket ini kami tutup. Jika ada kendala lain, jangan ragu untuk membuat tiket baru. Happy Crafting! 🎮`,
        createdAt: updatedAt
      }).run();
    }
  }
  console.log(`   ✅ Berhasil menggenerate ${ticketCount} tiket beserta alur percakapan.`);

  // 7. Generate Activity Logs
  console.log('📜 Menggenerate 60 Log Aktivitas...');
  const actions = ['create_server', 'start_server', 'stop_server', 'login', 'update_password', 'create_ticket', 'pay_transaction'];
  let logCount = 0;
  for (let i = 0; i < 60; i++) {
    const randomUser = createdUsers[faker.number.int({ min: 0, max: createdUsers.length - 1 })];
    if (!randomUser) continue;
    const action = faker.helpers.arrayElement(actions);
    const createdAt = faker.date.recent({ days: 30 });
    let details = '';

    if (action.includes('server') && createdServers.length > 0) {
      const srv = createdServers[faker.number.int({ min: 0, max: createdServers.length - 1 })];
      details = JSON.stringify({ serverId: srv.id, name: srv.name });
    } else if (action === 'pay_transaction') {
      details = JSON.stringify({ amount: 50000, method: 'QRIS' });
    } else {
      details = JSON.stringify({ ip: `192.168.1.${faker.number.int({ min: 2, max: 250 })}`, userAgent: 'Mozilla/5.0' });
    }

    db.insert(activity_logs).values({
      userId: randomUser.id,
      action,
      details,
      createdAt
    }).run();
    logCount++;
  }
  console.log(`   ✅ Berhasil menggenerate ${logCount} log aktivitas.`);

  // 8. Generate Banned Players
  console.log('🚫 Menggenerate 10 Daftar Pemain Diblokir...');
  const banReasons = ['Menggunakan X-Ray Hack', 'Griefing area spawn', 'Spamming kata kasar di chat', 'Fly / Speed hack', 'Duplication glitch'];
  let banCount = 0;
  for (let i = 0; i < 10; i++) {
    if (createdServers.length === 0) break;
    const srv = createdServers[faker.number.int({ min: 0, max: createdServers.length - 1 })];
    db.insert(banned_players).values({
      serverId: srv.id,
      playerName: `Player_${faker.internet.username().slice(0, 10)}`,
      reason: faker.helpers.arrayElement(banReasons),
      createdAt: faker.date.recent({ days: 15 })
    }).run();
    banCount++;
  }
  console.log(`   ✅ Berhasil menggenerate ${banCount} catatan pemain diblokir.`);

  console.log('\n🎉 PROSES SEEDING SELESAI DENGAN SUKSES! Database siap digunakan untuk pengujian menyeluruh.');
}

seed().catch((err) => {
  console.error('❌ Terjadi kesalahan saat seeding:', err);
  process.exit(1);
});
