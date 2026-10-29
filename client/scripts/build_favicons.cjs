const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagePath = path.resolve(__dirname, '../../Watch Party.png');
const publicDir = path.resolve(__dirname, '../public');

// Pack multiple PNG buffers into a valid Windows .ico file
function createIco(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    const w = item.width >= 256 ? 0 : item.width;
    const h = item.height >= 256 ? 0 : item.height;
    entry.writeUInt8(w, 0);
    entry.writeUInt8(h, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(b => b.buffer)]);
}

async function run() {
  console.log('Generating crisp official red squircle brand favicons...');

  // 1. Crop box05 squircle from Watch Party.png
  const rawSquircle = await sharp(imagePath)
    .extract({ left: 54, top: 624, width: 142, height: 142 })
    .toBuffer();

  // Apply smooth anti-aliased squircle mask
  const size = 512;
  const maskSvg = Buffer.from(
    `<svg width="${size}" height="${size}">
       <rect x="0" y="0" width="${size}" height="${size}" rx="115" ry="115" fill="#ffffff" />
     </svg>`
  );

  const baseSquircle512 = await sharp(rawSquircle)
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Generate all PNG resolutions
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon.png', size: 64 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-144x144.png', size: 144 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'pwa-192.png', size: 192 },
    { name: 'pwa-512.png', size: 512 },
  ];

  const icoLayers = [];

  for (const s of sizes) {
    const buf = await sharp(baseSquircle512)
      .resize(s.size, s.size, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9 })
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, s.name), buf);
    console.log(`Saved ${s.name} (${s.size}x${s.size})`);

    if ([16, 32, 48, 64].includes(s.size)) {
      icoLayers.push({ width: s.size, height: s.size, buffer: buf });
    }
  }

  // 3. Build multi-resolution favicon.ico
  const icoBuffer = createIco(icoLayers);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`Saved favicon.ico (${icoBuffer.length} bytes, 4 resolutions: 16, 32, 48, 64)`);

  // 4. Generate clean favicon.svg embedding the high-res 512px official squircle
  const b64_512 = baseSquircle512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" href="data:image/png;base64,${b64_512}"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  console.log(`Saved clean favicon.svg (${svgContent.length} bytes)`);

  console.log('--- ALL FAVICONS GENERATED SUCCESSFULLY ---');
}

run().catch(console.error);
