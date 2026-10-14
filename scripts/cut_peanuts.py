import cv2
import numpy as np
from PIL import Image
import os

os.makedirs('public/peanuts', exist_ok=True)

img = Image.open('image copy 6.png')
arr = np.array(img)
alpha = arr[:, :, 3]

# Binary mask
mask = (alpha > 15).astype(np.uint8)
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, connectivity=8)

# Group elements
# 1. 4 Big Corner Peanuts
# Top-Left: #3
# Top-Right: #2
# Bottom-Left: #1
# Bottom-Right: #0

def extract_component(label_idx, filename, pad=10):
    x = stats[label_idx, cv2.CC_STAT_LEFT]
    y = stats[label_idx, cv2.CC_STAT_TOP]
    w = stats[label_idx, cv2.CC_STAT_WIDTH]
    h = stats[label_idx, cv2.CC_STAT_HEIGHT]
    
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(arr.shape[1], x + w + pad)
    y2 = min(arr.shape[0], y + h + pad)
    
    crop = arr[y1:y2, x1:x2].copy()
    crop_labels = labels[y1:y2, x1:x2]
    
    # Set pixels of other components to 0 alpha
    crop[crop_labels != label_idx, 3] = 0
    
    # Save with PIL
    out_img = Image.fromarray(crop)
    out_img.save(f'public/peanuts/{filename}.png', 'PNG')
    print(f'Saved public/peanuts/{filename}.png ({w}x{h})')

# Identify label IDs by matching centroids
for i in range(1, num_labels):
    cx, cy = centroids[i]
    area = stats[i, cv2.CC_STAT_AREA]
    if area > 30000:
        if cx < 768 and cy < 500:
            extract_component(i, 'peanut-tl') # Top Left
        elif cx >= 768 and cy < 500:
            extract_component(i, 'peanut-tr') # Top Right
        elif cx < 768 and cy >= 500:
            extract_component(i, 'peanut-bl') # Bottom Left
        elif cx >= 768 and cy >= 500:
            extract_component(i, 'peanut-br') # Bottom Right

# Also extract mid-side peanuts
for i in range(1, num_labels):
    cx, cy = centroids[i]
    area = stats[i, cv2.CC_STAT_AREA]
    if 7000 < area < 30000:
        if cx < 768:
            extract_component(i, f'peanut-mid-left-{i}')
        else:
            extract_component(i, f'peanut-mid-right-{i}')

# Also save full Left Cluster and full Right Cluster
left_crop = arr.copy()
left_crop[:, 768:, 3] = 0
# Crop bounding box of left side
y_indices, x_indices = np.where(left_crop[:, :, 3] > 10)
if len(y_indices) > 0:
    min_x, max_x = np.min(x_indices), np.max(x_indices)
    min_y, max_y = np.min(y_indices), np.max(y_indices)
    Image.fromarray(left_crop[min_y:max_y+1, min_x:max_x+1]).save('public/peanuts/peanuts-left-all.png', 'PNG')
    print('Saved public/peanuts/peanuts-left-all.png')

right_crop = arr.copy()
right_crop[:, :768, 3] = 0
y_indices, x_indices = np.where(right_crop[:, :, 3] > 10)
if len(y_indices) > 0:
    min_x, max_x = np.min(x_indices), np.max(x_indices)
    min_y, max_y = np.min(y_indices), np.max(y_indices)
    Image.fromarray(right_crop[min_y:max_y+1, min_x:max_x+1]).save('public/peanuts/peanuts-right-all.png', 'PNG')
    print('Saved public/peanuts/peanuts-right-all.png')

print("All extractions complete!")
