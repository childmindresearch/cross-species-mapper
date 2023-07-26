<script lang="ts">
  import { onMount } from "svelte";
  import type { Surface } from "brainviewer/src/brainViewer";
  import { Shadow } from "svelte-loading-spinners";
  import { getData } from "./fetch";
  import { createClient } from "./client";
  import { onDoubleClick, onUpdate } from "./events";
  import Toggle from "svelte-toggle";

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

  onMount(async () => {
    surfaces = await getData();
    const clients = [
      createClient(div1, surfaces["human_left"], "human", "left"),
      createClient(div2, surfaces["human_right"], "human", "right"),
      createClient(div3, surfaces["macaque_left"], "macaque", "left"),
      createClient(div4, surfaces["macaque_right"], "macaque", "right"),
    ];

    clients.map((client) => {
      client.addListener("dblclick", (event: any) => {
        onDoubleClick(event, clients, client.species, client.side);
      });
      client.controls.addEventListener("control", (event: any) => {
        if (cameraLock) {
          onUpdate(event, client, clients);
        }
      });
    });
  });
</script>

<div class="camera-controls">
  <Toggle
    bind:cameraLock
    on="Locked"
    off="Unlocked"
    label="Camera Lock"
    on:toggle={() => {
      cameraLock = !cameraLock;
    }}
  />
</div>
{#if !surfaces}
  <div class="loading">
    <Shadow size="30" color="#FF3E00" unit="px" duration="1s" />
  </div>
{/if}
<div class="viewer-set">
  <div class="viewer-row">
    <div id="div-viewer" bind:this={div1} />
    <div id="div-viewer" bind:this={div2} />
  </div>
  <div class="viewer-row">
    <div id="div-viewer" bind:this={div3} />
    <div id="div-viewer" bind:this={div4} />
  </div>
</div>

<style>
  .viewer-set {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .viewer-row {
    display: flex;
    flex-direction: row;
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
