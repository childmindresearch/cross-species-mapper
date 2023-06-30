// @ts-expect-error because react not used.
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import {
  type ApiSurface,
  type PlotlySurface,
  type ApiSurfaceResponse,
  type CrossSpeciesSimilarityResponse,
  type NiMareResponse
} from '../types/surfaces'
import { Endpoints } from '../constants/api'
import Slider from './Slider'

/**
 * A component that plots the surfaces and allows the user to select a vertex to seed the similarity search.
 * @returns A JSX element.
 */
export default function SurfacePlotter (): JSX.Element {
  const [surfaces, setSurfaces] = useState<ApiSurfaceResponse | undefined>(
    undefined
  )
  const [seedVertex, setSeedVertex] = useState<number>(0)
  const [seedSurface, setSeedSurface] = useState<string>('human')
  const [seedSide, setSeedSide] = useState<string>('left')
  const [nimareTerms, setNimareTerms] = useState<NiMareResponse | undefined>(
    undefined
  )
  const [similarity, setSimilarity] = useState<
  CrossSpeciesSimilarityResponse | undefined
  >(undefined)
  const [camera, setCamera] = useState(defaultCamera)
  const [plotData, setPlotData] = useState<PlotlySurface[] | undefined>(
    undefined
  )
  const [colorLimits, setColorLimits] = useState<[number, number]>([0, 1])

  // Fetch surfaces on first render.
  useEffect(() => {
    getSurfaces()
      .then((surf) => {
        setSurfaces(surf)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // On seed change, fetch new similarity data.
  useEffect(() => {
    getCrossSpeciesSimilarity(seedSurface, seedSide, seedVertex)
      .then((sim) => {
        setSimilarity(sim)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [seedVertex, seedSurface, seedSide])

  // On seed change, fetch new NiMare terms.
  useEffect(() => {
    if (surfaces == null) {
      return
    }
    let targetSurface: ApiSurface = surfaces.human_left
    if (seedSide === 'right') {
      targetSurface = surfaces.human_right
    }
    getNimareTerms(targetSurface, seedVertex)
      .then((nimare) => {
        setNimareTerms(nimare)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [seedVertex, seedSurface, seedSide])

  // Re-plot surfaces when surfaces or similarity data changes.
  useEffect(() => {
    if (surfaces == null || similarity == null) {
      return
    }

    const humanLeft = apiSurfaceToPlotlySurface(
      surfaces.human_left,
      similarity.human_left,
      colorLimits
    )
    const humanRight = apiSurfaceToPlotlySurface(
      surfaces.human_right,
      similarity.human_right,
      colorLimits
    )
    const macaqueLeft = apiSurfaceToPlotlySurface(
      surfaces.macaque_left,
      similarity.macaque_left,
      colorLimits
    )
    const macaqueRight = apiSurfaceToPlotlySurface(
      surfaces.macaque_right,
      similarity.macaque_right,
      colorLimits
    )
    if (
      humanLeft == null ||
      humanRight == null ||
      macaqueLeft == null ||
      macaqueRight == null
    ) {
      return
    }

    setPlotData([humanLeft, humanRight, macaqueLeft, macaqueRight])
  }, [surfaces, similarity, colorLimits])

  const onRelayout = (event: any): void => {
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
    const surface = (point.data.name as string).includes('human')
      ? 'human'
      : 'macaque'
    const side = (point.data.name as string).includes('left')
      ? 'left'
      : 'right'

    setSeedVertex(vertex)
    setSeedSurface(surface)
    setSeedSide(side)
  }

  const layout = defaultLayout
  layout.scene.camera = camera

  return (
    <>
      <Slider values={colorLimits} setValues={setColorLimits} min={-3} max={3} step={0.2}/>
      <div className="grid-container">
        {nimareTerms != null
          ? (
          <div className="grid-item">
            <h2>Terms</h2>
            <ul>
              {nimareTerms.features.map(
                (term, index) =>
                  index < 10 && (
                    <li key={index}>
                      {term.name}: {term.correlation}
                    </li>
                  )
              )}
            </ul>
          </div>
            )
          : (
          <div>Loading terms...</div>
            )}
        {plotData != null
          ? (
              plotData.map(
                (surf, index) =>
                  surf != null && (
                <Plot
                  key={index}
                  data={[surf]}
                  layout={{ name: surf.name, ...layout }}
                  config={defaultConfig}
                  onRelayout={onRelayout}
                  onClick={onClick}
                />
                  )
              )
            )
          : (
          <div>Loading...</div>
            )}
      </div>
    </>
  )
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

/**
 * Fetches the NiMare terms for a given vertex on a surface.
 *
 * @param surface - The API surface object.
 * @param vertex - The vertex index on the surface.
 * @returns A Promise that resolves to a SimilarityResponse object.
 */
export async function getNimareTerms (
  surface: ApiSurface,
  vertex: number
): Promise<NiMareResponse> {
  const coordinates = {
    x: surface.xCoordinate[vertex],
    y: surface.yCoordinate[vertex],
    z: surface.zCoordinate[vertex]
  }
  const response = await fetch(
    `${Endpoints.getNimareTerms}?x=${coordinates.x}&y=${coordinates.y}&z=${coordinates.z}`
  )
  return await response.json()
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
  intensity: number[],
  colorLimits: number[]
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
    showscale: true,
    intensity,
    cmin: colorLimits[0],
    cmax: colorLimits[1]
  }
}

const defaultCamera = {
  eye: {
    x: -3,
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

const defaultLayout = {
  scene: {
    camera: {},
    xaxis: {
      title: '',
      showgrid: false,
      zeroline: false,
      showticklabels: false
    },
    yaxis: {
      title: '',
      showgrid: false,
      zeroline: false,
      showticklabels: false
    },
    zaxis: {
      title: '',
      showgrid: false,
      zeroline: false,
      showticklabels: false
    }
  },
  width: 400,
  height: 400,
  margin: {
    l: 20,
    r: 20,
    b: 0,
    t: 0
  },
  coloraxis: {
    cmax: -5,
    cmin: -10
  }
}

const defaultConfig = {
  displaylogo: false
}
