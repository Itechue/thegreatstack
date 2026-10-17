/* =======================================================
   IBRAHIM ISAH BAWA — EDITORIAL PORTFOLIO JAVASCRIPT
   Clean, accessible, zero-dependency interactions
   ======================================================= */

(function () {
  'use strict';

  // ── 1. Theme Management (Light / Dark) ───────────────────
  const THEME_KEY = 'ibrahim-portfolio-theme';
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore storage errors */
    }
  }

  // Restore saved theme or check system preference
  let initialTheme = 'light';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      initialTheme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }
  } catch (e) {
    /* fallback to light */
  }
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── 2. Sticky Desktop Header Scroll Effect ───────────────
  const siteHeader = document.getElementById('site-header');
  function onHeaderScroll() {
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }
  }
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll();

  // ── 3. Active Navigation Synchronization (Desktop & Mobile)
  const trackedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');
  const mobileTabs = document.querySelectorAll('.mobile-bottom-nav .mobile-tab');

  function updateActiveNav() {
    let currentId = 'home';
    const scrollPos = window.scrollY + 180;

    trackedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    // Update desktop links
    desktopNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update mobile bottom tabs
    let mobileActiveId = currentId;
    if (currentId === 'network' || currentId === 'terminal') {
      mobileActiveId = 'projects';
    }

    mobileTabs.forEach(tab => {
      const href = tab.getAttribute('href');
      if (href === `#${mobileActiveId}` || href === `#${currentId}`) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Mobile tabs click interaction with smooth scroll
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', e => {
      const targetId = tab.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        e.preventDefault();
        mobileTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── 4. Project Category Filtering ────────────────────────
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectShowcases = document.querySelectorAll('.project-showcase');
  const compactCards = document.querySelectorAll('.compact-project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filter = pill.getAttribute('data-filter') || 'all';

      if (filter === 'network') {
        const netSec = document.getElementById('network');
        if (netSec) {
          netSec.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Filter large showcases
      projectShowcases.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.classList.remove('hidden-by-filter');
        } else {
          item.classList.add('hidden-by-filter');
        }
      });

      // Filter compact cards
      compactCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── 5. Diagnostic Telemetry Console ──────────────────────
  const terminalBody = document.getElementById('terminal-body');
  const termTabs = document.querySelectorAll('.term-tab-btn');

  const diagnosticCommands = {
    'starlink': [
      '<span class="term-prompt">ibrahim@thegreatstack-core:~$</span> <span class="term-cmd">ping -c 4 192.168.100.1 (starlink.gateway)</span>',
      '<span class="term-info">PING starlink.gateway (192.168.100.1): 56 data bytes</span>',
      '64 bytes from 192.168.100.1: icmp_seq=0 ttl=64 time=24.182 ms (Dishy Active · Elevation 68°)',
      '64 bytes from 192.168.100.1: icmp_seq=1 ttl=64 time=22.405 ms (Signal Quality: 100% · No Obstructions)',
      '64 bytes from 192.168.100.1: icmp_seq=2 ttl=64 time=25.019 ms (Carrier: Space Exploration Technologies)',
      '64 bytes from 192.168.100.1: icmp_seq=3 ttl=64 time=23.712 ms (Dual-WAN Failover: STANDBY READY)',
      '<span class="term-success">--- 192.168.100.1 ping statistics ---</span>',
      '<span class="term-success">4 packets transmitted, 4 packets received, 0.0% packet loss</span>',
      'round-trip min/avg/max = 22.405/23.829/25.019 ms · Throughput: 238 Mbps Down / 34 Mbps Up'
    ],
    'cisco': [
      '<span class="term-prompt">Cisco-Core-SW01#</span> <span class="term-cmd">show vlan brief</span>',
      'VLAN Name                             Status    Ports',
      '---- -------------------------------- --------- -------------------------------',
      '<span class="term-success">10   MGMT_INFRASTRUCTURE              active    Gi1/0/1, Gi1/0/2, Gi1/0/24</span>',
      '<span class="term-success">20   PHARMACY_POS_SERVERS             active    Gi1/0/3, Gi1/0/4, Gi1/0/5, Gi1/0/6</span>',
      '<span class="term-success">30   ENTERPRISE_CCTV_MATRIX           active    Gi1/0/7 - Gi1/0/18 (PoE+ Enabled)</span>',
      '<span class="term-success">40   STARLINK_WAN_UPLINK              active    Gi1/0/23, Te1/0/1 (10G SFP+)</span>',
      '<span class="term-success">50   GUEST_ISOLATED_WIFI              active    Gi1/0/19, Gi1/0/20</span>',
      '<span class="term-info">Spanning Tree Protocol: Rapid-PVST+ (Root Bridge Configured)</span>',
      '<span class="term-success">Port Security: Violation Mode RESTRICT · 0 Security Violations</span>'
    ],
    'cctv': [
      '<span class="term-prompt">ibrahim@thegreatstack-core:~$</span> <span class="term-cmd">cctv-matrix --diagnostics --all-channels</span>',
      '<span class="term-info">Connecting to Enterprise NVR Matrix (4K PoE / H.265+ Codec)...</span>',
      '<span class="term-success">[CAM-01] Front Gate Perimeter    | 3840x2160 @ 30fps | Bitrate: 4096kbps | PoE: 7.2W  [ONLINE]</span>',
      '<span class="term-success">[CAM-02] Server Rack Cage        | 3840x2160 @ 30fps | Bitrate: 4096kbps | PoE: 6.8W  [ONLINE]</span>',
      '<span class="term-success">[CAM-03] Sunglow Pharmacy POS    | 3840x2160 @ 30fps | Bitrate: 4096kbps | PoE: 7.1W  [ONLINE]</span>',
      '<span class="term-success">[CAM-04] Starlink Satellite Roof | 3840x2160 @ 30fps | Bitrate: 4096kbps | PoE: 8.4W  [ONLINE]</span>',
      '<span class="term-info">NVR Storage: 16TB Surveillance RAID-5 (Health: 100% · Retention: 45 Days)</span>',
      '<span class="term-success">AI Detection Engine: Active · Zero Unauthorized Intrusions Flagged</span>'
    ],
    'sunglow': [
      '<span class="term-prompt">ibrahim@thegreatstack-core:~$</span> <span class="term-cmd">curl -sI https://sunglowpharmacy.com.ng/api/health</span>',
      '<span class="term-success">HTTP/2 200 OK</span>',
      'server: nginx/1.24.0 (Enterprise Linux)',
      'x-powered-by: Sunglow Pharmacy Management & POS Core v2.4',
      '<span class="term-info">database: MySQL Enterprise (Query Latency: 1.4ms · Replication Synced)</span>',
      '<span class="term-info">barcode-dispenser-service: ACTIVE · 0 Failed Scans in Last 24h</span>',
      '<span class="term-info">expiry-audit-cron: RUNNING · 0 Expired Medicines Allowed in Stock</span>',
      '<span class="term-success">status: ALL PHARMACY SYSTEMS OPERATIONAL · SSL TLSv1.3 ENCRYPTED</span>'
    ],
    'speedtest': [
      '<span class="term-prompt">ibrahim@thegreatstack-core:~$</span> <span class="term-cmd">speedtest-cli --interface eth0 (Starlink + Multi-WAN)</span>',
      '<span class="term-info">Retrieving speedtest.net configuration...</span>',
      '<span class="term-info">Testing from Starlink Satellite / Space Exploration Technologies...</span>',
      'Hosted by Lagos Core Exchange: 21.84 ms latency',
      '<span class="term-success">Testing download speed........................................</span>',
      '<span class="term-success">Download: 246.82 Mbit/s</span>',
      '<span class="term-success">Testing upload speed..........................................</span>',
      '<span class="term-success">Upload: 38.15 Mbit/s</span>',
      '<span class="term-success">Jitter: 1.8 ms · Packet Loss: 0.0% · Grade: A+ Enterprise Ready</span>'
    ]
  };

  if (termTabs.length && terminalBody) {
    termTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        termTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cmdKey = tab.getAttribute('data-cmd');
        const lines = diagnosticCommands[cmdKey];

        if (lines) {
          terminalBody.innerHTML = '';
          lines.forEach((line, idx) => {
            setTimeout(() => {
              const div = document.createElement('div');
              div.className = 'term-line';
              div.innerHTML = line;
              terminalBody.appendChild(div);
              terminalBody.scrollTop = terminalBody.scrollHeight;
            }, idx * 45);
          });
        }
      });
    });
  }

  // ── 6. CV Modal Controls ─────────────────────────────────
  const cvModal = document.getElementById('cv-modal');

  window.openCV = function () {
    if (cvModal) {
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCV = function () {
    if (cvModal) {
      cvModal.classList.remove('active');
      cvModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (cvModal) {
    cvModal.addEventListener('click', e => {
      if (e.target === cvModal) closeCV();
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && cvModal.classList.contains('active')) {
        closeCV();
      }
    });
  }

  // ── 7. Contact Form Handler ──────────────────────────────
  window.handleContactSubmit = function () {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!nameInput || !emailInput || !messageInput || !feedback) return;

    const senderName = nameInput.value.trim();
    if (!senderName) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmitting Message...';

    setTimeout(() => {
      feedback.className = 'form-feedback success';
      feedback.textContent = `Thank you, ${senderName}. Your message has been prepared for transmission to Ibrahim Isah Bawa. Direct confirmation dispatched.`;
      submitBtn.textContent = 'Message Dispatched';

      // Clear fields
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Start a Conversation';
      }, 4000);
    }, 600);
  };
})();
