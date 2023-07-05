// @ts-expect-error because react not used.
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import {
  type ApiSurface,
  type PlotlySurface,
  type ApiSurfaceResponse,
  type CrossSpeciesSimilarityResponse,
  type NiMareResponse,
  type NiMareFeature
} from '../../types/surfaces'
import { getCrossSpeciesSimilarity, getNimareTerms, getSurfaces } from '../../api/fetcher'
import Slider from '../Slider'
import { defaultCamera, defaultLayout, defaultConfig } from './config'

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
    const fetchSurfaces = async (): Promise<void> => {
      const surfacesObject: ApiSurfaceResponse = {
        human_left: await getSurfaces('human', 'left').then((surface) => surface),
        human_right: await getSurfaces('human', 'right').then((surface) => surface),
        macaque_left: await getSurfaces('macaque', 'left').then((surface) => surface),
        macaque_right: await getSurfaces('macaque', 'right').then((surface) => surface)
      }
      setSurfaces(surfacesObject)
    }
    void fetchSurfaces()
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
    const hemispheres = ['human_left', 'human_right', 'macaque_left', 'macaque_right']
    setPlotData(hemispheres.map((surfaceName) => {
      return apiSurfaceToPlotlySurface(surfaces[surfaceName], similarity[surfaceName], colorLimits)
    }))
  }, [surfaces, similarity, colorLimits])

  const onRelayout = (event: any): void => {
    if (event['scene.camera'] != null) {
      setCamera(event['scene.camera'])
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
          ? <TermBlock features={nimareTerms.features} />
          : (<div>Loading terms...</div>)}
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
 * A component that displays a list of NiMare features as terms.
 * @param props - The component props containing an array of NiMare features.
 * @returns A JSX element.
 */
function TermBlock (props: { features: NiMareFeature[] }): JSX.Element {
  return (
    <div>
      <h2>Terms</h2>
      <ul>
        {props.features.map(
          (term, index) =>
            index < 10 && (
              <li key={index}>
                {term.name}: {term.correlation.toFixed(3)}
              </li>
            )
        )}
      </ul>
    </div>
  )
}

/**
 * Converts an ApiSurface object to a PlotlySurface object.
 * @param apiSurface - The ApiSurface object to convert.
 * @param intensity - The intensity values for the surface.
 * @returns A PlotlySurface object.
 */
export function apiSurfaceToPlotlySurface<T extends ApiSurface | undefined> (
  apiSurface: T,
  intensity: number[],
  colorLimits: number[]
): T extends undefined ? undefined : PlotlySurface {
  let plotlySurface: PlotlySurface | undefined
  if (apiSurface !== undefined) {
    plotlySurface = {
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
  return plotlySurface as T extends undefined ? undefined : PlotlySurface
}
