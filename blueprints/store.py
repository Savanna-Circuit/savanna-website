import sqlite3
from datetime import datetime
from typing import Dict, List

from flask import Blueprint, current_app, g, jsonify, request, session

store_bp = Blueprint("store", __name__)


def get_db():
    if "db" not in g:
        conn = sqlite3.connect(current_app.config["DATABASE"])
        conn.row_factory = sqlite3.Row
        g.db = conn
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Create tables if they do not exist and seed products."""
    db = sqlite3.connect(current_app.config["DATABASE"])
    db.row_factory = sqlite3.Row
    db.row_factory = sqlite3.Row
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            sku TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image TEXT
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            created_at TEXT NOT NULL
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    existing = db.execute("SELECT COUNT(*) AS total FROM products").fetchone()
    if (existing["total"] if isinstance(existing, sqlite3.Row) else existing[0]) == 0:
        seed_products = [
            (
                "Solar Cooling BMC Hybrid",
                "BMC-HYB",
                "solar-cooling",
                1200.00,
                "Hybrid solar cooling solution for dairy preservation.",
                "/static/images/solar-cooling-bmc-hybrid.jpg",
            ),
            (
                "Eco-Sav Dryer",
                "ECO-DRY",
                "drying-systems",
                850.00,
                "Efficient solar dryer for agricultural produce.",
                "/static/images/eco-sav-dryer.jpg",
            ),
            (
                "MaziwaPlus DMS",
                "DMS-001",
                "management-systems",
                640.00,
                "Dairy management system with remote monitoring.",
                "/static/images/maziwaplus-dms.jpg",
            ),
            (
                "Solar Thrive Nomad Can 25L",
                "NOMAD-25",
                "solar-thrive",
                210.00,
                "Portable insulated can for cold chain distribution.",
                "/static/images/nomad-can-25l.jpg",
            ),
            (
                "IWD Ice Water Dispenser",
                "IWD-ICE",
                "solar-thrive",
                950.00,
                "Solar-powered ice water dispensing system.",
                "/static/images/iwd-ice-water.jpg",
            ),
        ]
        db.executemany(
            """
            INSERT INTO products (name, sku, category, price, description, image)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            seed_products,
        )
    db.commit()
    db.close()


@store_bp.teardown_app_request
def teardown_db(exception):
    close_db()


def _serialize_product(row: sqlite3.Row) -> Dict:
    return {
        "id": row["id"],
        "name": row["name"],
        "sku": row["sku"],
        "category": row["category"],
        "price": row["price"],
        "description": row["description"],
        "image": row["image"],
    }


def _get_cart() -> Dict[str, int]:
    return session.get("cart", {})


def _save_cart(cart: Dict[str, int]):
    session["cart"] = cart
    session.modified = True


@store_bp.route("/health")
def health():
    return jsonify({"status": "ok"})


@store_bp.route("/products", methods=["GET"])
def list_products():
    db = get_db()
    rows = db.execute("SELECT * FROM products ORDER BY id ASC").fetchall()
    return jsonify([_serialize_product(r) for r in rows])


@store_bp.route("/cart", methods=["GET"])
def get_cart():
    cart = _get_cart()
    if not cart:
        return jsonify({"items": [], "total": 0})

    db = get_db()
    ids = [int(pid) for pid in cart.keys()]
    if not ids:
        return jsonify({"items": [], "total": 0})

    placeholders = ",".join("?" for _ in ids)
    rows = db.execute(
        f"SELECT * FROM products WHERE id IN ({placeholders})", ids
    ).fetchall()

    items: List[Dict] = []
    total = 0.0
    for row in rows:
        qty = cart.get(str(row["id"]), 0)
        if qty <= 0:
            continue
        price = row["price"] * qty
        total += price
        item = _serialize_product(row)
        item["quantity"] = qty
        item["line_total"] = price
        items.append(item)

    return jsonify({"items": items, "total": round(total, 2)})


@store_bp.route("/cart", methods=["POST"])
def update_cart():
    data = request.get_json(force=True, silent=True) or {}
    product_id = str(data.get("product_id"))
    quantity = int(data.get("quantity", 1))

    if not product_id.isdigit() or quantity < 0:
        return jsonify({"error": "Invalid payload"}), 400

    db = get_db()
    product = db.execute(
        "SELECT id FROM products WHERE id = ?", (product_id,)
    ).fetchone()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    cart = _get_cart()
    if quantity == 0:
        cart.pop(product_id, None)
    else:
        cart[product_id] = quantity
    _save_cart(cart)

    return jsonify({"message": "Cart updated", "cart": cart})


@store_bp.route("/checkout", methods=["POST"])
def checkout():
    data = request.get_json(force=True, silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip()
    address = data.get("address", "").strip()

    cart = _get_cart()
    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    db = get_db()
    ids = [int(pid) for pid in cart.keys()]
    placeholders = ",".join("?" for _ in ids)
    rows = db.execute(
        f"SELECT * FROM products WHERE id IN ({placeholders})", ids
    ).fetchall()

    if not rows:
        return jsonify({"error": "No products found"}), 400

    total_items = sum(cart.get(str(r["id"]), 0) for r in rows)
    if total_items == 0:
        return jsonify({"error": "Cart is empty"}), 400

    created_at = datetime.utcnow().isoformat()
    cursor = db.execute(
        """
        INSERT INTO orders (customer_name, email, phone, address, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (name, email, phone, address, created_at),
    )
    order_id = cursor.lastrowid

    for row in rows:
        qty = cart.get(str(row["id"]), 0)
        if qty <= 0:
            continue
        db.execute(
            """
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
            """,
            (order_id, row["id"], qty, row["price"]),
        )

    db.commit()
    session["cart"] = {}

    return jsonify({"message": "Order placed", "order_id": order_id})


@store_bp.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(force=True, silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    db = get_db()
    db.execute(
        """
        INSERT INTO contact_messages (name, email, message, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (name, email, message, datetime.utcnow().isoformat()),
    )
    db.commit()
    return jsonify({"message": "Message received"})

