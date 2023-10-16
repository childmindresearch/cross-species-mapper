import { similarity } from "./store";
import type { ApiSurface, CrossSpeciesSimilarityResponse } from "./types";
let API_URL: string;
if (process.env.NODE_ENV === "production") {
  API_URL = "/api/v1";
} else {
  API_URL = "http://localhost:8000/api/v1";
}

const Endpoints = {
  getHemispheres: `${API_URL}/surfaces/hemispheres`,
  getCrossSpeciesSimilarity: `${API_URL}/features/cross_species`,
  getNeuroQuery: `${API_URL}/features/neuroquery`,
};

export function getNeuroQuery(species: string, side: string, vertex: number) {
  const url = `${Endpoints.getNeuroQuery}?species=${species}&side=${side}&vertex=${vertex}`;
  return fetch(url).then((response) => response.json());
}

/**
 * Fetches the surface data for all surfaces.
 * @param species The species to fetch surfaces for.
 * @param side The side to fetch surfaces for.
 * @returns A Promise that resolves to an ApiSurfaceResponse object.
 */
export async function getSurfaces(
  species: string,
  side: string,
): Promise<ApiSurface> {
  const url = `${Endpoints.getHemispheres}?species=${species}&side=${side}`;
  return fetch(url).then((response) => response.json());
}

/**
 * Fetches the similarity data for a given vertex on a surface.
 *
 * @param species - The species of the surface.
 * @param side - The side of the surface.
 * @param vertex - The vertex index on the surface.
 * @returns A Promise that resolves to a SimilarityResponse object.
 */
export async function getCrossSpeciesSimilarity(
  species: string,
  side: string,
  vertex: number,
): Promise<CrossSpeciesSimilarityResponse> {
  const url = `${Endpoints.getCrossSpeciesSimilarity}?species=${species}&side=${side}&vertex=${vertex}`;
  const response = await fetch(url).then((response) => response.json());
  similarity.set(response);
  return response;
}
