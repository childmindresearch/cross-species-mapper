import { getCrossSpeciesSimilarity, getNeuroQuery } from "$lib/api";
import { seedSide, seedSpecies, seedVertex, terms } from "$lib/store";
import {
  Legend,
  MeshColors,
  colorInterpolates,
} from "@childmindresearch/brainviewer";
import toast from "svelte-french-toast";
import * as THREE from "three";
import type { Viewer } from "./client";
import { speciesScale } from "./constants";
import type { ViewerSettings } from "./types";
let lastTouchTime = new Date().getTime();

export async function addEventListeners(
  viewers: Viewer[],
  cameraSettings: ViewerSettings,
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

async function onDoubleClick(
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
  seedVertex.set(vertex);
  seedSide.set(clickedSide);
  seedSpecies.set(clickedSpecies);

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
    viewer.surface.intensity = similarity;
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

  terms.set(
    await getNeuroQuery(clickedSpecies, clickedSide, vertex).then(
      (data: string[]) => {
        return data;
      },
    ),
  );
}

async function onUpdate(
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

export async function onSliderChange(
  _event: Event,
  legend: Legend[],
  viewers: Viewer[],
  viewerSettings: ViewerSettings,
): Promise<void> {
  for (const viewer of viewers) {
    viewer.colorLimits = viewerSettings.colorLimits;
    const colors = new MeshColors(
      viewer.surface.intensity,
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

  legend[0].update({
    colorBar: {
      minVal: viewerSettings.colorLimits[0],
      maxVal: viewerSettings.colorLimits[1],
      colorFun: colorInterpolates[viewerSettings.colorMap],
    },
  });
}
