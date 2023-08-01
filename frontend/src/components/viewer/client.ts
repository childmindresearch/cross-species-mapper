import type { Surface } from '@cmi-dair/brainviewer/src/brainViewer'
import { ViewerClient } from '@cmi-dair/brainviewer/src/viewer'
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import { speciesScale } from './constants'

export class Viewer {
  private readonly div: HTMLElement
  private readonly surface: Surface
  private readonly width: number
  private readonly height: number

  readonly species: string
  readonly side: string

  public viewer: ViewerClient

  constructor (div: HTMLElement, surface: Surface, species: string, side: string, width: number = 450, height: number = 300) {
    this.div = div
    this.surface = surface
    this.species = species
    this.side = side
    this.width = width
    this.height = height
    this.viewer = new ViewerClient(this.div, this.surface)
  }

  plot (): void {
    this.viewer.setModel(this.surface.mesh, this.surface.colors)

    this.viewer.controls.minDistance = 30
    this.viewer.controls.maxDistance = 300
    this.viewer.setAlpha(0)
    this.viewer.renderer.setSize(this.width, this.height)

    this.resetCamera()
    this.viewer.onWindowResize() // Prevents faulty aspect ratio on first load.

    this.viewer.controls.mouseButtons = {
      left: CameraControls.ACTION.ROTATE,
      middle: CameraControls.ACTION.NONE,
      right: CameraControls.ACTION.NONE,
      wheel: CameraControls.ACTION.NONE
    }
  }

  resetCamera (): void {
    this.viewer.setTarget('center')
    const target = this.viewer.controls.getTarget(new THREE.Vector3())

    const distance = speciesScale[this.species] * 180
    const multiplier = this.side === 'left' ? -1 : 1

    void this.viewer.controls.setPosition(target.x + distance * multiplier, target.y, target.z)
  }

  getSpecies (): string {
    return this.species
  }

  getSide (): string {
    return this.side
  }
}
