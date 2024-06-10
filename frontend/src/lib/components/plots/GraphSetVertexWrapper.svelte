<script lang="ts">
  import { getVertexToParcel } from "$lib/api";
  import {
    seedVertex,
    seedSpecies,
    targetHumanRegion,
    targetMacaqueRegion,
  } from "$lib/store";
  import { onMount } from "svelte";
  import GraphSet from "./GraphSet.svelte";

  onMount(async () => {
    const mapping = await getVertexToParcel($seedVertex, $seedSpecies);
    $targetHumanRegion = mapping.AparcName;
    $targetMacaqueRegion = mapping.MarkovName;
  });
</script>

<GraphSet />
