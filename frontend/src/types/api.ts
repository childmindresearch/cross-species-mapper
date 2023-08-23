export interface CrossSpeciesSimilarityResponse {
  [key: string]: number[];
  human_left: number[];
  human_right: number[];
  macaque_left: number[];
  macaque_right: number[];
}
