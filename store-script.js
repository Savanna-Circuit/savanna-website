// Store JavaScript - Enhanced with Cart, Search, Checkout, and User Profile Functionality
// This file powers the storefront UI and e-commerce features

// CORE DATA & CLASSES 


let currentSlideIndex = 1; 

const productData = {
    "Nomad Cans - 10L": { image: "../images/NOMAD%2010%20LTRS.png" },
    "Nomad Cans - 25L": { image: "../images/nomad%2025.JPG" },
    "Nomad Cans - 50L": {  image: "../images/NOMAD%20CANS.jpeg" },
    "IWD Ice Water Dispenser": {  image: "../images/IWD.jpg" },
    "Eco-Sav Thermal Bags": {  image: "../images/Eco-Sav%20bag.jpg" },
    "MaziwaPlus Prechillers 300-1000L": { image: "../images/M+%20PRE%20CHILLER.JPG" },
    "MaziwaPlus Prechillers Pro 200-2000L": {  image: "../images/pre%20chillers%20PRO.jpg" },
    "BMC Hybrid Milk Cooler": { image: "../images/HYBRID%20BMC.jpeg" },
    "BMC Solar Milk Cooler": { image: "../images/SOLAR%20BMC.jpg" },
    "Eco-Sav Pasteurizer 100-500L": {  image: "../images/PASTUERIZER.jpg" },
    "MaziwaPlus DMS": {  image: "../images/M+%20DMS.png", subscription: true },
    "Eco-Sav Solar Dryer": {  image: "../images/dryer.JPG" }
};

class ShoppingCart {
    constructor() { this.items = this.loadCart(); }
    loadCart() { const saved = localStorage.getItem('savanna_cart'); return saved ? JSON.parse(saved) : []; }
    saveCart() { localStorage.setItem('savanna_cart', JSON.stringify(this.items)); this.updateCartBadge(); }
    addItem(productName) {
        const existingItem = this.items.find(item => item.name === productName);
        if (existingItem) { existingItem.quantity += 1; } 
        else { const product = productData[productName]; if (product) { this.items.push({ name: productName, quantity: 1, image: product.image,  subscription: product.subscription || false }); } }
        this.saveCart();
    }
    removeItem(productName) { this.items = this.items.filter(item => item.name !== productName); this.saveCart(); }
    updateQuantity(productName, quantity) { const item = this.items.find(item => item.name === productName); if (item) { item.quantity = Math.max(1, quantity); this.saveCart(); } }

    // Total is now just the item count
    getTotal() { return this.items.reduce((total, item) => total + item.quantity, 0); } 
    getItemCount() { return this.items.reduce((count, item) => count + item.quantity, 0); }
    clear() { this.items = []; this.saveCart(); }
    updateCartBadge() {
        const count = this.getItemCount(); const cartBtn = document.getElementById('cartBtn'); if (!cartBtn) return;
        let badge = cartBtn.querySelector('.cart-badge');
        if (count > 0) { if (!badge) { badge = document.createElement('span'); badge.className = 'cart-badge'; cartBtn.appendChild(badge); } badge.textContent = count; } 
        else if (badge) { badge.remove(); }
    }
}

class UserAuth {
    constructor() { this.currentUser = null; this.loadCurrentUser(); }
    loadUsers() { const saved = localStorage.getItem('savanna_users'); return saved ? JSON.parse(saved) : []; }
    saveUsers(users) { localStorage.setItem('savanna_users', JSON.stringify(users)); }
    loadCurrentUser() { const saved = localStorage.getItem('savanna_current_user'); this.currentUser = saved ? JSON.parse(saved) : null; }
    saveCurrentUser() { localStorage.setItem('savanna_current_user', JSON.stringify(this.currentUser)); }
    signIn(username, password) {
        const users = this.loadUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = { name: user.username, email: user.email };
            this.saveCurrentUser();
            this.updateUserIcon();
            return true;
        }
        return false;
    }
    signUp(username, password) {
        const users = this.loadUsers();
        if (users.find(u => u.username === username)) {
            return false; // username taken
        }
        const newUser = { username, password, email: `${username.toLowerCase()}@example.com` };
        users.push(newUser);
        this.saveUsers(users);
        this.currentUser = { name: username, email: newUser.email };
        this.saveCurrentUser();
        this.updateUserIcon();
        return true;
    }
    signOut() { localStorage.removeItem('savanna_current_user'); this.currentUser = null; this.updateUserIcon(); }
    isSignedIn() { return this.currentUser !== null; }
    updateUserIcon() {
        const signInBtn = document.getElementById('signInBtn'); if (!signInBtn) return;
        if (this.isSignedIn()) {
            signInBtn.title = `Signed in as ${this.currentUser.name}`; let status = signInBtn.querySelector('.auth-status');
            if (!status) { status = document.createElement('span'); status.className = 'auth-status'; signInBtn.appendChild(status); } status.textContent = '✓';
        } else { signInBtn.title = 'Sign In'; const status = signInBtn.querySelector('.auth-status'); if (status) status.remove(); }
    }
}

