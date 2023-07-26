<script lang="ts">
  import { onMount } from "svelte";
  import type { Surface } from "brainviewer/src/brainViewer";
  import { Shadow } from "svelte-loading-spinners";
  import { getData } from "./fetch";
  import { Viewer } from "./client";
  import { onDoubleClick, onUpdate } from "./events";
  import Toggle from "svelte-toggle";
  import Button from "../Button.svelte";

  let cameraLock = true;
  let surfaces: {
    human_left: Surface;
    human_right: Surface;
    macaque_left: Surface;
    macaque_right: Surface;
  };

  let div1: HTMLElement;
  let div2: HTMLElement;
  let div3: HTMLElement;
  let div4: HTMLElement;

  let resetCamera: () => void;
  let lastTouchTime = new Date().getTime();

  onMount(async () => {
    surfaces = await getData();
    const viewers = [
      new Viewer(div1, surfaces["human_left"], "human", "left"),
      new Viewer(div2, surfaces["human_right"], "human", "right"),
      new Viewer(div3, surfaces["macaque_left"], "macaque", "left"),
      new Viewer(div4, surfaces["macaque_right"], "macaque", "right"),
    ];
    viewers.map((viewer) => {
      viewer.plot();
    });

    viewers.map((viewer) => {
      viewer.viewer.addListener("dblclick", (event: any) => {
        onDoubleClick(event, viewers, viewer.getSpecies(), viewer.getSide());
      });

      viewer.viewer.addListener("touchstart", (event: any) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTouchTime;
        if (tapLength < 500 && tapLength > 0) {
          onDoubleClick(event, viewers, viewer.getSpecies(), viewer.getSide());
          event.preventDefault();
        } else {
          lastTouchTime = currentTime;
        }
      });

      viewer.viewer.controls.addEventListener("control", (event: any) => {
        if (cameraLock) {
          onUpdate(event, viewer, viewers);
        }
      });
    });

    resetCamera = () => {
      viewers.map((viewer) => {
        viewer.resetCamera();
      });
    };
  });
</script>

<div class="camera-controls">
  <div class="toggle-div">
    <Toggle
      bind:cameraLock
      on="Locked  "
      off="Unlocked"
      label="Camera Lock"
      on:toggle={() => {
        cameraLock = !cameraLock;
      }}
      switchColor="var(--color-theme-2)"
      toggledColor="var(--color-theme-1)"
    />
  </div>
  <Button text="Reset Camera" onClick={resetCamera} />
</div>
{#if !surfaces}
  <div class="loading">
    <Shadow size="30" color="#FF3E00" unit="px" duration="1s" />
  </div>
{/if}
<div class="viewer-set">
  <div id="div-viewer" bind:this={div1} />
  <div id="div-viewer" bind:this={div2} />
  <div id="div-viewer" bind:this={div3} />
  <div id="div-viewer" bind:this={div4} />
</div>

<style>
  .camera-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    margin-bottom: 10px;
    gap: 20px;
  }

  .toggle-div {
    width: 120px;
  }
  .viewer-set {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    .viewer-set {
      grid-template-columns: repeat(1, 1fr);
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

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }
</style>
