<script lang="ts">
  import LockIcon from "$lib/icons/CameraIcon.svelte";
  import { seedSide, seedSpecies, seedVertex, similarity } from "$lib/store";
  import { Legend, colorInterpolates } from "@cmi-dair/brainviewer";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import DownloadButton from "../DownloadButton.svelte";
  import type { Viewer } from "./client";
  import { onSliderChange } from "./events";
  import type { ViewerSettings } from "./types";

  let divLegend: HTMLElement;
  let legend: Legend[] = [];

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

<div class="flex gap-4 justify-between items-center mb-8 flex-col xl:flex-row">
  <SlideToggle bind:checked={viewerSettings.cameraLock} name="Camera Lock">
    {viewerSettings.cameraLock ? "Camera Locked" : "Camera Unlocked"}
  </SlideToggle>
  <button class="btn variant-soft-primary" on:click={resetCamera}
    ><LockIcon class="p-1" />Reset Camera</button
  >
  <div class="w-full lg:w-[40%]">
    <div class="w-full text-center">
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
  <div class="pr-5" bind:this={divLegend} />
  <DownloadButton text="Similarity" data={$similarity} {filename} />
</div>
