import type { ApiSurface, CrossSpeciesSimilarityResponse } from '../types/api'

const API_URL: string = 'http://localhost:8000'

const Endpoints = {
  getHemispheres: `${API_URL}/surfaces/hemispheres`,
  getCrossSpeciesSimilarity: `${API_URL}/features/cross_species`,
  getNimareTerms: `${API_URL}/features/nimare`
}

/**
 * Fetches the surface data for all surfaces.
 * @param species The species to fetch surfaces for.
 * @param side The side to fetch surfaces for.
 * @returns A Promise that resolves to an ApiSurfaceResponse object.
 */
export async function getSurfaces (species: string, side: string): Promise<ApiSurface> {
  const response = await fetch(`${Endpoints.getHemispheres}?species=${species}&side=${side}`)
  return await response.json()
}

/**
 * Fetches the similarity data for a given vertex on a surface.
 *
 * @param species - The species of the surface.
 * @param side - The side of the surface.
 * @param vertex - The vertex index on the surface.
 * @returns A Promise that resolves to a SimilarityResponse object.
 */
export async function getCrossSpeciesSimilarity (
  species: string,
  side: string,
  vertex: number
): Promise<CrossSpeciesSimilarityResponse> {
  const response = await fetch(
    `${Endpoints.getCrossSpeciesSimilarity}?seed_species=${species}&seed_side=${side}&seed_vertex=${vertex}`
  )
  return await response.json()
}
