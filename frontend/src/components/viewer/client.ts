import type { Surface } from '@cmi-dair/brainviewer/lib/brainViewer'
import type { ColorInterpolateName } from '@cmi-dair/brainviewer/lib/colormaps/d3ColorSchemes'
import { ViewerClient } from '@cmi-dair/brainviewer'
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import { speciesScale } from './constants'

export class Viewer {
  private readonly div: HTMLElement
  private readonly width: number
  private readonly height: number
   
  readonly surface: Surface
  readonly species: string
  readonly side: string
  readonly colorLimits: [number, number] = [-1, 2]
  readonly colorMap: ColorInterpolateName = 'Turbo'

  public viewer: ViewerClient

  constructor (div: HTMLElement, surface: Surface, species: string, side: string, width: number = 450, height: number = 300) {
    this.div = div
    this.surface = surface
    this.species = species
    this.side = side
    this.width = width
    this.height = height
    this.viewer = new ViewerClient(this.div)
    this.viewer.addModel(surface)
  }

  plot (): void {
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

    this.viewer.controls.touches = {
      one: CameraControls.ACTION.TOUCH_ROTATE,
      two: CameraControls.ACTION.NONE,
      three: CameraControls.ACTION.NONE
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
