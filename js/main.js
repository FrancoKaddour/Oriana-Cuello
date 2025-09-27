/**
 * Main JavaScript File
 * Professional Photography Portfolio - Oriana Cuello
 */

'use strict';

// ==========================================================================
// Configuration
// ==========================================================================

const CONFIG = {
  SCROLL_THRESHOLD: 50,
  DEBOUNCE_DELAY: 100,
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: '0px 0px -50px 0px',
  FOOTER_ANIMATION_DELAY: 100
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function to limit function execution
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}


// ==========================================================================
// Scroll Animations
// ==========================================================================

class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.animatedElements = document.querySelectorAll('.stat');

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.observeElements();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: CONFIG.INTERSECTION_THRESHOLD,
      rootMargin: CONFIG.INTERSECTION_ROOT_MARGIN
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');

          // Trigger number animation for stats
          if (entry.target.classList.contains('stat')) {
            this.animateNumber(entry.target);
          }
        }
      });
    }, options);
  }

  observeElements() {
    this.animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  animateNumber(statElement) {
    const numberElement = statElement.querySelector('.stat__number');
    if (!numberElement) return;

    const finalNumber = numberElement.textContent;
    const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
    const suffix = finalNumber.replace(/[\d]/g, '');

    if (isNaN(numericValue)) return;

    let current = 0;
    const increment = numericValue / 60; // Animate over ~1 second at 60fps
    const duration = 1000;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      current = Math.floor(numericValue * this.easeOut(progress));
      numberElement.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        numberElement.textContent = finalNumber; // Ensure final value is exact
      }
    };

    requestAnimationFrame(updateNumber);
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ==========================================================================
// Portfolio Interactions
// ==========================================================================

class Portfolio {
  constructor() {
    this.portfolioItems = document.querySelectorAll('.portfolio__item');

    this.init();
  }

  init() {
    this.handleKeyboardAccess();
    this.handleTouchInteractions();
  }

  handleKeyboardAccess() {
    this.portfolioItems.forEach(item => {
      // Make portfolio items focusable
      item.setAttribute('tabindex', '0');

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.toggle('portfolio__item--focused');
        }
      });

      item.addEventListener('focus', () => {
        item.classList.add('portfolio__item--focused');
      });

      item.addEventListener('blur', () => {
        item.classList.remove('portfolio__item--focused');
      });
    });
  }

  handleTouchInteractions() {
    // Improve touch interactions for mobile devices
    this.portfolioItems.forEach(item => {
      let touchStartTime = 0;

      item.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
      }, { passive: true });

      item.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;

        // If it's a quick tap (not a scroll), toggle the hover state
        if (touchDuration < 200) {
          e.preventDefault();
          item.classList.toggle('portfolio__item--touched');

          // Remove touched state from other items
          this.portfolioItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('portfolio__item--touched');
            }
          });
        }
      });
    });
  }
}

// ==========================================================================
// Performance Optimizations
// ==========================================================================

class PerformanceOptimizer {
  constructor() {
    this.images = document.querySelectorAll('img');

    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeAnimations();
  }

  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Replace data-src with src for lazy loading
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }

            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      this.images.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  optimizeAnimations() {
    // Pause animations when not in viewport to save battery
    const animatedElements = document.querySelectorAll('.polaroid__image, .marquee__content');

    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          } else {
            entry.target.style.animationPlayState = 'paused';
          }
        });
      });

      animatedElements.forEach(element => {
        animationObserver.observe(element);
      });
    }
  }
}

// ==========================================================================
// Accessibility Enhancements
// ==========================================================================

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.handleReducedMotion();
    this.improveKeyboardNavigation();
    this.addAriaLabels();
  }

  handleReducedMotion() {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration-fast', '0ms');
      document.documentElement.style.setProperty('--animation-duration-normal', '0ms');
      document.documentElement.style.setProperty('--animation-duration-slow', '0ms');
      document.documentElement.style.setProperty('--animation-duration-image-slide', '0ms');
      document.documentElement.style.setProperty('--animation-duration-marquee', '0ms');
    }
  }

  improveKeyboardNavigation() {
    // Add visible focus indicators for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  addAriaLabels() {
    // Add missing ARIA labels for better screen reader support
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    portfolioItems.forEach((item, index) => {
      const title = item.querySelector('.portfolio__title');
      if (title) {
        item.setAttribute('aria-label', `Ver proyecto: ${title.textContent}`);
      }
    });

    // Add role and aria-label to marquee
    const marquee = document.querySelector('.marquee');
    if (marquee) {
      marquee.setAttribute('role', 'banner');
      marquee.setAttribute('aria-label', 'Servicios de fotografía disponibles');
    }
  }
}

// ==========================================================================
// Error Handling
// ==========================================================================

class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    this.handleImageErrors();
    this.handleJavaScriptErrors();
  }

  handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        console.warn(`Failed to load image: ${img.src}`);
      });
    });
  }

  handleJavaScriptErrors() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript error:', e.error);
      // Could implement error reporting here
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // Could implement error reporting here
    });
  }
}

// ==========================================================================
// Mini Polaroids Draggable
// ==========================================================================

class MiniPolaroids {
  constructor() {
    this.miniPolaroids = document.querySelectorAll('.mini-polaroid');
    this.aboutSection = document.querySelector('.about');

    this.init();
  }

