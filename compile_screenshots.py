import os
import sys
from PIL import Image

def get_image_diff(img1, img2):
    # Downsample images to 16x16 and convert to grayscale to calculate difference
    thumb1 = img1.resize((16, 16)).convert('L')
    thumb2 = img2.resize((16, 16)).convert('L')
    
    pixels1 = list(thumb1.getdata())
    pixels2 = list(thumb2.getdata())
    
    avg_diff = sum(abs(p1 - p2) for p1, p2 in zip(pixels1, pixels2)) / 256.0
    return avg_diff

def main():
    recording_dir = r"C:\Users\DeLLL\.gemini\antigravity\browser_recordings\5769bfc3-c6c4-4893-9026-eb1422720cd0"
    output_pdf = r"d:\kursath\screenshots_walkthrough.pdf"

    if not os.path.exists(recording_dir):
        print(f"Error: Directory does not exist: {recording_dir}")
        sys.exit(1)

    print("Scanning directory for screenshots...")
    files = [f for f in os.listdir(recording_dir) if f.lower().endswith('.jpg')]
    
    # Sort files chronologically (by timestamp name)
    files.sort()
    
    if not files:
        print("Error: No .jpg screenshots found in the directory.")
        sys.exit(1)

    print(f"Found {len(files)} total frames. Filtering duplicates...")

    selected_images = []
    last_img = None
    
    for i, file_name in enumerate(files):
        img_path = os.path.join(recording_dir, file_name)
        try:
            img = Image.open(img_path)
            
            if last_img is None:
                # Always keep the first frame
                selected_images.append(img)
                last_img = img
            else:
                # Compare current frame to the last kept frame
                diff = get_image_diff(last_img, img)
                # If the difference is significant (e.g. scroll, page change, click), keep it
                if diff > 1.8: 
                    selected_images.append(img)
                    last_img = img
                else:
                    # Close image if not selected to free memory
                    img.close()
        except Exception as e:
            print(f"Error processing {file_name}: {e}")

    # Ensure the last frame is always included
    if len(files) > 1:
        last_file_path = os.path.join(recording_dir, files[-1])
        try:
            last_img = Image.open(last_file_path)
            # Add it if it's not already the last selected image
            if len(selected_images) == 0 or selected_images[-1].filename != last_img.filename:
                selected_images.append(last_img)
        except Exception as e:
            pass

    print(f"Selected {len(selected_images)} unique/key frames out of {len(files)} total frames.")

    if not selected_images:
        print("No images to write to PDF.")
        sys.exit(1)

    # Convert PIL Images to RGB (PDF requires RGB)
    rgb_images = []
    for img in selected_images:
        if img.mode != 'RGB':
            rgb_images.append(img.convert('RGB'))
        else:
            rgb_images.append(img)

    print(f"Saving compiled screenshots to {output_pdf}...")
    # Save as PDF
    rgb_images[0].save(output_pdf, save_all=True, append_images=rgb_images[1:])
    print("PDF generated successfully!")

    # Close all images
    for img in rgb_images:
        img.close()

if __name__ == "__main__":
    main()
