// @ts-expect-error because React is a necessary unused import
import React from 'react'
import './App.css'
import SurfacePlotter from './components/SurfacePlotter/SurfacePlotter'
import Footer from './components/Footer'
import Header from './components/Header'

function App (): JSX.Element {
  return (
    <div>
      <Header title='Surface Plotter' />
      <p>
        This is a simple surface plotter that can read in a surface file and a
        data file and plot them.
      </p>
      <SurfacePlotter />
      <Footer companyName='Child Mind Institute' />
    </div>
  )
}

export default App
