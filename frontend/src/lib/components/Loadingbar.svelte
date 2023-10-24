<script lang="ts">
  import { Shadow } from "svelte-loading-spinners";
</script>

<div class="loading">
  <Shadow size="30" color="#FF3E00" unit="px" duration="1s" />
  Loading data, this may take a moment...
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    gap: 2rem;
  }
</style>
