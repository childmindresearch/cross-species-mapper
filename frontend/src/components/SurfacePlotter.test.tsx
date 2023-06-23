// @ts-expect-error because React is a necessary unused import
import React from 'react'
import { act, render, screen } from '@testing-library/react'
import SurfacePlotter, {
  apiSurfaceToPlotlySurface,
  getSurfaces
} from './SurfacePlotter'

// Plotly seems broken in a testing environment.
// Mock it out entirely.
jest.mock('react-plotly.js', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mock-plot'></div>
  }
})

declare const global: {
  fetch: typeof fetch
}

const mockSurface = {
  type: 'mesh3d',
  x: [1, 2, 3],
  y: [4, 5, 6],
  z: [7, 8, 9],
  i: [0, 1, 2],
  j: [1, 2, 0],
  k: [2, 0, 1],
  intensity: [1, 2, 3]
}

describe('Tests for the SurfacePlotter component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('Convert API surface to Plotly', async () => {
    const apiSurface = {
      name: 'mockSurface',
      xCoordinate: mockSurface.x,
      yCoordinate: mockSurface.y,
      zCoordinate: mockSurface.z,
      iFaces: mockSurface.i,
      jFaces: mockSurface.j,
      kFaces: mockSurface.k
    }

    const convertedSurface = apiSurfaceToPlotlySurface(apiSurface, [1, 2, 3])
    expect(convertedSurface).toEqual(mockSurface)
  })

  test('getSurfaces returns the correct data', async () => {
    const mockData = [
      { x: [1, 2, 3], y: [4, 5, 6], z: [7, 8, 9] },
      { x: [10, 11, 12], y: [13, 14, 15], z: [16, 17, 18] }
    ]

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData)
    } as unknown as Response)

    const data = await getSurfaces()

    expect(data).toEqual(mockData)
  })

  test('surfacePlotter renders a plot with the correct data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ fslr_32k_left: mockSurface })
    } as unknown as Response)

    await act(async () => {
      render(<SurfacePlotter />)
    })

    const plotly = screen.getAllByTestId('mock-plot')
    expect(plotly).toHaveLength(1)
  })
})
