/* ===== SCROLL BEHAVIOR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// Hamburger menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ===== MENU TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const menuItems = document.querySelectorAll('.menu-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update active button
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide items with animation
    menuItems.forEach(item => {
      if (item.dataset.tab === tab) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== FADE IN ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
    }
  });
}, { threshold: 0.1 });

// Add fade-in to animatable elements
const animatables = document.querySelectorAll(
  '.feature-card, .menu-item, .review-card, .about-img, .gal-item, .cat-item, .contact-item, .stat'
);
animatables.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== RESERVATION HANDLER =====
function handleReservation() {
  const name = document.getElementById('res-name').value.trim();
  const date = document.getElementById('res-date').value;
  const guests = document.getElementById('res-guests').value;

  if (!name || !date || !guests) {
    showToast('Please fill in all fields to reserve your table.', false);
    return;
  }

  const dateStr = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  showToast(`Table for ${guests} on ${dateStr} — confirmed! See you, ${name}! ☕`);

  // Reset
  document.getElementById('res-name').value = '';
  document.getElementById('res-date').value = '';
  document.getElementById('res-guests').value = '';
}

// ===== TOAST =====
function showToast(message, success = true) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  const icon = toast.querySelector('.toast-icon');
  msg.textContent = message;
  icon.textContent = success ? '✓' : '⚠';
  toast.style.borderLeftColor = success ? 'var(--gold)' : '#e74c3c';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== SMOOTH SCROLL OFFSET for fixed nav =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let startTime = null;
  const duration = 2000;
  const isDecimal = String(target).includes('.');
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = isDecimal
      ? (progress * target).toFixed(1)
      : Math.floor(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.dataset.skip) return;
      animateCounter(el, parseFloat(el.dataset.target), el.dataset.suffix || '');
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

// Set data attrs for counters
const statNums = document.querySelectorAll('.stat-num');
statNums.forEach(el => {
  const raw = el.textContent.trim();
  if (raw.includes('K')) {
    el.dataset.target = '50'; el.dataset.suffix = 'K';
    statsObserver.observe(el);
  } else if (raw.includes('+')) {
    el.dataset.target = '8'; el.dataset.suffix = '+';
    statsObserver.observe(el);
  } else if (raw.includes('★')) {
    // Keep as-is; animate decimal
    el.dataset.target = '4.9'; el.dataset.suffix = '★';
    el.textContent = '0.0★';
    statsObserver.observe(el);
  }
});

// ===== CSS KEYFRAME for menu tab switch =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== SET MIN DATE for reservation =====
const resDate = document.getElementById('res-date');
if (resDate) {
  const today = new Date().toISOString().split('T')[0];
  resDate.min = today;
}