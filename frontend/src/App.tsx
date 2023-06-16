import React from 'react'
import './App.css'
import SurfacePlotter from './components/SurfacePlotter'

function App (): JSX.Element {
  return (
    <>
      <h1>Surface Plotter</h1>
      <p>
        This is a simple surface plotter that can read in a surface file and a
        data file and plot them.
      </p>
      <SurfacePlotter />
    </>
  )
}

export default App
