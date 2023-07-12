export const defaultCamera = {
  eye: {
    x: -2,
    y: 0,
    z: 0
  },
  up: {
    x: 0,
    y: 0,
    z: 1
  },
  center: {
    x: 0,
    y: 0,
    z: 0
  }
}

export const defaultLayout = {
  scene: {
    camera: defaultCamera,
    xaxis: {
      title: '',
      showgrid: false,
      zeroline: false,
      showticklabels: false
    },
    yaxis: {
      title: '',
      showgrid: false,
      zeroline: false,
      showticklabels: false
    },
    zaxis: {
      title: '',
      showgrid: false,
      zeroline: false,
      showticklabels: false
    }
  },
  hovermode: false,
  width: 360,
  height: 300,
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  }
}

export const defaultConfig = {
  displayModeBar: true,
  scrollZoom: false,
  toImageButtonOptions: {
    format: 'svg'
  }
}

export const defaultLighting = {
  ambient: 0.65,
  diffuse: 0.5,
  facenormalsepsilon: 1e-06,
  fresnel: 0.2,
  roughness: 0.0,
  specular: 0.0,
  vertexnormalsepsilon: 1e-12
}
