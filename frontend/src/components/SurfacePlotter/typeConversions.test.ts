import { defaultLighting } from './config'
import { apiSurfaceToPlotlySurface } from './typeConversions'

describe('apiSurfaceToPlotlySurface', () => {
  test('converts ApiSurface to PlotlySurface', () => {
    const apiSurface = {
      name: 'Surface 1',
      xCoordinate: [0, 1, 2],
      yCoordinate: [0, 1, 2],
      zCoordinate: [0, 1, 2],
      iFaces: [0, 1, 2],
      jFaces: [1, 2, 0],
      kFaces: [2, 0, 1]
    }
    const intensity = [0.1, 0.2, 0.3]
    const colorLimits = [-1, 1]

    const expectedPlotlySurface = {
      name: 'Surface 1',
      type: 'mesh3d',
      x: [0, 1, 2],
      y: [0, 1, 2],
      z: [0, 1, 2],
      i: [0, 1, 2],
      j: [1, 2, 0],
      k: [2, 0, 1],
      showscale: true,
      intensity: [0.1, 0.2, 0.3],
      cmin: -1,
      cmax: 1,
      colorscale: 'Jet',
      colorbar: {
        len: 0.5,
        thickness: 10
      },
      lighting: {
        ...defaultLighting
      }
    }

    const plotlySurface = apiSurfaceToPlotlySurface(apiSurface, intensity, colorLimits)

    expect(plotlySurface).toEqual(expectedPlotlySurface)
  })

  test('returns undefined when intensity is undefined', () => {
    const apiSurface = {
      name: 'Surface 1',
      xCoordinate: [0, 1, 2],
      yCoordinate: [0, 1, 2],
      zCoordinate: [0, 1, 2],
      iFaces: [0, 1, 2],
      jFaces: [1, 2, 0],
      kFaces: [2, 0, 1]
    }

    const intensity = undefined
    const colorLimits = [-1, 1]

    const plotlySurface = apiSurfaceToPlotlySurface(apiSurface, intensity, colorLimits)

    expect(plotlySurface).toBeUndefined()
  })
})
