import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";
import wawoff2 from "wawoff2";

const main = async () => {
	const fontPath = path.resolve(
		"node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
	);
	const woff2Buffer = fs.readFileSync(fontPath);
	const ttfBuffer = await wawoff2.decompress(woff2Buffer);
	const ab = ttfBuffer.buffer.slice(
		ttfBuffer.byteOffset,
		ttfBuffer.byteOffset + ttfBuffer.byteLength,
	);
	const font = opentype.parse(ab);

	const targetSize = 512;
	const fontSize = 280;
	const initialPath = font.getPath("D2AI", 0, 0, fontSize);
	const bbox = initialPath.getBoundingBox();

	// Invert Y axis around vertical center (since OpenType/CFF2 font tables in this variable font have flipped Y coordinates)
	const centerY = (bbox.y1 + bbox.y2) / 2;
	const fixedPath = new opentype.Path();

	for (const cmd of initialPath.commands) {
		const newCmd = { ...cmd };
		if ("y" in newCmd) newCmd.y = 2 * centerY - newCmd.y;
		if ("y1" in newCmd) newCmd.y1 = 2 * centerY - newCmd.y1;
		if ("y2" in newCmd) newCmd.y2 = 2 * centerY - newCmd.y2;
		fixedPath.commands.push(newCmd);
	}

	const fbox = fixedPath.getBoundingBox();
	const width = fbox.x2 - fbox.x1;
	const height = fbox.y2 - fbox.y1;

	// Scale to fit nicely with breathing room in 512x512
	const scale = Math.min(
		(targetSize * 0.90) / width,
		(targetSize * 0.52) / height,
	);

	// Scale and center the path
	const scaledPath = new opentype.Path();
	const targetCenterX = targetSize / 2;
	const targetCenterY = targetSize / 2;
	const currentCenterX = (fbox.x1 + fbox.x2) / 2;
	const currentCenterY = (fbox.y1 + fbox.y2) / 2;

	for (const cmd of fixedPath.commands) {
		const newCmd = { ...cmd };
		if ("x" in newCmd) newCmd.x = targetCenterX + (newCmd.x - currentCenterX) * scale;
		if ("y" in newCmd) newCmd.y = targetCenterY + (newCmd.y - currentCenterY) * scale;
		if ("x1" in newCmd) newCmd.x1 = targetCenterX + (newCmd.x1 - currentCenterX) * scale;
		if ("y1" in newCmd) newCmd.y1 = targetCenterY + (newCmd.y1 - currentCenterY) * scale;
		if ("x2" in newCmd) newCmd.x2 = targetCenterX + (newCmd.x2 - currentCenterX) * scale;
		if ("y2" in newCmd) newCmd.y2 = targetCenterY + (newCmd.y2 - currentCenterY) * scale;
		scaledPath.commands.push(newCmd);
	}

	const pathData = scaledPath.toPathData();

	// 1. Generate transparent adaptive SVG favicon (prefers-color-scheme)
	const adaptiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <style>
    .d2ai-glyph {
      fill: #1d2480;
      stroke: #1d2480;
      stroke-width: 14;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    @media (prefers-color-scheme: dark) {
      .d2ai-glyph {
        fill: #ffffff;
        stroke: #ffffff;
      }
    }
  </style>
  <path class="d2ai-glyph" d="${pathData}" />
</svg>`;

	// Static colored SVG for PNG generation
	const renderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="${pathData}" fill="#1d2480" stroke="#1d2480" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" />
</svg>`;

	const publicDir = path.resolve("public");

	// Write favicon.svg (transparent, adaptive)
	fs.writeFileSync(path.join(publicDir, "favicon.svg"), adaptiveSvg, "utf-8");
	console.log("Created public/favicon.svg (transparent & adaptive Geist Mono)");

	// Generate PNGs at all required sizes
	const svgBuffer = Buffer.from(renderSvg);

	const sizes = [
		{ name: "favicon-16x16.png", size: 16 },
		{ name: "favicon-32x32.png", size: 32 },
		{ name: "favicon-96x96.png", size: 96 },
		{ name: "apple-touch-icon.png", size: 180 },
		{ name: "logo192.png", size: 192 },
		{ name: "logo512.png", size: 512 },
	];

	for (const { name, size } of sizes) {
		await sharp(svgBuffer)
			.resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.png()
			.toFile(path.join(publicDir, name));
		console.log(`Created public/${name} (${size}x${size}, transparent)`);
	}

	// Generate favicon.ico using 16x16, 32x32, 48x48 PNG buffers
	const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
	const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
	const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

	// Multi-image ICO writer
	const icoBuffer = createIco([
		{ size: 16, buffer: p16 },
		{ size: 32, buffer: p32 },
		{ size: 48, buffer: p48 },
	]);
	fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
	console.log("Created public/favicon.ico (16, 32, 48 multi-res)");

	console.log("All logo & favicon generation completed successfully!");
}

const createIco = (images) => {
	const numImages = images.length;
	const headerLength = 6;
	const dirEntryLength = 16;
	const dirLength = dirEntryLength * numImages;

	let offset = headerLength + dirLength;
	const entries = [];

	for (const img of images) {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
		entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
		entry.writeUInt8(0, 2);
		entry.writeUInt8(0, 3);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(img.buffer.length, 8);
		entry.writeUInt32LE(offset, 12);
		entries.push(entry);
		offset += img.buffer.length;
	}

	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(numImages, 4);

	return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

main().catch(console.error);
