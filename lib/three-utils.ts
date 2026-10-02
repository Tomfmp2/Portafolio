/**
 * Three.js & R3F Utility Infrastructure
 * Memory cleanup, disposal, Draco decoder setup, and WebGL optimization.
 */
import * as THREE from 'three';

/**
 * Recursively disposes geometries, materials, and textures in a Three.js scene/object
 * to prevent VRAM memory leaks.
 */
export function disposeThreeObject(obj: THREE.Object3D | null | undefined) {
  if (!obj) return;

  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;

      // Dispose geometry
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      // Dispose material(s)
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(mesh.material);
        }
      }
    }
  });

  if (obj.parent) {
    obj.parent.remove(obj);
  }
}

/**
 * Disposes a single Three.js material and all attached textures.
 */
export function disposeMaterial(material: THREE.Material) {
  if (!material) return;

  // Dispose all texture properties on the material
  Object.keys(material).forEach((prop) => {
    const value = (material as unknown as Record<string, unknown>)[prop];
    if (value && typeof value === 'object' && (value as THREE.Texture).isTexture) {
      (value as THREE.Texture).dispose();
    }
  });

  material.dispose();
}

/**
 * Draco & KTX2 decoder paths configuration helpers for Drei / Three.js
 */
export const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';
export const KTX2_DECODER_PATH = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/jsm/libs/basis/';

/**
 * Helper to configure Draco decoder path on useGLTF / DRACOLoader
 */
export function setupDracoDecoder(loader: { setDecoderPath: (path: string) => void }) {
  if (loader && typeof loader.setDecoderPath === 'function') {
    loader.setDecoderPath(DRACO_DECODER_PATH);
  }
}
