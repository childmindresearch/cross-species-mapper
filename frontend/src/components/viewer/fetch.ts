import { MeshColors, Surface, SurfaceMesh } from 'brainviewer/src/brainViewer'
import type { ApiSurface } from '../../types/api'
import { getCrossSpeciesSimilarity, getSurfaces } from '../../api/fetcher'

function apiSurface2ViewerSurface (apiSurface: ApiSurface): SurfaceMesh {
  return new SurfaceMesh(
    new Float32Array(apiSurface.vertices.flat()),
    new Uint32Array(apiSurface.faces.flat())
  )
}

export async function getData (): Promise<Record<string, Surface>> {
  const surfaceMeshes = {
    human_left: apiSurface2ViewerSurface(await getSurfaces('human', 'left')),
    human_right: apiSurface2ViewerSurface(
      await getSurfaces('human', 'right')
    ),
    macaque_left: apiSurface2ViewerSurface(
      await getSurfaces('macaque', 'left')
    ),
    macaque_right: apiSurface2ViewerSurface(
      await getSurfaces('macaque', 'right')
    )
  }

  const meshColors = await getCrossSpeciesSimilarity('human', 'left', 1).then(
    (data) => {
      return {
        human_left: new MeshColors(data.human_left, 'Turbo', [-1, 2]),
        human_right: new MeshColors(data.human_right, 'Turbo', [-1, 2]),
        macaque_left: new MeshColors(data.macaque_left, 'Turbo', [-1, 2]),
        macaque_right: new MeshColors(data.macaque_right, 'Turbo', [-1, 2])
      }
    }
  )

  const surfaces = {
    human_left: new Surface(surfaceMeshes.human_left, meshColors.human_left),
    human_right: new Surface(
      surfaceMeshes.human_right,
      meshColors.human_right
    ),
    macaque_left: new Surface(
      surfaceMeshes.macaque_left,
      meshColors.macaque_left
    ),
    macaque_right: new Surface(
      surfaceMeshes.macaque_right,
      meshColors.macaque_right
    )
  }

  return surfaces
}
