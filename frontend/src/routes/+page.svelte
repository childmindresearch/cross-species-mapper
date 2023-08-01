<script>
  import Introduction from "./Introduction.svelte";
  import ViewerSet from "../components/viewer/ViewerSet.svelte";
  import { Toaster } from "svelte-french-toast";
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
