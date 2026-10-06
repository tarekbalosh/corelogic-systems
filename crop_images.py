from PIL import Image
import os

images = ["accounting_pro_dashboard.png", "pos_system_dashboard.png", "student_management_dashboard.png"]
for img_name in images:
    path = os.path.join("public", img_name)
    if not os.path.exists(path):
        continue
    img = Image.open(path)
    # Crop 15% from all sides
    w, h = img.size
    left = w * 0.15
    top = h * 0.15
    right = w * 0.85
    bottom = h * 0.85
    img_cropped = img.crop((left, top, right, bottom))
    img_cropped.save(path)
    print(f"Cropped {img_name}")
