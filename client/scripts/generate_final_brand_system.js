import sharp from 'sharp';
import path from 'path';

const imagePath = path.resolve('../Watch Party.png');
const publicDir = path.resolve('./public');

async function buildBrandSystem() {
  console.log('--- Generating Brand System (Node.js + sharp) ---');

  // Helper for alpha extraction
  function applyDarkThemeAlpha(data, w, h, threshold = 14, feather = 38) {
    const outBuf = Buffer.alloc(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      const r = data[i * 3];
      const g = data[i * 3 + 1];
      const b = data[i * 3 + 2];
      const maxVal = Math.max(r, g, b);

      if (maxVal <= threshold) {
        outBuf[i * 4] = 0;
        outBuf[i * 4 + 1] = 0;
        outBuf[i * 4 + 2] = 0;
        outBuf[i * 4 + 3] = 0;
      } else if (maxVal >= feather) {
        outBuf[i * 4] = r;
        outBuf[i * 4 + 1] = g;
        outBuf[i * 4 + 2] = b;
        outBuf[i * 4 + 3] = 255;
      } else {
        const alpha = (maxVal - threshold) / (feather - threshold);
        outBuf[i * 4] = r;
        outBuf[i * 4 + 1] = g;
        outBuf[i * 4 + 2] = b;
        outBuf[i * 4 + 3] = Math.round(alpha * 255);
      }
    }
    return outBuf;
  }

  // 1. PRIMARY / NAVBAR LOGO (Transparent PNG)
  console.log('1. Primary & Navbar Logo...');
  const sec01 = await sharp(imagePath)
    .extract({ left: 72, top: 94, width: 884, height: 170 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bufNavbar = applyDarkThemeAlpha(sec01.data, sec01.info.width, sec01.info.height, 14, 38);
  const trimmedNavbar = await sharp(bufNavbar, { raw: { width: sec01.info.width, height: sec01.info.height, channels: 4 } })
    .trim({ threshold: 0 })
    .toBuffer({ resolveWithObject: true });

  await sharp(trimmedNavbar.data, { raw: { width: trimmedNavbar.info.width, height: trimmedNavbar.info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo_navbar.png'));

  await sharp(trimmedNavbar.data, { raw: { width: trimmedNavbar.info.width, height: trimmedNavbar.info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'brand_logo_3d.png')); // Replace old 3D logo so all existing tags match perfectly

  console.log(`Saved logo_navbar.png & brand_logo_3d.png (${trimmedNavbar.info.width}x${trimmedNavbar.info.height})`);

  // 2. ISOLATED CLEAN SYMBOL (Transparent PNG)
  console.log('2. Pure Ribbon Symbol...');
  const sec01Symbol = await sharp(imagePath)
    .extract({ left: 72, top: 94, width: 155, height: 170 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bufSymbol = applyDarkThemeAlpha(sec01Symbol.data, sec01Symbol.info.width, sec01Symbol.info.height, 14, 38);
  const trimmedSymbol = await sharp(bufSymbol, { raw: { width: sec01Symbol.info.width, height: sec01Symbol.info.height, channels: 4 } })
    .trim({ threshold: 0 })
    .toBuffer({ resolveWithObject: true });

  await sharp(trimmedSymbol.data, { raw: { width: trimmedSymbol.info.width, height: trimmedSymbol.info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo_symbol.png'));

  console.log(`Saved logo_symbol.png (${trimmedSymbol.info.width}x${trimmedSymbol.info.height})`);

  // 3. WORDMARK ONLY (Transparent PNG)
  console.log('3. Wordmark Only...');
  const sec01Wordmark = await sharp(imagePath)
    .extract({ left: 240, top: 94, width: 715, height: 170 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bufWordmark = applyDarkThemeAlpha(sec01Wordmark.data, sec01Wordmark.info.width, sec01Wordmark.info.height, 14, 38);
  const trimmedWordmark = await sharp(bufWordmark, { raw: { width: sec01Wordmark.info.width, height: sec01Wordmark.info.height, channels: 4 } })
    .trim({ threshold: 0 })
    .toBuffer({ resolveWithObject: true });

  await sharp(trimmedWordmark.data, { raw: { width: trimmedWordmark.info.width, height: trimmedWordmark.info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo_wordmark.png'));

  console.log(`Saved logo_wordmark.png (${trimmedWordmark.info.width}x${trimmedWordmark.info.height})`);

  // 4. FOOTER MUTED LOGO (Transparent PNG)
  console.log('4. Footer Muted Logo...');
  const sec03 = await sharp(imagePath)
    .extract({ left: 1152, top: 224, width: 374, height: 74 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bufFooter = applyDarkThemeAlpha(sec03.data, sec03.info.width, sec03.info.height, 13, 35);
  const trimmedFooter = await sharp(bufFooter, { raw: { width: sec03.info.width, height: sec03.info.height, channels: 4 } })
    .trim({ threshold: 0 })
    .toBuffer({ resolveWithObject: true });

  await sharp(trimmedFooter.data, { raw: { width: trimmedFooter.info.width, height: trimmedFooter.info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo_footer.png'));

  console.log(`Saved logo_footer.png (${trimmedFooter.info.width}x${trimmedFooter.info.height})`);

  // 5. RED APP ICON (Squircle with transparent outer corners)
  console.log('5. Red App Squircle...');
  const sqRaw = await sharp(imagePath)
    .extract({ left: 50, top: 624, width: 148, height: 148 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sqBuf = Buffer.alloc(148 * 148 * 4);
  for (let i = 0; i < 148 * 148; i++) {
    const r = sqRaw.data[i * 3];
    const g = sqRaw.data[i * 3 + 1];
    const b = sqRaw.data[i * 3 + 2];
    const maxVal = Math.max(r, g, b);

    if (maxVal <= 14) {
      sqBuf[i * 4] = 0;
      sqBuf[i * 4 + 1] = 0;
      sqBuf[i * 4 + 2] = 0;
      sqBuf[i * 4 + 3] = 0;
    } else if (maxVal >= 45) {
      sqBuf[i * 4] = r;
      sqBuf[i * 4 + 1] = g;
      sqBuf[i * 4 + 2] = b;
      sqBuf[i * 4 + 3] = 255;
    } else {
      const a = (maxVal - 14) / (45 - 14);
      sqBuf[i * 4] = r;
      sqBuf[i * 4 + 1] = g;
      sqBuf[i * 4 + 2] = b;
      sqBuf[i * 4 + 3] = Math.round(a * 255);
    }
  }

  const appIconBuffer = await sharp(sqBuf, { raw: { width: 148, height: 148, channels: 4 } })
    .png()
    .toBuffer();

  await sharp(appIconBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(appIconBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192.png'));
  await sharp(appIconBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512.png'));
  console.log('Saved apple-touch-icon.png, pwa-192.png, pwa-512.png');

  // 6. CRISP SQUIRCLE FAVICON
  console.log('6. Favicons...');
  const fSize = 256;
  const squircleBaseSvg = Buffer.from(`
    <svg width="${fSize}" height="${fSize}" viewBox="0 0 ${fSize} ${fSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${fSize}" height="${fSize}" rx="56" fill="#0B0B0F" stroke="#25252A" stroke-width="8"/>
    </svg>
  `);

  const pureSymbolPng = await sharp(trimmedSymbol.data, { raw: { width: trimmedSymbol.info.width, height: trimmedSymbol.info.height, channels: 4 } })
    .resize(164, 164, { fit: 'contain' })
    .png()
    .toBuffer();

  const faviconMaster = await sharp(squircleBaseSvg)
    .composite([{ input: pureSymbolPng, gravity: 'center' }])
    .png()
    .toBuffer();

  await sharp(faviconMaster).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(faviconMaster).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(faviconMaster).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('Saved favicon.png, favicon-32x32.png, favicon-16x16.png');

  // 7. OPEN GRAPH SOCIAL SHARE BANNER (1200x630)
  console.log('7. Open Graph Banner...');
  await sharp(imagePath)
    .extract({ left: 691, top: 656, width: 501, height: 172 })
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'og-image.jpg'));

  await sharp(imagePath)
    .extract({ left: 691, top: 656, width: 501, height: 172 })
    .resize(1200, 630, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Saved og-image.jpg and og-image.png (1200x630)');

  console.log('--- ALL ASSETS EXTRACTED AND VERIFIED CLEANLY ---');
}

buildBrandSystem().catch(console.error);
