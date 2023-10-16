<script lang="ts">
  import { terms } from "$lib/store";
  import Button from "./Button.svelte";

  let displayTerms: string;

  function getDisplayTerms(terms: string[][]) {
    if (!$terms) {
      return "";
    }
    const first_ten = $terms.slice(0, 10);
    const labels = first_ten.map((term) => term[0]);
    return labels.join(", ");
  }
  $: displayTerms = getDisplayTerms($terms);

</script>

<div class="neuroquery">
  <i><b>Top 10 Neuroquery Terms:</b> {displayTerms}</i>
  <Button
    text="Download Terms"
    onClick={() => {
      const element = document.createElement("a");
      const file = new Blob([$terms.join("\n")], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "neuroquery_terms.txt";
      document.body.appendChild(element);
      element.click();
    }}
  />
</div>

<style>
  .neuroquery {
    margin: 1em;
  }
</style>
