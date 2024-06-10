import { writable, type Writable } from "svelte/store";
import type { CrossSpeciesSimilarityResponse } from "./types";

export const seedVertex = writable(0);
export const seedSide = writable("left");
export const seedSpecies = writable("human");

export const similarity: Writable<CrossSpeciesSimilarityResponse> = writable();
export const terms: Writable<string[][]> = writable();

export const modality = writable("volume");
export const targetHumanRegion = writable("isthmuscingulate");
export const targetMacaqueRegion = writable("area.23");
