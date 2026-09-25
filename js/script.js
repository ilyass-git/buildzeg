// ===== BUILDZEG WEBSITE JAVASCRIPT =====
// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===== SCROLL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-card, .feature-card, .service-card-full, .project-card-full, .contact-item, .faq-item, .stat-card');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== HEADER SCROLL EFFECT =====
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });
});

// ===== FORM VALIDATION =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Messages already shown would stay in the previous language
        document.addEventListener('languagechange', clearErrors);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Validate form
            const isValid = validateForm();
            
            if (isValid) {
                submitForm();
            }
        });
    }
});

function validateForm() {
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!name.value.trim()) {
        showError(nameError, 'Full name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(nameError, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(emailError, 'Email address is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (optional but if provided, should be valid)
    const phone = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (phone.value.trim() && !phoneRegex.test(phone.value)) {
        showError(phoneError, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    if (!message.value.trim()) {
        showError(messageError, 'Project description is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(messageError, 'Please provide more details about your project (at least 10 characters)');
        isValid = false;
    }
    
    // Validate consent
    const consent = document.getElementById('consent');
    const consentError = document.getElementById('consent-error');
    if (!consent.checked) {
        showError(consentError, 'You must agree to the data processing terms');
        isValid = false;
    }
    
    return isValid;
}

// Translate a message with js/i18n.js (falls back to English)
function t(message) {
    return window.BuildzegI18n ? window.BuildzegI18n.t(message) : message;
}

function showError(errorElement, message) {
    errorElement.textContent = t(message);
    errorElement.classList.add('show');
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
}

// ===== CONTACT FORM SENDING (EmailJS) =====
const CONTACT_RECIPIENT = 'younes.zeghari@buildzeg.com';
const EMAILJS_SERVICE_ID = 'service_ntz0utf';
const EMAILJS_TEMPLATE_ID = 'template_ymfdbdf';

function submitForm() {
    const submitBtn = document.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const contactForm = document.getElementById('contact-form');

    function setLoading(loading) {
        btnText.style.display = loading ? 'none' : 'inline';
        btnLoading.style.display = loading ? 'inline' : 'none';
        submitBtn.disabled = loading;
    }

    function showSendError() {
        showError(formError, t('Sorry, your message could not be sent. Please try again or email us directly at') + ' ' + CONTACT_RECIPIENT + '.');
    }

    if (typeof emailjs === 'undefined') {
        showSendError();
        return;
    }

    setLoading(true);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: CONTACT_RECIPIENT,
        from_name: document.getElementById('name').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        reply_to: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim()
    })
    .then(() => {
        setLoading(false);
        contactForm.reset();
        formSuccess.style.display = 'block';

        // Auto-hide success message after a few seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    })
    .catch(() => {
        setLoading(false);
        formSuccess.style.display = 'none';
        showSendError();
    });
}

// ===== LAZY LOADING FOR IMAGES =====
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===== SCROLL TO TOP FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', t('Back to top'));
    document.addEventListener('languagechange', function() {
        scrollToTopBtn.setAttribute('aria-label', t('Back to top'));
    });
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Throttle function for resize events
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
    
    // Optimized resize handler
    const optimizedResizeHandler = throttle(function() {
        // Handle responsive adjustments
        const navMenu = document.getElementById('nav-menu');
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            document.getElementById('nav-toggle').classList.remove('active');
        }
    }, 100);
    
    window.addEventListener('resize', optimizedResizeHandler);
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Keyboard navigation for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            }
        });
    }
    
    // Focus management for mobile menu
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' && index < navLinks.length - 1) {
                e.preventDefault();
                navLinks[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                navLinks[index - 1].focus();
            }
        });
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = t('Skip to main content');
    document.addEventListener('languagechange', function() {
        skipLink.textContent = t('Skip to main content');
    });
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// ===== STATS COUNTER ANIMATION =====
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on the original data-target
            let displayValue = Math.floor(current);
            if (target >= 100) {
                displayValue += '%';
            } else if (target === 24) {
                displayValue += '/7';
            } else {
                displayValue += '+';
            }
            
            element.textContent = displayValue;
        }, 20);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                
                animateCounter(target, targetValue);
                statsObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// ===== FORM ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Real-time form validation
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    function validateField(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            showError(errorElement, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showError(errorElement, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }
    
    function clearFieldError(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
});

// ===== FAQ ACCORDION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});

// ===== HERO CAROUSEL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentSlide = 0;
    let carouselInterval;
    
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 4500); // Change slide every 4.5 seconds
    }
    
    function stopCarousel() {
        clearInterval(carouselInterval);
    }
    
    // Initialize carousel
    showSlide(0);
    startCarousel();
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopCarousel();
            showSlide(index);
            startCarousel();
        });
    });
    
    // Pause carousel on hover
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                showSlide(prevIndex);
            }
            stopCarousel();
            startCarousel();
        }
    });
});
