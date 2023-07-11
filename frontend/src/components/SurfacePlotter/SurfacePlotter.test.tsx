// @ts-expect-error because React is a necessary unused import
import React from 'react'
import { render, screen } from '@testing-library/react'
import SurfacePlotter from './SurfacePlotter'
import '@testing-library/jest-dom/extend-expect'

// Plotly seems broken in a testing environment.
// Mock it out entirely.
jest.mock('react-plotly.js', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mock-plot'></div>
  }
})

jest.mock('./hooks', () => ({
  useSurfaces: jest.fn(() => []),
  useCrossSpeciesSimilarity: jest.fn(() => []),
  useNimareTerms: jest.fn(() => []),
  usePlotData: jest.fn(() => []),
}))

describe('SurfacePlotter', () => {
  it('renders the slider', () => {
    render(<SurfacePlotter />)
    const slider = screen.getByTestId('slider')
    expect(slider).toBeInTheDocument()
  })

  it('renders the plotly surface', () => {
    render(<SurfacePlotter />)
    const plotlySurface = screen.getByTestId('surface-plotter')
    expect(plotlySurface).toBeInTheDocument()
  })

  it('renders the term block', () => {
    render(<SurfacePlotter />)
    const termBlock = screen.getByText('Loading terms...')
    expect(termBlock).toBeInTheDocument()
  })
})