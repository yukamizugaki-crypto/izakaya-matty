/* ============================================================
   居酒屋 matty - script.js
   ============================================================ */

(function () {
  'use strict';

  /* ========== Header Scroll Effect & Nav Highlight ========== */
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const pcNavLinks = document.querySelectorAll('.global-nav .nav-link:not(.nav-link--reserve)');

  function highlightNavLink() {
    let current = '';
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 120) {
        current = sec.getAttribute('id');
      }
    });
    pcNavLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    highlightNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ========== Hamburger / Drawer ========== */
  const hamburgerBtn   = document.getElementById('hamburger-btn');
  const drawerEl       = document.getElementById('drawer-nav');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const overlay        = document.getElementById('mobile-overlay');

  // Focus trap helpers
  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function openDrawer() {
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');

    drawerEl.classList.add('is-open');
    drawerEl.setAttribute('aria-hidden', 'false');

    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

    // Move focus into drawer
    setTimeout(function () {
      const focusable = getFocusable(drawerEl);
      if (focusable.length) focusable[0].focus();
    }, 50);
  }

  function closeDrawer() {
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'メニューを開く');

    drawerEl.classList.remove('is-open');
    drawerEl.setAttribute('aria-hidden', 'true');

    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    // Return focus to hamburger button
    hamburgerBtn.focus();
  }

  hamburgerBtn.addEventListener('click', function () {
    drawerEl.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  drawerCloseBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close when a drawer nav link is clicked
  drawerEl.querySelectorAll('.drawer-nav-link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer logo link (goes to top)
  const drawerLogoLink = document.getElementById('drawer-logo-link');
  if (drawerLogoLink) {
    drawerLogoLink.addEventListener('click', closeDrawer);
  }

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawerEl.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Focus trap inside drawer
  document.addEventListener('keydown', function (e) {
    if (!drawerEl.classList.contains('is-open') || e.key !== 'Tab') return;

    const focusable = getFocusable(drawerEl);
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ========== Hero Slideshow (5s Interval) ========== */
  const slides = document.querySelectorAll('#hero-slideshow .hero-slide');
  let currentSlide = 0;

  function nextSlide() {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 5000);
  }

  /* ========== Scroll Fade-In Animations ========== */
  const fadeTargets = document.querySelectorAll(
    '.feature-card, .menu-card, .menu-wide, .info-card, ' +
    '.about-lead, .about-body, .about-tags, ' +
    '.access-info, .access-map, ' +
    '.contact-block, .section-header'
  );

  fadeTargets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    fadeTargets.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show all immediately
    fadeTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ========== Smooth Scroll for anchor links ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
