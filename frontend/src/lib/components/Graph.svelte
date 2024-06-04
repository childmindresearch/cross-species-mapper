<script lang="ts">
  import { getGraph } from "$lib/api";
  import { onMount } from "svelte";
  import Loadingbar from "./Loadingbar.svelte";

  export let vertex: Number;
  export let sourceSpecies: string;
  export let targetSpecies: string;
  export let modality: string;

  let svg: string;

  onMount(async () => {
    svg = await getGraph(vertex, sourceSpecies, targetSpecies, modality);
  });

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
</script>

{#if !svg}
  <Loadingbar />
{:else}
  <div>
    <h3 class="text-center font-bold pr-28">
      {capitalizeFirstLetter(targetSpecies)} - {capitalizeFirstLetter(modality)}
    </h3>
    {@html svg}
  </div>
{/if}
