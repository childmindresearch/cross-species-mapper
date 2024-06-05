<script>
  import NeuroQuery from "$lib/components/NeuroQuery.svelte";
  import { Toaster } from "svelte-french-toast";
  import ViewerSet from "../lib/components/viewer/ViewerSet.svelte";
  import Introduction from "./Introduction.svelte";
  import GraphSet from "$lib/components/plots/GraphSet.svelte";
</script>

<svelte:head>
  <title>Cross Species Mapper</title>
  <meta
    name="description"
    content="A webapp for discovering human-macaque similarity."
  />
</svelte:head>

<main class="mx-10">
  <Toaster position="bottom-right" />
  <Introduction />
  <hr class="m-2" />
  <NeuroQuery />
  <hr class="m-2" />
  <ViewerSet />
  <GraphSet />
</main>