// A. Header Loading Function (using Fetch API)
async function loadHeader() {
  try {
    // Resolve header path relative to the running script so nested pages work
    let headerUrl;
    try {
      if (document.currentScript && document.currentScript.src) {
        headerUrl = new URL("header.html", document.currentScript.src).href;
      }
    } catch (e) {
      headerUrl = null;
    }

    // Fallbacks: root-relative (works for typical static deployments), then relative
    if (!headerUrl) {
      headerUrl = "/store-app/header.html";
    }

    const response = await fetch(headerUrl);
    if (!response.ok)
      throw new Error("Network response was not ok: " + response.statusText);
    const headerHtml = await response.text();
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = headerHtml;
      // Modify logo link based on current page
      const logoLink = headerPlaceholder.querySelector('.logo-link');
      if (logoLink) {
        if (window.location.pathname.includes('products-detailed')) {
          logoLink.href = '../index.html';
        } else {
          // On store home, keep as website
          logoLink.href = '../Website/index.html';
        }
      }
    } else {
      console.error("Error: Header placeholder div not found.");
    }
  } catch (error) {
    console.error("Could not load header:", error);
  }
}
// B. Footer HTML String
const footerHTML = `
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
                    <li><a href="sav-circuit.com">Privacy Policy</a></li>
                    <li><a href="sav-circuit.com">Terms of Service</a></li>
                    <li><a href="product quality policy">Product Policy</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <div class="social-links">
                    <a href="www.facebook.com" aria-label="Facebook" class="social-facebook" target="_blank" rel="noopener">
                       <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.24 10.44 22v-7.01H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.92h-2.34V22C18.34 21.24 22 17.1 22 12.07z"/></svg></a>
                    <a href="www.linkedin.com" aria-label="LinkedIn" class="social-linkedin" target="_blank" rel="noopener">
                       <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H5a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3h14Zm-9.54 16V10.5H7.06V19h2.4Zm-1.2-9.81a1.39 1.39 0 1 0 0-2.78 1.39 1.39 0 0 0 0 2.78ZM20 19v-5.2c0-2.8-1.49-4.1-3.47-4.1a3 3 0 0 0-2.72 1.49h-.06V10.5h-2.4V19h2.4v-4.48c0-1.18.21-2.32 1.69-2.32s1.5 1.36 1.5 2.4V19H20Z"/></svg></a>
                    <a href="www.instagram.com" aria-label="Instagram" class="social-instagram" target="_blank" rel="noopener">
                       <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .4 1.4.8.4.4.6.8.8 1.4.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.4 1-.8 1.4-.4.4-.8.6-1.4.8-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.4-1.4-.8-.4-.4-.6-.8-.8-1.4-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.4-1 .8-1.4.4-.4.8-.6 1.4-.8.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.9-.1Zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Zm5.3-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg></a>
                    <a href="twitter.com" aria-label="X (Twitter)" class="social-x" target="_blank" rel="noopener">
                       <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M17.53 3h3.13l-6.84 7.82L22 21h-6.7l-5.23-6.82L3.9 21H.75l7.3-8.34L1 3h6.86l4.73 6.2L17.53 3Zm-1.17 16.2h1.73L7.72 4.68H5.86L16.36 19.2Z"/></svg></a>
                    <a href="api.whatsapp.com." aria-label="WhatsApp" class="social-whatsapp" target="_blank" rel="noopener">
                       <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true"><path d="M20.5 3.5A10.5 10.5 0 0 0 3.8 17.9L2 22l4.3-1.7A10.5 10.5 0 1 0 20.5 3.5Zm-8.4 16.6c-1.8 0-3.5-.6-4.9-1.7l-.3-.2-2.9 1.1 1.1-2.8-.2-.3a8.5 8.5 0 1 1 7.2 4.9Zm4.9-6.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.4 0-.5.2-.7.2-.2.3-.3.4-.5.2-.2.1-.4 0-.6-.1-.2-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 3s1.2 3.5 1.3 3.7c.2.2 2.3 3.6 5.7 5 2.1.9 2.9 1 3.9.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.1-.2-.3-.3Z"/></svg></a>
                </div>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <address>
                    <span class="address-line"><a href="goo.gl"target="_blank"><span class="address-text">Savanna Businness Park</span></a> <!-- SVG HERE --></span><br>
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
           <p>&copy; <span id="current-year"></span> Savanna Circuit Technologies. All rights reserved.</p>
        </div>
    </footer>
`;

