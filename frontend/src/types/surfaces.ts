export default interface ApiSurface {
  name: string
  xCoordinate: number[]
  yCoordinate: number[]
  zCoordinate: number[]
  iFaces: number[]
  jFaces: number[]
  kFaces: number[]
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
