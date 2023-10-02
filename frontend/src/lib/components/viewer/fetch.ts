import { MeshColors, Surface, SurfaceMesh } from "@cmi-dair/brainviewer";
import { getCrossSpeciesSimilarity, getSurfaces } from "../../api";
import type { ApiSurface, SurfaceData } from "./types";

function apiSurface2ViewerSurface(apiSurface: ApiSurface): SurfaceMesh {
  return new SurfaceMesh(
    new Float32Array(apiSurface.vertices.flat()),
    new Uint32Array(apiSurface.faces.flat()),
  );
}

export async function getData(): Promise<SurfaceData> {
  const surfaceMeshPromises = {
    human_left: getSurfaces("human", "left"),
    human_right: getSurfaces("human", "right"),
    macaque_left: getSurfaces("macaque", "left"),
    macaque_right: getSurfaces("macaque", "right"),
  };

  const similarityPromise = getCrossSpeciesSimilarity("human", "left", 1);

  const surfaceMeshes = await Promise.all(
    Object.values(surfaceMeshPromises),
  ).then((data) => {
    return {
      human_left: apiSurface2ViewerSurface(data[0]),
      human_right: apiSurface2ViewerSurface(data[1]),
      macaque_left: apiSurface2ViewerSurface(data[2]),
      macaque_right: apiSurface2ViewerSurface(data[3]),
    };
  });

  const intensity = await similarityPromise.then((data) => {
    return data;
  });
  const meshColors = {
    human_left: new MeshColors(intensity.human_left, "Turbo", [-1, 2]),
    human_right: new MeshColors(intensity.human_right, "Turbo", [-1, 2]),
    macaque_left: new MeshColors(intensity.macaque_left, "Turbo", [-1, 2]),
    macaque_right: new MeshColors(intensity.macaque_right, "Turbo", [-1, 2]),
  };

  const surfaces = {
    human_left: new Surface(surfaceMeshes.human_left, meshColors.human_left),
    human_right: new Surface(surfaceMeshes.human_right, meshColors.human_right),
    macaque_left: new Surface(
      surfaceMeshes.macaque_left,
      meshColors.macaque_left,
    ),
    macaque_right: new Surface(
      surfaceMeshes.macaque_right,
      meshColors.macaque_right,
    ),
  };

  const surfaceOverloads = {
    human_left: {
      surface: surfaces.human_left,
      intensity: intensity.human_left,
    },
    human_right: {
      surface: surfaces.human_right,
      intensity: intensity.human_right,
    },
    macaque_left: {
      surface: surfaces.macaque_left,
      intensity: intensity.macaque_left,
    },
    macaque_right: {
      surface: surfaces.macaque_right,
      intensity: intensity.macaque_right,
    },
  };

  return surfaceOverloads;
}
