/**
 * Chip-style sound effects synthesized with WebAudio — no audio files.
 *
 * Square and triangle waves through a low-pass filter echo the C64's SID chip.
 * Nothing plays until the visitor opts in on the boot screen or the HUD, and
 * the AudioContext is only created inside that user gesture (autoplay policy).
 */

const STORAGE_KEY = 'tfm-sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let drone: { stop: () => void } | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

function audio() {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, volume: number, endFreq?: number) {
  const ac = audio();
  if (!ac || !master) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3200;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(filter).connect(gain).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function startDrone() {
  const ac = audio();
  if (!ac || !master || drone) return;
  const gain = ac.createGain();
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.022, ac.currentTime + 2.5);
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 380;
  const lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 160;
  lfo.connect(lfoGain).connect(filter.frequency);
  const oscs = [55, 82.4, 110.3].map((f) => {
    const o = ac.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
  filter.connect(gain).connect(master);
  lfo.start();
  drone = {
    stop: () => {
      const now = ac.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      [...oscs, lfo].forEach((o) => o.stop(now + 0.7));
    },
  };
}

export const sound = {
  isEnabled: () => enabled,

  /** Must be called from a user gesture the first time. */
  setEnabled(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    if (on) startDrone();
    else {
      drone?.stop();
      drone = null;
    }
    listeners.forEach((l) => l(on));
  },

  /** Whether the visitor chose sound on a previous visit (used to preselect, never to autoplay). */
  remembered() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  },

  onChange(listener: (on: boolean) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Rising arpeggio, like the machine powering on. */
  boot() {
    if (!enabled) return;
    const ac = audio();
    if (!ac) return;
    const notes = [261.6, 329.6, 392, 523.3, 659.3, 784, 1046.5];
    notes.forEach((n, i) => tone(n, ac.currentTime + i * 0.065, 0.12, 'square', 0.035));
  },

  /** Keypress / hover tick. */
  tick() {
    if (!enabled) return;
    const ac = audio();
    if (ac) tone(1400 + Math.random() * 300, ac.currentTime, 0.03, 'square', 0.012);
  },

  /** Click / shockwave. */
  blip() {
    if (!enabled) return;
    const ac = audio();
    if (ac) tone(220, ac.currentTime, 0.22, 'square', 0.04, 880);
  },

  /** Level change: a short two-note jingle, pitched by level. */
  level(n: number) {
    if (!enabled) return;
    const ac = audio();
    if (!ac) return;
    const base = 196 * Math.pow(2, n / 12);
    tone(base, ac.currentTime, 0.12, 'triangle', 0.05);
    tone(base * 1.5, ac.currentTime + 0.09, 0.18, 'triangle', 0.045);
  },

  /** Something loaded (a demo, a project). */
  load() {
    if (!enabled) return;
    const ac = audio();
    if (!ac) return;
    [523.3, 392, 659.3].forEach((n, i) => tone(n, ac.currentTime + i * 0.08, 0.14, 'square', 0.03));
  },
};
