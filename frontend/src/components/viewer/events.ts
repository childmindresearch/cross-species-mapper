import { MeshColors } from 'brainviewer/src/brainViewer'
import { getCrossSpeciesSimilarity } from '../../api/fetcher'
import type { Viewer } from './client'
import * as THREE from 'three'
import { speciesScale } from './constants'
import toast from 'svelte-french-toast'

export async function onDoubleClick (
  event: MouseEvent | TouchEvent,
  intersects: THREE.Intersection,
  viewers: Viewer[],
  clickedSpecies: string,
  clickedSide: string
): Promise<void> {
  if (intersects === undefined) {
    return
  }
  const vertex = intersects.face.a
  const similarities = await getCrossSpeciesSimilarity(
    clickedSpecies,
    clickedSide,
    vertex
  ).then((data) => {
    return data
  })

  const allDataIsZero = Object.values(similarities).every(
    (similarity) => similarity.every((value) => value === 0)
  )

  if (allDataIsZero) {
    toast.error('No data available for midline vertices.')
    return
  }

  for (const viewer of viewers) {
    const similarity = similarities[viewer.species + '_' + viewer.side]
    const mesh = new MeshColors(similarity, 'Turbo', [-1, 2])
    viewer.viewer.setModel(undefined, mesh)
  }
}

export async function onUpdate (
  event: any,
  triggeringClient: Viewer,
  clients: Viewer[]
): Promise<void> {
  const newPosition = triggeringClient.viewer.controls.getPosition(new THREE.Vector3())
  for (const client of clients) {
    const sameSide = client.side === triggeringClient.side
    const scale = speciesScale[client.species] / speciesScale[triggeringClient.species]
    const xFlip = sameSide ? 1 : -1

    void client.viewer.controls.setPosition(
      newPosition.x * scale * xFlip,
      newPosition.y * scale,
      newPosition.z * scale
    )
  }
}
