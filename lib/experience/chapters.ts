/**
 * Scroll chapters of the particle experience.
 *
 * Each DOM section marked with `data-chapter="<index>"` owns one entry. The
 * particle cloud, camera and object pose are all derived from a single float,
 * `scrollState.chapter`: 2.0 means "fully on chapter 2", 2.4 means "40% of the
 * way from chapter 2 to 3". Nothing else drives the scene, so the scene can
 * never drift out of sync with the scroll position.
 */

export type ShapeKey = 'c64' | 'layers' | 'network' | 'globe' | 'screen' | 'drift' | 'monogram';

/** Order of the position attributes in the particle geometry (and of `uWeights`). */
export const SHAPES: ShapeKey[] = ['c64', 'layers', 'network', 'globe', 'screen', 'drift', 'monogram'];

type Vec3 = [number, number, number];

export interface Pose {
  /** Camera position relative to the object. */
  camera: Vec3;
  /** Object position: the camera rig follows it, so this mostly moves the whole shot. */
  offset: Vec3;
  /** Object rotation (radians) — the idle spin is added on top. */
  rotation: Vec3;
  scale: number;
}

export interface Chapter {
  id: string;
  shape: ShapeKey;
  desktop: Pose;
  mobile: Pose;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'inicio',
    shape: 'c64',
    desktop: { camera: [0.9, 0.5, 5.4], offset: [1.25, -0.2, 0], rotation: [0.05, -0.55, 0], scale: 1.45 },
    mobile: { camera: [0.4, 0.4, 6.4], offset: [0, 0.95, 0], rotation: [0.05, -0.45, 0], scale: 1 },
  },
  {
    id: 'habilidades',
    shape: 'layers',
    desktop: { camera: [0, 3.1, 4.4], offset: [1.25, -0.3, 0], rotation: [0, 0.3, 0], scale: 1.2 },
    mobile: { camera: [0, 3.4, 5.4], offset: [0, 0.85, 0], rotation: [0, 0.3, 0], scale: 0.85 },
  },
  {
    id: 'proyectos',
    shape: 'network',
    desktop: { camera: [-0.6, 0.4, 5.2], offset: [1.25, 0, 0], rotation: [0.2, 0.9, 0], scale: 1.05 },
    mobile: { camera: [0, 0.3, 6], offset: [0, 0.9, 0], rotation: [0.2, 0.9, 0], scale: 0.8 },
  },
  {
    id: 'feria-magica',
    shape: 'globe',
    desktop: { camera: [0.5, 0.7, 5.2], offset: [1.25, -0.05, 0], rotation: [0.06, -0.4, 0], scale: 1.15 },
    mobile: { camera: [0.2, 0.6, 6], offset: [0, 0.9, 0], rotation: [0.06, -0.4, 0], scale: 0.85 },
  },
  {
    id: 'mas-proyectos',
    shape: 'screen',
    desktop: { camera: [0, 0, 5.4], offset: [1.25, 0.1, 0], rotation: [0, -0.32, 0], scale: 1.1 },
    mobile: { camera: [0, 0, 6.2], offset: [0, 1, 0], rotation: [0, -0.2, 0], scale: 0.8 },
  },
  {
    id: 'sobre-mi',
    shape: 'drift',
    desktop: { camera: [0, 1.6, 7.2], offset: [1.8, 0, 0], rotation: [0.3, 0, 0], scale: 1.9 },
    mobile: { camera: [0, 1.2, 7], offset: [0, 0.6, 0], rotation: [0.3, 0, 0], scale: 1.8 },
  },
  {
    id: 'contacto',
    shape: 'monogram',
    desktop: { camera: [0, 0, 5.2], offset: [1.25, 0.15, 0], rotation: [0, -0.18, 0], scale: 1.45 },
    mobile: { camera: [0, 0, 6], offset: [0, 1.1, 0], rotation: [0, -0.1, 0], scale: 0.9 },
  },
];

/** Written by the scroll tracker, read every frame by the scene. Plain object: no re-renders. */
export const scrollState = { chapter: 0 };

/** Fraction of a chapter's scroll spent holding its shape before morphing to the next one. */
export const HOLD = 0.55;
