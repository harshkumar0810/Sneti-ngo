
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initTestimonialSlider();
  initDonateAmounts();
  initForms();
  initProgramModal();
  initLightbox();
  setActiveNavLink();
  initScrollProgress();
  initBackToTop();
  initGalleryFilters();
  initImpactBars();
  initImpactCalculator();
  initLanguageToggle();
});

function initHeader() {
  const header = document.querySelector('.header:not(.header--inner)');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}


function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const total = dots.length;

  const goTo = index => {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  setInterval(() => goTo((current + 1) % total), 5000);
}

function initDonateAmounts() {
  const amounts = document.querySelectorAll('.donate-amount');
  const customInput = document.querySelector('#custom-amount');
  if (!amounts.length) return;

  amounts.forEach(amount => {
    amount.addEventListener('click', () => {
      amounts.forEach(a => a.classList.remove('selected'));
      amount.classList.add('selected');
      if (customInput) customInput.value = amount.dataset.value || '';
    });
  });
}

function initForms() {
  const contactForm = document.querySelector('#contact-form');
  const donateForm = document.querySelector('#donate-form');
  const volunteerForm = document.querySelector('#volunteer-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      if (contactForm.action.includes('formsubmit.co')) {
        e.preventDefault();
        try {
          const res = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
          });
          if (res.ok) {
            showToast('Thank you! We\'ll get back to you within 48 hours. 🙏');
            contactForm.reset();
          } else {
            showToast('Something went wrong. Please try WhatsApp or email us directly.');
          }
        } catch {
          showToast('Network error. Please email contact@nayepankh.com directly.');
        }
      } else {
        e.preventDefault();
        showToast('Thank you! We\'ll get back to you within 48 hours. 🙏');
        contactForm.reset();
      }
    });
  }

  if (donateForm) {
    donateForm.addEventListener('submit', e => {
      e.preventDefault();
      openModal('donate-success');
      donateForm.reset();
      document.querySelectorAll('.donate-amount').forEach(a => a.classList.remove('selected'));
    });
  }

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Welcome to the Sneti family! We\'ll contact you soon. 💚');
      volunteerForm.reset();
    });
  }
}

function initProgramModal() {
  const cards = document.querySelectorAll('[data-program]');
  const modal = document.querySelector('#program-modal');
  if (!cards.length || !modal) return;


  const data = {
    education: {
      title: 'Shiksha Setu — Education for All',
      icon: '<i class="fa-solid fa-book-open"></i>',
      desc: 'We distribute school bags, books, pens and stationery to underprivileged children across Uttar Pradesh. Our volunteers also provide tuition support and organize cultural programs to nurture talent.',
      impact: ['School kits for hundreds of children', 'Featured in Hindustan & Dainik Jagran', 'Cultural programs for youth talent']
    },
    food: {
      title: 'Anna Daan — Hunger Relief',
      icon: '<i class="fa-solid fa-utensils"></i>',
      desc: 'Regular food distribution drives ensuring no one in our communities goes hungry. Our volunteers prepare and serve meals to needy families across Saharanpur and Kanpur.',
      impact: ['Weekly food drives in multiple villages', 'Featured in Amar Ujala', 'Instagram @one_pankh documents every drive']
    },
    sanitary: {
      title: 'Swasthya Sahay — Health & Sanitation',
      icon: '<i class="fa-solid fa-kit-medical"></i>',
      desc: 'Sanitary pad distribution drives and health awareness programs for women and girls. We break taboos and ensure access to basic hygiene products in rural UP.',
      impact: ['Sanitary pad drives across villages', 'Health awareness for women & girls', 'Community health camps']
    },
    environment: {
      title: 'Hariyali Abhiyan — Green Earth',
      icon: '<i class="fa-solid fa-leaf"></i>',
      desc: 'Tree plantation drives and plastic-free village campaigns. Youth volunteers lead environmental initiatives across Uttar Pradesh.',
      impact: ['10,000+ trees planted', 'Plastic-free village campaigns', 'Featured in Dainik Jagran']
    },
    culture: {
      title: 'Kala Setu — Youth & Culture',
      icon: '<i class="fa-solid fa-masks-theater"></i>',
      desc: 'Dance, song and drama programs organized for students to showcase their talent. We believe art and culture are essential for holistic development.',
      impact: ['Cultural events across UP villages', 'Platform for student talent', 'Awards and recognition for performers']
    },
    awareness: {
      title: 'Jaagrukta — Awareness & Rights',
      icon: '<i class="fa-solid fa-scale-balanced"></i>',
      desc: 'Community awareness programs on social rights, equality, civic responsibility and women\'s empowerment across rural Uttar Pradesh.',
      impact: ['Rights awareness in villages', 'Women empowerment programs', 'Youth civic education']
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.program;
      const program = data[key];
      if (!program) return;

      modal.querySelector('.modal-icon').innerHTML = program.icon;
      modal.querySelector('.modal-title').textContent = program.title;
      modal.querySelector('.modal-desc').textContent = program.desc;

      const impactList = modal.querySelector('.modal-impact');
      impactList.innerHTML = program.impact.map(i => `<li>${i}</li>`).join('');

      openModal('program-modal');
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.lightbox || el.querySelector('img')?.src;
      if (!src) return;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initGalleryFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-grid--full .gallery-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

function initImpactBars() {
  const fills = document.querySelectorAll('.impact-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width || '0%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

function initImpactCalculator() {
  const slider = document.getElementById('donation-slider');
  const amountDisplay = document.getElementById('slider-amount');
  if (!slider) return;

  const update = () => {
    const amount = parseInt(slider.value, 10);
    if (amountDisplay) amountDisplay.textContent = `₹${amount.toLocaleString('en-IN')}`;

    const meals = document.getElementById('calc-meals');
    const children = document.getElementById('calc-children');
    const trees = document.getElementById('calc-trees');
    if (meals) meals.textContent = Math.floor(amount / 100);
    if (children) children.textContent = Math.floor(amount / 500);
    if (trees) trees.textContent = Math.floor(amount / 100);
  };

  slider.addEventListener('input', update);
  update();
}

function initLanguageToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  let lang = localStorage.getItem('np-lang') || 'en';

  const apply = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[lang][key]) {
        if (lang === 'en' && key === 'hero.title') {
          el.innerHTML = 'Giving <span style="color:var(--gold)">New Wings</span> to Every Dream';
        } else {
          el.textContent = I18N[lang][key];
        }
      }
    });
    btn.textContent = lang === 'en' ? 'हिं' : 'EN';
    document.documentElement.lang = lang === 'en' ? 'en' : 'hi';
  };

  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'hi' : 'en';
    localStorage.setItem('np-lang', lang);
    apply();
  });

  apply();
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // threshold 0 hone par thoda sa bhi hissa screen me aaye toh instantly show karega
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    // Mobile bug fixed here: threshold ko 0 kar diya hai
    { threshold: 0, rootMargin: '0px 0px 50px 0px' } 
  );

  elements.forEach(el => observer.observe(el));


}
