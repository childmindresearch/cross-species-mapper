<script lang="ts">
  import SingleGraph from "./SingleGraph.svelte";
  import Loadingbar from "$lib/components/Loadingbar.svelte";
  import { onMount } from "svelte";
  import { getRegionNames } from "$lib/api";
  import { modality, targetHumanRegion, targetMacaqueRegion } from "$lib/store";

  let humanRegionNames: string[] = [];
  let macaqueRegionNames: string[] = [];

  onMount(async () => {
    [humanRegionNames, macaqueRegionNames] = await Promise.all([
      getRegionNames("human"),
      getRegionNames("macaque"),
    ]);
  });
</script>

<div class="flex space-x-8 justify-center pb-2">
  <div>
    <label for="modality"
      >Modality (<span class="text-red-500">Female</span>/<span
        class="text-blue-500">Male</span
      >) :</label
    >
    <select class="select max-w-64" bind:value={$modality} id="modality">
      <option value="thickness">Cortical Thickness</option>
      <option value="area">Area</option>
      <option value="volume">Volume</option>
    </select>
  </div>

  {#if humanRegionNames.length === 0 || macaqueRegionNames.length === 0}
    <Loadingbar label="Loading region names..." />
  {:else}
    <div>
      <label for="humanRegion">Human Region (DKT Atlas):</label>
      <select
        class="select max-w-64"
        bind:value={$targetHumanRegion}
        id="humanRegion"
      >
        {#each humanRegionNames as region}
          <option value={region}>{region}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="macaqueRegion">Macaque Region (Markov Atlas): </label>
      <select
        class="select max-w-64"
        bind:value={$targetMacaqueRegion}
        id="macaqueRegion"
      >
        {#each macaqueRegionNames as region}
          <option value={region}>{region}</option>
        {/each}
      </select>
    </div>
  {/if}
</div>

<div class="grid grid-cols-1 min-h-[350px]">
  {#key $modality}
    {#key $targetHumanRegion}
      <SingleGraph
        region={$targetHumanRegion}
        targetSpecies="human"
        modality={$modality}
      />
    {/key}
    {#key $targetMacaqueRegion}
      <SingleGraph
        region={$targetMacaqueRegion}
        targetSpecies="macaque"
        modality={$modality}
      />
    {/key}
  {/key}
</div>
