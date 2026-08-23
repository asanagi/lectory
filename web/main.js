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

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailProtection);
  } else {
    initEmailProtection();
  }
}
