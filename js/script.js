// AOS will be initialized after DOM is loaded

// DOM Elements
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const heroSlides = document.querySelectorAll('.slide');
const heroIndicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const searchBtn = document.querySelector('.search-btn');
const newsletterForm = document.querySelector('.newsletter-form');

// Global Variables
let currentSlide = 0;
let currentTestimonial = 0;
let slideInterval;
let testimonialInterval;

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Hero Slider Functionality
function initHeroSlider() {
    if (heroSlides.length === 0) return;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        heroIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(currentSlide);
    }

    // Auto-play slider
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopSlideShow();
        prevSlide();
        startSlideShow();
    });

    // Indicator clicks
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            currentSlide = index;
            showSlide(currentSlide);
            startSlideShow();
        });
    });

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideShow);
        heroSection.addEventListener('mouseleave', startSlideShow);
    }

    // Start the slideshow
    startSlideShow();
}

// Testimonials Slider
function initTestimonialsSlider() {
    if (testimonialCards.length === 0) return;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }

    // Auto-play testimonials
    function startTestimonialShow() {
        testimonialInterval = setInterval(nextTestimonial, 4000);
    }

    function stopTestimonialShow() {
        clearInterval(testimonialInterval);
    }

    // Event listeners
    if (testimonialNext) testimonialNext.addEventListener('click', () => {
        stopTestimonialShow();
        nextTestimonial();
        startTestimonialShow();
    });

    if (testimonialPrev) testimonialPrev.addEventListener('click', () => {
        stopTestimonialShow();
        prevTestimonial();
        startTestimonialShow();
    });

    // Pause on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopTestimonialShow);
        testimonialsSection.addEventListener('mouseleave', startTestimonialShow);
    }

    // Start the testimonial slideshow
    startTestimonialShow();
}

// Search Functionality
function initSearch() {
    if (!searchBtn) return;

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const destination = document.getElementById('destination-search')?.value;
        const date = document.getElementById('departure-date')?.value;
        const travelers = document.getElementById('travelers')?.value;

        if (!destination) {
            showNotification('Please enter a destination', 'error');
            return;
        }

        // Simulate search loading
        const originalText = searchBtn.textContent;
        searchBtn.innerHTML = '<span class="loading"></span> Searching...';
        searchBtn.disabled = true;

        setTimeout(() => {
            searchBtn.textContent = originalText;
            searchBtn.disabled = false;
            
            // Redirect to packages page with search parameters
            const params = new URLSearchParams({
                destination: destination,
                date: date || '',
                travelers: travelers || '1'
            });
            
            window.location.href = `packages.html?${params.toString()}`;
        }, 1500);
    });
}

// Newsletter Subscription
function initNewsletter() {
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]')?.value;
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate subscription
        const submitBtn = newsletterForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Subscribing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            newsletterForm.reset();
            showNotification('Successfully subscribed to our newsletter!', 'success');
        }, 1500);
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.destination-card, .package-card').forEach(el => {
        observer.observe(el);
    });
}

// Form Validation Helper
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Local Storage Helper
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Check Authentication Status
function checkAuthStatus() {
    const user = getFromLocalStorage('currentUser');
    const loginBtn = document.querySelector('.login-btn');
    
    if (user && loginBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = 'dashboard.html';
    }
}

// Initialize Page-Specific Functionality
function initPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initHeroSlider();
            initTestimonialsSlider();
            initSearch();
            initNewsletter();
            break;
        case 'packages.html':
            initPackageFilters();
            break;
        case 'booking.html':
            initBookingForm();
            break;
        case 'login.html':
            initLoginForm();
            break;
        case 'contact.html':
            initContactForm();
            initMap();
            break;
    }
}

// Package Filters (for packages.html)
function initPackageFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter packages
            packageCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in-up');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Booking Form (for booking.html)
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm(bookingForm)) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Collect form data
        const formData = new FormData(bookingForm);
        const bookingData = {
            id: Date.now(),
            package: formData.get('package'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            travelers: formData.get('travelers'),
            date: formData.get('date'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        // Save booking
        const bookings = getFromLocalStorage('bookings') || [];
        bookings.push(bookingData);
        saveToLocalStorage('bookings', bookings);
        
        // Show success message
        showNotification('Booking submitted successfully! We will contact you soon.', 'success');
        
        // Reset form
        bookingForm.reset();
        
        // Redirect to confirmation page
        setTimeout(() => {
            window.location.href = `booking-confirmation.html?id=${bookingData.id}`;
        }, 2000);
    });
}

// Login Form (for login.html)
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Handle URL parameters for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
        try {
            const user = JSON.parse(decodeURIComponent(userParam));
            saveToLocalStorage('currentUser', user);
            saveToLocalStorage('authToken', token);
            showNotification('Login successful! Redirecting...', 'success');
            
            // Clean URL and redirect
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            return;
        } catch (error) {
            console.error('Error parsing OAuth callback:', error);
        }
    }
    
    // Check for error parameter
    const error = urlParams.get('error');
    if (error === 'auth_failed') {
        showNotification('Authentication failed. Please try again.', 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                showNotification('Please enter both email and password', 'error');
                return;
            }
            
            try {
                showNotification('Logging in...', 'info');
                
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store user data and token
                    saveToLocalStorage('currentUser', data.user);
                    saveToLocalStorage('authToken', data.token);
                    
                    showNotification('Login successful! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('signup-firstname').value;
            const lastName = document.getElementById('signup-lastname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const phone = document.getElementById('signup-phone').value;
            
            if (!firstName || !lastName || !email || !password) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }
            
            try {
                showNotification('Creating account...', 'info');
                
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password,
                        phone
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store user data and token
                    saveToLocalStorage('currentUser', data.user);
                    saveToLocalStorage('authToken', data.token);
                    
                    showNotification('Registration successful! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }
    
    // Google login buttons
    const googleLoginBtns = document.querySelectorAll('.google-btn');
    googleLoginBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/auth/google';
        });
    });
}

// Contact Form (for contact.html)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm(contactForm)) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
        }, 2000);
    });
}

// Initialize Map (for contact.html)
function initMap() {
    // This would typically integrate with Google Maps or another mapping service
    // For demo purposes, we'll just show a placeholder
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 300px;
                background: #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 1.1rem;
                border-radius: 10px;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 1rem; color: #2c5aa0;"></i>
                    <p>Interactive Map</p>
                    <p style="font-size: 0.9rem;">123 Travel Street, Mumbai, India</p>
                </div>
            </div>
        `;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    initSmoothScrolling();
    initScrollAnimations();
    checkAuthStatus();
    initPageSpecific();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        clearInterval(slideInterval);
        clearInterval(testimonialInterval);
    } else {
        // Resume animations when page becomes visible
        if (heroSlides.length > 0) initHeroSlider();
        if (testimonialCards.length > 0) initTestimonialsSlider();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
    }
});

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        'images/manali.svg',
        'images/ladakh.svg',
        'images/travel-placeholder.svg',
        'images/goa.svg',
        'images/kerala.svg',
        'images/profile-placeholder.svg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize image preloading
preloadImages();

// Export functions for use in other files
window.TravelExplore = {
    showNotification,
    saveToLocalStorage,
    getFromLocalStorage,
    validateForm,
    isValidEmail
};