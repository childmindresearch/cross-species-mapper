import {
  type ApiSurface,
  type PlotlySurface
} from '../../types/surfaces'
import { defaultLighting } from './config'

/**
 * Converts an ApiSurface object to a PlotlySurface object.
 * @param apiSurface - The ApiSurface object to convert.
 * @param intensity - The intensity values for the surface.
 * @returns A PlotlySurface object.
 */

export function apiSurfaceToPlotlySurface<T extends ApiSurface | undefined> (
  apiSurface: T | undefined,
  intensity: number[] | undefined,
  colorLimits: number[]
): T extends undefined ? undefined : PlotlySurface {
  let plotlySurface: PlotlySurface | undefined
  if (apiSurface !== undefined && intensity !== undefined) {
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
      cmax: colorLimits[1],
      colorscale: 'Jet',
      colorbar: {
        len: 0.5,
        thickness: 10
      },
      lighting: defaultLighting
    }
  }
  return plotlySurface as T extends undefined ? undefined : PlotlySurface
}
