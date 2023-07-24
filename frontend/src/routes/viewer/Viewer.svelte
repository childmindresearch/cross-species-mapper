<script lang="ts">
  import type { Surface } from "brainviewer/src/brainViewer";
  import { ViewerClient } from "brainviewer/src/viewer";
  import { onMount } from "svelte";
  import { onDoubleClick } from "./events";

  export let surface: Surface;
  export let species: string;
  export let side: string;

  export let width = 300;
  export let height = 300;

  let divUi: HTMLElement;
  let divRoot: HTMLElement;

  onMount(async () => {
    const client = new ViewerClient(divRoot, surface);
    client.setModel(surface.mesh, surface.colors);
    client.addListener("dblclick", (event: any) => {
      onDoubleClick(event, client, species, side);
    });

    client.controls.minDistance = 30;
    client.controls.maxDistance = 300;
    client.setAlpha(0);
    client.renderer.setSize(width, height);
    const orbit = client.setOrbit("origin");
  });
</script>

<div id="div-viewer" bind:this={divRoot} />
<svg id="legend" />

<style>
  #div-viewer {
    width: var(--width) px;
    height: var(--height) px;
    position: relative;
    overflow: hidden;
    z-index: 3;
  }
  #legend {
    position: relative;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
