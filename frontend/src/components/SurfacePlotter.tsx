import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { ApiSurface, PlotlySurface } from "../types/surfaces";
import { Endpoints } from "../constants/api";

export async function getSurfaces() {
  const response = await fetch(Endpoints.getHemispheres);
  const data = await response.json();
  return data;
}

export function apiSurfaceToPlotlySurface(
  apiSurface: ApiSurface | undefined,
  intensity: number[]
) {
  return {
    type: "mesh3d",
    x: apiSurface?.xCoordinate,
    y: apiSurface?.yCoordinate,
    z: apiSurface?.zCoordinate,
    i: apiSurface?.iFaces,
    j: apiSurface?.jFaces,
    k: apiSurface?.kFaces,
    intensity: intensity,
  };
}

export function createPlot(
  data: PlotlySurface,
  handleClick: (event: any) => void
) {
  // Kept separate for ease of testing.
  return (
    <Plot
      data={[data]}
      layout={{ title: "A Fancy Plot" }}
      onClick={handleClick}
      showscale={false}
    />
  );
}

export default function SurfacePlotter() {
  const [surface, setSurface] = useState<ApiSurface | undefined>(undefined);
  useEffect(() => {
    getSurfaces().then((surf) => setSurface(surf.fslr_32k_left));
  }, []);

  const handleClick = (event: any) => {
    console.log(event);
  };

  const intensity = Array.from({ length: 32492 }, (_, i) => i + 1);
  const data = apiSurfaceToPlotlySurface(surface, intensity);
  return createPlot(data, handleClick);
}
