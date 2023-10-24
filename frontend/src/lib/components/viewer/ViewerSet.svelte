<script lang="ts">
  import Loadingbar from "$lib/components/Loadingbar.svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import Controls from "./Controls.svelte";
  import { Viewer } from "./client";
  import { addEventListeners } from "./events";
  import { getData } from "./fetch";
  import type { SurfaceData, ViewerSettings } from "./types";

  let surfaces: SurfaceData | null;

  let div1: HTMLElement;
  let div2: HTMLElement;
  let div3: HTMLElement;
  let div4: HTMLElement;

  let resetCamera: () => void;
  let viewerSettings: ViewerSettings = {
    cameraLock: true,
    colorLimits: [-1, 2],
    colorMap: "Turbo",
  };
  let viewers: Viewer[] = [];

  onMount(async () => {
    if (!navigator.userAgent.includes("Chrome")) {
      toast.error(
        "This app is only supported on Google Chrome. Things may not work as expected."
      );
    }

    surfaces = await getData().catch(() => {
      toast.error("Something went wrong. Please try refreshing.");
      return null;
    });

    if (!surfaces) {
      return;
    }

    viewers.push(
      new Viewer(div1, surfaces["human_left"], "human", "left"),
      new Viewer(div2, surfaces["human_right"], "human", "right"),
      new Viewer(div3, surfaces["macaque_left"], "macaque", "left"),
      new Viewer(div4, surfaces["macaque_right"], "macaque", "right")
    );
    viewers.forEach((viewer) => viewer.plot());
    addEventListeners(viewers, viewerSettings);

    resetCamera = () => viewers.forEach((viewer) => viewer.resetCamera());
  });
</script>

{#if !surfaces}
  <Loadingbar />
{:else}
  <Controls {resetCamera} {viewers} {viewerSettings} />
{/if}
<div class="viewer-set">
  <div id="div-viewer" bind:this={div1} />
  <div id="div-viewer" bind:this={div2} />
  <div id="div-viewer" bind:this={div3} />
  <div id="div-viewer" bind:this={div4} />
</div>

<style>
  .viewer-set {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    .viewer-set {
      grid-template-columns: repeat(1, 1fr);
      justify-items: center;
      gap: 1rem;
    }
  }

  @media (min-width: 1400px) {
    .viewer-set {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  #div-viewer {
    width: var(--width) px;
    height: var(--height) px;
    position: relative;
    overflow: hidden;
    z-index: 3;
  }

  @media (max-width: 768px) {
    #div-viewer {
      max-width: 75%;
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
</style>
