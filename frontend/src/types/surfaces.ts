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
  fslr_32k_left: ApiSurface
  fslr_32k_right: ApiSurface
}

export interface PlotlySurface {
  type: string
  x: number[]
  y: number[]
  z: number[]
  i: number[]
  j: number[]
  k: number[]
  intensity: number[]
}
