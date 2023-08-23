import type { Surface } from "@cmi-dair/brainviewer";

export interface CameraSettings {
  cameraLock: boolean;
}
export interface SpeciesScale {
  [key: string]: number;
  human: number;
  macaque: number;
}

export interface SurfaceData {
  human_left: Surface;
  human_right: Surface;
  macaque_left: Surface;
  macaque_right: Surface;
}

export interface ApiSurface {
  name: string;
  vertices: number[][];
  faces: number[][];
}

export interface ApiSurfaceResponse {
  [key: string]: ApiSurface;
  human_left: ApiSurface;
  human_right: ApiSurface;
  macaque_left: ApiSurface;
  macaque_right: ApiSurface;
}
