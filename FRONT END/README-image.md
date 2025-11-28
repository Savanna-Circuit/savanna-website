Footer image instructions

1) Copy the communications image (from your attachment/OneDrive) into the project images folder:
   - `c:\Users\SAVANNA CIRCUIT\FRONT END\images\footer-logo.jpeg`

   Example PowerShell command:
   ```powershell
   Copy-Item -Path "C:\Users\SAVANNA CIRCUIT\OneDrive\Pictures\New folder(1)\sav logo (2).jpeg" -Destination "C:\Users\SAVANNA CIRCUIT\FRONT END\images\footer-logo.jpeg"
   ```

2) (Optional) Install the Python dependency and run the optimizer to resize/optimize the image:
   ```powershell
   pip install -r requirements.txt
   python scripts\optimize_image.py images\footer-logo.jpeg --width 600 --output images\footer-logo-optimized.jpeg
   ```

   - Use `--width` to set max width (recommended: 600 or 800). Without `--output` the script overwrites the input file.
   - The script saves optimized JPEG using `quality=85` and `optimize=True`.

3) If you used a different filename or format (e.g., PNG), update the `src` in the footer markup in your HTML files. Current placeholder used: `images/footer-logo.jpeg`.

Questions / Next steps
- I can add an automated NPM script or gulp task instead if you prefer Node-based tooling.
- I can run the optimizer here only after you copy the image into `images/` (the agent cannot read files outside the workspace).
