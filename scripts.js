// Hornback Communications - Digital Brochure Scripts
// This file contains JavaScript functionality for the digital brochure

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for internal links with header offset
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get the exact position we want to scroll to
                const elementRect = targetElement.getBoundingClientRect();
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const headerHeight = 70; // Navigation bar height
                
                // Calculate target position: current scroll + element position - header height
                const targetScrollTop = currentScrollTop + elementRect.top - headerHeight;
                
                // Smooth scroll to target position
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards for animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Client cards will be handled by the carousel fade effects instead

    // Observe value items for animation
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.name || !data.email || !data.message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Form input enhancements
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Show message function
    function showMessage(text, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 10px;
            font-size: 1rem;
            text-align: center;
            animation: fadeInUp 0.5s ease;
            ${type === 'success' ? 
                'background: rgba(40, 167, 69, 0.2); border: 2px solid rgba(40, 167, 69, 0.5); color: rgba(255,255,255,0.9);' : 
                'background: rgba(220, 53, 69, 0.2); border: 2px solid rgba(220, 53, 69, 0.5); color: rgba(255,255,255,0.9);'
            }
        `;
        
        // Insert message before submit button
        submitBtn.parentNode.insertBefore(messageDiv, submitBtn);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    // Add staggered animation to contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + (index * 100));
    });

    // Client cards will use simple grid layout - no special JavaScript needed


    // Client Carousel Functionality (for Hybrid Showcase design)
    const carousel = document.querySelector('.clients-track');
    const slides = document.querySelectorAll('.client-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');
    const counter = document.querySelector('.carousel-counter');
    
    if (carousel && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoplayInterval = null;
        
        function updateCarousel() {
            // Ensure currentSlide is within bounds
            currentSlide = Math.max(0, Math.min(currentSlide, totalSlides - 1));
            
            const translateX = -currentSlide * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
            
            // Update counter
            if (counter) {
                counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
            }
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Update button states
            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
        }
        
        function goToSlide(index) {
            if (index >= 0 && index < totalSlides && index !== currentSlide) {
                currentSlide = index;
                updateCarousel();
            }
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }
        
        function startAutoplay() {
            stopAutoplay(); // Clear any existing interval first
            autoplayInterval = setInterval(() => {
                if (currentSlide < totalSlides - 1) {
                    nextSlide();
                } else {
                    goToSlide(0); // Loop back to first slide
                }
            }, 5000);
        }
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoplay();
                setTimeout(startAutoplay, 3000); // Restart autoplay after 3 seconds
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoplay();
                setTimeout(startAutoplay, 3000); // Restart autoplay after 3 seconds
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoplay();
                setTimeout(startAutoplay, 3000); // Restart autoplay after 3 seconds
            });
        });
        
        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.clients-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoplay);
            carouselContainer.addEventListener('mouseleave', startAutoplay);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                stopAutoplay();
                setTimeout(startAutoplay, 3000);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                stopAutoplay();
                setTimeout(startAutoplay, 3000);
            }
        });
        
        // Initialize carousel
        updateCarousel();
        startAutoplay();
    }

});