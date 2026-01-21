import os
import re
import subprocess
import shutil
from pathlib import Path

# Configuration
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'}
VIDEO_EXTENSIONS = {'.mp4', '.mov', '.avi', '.mkv', '.webm'}
TARGET_DIR = Path('assets/images')
BACKUP_DIR = Path('assets/images_backup')

def slugify(name):
    # Remove extension
    stem = Path(name).stem
    # Convert to lowercase
    slug = stem.lower()
    # Replace non-alphanumeric characters with spaces
    slug = re.sub(r'[^a-z0-9\s-]', ' ', slug)
    # Replace multiple spaces/hyphens with a single hyphen and strip
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

def process_assets():
    if not TARGET_DIR.exists():
        print(f"Error: {TARGET_DIR} not found.")
        return

    # Create backup of original images
    if not BACKUP_DIR.exists():
        print(f"Creating backup in {BACKUP_DIR}...")
        shutil.copytree(TARGET_DIR, BACKUP_DIR)

    mapping = {}
    files_to_process = [f for f in TARGET_DIR.iterdir() if f.is_file() and f.suffix.lower() in (IMAGE_EXTENSIONS | VIDEO_EXTENSIONS)]

    for file_path in files_to_process:
        ext = file_path.suffix.lower()
        new_stem = slugify(file_path.name)
        
        # Avoid empty slugs (if filename was all symbols)
        if not new_stem:
            new_stem = "asset"
            
        # Handle collisions
        base_stem = new_stem
        counter = 1
        while any(f.startswith(new_stem + ".") for f in mapping.values()):
            new_stem = f"{base_stem}{counter}"
            counter += 1

        if ext in IMAGE_EXTENSIONS:
            new_name = f"{new_stem}.webp"
            # Use a temporary name if the output path is the same as the input path
            temp_name = f"temp_{new_name}"
            output_path = TARGET_DIR / temp_name
            final_path = TARGET_DIR / new_name
            
            print(f"Converting image: {file_path.name} -> {new_name}")
            
            # ffmpeg command for image to webp (q:v 65 for higher compression)
            try:
                subprocess.run([
                    'ffmpeg', '-y', '-i', str(file_path),
                    '-q:v', '65', 
                    '-compression_level', '6',
                    '-map_metadata', '-1',
                    str(output_path)
                ], check=True, capture_output=True)
                
                # If we were processing a file to its own name, we need to handle the swap
                if file_path.exists() and file_path != final_path:
                    file_path.unlink()
                
                if final_path.exists():
                    final_path.unlink()
                output_path.rename(final_path)
                
                mapping[file_path.name] = new_name
            except subprocess.CalledProcessError as e:
                print(f"Failed to convert {file_path.name}: {e.stderr.decode() if e.stderr else str(e)}")
                if output_path.exists():
                    output_path.unlink()

        elif ext in VIDEO_EXTENSIONS:
            new_name = f"{new_stem}.mp4"
            temp_name = f"temp_{new_name}"
            output_path = TARGET_DIR / temp_name
            final_path = TARGET_DIR / new_name
            
            print(f"Compressing video: {file_path.name} -> {new_name}")
            
            # ffmpeg command for video to 720p mp4 (CRF 32 for high compression)
            try:
                subprocess.run([
                    'ffmpeg', '-y', '-i', str(file_path),
                    '-vf', "scale='min(1280,iw)':-2", # Scale to 720p width max
                    '-c:v', 'libx264', 
                    '-crf', '32', # Increased compression
                    '-preset', 'slow', # Better compression efficiency
                    '-c:a', 'aac', '-b:a', '64k', # Lower audio bitrate
                    '-map_metadata', '-1',
                    '-movflags', '+faststart', # Web optimization
                    str(output_path)
                ], check=True, capture_output=True)
                
                if file_path.exists() and file_path != final_path:
                    file_path.unlink()
                
                if final_path.exists():
                    final_path.unlink()
                output_path.rename(final_path)
                
                mapping[file_path.name] = new_name
            except subprocess.CalledProcessError as e:
                print(f"Failed to convert {file_path.name}: {e.stderr.decode() if e.stderr else str(e)}")
                if output_path.exists():
                    output_path.unlink()

    return mapping

def update_references(mapping):
    print("Updating references in codebase...")
    # Find all relevant files
    extensions = {'.html', '.js', '.css', '.json'}
    files_to_update = []
    for root, _, files in os.walk('.'):
        if 'node_modules' in root or '.git' in root or 'assets/images_backup' in root:
            continue
        for file in files:
            if Path(file).suffix.lower() in extensions:
                files_to_update.append(Path(root) / file)

    for file_path in files_to_update:
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            
            for original, new in mapping.items():
                # Escaping for URL-encoded filenames in code (like %20 for space)
                orig_url = original.replace(" ", "%20")
                
                # Simple replacement for the filename in various contexts
                # We target the filename specifically to avoid over-matching
                content = content.replace(original, new)
                if orig_url != original:
                    content = content.replace(orig_url, new)
            
            if content != original_content:
                print(f"Updated: {file_path}")
                file_path.write_text(content, encoding='utf-8')
        except Exception as e:
            print(f"Could not update {file_path}: {e}")

if __name__ == "__main__":
    file_mapping = process_assets()
    if file_mapping:
        update_references(file_mapping)
        print("\nFinished! A backup of original files is in 'assets/images_backup'.")
        print("You can delete the backup folder once you verify the site works.")
    else:
        print("No assets processed.")
