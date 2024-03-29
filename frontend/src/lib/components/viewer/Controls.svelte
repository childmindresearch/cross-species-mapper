<script lang="ts">
  import { seedSide, seedSpecies, seedVertex, similarity } from "$lib/store";
  import { Legend, colorInterpolates } from "@cmi-dair/brainviewer";
  import { onMount } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import Toggle from "svelte-toggle";
  import Button from "../Button.svelte";
  import DownloadButton from "../DownloadButton.svelte";
  import type { Viewer } from "./client";
  import { onSliderChange } from "./events";
  import type { ViewerSettings } from "./types";

  let divLegend: HTMLElement;
  let legend: Legend[] = []; // array so we can pass by reference

  export let resetCamera: () => void;
  export let viewers: Viewer[];
  export let viewerSettings: ViewerSettings;

  let filename: string;

  onMount(async () => {
    legend.push(new Legend(divLegend));
    legend[0].update({
      colorBar: {
        minVal: viewerSettings.colorLimits[0],
        maxVal: viewerSettings.colorLimits[1],
        colorFun: colorInterpolates["Turbo"],
      },
      title: "Feature Similarity",
      backgroundColor: "#00000000",
    });
  });

  $: filename = `similarity_${$seedSpecies}_${$seedSide}_${$seedVertex}.json`;
</script>

<div class="viewer-utils">
  <div class="camera-controls">
    <div class="toggle-div">
      <Toggle
        bind:cameraLock={viewerSettings.cameraLock}
        on="Locked  "
        off="Unlocked"
        label="Camera Lock"
        on:toggle={() => {
          viewerSettings.cameraLock = !viewerSettings.cameraLock;
        }}
        switchColor="rgb(var(--color-theme-2))"
        toggledColor="rgb(var(--color-theme-1))"
      />
    </div>
    <Button text="Reset Camera" onClick={resetCamera} />
  </div>
  <div id="div-slider">
    <div id="div-title">
      <b>Feature Similarity</b>
    </div>
    <RangeSlider
      bind:values={viewerSettings.colorLimits}
      min={-2}
      max={4}
      step={0.5}
      range={true}
      first={"label"}
      last={"label"}
      pips
      float={true}
      on:change={(event) => {
        onSliderChange(event, legend, viewers, viewerSettings);
      }}
    />
  </div>
  <div id="div-legend" bind:this={divLegend} />
  <DownloadButton text="Similarity" data={$similarity} {filename} />
</div>

<style>
  .viewer-utils {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .camera-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 10px;
  }

  #div-slider {
    width: 40%;
  }

  #div-title {
    width: 100%;
    text-align: center;
  }

  #div-legend {
    padding-right: 20px;
  }

  .toggle-div {
    width: 120px;
  }

  @media (max-width: 950px) {
    .viewer-utils {
      flex-direction: column;
    }
  }
  @media (max-width: 950px) {
    #div-slider {
      width: 100%;
    }
  }
</style>
