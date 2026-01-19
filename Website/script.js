// Load Header
// Determine correct path for Header.html based on current location
let headerPath = "Header.html";
if (window.location.pathname.includes("store-app")) {
    headerPath = "../Header.html";
} else if (window.location.pathname.includes("products-detailed")) {
    headerPath = "../../Header.html";
}

console.log("Attempting to load header from:", headerPath);

fetch(headerPath)
    .then(res => {
        if (!res.ok) {
            console.error(`Failed to load header: ${res.status} ${res.statusText}`);
            throw new Error(`Failed to load header: ${res.status}`);
        }
        return res.text();
    })
    .then(data => {
        const headerPlaceholder = document.getElementById("Header");
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = data;
            console.log("✓ Header loaded and injected successfully");
            // Defer initialization to ensure DOM is updated after innerHTML is set.
            setTimeout(() => {
                activateNavLink();
                initHamburger();
                initNewsletterPopup();
                initThemeToggle();
            }, 200);
        } else {
            console.warn("⚠ Header placeholder element (#Header) not found in page");
            // Try initializing newsletter anyway
            setTimeout(() => {
                initNewsletterPopup();
            }, 200);
        }
    })
    .catch(error => {
        console.error("✗ Error loading header:", error);
        console.log("Trying fallback: initializing newsletter directly");
        // Still try to initialize newsletter in case it exists on the page
        setTimeout(() => {
            initNewsletterPopup();
        }, 200);
    })
    .finally(() => {
        initTeamPage();
    });

// Highlight Active Page
function activateNavLink() {
    const links = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

// Mobile Hamburger Menu
function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // 2. Handle closing when clicking anywhere else on the document
    document.addEventListener("click", (event) => {
        // Check if the click happened outside the menu AND outside the hamburger button
        const isOutsideMenu = !navMenu.contains(event.target);
        const isOutsideHamburger = !hamburger.contains(event.target);

        if (navMenu.classList.contains("active") && isOutsideMenu && isOutsideHamburger) {
            navMenu.classList.remove("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Accordion for Solar Thrive Section
    var acc = document.getElementsByClassName("thrive-accordion-button");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    // Product card display logic
    const accordionItems = document.querySelectorAll('.thrive-accordion-content li');

    accordionItems.forEach(item => {
        const header = item.querySelector('.li-header');
        if (header) {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const isActive = item.classList.contains('active');
                
                // Close other items
                accordionItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
                
                // Update parent height
                const panel = item.closest('.thrive-accordion-content');
                if (panel && panel.style.maxHeight) {
                    setTimeout(() => {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }, 10);
                }
            });
        }
    });

    // Savings Calculator Logic
    const calcBtn = document.getElementById('calcSavingsBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const tradPrice = parseFloat(document.getElementById('tradCost').value) || 0;
            const iwdPrice = parseFloat(document.getElementById('iwdCost').value) || 0;
            const qty = parseFloat(document.getElementById('waterQty').value) || 0;
            
            const savings = tradPrice - (iwdPrice * qty);
            
            const resultDiv = document.getElementById('savingsResult');
            resultDiv.innerHTML = `Total Daily Savings: KSh ${savings.toLocaleString()}`;
        });
    }
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

// Scroll Animation for Elements - Optimized for Performance
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

// Activate the observer for all elements with the class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Dynamic Reveal Observer (Hide on exit, Show on enter) - Optimized
document.addEventListener("DOMContentLoaded", () => {
    const dynamicOptions = {
        threshold: 0.15,
        rootMargin: '50px 0px 50px 0px'
    };

    const dynamicObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Trigger counting if it's the impact section
                if (entry.target.classList.contains('impact-highlights')) {
                    animateImpactNumbers();
                }
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, dynamicOptions);

    document.querySelectorAll('.dynamic-reveal').forEach(el => dynamicObserver.observe(el));

    function animateImpactNumbers() {
        const impactHeaders = document.querySelectorAll('.impact-grid h3');
        impactHeaders.forEach(h3 => {
            const originalText = h3.innerText;
            // Extract numbers and non-numeric parts (like + or , or K)
            const targetNumber = parseInt(originalText.replace(/,/g, '').replace(/[^\d]/g, ''));
            const suffix = originalText.replace(/[0-9,]/g, '');
            const hasComma = originalText.includes(',');

            let startTimestamp = null;
            const duration = 2000; // 2 seconds

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                let currentNum = Math.floor(progress * targetNumber);
                
                // Format with commas if original had them
                let displayNum = hasComma ? currentNum.toLocaleString() : currentNum;
                h3.innerText = displayNum + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    h3.innerText = originalText; 
                }
            };

            window.requestAnimationFrame(step);
        });
    }
});

//team animation on about page
const teamSection = document.querySelector('#team');
const teamObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        teamSection.classList.add('revealed');
    }
}, { threshold: 0.2 });

if (teamSection) teamObserver.observe(teamSection);

//Animation for Impact Overview Section
document.addEventListener("DOMContentLoaded", () => {
    const impactSection = document.querySelector('.impact-overview-section');
    const metricNumbers = document.querySelectorAll('.metric-number');

    const observerOptions = {
        threshold: 0.2 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Reveal the cards by adding a trigger class or setting styles
                const cards = entry.target.querySelectorAll('.metric-card');
                cards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (impactSection) observer.observe(impactSection);

    function animateNumbers() {
        metricNumbers.forEach(el => {
            const originalText = el.innerText;
            // Extract the number part and any suffix (like +, K, or %)
            const targetValue = parseInt(originalText.replace(/,/g, '').replace(/[^\d]/g, ''));
            const suffix = originalText.replace(/[0-9,]/g, '');
            const hasComma = originalText.includes(',');

            let startTimestamp = null;
            const duration = 2000; 

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentNum = Math.floor(progress * targetValue);
                
                // Format back to original style (with commas if needed)
                let displayNum = hasComma ? currentNum.toLocaleString() : currentNum;
                el.innerText = displayNum + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.innerText = originalText; 
                }
            };

            window.requestAnimationFrame(step);
        });
    }

    // Close Savings Calculator when clicking outside
    const calcAccordion = document.querySelector('.calculator-accordion');
    if (calcAccordion) {
        document.addEventListener('click', (event) => {
            if (calcAccordion.hasAttribute('open') && !calcAccordion.contains(event.target)) {
                calcAccordion.removeAttribute('open');
            }
        });

        // Close Savings Calculator when scrolling past the section
        const calculatorSection = document.querySelector('.savings-calculator-section');
        if (calculatorSection) {
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && calcAccordion.hasAttribute('open')) {
                        calcAccordion.removeAttribute('open');
                    }
                });
            });
            scrollObserver.observe(calculatorSection);
        }
    }
});

      (function () {
        const track = document.querySelector('.partners-track');
        if (track) track.innerHTML = track.innerHTML + track.innerHTML; 
      })();