// C. Footer Loading Function (uses JS variable)
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
        // Update the year dynamically after injection
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    } else { console.error('Target element #footer-placeholder not found. Footer could not be loaded.'); }
}


// D. Main Storefront Logic (runs after header/footer are loaded)

let cart;
let userAuth;

(async () => {
    // Wait for the header AND footer HTML to be injected into the page
    await loadHeader();
    loadFooter(); 

    // Initialize instances AFTER the header/footer elements are in the DOM
    cart = new ShoppingCart();
    userAuth = new UserAuth();

    // Update UI elements with current status
    cart.updateCartBadge();
    userAuth.updateUserIcon();

   
 // The original DOMContentLoaded logic for header interactions, adapted here:
    
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const navContainer = document.querySelector('.nav-container');
    if (menuBtn && navContainer) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navContainer.classList.toggle('nav-open');
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
            menuBtn.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // 2. Search Functionality
const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

searchBtn?.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (!searchBox.classList.contains('active')) {
        searchBox.classList.add('active');
        searchInput.focus();
    } else {
        if (searchInput.value.trim() !== "") {
            performSearch(); 
        } else {
            searchBox.classList.remove('active');
        }
    }
});

// Close if user clicks elsewhere
document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
        searchBox.classList.remove('active');
    }
});

// Search on Enter key
searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() !== "") {
        performSearch();
    }
});


    // 3. User Actions (Cart and Sign In)
    document.getElementById("cartBtn")?.addEventListener("click", showCartModal);
    document.getElementById("signInBtn")?.addEventListener("click", () => {
        if (userAuth.isSignedIn()) { showUserProfileModal(); } else { showSignInModal(); }
    });
    
    // Other page load logic:
    showSlide(currentSlideIndex);
    setupFilterButtons(); 
    setupAddToCartButtons(); 
 setInterval(function() { if (document.getElementsByClassName('slide').length > 0) { changeSlide(1); } }, 8000);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { /* ... */ });
})();

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
;

// . Cart Modal & Checkout Logic
function showCartModal() { const modal = createCartModal(); document.body.appendChild(modal); document.body.style.overflow = 'hidden'; }

