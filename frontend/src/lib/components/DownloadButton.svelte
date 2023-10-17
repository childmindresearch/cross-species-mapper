<script>
  export let text = "Download";
  export let data = {};
  export let filename = "data.json";
  export let iconSize = 20;

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

<button on:click={downloadData}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={iconSize}
    height={iconSize}
    fill="currentColor"
    class="bi bi-download"
    viewBox="0 0 16 16"
  >
    <path
      d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
    />
    <path
      d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
    />
  </svg>
  <div class="button_text">
    {text}
  </div>
</button>

<style>
  button {
    padding: 8px 16px;
    font-size: 16px;
    background-color: rgba(var(--color-theme-1), 0.2);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button:hover {
    background-color: rgba(var(--color-theme-2), 0.2);
  }
  svg {
    margin-right: 5px;
  }

  .button_text {
    white-space: nowrap;
  }
</style>
