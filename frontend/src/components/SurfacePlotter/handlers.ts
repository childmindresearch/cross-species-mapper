export const onPlotlyClick = (event: any, setSeedVertex: (arg0: any) => void, setSeedSurface: (arg0: string) => void, setSeedSide: (arg0: string) => void): void => {
  const point = event.points[0]
  if (point == null) {
    return
  }

  const vertex = point.pointNumber
  const surface = (point.data.name as string).includes('human')
    ? 'human'
    : 'macaque'
  const side = (point.data.name as string).includes('left') ? 'left' : 'right'

  setSeedVertex(vertex)
  setSeedSurface(surface)
  setSeedSide(side)
}

export const onPlotlyRelayout = (event: any, setCamera: (arg0: any) => void): void => {
  if (event['scene.camera'] != null) {
    setCamera(event['scene.camera'])
  }
}
