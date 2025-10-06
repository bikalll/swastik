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
    if (!navList.contains(e.target) && !toggle.contains(e.target)) {
      setState(false);
    }
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
      // Check if we're on mobile by checking if the nav list is visible/active
      const isMobile = window.innerWidth <= 768;
      const isMobileMenuOpen = navList && navList.classList.contains('is-open');
      
      // On mobile, always toggle the submenu when the toggle is clicked
      // On desktop, let CSS hover handle it
      if (isMobile && isMobileMenuOpen) {
        e.preventDefault();
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        setExpanded(open);
      } else if (!isMobile) {
        // On desktop, let hover handle it (no action needed here)
        return;
      }
    });
    
    // Close submenu when clicking outside in mobile
    document.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 768;
      const isMobileMenuOpen = navList && navList.classList.contains('is-open');
      
      if (isMobile && isMobileMenuOpen && !submenuItem.contains(e.target)) {
        setExpanded(false);
      }
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
    this.faqCards = document.querySelectorAll('.faq__card');
    this.initAccordion();
  }
  
  initAccordion() {
    if (!this.faqCards.length) return;
    
    this.faqCards.forEach((card) => {
      const question = card.querySelector('.faq__question');
      const answer = card.querySelector('.faq__answer');
      
      if (!question || !answer) return;
      
      // Set initial state
      answer.setAttribute('aria-hidden', 'true');
      question.setAttribute('aria-expanded', 'false');
      
      // Add click handler
      question.addEventListener('click', () => {
        this.toggleCard(card, question, answer);
      });
      
      // Add keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleCard(card, question, answer);
        }
      });
    });
  }
  
  toggleCard(card, question, answer) {
    const isOpen = card.classList.contains('is-open');
    
    if (isOpen) {
      this.closeCard(card, question, answer);
    } else {
      // Close other cards first (accordion behavior)
      this.closeAllCards();
      this.openCard(card, question, answer);
    }
  }
  
  openCard(card, question, answer) {
    card.classList.add('is-open');
    answer.classList.add('is-open');
    answer.setAttribute('aria-hidden', 'false');
    question.setAttribute('aria-expanded', 'true');
    
    // Calculate and set height
    const content = answer.querySelector('.faq__answer-content');
    if (content) {
      const height = content.scrollHeight + 24; // Add padding
      answer.style.maxHeight = height + 'px';
    }
  }
  
  closeCard(card, question, answer) {
    card.classList.remove('is-open');
    answer.classList.remove('is-open');
    answer.setAttribute('aria-hidden', 'true');
    question.setAttribute('aria-expanded', 'false');
    
    answer.style.maxHeight = '0px';
  }
  
  closeAllCards() {
    this.faqCards.forEach(card => {
      const question = card.querySelector('.faq__question');
      const answer = card.querySelector('.faq__answer');
      
      if (card.classList.contains('is-open')) {
        this.closeCard(card, question, answer);
      }
    });
  }
}