//workflow logic
{
    const initWorkflow = () => {
        const workflowOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const workflowObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Adds a slight delay for each card to create a staggered effect
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 100); 
                    
                    workflowObserver.unobserve(entry.target);
                }
            });
        }, workflowOptions);

        const cards = document.querySelectorAll('.seamless-card');
        cards.forEach(card => workflowObserver.observe(card));
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorkflow);
    } else {
        initWorkflow();
    }
}

// Hero Workflow Slideshow
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.hero-workflow-slideshow .slide-text');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3000); 
});

//PRODUCT CATALOGUE
{
  const downloadLink = document.querySelector('.download-btn');

  if (downloadLink) {
    downloadLink.addEventListener('click', function(e) {
      const originalText = this.querySelector('.btn-text').textContent;
      const btnText = this.querySelector('.btn-text');

      btnText.textContent = "Starting Download...";
      this.style.pointerEvents = "none";
      this.style.opacity = "0.8";

      setTimeout(() => {
        btnText.textContent = originalText;
        this.style.pointerEvents = "auto";
        this.style.opacity = "1";
      }, 3000);
    });
  }
}


//FOOTER
const footerHTML = `
    <!-- Footer Start -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="products.html">Products</a></li>
                    <li><a href="../store-app/index.html">Store</a></li>
                    <li><a href="impact.html">Impact</a></li>
                    <li><a href="careers.html">Careers</a></li>
                    
                </ul>
            </div>
            <div class="footer-section">
                <h4>Company</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="about.html#partners">Partners</a></li>
                    <li><a href="https://sav-circuit.com/privacy-policy/">Privacy Policy</a></li>
                    <li><a href="https://sav-circuit.com/terms-of-operations/">Terms of Service</a></li>
                    <li><a href="product quality policy">Product Policy</a></li>
                    </li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <div class="social-links">
                    <a href="https://www.facebook.com/savannacircuit/" aria-label="Facebook" class="social-facebook" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.24 10.44 22v-7.01H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.92h-2.34V22C18.34 21.24 22 17.1 22 12.07z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/savanna-circuit-technologies/about/" aria-label="LinkedIn" class="social-linkedin" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H5a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3h14Zm-9.54 19V10.5H7.06V19h2.4Zm-1.2-9.81a1.39 1.39 0 1 0 0-2.78 1.39 1.39 0 0 0 0 2.78ZM20 19v-5.2c0-2.8-1.49-4.1-3.47-4.1a3 3 0 0 0-2.72 1.49h-.06V10.5h-2.4V19h2.4v-4.48c0-1.18.21-2.32 1.69-2.32s1.5 1.36 1.5 2.4V19H20Z"/></svg>
                    </a>
                    <a href="https://www.instagram.com/savannacircuit/" aria-label="Instagram" class="social-instagram" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .4 1.4.8.4.4.6.8.8 1.4.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.4 1-.8 1.4-.4.4-.8.6-1.4.8-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.4-1.4-.8-.4-.4-.6-.8-.8-1.4-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.4-1 .8-1.4.4-.4.8-.6 1.4-.8.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.9-.1Zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Zm5.3-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg>
                    </a>
                    <a href="https://twitter.com/sav_circuittech" aria-label="X (Twitter)" class="social-x" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M17.53 3h3.13l-6.84 7.82L22 21h-6.7l-5.23-6.82L3.9 21H.75l7.3-8.34L1 3h6.86l4.73 6.2L17.53 3Zm-1.17 16.2h1.73L7.72 4.68H5.86L16.36 19.2Z"/></svg>
                    </a>
                    <a href="https://api.whatsapp.com/send/?phone=+254714574007&text=Hello,%20From%20SCT%20Website." aria-label="WhatsApp" class="social-whatsapp" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M20.5 3.5A10.5 10.5 0 0 0 3.8 17.9L2 22l4.3-1.7A10.5 10.5 0 1 0 20.5 3.5Zm-8.4 16.6c-1.8 0-3.5-.6-4.9-1.7l-.3-.2-2.9 1.1 1.1-2.8-.2-.3a8.5 8.5 0 1 1 7.2 4.9Zm4.9-6.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.4 0-.5.2-.7.2-.2.3-.3.4-.5.2-.2.1-.4 0-.6-.1-.2-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 3s1.2 3.5 1.3 3.7c.2.2 2.3 3.6 5.7 5 2.1.9 2.9 1 3.9.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.1-.2-.3-.3Z"/></svg>
                    </a>
                </div>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <address>
                    <span class="address-line">
                        <a href="https://goo.gl/maps/8NZGZXvDicZS7rgp9"target="_blank"><span class="address-text">Savanna Businness Park</span></a> 
                        <svg class="pin" viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.6 6 12 6 12s6-7.4 6-12c0-3.3-2.7-6-6-6Zm0 8.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 5.5 12 5.5s2.5 1.1 2.5 2.5S13.4 10.5 12 10.5Z"/></svg>
                        </span><br>
                    P.O. Box 5107-00200, Nairobi, Kenya
                </address>
                <ul class="contact-list">
                    <li>Tel: <a href="tel:0208000265">020 800 0265</a></li>
                    <li>Mobile: <a href="tel:+254714574007">+254 714 574 007</a></li>
                    <li>Email: <a href="mailto:info@sav-circuit.com">info@sav-circuit.com</a></li>
                
                </ul>
            </div>
           </div>
            <div class="footer-bottom">
               <p>&copy; 2025 Savanna Circuit Technologies. All rights reserved.</p>

        </div>
    </footer>
    <!-- Footer End -->
`;

