// Store JavaScript - Enhanced with Cart, Search, Checkout, and User Profile Functionality
// This file powers the storefront UI and e-commerce features

let currentSlideIndex = 1; // current active slide index (1-based)

// Product data structure for cart management
const productData = {
    "Nomad Cans - 10L": { price: 3990, image: "../images/NOMAD%2010%20LTRS.png" },
    "Nomad Cans - 25L": { price: 6990, image: "../images/nomad%2025.JPG" },
    "Nomad Cans - 50L": { price: 9990, image: "../images/NOMAD%20CANS.jpeg" },
    "IWD Ice Water Dispenser": { price: 129900, image: "../images/IWD.jpg" },
    "Eco-Sav Thermal Bags": { price: 1990, image: "../images/Eco-Sav%20bag.jpg" },
    "MaziwaPlus Prechillers 300-1000L": { price: 249900, image: "../images/M+%20PRE%20CHILLER.JPG" },
    "MaziwaPlus Prechillers Pro 200-2000L": { price: 499900, image: "../images/pre%20chillers%20PRO.jpg" },
    "BMC Hybrid Milk Cooler": { price: 699900, image: "../images/HYBRID%20BMC.jpeg" },
    "BMC Solar Milk Cooler": { price: 849900, image: "../images/SOLAR%20BMC.jpg" },
    "Eco-Sav Pasteurizer 100-500L": { price: 329900, image: "../images/PASTUERIZER.jpg" },
    "MaziwaPlus DMS": { price: 2490, image: "../images/M+%20DMS.png", subscription: true },
    "Eco-Sav Solar Dryer": { price: 329900, image: "../images/dryer.JPG" }
};

// Cart management using localStorage
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
    }

    loadCart() {
        const saved = localStorage.getItem('savanna_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('savanna_cart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    addItem(productName) {
        const existingItem = this.items.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const product = productData[productName];
            if (product) {
                this.items.push({
                    name: productName,
                    price: product.price,
                    quantity: 1,
                    image: product.image,
                    subscription: product.subscription || false
                });
            }
        }
        this.saveCart();
    }

    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.saveCart();
    }

    updateQuantity(productName, quantity) {
        const item = this.items.find(item => item.name === productName);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    updateCartBadge() {
        const count = this.getItemCount();
        let badge = document.querySelector('.cart-badge');
        
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                document.getElementById('cartBtn').appendChild(badge);
            }
            badge.textContent = count;
        } else if (badge) {
            badge.remove();
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// User authentication management
class UserAuth {
    constructor() {
        this.currentUser = this.loadUser();
    }

    loadUser() {
        const saved = localStorage.getItem('savanna_user');
        return saved ? JSON.parse(saved) : null;
    }

    saveUser(user) {
        localStorage.setItem('savanna_user', JSON.stringify(user));
        this.currentUser = user;
        this.updateUserIcon();
    }

    signIn(email, password) {
        // Simple validation - in production, this would call an API
        if (email && password.length >= 6) {
            const user = { email, name: email.split('@')[0] };
            this.saveUser(user);
            return true;
        }
        return false;
    }

    signUp(name, email, password) {
        // Simple validation - in production, this would call an API
        if (name && email && password.length >= 6) {
            const user = { email, name };
            this.saveUser(user);
            return true;
        }
        return false;
    }

    signOut() {
        localStorage.removeItem('savanna_user');
        this.currentUser = null;
        this.updateUserIcon();
    }

    isSignedIn() {
        return this.currentUser !== null;
    }

    updateUserIcon() {
        const signInBtn = document.getElementById('signInBtn');
        if (this.isSignedIn()) {
            signInBtn.title = `Signed in as ${this.currentUser.name}`;
            signInBtn.innerHTML = '👤✓';
        } else {
            signInBtn.title = 'Sign In';
            signInBtn.innerHTML = '👤';
        }
    }
}

// Initialize user auth
const userAuth = new UserAuth();

// Initialize slideshow and filter button state when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlideIndex);
    setupFilterButtons();
    setupAddToCartButtons();
    cart.updateCartBadge();
    userAuth.updateUserIcon();
});

// Slideshow navigation handlers
function changeSlide(n) {
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
    showSlide(currentSlideIndex = n);
}

