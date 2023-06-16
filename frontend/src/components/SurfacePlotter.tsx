import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { type ApiSurface, type PlotlySurface } from '../types/surfaces'
import { Endpoints } from '../constants/api'

export async function getSurfaces (): Promise<ApiSurface> {
  const response = await fetch(Endpoints.getHemispheres)
  const data = await response.json()
  return data
}

export function apiSurfaceToPlotlySurface (
  apiSurface: ApiSurface | undefined,
  intensity: number[]
): PlotlySurface {
  return {
    type: 'mesh3d',
    x: apiSurface?.xCoordinate,
    y: apiSurface?.yCoordinate,
    z: apiSurface?.zCoordinate,
    i: apiSurface?.iFaces,
    j: apiSurface?.jFaces,
    k: apiSurface?.kFaces,
    intensity
  }
}

export function createPlot (
  data: PlotlySurface,
  handleClick: (event: any) => void
): JSX.Element {
  // Kept separate for ease of testing.
  return (
    <Plot
      data={[data]}
      layout={{ title: 'A Fancy Plot' }}
      onClick={handleClick}
      showscale={false}
    />
  )
}

export default function SurfacePlotter (): JSX.Element {
  const [surface, setSurface] = useState<ApiSurface | undefined>(undefined)
  useEffect(() => {
    getSurfaces()
      .then((surf) => {
        setSurface(surf.fslr_32k_left)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleClick = (event: any): void => {
    console.log(event)
  }

  const intensity = Array.from({ length: 32492 }, (_, i) => i + 1)
  const data = apiSurfaceToPlotlySurface(surface, intensity)
  return createPlot(data, handleClick)
}
