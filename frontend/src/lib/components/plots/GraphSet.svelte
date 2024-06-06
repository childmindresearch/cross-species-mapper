<script lang="ts">
  import SingleGraph from "./SingleGraph.svelte";
  import Loadingbar from "$lib/components/Loadingbar.svelte";
  import { onMount } from "svelte";
  import { getRegionNames } from "$lib/api";

  export let targetHumanRegion: string;
  export let targetMacaqueRegion: string;

  let modality = "thickness";
  let humanRegionNames: string[] = [];
  let macaqueRegionNames: string[] = [];

  onMount(async () => {
    [humanRegionNames, macaqueRegionNames] = await Promise.all([
      getRegionNames("human"),
      getRegionNames("macaque"),
    ]);
  });
</script>

<label for="modality">Modality:</label>
<select class="select max-w-52" bind:value={modality} id="modality">
  <option value="thickness">Cortical Thickness</option>
  <option value="area">Area</option>
  <option value="volume">Volume</option>
</select>

{#if humanRegionNames.length === 0 || macaqueRegionNames.length === 0}
  <Loadingbar label="Loading region names..." />
{:else}
  <label for="humanRegion">Human Region:</label>
  <select
    class="select max-w-52"
    bind:value={targetHumanRegion}
    id="humanRegion"
  >
    {#each humanRegionNames as region}
      <option value={region}>{region}</option>
    {/each}
  </select>

  <label for="macaqueRegion">Macaque Region:</label>
  <select
    class="select max-w-52"
    bind:value={targetMacaqueRegion}
    id="macaqueRegion"
  >
    {#each macaqueRegionNames as region}
      <option value={region}>{region}</option>
    {/each}
  </select>
{/if}

<div class="grid grid-cols-1 xl:grid-cols-2 min-h-[350px]">
  {#key modality}
    {#key targetHumanRegion}
      <SingleGraph
        region={targetHumanRegion}
        targetSpecies="human"
        {modality}
      />
    {/key}
    {#key targetMacaqueRegion}
      <SingleGraph
        region={targetMacaqueRegion}
        targetSpecies="macaque"
        {modality}
      />
    {/key}
  {/key}
</div>
