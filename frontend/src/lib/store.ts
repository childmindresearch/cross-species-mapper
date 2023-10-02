import { writable, type Writable } from "svelte/store";

export const seedVertex = writable(0);
export const seedSide = writable("left");
export const seedSpecies = writable("human");

export const terms: Writable<string[]> = writable([]);
