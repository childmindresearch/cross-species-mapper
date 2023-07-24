<script>
  import Introduction from "./Introduction.svelte";
  import ViewerSet from "./viewer/ViewerSet.svelte";
</script>

<svelte:head>
  <title>Cross Species Mapper</title>
  <meta
    name="description"
    content="A webapp for discovering human-macaque similarity."
  />
</svelte:head>

<main>
  <Introduction />
  <ViewerSet />
</main>
