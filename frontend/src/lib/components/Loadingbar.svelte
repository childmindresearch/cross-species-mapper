<!--
Component for displaying a loading bar with a progress radial.

@component LoadingBar

@param {number | undefined} value - The value of the progress radial, if undefined
then it keeps spinning forever.
@param {string | undefined} label - The label to display below the progress radial.
-->
<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";

  export let value: number | undefined = undefined;
  export let label: string | undefined = undefined;

  const stroke = 100;
  const width = "w-12";
  const meter = "stroke-primary-500";
  const track = "stroke-primary-500/20";
  const strokeLinecap = "round";
</script>

<div class="mx-auto flex justify-center items-center">
  <ProgressRadial {value} {meter} {track} {stroke} {width} {strokeLinecap} />
</div>
{#if label}
  <p class="text-center text-md pt-2">{label}</p>
{/if}