// Function to inject the footer HTML into the page.
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    } else {
        console.error('Target element #footer-placeholder not found. Footer could not be loaded.');
    }
}

// Ensure the function runs when the script is loaded.
document.addEventListener('DOMContentLoaded', (event) => {
    loadFooter();
});

// footer auto updates year
document.getElementById('footer-placeholder').textContent = new Date().getFullYear();


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

// Sticky Header on Scroll - Optimized with Throttling
let lastScrollTop = 0;
let ticking = false;

function updateNavbarShadow() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbarShadow);
        ticking = true;
    }
}, { passive: true });

// Log page load for analytics
console.log('Homepage loaded successfully');

// Products Data for dynamic loading
const productsData = {
    'nomad-cans-10l': {
        title: 'Nomad Can 10L',
        image: '../images/nomad 10.png',
        summary: 'Nomad Cans are patented, insulated food-grade containers designed for the safe transport of milk. Built for modular use with Ice Water Dispensers (IWD) or mobile trikes, these cans maintain optimal temperature using a chilled glycol thermocore insert.',
        link: '../store-app/products-detailed/nomad-cans-10l.html'
    },
    'nomad-cans-25l': {
        title: 'Nomad Cans 25L',
        image: '../images/Nomad 25.png',
        summary: 'The Nomad Cans 25L provides mid-range capacity for farm cooperatives and larger dairy operations. Its enhanced thermal insulation maintains milk quality during medium-distance transport.',
        link: '../store-app/products-detailed/nomad-cans-25l.html'
    },
    'nomad-cans-50l': {
        title: 'Nomad Cans 50L',
        image: '../images/NOMAD CANS.png',
        summary: 'The Nomad Cans 50L is engineered for large cooperatives and commercial dairy operations. Its premium thermal insulation and high capacity make it ideal for long-distance milk transport while maintaining quality and minimizing losses.',
        link: '../store-app/products-detailed/nomad-cans-50l.html'
    },
    'iwd-ice-water-dispenser': {
        title: 'Ice Water Dispenser (IWD)',
        image: '../images/IWD.png',
        summary: 'This is a digitally controlled, solar-powered chilling system that produces and stores food-grade glycol-cooled water. This chilled water is used to cool milk, fish, and other perishables through closed-loop cold packs (ladder packs or thermocores). It acts as a mini cold chain anchor for farmers, fisherfolk, and vendors with limited access to full refrigeration.',
        link: '../store-app/products-detailed/iwd-ice-water-dispenser.html'
    },
    'eco-sav-bags': {
        title: 'EcoSav Bags',
        image: '../images/Eco-Sav bag(1).png',
        summary: 'EcoSav Bags are durable, insulated carry packs designed for transporting fish and produce in cooled conditions. Used together with ladder packs filled with chilled glycol water from Ice Water Dispensers, they preserve freshness, reduce spoilage, and deliver high-quality products to market.',
        link: '../store-app/products-detailed/eco-sav-bags.html'
    },
    'maziwaplus-prechiller-300': {
        title: 'MaziwaPlus Prechillers 300-1000L',
        image: '../images/M+ PRE CHILLER.png',
        summary: 'The MaziwaPlus Prechillers is an entry-level hybrid milk chilling solution designed for small to medium-sized dairy operations. It efficiently cools and stores milk while reducing operational costs through intelligent solar integration.',
        link: '../store-app/products-detailed/maziwaplus-prechiller-300.html'
    },
    'maziwaplus-prechiller-pro': {
        title: 'MaziwaPlus Prechillers Pro 300-2000L',
        image: '../images/pre chillers PRO.png',
        summary: 'The advanced MaziwaPlus Prechillers Pro features smart M+ DMS monitoring, superior temperature precision, and enhanced capacity range. Ideal for commercial dairy operations seeking maximum efficiency and real-time operational insights.',
        link: '../store-app/products-detailed/maziwaplus-prechiller-pro.html'
    },
    'bmc-hybrid': {
        title: 'Bulk Milk Chiller (Hybrid)',
        image: '../images/HYBRID BMC.png',
        summary: 'Designed for cooperative hubs and milk collection centers, Bulk Milk Chillers rapidly chill and store large volumes of milk, safeguarding quality from farm to processor. Powered by solar with hybrid backup options, they provide dependable, hygienic bulk milk handling in off-grid or grid-limited areas.',
        link: '../store-app/products-detailed/bmc-hybrid.html'
    },
    'bmc-solar': {
        title: 'Bulk Milk Chiller (Solar)',
        image: '../images/SOLAR BMC.png',
        summary: 'Designed for cooperative hubs and milk collection centers, the solar-powered Bulk Milk Chiller rapidly chills and stores large volumes of milk, safeguarding quality from farm to processor. Optimized for off-grid reliability and seamless digital logging through MaziwaPlus DMS.',
        link: '../store-app/products-detailed/bmc-solar.html'
    },
    'eco-sav-pasteurizer': {
        title: 'EcoSav Pasteurisers',
        image: '../images/PASTURERIZER.png',
        summary: 'EcoSav Pasteurisers enable safe, efficient milk processing, extending shelf life and meeting food safety standards. Built for small-scale and cooperative-level dairy production, they ensure high-quality pasteurised milk and dairy products ready for market.',
        link: '../store-app/products-detailed/eco-sav-pasteurizer.html'
    },
    'maziwaplus-dms': {
        title: 'MaziwaPlus DMS',
        image: '../images/M+DMS.png',
        summary: 'MaziwaPlus DMS is a cloud-based, mobile-integrated platform for real-time monitoring, route management, and digital records across the dairy supply chain. It connects milk transporters, processors, quality officers, and administrators into a single, traceable ecosystem.',
        link: '../store-app/products-detailed/maziwaplus-dms.html'
    },
    'eco-sav-dryer': {
        title: 'Eco-Sav Dryer',
        image: '../images/DRYER.webp',
        summary: 'The Eco-Sav Dryer enables solar-powered drying of agricultural products - from grains to herbs, fruits to leather. Convert farm surplus into valuable dried products for premium markets.',
        link: '../store-app/products-detailed/eco-sav-dryer.html'
    },
    'caas': {
        title: 'Cooling as a Service (CaaS)',
        image: '', // No image for financing
        summary: 'Pay monthly for cooling services without purchasing equipment upfront. Includes installation, maintenance, and support. Fixed monthly fee based on capacity and usage. Ideal for cooperatives and aggregation centers.',
        link: 'https://wa.me/254714574007?text=Hello%20Savanna%20Circuit,%20I%20would%20like%20a%20to%20apply%20for%20cooling%20as%20a%20Service'
    },
    'lease': {
        title: 'Lease Programs',
        image: '',
        summary: 'Lease equipment with option to purchase, making solutions accessible to all. Low upfront cost with predictable monthly payments. Option to own at end of term. Flexible terms from 12–48 months.',
        link: 'https://wa.me/254714574007?text=Hello%20Savanna%20Circuit,%20I%20would%20like%20a%20to%20apply%20for%20lease%20programs'
    },
    'hybrid-financing': {
        title: 'Hybrid Financing',
        image: '',
        summary: 'Customize payment plans tailored to your farm\'s needs and cash flow. Mix of upfront + subscription or lease. Structured for seasonality of income. Available for both equipment and software.',
        link: 'https://wa.me/254714574007?text=Hello%20Savanna%20Circuit,%20I%20would%20like%20a%20to%20apply%20for%20Hybrid%20financing%20services'
    }
};

