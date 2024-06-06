<script lang="ts">
  import { getVertexToParcel } from "$lib/api";
  import { seedVertex, seedSpecies } from "$lib/store";
  import { onMount } from "svelte";
  import GraphSet from "./GraphSet.svelte";

  let targetHumanRegion: string;
  let targetMacaqueRegion: string;

  onMount(async () => {
    const mapping = await getVertexToParcel($seedVertex, $seedSpecies);
    targetHumanRegion = mapping.AparcName;
    targetMacaqueRegion = mapping.MarkovName;
    console.log(mapping);
    console.log(targetHumanRegion, targetMacaqueRegion);
  });
</script>

<GraphSet {targetHumanRegion} {targetMacaqueRegion} />
