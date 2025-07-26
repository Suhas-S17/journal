// Enhanced Mobile Navigation Toggle with Responsive Features
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Check if we're on a mobile device
    function isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Enhanced touch handling for mobile
    function handleTouchEvents() {
        if (isMobileDevice()) {
            // Add touch-friendly classes
            document.body.classList.add('touch-device');
            
            // Prevent double-tap zoom on buttons
            document.querySelectorAll('.btn, .nav-link').forEach(element => {
                element.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    this.click();
                });
            });
        }
    }

    // Toggle mobile menu with enhanced animation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        }
    });

    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
            
            if (navToggle) {
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        }
        
        // Recalculate layout on orientation change
        if ('orientation' in window) {
            adjustLayoutForOrientation();
        }
    });

    // Handle orientation changes on mobile
    function adjustLayoutForOrientation() {
        setTimeout(() => {
            // Force layout recalculation
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
            }
            
            // Adjust header height if needed
            if (header) {
                header.style.minHeight = isMobileDevice() ? '56px' : '72px';
            }
        }, 100);
    }

    // Initialize touch events
    handleTouchEvents();

    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustLayoutForOrientation, 500);
    });
});

// Enhanced Smooth Scrolling with Mobile Optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const extraOffset = window.innerWidth <= 768 ? 10 : 20;
            const targetPosition = target.offsetTop - headerHeight - extraOffset;
            
            // Use smooth scrolling with fallback for older browsers
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Polyfill for smooth scrolling
                smoothScrollTo(targetPosition, 800);
            }
        }
    });
});

// Smooth scroll polyfill
function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOutSine
        window.scrollTo(0, startY + distance * ease);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Enhanced Header Scroll Effect with Performance Optimization
let ticking = false;
let lastScrollY = 0;

