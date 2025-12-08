const apiBase = "/api";

function fmtCurrency(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function renderProducts(products) {
    const grid = document.getElementById("products-grid");
    const empty = document.getElementById("products-empty");
    if (!grid) return;

    grid.innerHTML = "";
    if (!products.length) {
        if (empty) empty.style.display = "block";
        return;
    }
    if (empty) empty.style.display = "none";

    products.forEach((p) => {
        const card = document.createElement("div");
        card.className = "store-product-card";
        card.dataset.category = p.category;

        const badge = document.createElement("div");
        badge.className = "product-badge";
        badge.textContent = prettyCategory(p.category);

        const title = document.createElement("h3");
        title.textContent = p.name;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = fmtCurrency(p.price);

        const desc = document.createElement("p");
        desc.className = "description";
        desc.textContent = p.description || "";

        const btn = document.createElement("button");
        btn.className = "cta-button primary";
        btn.textContent = "Add to Cart";
        btn.addEventListener("click", () => updateCart(p.id, 1));

        card.append(badge, title, price, desc, btn);
        grid.appendChild(card);
    });
}

function prettyCategory(cat) {
    switch (cat) {
        case "solar-cooling":
            return "Solar Cooling";
        case "management-systems":
            return "Dairy Management";
        case "drying-systems":
            return "Drying";
        case "solar-thrive":
            return "Thrive";
        default:
            return cat;
    }
}

function bindFilters(products) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const cat = btn.dataset.category;
            if (cat === "all") {
                renderProducts(products);
            } else {
                renderProducts(products.filter((p) => p.category === cat));
            }
        });
    });
}

async function loadProducts() {
    try {
        const res = await fetch(`${apiBase}/products`);
        const data = await res.json();
        renderProducts(data);
        bindFilters(data);
    } catch (err) {
        console.error("Failed to load products", err);
    }
}

function renderCart(cart) {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container || !totalEl) return;

    container.innerHTML = "";
    const items = cart.items || [];
    if (!items.length) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalEl.textContent = "$0.00";
        return;
    }

    const list = document.createElement("div");
    list.className = "cart-items-list";

    items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("div");
        name.textContent = `${item.name} (${fmtCurrency(item.price)})`;

        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = "0";
        qtyInput.value = item.quantity;
        qtyInput.addEventListener("change", () => {
            const val = Math.max(0, parseInt(qtyInput.value || "0", 10));
            updateCart(item.id, val);
        });

        const line = document.createElement("div");
        line.textContent = fmtCurrency(item.line_total);

        row.append(name, qtyInput, line);
        list.appendChild(row);
    });

    container.appendChild(list);
    totalEl.textContent = fmtCurrency(cart.total);
}

async function loadCart() {
    try {
        const res = await fetch(`${apiBase}/cart`);
        const data = await res.json();
        renderCart(data);
    } catch (err) {
        console.error("Failed to load cart", err);
    }
}

async function updateCart(productId, quantity) {
    try {
        await fetch(`${apiBase}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId, quantity }),
        });
        loadCart();
    } catch (err) {
        console.error("Failed to update cart", err);
    }
}

function bindCheckout() {
    const form = document.getElementById("checkout-form");
    const status = document.getElementById("checkout-status");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            address: form.address.value,
        };
        status.textContent = "Placing order...";
        try {
            const res = await fetch(`${apiBase}/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                status.textContent = data.error || "Checkout failed";
                return;
            }
            status.textContent = "Order placed!";
            form.reset();
            loadCart();
        } catch (err) {
            status.textContent = "Checkout failed";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCart();
    bindCheckout();
});

