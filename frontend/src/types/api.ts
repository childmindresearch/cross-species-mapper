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
