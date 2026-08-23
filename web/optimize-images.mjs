import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'public', 'images');

// 1. Optimize base images to webp and compressed png
const pngFiles = ['hero_illustration.png', 'pillar_roleplay.png', 'pillar_studio.png', 'pillar_interface.png', 'pillar_1.png', 'pillar_2.png', 'pillar_3.png'];

for (const file of pngFiles) {
  const src = path.join(imgDir, file);
  if (!fs.existsSync(src)) continue;
  
  const destWebp = path.join(imgDir, file.replace('.png', '.webp'));
  await sharp(src)
    .webp({ quality: 82, effort: 6 })
    .toFile(destWebp);

  // Also optimize PNG fallback
  const tempPng = path.join(imgDir, `min_${file}`);
  await sharp(src)
    .png({ compressionLevel: 9, palette: true, quality: 85 })
    .toFile(tempPng);
  fs.copyFileSync(tempPng, src);
  fs.unlinkSync(tempPng);
}

// 2. Generate 1x / responsive variants for hero_illustration
const heroSrc = path.join(imgDir, 'hero_illustration.png');
await sharp(heroSrc)
  .resize(702, 560, { fit: 'inside' })
  .webp({ quality: 82, effort: 6 })
  .toFile(path.join(imgDir, 'hero_illustration-702w.webp'));

await sharp(heroSrc)
  .resize(702, 560, { fit: 'inside' })
  .png({ compressionLevel: 9, palette: true, quality: 85 })
  .toFile(path.join(imgDir, 'hero_illustration-702w.png'));

console.log("Image optimization complete!");
