import { MeshColors } from "@cmi-dair/brainviewer";
import { getCrossSpeciesSimilarity } from "../../api/fetcher";
import type { Viewer } from "./client";
import type { CameraSettings } from "./types";
import * as THREE from "three";
import { speciesScale } from "./constants";
import toast from "svelte-french-toast";

let lastTouchTime = new Date().getTime();

export async function addEventListeners(
  viewers: Viewer[],
  cameraSettings: CameraSettings,
): Promise<void> {
  viewers.map((viewer) => {
    viewer.viewer.addListener(
      "dblclick",
      (event: Event, intersects: THREE.Intersection[] | undefined) => {
        if (!(event instanceof MouseEvent || event instanceof TouchEvent)) {
          return;
        }
        if (intersects === undefined) {
          return;
        }
        onDoubleClick(
          event,
          intersects,
          viewers,
          viewer.getSpecies(),
          viewer.getSide(),
        );
      },
    );
    viewer.viewer.addListener(
      "touchstart",
      (event: Event, intersects: THREE.Intersection[] | undefined) => {
        event.preventDefault();
        if (!(event instanceof MouseEvent || event instanceof TouchEvent)) {
          return;
        }
        if (intersects === undefined) {
          return;
        }
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTouchTime;
        if (tapLength < 500 && tapLength > 0) {
          onDoubleClick(
            event,
            intersects,
            viewers,
            viewer.getSpecies(),
            viewer.getSide(),
          );
        } else {
          lastTouchTime = currentTime;
        }
      },
    );
    viewer.viewer.controls.addEventListener("control", (event: any) => {
      if (cameraSettings.cameraLock) {
        onUpdate(event, viewer, viewers);
      }
    });
  });
}

export async function onDoubleClick(
  event: MouseEvent | TouchEvent,
  intersects: THREE.Intersection[],
  viewers: Viewer[],
  clickedSpecies: string,
  clickedSide: string,
): Promise<void> {
  const vertex = intersects[0].face?.a;
  if (vertex === undefined) {
    toast.error("No vertex selected.");
    return;
  }

  const similarities = await getCrossSpeciesSimilarity(
    clickedSpecies,
    clickedSide,
    vertex,
  ).then((data) => {
    return data;
  });

  const allDataIsZero = Object.values(similarities).every((similarity) =>
    similarity.every((value) => value === 0),
  );

  if (allDataIsZero) {
    toast.error("No data available for midline vertices.");
    return;
  }

  for (const viewer of viewers) {
    const similarity = similarities[viewer.species + "_" + viewer.side];
    const colors = new MeshColors(
      similarity,
      viewer.colorMap,
      viewer.colorLimits,
    );
    viewer.viewer
      .getModels()[0]
      .geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors.colors, 3),
      );
  }
}

export async function onUpdate(
  event: any,
  triggeringClient: Viewer,
  clients: Viewer[],
): Promise<void> {
  const newPosition = triggeringClient.viewer.controls.getPosition(
    new THREE.Vector3(),
  );
  for (const client of clients) {
    const sameSide = client.side === triggeringClient.side;
    const scale =
      speciesScale[client.species] / speciesScale[triggeringClient.species];
    const xFlip = sameSide ? 1 : -1;

    void client.viewer.controls.setPosition(
      newPosition.x * scale * xFlip,
      newPosition.y * scale,
      newPosition.z * scale,
    );
  }
}
