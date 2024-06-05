<script>
  import "../app.postcss";
  import "@cmi-dair/skeleton-themes/cmi.postcss";
  import NavBar from "$lib/components/NavBar.svelte";

  import { initializeStores } from "@skeletonlabs/skeleton";
  initializeStores();
</script>

<svelte:head>
  <title>Cross Species Mapper</title>
  <meta
    name="description"
    content="The Cross Species Mapper developed by Child Mind Institute"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/ico" href="/favicon.ico" />
</svelte:head>

<NavBar />
<slot />
<p class="text-center">© {new Date().getFullYear()} Child Mind Institute</p>