function updateHeader() {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (header) {
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
            header.style.borderBottom = 'none';
        }
        
        // Hide/show header on scroll for mobile
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// Enhanced Fade-in Animation with Mobile Considerations
const observerOptions = {
    threshold: window.innerWidth <= 768 ? 0.05 : 0.1,
    rootMargin: window.innerWidth <= 768 ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Reduce animations on mobile for better performance
            if (window.innerWidth <= 768) {
                entry.target.style.animationDuration = '0.4s';
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .announcement-card, .sidebar-section').forEach(el => {
    observer.observe(el);
});

// Search Functionality (placeholder)
function searchJournal() {
    const searchTerm = document.getElementById('search-input')?.value;
    if (searchTerm) {
        console.log('Searching for:', searchTerm);
        // Implement search functionality here
        alert('Search functionality would be implemented here for: ' + searchTerm);
    }
}

// Form Validation (for future forms)
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Newsletter Subscription (placeholder)
function subscribeNewsletter(email) {
    if (validateEmail(email)) {
        console.log('Subscribing email:', email);
        // Implement newsletter subscription here
        alert('Thank you for subscribing to our newsletter!');
        return true;
    } else {
        alert('Please enter a valid email address.');
        return false;
    }
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Reading Time Calculator
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
}

// Add reading time to articles
document.querySelectorAll('.announcement-card').forEach(article => {
    const text = article.textContent;
    const readingTime = calculateReadingTime(text);
    const readingTimeElement = document.createElement('span');
    readingTimeElement.className = 'reading-time';
    readingTimeElement.textContent = `${readingTime} min read`;
    readingTimeElement.style.cssText = 'color: #666; font-size: 0.8rem; margin-left: 1rem;';
    
    const dateElement = article.querySelector('.date');
    if (dateElement) {
        dateElement.appendChild(readingTimeElement);
    }
});

// Enhanced Back-to-Top Button with Mobile Optimization
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(0,123,255,0.3);
    `;

    // Mobile adjustments
    if (window.innerWidth <= 768) {
        backToTop.style.bottom = '15px';
        backToTop.style.right = '15px';
        backToTop.style.width = '45px';
        backToTop.style.height = '45px';
        backToTop.style.fontSize = '1.1rem';
    }

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide based on scroll position
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
        
        // Auto-hide after scrolling stops on mobile
        if (window.innerWidth <= 768) {
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    backToTop.style.opacity = '0.7';
                }
            }, 2000);
        }
    });

    // Touch-friendly hover effects
    backToTop.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });

    backToTop.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });

    document.body.appendChild(backToTop);
}

// Mobile Performance Optimizations
function optimizeForMobile() {
    // Reduce animation frequency on mobile
    if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Disable hover effects on touch devices
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (window.innerWidth <= 768) {
            img.loading = 'lazy';
        }
    });
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
}

// Touch Gesture Support
function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    const minSwipeDistance = 100;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            // Swipe right - could be used for navigation
            if (deltaX > 0) {
                handleSwipeRight();
            }
            // Swipe left - could be used for navigation
            else {
                handleSwipeLeft();
            }
        }
    });
}

function handleSwipeRight() {
    // Close mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
    }
}

function handleSwipeLeft() {
    // Could be used for opening menu or other navigation
    // Implementation depends on UX requirements
}

// Enhanced Form Handling for Mobile
function enhanceFormsForMobile() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevent zoom on iOS
            if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'password') {
                if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            }
            
            // Enhanced focus handling for mobile
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            });
            
            // Auto-hide mobile keyboard on enter for non-textarea elements
            if (input.type !== 'textarea') {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && window.innerWidth <= 768) {
                        this.blur();
                    }
                });
            }
        });
    });
}

// Responsive Tables
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        if (!table.parentNode.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// Viewport Height Fix for Mobile Browsers
function fixViewportHeight() {
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// Initialize all mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    createBackToTopButton();
    optimizeForMobile();
    initializeTouchGestures();
    enhanceFormsForMobile();
    makeTablesResponsive();
    fixViewportHeight();
    
    // Add loading complete class for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    optimizeForMobile();
    
    // Update back to top button for mobile
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.innerWidth <= 768) {
            backToTop.style.bottom = '15px';
            backToTop.style.right = '15px';
            backToTop.style.width = '45px';
            backToTop.style.height = '45px';
            backToTop.style.fontSize = '1.1rem';
        } else {
            backToTop.style.bottom = '20px';
            backToTop.style.right = '20px';
            backToTop.style.width = '50px';
            backToTop.style.height = '50px';
            backToTop.style.fontSize = '1.2rem';
        }
    }
});

// Network-aware loading for mobile
if ('connection' in navigator) {
    const connection = navigator.connection;
    
    // Reduce features on slow connections
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
        // Disable animations and heavy features
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
}

// PWA-like features for mobile
if ('serviceWorker' in navigator && window.innerWidth <= 768) {
    // Add meta tags for mobile web app
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }
    
    // Add apple-mobile-web-app tags if not present
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        const appleMeta = document.createElement('meta');
        appleMeta.name = 'apple-mobile-web-app-capable';
        appleMeta.content = 'yes';
        document.head.appendChild(appleMeta);
    }
}

// Enhanced Accessibility Features
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
});

// Form auto-save functionality
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id;
        if (formId) {
            // Load saved data
            loadFormData(form, formId);
            
            // Save data on input
            form.addEventListener('input', debounce(function() {
                saveFormData(form, formId);
            }, 1000));
        }
    });
}

function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

function loadFormData(form, formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
                if (input.type === 'checkbox') {
                    input.checked = data[key] === 'on';
                } else {
                    input.value = data[key];
                }
            }
        });
    }
}

// Clear form data on successful submission
function clearFormData(formId) {
    localStorage.removeItem(`form_${formId}`);
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', initializeAutoSave);

// Archive Search and Filter Functionality
function searchArchive() {
    const searchTerm = document.getElementById('archive-search')?.value;
    if (searchTerm) {
        console.log('Searching archives for:', searchTerm);
        // Implement archive search functionality here
        alert('Archive search functionality would be implemented here for: ' + searchTerm);
    }
}

function resetFilters() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('archive-search');
    
    if (yearFilter) yearFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    console.log('Filters reset');
    // Implement filter reset functionality here
}

// Filter change handlers
document.addEventListener('DOMContentLoaded', function() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            console.log('Year filter changed to:', this.value);
            // Implement year filtering here
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            console.log('Type filter changed to:', this.value);
            // Implement type filtering here
        });
    }
});

// Issue card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const issueCards = document.querySelectorAll('.issue-card');
    
    issueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Article citation functionality
function copyCitation(citationText) {
    navigator.clipboard.writeText(citationText).then(() => {
        alert('Citation copied to clipboard!');
    }).catch(() => {
        alert('Please copy the citation manually: ' + citationText);
    });
}

// Download functionality placeholders
function downloadPDF(articleId) {
    console.log('Downloading PDF for article:', articleId);
    alert('PDF download functionality would be implemented here');
}

function downloadIssue(issueId) {
    console.log('Downloading issue:', issueId);
    alert('Issue download functionality would be implemented here');
}

// Article view tracking (placeholder)
function trackArticleView(articleId) {
    console.log('Tracking view for article:', articleId);
    // Implement analytics tracking here
}

// Advanced search modal (placeholder)
function openAdvancedSearch() {
    alert('Advanced search modal would open here');
}

// Export citations functionality
function exportCitations(format) {
    console.log('Exporting citations in format:', format);
    alert(`Citation export in ${format} format would be implemented here`);
}

// Table of contents toggle
document.addEventListener('DOMContentLoaded', function() {
    const tocToggles = document.querySelectorAll('.issue-toc');
    
    tocToggles.forEach(toc => {
        const header = toc.querySelector('h5');
        if (header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const list = toc.querySelector('ul');
                if (list) {
                    list.style.display = list.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    });
});

console.log('Vivtih Journal website loaded successfully!');

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(contactForm)) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Thank you for your message! We will respond within 48 hours.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
});



// Newsletter Subscription Forms
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (subscribeNewsletter(email)) {
                emailInput.value = '';
            }
        });
    });
});



// Enhanced Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    // Remove previous error states
    inputs.forEach(input => {
        input.classList.remove('error');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Check terms agreement if present (for other forms)
    const termsCheckbox = formElement.querySelector('#terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        alert('Please agree to the Terms of Service and Privacy Policy to continue.');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
    input.parentNode.appendChild(errorDiv);
}



// Advanced Search Functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            const query = this.value.trim();
            if (query.length > 2) {
                performSearch(query);
            }
        }, 300));
    });
}

function performSearch(query) {
    // Simulate search functionality
    console.log('Searching for:', query);
    // In a real application, this would make an API call
}

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

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Enhanced accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
});

// Form auto-save functionality
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id;
        if (formId) {
            // Load saved data
            loadFormData(form, formId);
            
            // Save data on input
            form.addEventListener('input', debounce(function() {
                saveFormData(form, formId);
            }, 1000));
        }
    });
}

function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

function loadFormData(form, formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
                if (input.type === 'checkbox') {
                    input.checked = data[key] === 'on';
                } else {
                    input.value = data[key];
                }
            }
        });
    }
}

// Clear form data on successful submission
function clearFormData(formId) {
    localStorage.removeItem(`form_${formId}`);
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', initializeAutoSave);

// Archive Search and Filter Functionality
function searchArchive() {
    const searchTerm = document.getElementById('archive-search')?.value;
    if (searchTerm) {
        console.log('Searching archives for:', searchTerm);
        // Implement archive search functionality here
        alert('Archive search functionality would be implemented here for: ' + searchTerm);
    }
}

function resetFilters() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('archive-search');
    
    if (yearFilter) yearFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    console.log('Filters reset');
    // Implement filter reset functionality here
}

// Filter change handlers
document.addEventListener('DOMContentLoaded', function() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            console.log('Year filter changed to:', this.value);
            // Implement year filtering here
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            console.log('Type filter changed to:', this.value);
            // Implement type filtering here
        });
    }
});

// Issue card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const issueCards = document.querySelectorAll('.issue-card');
    
    issueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Article citation functionality
function copyCitation(citationText) {
    navigator.clipboard.writeText(citationText).then(() => {
        alert('Citation copied to clipboard!');
    }).catch(() => {
        alert('Please copy the citation manually: ' + citationText);
    });
}

// Download functionality placeholders
function downloadPDF(articleId) {
    console.log('Downloading PDF for article:', articleId);
    alert('PDF download functionality would be implemented here');
}

function downloadIssue(issueId) {
    console.log('Downloading issue:', issueId);
    alert('Issue download functionality would be implemented here');
}

// Article view tracking (placeholder)
function trackArticleView(articleId) {
    console.log('Tracking view for article:', articleId);
    // Implement analytics tracking here
}

// Advanced search modal (placeholder)
function openAdvancedSearch() {
    alert('Advanced search modal would open here');
}

// Export citations functionality
function exportCitations(format) {
    console.log('Exporting citations in format:', format);
    alert(`Citation export in ${format} format would be implemented here`);
}

// Table of contents toggle
document.addEventListener('DOMContentLoaded', function() {
    const tocToggles = document.querySelectorAll('.issue-toc');
    
    tocToggles.forEach(toc => {
        const header = toc.querySelector('h5');
        if (header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const list = toc.querySelector('ul');
                if (list) {
                    list.style.display = list.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    });
});

// Enhanced Back-to-Top Button with Mobile Optimization
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(0,123,255,0.3);
    `;

    // Mobile adjustments
    if (window.innerWidth <= 768) {
        backToTop.style.bottom = '15px';
        backToTop.style.right = '15px';
        backToTop.style.width = '45px';
        backToTop.style.height = '45px';
        backToTop.style.fontSize = '1.1rem';
    }

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide based on scroll position
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
        
        // Auto-hide after scrolling stops on mobile
        if (window.innerWidth <= 768) {
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    backToTop.style.opacity = '0.7';
                }
            }, 2000);
        }
    });

    // Touch-friendly hover effects
    backToTop.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });

    backToTop.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });

    document.body.appendChild(backToTop);
}

