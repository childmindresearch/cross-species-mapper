import type { Surface, colorInterpolates } from "@cmi-dair/brainviewer";

export interface ViewerSettings {
  cameraLock: boolean;
  colorLimits: [number, number];
  colorMap: keyof typeof colorInterpolates;
}
export interface SpeciesScale {
  [key: string]: number;
  human: number;
  macaque: number;
}

export interface SurfaceOverload {
  // A temporary solution to the problem of the Surface class not having a way of
  // accessing intensity.
  surface: Surface;
  intensity: number[];
}

export interface SurfaceData {
  human_left: SurfaceOverload;
  human_right: SurfaceOverload;
  macaque_left: SurfaceOverload;
  macaque_right: SurfaceOverload;
}

export interface NeuroQueryTerms {
  terms: string[];
}
