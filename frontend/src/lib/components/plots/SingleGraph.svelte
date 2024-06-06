<script lang="ts">
  import { getGraph } from "$lib/api";
  import { onMount } from "svelte";
  import Loadingbar from "$lib/components/Loadingbar.svelte";

  export let region: string;
  export let targetSpecies: string;
  export let modality: string;

  let svg: Promise<string>;

  onMount(async () => {
    svg = getGraph(region, targetSpecies, modality);
  });

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
</script>

{#await svg}
  <Loadingbar />
{:then resolvedSvg}
  <div class="max-w-md min-w-fit mx-auto">
    <h3 class="text-center font-bold">
      {capitalizeFirstLetter(targetSpecies)} - {capitalizeFirstLetter(modality)}
      - {region}
    </h3>
    {@html resolvedSvg}
  </div>
{:catch}
  <p class="text-center">Failed to load graph for "{region}".</p>
{/await}
