// script.js
const header = document.querySelector('.site-header');
let solidThreshold = 120; // will be recalculated from hero height
const updateHeader = () => {
  if (window.scrollY >= solidThreshold - 1) header.classList.add('is-solid');
  else header.classList.remove('is-solid');
};
const recalcThreshold = () => {
  const hero = document.querySelector('.hero');
  const headerHeight = header?.offsetHeight || 0;
  if (hero) {
    const top = hero.getBoundingClientRect().top + window.scrollY;
    solidThreshold = top + hero.offsetHeight - headerHeight;
  } else {
    solidThreshold = 120;
  }
  updateHeader();
};
window.addEventListener('scroll', updateHeader, { passive: true });

window.addEventListener('resize', () => { recalcThreshold(); }, { passive: true });
window.addEventListener('orientationchange', recalcThreshold);
recalcThreshold();

const toggle = document.querySelector('.nav__toggle');
const navList = document.getElementById('nav-list');
if (toggle && navList) {
  const setState = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setState(open);
  });
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setState(open);
    }
  });
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !toggle.contains(e.target)) setState(false);
  });
}

// Submenu toggle for mobile/touch - handles both About Us and Our Services dropdowns
const submenuItems = document.querySelectorAll('.nav__item--has-submenu');

submenuItems.forEach((submenuItem) => {
  const toggle = submenuItem.querySelector('.nav__link--toggle');
  if (toggle) {
    const setExpanded = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      submenuItem.classList.toggle('open', open);
    };
    
    // Click/tap toggle
    toggle.addEventListener('click', (e) => {
      // If desktop, let hover handle it; only toggle when mobile menu is open
      const isMobileMenu = navList && navList.classList.contains('is-open');
      if (!isMobileMenu) return; // desktop handled via CSS hover
      e.preventDefault();
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setExpanded(open);
    });
    
    // Close submenu when clicking outside in mobile
    document.addEventListener('click', (e) => {
      const isMobileMenu = navList && navList.classList.contains('is-open');
      if (!isMobileMenu) return;
      if (!submenuItem.contains(e.target)) setExpanded(false);
    });
  }
});

document.querySelectorAll('[data-action="shop"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    alert('Shop is a demo action in this mock.');
  });
});

// Features Section Scroll Animation
const observeElements = () => {
  const featuresSection = document.querySelector('.features');
  const featureCards = document.querySelectorAll('.feature-card');
  const featuresHeader = document.querySelector('.features__header');
  
  if (!featuresSection || !featureCards.length) return;
  
  // Set initial styles
  featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
  });
  
  if (featuresHeader) {
    featuresHeader.style.opacity = '0';
    featuresHeader.style.transform = 'translateY(30px)';
    featuresHeader.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  }
  
  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        if (element.classList.contains('features__header')) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
        
        if (element.classList.contains('feature-card')) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
        
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe header
  if (featuresHeader) {
    observer.observe(featuresHeader);
  }
  
  // Observe cards
  featureCards.forEach(card => {
    observer.observe(card);
  });
};

// Collections Section Scroll Animation
const observeCollections = () => {
  const collections = document.querySelector('.collections');
  const header = document.querySelector('.collections__header');
  const cards = document.querySelectorAll('.collection-card');
  if (!collections || (!header && !cards.length)) return;

  // Set initial styles (opacity 0 + slight translate)
  if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(20px)';
    header.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  }
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    const d = Math.min(i, 6) * 0.05; // faster stagger so items appear sooner
    card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${d}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${d}s`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      io.unobserve(el);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });

  if (header) io.observe(header);
  cards.forEach(card => io.observe(card));
};

// Enhanced card interactions
const enhanceCardInteractions = () => {
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    let isHovered = false;
    
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      
      // Add subtle tilt effect
      card.style.transform = 'translateY(-8px) scale(1.02) rotateX(2deg)';
      
      // Animate icon with delay
      const icon = card.querySelector('.feature-card__icon');
      if (icon) {
        setTimeout(() => {
          if (isHovered) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
          }
        }, 100);
      }
    });
    
    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.style.transform = '';
      
      const icon = card.querySelector('.feature-card__icon');
      if (icon) {
        icon.style.transform = '';
      }
    });
    
    // Add click ripple effect
    card.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(122, 81, 48, 0.1);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 1;
      `;
      
      card.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });
};

