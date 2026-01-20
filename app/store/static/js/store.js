/* Store-specific JS logic */
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const categories = document.querySelectorAll('.product-category');
    
    if (category === 'all') {
        categories.forEach(c => c.style.display = 'block');
    } else {
        categories.forEach(c => {
            if (c.id === category) {
                c.style.display = 'block';
            } else {
                c.style.display = 'none';
            }
        });
    }
}

// Shopping Cart implementation (simplified for now)
document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.dataset.product;
            alert(`Added ${product} to cart! (Frontend logic preserved)`);
        });
    });
});
