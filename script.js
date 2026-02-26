/* ─────────────────────────────────────────────
   Portfolio — vanilla JS
   Handles: dark mode · sticky header · scroll
   reveal · mobile menu
   ───────────────────────────────────────────── */

(function () {
    'use strict';

    // ── Theme ──────────────────────────────────
    const THEME_KEY = 'portfolio-theme';
    const html = document.documentElement;
    const toggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    // Restore saved theme, or fall back to OS preference
    const saved = localStorage.getItem(THEME_KEY);
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || prefers);

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });


    // ── Sticky header ──────────────────────────
    const header = document.getElementById('site-header');

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load


    // ── Mobile menu ────────────────────────────
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    menuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
        });
    });


    // ── Scroll Reveal ──────────────────────────
    // .fade-up elements (hero) are triggered after a short load delay.
    // .reveal elements (sections) are triggered by IntersectionObserver.

    // Hero fade-ups — trigger after a minimal load delay so styles are painted
    window.addEventListener('load', () => {
        document.querySelectorAll('.fade-up').forEach(el => {
            el.classList.add('visible');
        });
    });

    // Section reveals via IntersectionObserver
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger children if they are .reveal siblings
                    const siblings = entry.target.parentElement
                        ? Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'))
                        : [];

                    if (siblings.length > 1 && siblings.includes(entry.target)) {
                        const idx = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = (idx * 0.07) + 's';
                    }

                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));


    // ── Smooth active nav link highlight ───────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        let current = '';
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            if (top < 140) current = section.id;
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').slice(1); // strip #
            link.style.color = href === current
                ? 'var(--text)'
                : '';
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ── CV Modal Logic ─────────────────────────
    const cvModal = document.getElementById('cv-modal');

    window.openCV = function () {
        cvModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeCV = function () {
        cvModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on click outside modal container
    cvModal.addEventListener('click', (e) => {
        if (e.target === cvModal) closeCV();
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cvModal.classList.contains('active')) closeCV();
    });

})();
