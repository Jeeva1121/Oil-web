from PIL import Image
import numpy as np
import cv2
import os

os.makedirs('public/sesame', exist_ok=True)

# 1. Sesame Bottle from image copy 2.png
img2 = Image.open('image copy 2.png')
arr2 = np.array(img2)
y2, x2 = np.where(arr2[:, :, 3] > 10)
min_x, max_x = np.min(x2), np.max(x2)
min_y, max_y = np.min(y2), np.max(y2)
cropped_bottle = img2.crop((min_x, min_y, max_x + 1, max_y + 1))
cropped_bottle.save('public/sesame/sesame-bottle.png', 'PNG')
print('Saved public/sesame/sesame-bottle.png')

# 2. Sesame Seeds from image copy 3.png
img3 = Image.open('image copy 3.png')
arr3 = np.array(img3)
alpha3 = arr3[:, :, 3]
mask3 = (alpha3 > 10).astype(np.uint8)

num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask3, connectivity=8)
print('Connected components in sesame seeds image:', num_labels - 1)

for quadrant, (x_cond, y_cond, name) in enumerate([
    (lambda cx: cx < 768, lambda cy: cy < 512, 'sesame-tl'),
    (lambda cx: cx >= 768, lambda cy: cy < 512, 'sesame-tr'),
    (lambda cx: cx < 768, lambda cy: cy >= 512, 'sesame-bl'),
    (lambda cx: cx >= 768, lambda cy: cy >= 512, 'sesame-br')
]):
    q_mask = np.zeros(mask3.shape, dtype=bool)
    for i in range(1, num_labels):
        cx, cy = centroids[i]
        if x_cond(cx) and y_cond(cy):
            q_mask[labels == i] = True
            
    crop = arr3.copy()
    crop[~q_mask, 3] = 0
    y_idx, x_idx = np.where(crop[:, :, 3] > 10)
    if len(y_idx) > 0:
        cropped = Image.fromarray(crop[np.min(y_idx):np.max(y_idx)+1, np.min(x_idx):np.max(x_idx)+1])
        cropped.save(f'public/sesame/{name}.png', 'PNG')
        print(f'Saved public/sesame/{name}.png ({cropped.size})')

print('Sesame assets extracted successfully!')
