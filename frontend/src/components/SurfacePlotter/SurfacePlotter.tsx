import React, { useEffect, useMemo, useState } from 'react'
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
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useSurfaces, useCrossSpeciesSimilarity, useNimareTerms, usePlotData } from './hooks'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import _ from 'lodash'
import { FaLockOpen, FaLock } from 'react-icons/fa6'

/**
 * A component that plots the surfaces and allows the user to select a vertex to seed the similarity search.
 * @returns A JSX element.
 */
export default function SurfacePlotter (): JSX.Element {
  const [seedVertex, setSeedVertex] = useState<number>(0)
  const [seedSurface, setSeedSurface] = useState<string>('human')
  const [seedSide, setSeedSide] = useState<string>('left')

  const [colorLimits, setColorLimits] = useState<[number, number]>([-1, 2])

  const surfaces = useSurfaces()
  const similarity = useCrossSpeciesSimilarity(seedVertex, seedSurface, seedSide)
  const plotData = usePlotData(surfaces, similarity, colorLimits)
  const nimareTerms = useNimareTerms(seedVertex, seedSurface, seedSide, surfaces)

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
  setSeedVertex: React.Dispatch<React.SetStateAction<number>>
  setSeedSurface: React.Dispatch<React.SetStateAction<string>>
  setSeedSide: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element {
  const [globalCamera, setGlobalCamera] = useState(defaultCamera)
  const [cameraLock, setCameraLock] = useState(true)
  const localCameras: any[] = []
  const setLocalCameras: any[] = []
  const layouts: any[] = []
  for (let i = 0; i < 4; i++) {
    const [letCamera, letSetCamera] = useState(defaultCamera)
    localCameras.push(letCamera)
    setLocalCameras.push(letSetCamera)

    const letLayout = useMemo(() => {
      return _.cloneDeep(defaultLayout)
    }, [])
    layouts.push(letLayout)
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
    const side = (point.data.name as string).includes('left') ? 'left' : 'right'

    props.setSeedVertex(vertex)
    props.setSeedSurface(surface)
    props.setSeedSide(side)
  }

  const onRelayOut = (event: any, setter: any): void => {
    if (event['scene.camera'] != null) {
      setter(event['scene.camera'])
      setGlobalCamera(event['scene.camera'])
    }
  }

  useEffect(() => {
    if (cameraLock) {
      for (let i = 0; i < localCameras.length; i++) {
        setLocalCameras[i](globalCamera)
      }
    }
  }, [cameraLock, globalCamera])

  for (let i = 0; i < 4; i++) {
    if (cameraLock) {
      layouts[i].scene.camera = globalCamera
    } else {
      layouts[i].scene.camera = localCameras[i]
    }
  }

  return (
    <div data-testid='surface-plotter'>
      <Container style={{ marginTop: '10px' }}>
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 1, marginBottom: '-20px' }}>
          {/* @ts-expect-error because the on/off label do accept icon input */}
          <BootstrapSwitchButton
            onlabel={<FaLock size="18" className='pb-1' />}
            offlabel={<FaLockOpen size="18" className='pb-1' />}
            checked={cameraLock}
            onChange={() => { setCameraLock(!cameraLock) }}
            style={{ outline: 'none' }}
            size='sm'
          />
          <Button
            variant='outline-secondary'
            size='sm'
            onClick={() => {
              setGlobalCamera(defaultCamera)
            }}
            style={{ marginLeft: '10px' }} // Add margin to create space
          >Reset Camera</Button>
        </div>
        <Row sm={1} md={2}>
          {props.plotData?.map(
            (surf, index) =>
              surf != null && (
                <Col key={index}>
                  <Plot
                    key={index}
                    data={[surf]}
                    layout={layouts[index]}
                    config={defaultConfig}
                    onRelayout={(e: any) => { onRelayOut(e, setLocalCameras[index]) }}
                    onClick={(e: any) => { onClick(e) }}
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
