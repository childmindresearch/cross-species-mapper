import { API_URL } from './environment'

export const Endpoints = {
  getHemispheres: `${API_URL}/surfaces/hemispheres`,
  getCrossSpeciesSimilarity: `${API_URL}/features/cross_species`,
  getNimareTerms: `${API_URL}/features/nimare`
}
