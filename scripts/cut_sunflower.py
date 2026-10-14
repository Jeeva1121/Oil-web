from PIL import Image
import numpy as np
import cv2
import os

os.makedirs('public/sunflower', exist_ok=True)

# 1. Sunflower Bottle
bottle_img = Image.open('image.png')
bottle_arr = np.array(bottle_img)
y_indices, x_indices = np.where(bottle_arr[:, :, 3] > 10)
min_x, max_x = np.min(x_indices), np.max(x_indices)
min_y, max_y = np.min(y_indices), np.max(y_indices)
cropped_bottle = bottle_img.crop((min_x, min_y, max_x + 1, max_y + 1))
cropped_bottle.save('public/sunflower/sunflower-bottle.png', 'PNG')
print('Saved public/sunflower/sunflower-bottle.png')

# 2. Side Flowers & Splashes from image copy.png
flower_img = Image.open('image copy.png')
flower_arr = np.array(flower_img)
w, h = flower_img.size

# Split into 4 quadrants with padding
# Top-Left (x < w/2, y < h/2)
tl_mask = np.zeros((h, w), dtype=bool)
tl_mask[:int(h*0.55), :int(w*0.55)] = True
tl_crop = flower_arr.copy()
tl_crop[~tl_mask, 3] = 0
y_idx, x_idx = np.where(tl_crop[:, :, 3] > 10)
if len(y_idx) > 0:
    Image.fromarray(tl_crop[np.min(y_idx):np.max(y_idx)+1, np.min(x_idx):np.max(x_idx)+1]).save('public/sunflower/sunflower-tl.png', 'PNG')
    print('Saved public/sunflower/sunflower-tl.png')

# Top-Right (x > w/2, y < h/2)
tr_mask = np.zeros((h, w), dtype=bool)
tr_mask[:int(h*0.55), int(w*0.45):] = True
tr_crop = flower_arr.copy()
tr_crop[~tr_mask, 3] = 0
y_idx, x_idx = np.where(tr_crop[:, :, 3] > 10)
if len(y_idx) > 0:
    Image.fromarray(tr_crop[np.min(y_idx):np.max(y_idx)+1, np.min(x_idx):np.max(x_idx)+1]).save('public/sunflower/sunflower-tr.png', 'PNG')
    print('Saved public/sunflower/sunflower-tr.png')

# Bottom-Left (x < w/2, y > h/2)
bl_mask = np.zeros((h, w), dtype=bool)
bl_mask[int(h*0.45):, :int(w*0.55)] = True
bl_crop = flower_arr.copy()
bl_crop[~bl_mask, 3] = 0
y_idx, x_idx = np.where(bl_crop[:, :, 3] > 10)
if len(y_idx) > 0:
    Image.fromarray(bl_crop[np.min(y_idx):np.max(y_idx)+1, np.min(x_idx):np.max(x_idx)+1]).save('public/sunflower/sunflower-bl.png', 'PNG')
    print('Saved public/sunflower/sunflower-bl.png')

# Bottom-Right (x > w/2, y > h/2)
br_mask = np.zeros((h, w), dtype=bool)
br_mask[int(h*0.45):, int(w*0.45):] = True
br_crop = flower_arr.copy()
br_crop[~br_mask, 3] = 0
y_idx, x_idx = np.where(br_crop[:, :, 3] > 10)
if len(y_idx) > 0:
    Image.fromarray(br_crop[np.min(y_idx):np.max(y_idx)+1, np.min(x_idx):np.max(x_idx)+1]).save('public/sunflower/sunflower-br.png', 'PNG')
    print('Saved public/sunflower/sunflower-br.png')

print('All sunflower assets processed successfully!')
