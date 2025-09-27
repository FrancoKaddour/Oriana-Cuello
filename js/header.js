/**
 * Header Component - Standalone File
 * Professional Photography Portfolio - Oriana Cuello
 */

'use strict';

// ==========================================================================
// Header Configuration
// ==========================================================================

const HEADER_CONFIG = {
  SCROLL_THRESHOLD: 50,
  DEBOUNCE_DELAY: 16 // ~60fps
};

// ==========================================================================
// Header Class
// ==========================================================================

class Header {
  constructor() {
    this.header = document.getElementById('header');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navLinks = document.querySelectorAll('.nav__link, .bottom-nav__link, .footer__link');
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    if (!this.header) {
      console.warn('Header element not found');
      return;
    }

    this.handleScroll();
    this.handleMenuToggle();
    this.handleSmoothScroll();
    this.handleKeyboardNavigation();
  }

  handleScroll() {
    const scrollHandler = this.throttle(() => {
      const scrollY = window.scrollY;

      if (scrollY > HEADER_CONFIG.SCROLL_THRESHOLD) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }, HEADER_CONFIG.DEBOUNCE_DELAY);

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  handleMenuToggle() {
    if (!this.menuToggle) return;

    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggle.classList.toggle('active');
    this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);

    // Update aria-label for accessibility
    const label = this.isMenuOpen ? 'Cerrar menú' : 'Abrir menú';
    this.menuToggle.setAttribute('aria-label', label);

    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  handleSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only handle internal links
        if (href && href.startsWith('#')) {
          e.preventDefault();

          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Close mobile menu if open
            if (this.isMenuOpen) {
              this.closeMenu();
            }

            // Update URL without triggering scroll
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  handleKeyboardNavigation() {
    this.navLinks.forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }

  // Utility function - throttle
  throttle(func, limit) {
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
}

// ==========================================================================
// Auto-initialize Header
// ==========================================================================

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.headerInstance = new Header();
});