<script>
  import DownloadIcon from "$lib/icons/DownloadIcon.svelte";

  export let text = "Download";
  export let data = {};
  export let filename = "data.json";

  function downloadData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
</script>

<button on:click={downloadData} class="btn variant-soft-primary">
  <DownloadIcon class="mr-1" />
  {text}
</button>
