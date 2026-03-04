from PIL import Image
import os

# Load the image
input_path = r"c:\Users\Lenovo\Downloads\findbus-main\findbus-main\public\icon.jpg"
output_path = r"c:\Users\Lenovo\Downloads\findbus-main\findbus-main\public\icon.png"

# Open the image
img = Image.open(input_path)

# Convert to RGBA for transparency support
img = img.convert("RGBA")

# Get image data
data = img.getdata()

# Create a new list to hold the modified pixels
new_data = []

# Process each pixel - replace white and near-white colors with transparency
for item in data:
    # Check if pixel is white or near-white (high RGB values)
    # Using a threshold to handle anti-aliasing and slight color variations
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        # Replace with transparent
        new_data.append((255, 255, 255, 0))
    else:
        # Keep the original pixel with full opacity
        new_data.append(item)

# Update image data
img.putdata(new_data)

# Save as PNG with high quality
img.save(output_path, "PNG", quality=95)

print(f"Successfully converted icon.jpg to icon.png")
print(f"Output saved to: {output_path}")
print(f"Image size: {img.size}")
print(f"Image mode: {img.mode}")
