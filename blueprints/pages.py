from flask import Blueprint, render_template

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def home():
    return render_template("index.html")


@pages_bp.route("/about")
def about():
    return render_template("about.html")


@pages_bp.route("/products")
def products():
    return render_template("products.html")


@pages_bp.route("/store")
def store():
    return render_template("store.html")


@pages_bp.route("/support")
def support():
    return render_template("support.html")


@pages_bp.route("/contact")
def contact():
    return render_template("contact.html")


@pages_bp.route("/careers")
def careers():
    return render_template("careers.html")


@pages_bp.route("/impact")
def impact():
    return render_template("impact.html")


@pages_bp.route("/news")
def news():
    return render_template("news.html")


@pages_bp.route("/solar-cooling")
def solar_cooling():
    return render_template("solar-cooling.html")


@pages_bp.route("/solar-thrive")
def solar_thrive():
    return render_template("solar-thrive.html")


@pages_bp.route("/eco-sav-dryer")
def eco_sav_dryer():
    return render_template("eco-sav-dryer.html")


@pages_bp.route("/m-plus-dms")
def m_plus_dms():
    return render_template("m-plus-dms.html")


@pages_bp.route("/store-app")
def store_app():
    return render_template("store-app/index.html")


@pages_bp.route("/store-app/products/<path:page>")
def store_app_product(page: str):
    return render_template(f"store-app/products-detailed/{page}")

