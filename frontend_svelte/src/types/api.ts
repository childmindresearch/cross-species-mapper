export interface NiMareFeature {
  name: string
  correlation: number
}

export interface NiMareResponse {
  features: NiMareFeature[]
}

export interface CrossSpeciesSimilarityResponse {
  [key: string]: number[]
  human_left: number[]
  human_right: number[]
  macaque_left: number[]
  macaque_right: number[]
}

export interface ApiSurface {
  name: string
  vertices: number[][]
  faces: number[][]
}

export interface ApiSurfaceResponse {
  [key: string]: ApiSurface
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
  showscale?: boolean
  cmin?: number
  cmax?: number
  colorscale?: string
  colorbar?: any
  lighting?: any
  flatshading?: boolean
  vertexnormals?: any
}
