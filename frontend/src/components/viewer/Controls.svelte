<script lang="ts">
  import Toggle from "svelte-toggle";
  import Button from "../Button.svelte";
  import { Legend, colorInterpolates } from "@cmi-dair/brainviewer";
  import { onMount } from "svelte";
  import type { CameraSettings } from "./types";

  let divLegend: HTMLElement;
  export let resetCamera: () => void;

  export let cameraSettings: CameraSettings;

  onMount(async () => {
    const legend = new Legend(divLegend);
    legend.update(-1, 2, colorInterpolates["Turbo"]);
  });
</script>

<div class="viewer-utils">
  <div class="camera-controls">
    <div class="toggle-div">
      <Toggle
        bind:cameraLock={cameraSettings.cameraLock}
        on="Locked  "
        off="Unlocked"
        label="Camera Lock"
        on:toggle={() => {
          cameraSettings.cameraLock = !cameraSettings.cameraLock;
        }}
        switchColor="var(--color-theme-2)"
        toggledColor="var(--color-theme-1)"
      />
    </div>
    <Button text="Reset Camera" onClick={resetCamera} />
  </div>
  <div id="div-legend" bind:this={divLegend} />
</div>

<style>
  .viewer-utils {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .viewer-utils {
      flex-direction: column;
    }
  }

  .camera-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 10px;
  }

  #div-legend {
    padding-right: 20px;
  }

  .toggle-div {
    width: 120px;
  }
</style>
