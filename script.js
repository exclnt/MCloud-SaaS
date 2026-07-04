// script.js – Interactivity for MCloud SaaS Portfolio Showcase & Documentation

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
      navbar.style.background = 'rgba(7, 9, 14, 0.95)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(7, 9, 14, 0.8)';
    }
  });

  // Client Mockup Sidebar Switching
  const mockItems = document.querySelectorAll('.mock-sidebar .mock-item');
  const mockBannerH4 = document.querySelector('.mock-banner h4');
  const mockSubText = document.querySelector('.mock-banner .sub-text');
  const mockConsole = document.querySelector('.mock-console');

  if (mockItems.length > 0) {
    mockItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        mockItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (index === 0) {
          // My Servers
          mockBannerH4.textContent = 'Bedrock Survival SMP #01';
          mockSubText.innerHTML = 'Status: <span class="badge-online">● Online (25565)</span> • RAM: 4096 MB';
          mockConsole.innerHTML = `
            <p class="console-line">[12:04:15 INFO] Starting Minecraft Bedrock Server v1.21...</p>
            <p class="console-line">[12:04:16 INFO] IPv4 supported, port: 19132</p>
            <p class="console-line">[12:04:17 INFO] Server started successfully in 1.84 seconds!</p>
            <p class="console-cursor">&gt; _</p>
          `;
        } else if (index === 1) {
          // Billing History
          mockBannerH4.textContent = 'Active Subscription — Pro Gamer Tier';
          mockSubText.innerHTML = 'Next Billing Date: <span style="color:#60a5fa">04 Aug 2026</span> • Rp 75.000 / month';
          mockConsole.innerHTML = `
            <p class="console-line">[PAYMENT LOG] INV-20260704-0091 — Paid via Midtrans QRIS</p>
            <p class="console-line">[PAYMENT LOG] INV-20260604-0042 — Paid via BCA Virtual Account</p>
            <p class="console-line">[PAYMENT LOG] INV-20260504-0011 — Paid via GoPay Instant</p>
            <p class="console-cursor">&gt; Status: All Invoices Settled _</p>
          `;
        } else if (index === 2) {
          // Support Tickets
          mockBannerH4.textContent = 'Ticket #8821: Port Allocation Query';
          mockSubText.innerHTML = 'Status: <span style="color:#34d399">Resolved</span> • Department: DevOps Support';
          mockConsole.innerHTML = `
            <p style="color:#94a3b8; font-size:0.75rem;">[User]: How do I bind a custom domain UDP to my Bedrock server?</p>
            <p class="console-line">[Admin]: You can point an SRV record to your assigned node IPv4 and port 19132 in Cloudflare!</p>
            <p style="color:#94a3b8; font-size:0.75rem;">[User]: That worked instantly! Thanks team!</p>
            <p class="console-cursor">&gt; Ticket Closed _</p>
          `;
        }
      });
    });
  }

  // Restart Server Simulation Button
  const btnRestart = document.querySelector('.mock-btn-action');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      btnRestart.textContent = 'Restarting...';
      btnRestart.style.background = '#e11d48';
      mockConsole.innerHTML = `
        <p style="color:#facc15;">[12:05:00 WARN] Sending stop signal to container mcloud-node-01...</p>
        <p style="color:#94a3b8;">[12:05:01 INFO] Container stopped. Re-binding unix:///var/run/docker.sock...</p>
        <p class="console-line">[12:05:02 INFO] Server started successfully in 1.42 seconds!</p>
        <p class="console-cursor">&gt; Server Online _</p>
      `;
      setTimeout(() => {
        btnRestart.textContent = 'Restart Server';
        btnRestart.style.background = '#1e293b';
      }, 2000);
    });
  }

  // Payment Method Switching
  const payMethods = document.querySelectorAll('.pay-methods .method');
  const qrText = document.querySelector('.qr-placeholder span');
  const qrSub = document.querySelector('.qr-placeholder small');

  if (payMethods.length > 0) {
    payMethods.forEach((method, index) => {
      method.addEventListener('click', () => {
        payMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');

        if (index === 0) {
          qrText.textContent = '📱 Scan QRIS';
          qrSub.textContent = 'Auto-Verified Webhook';
        } else if (index === 1) {
          qrText.textContent = '🏦 8810-2938-1029';
          qrSub.textContent = 'BCA Virtual Account';
        } else if (index === 2) {
          qrText.textContent = '💳 89200-1928392';
          qrSub.textContent = 'Mandiri Bill Code';
        }
      });
    });
  }

  // Smooth appearance of feature cards on scroll
  const observerOptions = {
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .doc-card, .showcase-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(card);
  });
});