// Populate product cards dynamically
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-card').forEach(card => {
        const product = card.dataset.product;
        if (productsData[product]) {
            const data = productsData[product];
            card.querySelector('.product-image').src = data.image;
            card.querySelector('.product-image').alt = data.title;
            card.querySelector('h4').textContent = data.title;
            card.querySelector('.product-description').textContent = data.summary;
            card.querySelector('.product-actions a').href = data.link;
        }
    });
});



//support  and contact page only
function handleCategoryChange() {
  // Get the selected value from the dropdown
  const categorySelect = document.getElementById('category-select');
  if (!categorySelect) return;
  const selectedCategory = categorySelect.value;
  
  // Get all category-specific field containers
  const specificFields = document.querySelectorAll('.category-specific');
  
  // Hide all specific field containers first
  specificFields.forEach(field => {
    field.style.display = 'none';
  });
  
  // Determine which specific container to show based on the selection
  if (selectedCategory === 'Farmer' || selectedCategory === 'Distributor') {
    document.getElementById('farmer-fields').style.display = 'block';
  } else if (selectedCategory === 'Partner') {
    document.getElementById('partner-fields').style.display = 'block';
  } else if (selectedCategory === 'Media') {
    document.getElementById('media-fields').style.display = 'block';
  }
 }

// Get the category select element
const categorySelect = document.getElementById('category-select');

if (categorySelect) {
    // Add an event listener to call the function whenever the selection changes
    categorySelect.addEventListener('change', handleCategoryChange);

    // Optional: Call the function once on page load to set the initial state (hidden)
    handleCategoryChange();
}

