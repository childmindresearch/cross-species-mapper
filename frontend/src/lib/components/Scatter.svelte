<script lang="ts">
  import BaseChart from "./BaseChart.svelte";
  import type { ChartSettings } from "$lib/types";

  export let data: {
    x: number[];
    y: number[];
    label?: string;
  }[];
  export let options: ChartSettings = {};
</script>

<BaseChart {data} {options} type="scatter" />
