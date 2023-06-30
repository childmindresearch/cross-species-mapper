import React from 'react'
import { Range, getTrackBackground } from 'react-range'

/**
 * Props for the Slider component.
 */
interface SliderProps {
  values: any
  setValues: any
  min: number
  max: number
  step: number
  onMouseDown?: any
  onTouchStart?: any
  style?: any
  ref?: any
  key?: any
}

/**
 * A slider component that allows the user to select a range of values.
 * @param {SliderProps} props - The props for the Slider component.
 * @returns {JSX.Element} - A JSX Element representing the Slider component.
 */
function Slider (props: SliderProps): JSX.Element {
  const [localValues, setLocalValues] = React.useState(props.values)

  // Set local values because there are different props interfering with each other.
  const min = props.min
  const max = props.max

  function onChange (values: any): void {
    if (values[0] >= values[1]) {
      return
    }
    setLocalValues(values)
  }

  return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '30px 0' }}>
        <Range
            step={props.step}
            min={props.min}
            max={props.max}
            allowOverlap={false}
            values={localValues}
            onChange={onChange}
            onFinalChange={(values) => { props.setValues(values) }}
            renderTrack={({ props, children }) => (
                <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: '36px',
                  display: 'flex',
                  width: '100%'
                }}
                >
                <div
                    ref={props.ref}
                    style={{
                      height: '5px',
                      width: '100%',
                      borderRadius: '4px',
                      background: getTrackBackground({
                        values: localValues,
                        colors: ['#cccccc', '#548BF4', '#cccccc'],
                        min,
                        max
                      }),
                      alignSelf: 'center'
                    }}
                >
                    {children}
                </div>
                </div>
            )}
            renderThumb={({ props }) => (
          <>
            <div
              {...props}
              id='.slider-thumb'
              key={'slider-thumb-' + String(props.key)}
              style={{
                ...props.style,
                height: '40px',
                width: '40px',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#548BF4',
                zIndex: 5
              }}
            >
              {localValues[props.key]}
            </div>
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '5px',
                borderRadius: '4px',
                backgroundColor: '#cccccc',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            />
          </>
            )}
        />
    </div>
  )
}

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1
}

export default Slider
