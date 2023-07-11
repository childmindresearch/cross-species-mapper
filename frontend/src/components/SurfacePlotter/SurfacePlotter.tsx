import React, { useState } from 'react'
import Plot from 'react-plotly.js'
import {
  type PlotlySurface,
  type NiMareFeature
} from '../../types/surfaces'
import Slider from '../Slider'
import {
  defaultCamera,
  defaultLayout,
  defaultConfig
} from './config'
import { Col, Container, Row } from 'react-bootstrap'
import { onPlotlyClick, onPlotlyRelayout } from './handlers'
import { useSurfaces, useCrossSpeciesSimilarity, useNimareTerms, usePlotData } from './hooks'

/**
 * A component that plots the surfaces and allows the user to select a vertex to seed the similarity search.
 * @returns A JSX element.
 */
export default function SurfacePlotter (): JSX.Element {
  const [seedVertex, setSeedVertex] = useState<number>(0)
  const [seedSurface, setSeedSurface] = useState<string>('human')
  const [seedSide, setSeedSide] = useState<string>('left')

  const [colorLimits, setColorLimits] = useState<[number, number]>([-1, 2])
  const [camera, setCamera] = useState(defaultCamera)

  const surfaces = useSurfaces()
  const similarity = useCrossSpeciesSimilarity(seedVertex, seedSurface, seedSide)
  const plotData = usePlotData(surfaces, similarity, colorLimits)
  const nimareTerms = useNimareTerms(seedVertex, seedSurface, seedSide, surfaces)

  const layout = defaultLayout
  layout.scene.camera = camera

  return (
    <>
    <div data-testid='slider'>
      <Slider
        values={colorLimits}
        setValues={setColorLimits}
        min={-4}
        max={4}
        step={0.2}
        data-testid='slider'
      />
    </div>
    <div data-testid='plotly'>
     <PlotlyBlock
        plotData={plotData}
        layout={layout}
        config={defaultConfig}
        setCamera={setCamera}
        setSeedVertex={setSeedVertex}
        setSeedSurface={setSeedSurface}
        setSeedSide={setSeedSide} />
    </div>
    <div data-testid='term-block'>
      <TermBlock features={(nimareTerms)?.features} />
    </div>
    </>
  )
}

export function PlotlyBlock (props: {
  plotData: PlotlySurface[] | undefined
  layout: typeof defaultLayout
  config: typeof defaultConfig
  setCamera: React.Dispatch<React.SetStateAction<typeof defaultCamera>>
  setSeedVertex: React.Dispatch<React.SetStateAction<number>>
  setSeedSurface: React.Dispatch<React.SetStateAction<string>>
  setSeedSide: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element {
  return (
  <div data-testid='surface-plotter'>
    <Container>
      <Row sm={1} md={2} lg={2}>
        {props.plotData?.map(
          (surf, index) =>
            surf != null && (
              <Col key={index}>
                <Plot
                  key={index}
                  data={[surf]}
                  layout={props.layout}
                  config={props.config}
                  onRelayout={(e: any) => { onPlotlyRelayout(e, props.setCamera) }}
                  onClick={(e: any) => { onPlotlyClick(e, props.setSeedVertex, props.setSeedSurface, props.setSeedSide) }}
                  data-testid='plotly-surface'
                />
              </Col>
            )
        )}
      </Row>
    </Container>
    </div>)
}

/**
 * A component that displays a list of NiMare features as terms.
 * @param props - The component props containing an array of NiMare features.
 * @returns A JSX element.
 */
export function TermBlock (props: {
  features: NiMareFeature[] | undefined
}): JSX.Element {
  if (props.features === undefined) {
    return <div>Loading terms...</div>
  }

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
