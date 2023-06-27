export interface SimilarityResponse {
  human_left: number[]
  human_right: number[]
  macaque_left: number[]
  macaque_right: number[]
}

export interface ApiSurface {
  name: string
  xCoordinate: number[]
  yCoordinate: number[]
  zCoordinate: number[]
  iFaces: number[]
  jFaces: number[]
  kFaces: number[]
}

export interface ApiSurfaceResponse {
  human_left: ApiSurface
  human_right: ApiSurface
  macaque_left: ApiSurface
  macaque_right: ApiSurface
}

export interface PlotlySurface {
  name: string
  type: string
  x: number[]
  y: number[]
  z: number[]
  i: number[]
  j: number[]
  k: number[]
  intensity: number[]
}
