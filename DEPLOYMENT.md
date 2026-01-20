# Savanna Circuit Website - Deployment Guide

## 1. Setup Environment
Ensure you have Python 3.13 installed.

```powershell
# Create virtual environment if not already done
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1
```

## 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

## 3. Running the App
```powershell
python run.py
```

## 4. Development Notes
- **Static Files**: Website-specific assets are in `app/website/static`, Store-specific assets in `app/store/static`, and shared assets in `app/static`.
- **Templates**: Uses Jinja2 inheritance with `base.html`.
