/* ============================================
   PORTFOLIO — The Accountable Consultant
   JavaScript — Animations, Interactions & Theme
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== THEME TOGGLE (LIGHT / DARK) =====
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        root.setAttribute('data-theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
        });
    }

    // ===== PARTICLE CANVAS BACKGROUND =====
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.15;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw(isLight) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = isLight 
                ? `rgba(2, 132, 199, ${this.opacity * 0.8})` 
                : `rgba(0, 212, 170, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles(isLight) {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 140) {
                    const opacity = (1 - distance / 140) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = isLight 
                        ? `rgba(2, 132, 199, ${opacity * 0.9})` 
                        : `rgba(0, 212, 170, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isLight = root.getAttribute('data-theme') === 'light';
        particles.forEach(p => {
            p.update();
            p.draw(isLight);
        });
        connectParticles(isLight);
        animationFrame = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // ===== CURSOR GLOW =====
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        cursorGlow.style.opacity = '1';
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ===== TYPING ANIMATION =====
    // Requirements: GTM Strategy, IT Transformation Roadmap, Operations Consultant, Target Operating Model, Growth Strategy
    const typingEl = document.getElementById('typingText');
    const phrases = [
        'GTM Strategy',
        'IT Transformation Roadmap',
        'Operations Consultant',
        'Target Operating Model',
        'Growth Strategy'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 75;

    function typeWriter() {
        if (!typingEl) return;
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 35;
        } else {
            typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 75;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();

    // ===== NAVBAR SCROLL BEHAVIOR =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== STAT COUNTERS ANIMATION =====
    // Requirements: All numbers in the 6 tiles increase from 1 when the page refreshes to reach target
    const statElements = document.querySelectorAll('.stat-number[data-count]');

    function runCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        // Start from 1
        el.textContent = `${prefix}1${suffix}`;
        if (target <= 1) {
            el.textContent = `${prefix}${target}${suffix}`;
            return;
        }

        const duration = 1600; // 1.6 seconds
        const startTime = performance.now();

        function updateNumber(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic curve
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(1 + (target - 1) * easeOut);
            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                el.textContent = `${prefix}${target}${suffix}`;
            }
        }

        requestAnimationFrame(updateNumber);
    }

    // Trigger on intersection with observer, or immediately if already visible
    let countersStarted = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                statElements.forEach(el => runCounter(el));
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.2 });

    const statsContainer = document.querySelector('.about-stats');
    if (statsContainer) {
        counterObserver.observe(statsContainer);
    }

    // Also trigger on page load if near top
    setTimeout(() => {
        if (!countersStarted && statsContainer) {
            const rect = statsContainer.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                countersStarted = true;
                statElements.forEach(el => runCounter(el));
                counterObserver.disconnect();
            }
        }
    }, 300);

    // ===== PROJECTS CAROUSEL CONTROLS =====
    const projectsCarousel = document.getElementById('projectsCarousel');
    const prevProjectBtn = document.getElementById('prevProject');
    const nextProjectBtn = document.getElementById('nextProject');

    if (projectsCarousel && prevProjectBtn && nextProjectBtn) {
        prevProjectBtn.addEventListener('click', () => {
            const card = projectsCarousel.querySelector('.project-tile');
            const scrollDistance = card ? (card.offsetWidth + 24) : 420;
            projectsCarousel.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        });

        nextProjectBtn.addEventListener('click', () => {
            const card = projectsCarousel.querySelector('.project-tile');
            const scrollDistance = card ? (card.offsetWidth + 24) : 420;
            projectsCarousel.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        });
    }

    // ===== SKILL BARS ANIMATION =====
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.width = width + '%';
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => barObserver.observe(bar));

    // ===== COPY TO CLIPBOARD WITH TOAST =====
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied to clipboard: ${textToCopy}`);
                }).catch(() => {
                    fallbackCopy(textToCopy);
                });
            } else {
                fallbackCopy(textToCopy);
            }
        });
    });

    function fallbackCopy(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard: ${text}`);
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== SMOOTH SCROLL FOR ALL ANCHORS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 76;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== CONTACT FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00d4aa, #00a888)';

            showToast('Thank you! Your message has been sent successfully.');

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

});
