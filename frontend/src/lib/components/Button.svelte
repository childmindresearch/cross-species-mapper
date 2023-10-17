<script lang="ts">
  export let text: string | null = null;
  export let contents: HTMLElement | null = null;
  export let onClick: () => void;

  if (!text && !contents) {
    throw new Error("Must provide either text or contents");
  }

  if (text && contents) {
    throw new Error("Must provide either text or contents, not both");
  }

  const buttonContent = text ? text : contents;
</script>

<button on:click={onClick}>{buttonContent}</button>

<style>
  button {
    padding: 8px 16px;
    font-size: 16px;
    background-color: rgb(var(--color-theme-1));
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: rgb(var(--color-theme-2));
  }
</style>