function createCartModal() {
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    const cartIsEmpty = cart.items.length === 0;
    modal.innerHTML = `
        <div class="modal-content cart-modal">
            <div class="modal-header">
                <h2>
                <svg xmlns="www.w3.org" width="1em" height="1em" fill="black" class="bi bi-cart4" viewBox="0 0 16 16"><path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/></svg>
                Shopping Cart</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button>
            </div>
            <div class="modal-body">
                ${cartIsEmpty ? '<p class="empty-cart">Your cart is empty. Start shopping to request a quote!</p>' :
                    `<div class="cart-items">${cart.items.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p class="cart-item-price">Quantity:</p>
                                </div>
                                <div class="cart-item-quantity">
                                    <button onclick="updateCartItemQuantity('${item.name}', ${item.quantity - 1})">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="updateCartItemQuantity('${item.name}', ${item.quantity + 1})">+</button>
                                </div>
                                <button class="cart-item-remove" onclick="removeCartItem('${item.name}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="black" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                                </button>
                            </div>
                        `).join('')}</div>
                    <div class="cart-summary"><div class="cart-total">
                    <strong>Total Items:</strong>
                     <strong>${cart.getTotal()}</strong>
                    </div> 
                    </div>`
                }
            </div>
            <div class="modal-footer">
                ${cartIsEmpty ? `<button class="cta-button primary" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">Continue Shopping</button>` :
                    `<button class="cta-button secondary" onclick="cart.clear(); this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">Clear Cart</button>
                     <button class="cta-button primary" onclick="proceedToCheckout()">Request Quote via WhatsApp</button>
                     <button class="cta-button primary" onclick="buyFromKilimall()">Buy from Kilimall</button>
                     <button class="cta-button primary" onclick="buyFromJumia()">Buy from Jumia</button>
                     `}
            </div>
        </div>
    `;
    return modal;
}

function updateCartItemQuantity(productName, newQuantity) { if (newQuantity < 1) { removeCartItem(productName); return; } cart.updateQuantity(productName, newQuantity); document.querySelector('.modal-overlay').remove(); showCartModal(); }
function removeCartItem(productName) { if (confirm(`Remove ${productName} from cart?`)) { cart.removeItem(productName); document.querySelector('.modal-overlay').remove(); if (cart.items.length > 0) { showCartModal(); } else { document.body.style.overflow = 'auto'; } } }

function proceedToCheckout() {
    if (!userAuth.isSignedIn()) { 
        alert('Please sign in to proceed with checkout.'); 
        document.querySelector('.modal-overlay').remove(); 
        document.body.style.overflow = 'auto'; 
        showSignInModal(); 
        return; }

   // Create WhatsApp message with item quantities only
    const items = cart.items.map(item => 
        `${item.name} x${item.quantity}`
    ).join('\n'); 

    const message = encodeURIComponent(`Hello Savanna Circuit,\n\nI would like to request a quote for the following items:\n\n${items}\n\nName: ${userAuth.currentUser.name}`);    
    const whatsappUrl = `https://wa.me/254714574007?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener');
    setTimeout(() => {
         if (confirm('Your quote has been sent via WhatsApp. Would you like to clear your cart?')) { 
        cart.clear(); 
        document.querySelector('.modal-overlay').remove();
         document.body.style.overflow = 'auto'; 
        } 
    }, 1000);
}


function showSignInModal() {
    document.querySelector('.modal-overlay')?.remove(); 
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <div class="modal-header"><h2>
            <svg xmlns="www.w3.org" width="1em" height="1em" fill="Black" class="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>
            Sign In</h2><button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button></div>
            <div class="modal-body">
                <form id="signInForm" onsubmit="handleSignIn(event)">
                    <div class="form-group"><label for="signInName">Username</label><input type="text" id="signInName" required placeholder="Your Username"></div>
                    <div class="form-group"><label for="signInPassword">Password</label><input type="password" id="signInPassword" required placeholder="Min. 6 characters" minlength="6"></div>
                    <button type="submit" class="cta-button primary full-width">Sign In</button>
                </form>
                <div class="auth-divider"><span>Don't have an account?</span></div>
                <button class="cta-button secondary full-width" onclick="showSignUpModal()">Create Account</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal); document.body.style.overflow = 'hidden';
}

function handleSignIn(event) {
    event.preventDefault(); const nameInput = document.getElementById('signInName'); const passwordInput = document.getElementById('signInPassword');
    if (userAuth.signIn(nameInput.value, passwordInput.value)) { alert('Signed in successfully! Welcome ' + nameInput.value + '.'); document.querySelector('.modal-overlay').remove(); document.body.style.overflow = 'auto'; } 
    else { alert('Sign-in failed. Please check your credentials and password length.'); }
}

function showSignUpModal() {
    document.querySelector('.modal-overlay')?.remove();
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <div class="modal-header"><h2>                          
             <svg xmlns="www.w3.org" width="1em" height="1em" fill="Black" class="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>
            Create Account</h2><button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button></div>
            <div class="modal-body">
                <form id="signUpForm" onsubmit="handleSignUp(event)">
                    <div class="form-group"><label for="signUpName">Username</label><input type="text" id="signUpName" required placeholder="Choose a Username"></div>
                    <div class="form-group"><label for="signUpPassword">Password</label><input type="password" id="signUpPassword" required placeholder="Min. 6 characters" minlength="6"></div>
                    <button type="submit" class="cta-button primary full-width">Create Account</button>
                </form>
                <div class="auth-divider"><span>Already have an account?</span></div>
                <button class="cta-button secondary full-width" onclick="showSignInModal()">Sign In</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal); document.body.style.overflow = 'hidden';
}

