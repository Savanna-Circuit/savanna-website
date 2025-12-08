// Slideshow Functionality
let slideIndex = 1;

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("fade");
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].classList.add("fade");
    dots[slideIndex - 1].classList.add("active");
}

// Initialize slideshow
document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex);
    
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 5000);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation to specific elements
document.querySelectorAll('.step, .impact-card, .testimonial-card, .cta-card').forEach(el => {
    observer.observe(el);
});

// Add fade-in-up animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Counter Animation for Impact Section
function animateCounters() {
    const impactCards = document.querySelectorAll('.impact-card h3');
    
    impactCards.forEach(card => {
        const finalValue = card.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        const isPercentage = finalValue.includes('%');
        const isMillion = finalValue.includes('M+');
        const isThousand = finalValue.includes(',');
        
        let currentValue = 0;
        const increment = Math.ceil(numericValue / 50);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let display = currentValue;
            if (isMillion) display += 'M+';
            if (isPercentage) display += '%';
            if (isThousand && currentValue < 10000) display = currentValue.toLocaleString() + '+';
            
            card.textContent = display;
        }, 30);
    });
}

// Trigger counter animation when section comes into view
const impactSection = document.querySelector('.impact-highlights');
if (impactSection) {
    const impactObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            impactObserver.unobserve(impactSection);
        }
    }, { threshold: 0.5 });
    
    impactObserver.observe(impactSection);
}

// Form Validation Helper (for future contact/partnership forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
        
        if (input.type === 'email' && !validateEmail(input.value)) {
            input.style.borderColor = 'red';
            isValid = false;
        }
    });
    
    return isValid;
}

// Sticky Header on Scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Log page load for analytics
console.log('Homepage loaded successfully');
