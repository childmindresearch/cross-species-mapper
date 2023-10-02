<script>
  import { Toaster } from "svelte-french-toast";
  import ViewerSet from "../lib/components/viewer/ViewerSet.svelte";
  import Introduction from "./Introduction.svelte";
</script>

<svelte:head>
  <title>Cross Species Mapper</title>
  <meta
    name="description"
    content="A webapp for discovering human-macaque similarity."
  />
</svelte:head>

<main>
  <Toaster position="bottom-right" />
  <Introduction />
  <ViewerSet />
</main>