  init() {
    this.miniPolaroids.forEach(polaroid => {
      this.makeDraggable(polaroid);
    });
  }

  makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Mouse events
    element.addEventListener('mousedown', (e) => this.dragStart(e, element));
    document.addEventListener('mousemove', (e) => this.dragMove(e, element));
    document.addEventListener('mouseup', () => this.dragEnd(element));

    // Touch events
    element.addEventListener('touchstart', (e) => this.dragStart(e, element), { passive: false });
    document.addEventListener('touchmove', (e) => this.dragMove(e, element), { passive: false });
    document.addEventListener('touchend', () => this.dragEnd(element));
  }

  dragStart(e, element) {
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    initialX = clientX - xOffset;
    initialY = clientY - yOffset;

    if (e.target === element || element.contains(e.target)) {
      element.isDragging = true;
      element.style.cursor = 'grabbing';
    }
  }

  dragMove(e, element) {
    if (element.isDragging) {
      e.preventDefault();

      const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

      currentX = clientX - initialX;
      currentY = clientY - initialY;

      // Get container bounds
      const aboutRect = this.aboutSection.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Constrain within container
      const maxX = aboutRect.width - elementRect.width;
      const maxY = aboutRect.height - elementRect.height;

      currentX = Math.max(0, Math.min(currentX, maxX));
      currentY = Math.max(0, Math.min(currentY, maxY));

      xOffset = currentX;
      yOffset = currentY;

      element.style.transform = `translate(${currentX}px, ${currentY}px) ${this.getOriginalRotation(element)}`;
    }
  }

  dragEnd(element) {
    initialX = currentX;
    initialY = currentY;
    element.isDragging = false;
    element.style.cursor = 'pointer';
  }

  getOriginalRotation(element) {
    // Mantener la rotación original de cada elemento
    const classList = element.classList;
    if (classList.contains('mini-polaroid--1')) return 'rotate(-15deg)';
    if (classList.contains('mini-polaroid--2')) return 'rotate(12deg)';
    if (classList.contains('mini-polaroid--3')) return 'rotate(8deg)';
    if (classList.contains('mini-polaroid--4')) return 'rotate(-10deg)';
    if (classList.contains('mini-polaroid--5')) return 'rotate(20deg)';
    if (classList.contains('mini-polaroid--6')) return 'rotate(-8deg)';
    if (classList.contains('mini-polaroid--7')) return 'rotate(-20deg)';
    if (classList.contains('mini-polaroid--8')) return 'rotate(15deg)';
    if (classList.contains('mini-polaroid--9')) return 'rotate(-5deg)';
    if (classList.contains('mini-polaroid--10')) return 'rotate(18deg)';
    if (classList.contains('mini-polaroid--11')) return 'rotate(-12deg)';
    if (classList.contains('mini-polaroid--12')) return 'rotate(6deg)';
    if (classList.contains('mini-polaroid--13')) return 'rotate(14deg)';
    if (classList.contains('mini-polaroid--14')) return 'rotate(-16deg)';
    if (classList.contains('mini-polaroid--15')) return 'rotate(9deg)';
    if (classList.contains('mini-polaroid--16')) return 'rotate(-7deg)';
    return '';
  }
}

// ==========================================================================
// Footer Animations
// ==========================================================================

class FooterAnimations {
  constructor() {
    this.footer = document.querySelector('.footer');
    this.footerTop = document.querySelector('.footer__top');
    this.footerLetters = document.querySelectorAll('.footer__large-text .letter');
    this.isAnimated = false;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    // Adjust settings for mobile
    const isMobile = window.innerWidth <= 768;
    const options = {
      threshold: isMobile ? 0.1 : 0.2,
      rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isAnimated) {
          this.triggerAnimations();
          this.isAnimated = true;
        }
      });
    }, options);

    if (this.footer) {
      this.observer.observe(this.footer);
    }
  }

  triggerAnimations() {
    console.log('Footer animations triggered');

    // Animate footer top section first
    setTimeout(() => {
      if (this.footerTop) {
        this.footerTop.classList.add('animate');
        console.log('Footer top animated');
      }
    }, CONFIG.FOOTER_ANIMATION_DELAY);

    // Animate letters one by one with delays
    this.footerLetters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('animate');
        console.log(`Letter ${letter.textContent} animated`);
      }, 500 + (index * 100)); // Start letters after footer top animation
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ==========================================================================
// Main Application
// ==========================================================================

class App {
  constructor() {
    this.components = [];

    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components (Header is now initialized in separate file)
      this.components.push(new ScrollAnimations());
      this.components.push(new Portfolio());
      this.components.push(new FooterAnimations());
      this.components.push(new PerformanceOptimizer());
      this.components.push(new AccessibilityEnhancer());
      this.components.push(new ErrorHandler());

      // Mark body as loaded for CSS
      document.body.classList.add('loaded');

      console.log('✓ Portfolio application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }

  destroy() {
    // Clean up components if needed
    this.components.forEach(component => {
      if (component.destroy && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
  }
}

// ==========================================================================
// Initialize Application
// ==========================================================================

const app = new App();

// Expose app globally for debugging (only in development)
if (process?.env?.NODE_ENV === 'development') {
  window.app = app;
}