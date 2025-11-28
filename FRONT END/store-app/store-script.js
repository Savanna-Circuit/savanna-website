// Store JavaScript - Slideshow and Filter Functionality

let currentSlideIndex = 1;

// Initialize slideshow
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlideIndex);
    setupFilterButtons();
});

// Slideshow navigation
function changeSlide(n) {
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
    showSlide(currentSlideIndex = n);
}

function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
        currentSlideIndex = 1;
    }
    if (n < 1) {
        currentSlideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    slides[currentSlideIndex - 1].classList.add('active');
    dots[currentSlideIndex - 1].classList.add('active');
}

// Auto-advance slideshow every 8 seconds
setInterval(function() {
    changeSlide(1);
}, 8000);

// Filter functionality
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const categories = document.querySelectorAll('.product-category');

    if (category === 'all') {
        // Show all categories
        categories.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        // Hide all categories first
        categories.forEach(cat => {
            cat.style.display = 'none';
        });

        // Show only products matching the category
        if (category === 'solar-cooling') {
            document.getElementById('solar-cooling').style.display = 'block';
        } else if (category === 'solar-thrive') {
            document.getElementById('solar-thrive').style.display = 'block';
        } else if (category === 'management-systems') {
            document.getElementById('management-systems').style.display = 'block';
        } else if (category === 'drying-systems') {
            document.getElementById('drying-systems').style.display = 'block';
        }
    }

    // Smooth scroll to products section
    const productsSection = document.querySelector('.products-showcase');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Mobile hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#checkout') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