// Simple FAQ initialization
const initFAQ = () => {
  new FAQAccordion();
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
    // Remove the click event listener that was preventing default behavior
    // The links will now work normally without any JavaScript interference
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

// ===================================
// INFINITE SLIDER SYSTEM
// ===================================

// Sample slide data for each slider section with actual logo content
const sliderData = [
  {
    section: 'top-companies',
    slides: [
      { logo: 'assets/logos/top/pathao.png', alt: 'Pathao Nepal' },
      { logo: 'assets/logos/top/himalayanbank.png', alt: 'Himalayan Bank Limited' },
      { logo: 'assets/logos/top/asian.png', alt: 'Asian Thai Foods' },
      { logo: 'assets/logos/top/himalayanlife.png', alt: 'Himalayan Life Insurance' },
      { logo: 'assets/logos/top/neco.png', alt: 'Neco Insurance Company' },
      { logo: 'assets/logos/top/biratnagarfc.png', alt: 'Biratnagar City FC' },
      { logo: 'assets/logos/aurora.svg', alt: 'Aurora' },
      { logo: 'assets/logos/vertex.svg', alt: 'Vertex' }
    ]
  },
  {
    section: 'genre-one',
    slides: [
      { logo: 'assets/hospitality.jpg', alt: 'Hospitality Project 1' },
      { logo: 'assets/commercial.jpg', alt: 'Hospitality Project 2' },
      { logo: 'assets/residential.jpg', alt: 'Hospitality Project 3' },
      { logo: 'assets/retail.jpg', alt: 'Hospitality Project 4' },
      { logo: 'assets/office.jpg', alt: 'Hospitality Project 5' }
    ]
  },
  {
    section: 'genre-two',
    slides: [
      { logo: 'assets/logos/top/himalayanbank.png', alt: 'Banking Project 1' },
      { logo: 'assets/logos/top/neco.png', alt: 'Banking Project 2' },
      { logo: 'assets/logos/top/himalayanlife.png', alt: 'Banking Project 3' },
      { logo: 'assets/logos/aurora.svg', alt: 'Banking Project 4' },
      { logo: 'assets/logos/vertex.svg', alt: 'Banking Project 5' }
    ]
  },
  {
    section: 'genre-three',
    slides: [
      { logo: 'assets/project1.jpg', alt: 'Education Project 1' },
      { logo: 'assets/project2.jpg', alt: 'Education Project 2' },
      { logo: 'assets/project3.jpg', alt: 'Education Project 3' },
      { logo: 'assets/dining.jpg', alt: 'Education Project 4' },
      { logo: 'assets/sofa.jpg', alt: 'Education Project 5' }
    ]
  }
];

// Initialize all sliders
function initInfiniteSliders() {
  console.log('Initializing infinite sliders');
  
  // Only initialize sliders on the portfolio page
  if (!document.querySelector('.portfolio-slider-section')) {
    console.log('Not on portfolio page, skipping slider initialization');
    return;
  }
  
  console.log('On portfolio page, initializing sliders');
  
  // Find all slider containers
  const sliders = document.querySelectorAll('.slider');
  console.log('Found', sliders.length, 'sliders');
  
  // Process each slider
  sliders.forEach((slider, index) => {
    console.log('Processing slider', index);
    const slideTrack = slider.querySelector('.slide-track');
    if (!slideTrack) {
      console.log('No slide-track found for slider', index);
      return;
    }
    
    // Get slide data for this slider
    const data = sliderData[index];
    if (!data) {
      console.log('No data found for slider', index);
      return;
    }
    
    console.log('Generating slides for slider', index, 'with', data.slides.length, 'slides');
    // Generate slides
    generateSlides(slideTrack, data.slides);
  });
}

// Generate slides and duplicates for seamless looping
function generateSlides(slideTrack, slides) {
  console.log('Generating', slides.length, 'slides');
  
  // Clear existing content
  slideTrack.innerHTML = '';
  
  // Create original slides
  slides.forEach((slide, slideIndex) => {
    console.log('Creating slide', slideIndex, 'with logo:', slide.logo);
    const slideElement = createSlide(slide);
    slideTrack.appendChild(slideElement);
  });
  
  // Create duplicate slides for seamless looping
  slides.forEach((slide, slideIndex) => {
    console.log('Creating duplicate slide', slideIndex, 'with logo:', slide.logo);
    const slideElement = createSlide(slide);
    slideTrack.appendChild(slideElement);
  });
  
  console.log('Total slides in track:', slideTrack.children.length);
}

// Create a single slide element with logo content
function createSlide(slideData) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  
  const content = document.createElement('div');
  content.className = 'slide-content';
  
  const logo = document.createElement('img');
  logo.className = 'slide-logo';
  logo.src = slideData.logo;
  logo.alt = slideData.alt;
  
  // Add error handling for missing images
  logo.onerror = function() {
    console.log('Failed to load image:', slideData.logo);
    // Set a placeholder or fallback
    logo.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5Mb2dvPC90ZXh0Pjwvc3ZnPg==';
    logo.alt = slideData.alt + ' (placeholder)';
  };
  
  // Add load event for debugging
  logo.onload = function() {
    console.log('Successfully loaded image:', slideData.logo);
  };
  
  content.appendChild(logo);
  slide.appendChild(content);
  
  return slide;
}

// Initialize animations for About Us pages
function initAboutPageAnimations() {
  // Check if we're on an About Us page
  const isAboutPage = document.querySelector('.janaki-legacy-page, .message-page, .heritage-milestones');
  if (!isAboutPage) return;

  // Simple hover effects for cards
  const aboutCards = document.querySelectorAll('.about-card');
  aboutCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Add subtle animation effect
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // Simple hover effects for images
  const imageContainers = document.querySelectorAll('.about-image-container, .janaki-legacy-page__image-container');
  imageContainers.forEach(container => {
    const image = container.querySelector('.about-image, .janaki-legacy-page__image');
    const overlay = container.querySelector('.about-image-overlay, .janaki-legacy-page__image-overlay');
    
    if (image) {
      container.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.05)';
        if (overlay) {
          overlay.style.opacity = '1';
        }
      });
      
      container.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
        if (overlay) {
          overlay.style.opacity = '0';
        }
      });
    }
  });
}

// Update the initAllFeatures function to include the new animation initialization
function initAllFeatures() {
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
  initContactPageFeatures();
  addContactPageStyles();
  initInfiniteSliders();
  initAboutPageAnimations();
}

// Initialize all features when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllFeatures);
} else {
  initAllFeatures();
}

