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
    this.navOverlay = document.getElementById('navOverlay');
    this.navItems = document.querySelectorAll('.nav-item');
    this.navImages = document.querySelectorAll('.nav-image');
    this.navLinks = document.querySelectorAll('.nav__link, .bottom-nav__link, .footer__link');
    this.isMenuOpen = false;
    this.scrollPosition = 0;

    this.init();
  }

  init() {
    if (!this.header) {
      console.warn('Header element not found');
      return;
    }

    this.handleScroll();
    this.handleMenuToggle();
    this.handleImageSwitching();
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
    if (!this.menuToggle || !this.navOverlay) return;

    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Close menu when clicking on nav items
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        this.closeMenu();
      });
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

    // Toggle menu button state
    this.menuToggle.classList.toggle('active');
    this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);

    // Toggle overlay
    this.navOverlay.classList.toggle('active');

    // Toggle header state for logo hiding
    this.header.classList.toggle('menu-open');

    // Update aria-label for accessibility
    const label = this.isMenuOpen ? 'Cerrar menú' : 'Abrir menú';
    this.menuToggle.setAttribute('aria-label', label);

    // Prevent scroll with multiple methods
    if (this.isMenuOpen) {
      this.disableScroll();
    } else {
      this.enableScroll();
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuToggle.classList.remove('active');
    this.navOverlay.classList.remove('active');
    this.header.classList.remove('menu-open');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.setAttribute('aria-label', 'Abrir menú');
    this.enableScroll();
  }

  disableScroll() {
    // Save current scroll position
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Add classes to prevent scroll
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');

    // Set body position to current scroll position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  enableScroll() {
    // Remove classes
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');

    // Reset body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    // Restore scroll position
    window.scrollTo(0, this.scrollPosition);
  }

  handleImageSwitching() {
    this.navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const category = item.dataset.category;
        this.switchImage(category);
      });
    });
  }

  switchImage(category) {
    // Hide all images
    this.navImages.forEach(img => {
      img.classList.remove('active');
    });

    // Show the image for the hovered category
    const targetImage = document.querySelector(`[data-category="${category}"].nav-image`);
    if (targetImage) {
      setTimeout(() => {
        targetImage.classList.add('active');
      }, 100);
    }
  }

  handleSmoothScroll() {
    // Handle both regular nav links and overlay nav items
    const allNavElements = [...this.navLinks, ...this.navItems];

    allNavElements.forEach(link => {
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