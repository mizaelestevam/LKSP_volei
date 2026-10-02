<script></script>
<template>
  <section class="hero">
    <div class="hero-content">
      <h3 class="outlined">Livro destaque</h3>
      <h2>Memórias Póstumas de Brás Cubas</h2>
      <p>
        Narrado por um defunto autor, o romance apresenta as memórias de Brás Cubas. Com humor e
        sarcasmo, ele revisita sua vida e seus fracassos. A obra rompe padrões tradicionais da
        narrativa. Machado de Assis critica a sociedade brasileira do século XIX. Um marco do
        realismo nacional.
      </p>
      <button>
        <RouterLink to="/livro/1"> Acessar página do livro </RouterLink>
      </button>
    </div>
    <div class="hero-image">
      <img src="/booksImgs/memorias-postumas-de-bras-cubas.png" alt="Hero Image" />
    </div>
  </section>
</template>
<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2vh 3vw;

  & h2 {
    color: #6f363a;
    font-size: 3rem;
    font-weight: 700;
  }

  & .hero-content {
    width: 50%;
    padding-right: 20px;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;

    & h3.outlined {
      background-color: transparent;
      color: #6f363a;
      border: 2px solid #6f363a;
      padding: 15px 10px;
      border-radius: 5px;
      font-size: 1rem;
    }

    p {
      width: 100%;
    }

    & button {
      background-color: transparent;
      border: 2px solid #6f363a;
      color: #6f363a;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.3s ease;

      & a {
        color: #6f363a;
        text-decoration: none;
      }
    }

    & button:hover {
      background-color: #6f363a;
      color: #ede2cf;
      & a {
        color: #ede2cf;
      }
    }
  }

  & .hero-image {
    width: 50%;
    text-align: right;
    padding-right: 4vw;

    & img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
