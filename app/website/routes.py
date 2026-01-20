from flask import Blueprint, render_template, current_app, request
import json
import os

website_bp = Blueprint('website', __name__, template_folder='templates', static_folder='static')

def load_json(filename):
    path = os.path.join(current_app.config['DATA_FOLDER'], filename)
    with open(path, 'r') as f:
        return json.load(f)

@website_bp.route('/')
def index():
    return render_template('website/index.html')

@website_bp.route('/about')
def about():
    return render_template('website/about.html')

@website_bp.route('/impact')
def impact():
    data = load_json('impact.json')
    return render_template('website/impact.html', data=data)

@website_bp.route('/careers')
def careers():
    jobs = load_json('jobs.json')
    return render_template('website/careers.html', jobs=jobs)

@website_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # TODO: Implement actual email sending or DB storage
        # For now, just print the form data
        print("Form Submission Received:")
        for key, value in request.form.items():
            print(f"{key}: {value}")
        return "Thank you for your message!"
    return render_template('website/contact.html')

@website_bp.route('/products')
def products():
    # The original Website/products.html seems to be different from the store.
    # It might just list categories or redirect to store.
    return render_template('website/products.html')