function handleSignUp(event) {
    event.preventDefault(); const name = document.getElementById('signUpName').value; const password = document.getElementById('signUpPassword').value;
    if (userAuth.signUp(name, password)) { alert('Account created successfully! Welcome ' + name + '.'); document.querySelector('.modal-overlay').remove(); document.body.style.overflow = 'auto'; } 
    else { alert('Username already taken. Please choose a different username.'); }
}

function showUserProfileModal() {
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content profile-modal">
            <div class="modal-header"><h2>
              <svg xmlns="www.w3.org" width="1em" height="1em" fill="Black" class="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>
            My Profile</h2><button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='auto';">&times;</button></div>
            <div class="modal-body">
                <div class="profile-info">
                    <div class="profile-avatar"><!-- SVG HERE --></div>
                    <h3>${userAuth.currentUser.name}</h3>
                </div>
                <div class="profile-actions">
                    <button class="cta-button secondary full-width" onclick="handleViewCartFromProfile()">View Cart (${cart.getItemCount()} items)</button>
                    <button class="cta-button secondary full-width" onclick="handleSignOut()"><!-- SVG HERE -->Sign Out</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal); document.body.style.overflow = 'hidden';
}

function handleSignOut() { if (confirm('Are you sure you want to sign out?')) { userAuth.signOut(); document.querySelector('.modal-overlay').remove(); document.body.style.overflow = 'auto'; alert('You have been signed out.'); } }
function buyFromKilimall() {
    window.open('https://www.kilimall.com/', '_blank', 'noopener');
    document.querySelector('.modal-overlay').remove();
    document.body.style.overflow = 'auto';
}

function buyFromJumia() {
    window.open('https://jumia.co.ke/', '_blank', 'noopener');
    document.querySelector('.modal-overlay').remove();
    document.body.style.overflow = 'auto';
}
function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); const productName = this.getAttribute('data-product'); cart.addItem(productName);
            const originalText = this.textContent; this.textContent = '✓ Added!'; this.style.backgroundColor = '#28a745';
            setTimeout(() => { this.textContent = originalText; this.style.backgroundColor = ''; }, 1500);
        });
    });
}
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.product-card').forEach(card => { card.style.border = ''; card.style.boxShadow = ''; });
        });
    });
}

function filterProducts(category) {
    const allCategories = document.querySelectorAll('.product-category');

    if (category === 'all') {
        allCategories.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        allCategories.forEach(cat => {
            // Compare the element's ID with the category passed from the button's onclick.
            // Using toUpperCase() on both makes the comparison case-insensitive and robust.
            cat.style.display = (cat.id.toUpperCase() === category.toUpperCase()) ? 'block' : 'none';
        });
    }

    const productsSection = document.querySelector('.products-showcase');
    if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
    if (searchTerm === "") { alert("Please enter a search term."); return; }
    const productCards = document.querySelectorAll('.product-card'); let foundCount = 0;
    productCards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.style.display = 'block'; if (card.parentElement && card.parentElement.parentElement) { card.parentElement.parentElement.style.display = 'block'; }
            foundCount++; card.style.border = '2px solid #6c3f18'; card.style.boxShadow = '0 4px 12px rgba(108, 63, 24, 0.3)';
        } else { card.style.display = 'none'; }
    });
    if (foundCount === 0) {
        alert(`No products found matching "${searchTerm}"`);
        productCards.forEach(card => { card.style.display = 'block'; card.style.border = ''; card.style.boxShadow = ''; });
    } else { const productsSection = document.querySelector('.products-showcase'); if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function changeSlide(n) { showSlide(currentSlideIndex += n); }
function currentSlide(n) { showSlide(currentSlideIndex = n); }
function showSlide(n) {
    const slides = document.getElementsByClassName('slide'); const dots = document.getElementsByClassName('dot');
    if (slides.length === 0) return; if (n > slides.length) currentSlideIndex = 1; if (n < 1) currentSlideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) slides[i].classList.remove('active');
    for (let i = 0; i < dots.length; i++) dots[i].classList.remove('active');
    slides[currentSlideIndex - 1].classList.add('active'); if (dots.length > 0) dots[currentSlideIndex - 1].classList.add('active');
}
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.2 // Trigger when 20% of the section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the 'active' class to start CSS transitions
        entry.target.querySelectorAll('.reveal-text, .fade-in').forEach(el => {
          el.classList.add('active');
        });
      }
    });
  }, observerOptions);

  observer.observe(document.querySelector('.hero-subpage'));
});
