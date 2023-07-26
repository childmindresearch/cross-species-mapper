import { MeshColors } from "brainviewer/src/brainViewer";
import { getCrossSpeciesSimilarity } from "../../api/fetcher";
import type { Viewer } from "./client";
import * as THREE from "three";
import { speciesScale } from "./constants";

export async function onDoubleClick(
      event: any,
      viewers: Viewer[],
      clickedSpecies: string,
      clickedSide: string
    ) {
      if (event.intersects === undefined) {
        return;
      }
      const vertex = event.intersects[0].face.a;
      const similarities = await getCrossSpeciesSimilarity(
        clickedSpecies,
        clickedSide,
        vertex
      ).then((data) => {
        return data;
      });

      for (const viewer of viewers) {
        const similarity = similarities[viewer.species + "_" + viewer.side];
        const mesh = new MeshColors(similarity, "Turbo", [-1, 2]);
        viewer.viewer.setModel(undefined, mesh);
      }
    }

export async function onUpdate(
    event: any,
    triggeringClient: Viewer,
    clients: Viewer[],
) {
  const newPosition = triggeringClient.viewer.controls.getPosition(new THREE.Vector3)
  for (const client of clients) {
    const same_side = client.side === triggeringClient.side;
    const scale = speciesScale[client.species] / speciesScale[triggeringClient.species]
    const x_flip = same_side ? 1 : -1;

    client.viewer.controls.setPosition(
      newPosition.x * scale * x_flip, 
      newPosition.y * scale, 
      newPosition.z * scale
    );
  }
  
}
