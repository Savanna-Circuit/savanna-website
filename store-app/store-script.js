// Store JavaScript - Slideshow and Filter Functionality
// This file powers the storefront UI (slides, filters, and basic navigation behaviors).

let currentSlideIndex = 1; // current active slide index (1-based)

// Initialize slideshow and filter button state when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlideIndex);
    setupFilterButtons();
});

// Slideshow navigation handlers
function changeSlide(n) { // move backward/forward by n
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) { // jump to specific slide
    showSlide(currentSlideIndex = n);
}

// Search button functionality
document.getElementById("searchBtn").addEventListener("click", () => {
    const value = document.getElementById("searchInput").value;
    if (value.trim() === "") {
        alert("Please enter a search term.");
    } else {
        alert("Searching for: " + value);
    }
});

// Cart button
document.getElementById("cartBtn").addEventListener("click", () => {
    alert("Opening your shopping cart...");
});

// Sign in button
document.getElementById("signInBtn").addEventListener("click", () => {
    alert("Redirecting to sign-in page...");
});


// Render slide state and dot indicators
function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');

    // Wrap around if out of bounds
    if (n > slides.length) currentSlideIndex = 1;
    if (n < 1) currentSlideIndex = slides.length;

    // Hide all slides and deactivate all dots
    for (let i = 0; i < slides.length; i++) slides[i].classList.remove('active');
    for (let i = 0; i < dots.length; i++) dots[i].classList.remove('active');

    // Activate current slide and dot
    slides[currentSlideIndex - 1].classList.add('active');
    dots[currentSlideIndex - 1].classList.add('active');
}

// Auto-advance slideshow every 8 seconds
setInterval(function() { changeSlide(1); }, 8000);

// Initialize category filter button active state and click behavior
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active button styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Filter product categories (show/hide category blocks)
function filterProducts(category) {
    const categories = document.querySelectorAll('.product-category');

    if (category === 'all') {
        // Show all categories
        categories.forEach(cat => { cat.style.display = 'block'; });
    } else {
        // Hide all categories first
        categories.forEach(cat => { cat.style.display = 'none'; });

        // Show a specific category by id
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

    // Smooth scroll to products section (helps on mobile)
    const productsSection = document.querySelector('.products-showcase');
    if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Mobile hamburger menu support (if a nav exists in this page)
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
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
});

// Smooth scroll for in-page anchor links
// (ignores links that are placeholders or checkout triggers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#checkout') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
