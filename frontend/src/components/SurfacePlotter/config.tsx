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
    camera: {},
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
  width: 400,
  height: 300,
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  }
}

export const defaultConfig = {
  displaymodebar: false,
  scrollZoom: false
}

export const defaultLighting = {
  ambient: 0.7,
  diffuse: 0.7,
  facenormalsepsilon: 1e-06,
  fresnel: 0.2,
  roughness: 0.0,
  specular: 0.0,
  vertexnormalsepsilon: 1e-12
}
