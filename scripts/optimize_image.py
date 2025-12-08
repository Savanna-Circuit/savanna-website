"""
Simple image optimizer for the footer logo using Pillow.
Usage:
  python scripts/optimize_image.py <input_path> [--width WIDTH] [--output OUTPUT_PATH]

Example:
  python scripts/optimize_image.py images/footer-logo.jpeg --width 600 --output images/footer-logo-optimized.jpeg

This will resize the image preserving aspect ratio and save as JPEG optimized.
"""
import sys
import argparse
from PIL import Image


def optimize_image(input_path, output_path=None, width=None, quality=85):
    img = Image.open(input_path)
    orig_mode = img.mode
    if width:
        w_percent = width / float(img.size[0])
        height = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((int(width), height), Image.LANCZOS)

    # Convert to RGB if needed
    if img.mode in ("RGBA", "LA"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    if not output_path:
        output_path = input_path

    img.save(output_path, format="JPEG", optimize=True, quality=quality)
    print(f"Saved optimized image to: {output_path}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Optimize and resize an image (footer logo).')
    parser.add_argument('input', help='Input image path')
    parser.add_argument('--width', type=int, help='Max width to resize to (preserves aspect ratio)')
    parser.add_argument('--output', help='Output path (if omitted the input is overwritten)')
    parser.add_argument('--quality', type=int, default=85, help='JPEG quality (1-95)')
    args = parser.parse_args()

    optimize_image(args.input, args.output, args.width, args.quality)
