#!/usr/bin/env node
/**
 * Bakes a GLB into a compact point cloud for the particle experience.
 *
 * The site never downloads the source models: the C64 alone is ~100 MB of 4K
 * textures. Particles only need surface positions, so we sample triangles here,
 * once, and ship ~6 bytes per point.
 *
 * Usage:
 *   node scripts/bake-particles.mjs <in.glb> <out.bin> [--count 40000]
 *        [--weight <material>=<factor> ...] [--seed 7]
 *
 * Output: Int16 x,y,z per point, centered and scaled so the largest extent spans
 * [-1, 1]. Points are emitted in random order, so any prefix is itself a uniform
 * sample (the runtime takes a prefix on low-power devices).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const [input, output] = args;
if (!input || !output) {
  console.error('Usage: bake-particles.mjs <in.glb> <out.bin> [--count N] [--weight mat=f] [--seed S]');
  process.exit(1);
}
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const count = Number(flag('count', 40000));
const seed = Number(flag('seed', 7));
const weights = new Map();
args.forEach((a, i) => {
  if (a === '--weight') {
    const [mat, f] = args[i + 1].split('=');
    weights.set(mat, Number(f));
  }
});

// Deterministic so re-baking produces identical files (stable diffs).
let state = seed >>> 0 || 1;
const rand = () => {
  state ^= state << 13; state >>>= 0;
  state ^= state >>> 17;
  state ^= state << 5; state >>>= 0;
  return state / 4294967296;
};

// ---- GLB parsing (uncompressed glTF 2.0 only) ----
const glb = readFileSync(input);
if (glb.readUInt32LE(0) !== 0x46546c67) throw new Error('Not a GLB file');
const jsonLength = glb.readUInt32LE(12);
const gltf = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'));
const binOffset = 20 + jsonLength + 8;
const unsupported = (gltf.extensionsRequired ?? []).filter(Boolean);
if (unsupported.length) throw new Error(`Compressed GLBs are not supported: ${unsupported.join(', ')}`);

const COMPONENTS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
const READERS = {
  5121: (b, o) => b.readUInt8(o),
  5123: (b, o) => b.readUInt16LE(o),
  5125: (b, o) => b.readUInt32LE(o),
  5126: (b, o) => b.readFloatLE(o),
};
const SIZES = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 };

function readAccessor(index) {
  const acc = gltf.accessors[index];
  const view = gltf.bufferViews[acc.bufferView];
  const comps = COMPONENTS[acc.type];
  const size = SIZES[acc.componentType];
  const stride = view.byteStride ?? comps * size;
  const base = binOffset + (view.byteOffset ?? 0) + (acc.byteOffset ?? 0);
  const read = READERS[acc.componentType];
  const out = new Float64Array(acc.count * comps);
  for (let i = 0; i < acc.count; i++) {
    for (let c = 0; c < comps; c++) out[i * comps + c] = read(glb, base + i * stride + c * size);
  }
  return out;
}

// ---- Scene graph → world matrices ----
const multiply = (a, b) => {
  const o = new Array(16).fill(0);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
};
function localMatrix(node) {
  if (node.matrix) return node.matrix;
  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const [x, y, z, w] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0,
    2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0,
    2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ];
}
const transform = (m, x, y, z) => [
  m[0] * x + m[4] * y + m[8] * z + m[12],
  m[1] * x + m[5] * y + m[9] * z + m[13],
  m[2] * x + m[6] * y + m[10] * z + m[14],
];

// Collect world-space triangles with their sampling weight (area × material factor).
const triangles = [];
const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function visit(nodeIndex, parent) {
  const node = gltf.nodes[nodeIndex];
  const world = multiply(parent, localMatrix(node));
  if (node.mesh !== undefined) {
    for (const prim of gltf.meshes[node.mesh].primitives) {
      if ((prim.mode ?? 4) !== 4) continue;
      const factor = weights.get(gltf.materials?.[prim.material]?.name) ?? 1;
      if (factor <= 0) continue;
      const pos = readAccessor(prim.attributes.POSITION);
      const idx = prim.indices !== undefined ? readAccessor(prim.indices) : null;
      const n = idx ? idx.length : pos.length / 3;
      const vertex = (i) => transform(world, pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      for (let t = 0; t < n; t += 3) {
        const a = vertex(idx ? idx[t] : t);
        const b = vertex(idx ? idx[t + 1] : t + 1);
        const c = vertex(idx ? idx[t + 2] : t + 2);
        const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
        const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
        const area = 0.5 * Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
        if (area > 0) triangles.push({ a, b, c, weight: area * factor });
      }
    }
  }
  for (const child of node.children ?? []) visit(child, world);
}
const scene = gltf.scenes[gltf.scene ?? 0];
for (const root of scene.nodes) visit(root, IDENTITY);
if (!triangles.length) throw new Error('No triangles found');

// ---- Area-weighted sampling ----
const cumulative = new Float64Array(triangles.length);
let total = 0;
triangles.forEach((t, i) => { total += t.weight; cumulative[i] = total; });
const pick = (r) => {
  let lo = 0, hi = cumulative.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < r) lo = mid + 1; else hi = mid;
  }
  return triangles[lo];
};

const points = new Float64Array(count * 3);
for (let i = 0; i < count; i++) {
  const { a, b, c } = pick(rand() * total);
  let u = rand(), v = rand();
  if (u + v > 1) { u = 1 - u; v = 1 - v; }
  for (let k = 0; k < 3; k++) points[i * 3 + k] = a[k] + u * (b[k] - a[k]) + v * (c[k] - a[k]);
}

// ---- Normalize to [-1, 1] on the largest axis and quantize ----
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < count; i++)
  for (let k = 0; k < 3; k++) {
    min[k] = Math.min(min[k], points[i * 3 + k]);
    max[k] = Math.max(max[k], points[i * 3 + k]);
  }
const center = min.map((m, k) => (m + max[k]) / 2);
const half = Math.max(...max.map((m, k) => m - min[k])) / 2;
const out = new Int16Array(count * 3);
for (let i = 0; i < count * 3; i++) out[i] = Math.round(((points[i] - center[i % 3]) / half) * 32767);

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, Buffer.from(out.buffer));
const extent = max.map((m, k) => ((m - min[k]) / (2 * half)).toFixed(2));
console.log(`${output}: ${count} points from ${triangles.length} triangles, ${(out.byteLength / 1024).toFixed(0)} KB, extent ${extent.join(' × ')}`);
