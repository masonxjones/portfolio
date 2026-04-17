document.addEventListener('DOMContentLoaded', () => {





    // =========================================================
    // FEATURE 2: SCROLL REVEAL (IntersectionObserver)
    // =========================================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger children if they have .reveal-child
                    const children = entry.target.querySelectorAll('.reveal-child');
                    if (children.length > 0) {
                        children.forEach((child, idx) => {
                            child.style.transitionDelay = `${idx * 120}ms`;
                            child.classList.add('revealed');
                        });
                    }
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }


    // =========================================================
    // FEATURE 3A: TYPING EFFECT on hero subtitle
    // =========================================================
    const subtitleEl = document.getElementById('hero-subtitle-typing');
    const phrases = [
        'Mechanical Engineer',
        'Thermal & Fluid Systems',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            subtitleEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitleEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 90;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        typingTimeout = setTimeout(type, delay);
    }
    type();


    // =========================================================
    // FEATURE 3B: HERO PORTRAIT PARALLAX / MOUSE TILT
    // =========================================================
    const heroPortrait = document.querySelector('.hero-portrait-wrapper');
    if (heroPortrait) {
        document.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 14; // -7 to +7 degrees
            const y = (e.clientY / innerHeight - 0.5) * -14;
            heroPortrait.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
        });

        document.addEventListener('mouseleave', () => {
            heroPortrait.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        });
    }


    // =========================================================
    // FEATURE 4: FLOATING NAV WITH SPY HIGHLIGHTING + PILL
    // =========================================================
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    const navPill = document.getElementById('nav-pill');
    const header = document.querySelector('.header');

    function updateNavPill(activeLink) {
        if (!activeLink || !navPill) return;
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('nav').getBoundingClientRect();
        navPill.style.width = `${linkRect.width + 24}px`;
        navPill.style.left = `${linkRect.left - navRect.left - 12}px`;
        navPill.style.opacity = '1';
    }

    // Smooth scroll with offset
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 90;
                const offsetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Scroll spy + frosted glass header on scroll
    window.addEventListener('scroll', () => {
        // Frosted glass header after hero
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Spy
        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });

        let activeLink = null;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                activeLink = link;
            }
        });

        updateNavPill(activeLink);
    });

    // Initial pill position
    window.dispatchEvent(new Event('scroll'));

    // FEATURE 5: VIDEO LOOP FAIL-SAFE
    // Ensures videos with the 'loop' attribute actually restart if they stop
    document.querySelectorAll('video').forEach(video => {
        if (video.hasAttribute('loop')) {
            video.addEventListener('ended', () => {
                video.play();
            });
        }
    });
});
