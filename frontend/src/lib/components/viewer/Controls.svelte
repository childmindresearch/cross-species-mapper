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

<div
  class="grid gap-y-2 xl:grid-cols-[12%_15%_auto_30%_20%] lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
>
  <div class="flex items-center justify-center text-center">
    <SlideToggle bind:checked={viewerSettings.cameraLock} name="Camera Lock">
      {viewerSettings.cameraLock ? "Camera Locked" : "Camera Unlocked"}
    </SlideToggle>
  </div>
  <div class="flex items-center justify-center text-center">
    <button class="btn variant-soft-primary" on:click={resetCamera}
      ><LockIcon class="p-1" />Reset Camera</button
    >
  </div>
  <div class="w-full">
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
  <div
    class="flex items-center justify-center text-center xl:pl-20"
    bind:this={divLegend}
  />
  <div class="flex items-center justify-center text-center">
    <DownloadButton text="Similarity" data={$similarity} {filename} />
  </div>
</div>