// Render slide state and dot indicators
function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');

    if (slides.length === 0) return;

    if (n > slides.length) currentSlideIndex = 1;
    if (n < 1) currentSlideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) slides[i].classList.remove('active');
    for (let i = 0; i < dots.length; i++) dots[i].classList.remove('active');

    slides[currentSlideIndex - 1].classList.add('active');
    if (dots.length > 0) dots[currentSlideIndex - 1].classList.add('active');
}

// Auto-advance slideshow every 8 seconds
setInterval(function() { 
    if (document.getElementsByClassName('slide').length > 0) {
        changeSlide(1); 
    }
}, 8000);

// Search functionality
document.getElementById("searchBtn").addEventListener("click", performSearch);
document.getElementById("searchInput").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
    
    if (searchTerm === "") {
        alert("Please enter a search term.");
        return;
    }

    const productCards = document.querySelectorAll('.product-card');
    let foundCount = 0;

    productCards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.style.display = 'block';
            card.parentElement.parentElement.style.display = 'block';
            foundCount++;
            
            // Highlight the search term
            card.style.border = '2px solid #6c3f18';
            card.style.boxShadow = '0 4px 12px rgba(108, 63, 24, 0.3)';
        } else {
            card.style.display = 'none';
        }
    });

    if (foundCount === 0) {
        alert(`No products found matching "${searchTerm}"`);
        // Reset all products to visible
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.border = '';
            card.style.boxShadow = '';
        });
    } else {
        // Scroll to products section
        const productsSection = document.querySelector('.products-showcase');
        if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Cart button - show cart modal
document.getElementById("cartBtn").addEventListener("click", showCartModal);

function showCartModal() {
    const modal = createCartModal();
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content cart-modal">
            <div class="modal-header">
                <h2>🛒 Shopping Cart</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button>
            </div>
            <div class="modal-body">
                ${cart.items.length === 0 ? 
                    '<p class="empty-cart">Your cart is empty. Start shopping!</p>' :
                    `<div class="cart-items">
                        ${cart.items.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p class="cart-item-price">KSH ${item.price.toLocaleString()}${item.subscription ? '/month' : ''}</p>
                                </div>
                                <div class="cart-item-quantity">
                                    <button onclick="updateCartItemQuantity('${item.name}', ${item.quantity - 1})">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="updateCartItemQuantity('${item.name}', ${item.quantity + 1})">+</button>
                                </div>
                                <div class="cart-item-total">
                                    KSH ${(item.price * item.quantity).toLocaleString()}
                                </div>
                                <button class="cart-item-remove" onclick="removeCartItem('${item.name}')">🗑️</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-summary">
                        <div class="cart-total">
                            <strong>Total:</strong>
                            <strong>KSH ${cart.getTotal().toLocaleString()}</strong>
                        </div>
                    </div>`
                }
            </div>
            <div class="modal-footer">
                ${cart.items.length > 0 ? `
                    <button class="cta-button secondary" onclick="cart.clear(); this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">Clear Cart</button>
                    <button class="cta-button primary" onclick="proceedToCheckout()">Proceed to Checkout</button>
                ` : `
                    <button class="cta-button primary" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">Continue Shopping</button>
                `}
            </div>
        </div>
    `;
    return modal;
}

function updateCartItemQuantity(productName, newQuantity) {
    if (newQuantity < 1) {
        removeCartItem(productName);
        return;
    }
    cart.updateQuantity(productName, newQuantity);
    // Refresh modal
    document.querySelector('.modal-overlay').remove();
    showCartModal();
}

function removeCartItem(productName) {
    if (confirm(`Remove ${productName} from cart?`)) {
        cart.removeItem(productName);
        document.querySelector('.modal-overlay').remove();
        document.body.style.overflow = 'auto';
        if (cart.items.length > 0) {
            showCartModal();
        }
    }
}

// Checkout functionality
function proceedToCheckout() {
    if (!userAuth.isSignedIn()) {
        alert('Please sign in to proceed with checkout.');
        document.querySelector('.modal-overlay').remove();
        document.body.style.overflow = 'auto';
        showSignInModal();
        return;
    }

    // Create WhatsApp message with cart items
    const items = cart.items.map(item => 
        `${item.name} x${item.quantity} - KSH ${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');
    
    const total = cart.getTotal().toLocaleString();
    const message = `Hello Savanna Circuit,%0A%0AI would like to place an order:%0A%0A${items}%0A%0ATotal: KSH ${total}%0A%0AName: ${userAuth.currentUser.name}%0AEmail: ${userAuth.currentUser.email}`;
    
    const whatsappUrl = `https://wa.me/254714574007?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener');
    
    // Clear cart after checkout
    setTimeout(() => {
        if (confirm('Your order has been sent via WhatsApp. Would you like to clear your cart?')) {
            cart.clear();
            document.querySelector('.modal-overlay').remove();
            document.body.style.overflow = 'auto';
        }
    }, 1000);
}

// Sign in button
document.getElementById("signInBtn").addEventListener("click", function() {
    if (userAuth.isSignedIn()) {
        showUserProfileModal();
    } else {
        showSignInModal();
    }
});

function showSignInModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <div class="modal-header">
                <h2>👤 Sign In</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button>
            </div>
            <div class="modal-body">
                <form id="signInForm" onsubmit="handleSignIn(event)">
                    <div class="form-group">
                        <label for="signInEmail">Email</label>
                        <input type="email" id="signInEmail" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="signInPassword">Password</label>
                        <input type="password" id="signInPassword" required placeholder="Min. 6 characters" minlength="6">
                    </div>
                    <button type="submit" class="cta-button primary full-width">Sign In</button>
                </form>
                <div class="auth-divider">
                    <span>Don't have an account?</span>
                </div>
                <button class="cta-button secondary full-width" onclick="showSignUpModal()">Create Account</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function showSignUpModal() {
    document.querySelector('.modal-overlay')?.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <div class="modal-header">
                <h2>👤 Create Account</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button>
            </div>
            <div class="modal-body">
                <form id="signUpForm" onsubmit="handleSignUp(event)">
                    <div class="form-group">
                        <label for="signUpName">Full Name</label>
                        <input type="text" id="signUpName" required placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label for="signUpEmail">Email</label>
                        <input type="email" id="signUpEmail" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="signUpPassword">Password</label>
                        <input type="password" id="signUpPassword" required placeholder="Min. 6 characters" minlength="6">
                    </div>
                    <button type="submit" class="cta-button primary full-width">Create Account</button>
                </form>
                <div class="auth-divider">
                    <span>Already have an account?</span>
                </div>
                <button class="cta-button secondary full-width" onclick="showSignInModal()">Sign In</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function showUserProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content profile-modal">
            <div class="modal-header">
                <h2>👤 My Profile</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button>
            </div>
            <div class="modal-body">
                <div class="profile-info">
                    <div class="profile-avatar">👤</div>
                    <h3>${userAuth.currentUser.name}</h3>
                    <p>${userAuth.currentUser.email}</p>
                </div>
                <div class="profile-actions">
                    <button class="cta-button secondary full-width" onclick="showCartModal(); document.querySelector('.profile-modal').closest('.modal-overlay').remove();">
                        🛒 View Cart (${cart.getItemCount()} items)
                    </button>
                    <button class="cta-button secondary full-width" onclick="handleSignOut()">
                        🚪 Sign Out
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    if (userAuth.signIn(email, password)) {
        alert('Successfully signed in!');
        document.querySelector('.modal-overlay').remove();
        document.body.style.overflow = 'auto';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function handleSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    
    if (userAuth.signUp(name, email, password)) {
        alert('Account created successfully!');
        document.querySelector('.modal-overlay').remove();
        document.body.style.overflow = 'auto';
    } else {
        alert('Error creating account. Please try again.');
    }
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        userAuth.signOut();
        document.querySelector('.modal-overlay').remove();
        document.body.style.overflow = 'auto';
        alert('You have been signed out.');
    }
}

// Setup Add to Cart buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            cart.addItem(productName);
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = '✓ Added!';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
}

// Initialize category filter button active state and click behavior
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Clear any search highlights
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.border = '';
                card.style.boxShadow = '';
            });
        });
    });
}

// Filter product categories
function filterProducts(category) {
    const categories = document.querySelectorAll('.product-category');

    if (category === 'all') {
        categories.forEach(cat => { cat.style.display = 'block'; });
    } else {
        categories.forEach(cat => { cat.style.display = 'none'; });

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

    const productsSection = document.querySelector('.products-showcase');
    if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Mobile hamburger menu support
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
});

// Smooth scroll for in-page anchor links
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