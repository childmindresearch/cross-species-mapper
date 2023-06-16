import { render, screen } from "@testing-library/react";
import SurfacePlotter, {
  createPlot,
  apiSurfaceToPlotlySurface,
  getSurfaces,
} from "./SurfacePlotter";

// Plotly seems broken in a testing environment.
// Mock it out entirely.
jest.mock("react-plotly.js", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-plot"></div>,
  };
});

const mock_surface = {
  type: "mesh3d",
  x: [1, 2, 3],
  y: [4, 5, 6],
  z: [7, 8, 9],
  i: [0, 1, 2],
  j: [1, 2, 0],
  k: [2, 0, 1],
  intensity: [1, 2, 3],
};

describe("Tests for the SurfacePlotter component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("create plot renders a surface plot", async () => {
    const plot = createPlot(mock_surface, () => {});
    render(plot);

    const plotly = screen.getAllByTestId("mock-plot");
    expect(plotly).toHaveLength(1);
  });

  test("Convert API surface to Plotly", async () => {
    const api_surface = {
      xCoordinate: mock_surface.x,
      yCoordinate: mock_surface.y,
      zCoordinate: mock_surface.z,
      iFaces: mock_surface.i,
      jFaces: mock_surface.j,
      kFaces: mock_surface.k,
    };

    const converted_surface = apiSurfaceToPlotlySurface(api_surface, [1, 2, 3]);
    expect(converted_surface).toEqual(mock_surface);
  });

  test("getSurfaces returns the correct data", async () => {
    const mock_data = [
      { x: [1, 2, 3], y: [4, 5, 6], z: [7, 8, 9] },
      { x: [10, 11, 12], y: [13, 14, 15], z: [16, 17, 18] },
    ];

    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(mock_data),
    } as Response);

    const data = await getSurfaces();

    expect(data).toEqual(mock_data);
  });

  test("surfacePlotter renders a plot with the correct data", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({ fslr_32k_left: mock_surface }),
    } as Response);

    render(<SurfacePlotter />);

    const plotly = screen.getAllByTestId("mock-plot");
    expect(plotly).toHaveLength(1);
  });
});
