import { writable } from "svelte/store";

export const seedVertex = writable(0);
export const seedSide = writable("left");
export const seedSpecies = writable("human");
