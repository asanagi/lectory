/**
 * Unscrapable Email Protection
 * Decodes base64-encoded user and domain attributes at runtime to prevent
 * static email scrapers and crawlers from harvesting contact addresses.
 */
export function initEmailProtection() {
  const decode = (u, d) => {
    try {
      return `${window.atob(u)}@${window.atob(d)}`;
    } catch {
      return '';
    }
  };

  // Decode clickable email links
  document.querySelectorAll('a.js-email').forEach((link) => {
    const u = link.getAttribute('data-u');
    const d = link.getAttribute('data-d');
    if (u && d) {
      const email = decode(u, d);
      if (email) {
        link.href = `mailto:${email}`;
        if (!link.textContent.trim()) {
          link.textContent = email;
        }
      }
    }
  });

  // Decode non-link text / code email displays
  document.querySelectorAll('.js-email-text').forEach((el) => {
    const u = el.getAttribute('data-u');
    const d = el.getAttribute('data-d');
    if (u && d) {
      const email = decode(u, d);
      if (email) {
        el.textContent = email;
      }
    }
  });
}

/**
 * Accessible Mobile Navigation Drawer
 * Handles hamburger button toggle, ARIA attributes, ESC dismiss,
 * and body scroll locking.
 */
export function initMobileNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('header-nav');

  if (!toggle || !header) return;

  function setOpen(isOpen) {
    toggle.setAttribute('aria-expanded', String(isOpen));
    header.classList.toggle('nav-open', isOpen);
    document.body.classList.toggle('nav-lock-scroll', isOpen);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isExpanded);
  });

  // Dismiss on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Dismiss when clicking a link inside mobile nav
  if (nav) {
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setOpen(false);
      });
    });
  }

  // Dismiss when clicking outside header
  document.addEventListener('click', (e) => {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      if (!header.contains(e.target)) {
        setOpen(false);
      }
    }
  });
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  const init = () => {
    initEmailProtection();
    initMobileNav();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