// Mobile Performance Optimizations
function optimizeForMobile() {
    // Reduce animation frequency on mobile
    if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Disable hover effects on touch devices
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (window.innerWidth <= 768) {
            img.loading = 'lazy';
        }
    });
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
}

// Touch Gesture Support
function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    const minSwipeDistance = 100;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            // Swipe right - could be used for navigation
            if (deltaX > 0) {
                handleSwipeRight();
            }
            // Swipe left - could be used for navigation
            else {
                handleSwipeLeft();
            }
        }
    });
}

function handleSwipeRight() {
    // Close mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
    }
}

function handleSwipeLeft() {
    // Could be used for opening menu or other navigation
    // Implementation depends on UX requirements
}

// Enhanced Form Handling for Mobile
function enhanceFormsForMobile() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevent zoom on iOS
            if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'password') {
                if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            }
            
            // Enhanced focus handling for mobile
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            });
            
            // Auto-hide mobile keyboard on enter for non-textarea elements
            if (input.type !== 'textarea') {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && window.innerWidth <= 768) {
                        this.blur();
                    }
                });
            }
        });
    });
}

// Responsive Tables
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        if (!table.parentNode.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// Viewport Height Fix for Mobile Browsers
function fixViewportHeight() {
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// Initialize all mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    createBackToTopButton();
    optimizeForMobile();
    initializeTouchGestures();
    enhanceFormsForMobile();
    makeTablesResponsive();
    fixViewportHeight();
    
    // Add loading complete class for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    optimizeForMobile();
    
    // Update back to top button for mobile
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.innerWidth <= 768) {
            backToTop.style.bottom = '15px';
            backToTop.style.right = '15px';
            backToTop.style.width = '45px';
            backToTop.style.height = '45px';
            backToTop.style.fontSize = '1.1rem';
        } else {
            backToTop.style.bottom = '20px';
            backToTop.style.right = '20px';
            backToTop.style.width = '50px';
            backToTop.style.height = '50px';
            backToTop.style.fontSize = '1.2rem';
        }
    }
});

