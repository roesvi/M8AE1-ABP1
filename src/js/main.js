document.addEventListener('DOMContentLoaded', function() {
    // Initialize Auto-scrolling Technologies Carousel
    const initAutoScrollCarousel = () => {
        const track = document.querySelector('.tech-track');
        const items = document.querySelectorAll('.tech-item');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (!track || items.length === 0) return;
        
        // Clone items for infinite scroll
        const itemsArray = Array.from(items);
        itemsArray.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
        
        let currentIndex = 0;
        const itemWidth = items[0].offsetWidth + 32; // Width + padding
        const totalItems = itemsArray.length;
        let scrollInterval;
        let isPaused = false;
        
        // Auto-scroll function
        function autoScroll() {
            if (isPaused) return;
            
            currentIndex++;
            if (currentIndex >= totalItems) {
                currentIndex = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(0)`;
                // Force reflow
                track.offsetHeight;
            }
            
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            
            // Update button states
            updateButtonStates();
        }
        
        // Update navigation button states
        function updateButtonStates() {
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= totalItems - 1;
        }
        
        // Pause on hover
        track.addEventListener('mouseenter', () => {
            isPaused = true;
            track.style.transition = 'transform 0.3s ease';
        });
        
        track.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = Math.max(0, currentIndex - 1);
                track.style.transition = 'transform 0.3s ease';
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                updateButtonStates();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex++;
                track.style.transition = 'transform 0.3s ease';
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                updateButtonStates();
            });
        }
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isPaused = true;
            track.style.transition = 'none';
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isPaused) return;
            touchEndX = e.touches[0].clientX;
            const diff = touchStartX - touchEndX;
            track.style.transform = `translateX(calc(-${currentIndex * itemWidth}px - ${diff}px))`;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            isPaused = false;
            const diff = touchEndX - touchStartX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (diff < 0 && currentIndex < totalItems - 1) {
                    currentIndex++;
                }
            }
            
            track.style.transition = 'transform 0.3s ease';
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            updateButtonStates();
            
            // Resume auto-scroll after a delay
            setTimeout(() => { isPaused = false; }, 1000);
        }, { passive: true });
        
        // Start auto-scrolling
        scrollInterval = setInterval(autoScroll, 3000);
        
        // Cleanup
        return () => {
            clearInterval(scrollInterval);
        };
    };
    
    // Initialize the carousel
    if (document.querySelector('.tech-carousel')) {
        initAutoScrollCarousel();
    }
    // Preloader
    const loader = document.querySelector('.loader');
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1500);
    });

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const links = document.querySelectorAll('a, button, .project-card, .filter-btn');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Typewriter effect
    class TxtRotate {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        }
        
        tick() {
            const i = this.loopNum % this.toRotate.length;
            const fullTxt = this.toRotate[i];
            
            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }
            
            this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
            
            let delta = 200 - Math.random() * 100;
            
            if (this.isDeleting) {
                delta /= 2;
            }
            
            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }
            
            setTimeout(() => this.tick(), delta);
        }
    }
    
    // Initialize typewriter effect
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    // Skills animation on scroll
    const skills = document.querySelectorAll('.skill');
    
    const animateSkills = () => {
        skills.forEach(skill => {
            const skillValue = skill.getAttribute('data-percent');
            const skillBar = skill.querySelector('.skill-progress');
            
            if (isInViewport(skill) && !skill.classList.contains('animated')) {
                skillBar.style.width = skillValue + '%';
                skill.classList.add('animated');
            }
        });
    };
    
    // Check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Run skills animation on scroll
    window.addEventListener('scroll', animateSkills);
    
    // Initialize skills animation on page load if already in viewport
    animateSkills();

    // Projects filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Animate project cards on scroll
    const animateProjects = () => {
        projectCards.forEach(card => {
            if (isInViewport(card) && !card.classList.contains('animated')) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('animated');
            }
        });
    };
    
    // Run project animation on scroll
    window.addEventListener('scroll', animateProjects);
    
    // Initialize project animation on page load if already in viewport
    animateProjects();

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');
            
            // Reset form
            this.reset();
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Here you would typically send the email to your newsletter service
                console.log('Newsletter subscription:', email);
                
                // Show success message
                alert('¡Gracias por suscribirte a nuestro boletín!');
                
                // Reset form
                this.reset();
            }
        });
    }

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate hero section
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5
    });
    
    gsap.from('.hero-image', {
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.8
    });
    
    // Animate about section
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 0.3
    });
    
    // Animate skills section
    gsap.utils.toArray('.skills-category').forEach((category, i) => {
        gsap.from(category, {
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2
        });
    });
    
    // Animate projects section
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.projects',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15
        });
    });
    
    // Animate contact section
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3
    });
});
