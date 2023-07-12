// @ts-expect-error because React is a necessary unused import
import React from 'react'
import './App.css'
import SurfacePlotter from './components/SurfacePlotter/SurfacePlotter'
import Header from './components/Header'
import Introduction from './components/Introduction'

function App (): JSX.Element {
  return (
    <div>
      <Header />
      <Introduction />
      <SurfacePlotter />
    </div>
  )
}

export default App
