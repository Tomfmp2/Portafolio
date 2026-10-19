/**
 * Pixel monogram drawn like a character on the C64 boot screen: "TFM" in the
 * phosphor colour followed by the amber block cursor. Glyphs are 5×7 bitmaps
 * and the viewBox is 16 units tall, so at h-8 (32px) every pixel lands on
 * exactly 2 device-independent pixels and stays crisp. app/icon.svg reuses the grid.
 */
const GLYPHS = [
  ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
];
const PAD = 4;
const GLYPH_W = 5;
const GLYPH_H = 7;
const GAP = 1;
const CURSOR_X = PAD + GLYPHS.length * (GLYPH_W + GAP);
const WIDTH = CURSOR_X + GLYPH_W + PAD;
// One spare row at the bottom, like the empty descender row of a C64 character cell.
const HEIGHT = PAD * 2 + GLYPH_H + 1;

const PIXELS = GLYPHS.flatMap((rows, g) =>
  rows.flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === "#" ? [{ x: PAD + g * (GLYPH_W + GAP) + x, y: PAD + y }] : [])),
  ),
);

export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect width={WIDTH} height={HEIGHT} rx={3} fill="var(--c64)" />
      <rect x={0.5} y={0.5} width={WIDTH - 1} height={HEIGHT - 1} rx={2.6} fill="none" stroke="var(--phosphor)" strokeOpacity={0.45} />
      <g fill="var(--phosphor)">
        {PIXELS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
      <rect className="logo-cursor" x={CURSOR_X} y={PAD} width={GLYPH_W} height={GLYPH_H} fill="var(--signal)" />
    </svg>
  );
}
