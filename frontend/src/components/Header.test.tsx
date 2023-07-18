// @ts-expect-error because react not used.
import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders the header component correctly', () => {
    render(<Header />)

    const headerTitle = screen.getByText('Cross Species Mapper')
    const githubLink = screen.getByText('Webapp')
    const dataLink = screen.getByText('Data')
    const publicationLink = screen.getByText('Publication')

    expect(headerTitle).toBeDefined()
    expect(githubLink).toHaveProperty('href', 'https://github.com/cmi-dair/cross-species-mapper')
    expect(dataLink).toHaveProperty('href', 'https://github.com/TingsterX/alignment_macaque-human')
    expect(publicationLink).toHaveProperty('href', 'https://www.sciencedirect.com/science/article/pii/S1053811920308326')
  })
})
