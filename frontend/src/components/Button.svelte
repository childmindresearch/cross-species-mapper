<script lang="ts">
  export let text: string;
  export let onClick: () => void;
</script>

<button on:click={onClick}>{text}</button>

<style>
  button {
    padding: 8px 16px;
    font-size: 16px;
    background-color: var(--color-theme-1);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--color-theme-1);
  }
</style>
