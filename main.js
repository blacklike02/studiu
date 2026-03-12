// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
});

function animateFollower() {
  followerX += (mouseX - followerX - 18) * 0.12;
  followerY += (mouseY - followerY - 18) * 0.12;
  follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .pillar, .principle-card, .model-card, .eco-pillar').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', ''));
});

// ─── PROGRESS BAR + HEADER SHADOW + BACK TO TOP ───
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('progress').style.width = (scrollTop / docHeight * 100) + '%';
  document.getElementById('mainHeader').classList.toggle('scrolled', scrollTop > 20);
  document.getElementById('backToTop').classList.toggle('visible', scrollTop > 400);
});

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 0.05) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ───
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const num = entry.target.querySelector('[data-target]');
      if (num && !num.classList.contains('counted')) {
        num.classList.add('counted');
        animateCounter(num, parseInt(num.dataset.target));
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-item').forEach(el => counterObserver.observe(el));

// ─── INNOVATION BARS ───
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.rule-bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animate'), i * 200);
      });
      barObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const barSection = document.querySelector('.innovation-section');
if (barSection) barObserver.observe(barSection);

// ─── MOBILE NAV ───
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

// ─── SMOOTH ANCHOR SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── STAGGERED PRINCIPLE CARDS ───
const cards = document.querySelectorAll('.principle-card');
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(cards).indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.07) + 's';
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
cards.forEach(c => cardObserver.observe(c));
