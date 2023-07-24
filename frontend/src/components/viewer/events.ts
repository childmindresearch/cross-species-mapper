import { MeshColors } from "brainviewer/src/brainViewer";
import { getCrossSpeciesSimilarity } from "../../api/fetcher";
import type { LocalClient } from "./client";
import * as THREE from "three";

export async function onDoubleClick(
      event: any,
      clients: LocalClient[],
      clickedSpecies: string,
      clickedSide: string
    ) {
      if (event.intersects === undefined) {
        return;
      }
      const vertex = event.intersects.face.a;
      const similarities = await getCrossSpeciesSimilarity(
        clickedSpecies,
        clickedSide,
        vertex
      ).then((data) => {
        return data;
      });

      for (const client of clients) {
        const similarity = similarities[client.species + "_" + client.side];
        const mesh = new MeshColors(similarity, "Turbo", [-1, 2]);
        client.setModel(undefined, mesh);
      }
    }

export async function onUpdate(
    event: any,
    triggeringClient: LocalClient,
    clients: LocalClient[],
) {
  const newPosition = triggeringClient.controls.getPosition(new THREE.Vector3)
  for (const client of clients) {
    if (client.controls.getPosition(new THREE.Vector3) !== newPosition) {
      client.controls.setPosition(newPosition.x, newPosition.y, newPosition.z);
    }
  }
  
}
