<script lang="ts">
  import { seedSide, seedSpecies, seedVertex, terms } from "$lib/store";
  import DownloadButton from "./DownloadButton.svelte";

  let displayTerms: string;
  let filename: string;

  function getDisplayTerms(terms: string[][]) {
    if (!$terms) {
      return "";
    }
    const first_ten = $terms.slice(0, 10);
    const labels = first_ten.map((term) => term[0]);
    return labels.join(", ");
  }
  $: displayTerms = getDisplayTerms($terms);
  $: filename = `neuroquery_${$seedSpecies}_${$seedSide}_${$seedVertex}.json`;
</script>

<div>
  <DownloadButton text="Top 100 Terms" data={$terms} {filename} />
  <i><b>Top 10 Neuroquery Terms:</b> {displayTerms}</i>
</div>
