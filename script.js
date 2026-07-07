// script.js — Clean Professional Documentation Scripts for MCloud SaaS

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Navbar Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinksMenu = document.getElementById('nav-links');

  if (navToggle && navLinksMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when any navigation link is clicked
    const navItems = navLinksMenu.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Add active state highlight to documentation links based on scroll position
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('.doc-section');

  if (navLinks.length > 0 && sections.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSection = '';
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.style.color = '#38bdf8';
        }
      });
    });
  }

  // Gallery Filter Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox Modal Logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let currentVisibleCards = [];
  let currentIndex = 0;

  function updateVisibleCards() {
    currentVisibleCards = Array.from(galleryCards).filter(card => !card.classList.contains('hidden'));
  }

  function renderLightbox(index) {
    if (currentVisibleCards.length === 0) return;
    if (index < 0) {
      currentIndex = currentVisibleCards.length - 1;
    } else if (index >= currentVisibleCards.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const card = currentVisibleCards[currentIndex];
    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title');
    const badge = card.getAttribute('data-badge');
    const desc = card.getAttribute('data-desc');

    lightboxImg.setAttribute('src', src);
    lightboxTitle.textContent = title || '';
    lightboxBadge.textContent = badge || '';
    lightboxDesc.textContent = desc || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentVisibleCards.length}`;
  }

  function openLightbox(card) {
    updateVisibleCards();
    const index = currentVisibleCards.indexOf(card);
    if (index !== -1) {
      renderLightbox(index);
      lightboxModal.classList.add('open');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      renderLightbox(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      renderLightbox(currentIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      renderLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      renderLightbox(currentIndex + 1);
    }
  });
});

