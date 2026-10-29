// Cleans the portrait cut-out without eating into it.
//
// Vision's soft mask follows thin details (lips, nose tip, turban folds) well, but
// semi-transparent edge pixels still carry the old background colour, which shows
// as a pale halo on the cobalt arch. Instead of eroding the mask, this pass keeps
// the alpha and replaces edge colours with the subject's own colour spread
// outward from its solid interior ("colour decontamination").
//
// usage: node scripts/refine-matte.mjs assets-src/portrait-raw.png assets-src/portrait-cutout.png
import sharp from "sharp";

const [, , input, output] = process.argv;
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

const SOLID = 0.92; // alpha treated as pure subject
const premul = Buffer.alloc(N * 3);
const solid = Buffer.alloc(N);
for (let i = 0; i < N; i++) {
  const a = data[i * 4 + 3] / 255;
  const s = a >= SOLID ? 1 : 0;
  solid[i] = s * 255;
  premul[i * 3] = data[i * 4] * s;
  premul[i * 3 + 1] = data[i * 4 + 1] * s;
  premul[i * 3 + 2] = data[i * 4 + 2] * s;
}

// Spread interior colour outward: blur(colour·solid) / blur(solid).
const sigma = 6;
const blurC = await sharp(premul, { raw: { width: W, height: H, channels: 3 } }).blur(sigma).raw().toBuffer();
const blurM = await sharp(solid, { raw: { width: W, height: H, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer();

// (extractChannel keeps single-channel blurs single-channel; sharp otherwise returns sRGB.)
// Vision's mask is upscaled from a coarse grid, so its contour is stair-stepped.
// Blur the alpha, then re-sharpen around the 50% line: same outline, smooth edge.
const alphaOnly = Buffer.alloc(N);
for (let i = 0; i < N; i++) alphaOnly[i] = data[i * 4 + 3];
const blurA = await sharp(alphaOnly, { raw: { width: W, height: H, channels: 1 } }).blur(2.2).extractChannel(0).raw().toBuffer();

const out = Buffer.alloc(N * 4);
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
for (let i = 0; i < N; i++) {
  const a = data[i * 4 + 3] / 255;
  const m = blurM[i] / 255;
  // Weight toward the pixel's own colour as it becomes solid.
  const own = smooth(0.55, SOLID, a);
  for (let c = 0; c < 3; c++) {
    const src = data[i * 4 + c];
    const ext = m > 0.02 ? Math.min(255, blurC[i * 3 + c] / m) : src;
    out[i * 4 + c] = Math.round(src * own + ext * (1 - own));
  }
  out[i * 4 + 3] = Math.round(smooth(0.32, 0.68, blurA[i] / 255) * 255);
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(output);
console.log("refined", W, H);
