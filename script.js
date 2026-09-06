/* ===================================
   PIXELSYNTAX AGENCY — SCRIPTS
   =================================== */

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
});

function animateFollower() {
  followerX += (mouseX - followerX - 18) * 0.12;
  followerY += (mouseY - followerY - 18) * 0.12;
  cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Grow cursor on interactive elements
document.querySelectorAll('a, button, .port-card, .service-card, .ptab-btn, .svc-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorFollower.style.width = '56px';
    cursorFollower.style.height = '56px';
    cursorFollower.style.borderColor = 'rgba(168, 85, 247, 0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursorFollower.style.width = '36px';
    cursorFollower.style.height = '36px';
    cursorFollower.style.borderColor = 'rgba(168, 85, 247, 0.5)';
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 140;
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

// ===== TYPING ANIMATION =====
const words = ['Websites', 'CRM Systems', 'Brand Identities', 'Digital Products', 'Experiences'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
  const currentWord = words[wordIndex];
  const speed = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex <= currentWord.length) {
    typingEl.textContent = currentWord.slice(0, charIndex++);
  } else if (isDeleting && charIndex >= 0) {
    typingEl.textContent = currentWord.slice(0, charIndex--);
  }

  if (!isDeleting && charIndex > currentWord.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1800); // Pause before deleting
    return;
  }

  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    charIndex = 0;
    setTimeout(typeEffect, 400);
    return;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

// ===== PORTFOLIO TABS =====
const ptabBtns = document.querySelectorAll('.ptab-btn');
const portCards = document.querySelectorAll('.port-card');

ptabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.ptab;

    ptabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    portCards.forEach((card, i) => {
      const match = tab === 'all' || card.dataset.ptab === tab;
      if (match) {
        card.classList.remove('hidden');
        card.style.animation = `fadeInScale 0.4s ease ${i * 0.05}s both`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== FADE IN ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

const animatables = document.querySelectorAll(
  '.service-card, .why-card, .port-card, .testi-card, .process-step, .stat-item, .cdetail, .astat'
);
animatables.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== STATS COUNTER =====
function animateCounter(el, target, suffix = '') {
  let start = null;
  const duration = 2000;
  const isDecimal = String(target).includes('.');
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value = isDecimal
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target);
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
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  statsObserver.observe(el);
});

// ===== CONTACT FORM =====
function handleContact(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const service = document.getElementById('contact-service').value;
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !service || !message) {
    showToast('Please fill in all required fields.', false);
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    showToast(`Thanks ${name}! We'll be in touch within 24 hours. 🚀`);
    e.target.reset();
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  }, 1200);
}

// ===== TOAST =====
function showToast(message, success = true) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  const icon = toast.querySelector('.toast-icon');
  msg.textContent = message;
  icon.textContent = success ? '✓' : '⚠';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ===== SMOOTH SCROLL =====
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

// ===== INJECT KEYFRAMES =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.96) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

// ===== PARALLAX HERO IMAGE =====
const heroImg = document.getElementById('hero-image');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const scrolled = window.scrollY;
  heroImg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
});

// ===== SERVICE CARD IMAGE TILT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = (y - centerY) / centerY * -3;
    const rotY = (x - centerX) / centerX * 3;
    card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

// ===== FLOATING WHATSAPP WIDGET INTERACTION =====
const waBubbleBtn = document.getElementById('wa-bubble-btn');
const waPopupCard = document.getElementById('wa-popup-card');
const waPopupCloseBtn = document.getElementById('wa-popup-close-btn');
const waPillLabel = document.getElementById('wa-pill-label');
const waUnreadBadge = document.getElementById('wa-unread-badge');

if (waBubbleBtn && waPopupCard) {
  function toggleWaPopup(open) {
    const isOpen = open !== undefined ? open : !waPopupCard.classList.contains('open');
    waPopupCard.classList.toggle('open', isOpen);
    waPopupCard.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen && waUnreadBadge) {
      waUnreadBadge.style.display = 'none';
    }
  }

  waBubbleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWaPopup();
  });

  if (waPopupCloseBtn) {
    waPopupCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWaPopup(false);
    });
  }

  // Prevent clicks inside popup from closing it
  waPopupCard.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#wa-widget-wrap')) {
      toggleWaPopup(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && waPopupCard.classList.contains('open')) {
      toggleWaPopup(false);
    }
  });

  // Auto nudge after 4 seconds if not opened yet
  setTimeout(() => {
    if (!waPopupCard.classList.contains('open') && waPillLabel) {
      waPillLabel.style.transform = 'scale(1.06)';
      waPillLabel.style.borderColor = 'rgba(37, 211, 102, 0.8)';
      setTimeout(() => {
        waPillLabel.style.transform = '';
        waPillLabel.style.borderColor = '';
      }, 1500);
    }
  }, 4000);
}