// Network-aware loading for mobile
if ('connection' in navigator) {
    const connection = navigator.connection;
    
    // Reduce features on slow connections
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
        // Disable animations and heavy features
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
}

// PWA-like features for mobile
if ('serviceWorker' in navigator && window.innerWidth <= 768) {
    // Add meta tags for mobile web app
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }
    
    // Add apple-mobile-web-app tags if not present
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        const appleMeta = document.createElement('meta');
        appleMeta.name = 'apple-mobile-web-app-capable';
        appleMeta.content = 'yes';
        document.head.appendChild(appleMeta);
    }
}

// Enhanced Accessibility Features
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
});

// Form auto-save functionality
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id;
        if (formId) {
            // Load saved data
            loadFormData(form, formId);
            
            // Save data on input
            form.addEventListener('input', debounce(function() {
                saveFormData(form, formId);
            }, 1000));
        }
    });
}

function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

function loadFormData(form, formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
                if (input.type === 'checkbox') {
                    input.checked = data[key] === 'on';
                } else {
                    input.value = data[key];
                }
            }
        });
    }
}

// Clear form data on successful submission
function clearFormData(formId) {
    localStorage.removeItem(`form_${formId}`);
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', initializeAutoSave);

// Archive Search and Filter Functionality
function searchArchive() {
    const searchTerm = document.getElementById('archive-search')?.value;
    if (searchTerm) {
        console.log('Searching archives for:', searchTerm);
        // Implement archive search functionality here
        alert('Archive search functionality would be implemented here for: ' + searchTerm);
    }
}

function resetFilters() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('archive-search');
    
    if (yearFilter) yearFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    console.log('Filters reset');
    // Implement filter reset functionality here
}

