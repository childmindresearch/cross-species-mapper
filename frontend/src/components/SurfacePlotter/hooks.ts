// Contains surfaces hooks of the surfaceplotter.
import { useEffect, useState } from 'react'
import { type CrossSpeciesSimilarityResponse, type ApiSurfaceResponse, type NiMareResponse, type PlotlySurface } from '../../types/surfaces'
import { getCrossSpeciesSimilarity, getNimareTerms, getSurfaces } from '../../api/fetcher'
import { apiSurfaceToPlotlySurface } from './typeConversions'

const HEMISPHERES = [
  'human_left',
  'human_right',
  'macaque_left',
  'macaque_right'
]

/**
 * Custom React hook that fetches and returns the surfaces for human and macaque
 * brains.
 * @returns {ApiSurfaceResponse | undefined} The surfaces for human and macaque
 *      brains or undefined if the surfaces have not been fetched yet.
 */
export const useSurfaces = (): ApiSurfaceResponse | undefined => {
  const [surfaces, setSurfaces] = useState<ApiSurfaceResponse | undefined>(undefined)

  useEffect(() => {
    const fetchSurfaces = async (): Promise<void> => {
      const surfacesObject: ApiSurfaceResponse = {
        human_left: await getSurfaces('human', 'left').then(surface => surface),
        human_right: await getSurfaces('human', 'right').then(
          surface => surface
        ),
        macaque_left: await getSurfaces('macaque', 'left').then(
          surface => surface
        ),
        macaque_right: await getSurfaces('macaque', 'right').then(
          surface => surface
        )
      }
      setSurfaces(surfacesObject)
    }
    void fetchSurfaces()
  }, [])

  return surfaces
}

/**
 * Custom React hook that fetches and returns the cross-species similarity for a given
 * seed vertex, surface, and side.
 * @param {number} seedVertex - The seed vertex.
 * @param {string} seedSurface - The seed surface.
 * @param {string} seedSide - The seed side.
 * @returns {CrossSpeciesSimilarityResponse | undefined} The cross-species similarity for the
 *      given seed vertex, surface, and side or undefined if the similarity has not been fetched yet.
 */
export const useCrossSpeciesSimilarity = (seedVertex: number, seedSurface: string, seedSide: string): CrossSpeciesSimilarityResponse | undefined => {
  const [similarity, setSimilarity] = useState<CrossSpeciesSimilarityResponse | undefined>(undefined)
  useEffect(() => {
    getCrossSpeciesSimilarity(seedSurface, seedSide, seedVertex)
      .then(sim => {
        setSimilarity(sim)
      })
      .catch(err => {
        console.log(err)
      })
  }, [seedVertex, seedSurface, seedSide])

  return similarity
}

/**
 * Custom React hook that fetches and returns the NiMare terms for a given
 * seed vertex, surface, and side.
 * @param {number} seedVertex - The seed vertex.
 * @param {string} seedSurface - The seed surface.
 * @param {string} seedSide - The seed side.
 * @param {ApiSurfaceResponse | undefined} surfaces - The surfaces for human and macaque
 *      brains or undefined if the surfaces have not been fetched yet.
 * @returns {NiMareResponse | undefined} The NiMare terms for the given seed vertex,
 *      surface, and side or undefined if the terms have not been fetched yet.
 */
export const useNimareTerms = (seedVertex: number, seedSurface: string, seedSide: string, surfaces: ApiSurfaceResponse | undefined): NiMareResponse | undefined => {
  const [nimareTerms, setNimareTerms] = useState<NiMareResponse | undefined>(undefined)

  useEffect(() => {
    if (surfaces == null) {
      return
    }
    getNimareTerms(surfaces[`${seedSurface}_${seedSide}`], seedVertex)
      .then(terms => {
        setNimareTerms(terms)
      })
      .catch(err => {
        console.log(err)
      })
  }, [seedVertex, seedSurface])

  return nimareTerms
}

/**
 * Custom React hook that takes in surfaces, cross-species similarity, and color limits
 * and returns an array of Plotly surfaces.
 * @param {ApiSurfaceResponse | undefined} surfaces - The surfaces for human and macaque
 *      brains or undefined if the surfaces have not been fetched yet.
 * @param {CrossSpeciesSimilarityResponse | undefined} similarity - The cross-species similarity for the
 *      given seed vertex, surface, and side or undefined if the similarity has not been fetched yet.
 * @param {[number, number]} colorLimits - The color limits for the plot.
 * @returns {PlotlySurface[] | undefined} An array of Plotly surfaces or undefined if the surfaces
 *      or similarity have not been fetched yet.
 */
export const usePlotData = (surfaces: ApiSurfaceResponse | undefined, similarity: CrossSpeciesSimilarityResponse | undefined, colorLimits: [number, number]): PlotlySurface[] | undefined => {
  const [plotData, setPlotData] = useState<PlotlySurface[] | undefined>(undefined)

  useEffect(() => {
    if (surfaces == null || similarity == null) {
      return
    }

    setPlotData(
      HEMISPHERES.map(surfaceName => {
        return apiSurfaceToPlotlySurface(
          surfaces[surfaceName],
          similarity[surfaceName],
          colorLimits
        )
      })
    )
  }, [similarity, colorLimits, surfaces])

  return plotData
}
