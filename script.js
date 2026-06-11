document.addEventListener('DOMContentLoaded', () => {

  // 1. Intro Loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('slide-up');
      document.body.classList.remove('loading');
      
      // Trigger Hero animations
      const heroSubtitle = document.querySelector('.hero-subtitle');
      const heroTitle = document.querySelector('.hero-title');
      const heroTagline = document.querySelector('.hero-tagline');
      const heroBtns = document.querySelector('.hero-buttons');
      
      if (heroSubtitle) heroSubtitle.style.opacity = '1';
      if (heroTitle) heroTitle.style.opacity = '1';
      if (heroTagline) heroTagline.style.opacity = '1';
      if (heroBtns) heroBtns.style.opacity = '1';
    }, 1500);
  }

  // 2. Navbar Scrolled Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('loading');
    });

    // Close menu when clicking on any mobile nav links
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('loading');
      });
    });
  }

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(element => element.classList.add('active'));
  }

  // 5. Stats Counter Animation
  const statsCounter = document.getElementById('stats-counter');
  if (statsCounter && 'IntersectionObserver' in window) {
    let started = false;
    const target = parseInt(statsCounter.getAttribute('data-target'), 10) || 30000;
    
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          let current = 0;
          const duration = 2000; // 2 seconds
          const stepTime = Math.abs(Math.floor(duration / (target / 500)));
          
          const timer = setInterval(() => {
            current += 500;
            if (current >= target) {
              statsCounter.textContent = target.toLocaleString() + '+';
              clearInterval(timer);
            } else {
              statsCounter.textContent = current.toLocaleString() + '+';
            }
          }, stepTime);
        }
      });
    }, { threshold: 0.5 });
    
    countObserver.observe(statsCounter);
  } else if (statsCounter) {
    statsCounter.textContent = '30,000+';
  }

  // 6. Interactive Floating Gold Particles (Hero Background Canvas)
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.6 - 0.1; // Drift upwards
        this.color = Math.random() > 0.4 
          ? `rgba(212, 168, 83, ${Math.random() * 0.35 + 0.15})` // Gold
          : `rgba(16, 185, 129, ${Math.random() * 0.25 + 0.1})`; // Emerald
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Loop back from bottom
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < 0 || this.x > canvas.width) {
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // 7. Carousel setup for Domestic and International escapes
  function setupCarousel(trackId, prevBtnId, nextBtnId, dotsId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.destination-card');
    if (cards.length === 0) return;
    
    let cardWidth = cards[0].offsetWidth + 30; // 30 is the CSS gap
    let currentIndex = 0;
    
    // Determine how many cards are visible
    function getVisibleCardsCount() {
      const wrapperWidth = track.parentElement.offsetWidth;
      return Math.floor(wrapperWidth / cardWidth) || 1;
    }
    
    function getMaxIndex() {
      const visible = getVisibleCardsCount();
      const max = cards.length - visible;
      return max > 0 ? max : 0;
    }
    
    // Resize handler
    window.addEventListener('resize', () => {
      cardWidth = cards[0].offsetWidth + 30;
      scrollToIndex(currentIndex);
    });
    
    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      const totalDots = cards.length;
      
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          currentIndex = Math.min(i, getMaxIndex());
          scrollToIndex(currentIndex);
        });
        dotsContainer.appendChild(dot);
      }
    }
    
    function updateDots(index) {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    function scrollToIndex(index) {
      const maxIdx = getMaxIndex();
      currentIndex = Math.min(Math.max(index, 0), maxIdx);
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots(currentIndex);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
          currentIndex++;
        } else {
          currentIndex = 0; // Wrap around
        }
        scrollToIndex(currentIndex);
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = maxIdx; // Wrap around to end
        }
        scrollToIndex(currentIndex);
      });
    }
    
    // Auto-scroll loop
    let autoScroll = setInterval(() => {
      const maxIdx = getMaxIndex();
      if (currentIndex < maxIdx) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      scrollToIndex(currentIndex);
    }, 6000);
    
    // Pause auto-scroll on hover/interaction
    const container = track.closest('.carousel-container');
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(autoScroll));
      container.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => {
          const maxIdx = getMaxIndex();
          if (currentIndex < maxIdx) {
            currentIndex++;
          } else {
            currentIndex = 0;
          }
          scrollToIndex(currentIndex);
        }, 6000);
      });
    }
  }

  // Initialize carousels
  setupCarousel('dom-track', 'dom-prev', 'dom-next', 'dom-dots');
  setupCarousel('intl-track', 'intl-prev', 'intl-next', 'intl-dots');
});
