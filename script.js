// ── Dropdown navigation ──
document.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = toggle.closest('.nav-dropdown');
    const isOpen = dropdown.classList.contains('open');

    // Close all open dropdowns first
    document.querySelectorAll('.nav-dropdown.open').forEach((d) => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

// Close dropdowns on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown.open').forEach((d) => {
    d.classList.remove('open');
    d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
  });
});

// Close dropdowns on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-dropdown.open').forEach((d) => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  }
});

// ── Mobile hamburger toggle ──
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav when a plain nav link is clicked
  mainNav.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav when a dropdown item is clicked
  mainNav.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Contact form ──
const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const community = formData.get('community');

    alert(
      `Thank you, ${name}! Your message has been received from ${community}. The MFA Ambassadors Media Team will be in touch with you at ${phone} shortly.`
    );
    form.reset();
  });
}
