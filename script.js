// script.js — Clean Professional Documentation Scripts for MCloud SaaS

document.addEventListener('DOMContentLoaded', () => {
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
});
