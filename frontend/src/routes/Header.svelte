<script lang="ts">
  import {
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Navbar,
  } from "flowbite-svelte";

  let divClass = "w-full ml-auto md:block md:w-auto order-1 md:order-none";
  let ulClass =
    "flex flex-col my-4 md:flex-row md:my-0 text-md font-bold text-gray-900 gap-8";
</script>

<header>
  <Navbar color="none" fluid>
    <NavBrand href="/">
      <span
        class="self-center whitespace-nowrap text-2xl font-semibold text-gray-900"
      >
        Inter-Species Map
      </span>
    </NavBrand>
    <NavHamburger />
    <NavUl
      {divClass}
      {ulClass}
      nonActiveClass="md:!pl-3 md:!py-2 md:!pl-0 text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700"
      activeClass="md:!pl-3 md:!py-2 md:!pl-0 text-white bg-primary-700 md:bg-transparent md:text-primary-700  cursor-default"
    >
      <NavLi
        href="https://www.sciencedirect.com/science/article/pii/S1053811920308326"
      >
        Publication
      </NavLi>
      <NavLi href="https://github.com/TingsterX/alignment_macaque-human">
        Data Repository
      </NavLi>
      <NavLi href="https://github.com/childmindresearch/cross-species-mapper">
        Source Code
      </NavLi>
    </NavUl>
  </Navbar>
</header>
