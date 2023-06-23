// @ts-expect-error because React is a necessary unused import
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { type ApiSurface, type PlotlySurface, type ApiSurfaceResponse, type SimilarityResponse } from '../types/surfaces'
import { Endpoints } from '../constants/api'

/**
 * Fetches the similarity data for a given vertex on a surface.
 *
 * @param species - The species of the surface.
 * @param side - The side of the surface.
 * @param vertex - The vertex index on the surface.
 * @returns A Promise that resolves to a SimilarityResponse object.
 */
export async function getSimilarity (species: string, side: string, vertex: number): Promise<SimilarityResponse> {
  const response = await fetch(`${Endpoints.getSimilarity}?seed_species=${species}&seed_side=${side}&seed_vertex=${vertex}`)
  const json = await response.json()
  return json
}

/**
 * Fetches the surface data for all surfaces.
 * @returns A Promise that resolves to an ApiSurfaceResponse object.
 */
export async function getSurfaces (): Promise<ApiSurfaceResponse> {
  const species = ['human', 'macaque']
  const side = ['left', 'right']
  const responses = []

  for (const specie of species) {
    for (const hemi of side) {
      responses.push(
        fetch(`${Endpoints.getHemispheres}?species=${specie}&side=${hemi}`)
      )
    }
  }

  const results = await Promise.all(responses)
  const jsons = await Promise.all(results.map(async (res) => await res.json()))

  return {
    human_left: jsons[0],
    human_right: jsons[1],
    macaque_left: jsons[2],
    macaque_right: jsons[3]
  }
}

/**
 * Converts an ApiSurface object to a PlotlySurface object.
 * @param apiSurface - The ApiSurface object to convert.
 * @param intensity - The intensity values for the surface.
 * @returns A PlotlySurface object.
 */
export function apiSurfaceToPlotlySurface (
  apiSurface: ApiSurface | undefined,
  intensity: number[]
): PlotlySurface | undefined {
  if (apiSurface == null) {
    return undefined
  }
  return {
    name: apiSurface.name,
    type: 'mesh3d',
    x: apiSurface.xCoordinate,
    y: apiSurface.yCoordinate,
    z: apiSurface.zCoordinate,
    i: apiSurface.iFaces,
    j: apiSurface.jFaces,
    k: apiSurface.kFaces,
    intensity
  }
}

const defaultCamera = {
  eye: {
    x: -2,
    y: 0,
    z: 0
  },
  up: {
    x: 0,
    y: 0,
    z: 1
  },
  center: {
    x: 0,
    y: 0,
    z: 0
  }
}

/**
 * A component that plots the surfaces and allows the user to select a vertex to seed the similarity search.
 * @returns A JSX element.
 */
export default function SurfacePlotter (): JSX.Element {
  const [surfaces, setSurfaces] = useState<ApiSurfaceResponse | undefined>(undefined)
  const [seedVertex, setSeedVertex] = useState<number>(0)
  const [seedSurface, setSeedSurface] = useState<string>('human')
  const [seedSide, setSeedSide] = useState<string>('left')
  const [similarity, setSimilarity] = useState<SimilarityResponse | undefined>(undefined)
  const [camera, setCamera] = useState(defaultCamera)
  const [plotData, setPlotData] = useState<PlotlySurface[] | undefined>(undefined)

  useEffect(() => {
    getSurfaces()
      .then(surf => {
        setSurfaces(surf)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    getSimilarity(seedSurface, seedSide, seedVertex)
      .then(sim => {
        setSimilarity(sim)
      })
      .catch(err => {
        console.log(err)
      })
  }, [seedVertex, seedSurface, seedSide])

  useEffect(() => {
    if (surfaces == null || similarity == null) {
      return
    }

    const humanLeft = apiSurfaceToPlotlySurface(surfaces.human_left, similarity.human_left)
    const humanRight = apiSurfaceToPlotlySurface(surfaces.human_right, similarity.human_right)
    const macaqueLeft = apiSurfaceToPlotlySurface(surfaces.macaque_left, similarity.macaque_left)
    const macaqueRight = apiSurfaceToPlotlySurface(surfaces.macaque_right, similarity.macaque_right)
    if (humanLeft == null || humanRight == null || macaqueLeft == null || macaqueRight == null) {
      return
    }

    setPlotData([humanLeft, humanRight, macaqueLeft, macaqueRight])
  }, [surfaces, similarity])

  const onRelayout = (event: any): void => {
    console.log(event)
    if (event['scene.camera'] == null) {
      return
    }
    const newCamera = event['scene.camera']

    // Only change camera if the difference is substantial
    if (camera !== newCamera) {
      setCamera(newCamera)
    }
  }

  const onClick = (event: any): void => {
    const point = event.points[0]
    if (point == null) {
      return
    }
    const vertex = point.pointNumber
    const surface = (point.data.name as string).includes('human') ? 'human' : 'macaque'
    const side = (point.data.name as string).includes('left') ? 'left' : 'right'

    setSeedVertex(vertex)
    setSeedSurface(surface)
    setSeedSide(side)
  }

  return (
    <>
      {plotData != null
        ? (
        <>
          {plotData.map(
            (surf, index) =>
              (surf != null) && (
                <Plot
                  key={index}
                  data={[surf]}
                  layout={{ name: surf.name, scene: { camera } }}
                  onRelayout={onRelayout}
                  onClick={onClick}
                />
              )
          )}
        </>
          )
        : (
        <div>Loading...</div>
          )}
    </>
  )
}
