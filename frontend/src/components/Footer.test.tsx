// @ts-expect-error because react not used.
import React from 'react'
import { render } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the footer component correctly', () => {
    const companyName = 'Example Company'
    const { getByText } = render(<Footer companyName={companyName} />)
    const copyrightText = getByText(`© ${new Date().getFullYear()} ${companyName}`)

    expect(copyrightText).toBeDefined()
  })
})
