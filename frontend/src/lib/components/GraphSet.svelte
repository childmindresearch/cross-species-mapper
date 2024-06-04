<script lang="ts">
  import Graph from "./Graph.svelte";
  import { seedVertex, seedSpecies } from "$lib/store";
</script>

<div class="grid grid-cols-2">
  {#key $seedVertex}
    <Graph
      vertex={$seedVertex}
      sourceSpecies={$seedSpecies}
      targetSpecies="human"
      modality="thickness"
    />
    <Graph
      vertex={$seedVertex}
      sourceSpecies={$seedSpecies}
      targetSpecies="macaque"
      modality="thickness"
    />
  {/key}
</div>