// Add ripple animation CSS
const addRippleAnimation = () => {
  if (document.querySelector('#ripple-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .feature-card {
      position: relative;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
};

// Arrow Key Navigation between sections
const initArrowKeyNavigation = () => {
  // Define all main sections in order
  const sections = [
    '.hero',
    '.janaki-legacy',
    '.features', 
    '.collections',
    '.project',
    '.why',
    '.testimonials',
    '.cta'
  ];
  
  let currentSectionIndex = 0;
  
  // Get section elements
  const sectionElements = sections.map(selector => document.querySelector(selector)).filter(Boolean);
  
  // Function to scroll to a section smoothly
  const scrollToSection = (index) => {
    if (index < 0 || index >= sectionElements.length) return;

    currentSectionIndex = index;

    const targetSection = sectionElements[index];
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const targetPosition = targetSection.offsetTop - headerHeight;

    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  };
  
  // Update current section based on scroll position
  const getCurrentIndex = () => {
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const scrollPosition = window.scrollY + headerHeight + 80; // slight bias into next section
    let idx = 0;
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const section = sectionElements[i];
      if (section.offsetTop <= scrollPosition) { idx = i; break; }
    }
    return idx;
  };

  const updateCurrentSection = () => {
    currentSectionIndex = getCurrentIndex();
  };
  
  // Handle arrow key navigation
  const handleKeyDown = (event) => {
    // Only handle arrow keys when not focused on input elements
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable === 'true') {
      return;
    }

    const baseIndex = getCurrentIndex();
    switch(event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        scrollToSection(baseIndex - 1);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        scrollToSection(baseIndex + 1);
        break;
    }
  };
  
  // Event listeners
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('scroll', updateCurrentSection, { passive: true });
  
  // Initial setup
  updateCurrentSection();
};

// Legacy section entrance animation
const observeLegacy = () => {
  const legacy = document.querySelector('.janaki-legacy.jl-animate');
  if (!legacy) return;
  const ob = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        legacy.classList.add('is-inview');
        ob.unobserve(legacy);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -10%' });
  ob.observe(legacy);
};

// Testimonials Section Scroll Animation
const observeTestimonials = () => {
  const testimonials = document.querySelector('.testimonials.testimonials-animate');
  const header = document.querySelector('.testimonials__header');
  const cards = document.querySelectorAll('.testimonial');
  const cta = document.querySelector('.testimonials__cta');
  if (!testimonials || (!header && !cards.length)) return;

  // Set initial styles
  if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(30px)';
    header.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  }
  
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    const delay = Math.min(i, 3) * 0.15; // stagger testimonials
    card.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
  });
  
  if (cta) {
    cta.style.opacity = '0';
    cta.style.transform = 'translateY(20px)';
    cta.style.transition = 'opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s';
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  if (header) io.observe(header);
  cards.forEach(card => io.observe(card));
  if (cta) io.observe(cta);
};


// ===================================
// Enhanced Testimonials Carousel System
// ===================================

class TestimonialsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 6000; // 6 seconds
    this.isAnimating = false;
    
    this.initCarousel();
  }
  
  initCarousel() {
    this.track = document.getElementById('testimonials-track');
    this.slides = document.querySelectorAll('.testimonials__slide');
    this.prevBtn = document.querySelector('.testimonials__nav--prev');
    this.nextBtn = document.querySelector('.testimonials__nav--next');
    this.indicators = document.querySelectorAll('.testimonials__indicator');
    
    if (!this.track || !this.slides.length) return;
    
    this.totalSlides = this.slides.length;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start auto-play
    this.startAutoPlay();
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.testimonials__carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
      carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }
  
  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isCarouselInView()) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.previousSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSlide();
        }
      }
    });
    
    // Touch/swipe support
    this.initTouchSupport();
  }
  
  initTouchSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    const carousel = document.querySelector('.testimonials__carousel');
    if (!carousel) return;
    
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.pauseAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      currentX = e.changedTouches[0].clientX;
      
      const deltaX = startX - currentX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
      
      isDragging = false;
      this.startAutoPlay();
    });
  }
  
  isCarouselInView() {
    const carousel = document.querySelector('.testimonials');
    if (!carousel) return false;
    
    const rect = carousel.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  goToSlide(slideIndex, userInitiated = true) {
    if (this.isAnimating || slideIndex === this.currentSlide) return;
    
    this.isAnimating = true;
    
    // Update active states
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');
    
    this.currentSlide = slideIndex;
    
    // Move the track
    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update active states
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
    
    // Add animation effects
    this.animateSlideContent();
    
    // Reset auto-play if user initiated
    if (userInitiated) {
      this.resetAutoPlay();
    }
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }
  
  animateSlideContent() {
    const activeSlide = this.slides[this.currentSlide];
    const testimonial = activeSlide.querySelector('.testimonial');
    
    if (testimonial) {
      // Add entrance animation
      testimonial.style.transform = 'translateY(20px)';
      testimonial.style.opacity = '0.8';
      
      requestAnimationFrame(() => {
        testimonial.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
        testimonial.style.transform = 'translateY(0)';
        testimonial.style.opacity = '1';
      });
      
      // Animate stars with stagger
      const stars = testimonial.querySelectorAll('.star');
      stars.forEach((star, index) => {
        star.style.transform = 'scale(0.8) rotate(-10deg)';
        setTimeout(() => {
          star.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          star.style.transform = 'scale(1) rotate(0deg)';
        }, 300 + index * 80);
      });
    }
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }
  
  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    this.pauseAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  
  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resetAutoPlay() {
    this.startAutoPlay();
  }
}

