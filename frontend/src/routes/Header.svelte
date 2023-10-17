<header>
  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li>
        <a
          href="https://www.sciencedirect.com/science/article/pii/S1053811920308326"
          >Publication</a
        >
      </li>
      <li>•</li>
      <li>
        <div style="display: flex; align-items: center;">
          <a href="https://github.com/TingsterX/alignment_macaque-human"
            >Data Repository</a
          >
        </div>
      </li>
      <li>•</li>
      <li>
        <div style="display: flex; align-items: center;">
          <a href="https://github.com/cmi-dair/cross-species-mapper"
            >Code Repository</a
          >
        </div>
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>
  <vertical-spacing />
</header>

<style>
  header {
    display: flex;
    justify-content: center;
  }

  nav {
    display: flex;
    justify-content: center;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
    gap: 0.5rem;
  }

  li {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: rgb(var(--color-theme-1));
  }

  vertical-spacing {
    height: 30px;
  }

  /* Media queries */
  @media only screen and (max-width: 600px) {
    nav a {
      font-size: 0.5em;
    }
  }
</style>
