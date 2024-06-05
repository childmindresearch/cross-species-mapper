<script lang="ts">
  import Graph from "./Graph.svelte";
  import { seedVertex, seedSpecies } from "$lib/store";

  let modality = "thickness";
</script>

<label for="modality">Modality:</label>
<select class="select max-w-52" bind:value={modality} id="modality">
  <option value="thickness">Cortical Thickness</option>
  <option value="area">Area</option>
  <option value="volume">Volume</option>
</select>
<div class="grid grid-cols-1 xl:grid-cols-2 min-h-[350px]">
  {#key [$seedVertex, modality]}
    <Graph
      vertex={$seedVertex}
      sourceSpecies={$seedSpecies}
      targetSpecies="human"
      {modality}
    />
    <Graph
      vertex={$seedVertex}
      sourceSpecies={$seedSpecies}
      targetSpecies="macaque"
      {modality}
    />
  {/key}
</div>
