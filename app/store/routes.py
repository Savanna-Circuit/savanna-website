from flask import Blueprint, render_template, current_app, abort, session, request, redirect, url_for
import json
import os

store_bp = Blueprint('store', __name__, template_folder='templates', static_folder='static')

def load_products():
    path = os.path.join(current_app.config['DATA_FOLDER'], 'products.json')
    with open(path, 'r') as f:
        return json.load(f)

@store_bp.route('/')
def index():
    data = load_products()
    return render_template('store/index.html', products=data['products'], financing=data['financing'])

@store_bp.route('/product/<product_id>')
def product_detail(product_id):
    data = load_products()
    product = next((p for p in data['products'] if p['id'] == product_id), None)
    if product is None:
        abort(404)
    
    # Simple related products logic (same category)
    related = [p for p in data['products'] if p['category'] == product['category'] and p['id'] != product_id][:3]
    
    return render_template('store/product_detail.html', product=product, related=related)

@store_bp.route('/cart/add/<product_id>', methods=['POST'])
def add_to_cart(product_id):
    # TODO: Backend shopping lifecycle management
    if 'cart' not in session:
        session['cart'] = []
    
    # Check if already in cart
    cart = session['cart']
    # This is a stub for future logic
    print(f"DEBUG: Adding product {product_id} to session cart")
    
    # For now, we still rely on frontend JS but prepare the backend path
    return {"status": "success", "message": f"Product {product_id} added to backend session stub."}

@store_bp.route('/checkout', methods=['POST'])
def checkout():
    # TODO: Implement actual checkout flow, payment integration, etc.
    cart_items = session.get('cart', [])
    print(f"DEBUG: Checkout initiated for {len(cart_items)} items")
    return redirect(url_for('store.index'))
