/**
 * The hero's illustration: a retro workstation in black line work with
 * orange details, the portfolio's answer to the reference's car. Drawn in
 * one oblique projection (every depth edge runs up-right at the same slope),
 * so the pieces read as one scene. It only draws; Hero animates it through
 * the data attributes:
 *   data-piece   a whole object (tower, monitor, keyboard, mouse, desk props)
 *   data-depth   how far a piece drifts with the pointer (parallax)
 *   data-key     a keycap; data-screen the CRT picture; data-led a status light
 *   data-cmd / data-out   terminal lines, typed / printed in turn
 *   data-steam   a wisp over the mug
 */

/** A point on the keyboard deck: u runs along its width, v back into its depth (both 0–1). */
const deck = (u: number, v: number) => [96 + 360 * u + 80 * v, 446 - 47 * v] as const;
const quad = (u0: number, v0: number, u1: number, v1: number) =>
  [deck(u0, v0), deck(u1, v0), deck(u1, v1), deck(u0, v1)].map((p) => p.join(",")).join(" ");

/** Key widths per row, in key units (14 per row), front row first. The orange one is Enter. */
const ROWS = [
  [2, 2, 6, 2, 2],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
];
const ENTER = { row: 2, col: 11 };

function Keys() {
  const unit = 0.95 / 14;
  const rowDepth = 0.8 / ROWS.length;
  return (
    <>
      {ROWS.flatMap((row, r) => {
        let u = 0.025;
        const v0 = 0.1 + r * rowDepth;
        const v1 = v0 + rowDepth - 0.05;
        return row.map((w, c) => {
          const u0 = u + 0.006;
          const u1 = u + w * unit - 0.006;
          u += w * unit;
          const accent = r === ENTER.row && c === ENTER.col;
          return (
            <g key={`${r}-${c}`} data-key>
              <polygon points={quad(u0, v0, u1, v1)} transform="translate(0 2.5)" className="ws-shade ws-key" />
              <polygon points={quad(u0, v0, u1, v1)} className={`ws-key ${accent ? "ws-accent" : "ws-light"}`} />
            </g>
          );
        });
      })}
    </>
  );
}

/** Lines along a face, for vents: from p0 to p1, repeated `n` times shifted by (dx, dy). */
function Lines({ from, to, n, dx = 0, dy = 0, className = "ws-thin" }: { from: [number, number]; to: [number, number]; n: number; dx?: number; dy?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={from[0] + dx * i} y1={from[1] + dy * i} x2={to[0] + dx * i} y2={to[1] + dy * i} className={className} />
      ))}
    </>
  );
}

/** What the terminal runs: commands are typed, output is printed. */
const TERMINAL = [
  { cmd: "dotnet test" },
  { out: "Passed!  174/174  2.1s", accent: true },
  { cmd: "docker compose up -d" },
  { out: "api   healthy   :8080" },
  { cmd: "git push" },
  { out: "main -> origin" },
];

