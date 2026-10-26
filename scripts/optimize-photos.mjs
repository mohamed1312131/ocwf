import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = process.argv[2] || path.join(root, 'src', 'assets', 'photos-source');
const outDir = path.join(root, 'src', 'assets', 'photos');
const MAX_EDGE = Number(process.env.PHOTO_MAX_EDGE || 1600);
const QUALITY = Number(process.env.PHOTO_QUALITY || 80);

await fs.mkdir(outDir, { recursive: true });

const files = (await fs.readdir(srcDir)).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f));
if (!files.length) {
  console.warn(`No source images found in ${srcDir}`);
  process.exit(0);
}

for (const file of files) {
  const base = path.basename(file).replace(/\.[^.]+$/, '');
  const src = path.join(srcDir, file);
  const out = path.join(outDir, `${base}.webp`);
  const meta = await sharp(src).metadata();
  const { width, height } = meta;
  const longEdge = Math.max(width ?? 0, height ?? 0);
  const resized = longEdge > MAX_EDGE;
  await sharp(src)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(out);
  const outMeta = await sharp(out).metadata();
  console.log(
    `${base}.webp ${width}x${height}${resized ? ` -> ${outMeta.width}x${outMeta.height}` : ''} (~${Math.round((await fs.stat(out)).size / 1024)} kB)`,
  );
}
console.log(`Wrote ${files.length} WebP(s) to ${outDir}`);