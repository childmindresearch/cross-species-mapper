// @ts-expect-error because react not used.
import React from 'react'
import { render } from '@testing-library/react'
import Slider from './Slider'

describe('Slider', () => {
  const values = [20, 80]
  const setValues = jest.fn()
  const min = 0
  const max = 100
  const step = 1

  test('renders Slider component with correct props', () => {
    const { getByText } = render(
        <Slider values={values} setValues={setValues} min={min} max={max} step={step} />
    )

    const sliderElement = getByText('20')
    expect(sliderElement).toBeDefined()
  })
}
)
