<script lang="ts">
  import DownloadIcon from "$lib/icons/DownloadIcon.svelte";
  import type { ChartSettings } from "$lib/types";
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  export let data: {
    x: number[];
    y: number[];
    r?: number[];
    label?: string;
    type?: string;
  }[];
  export let options: ChartSettings = {};
  export let type: "line" | "scatter" | "bar" | "bubble";

  let chartCanvas: HTMLCanvasElement;

  function downloadData() {
    const a = document.createElement("a");
    const dataJson = JSON.stringify(data);
    const blob = new Blob([dataJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = options.title ? `${options.title}.json` : "data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  onMount(async () => {
    const ctx = chartCanvas.getContext("2d");
    new Chart(ctx!, {
      options: {
        plugins: {
          title: {
            display: options.title !== undefined,
            text: options.title,
          },
        },
        scales: {
          x: {
            type: options.xLogarithmic ? "logarithmic" : "linear",
            position: "bottom",
            title: {
              display: options.xLabel !== undefined,
              text: options.xLabel,
            },
          },
          y: {
            type: options.yLogarithmic ? "logarithmic" : "linear",
            position: "left",
            title: {
              display: options.yLabel !== undefined,
              text: options.yLabel,
            },
          },
        },
      },
      data: {
        // @ts-ignore because we are using a narrower type.
        datasets: data.map((d) => {
          return {
            type: d.type ?? type,
            label: d.label ?? "No label",
            data: d.x.map((x, i) => ({ x, y: d.y[i], r: d.r?.[i] })),
          };
        }),
      },
    });
  });
</script>

<div>
  <button
    type="button"
    class:hidden={!options.download}
    class="btn absolute hover:variant-soft-primary"
    on:click={downloadData}><DownloadIcon /></button
  >
  <canvas bind:this={chartCanvas} id="myChart"></canvas>
</div>