export default function Workstation({ title, className = "" }: { title: string; className?: string }) {
  return (
    <svg className={`workstation ${className}`} viewBox="0 0 720 490" role="img" aria-labelledby="ws-title">
      <title id="ws-title">{title}</title>
      <defs>
        <pattern id="ws-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="ws-hatch-line" />
        </pattern>
        <clipPath id="ws-screen-clip">
          <rect x="182" y="128" width="216" height="166" rx="12" />
        </clipPath>
      </defs>

      {/* Ground shadows, drawn first so every object stands on them. */}
      <g data-piece data-depth="0.2">
        <rect x="88" y="461" width="452" height="6" rx="3" className="ws-solid" />
        <rect x="576" y="466" width="128" height="6" rx="3" className="ws-solid" />
        <rect x="12" y="466" width="112" height="6" rx="3" className="ws-solid" />
        <line x1="0" y1="474" x2="720" y2="474" className="ws-ground" />
      </g>

      {/* Server tower, standing at the right like the figure beside the car. */}
      <g data-piece data-depth="0.5">
        <polygon points="664,70 698,50 698,448 664,468" className="ws-shade" />
        <polygon points="664,70 698,50 698,448 664,468" className="ws-hatch" />
        <polygon points="584,70 618,50 698,50 664,70" className="ws-top" />
        <rect x="584" y="70" width="80" height="398" rx="3" className="ws-light" />
        <line x1="584" y1="86" x2="664" y2="86" className="ws-line" />
        <rect x="596" y="98" width="56" height="16" rx="2" className="ws-light" />
        <line x1="604" y1="106" x2="634" y2="106" className="ws-line" />
        <circle cx="644" cy="106" r="2.6" className="ws-accent-fill" data-led />
        <rect x="596" y="120" width="56" height="16" rx="2" className="ws-light" />
        <line x1="604" y1="128" x2="634" y2="128" className="ws-line" />
        <circle cx="624" cy="166" r="10" className="ws-light" />
        <path d="M619 161 A7 7 0 1 0 629 161 M624 157 V165" className="ws-line" />
        {[604, 616, 628, 640].map((x) => (
          <circle key={x} cx={x} cy="194" r="3" className="ws-solid" data-led />
        ))}
        <Lines from={[598, 216]} to={[650, 216]} n={23} dy={10} />
        {/* Sticker on the side panel, sheared onto its slope. */}
        <g transform="translate(681 300) matrix(1 -0.588 0 1 0 0)">
          <ellipse cx="0" cy="0" rx="12" ry="22" className="ws-accent" />
          <text x="0" y="4" className="ws-sticker-text" textAnchor="middle" transform="rotate(-90)">
            C#
          </text>
        </g>
      </g>

      {/* The monitor: a deep all-in-one with a CRT. */}
      <g data-piece data-depth="0.8">
        <polygon points="430,96 522,42 522,346 430,400" className="ws-shade" />
        <polygon points="430,96 522,42 522,346 430,400" className="ws-hatch" />
        <Lines from={[452, 300]} to={[504, 269.5]} n={6} dy={-16} />
        <polygon points="150,96 242,42 522,42 430,96" className="ws-top" />
        <Lines from={[272, 76]} to={[392, 76]} n={4} dx={7} dy={-4} />
        <rect x="196" y="398" width="188" height="16" rx="2" className="ws-light" />
        <rect x="150" y="96" width="280" height="304" rx="8" className="ws-light" />
        <rect x="168" y="114" width="244" height="194" rx="18" className="ws-bezel" />
        <g data-screen>
          <rect x="182" y="128" width="216" height="166" rx="12" className="ws-screen" />
          <g clipPath="url(#ws-screen-clip)" className="ws-terminal">
            {TERMINAL.map((line, i) => {
              const y = 152 + i * 20;
              return "cmd" in line ? (
                <g key={i}>
                  <text x="196" y={y} className="ws-prompt" data-prompt>
                    $
                  </text>
                  <text x="208" y={y} data-cmd={line.cmd}>
                    {line.cmd}
                  </text>
                </g>
              ) : (
                <text key={i} x="196" y={y} className={line.accent ? "ws-out-accent" : "ws-out"} data-out>
                  {line.out}
                </text>
              );
            })}
            <text x="196" y="272" className="ws-prompt" data-prompt>
              $
            </text>
            <rect x="208" y="263" width="7" height="12" className="ws-cursor" data-cursor />
            <polygon points="190,134 262,134 206,200 190,200" className="ws-glare" />
          </g>
        </g>
        <rect x="300" y="336" width="92" height="9" rx="2" className="ws-solid" />
        <line x1="306" y1="356" x2="386" y2="356" className="ws-thin" />
        <g transform="translate(210 352) rotate(-10)">
          <rect x="-28" y="-11" width="56" height="22" rx="11" className="ws-accent" />
          <text x="0" y="4" textAnchor="middle" className="ws-sticker-text">
            .NET
          </text>
        </g>
      </g>

      {/* Keyboard in front, low and wide like the car's bumper. */}
      <g data-piece data-depth="1.2">
        <polygon points="456,446 536,399 536,415 456,462" className="ws-shade" />
        <polygon points="96,446 456,446 536,399 176,399" className="ws-top" />
        <rect x="96" y="446" width="360" height="16" rx="3" className="ws-light" />
        <Keys />
      </g>

      {/* Mouse, its cable running back to the monitor. */}
      <g data-piece data-depth="1.3">
        <path d="M565 430 C565 396 566 372 516 346" className="ws-cable" />
        <ellipse cx="565" cy="464" rx="18" ry="3" className="ws-solid" />
        <path d="M548 452 C548 436 556 428 565 428 C574 428 582 436 582 452 C582 460 574 462 565 462 C556 462 548 460 548 452 Z" className="ws-light" />
        <line x1="565" y1="428" x2="565" y2="443" className="ws-line" />
        <rect x="563" y="432" width="4" height="7" rx="2" className="ws-accent" />
      </g>

      {/* Books and a coffee, at the left edge. */}
      <g data-piece data-depth="1.4">
        <polygon points="20,450 116,450 134,439 38,439" className="ws-top" />
        <rect x="20" y="450" width="96" height="18" rx="2" className="ws-light" />
        <text x="30" y="462.5" className="ws-spine">
          CLEAN ARCHITECTURE
        </text>
        <polygon points="28,432 112,432 128,423 44,423" className="ws-top" />
        <rect x="28" y="432" width="84" height="18" rx="2" className="ws-shade" />
        <text x="38" y="444.5" className="ws-spine">
          DOMAIN-DRIVEN
        </text>
        <path d="M52 386 C32 386 32 414 52 414" className="ws-handle-outer" />
        <path d="M52 386 C32 386 32 414 52 414" className="ws-handle-inner" />
        <rect x="52" y="372" width="44" height="52" rx="6" className="ws-light" />
        <rect x="52" y="392" width="44" height="11" className="ws-accent" />
        <ellipse cx="74" cy="372" rx="22" ry="6" className="ws-top" />
        <ellipse cx="74" cy="372.5" rx="17" ry="4" className="ws-solid" />
        {["M64 360 C58 350 70 342 64 330", "M75 362 C69 350 81 340 75 326", "M86 360 C80 350 92 342 86 332"].map((d) => (
          <path key={d} d={d} className="ws-steam" data-steam />
        ))}
      </g>
    </svg>
  );
}