// Filter change handlers
document.addEventListener('DOMContentLoaded', function() {
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            console.log('Year filter changed to:', this.value);
            // Implement year filtering here
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            console.log('Type filter changed to:', this.value);
            // Implement type filtering here
        });
    }
});

// Issue card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const issueCards = document.querySelectorAll('.issue-card');
    
    issueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Article citation functionality
function copyCitation(citationText) {
    navigator.clipboard.writeText(citationText).then(() => {
        alert('Citation copied to clipboard!');
    }).catch(() => {
        alert('Please copy the citation manually: ' + citationText);
    });
}

// Download functionality placeholders
function downloadPDF(articleId) {
    console.log('Downloading PDF for article:', articleId);
    alert('PDF download functionality would be implemented here');
}

function downloadIssue(issueId) {
    console.log('Downloading issue:', issueId);
    alert('Issue download functionality would be implemented here');
}

// Article view tracking (placeholder)
function trackArticleView(articleId) {
    console.log('Tracking view for article:', articleId);
    // Implement analytics tracking here
}

// Advanced search modal (placeholder)
function openAdvancedSearch() {
    alert('Advanced search modal would open here');
}

// Export citations functionality
function exportCitations(format) {
    console.log('Exporting citations in format:', format);
    alert(`Citation export in ${format} format would be implemented here`);
}

// Table of contents toggle
document.addEventListener('DOMContentLoaded', function() {
    const tocToggles = document.querySelectorAll('.issue-toc');
    
    tocToggles.forEach(toc => {
        const header = toc.querySelector('h5');
        if (header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const list = toc.querySelector('ul');
                if (list) {
                    list.style.display = list.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    });
});
