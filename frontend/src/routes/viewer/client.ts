import type { Surface } from "brainviewer/src/brainViewer";
import { ViewerClient } from "brainviewer/src/viewer";
import * as THREE from "three";

export interface LocalClient extends ViewerClient {
    species: string
    side: string
}

export function createClient(div: HTMLElement, surface: Surface, species: string, side: string, width: number=450, height: number=300) {
    const client = new ViewerClient(div, surface);
    client.setModel(surface.mesh, surface.colors);

    client.controls.minDistance = 30;
    client.controls.maxDistance = 300;
    client.setAlpha(0);
    client.renderer.setSize(width, height);
    
    const localClient = client as LocalClient;
    localClient.species = species;
    localClient.side = side;

    localClient.setTarget('center');
    const target = localClient.controls.getTarget(new THREE.Vector3())

    const distance = species == "human" ? 170 : 80;
    const multiplier = side == "left" ? -1 : 1;
    localClient.controls.setPosition(target.x + distance * multiplier, target.y ,target.z);
    console.log(target.x + distance * multiplier, target.y ,target.z)

    return localClient;
}
