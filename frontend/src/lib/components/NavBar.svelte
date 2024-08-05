<script lang="ts">
  import GithubIcon from "$lib/icons/GithubIcon.svelte";
  import ManuscriptIcon from "$lib/icons/ManuscriptIcon.svelte";
  import { AppBar } from "@skeletonlabs/skeleton";
</script>

<AppBar>
  <svelte:fragment slot="lead">
    <div class="flex items-center">
      <img src="/cmi.svg" alt="Clinician Toolkit" class="w-28" />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <form
      action="https://www.sciencedirect.com/science/article/pii/S1053811920308326"
    >
      <button class="btn hover:variant-soft-primary">
        <ManuscriptIcon class="text-lg" />
        <span>Publication</span>
      </button>
    </form>
    <form action="https://github.com/childmindresearch/cross-species-mapper">
      <button class="btn hover:variant-soft-primary">
        <GithubIcon class="text-lg" />
        <span>Source Code</span>
      </button>
    </form>
    <form action="https://github.com/TingsterX/alignment_macaque-human">
      <button class="btn hover:variant-soft-primary">
        <GithubIcon class="text-lg" />
        <span>Data</span>
      </button>
    </form>
  </svelte:fragment>
</AppBar>
