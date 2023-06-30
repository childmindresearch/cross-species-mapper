// @ts-expect-error because react not used.
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header component correctly', () => {
    const title = 'Example Title';
    render(<Header title={title} />);
    
    const headerTitle = screen.getByText(title);
    const githubLink = screen.getByText('GitHub');
    
    expect(headerTitle).toBeDefined();
    expect(githubLink).toHaveProperty('href', 'https://github.com/cmi-dair/cross-species-mapper')
  });
});