/*FAQ Controller - Entrance Reveal & Exclusive Accordion */
document.addEventListener("DOMContentLoaded", () => {
    const faqSection = document.querySelector('.faq-section');
    const faqItems = document.querySelectorAll('.faq-item');

    // 1. Entrance Reveal Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Triggers the slideInLeft CSS transition
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (faqSection) observer.observe(faqSection);

    // 2. Exclusive Accordion Logic (Single Open)
    faqItems.forEach((item) => {
        const summary = item.querySelector('summary');

        summary.addEventListener('click', (e) => {
            // If the clicked item is currently closed and about to open
            if (!item.hasAttribute('open')) {
                // Close all other open items
                faqItems.forEach((otherItem) => {
                    if (otherItem !== item && otherItem.hasAttribute('open')) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });
});


// Load News Data
document.addEventListener('DOMContentLoaded', function() {
    // Icon mappings for stories
    const storyIcons = {
        cow: `<svg fill="#333" aria-hidden="true" focusable="false" class="icon" viewBox="0 0 640 640" width="4em" height="4em" fill="#333" xmlns="http://www.w3.org/2000/svg">
            <path d="M96 288L96 480C96 497.7 110.3 512 128 512L160 512C177.7 512 192 497.7 192 480L192 391.8C201.9 398.4 212.6 403.8 224 407.9L224 432.1C224 440.9 231.2 448.1 240 448.1C248.8 448.1 256 440.9 256 432.1L256 415.2C261.3 415.8 266.6 416.1 272 416.1C277.4 416.1 282.7 415.8 288 415.2L288 432.1C288 440.9 295.2 448.1 304 448.1C312.8 448.1 320 440.9 320 432.1L320 407.9C331.4 403.9 342.1 398.5 352 391.8L352 480C352 497.7 366.3 512 384 512L416 512C433.7 512 448 497.7 448 480L448 320L480 352L480 401.5C480 411 482.8 420.2 488.1 428.1L530 491C538.8 504.1 553.5 512 569.3 512C591.8 512 611.2 496.1 615.6 474L635.9 372.4C638.5 359.4 635.6 345.9 627.9 335.1L624 329.6L624 248C624 234.7 613.3 224 600 224C586.7 224 576 234.7 576 248L576 262.4L523.1 188.3C496 150.5 452.4 128 405.9 128L144 128C77.7 128 24 181.7 24 248L24 302C9.4 313.8 0 331.8 0 352L0 369.6C0 377.6 6.4 384 14.4 384C46.2 384 72 358.2 72 326.4L72 248C72 223.7 84.1 202.2 102.5 189.1C98.3 199.9 96 211.7 96 224L96 288zM560 400C560 391.2 567.2 384 576 384C584.8 384 592 391.2 592 400C592 408.8 584.8 416 576 416C567.2 416 560 408.8 560 400zM166.6 230.6C162.4 226.4 160 220.6 160 214.6C160 202.1 170.1 192 182.6 192L361.3 192C373.8 192 383.9 202.1 383.9 214.6C383.9 220.6 381.5 226.4 377.3 230.6L353.9 254C332.2 275.8 302.7 288 272 288C241.3 288 211.8 275.8 190.1 254.1L166.7 230.7z"/>
        </svg>`,
        users: `<svg fill="#333" aria-hidden="true" focusable="false" class="icon" viewBox="0 0 640 640" width="4em" height="4em" fill="#333" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"/>
        </svg>`,
        'dollar-sign': `<svg fill="#333" aria-hidden="true" focusable="false" class="icon" viewBox="0 0 640 640" width="4em" height="4em" fill="#333" xmlns="http://www.w3.org/2000/svg">
            <path d="M320 48C306.7 48 296 58.7 296 72L296 84L294.2 84C257.6 84 228 113.7 228 150.2C228 183.6 252.9 211.8 286 215.9L347 223.5C352.1 224.1 356 228.5 356 233.7C356 239.4 351.4 243.9 345.8 243.9L272 244C256.5 244 244 256.5 244 272C244 287.5 256.5 300 272 300L296 300L296 312C296 325.3 306.7 336 320 336C333.3 336 344 325.3 344 312L344 300L345.8 300C382.4 300 412 270.3 412 233.8C412 200.4 387.1 172.2 354 168.1L293 160.5C287.9 159.9 284 155.5 284 150.3C284 144.6 288.6 140.1 294.2 140.1L360 140C375.5 140 388 127.5 388 112C388 96.5 375.5 84 360 84L344 84L344 72C344 58.7 333.3 48 320 48zM141.3 405.5L98.7 448L64 448C46.3 448 32 462.3 32 480L32 544C32 561.7 46.3 576 64 576L384.5 576C413.5 576 441.8 566.7 465.2 549.5L591.8 456.2C609.6 443.1 613.4 418.1 600.3 400.3C587.2 382.5 562.2 378.7 544.4 391.8L424.6 480L312 480C298.7 480 288 469.3 288 456C288 442.7 298.7 432 312 432L384 432C401.7 432 416 417.7 416 400C416 382.3 401.7 368 384 368L231.8 368C197.9 368 165.3 381.5 141.3 405.5z"/>
        </svg>`,
        leaf: `<svg fill="#333" aria-hidden="true" focusable="false" class="icon" viewBox="0 0 640 640" width="4em" height="4em" fill="#333" xmlns="http://www.w3.org/2000/svg">
            <path d="M511.6 239C480 164.4 406.1 112 320 112C297.9 112 276.6 115.5 256.6 121.8C256.2 123.8 256 125.9 256 128L256 201.4C256 213.9 266.1 224 278.6 224C284.6 224 290.4 221.6 294.6 217.4L310.6 201.4C316.6 195.4 324.7 192 333.2 192L338.7 192C367.2 192 381.5 226.5 361.3 246.6C355.3 252.6 347.2 256 338.7 256L277.2 256C268.7 256 260.6 259.4 254.6 265.4L233.3 286.7C227.3 292.7 223.9 300.8 223.9 309.3L223.9 352C223.9 369.7 238.2 384 255.9 384L287.9 384C305.6 384 319.9 398.3 319.9 416L319.9 448C319.9 465.7 334.2 480 351.9 480L354.6 480C363.1 480 371.2 476.6 377.2 470.6L406.5 441.3C412.5 435.3 415.9 427.2 415.9 418.7L415.9 400C415.9 391.2 423.1 384 431.9 384C440.7 384 447.9 376.8 447.9 368L447.9 333.3C447.9 324.8 444.5 316.7 438.5 310.7L422.5 294.7C418.3 290.5 415.9 284.7 415.9 278.7C415.9 266.2 426 256.1 438.5 256.1L483.5 256.1C495.9 256.1 506.2 249 511.5 239.1zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z"/>
        </svg>`
    };

    // Icon mappings for media gallery
    const mediaIcons = {
        video: `<svg xmlns="http://www.w3.org/2000/svg" fill="#333"  viewBox="0 0 640 600" height="2em" width="2em"><path d="M96 64c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L96 64zM464 336l73.5 58.8c4.2 3.4 9.4 5.2 14.8 5.2 13.1 0 23.7-10.6 23.7-23.7l0-240.6c0-13.1-10.6-23.7-23.7-23.7-5.4 0-10.6 1.8-14.8 5.2L464 176 464 336z"/></svg>`,
        camera: `<svg xmlns="http://www.w3.org/2000/svg" fill="#333"  viewBox="0 0 640 640" height="2em" width="2em"><path d="M193.1 32c-18.7 0-36.2 9.4-46.6 24.9L120.5 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-56.5 0-26-39.1C355.1 41.4 337.6 32 318.9 32L193.1 32zm-6.7 51.6c1.5-2.2 4-3.6 6.7-3.6l125.7 0c2.7 0 5.2 1.3 6.7 3.6l33.2 49.8c4.5 6.7 11.9 10.7 20 10.7l69.3 0c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l69.3 0c8 0 15.5-4 20-10.7l33.2-49.8zM256 384a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 272a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>`,
        book: `<svg xmlns="http://www.w3.org/2000/svg" fill="#333"  viewBox="0 0 640 640" height="2em" width="2em"><path d="M232 144C218.7 144 208 154.7 208 168L208 472C208 480.4 206.6 488.5 203.9 496L504 496C517.3 496 528 485.3 528 472L528 168C528 154.7 517.3 144 504 144L232 144zM136 544C96.2 544 64 511.8 64 472L64 176C64 162.7 74.7 152 88 152C101.3 152 112 162.7 112 176L112 472C112 485.3 122.7 496 136 496C149.3 496 160 485.3 160 472L160 168C160 128.2 192.2 96 232 96L504 96C543.8 96 576 128.2 576 168L576 472C576 511.8 543.8 544 504 544L136 544zM256 216C256 202.7 266.7 192 280 192L328 192C341.3 192 352 202.7 352 216L352 264C352 277.3 341.3 288 328 288L280 288C266.7 288 256 277.3 256 264L256 216zM408 240L456 240C469.3 240 480 250.7 480 264C480 277.3 469.3 288 456 288L408 288C394.7 288 384 277.3 384 264C384 250.7 394.7 240 408 240zM280 320L456 320C469.3 320 480 330.7 480 344C480 357.3 469.3 368 456 368L280 368C266.7 368 256 357.3 256 344C256 330.7 266.7 320 280 320zM280 400L456 400C469.3 400 480 410.7 480 424C480 437.3 469.3 448 456 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400z"/></svg>`,
        users: `<svg xmlns="http://www.w3.org/2000/svg" fill="#333"  viewBox="0 0 640 640" height="2em" width="2em"><path d="M64 128a112 112 0 1 1 224 0 112 112 0 1 1 -224 0zM0 464c0-97.2 78.8-176 176-176s176 78.8 176 176l0 6c0 23.2-18.8 42-42 42L42 512c-23.2 0-42-18.8-42-42l0-6zM432 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm0 240c79.5 0 144 64.5 144 144l0 22.4c0 23-18.6 41.6-41.6 41.6l-144.8 0c6.6-12.5 10.4-26.8 10.4-42l0-6c0-51.5-17.4-98.9-46.5-136.7 22.6-14.7 49.6-23.3 78.5-23.3z"/></svg>`,
        presentation: `<svg xmlns="http://www.w3.org/2000/svg" fill="#333" viewBox="0 0 640 640" height="2em" width="2em"><path d="M64 48l112 0 0 88c0 39.8 32.2 72 72 72l88 0 0 240c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16zM224 67.9l92.1 92.1-68.1 0c-13.3 0-24-10.7-24-24l0-68.1zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-261.5c0-17-6.7-33.3-18.7-45.3L242.7 18.7C230.7 6.7 214.5 0 197.5 0L64 0zM80 288l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-24 35 35c3.2 3.2 7.5 5 12 5 9.4 0 17-7.6 17-17l0-94.1c0-9.4-7.6-17-17-17-4.5 0-8.8 1.8-12 5l-35 35 0-24c0-17.7-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32z"/></svg>`,
        chart: `<svg xmlns="http://www.w3.org/2000/svg" fill="#333"  viewBox="0 0 640 640" height="2em" width="2em"><path d="M128 128C128 110.3 113.7 96 96 96C78.3 96 64 110.3 64 128L64 464C64 508.2 99.8 544 144 544L544 544C561.7 544 576 529.7 576 512C576 494.3 561.7 480 544 480L144 480C135.2 480 128 472.8 128 464L128 128zM534.6 214.6C547.1 202.1 547.1 181.8 534.6 169.3C522.1 156.8 501.8 156.8 489.3 169.3L384 274.7L326.6 217.4C314.1 204.9 293.8 204.9 281.3 217.4L185.3 313.4C172.8 325.9 172.8 346.2 185.3 358.7C197.8 371.2 218.1 371.2 230.6 358.7L304 285.3L361.4 342.7C373.9 355.2 394.2 355.2 406.7 342.7L534.7 214.7z"/></svg>`
    };

    if (document.getElementById('latest-updates-grid')) {
        fetch('impact-data.json')
            .then(response => response.json())
            .then(data => {
                const updatesGrid = document.getElementById('latest-updates-grid');
                data.latestUpdates.forEach(update => {
                    const card = document.createElement('div');
                    card.className = 'news-card';
                    card.innerHTML = `
                        <h3>${update.title}</h3>
                        <p class="news-date">${update.date}</p>
                        <p>${update.description}</p>
                        <a href="${update.link}" class="cta-button secondary">Read More</a>
                    `;
                    updatesGrid.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading latest updates:', error));
    }

    if (document.getElementById('stories-grid')) {
        fetch('impact-data.json')
            .then(response => response.json())
            .then(data => {
                const storiesGrid = document.getElementById('stories-grid');
                data.stories.forEach(story => {
                    const card = document.createElement('div');
                    card.className = 'story-card';
                    card.innerHTML = `
                        <div style="margin-bottom: 1rem;">${storyIcons[story.icon]}</div>
                        <h3>${story.title}</h3>
                        <p>${story.description}</p>
                        <a href="${story.link}" class="cta-button secondary">Read Story</a>
                    `;
                    storiesGrid.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading stories:', error));
    }

    if (document.getElementById('press-mentions')) {
        fetch('impact-data.json')
            .then(response => response.json())
            .then(data => {
                const pressMentions = document.getElementById('press-mentions');
                data.pressCoverage.forEach(press => {
                    const mention = document.createElement('div');
                    mention.className = 'press-mention';
                    mention.innerHTML = `
                        <p class="press-source">${press.source}</p>
                        <p class="press-title">${press.title}</p>
                        <a href="${press.link}" class="cta-link">Read Article →</a>
                    `;
                    pressMentions.appendChild(mention);
                });
            })
            .catch(error => console.error('Error loading press coverage:', error));
    }

    if (document.getElementById('media-gallery')) {
        fetch('impact-data.json')
            .then(response => response.json())
            .then(data => {
                const mediaGallery = document.getElementById('media-gallery');
                data.mediaGallery.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'media-card ' + item.type;
                    card.innerHTML = `
                        <div class="media-icon">${mediaIcons[item.icon]}</div>
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <span class="media-type">${item.mediaType}</span>
                        <a href="${item.link}" class="media-link">${item.linkText}</a>
                    `;
                    mediaGallery.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading media gallery:', error));
    }

    if (document.getElementById('press-content')) {
        fetch('impact-data.json')
            .then(response => response.json())
            .then(data => {
                const pressContent = document.getElementById('press-content');
                const pressKit = data.pressKit;

                // Inquiries section
                const inquiriesSection = document.createElement('div');
                inquiriesSection.className = 'press-section';
                inquiriesSection.innerHTML = `
                    <h4>${pressKit.inquiries.title}</h4>
                    <p>${pressKit.inquiries.description}</p>
                    <p><strong>Email:</strong> ${pressKit.inquiries.email}</p>
                    <p><strong>Phone:</strong> ${pressKit.inquiries.phone}</p>
                    <p><strong>Address:</strong><svg class="pin" fill=#333 viewBox="0 0 20 20" aria-hidden="true"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.6 6 12 6 12s6-7.4 6-12c0-3.3-2.7-6-6-6Zm0 8.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 5.5 12 5.5s2.5 1.1 2.5 2.5S13.4 10.5 12 10.5Z"/></svg>
                        <a href="${pressKit.inquiries.mapLink}" target="_blank"><span class="address-text">${pressKit.inquiries.address}</span></a></p>
                `;
                pressContent.appendChild(inquiriesSection);

                // Media Kit section
                if (pressKit.mediaKit) {
                    const mediaKitSection = document.createElement('div');
                    mediaKitSection.className = 'press-section';
                    mediaKitSection.innerHTML = `
                        <h4>${pressKit.mediaKit.title}</h4>
                        <p>${pressKit.mediaKit.description}</p>
                        <ul class="media-kit-list">
                            ${pressKit.mediaKit.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <a href="${pressKit.mediaKit.link}" class="cta-button primary">${pressKit.mediaKit.buttonText}</a>
                    `;
                    pressContent.appendChild(mediaKitSection);
                }
            })
            .catch(error => console.error('Error loading press content:', error));
    }

    if (document.getElementById('reports-grid')) {
        fetch('impact-data.json')
            .then(response => response.json())
            .then(data => {
                const reportsGrid = document.getElementById('reports-grid');
                const reportIcons = {
                    report: `<svg fill=#333 aria-hidden="true" focusable="false" class="icon" viewBox="2 -5 600 640" width="4em" height="4em" xmlns="http://www.w3.org/2000/svg"><path d="M96 96C113.7 96 128 110.3 128 128L128 464C128 472.8 135.2 480 144 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L144 544C99.8 544 64 508.2 64 464L64 128C64 110.3 78.3 96 96 96zM208 288C225.7 288 240 302.3 240 320L240 384C240 401.7 225.7 416 208 416C190.3 416 176 401.7 176 384L176 320C176 302.3 190.3 288 208 288zM352 224L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224zM432 256C449.7 256 464 270.3 464 288L464 384C464 401.7 449.7 416 432 416C414.3 416 400 401.7 400 384L400 288C400 270.3 414.3 256 432 256zM576 160L576 384C576 401.7 561.7 416 544 416C526.3 416 512 401.7 512 384L512 160C512 142.3 526.3 128 544 128C561.7 128 576 142.3 576 160z"/></svg>`,
                    brief: `<svg fill=#333 aria-hidden="true" focusable="false" class="icon" viewBox="2 -5 600 640" width="4em" height="4em" xmlns="http://www.w3.org/2000/svg"><path d="M439.4 96L448 96C483.3 96 512 124.7 512 160L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 160C128 124.7 156.7 96 192 96L200.6 96C211.6 76.9 232.3 64 256 64L384 64C407.7 64 428.4 76.9 439.4 96zM376 176C389.3 176 400 165.3 400 152C400 138.7 389.3 128 376 128L264 128C250.7 128 240 138.7 240 152C240 165.3 250.7 176 264 176L376 176zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM288 320C288 333.3 298.7 344 312 344L424 344C437.3 344 448 333.3 448 320C448 306.7 437.3 296 424 296L312 296C298.7 296 288 306.7 288 320zM288 448C288 461.3 298.7 472 312 472L424 472C437.3 472 448 461.3 448 448C448 434.7 437.3 424 424 424L312 424C298.7 424 288 434.7 288 448zM224 480C241.7 480 256 465.7 256 448C256 430.3 241.7 416 224 416C206.3 416 192 430.3 192 448C192 465.7 206.3 480 224 480z"/></svg>`,
                    "case-study": `<svg fill=#333 aria-hidden="true" focusable="false" class="icon" viewBox="2 -5 600 640" width="4em" height="4em" xmlns="http://www.w3.org/2000/svg"><path d="M128 128C128 110.3 113.7 96 96 96C78.3 96 64 110.3 64 128L64 464C64 508.2 99.8 544 144 544L544 544C561.7 544 576 529.7 576 512C576 494.3 561.7 480 544 480L144 480C135.2 480 128 472.8 128 464L128 128zM534.6 214.6C547.1 202.1 547.1 181.8 534.6 169.3C522.1 156.8 501.8 156.8 489.3 169.3L384 274.7L326.6 217.4C314.1 204.9 293.8 204.9 281.3 217.4L185.3 313.4C172.8 325.9 172.8 346.2 185.3 358.7C197.8 371.2 218.1 371.2 230.6 358.7L304 285.3L361.4 342.7C373.9 355.2 394.2 355.2 406.7 342.7L534.7 214.7z"/></svg>`,
                    leaf: storyIcons.leaf
                };

                reportsGrid.innerHTML = ''; 
                data.reports.forEach(report => {
                    const card = document.createElement('div');
                    card.className = 'report-card';
                    card.innerHTML = `
                        <div style="margin-bottom: 1rem;">${reportIcons[report.icon]}</div>
                        <h3>${report.title}</h3>
                        <p>${report.description}</p>
                        <a href="${report.link}" class="cta-button primary">${report.buttonText}</a>
                    `;
                    reportsGrid.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading reports:', error));
    }
});

// Newsletter Popup Logic
let newsletterInitialized = false;

function initNewsletterPopup(retryCount = 0) {
    if (newsletterInitialized) {
        console.log("Newsletter popup already initialized, skipping");
        return;
    }
    
    const modal = document.getElementById("newsletterPopupModal");
    const closeBtn = document.getElementById("closeNewsletterPopup");
    const icon = document.getElementById("newsletterIcon");
    const openBtn = document.getElementById("openNewsletterPopup");
    const form = document.getElementById("newsletterForm");

    const allFound = modal && closeBtn && icon && openBtn && form;
    
    if (!allFound) {
        if (retryCount === 0) {
            console.log("Attempting to find newsletter elements... (Attempt 1/40)");
        }
        
        if (retryCount >= 40) {
            console.error("✗ Newsletter popup elements NOT found after 40 retries (6 seconds)");
            console.error("Missing elements:", {
                "newsletterPopupModal": !modal,
                "closeNewsletterPopup": !closeBtn,
                "newsletterIcon": !icon,
                "openNewsletterPopup": !openBtn,
                "newsletterForm": !form
            });
            console.info("Newsletter popup will not be available on this page.");
            return;
        }
        
        setTimeout(() => {
            initNewsletterPopup(retryCount + 1);
        }, 150);
        return;
    }

    newsletterInitialized = true;
    console.log("✓ Newsletter popup initialized successfully at retry count:", retryCount);
    
    // Check session storage to see if previously closed
    const isClosed = sessionStorage.getItem("newsletterClosed");
    console.log("Newsletter status:", isClosed ? "Previously closed (will show icon)" : "First time (will show modal in 3s)");

    // Close Modal Action
    const closeModal = () => {
        modal.style.display = "none";
        icon.style.display = "block";
        sessionStorage.setItem("newsletterClosed", "true");
        console.log("Newsletter modal closed, icon displayed");
    };

    if (!isClosed) {
        // Show modal after 3 seconds
        setTimeout(() => {
            if (modal) {
                modal.style.display = "flex";
                console.log("Newsletter modal displayed after 3s");
            }
        }, 3000);
    } else {
        // If closed previously, show the icon immediately
        icon.style.display = "block";
        console.log("Newsletter icon displayed (was previously closed)");
    }

    // Close button click
    closeBtn.addEventListener("click", closeModal);

    // Open Modal Action from icon click
    openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
        icon.style.display = "none";
        console.log("Newsletter modal reopened from icon");
    });

    // Close on outside click (clicking the modal background)
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle Form Submit
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                console.log("Newsletter subscription received for:", emailInput.value);
                alert("Thank you for subscribing!");
                emailInput.value = ""; // Clear the input
                closeModal();
            }
        });
    }
}

// Team Page Logic
const teamData = {
    "Management": [
        {
            role: "Chief Executive Officer",
            description: "Provides strategic leadership, drives company vision, and leads partnerships.",
            image: "../images/TEAM.JPG"
        },
        {
            role: "Director of Operations",
            description: "Oversees product engineering, solar cooling R&D, and digital platforms.",
            image: "../images/TEAM.JPG"
        },
        {
            role: "Manager Operations",
            description: "Coordinates day to day operations, production, and service excellence across regions.",
            image: "../images/TEAM.JPG"
        }
    ],
    "Team": [
        {
            role: "Field Technicians",
            description: "Deploy and maintain systems, train users, and support our customers in the field.",
            image: "../images/TEAM (2).JPG"
        },
        {
            role: "Sales & Partnerships",
            description: "Builds relationships with farmers and partners to expand our impact.",
            image: "../images/TEAM (2).JPG"
        },
        {
            role: "Customer Support",
            description: "Ensures customers receive timely assistance and continuous value from our products.",
            image: "../images/TEAM (2).JPG"
        },
        {
            role: "Production",
            description: "Ensures customers goods are produced at the highest quality possible with swiftness to assure continuous value from our products.",
            image: "../images/TEAM (2).JPG"
        }
    ]
};

function initTeamPage() {
    const container = document.getElementById('team-dynamic-container');
    if (!container) return;

    Object.keys(teamData).forEach((group, index) => {
        const details = document.createElement('details');
        details.setAttribute('data-collapsible', '');
        details.setAttribute('data-group', 'team');
        if (index === 0) details.open = true;

        const summary = document.createElement('summary');
        const h2 = document.createElement('h2');
        h2.textContent = group;
        summary.appendChild(h2);
        details.appendChild(summary);

        const grid = document.createElement('div');
        grid.className = 'team-grid';
        grid.style.marginTop = '1rem';

        teamData[group].forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'team-member';
            
            // Determine styles based on group to match original design
            let imgStyle = "width:100%;border-radius:8px;margin-bottom:1rem;";
            if (group === "Management") {
                imgStyle += "max-width:280px;object-fit:cover;height:220px;";
            } else {
                imgStyle += "max-width:100%;object-fit:contain;height:auto;";
            }

            memberDiv.innerHTML = `
                <img src="${member.image}" alt="${member.role}" style="${imgStyle}">
                <h3>${member.role}</h3>
                <p>${member.description}</p>
            `;
            grid.appendChild(memberDiv);
        });

        details.appendChild(grid);
        container.appendChild(details);
    });
}
// Theme Toggle Logic
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(sunIcon && moonIcon) {
             sunIcon.style.display = 'block';
             moonIcon.style.display = 'none';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if(sunIcon && moonIcon) {
                sunIcon.style.display = newTheme === 'dark' ? 'block' : 'none';
                moonIcon.style.display = newTheme === 'dark' ? 'none' : 'block';
            }
        });
    }
}
