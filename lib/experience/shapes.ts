/**
 * Target point clouds for the particle experience.
 *
 * Every generator returns `count * 3` floats roughly inside [-1, 1]. Baked models
 * come from `scripts/bake-particles.mjs`; the rest are procedural on purpose —
 * they are diagrams (architecture layers, a service graph, a text screen), not
 * stand-ins for missing models.
 */
import type { ShapeKey } from './chapters';

// Deterministic PRNG so every visit draws the same shapes.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Loads a baked Int16 cloud and takes its first `count` points (the file is pre-shuffled). */
export async function loadBakedShape(url: string, count: number, signal?: AbortSignal): Promise<Float32Array> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}`);
  const raw = new Int16Array(await response.arrayBuffer());
  const available = raw.length / 3;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Wrap around if the device asks for more points than were baked.
    const src = (i % available) * 3;
    out[i * 3] = raw[src] / 32767;
    out[i * 3 + 1] = raw[src + 1] / 32767;
    out[i * 3 + 2] = raw[src + 2] / 32767;
  }
  return out;
}

/**
 * Clean Architecture as four concentric platters: Domain at the core, then
 * Application, Infrastructure and the API at the edge. Stacked slightly so the
 * elevated camera reads them as layers, not as a single disc.
 */
function layers(count: number): { positions: Float32Array; ring: Float32Array } {
  const rand = mulberry32(11);
  const rings = [
    { inner: 0, outer: 0.24, y: 0.18 },
    { inner: 0.34, outer: 0.5, y: 0.08 },
    { inner: 0.6, outer: 0.76, y: -0.02 },
    { inner: 0.86, outer: 1, y: -0.12 },
  ];
  const areas = rings.map((r) => r.outer ** 2 - r.inner ** 2);
  const total = areas.reduce((a, b) => a + b, 0);
  const out = new Float32Array(count * 3);
  const ringOf = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let pick = rand() * total;
    let ring = rings[0];
    for (let k = 0; k < rings.length; k++) {
      pick -= areas[k];
      if (pick <= 0) { ring = rings[k]; ringOf[i] = k; break; }
    }
    // sqrt keeps the density uniform across the annulus.
    const radius = Math.sqrt(ring.inner ** 2 + rand() * (ring.outer ** 2 - ring.inner ** 2));
    const angle = rand() * Math.PI * 2;
    out[i * 3] = Math.cos(angle) * radius;
    out[i * 3 + 1] = ring.y + (rand() - 0.5) * 0.025;
    out[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return { positions: out, ring: ringOf };
}

/** A service graph on a sphere: dense nodes joined by arcs to their nearest neighbours. */
function network(count: number): Float32Array {
  const rand = mulberry32(23);
  const nodeCount = 42;
  const nodes: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    nodes.push([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r]);
  }
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter(({ j }) => j > i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3);
    nearest.forEach(({ j }) => edges.push([i, j]));
  });

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let p: [number, number, number];
    if (rand() < 0.42) {
      const n = nodes[Math.floor(rand() * nodeCount)];
      const spread = 0.05 * Math.cbrt(rand());
      p = [n[0] + (rand() - 0.5) * spread * 2, n[1] + (rand() - 0.5) * spread * 2, n[2] + (rand() - 0.5) * spread * 2];
    } else {
      const [a, b] = edges[Math.floor(rand() * edges.length)];
      const t = rand();
      const A = nodes[a], B = nodes[b];
      const m = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t];
      // Push the chord back onto a slightly larger sphere so links read as arcs.
      const len = Math.hypot(m[0], m[1], m[2]) || 1;
      const lift = 1 + Math.sin(Math.PI * t) * 0.06;
      p = [(m[0] / len) * lift, (m[1] / len) * lift, (m[2] / len) * lift];
    }
    out.set(p, i * 3);
  }
  return out;
}

/** Wide, soft cloud: the pause between the work and the person. */
function drift(count: number): Float32Array {
  const rand = mulberry32(37);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(), 0.6) * 1.6;
    const a = rand() * Math.PI * 2;
    // Thin galaxy-like disc with a few arms.
    const arm = Math.sin(a * 3 + r * 4) * 0.08;
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = (rand() - 0.5) * 0.12 + arm;
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  return out;
}

/**
 * Samples filled pixels of a 2D drawing into a thin slab of points.
 * Used for the monogram and the text-mode screen, so both use the site font.
 */
function sampleCanvas(count: number, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, seed: number): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const out = new Float32Array(count * 3);
  if (!ctx) return out;
  draw(ctx);
  const { data } = ctx.getImageData(0, 0, width, height);
  const filled: number[] = [];
  for (let i = 0; i < width * height; i++) if (data[i * 4 + 3] > 128) filled.push(i);
  if (!filled.length) return out;
  const rand = mulberry32(seed);
  const scale = 2 / Math.max(width, height);
  for (let i = 0; i < count; i++) {
    const px = filled[Math.floor(rand() * filled.length)];
    const x = (px % width) + rand();
    const y = Math.floor(px / width) + rand();
    out[i * 3] = (x - width / 2) * scale;
    out[i * 3 + 1] = -(y - height / 2) * scale;
    out[i * 3 + 2] = (rand() - 0.5) * 0.08;
  }
  return out;
}

function monogram(count: number, fontFamily: string): Float32Array {
  return sampleCanvas(count, 640, 300, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 260px ${fontFamily}`;
    ctx.fillText('tfm', 320, 150);
  }, 41);
}

/** A 40-column text-mode screen, like the one the terminal demos run in. */
function screen(count: number, monoFamily: string): Float32Array {
  const lines = ['READY.', 'LOAD "PROYECTOS",8,1', 'SEARCHING FOR PROYECTOS', 'LOADING', 'READY.', 'RUN'];
  return sampleCanvas(count, 640, 480, (ctx) => {
    ctx.fillStyle = '#fff';
    // Bezel
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(10, 10, 620, 460);
    ctx.font = `600 34px ${monoFamily}`;
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => ctx.fillText(line, 48, 52 + i * 52));
    ctx.fillRect(48, 52 + lines.length * 52, 22, 34); // cursor
  }, 53);
}

export interface ShapeFonts {
  display: string;
  mono: string;
}

/**
 * Builds every procedural shape. Baked ones (`c64`, `globe`) are loaded separately.
 * `layerIndex` tags each point with its Clean Architecture ring so one layer can be lifted.
 */
export function buildProceduralShapes(count: number, fonts: ShapeFonts) {
  const layered = layers(count);
  const shapes: Partial<Record<ShapeKey, Float32Array>> = {
    layers: layered.positions,
    network: network(count),
    drift: drift(count),
    screen: screen(count, fonts.mono),
    monogram: monogram(count, fonts.display),
  };
  return { shapes, layerIndex: layered.ring };
}