// Enhanced testimonial interactions and stats animation
const enhanceTestimonialInteractions = () => {
  const testimonials = document.querySelectorAll('.testimonial');
  
  testimonials.forEach(testimonial => {
    testimonial.addEventListener('mouseenter', () => {
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: radial-gradient(circle, rgba(122, 81, 48, 0.05) 0%, transparent 70%);
        border-radius: 28px;
        opacity: 0;
        animation: testimonialRipple 0.8s ease-out;
        pointer-events: none;
        z-index: 1;
      `;
      
      testimonial.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 800);
    });
  });
};

// Animate statistics numbers
const animateStatNumbers = () => {
  const statNumbers = document.querySelectorAll('.stat__number');
  let hasAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        
        statNumbers.forEach((stat, index) => {
          const finalValue = stat.textContent;
          const numberValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
          const suffix = finalValue.replace(/[\d.]/g, '');
          
          setTimeout(() => {
            if (!isNaN(numberValue)) {
              animateNumber(stat, numberValue, suffix);
            }
          }, index * 200);
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  const statsSection = document.querySelector('.testimonials__stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
};

const animateNumber = (element, finalValue, suffix) => {
  const duration = 1500;
  const steps = 40;
  const increment = finalValue / steps;
  let currentValue = 0;
  
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= finalValue) {
      currentValue = finalValue;
      clearInterval(timer);
    }
    
    const displayValue = currentValue % 1 === 0 ? Math.floor(currentValue) : currentValue.toFixed(1);
    element.textContent = displayValue + suffix;
  }, duration / steps);
};

// Add testimonial animation styles
const addTestimonialAnimations = () => {
  if (document.querySelector('#testimonial-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'testimonial-animations';
  style.textContent = `
    @keyframes testimonialRipple {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(1.1);
      }
    }
    
    .testimonials__nav:hover {
      animation: navPulse 0.6s ease-in-out;
    }
    
    @keyframes navPulse {
      0%, 100% { transform: translateY(-50%) scale(1.1); }
      50% { transform: translateY(-50%) scale(1.15); }
    }
    
    .testimonials__indicator:hover {
      animation: indicatorPulse 0.4s ease-in-out;
    }
    
    @keyframes indicatorPulse {
      0%, 100% { transform: scale(1.15); }
      50% { transform: scale(1.3); }
    }
    
    .testimonials__cta-icon {
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
};

// Initialize all testimonials functionality
const initTestimonials = () => {
  new TestimonialsCarousel();
  enhanceTestimonialInteractions();
  animateStatNumbers();
  addTestimonialAnimations();
};

// ===================================
// Ultra-Premium FAQ Accordion System
// ===================================

class FAQAccordion {
  constructor() {
    this.faqCards = document.querySelectorAll('.faq__card, .faq__item');
    this.particleSystem = null;
    this.initAccordion();
    this.initParticleSystem();
  }
  
  initAccordion() {
    if (!this.faqCards.length) return;
    
    this.faqCards.forEach((card, index) => {
      const question = card.querySelector('.faq__question');
      const answer = card.querySelector('.faq__answer');
      const icon = card.querySelector('.faq__question-icon, .faq__icon');
      
      if (!question || !answer) return;
      
      // Set initial state
      answer.setAttribute('aria-hidden', 'true');
      question.setAttribute('aria-expanded', 'false');
      
      // Add click handler
      question.addEventListener('click', () => {
        this.toggleCard(card, question, answer, icon);
      });
      
      // Add keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleCard(card, question, answer, icon);
        }
      });
      
      // Enhanced hover effects for luxury cards
      question.addEventListener('mouseenter', () => {
        if (!card.classList.contains('is-open')) {
          this.addLuxuryHoverEffect(card);
        }
      });
      
      question.addEventListener('mouseleave', () => {
        if (!card.classList.contains('is-open')) {
          this.removeLuxuryHoverEffect(card);
        }
      });
      
      // Add focus management
      question.addEventListener('focus', () => {
        this.addFocusEffect(card);
      });
      
      question.addEventListener('blur', () => {
        this.removeFocusEffect(card);
      });
    });
    
    // Initialize intersection observer for scroll animations
    this.initScrollAnimations();
    
    // Initialize particle interactions
    this.initParticleInteractions();
  }
  
  // Luxury card methods
  toggleCard(card, question, answer, icon) {
    const isOpen = card.classList.contains('is-open');
    
    if (isOpen) {
      this.closeLuxuryCard(card, question, answer, icon);
    } else {
      // Close other cards (optional - remove for multiple open cards)
      this.closeAllCards();
      this.openLuxuryCard(card, question, answer, icon);
    }
  }
  
  openLuxuryCard(card, question, answer, icon) {
    card.classList.add('is-open');
    answer.classList.add('is-open');
    answer.setAttribute('aria-hidden', 'false');
    question.setAttribute('aria-expanded', 'true');
    
    // Enhanced smooth height animation
    const content = answer.querySelector('.faq__answer-content, .faq__answer-wrapper');
    if (content) {
      const height = content.scrollHeight + 40; // Add padding
      answer.style.maxHeight = height + 'px';
    }
    
    // Luxury entrance animation
    setTimeout(() => {
      if (content) {
        content.style.animation = 'luxurySlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }, 100);
    
    // Add particle effect
    this.triggerParticleEffect(card);
    
    // Analytics tracking
    this.trackFAQInteraction(card, 'open');
    
    // Announce to screen readers
    this.announceToScreenReader(card, true);
  }
  
  closeLuxuryCard(card, question, answer, icon) {
    card.classList.remove('is-open');
    answer.classList.remove('is-open');
    answer.setAttribute('aria-hidden', 'true');
    question.setAttribute('aria-expanded', 'false');
    
    // Reset height with animation
    answer.style.maxHeight = '0px';
    
    // Analytics tracking
    this.trackFAQInteraction(card, 'close');
    
    // Announce to screen readers
    this.announceToScreenReader(card, false);
  }
  
  closeAllCards() {
    this.faqCards.forEach(card => {
      const question = card.querySelector('.faq__question');
      const answer = card.querySelector('.faq__answer');
      const icon = card.querySelector('.faq__question-icon, .faq__icon');
      
      if (card.classList.contains('is-open')) {
        this.closeLuxuryCard(card, question, answer, icon);
      }
    });
  }
  
  addLuxuryHoverEffect(card) {
    const glow = card.querySelector('.faq__card-glow');
    const questionNumber = card.querySelector('.faq__question-number');
    const icon = card.querySelector('.faq__question-icon, .faq__icon');
    
    // Activate glow effect
    if (glow) {
      glow.style.opacity = '0.5';
    }
    
    // Scale question number
    if (questionNumber) {
      questionNumber.style.transform = 'scale(1.05)';
      questionNumber.style.boxShadow = '0 4px 20px rgba(122, 81, 48, 0.2)';
    }
    
    // Enhance icon
    if (icon) {
      icon.style.transform = 'scale(1.05) rotate(5deg)';
      icon.style.boxShadow = '0 6px 25px rgba(122, 81, 48, 0.15)';
    }
  }
  
  removeLuxuryHoverEffect(card) {
    const glow = card.querySelector('.faq__card-glow');
    const questionNumber = card.querySelector('.faq__question-number');
    const icon = card.querySelector('.faq__question-icon, .faq__icon');
    
    // Deactivate glow effect
    if (glow) {
      glow.style.opacity = '0';
    }
    
    // Reset question number
    if (questionNumber) {
      questionNumber.style.transform = '';
      questionNumber.style.boxShadow = '';
    }
    
    // Reset icon
    if (icon) {
      icon.style.transform = '';
      icon.style.boxShadow = '';
    }
  }
  
  addFocusEffect(card) {
    card.style.outline = '3px solid rgba(122, 81, 48, 0.3)';
    card.style.outlineOffset = '2px';
  }
  
  removeFocusEffect(card) {
    card.style.outline = '';
    card.style.outlineOffset = '';
  }
  
  initParticleSystem() {
    const particleContainer = document.getElementById('faq-particles');
    if (!particleContainer) return;
    
    // Simple particle system for luxury effect
    this.particles = [];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(122, 81, 48, 0.3);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        transition: all 0.3s ease;
      `;
      
      // Random positioning
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      particleContainer.appendChild(particle);
      this.particles.push(particle);
    }
    
    // Animate particles
    this.animateParticles();
  }
  
  animateParticles() {
    if (!this.particles || !this.particles.length) return;
    
    const animateParticle = (particle, index) => {
      const delay = index * 200;
      
      setTimeout(() => {
        particle.style.opacity = Math.random() * 0.6;
        particle.style.transform = `translateY(-${Math.random() * 20}px)`;
        
        setTimeout(() => {
          particle.style.opacity = '0';
          particle.style.transform = 'translateY(0)';
        }, 2000);
      }, delay);
    };
    
    const startAnimation = () => {
      this.particles.forEach(animateParticle);
      setTimeout(startAnimation, 8000); // Repeat every 8 seconds
    };
    
    startAnimation();
  }
  
  initParticleInteractions() {
    // Particle effects on FAQ interactions
    this.faqCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.activateNearbyParticles(card);
      });
    });
  }
  
  activateNearbyParticles(card) {
    if (!this.particles) return;
    
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Activate particles near the card
    this.particles.forEach(particle => {
      const particleRect = particle.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(particleRect.left - centerX, 2) + 
        Math.pow(particleRect.top - centerY, 2)
      );
      
      if (distance < 200) {
        particle.style.opacity = '0.8';
        particle.style.transform = 'scale(1.5)';
        
        setTimeout(() => {
          particle.style.opacity = '0.2';
          particle.style.transform = 'scale(1)';
        }, 1000);
      }
    });
  }
  
  triggerParticleEffect(card) {
    // Create temporary particles for opening effect
    const rect = card.getBoundingClientRect();
    const container = document.querySelector('.faq');
    if (!container) return;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, var(--clr-accent), var(--clr-gold));
        border-radius: 50%;
        pointer-events: none;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        z-index: 1000;
        opacity: 1;
      `;
      
      container.appendChild(particle);
      
      // Animate particle
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0.5)`, opacity: 0 }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  }
  
  announceToScreenReader(card, isOpening) {
    const questionText = card.querySelector('.faq__question-text')?.textContent;
    if (!questionText) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    const message = isOpening 
      ? `FAQ expanded: ${questionText}`
      : `FAQ collapsed: ${questionText}`;
    
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  toggleItem(item, question, answer, icon) {
    const isOpen = item.classList.contains('is-open');
    
    if (isOpen) {
      this.closeItem(item, question, answer, icon);
    } else {
      // Close other items (optional - remove for multiple open items)
      this.closeAllItems();
      this.openItem(item, question, answer, icon);
    }
  }
  
  openItem(item, question, answer, icon) {
    item.classList.add('is-open');
    answer.classList.add('is-open');
    answer.setAttribute('aria-hidden', 'false');
    question.setAttribute('aria-expanded', 'true');
    
    // Smooth height animation
    const content = answer.querySelector('.faq__answer-content');
    if (content) {
      const height = content.scrollHeight;
      answer.style.maxHeight = height + 'px';
    }
    
    // Add entrance animation for content
    setTimeout(() => {
      if (content) {
        content.style.animation = 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }, 100);
    
    // Analytics tracking (optional)
    this.trackFAQInteraction(item, 'open');
  }
  
  closeItem(item, question, answer, icon) {
    item.classList.remove('is-open');
    answer.classList.remove('is-open');
    answer.setAttribute('aria-hidden', 'true');
    question.setAttribute('aria-expanded', 'false');
    
    // Reset height
    answer.style.maxHeight = '0px';
    
    // Analytics tracking (optional)
    this.trackFAQInteraction(item, 'close');
  }
  
  closeAllItems() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      const icon = item.querySelector('.faq__icon svg');
      
      if (item.classList.contains('is-open')) {
        this.closeItem(item, question, answer, icon);
      }
    });
  }
  
  addHoverEffect(item) {
    const icon = item.querySelector('.faq__icon');
    if (icon) {
      icon.style.transform = 'scale(1.05)';
      icon.style.boxShadow = '0 4px 12px rgba(122, 81, 48, 0.15)';
    }
  }
  
  removeHoverEffect(item) {
    const icon = item.querySelector('.faq__icon');
    if (icon) {
      icon.style.transform = '';
      icon.style.boxShadow = '';
    }
  }
  
  initScrollAnimations() {
    const faqSection = document.querySelector('.faq');
    const header = document.querySelector('.faq__header');
    const cards = document.querySelectorAll('.faq__card, .faq__item');
    const cta = document.querySelector('.faq__cta');
    
    if (!faqSection) return;
    
    // Set initial styles
    if (header) {
      header.style.opacity = '0';
      header.style.transform = 'translateY(30px)';
      header.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    }
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      const delay = Math.min(index, 6) * 0.1;
      card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
    });
    
    if (cta) {
      cta.style.opacity = '0';
      cta.style.transform = 'translateY(20px)';
      cta.style.transition = 'opacity 0.6s ease-out 0.8s, transform 0.6s ease-out 0.8s';
    }
    
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    if (header) observer.observe(header);
    cards.forEach(card => observer.observe(card));
    if (cta) observer.observe(cta);
  }
  
  trackFAQInteraction(item, action) {
    // Optional analytics tracking
    const questionText = item.querySelector('.faq__question-text')?.textContent;
    if (typeof gtag !== 'undefined') {
      gtag('event', 'faq_interaction', {
        'faq_question': questionText,
        'action': action
      });
    }
  }
  
  // Public method to open specific FAQ by index
  openFAQByIndex(index) {
    if (index >= 0 && index < this.faqItems.length) {
      const item = this.faqItems[index];
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      const icon = item.querySelector('.faq__icon svg');
      
      if (!item.classList.contains('is-open')) {
        this.toggleItem(item, question, answer, icon);
      }
    }
  }
  
  // Public method to close all FAQs
  closeAll() {
    this.closeAllItems();
  }
}

// Enhanced FAQ interactions
const enhanceFAQInteractions = () => {
  const faqItems = document.querySelectorAll('.faq__item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    
    if (question) {
      // Add ripple effect on click
      question.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        const rect = question.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(122, 81, 48, 0.1);
          border-radius: 50%;
          pointer-events: none;
          transform: scale(0);
          animation: faqRipple 0.6s ease-out;
          z-index: 1;
        `;
        
        question.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
    }
  });
};

// Add FAQ animation styles
const addFAQAnimations = () => {
  if (document.querySelector('#faq-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'faq-animations';
  style.textContent = `
    @keyframes faqRipple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    .faq__question {
      position: relative;
      overflow: hidden;
    }
    
    .faq__item:hover .faq__icon {
      animation: iconBounce 0.6s ease-in-out;
    }
    
    @keyframes iconBounce {
      0%, 100% { transform: scale(1.05); }
      50% { transform: scale(1.15); }
    }
    
    .faq__item.is-open .faq__icon {
      animation: iconRotate 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes iconRotate {
      0% { transform: rotate(0deg) scale(1.1); }
      100% { transform: rotate(45deg) scale(1.1); }
    }
  `;
  document.head.appendChild(style);
};

// Initialize FAQ system
const initFAQ = () => {
  new FAQAccordion();
  enhanceFAQInteractions();
  addFAQAnimations();
};

// ===================================
// FOOTER - Minimal Interactive Features
// ===================================

// Initialize minimal footer features when DOM is ready
function initFooterFeatures() {
  initScrollToTop();
  initSocialLinks();
}

// Simple Scroll to Top functionality
function initScrollToTop() {
  const button = document.querySelector('.scroll-to-top');
  if (!button) return;

  let isVisible = false;

  function toggleVisibility() {
    const shouldShow = window.pageYOffset > 300;
    
    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      button.classList.toggle('visible', isVisible);
    }
  }

  // Check scroll position
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  
  // Smooth scroll to top on click
  button.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial check
  toggleVisibility();
}

// Simple Social Media Links
function initSocialLinks() {
  const socialLinks = document.querySelectorAll('.footer__social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // For demo purposes - in real site these would link to actual social profiles
      e.preventDefault();
      
      const platform = this.getAttribute('href')?.split('/').pop() || 'social media';
      console.log(`Opening ${platform} page`);
      
      // Simple feedback
      showSimpleToast(`Opening ${platform} page...`);
    });
  });
}

// Simple toast notification
function showSimpleToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--clr-accent);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });
  
  // Hide and remove toast
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Initialize features animations when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addRippleAnimation();
    observeElements();
    enhanceCardInteractions();
    observeLegacy();
    observeCollections();
    observeTestimonials();
    initTestimonials();
    initFAQ();
    initArrowKeyNavigation();
    initFooterFeatures();
  });
} else {
  addRippleAnimation();
  observeElements();
  enhanceCardInteractions();
  observeLegacy();
  observeCollections();
  observeTestimonials();
  initTestimonials();
  initFAQ();
  initArrowKeyNavigation();
  initFooterFeatures();
}

