const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, 'public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate PNGs at different resolutions
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  // Save standalone PNG icons
  fs.writeFileSync(path.join(__dirname, 'public', 'icon.png'), png32);
  fs.writeFileSync(path.join(__dirname, 'public', 'icon-192.png'), png192);
  fs.writeFileSync(path.join(__dirname, 'public', 'icon-512.png'), png512);
  fs.writeFileSync(path.join(__dirname, 'public', 'apple-icon.png'), png180);
  
  fs.writeFileSync(path.join(__dirname, 'src', 'app', 'icon.png'), png32);
  fs.writeFileSync(path.join(__dirname, 'src', 'app', 'apple-icon.png'), png180);

  // Build proper multi-resolution ICO file containing PNGs (16x16, 32x32, 48x48)
  const images = [
    { size: 16, buf: png16 },
    { size: 32, buf: png32 },
    { size: 48, buf: png48 },
  ];

  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];

  for (const img of images) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    dir.writeUInt8(0, 2); // color count
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(img.buf.length, 8); // size
    dir.writeUInt32LE(offset, 12); // offset
    dirEntries.push(dir);
    offset += img.buf.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...images.map(img => img.buf)
  ]);

  fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, 'src', 'app', 'favicon.ico'), icoBuffer);

  console.log('Successfully generated all PNG and multi-resolution ICO icons!');
  console.log('ICO total size:', icoBuffer.length, 'bytes');
}

generateIcons().catch(console.error);

