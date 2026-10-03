<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeProducts } from '../../data/storeProducts.js'
import { isInCart } from '../../data/cart.js'

const router = useRouter()
const products = storeProducts
const emit = defineEmits(['add-to-cart', 'remove-from-cart'])
const activeFilter = ref('todos')
const sortOrder = ref('')

const visibleProducts = computed(() => {
  const filteredProducts = products.filter(
    (product) => activeFilter.value === 'todos' || product.gender === activeFilter.value,
  )

  if (sortOrder.value === 'price-asc') {
    return filteredProducts.sort((first, second) => first.price - second.price)
  }
  if (sortOrder.value === 'price-desc') {
    return filteredProducts.sort((first, second) => second.price - first.price)
  }
  if (sortOrder.value === 'title-asc') {
    return filteredProducts.sort((first, second) =>
      first.title.localeCompare(second.title, 'pt-BR', { sensitivity: 'base' }),
    )
  }

  return filteredProducts
})

function toggleCartItem(product) {
  if (isInCart(product.id)) {
    emit('remove-from-cart', product.id)
    return
  }

  emit('add-to-cart', product)
}

function abrirProduto(producto) {
  router.push(`/produto/${producto.id}`)
}
</script>

<template>
  <div class="hero-section">
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <div class="eyebrow">UNIFORMES</div>
      <h1>
        VÔLEI DE QUADRA
        <span>DESEMPENHO EM CADA MOVIMENTO.</span>
      </h1>

      <p>
        Uniformes desenvolvidos com tecnologia de ponta para performance, conforto e estilo. Mais
        leve, mais respirável e com o acabamento ideal para o alto rendimento.
      </p>

      <a class="cta-button" href="#catalogo">EXPLORAR COLEÇÃO <span>→</span></a>
    </div>

    <div class="hero-features">
      <div class="feature-item">
        <span class="feature-icon">≈</span>
        <div>
          <strong>TECIDO</strong>
          <small>RESPIRÁVEL</small>
        </div>
      </div>
      <div class="feature-item">
        <span class="feature-icon">◌</span>
        <div>
          <strong>LEVE E</strong>
          <small>CONFORTÁVEL</small>
        </div>
      </div>
      <div class="feature-item">
        <span class="feature-icon">✦</span>
        <div>
          <strong>LIBERDADE</strong>
          <small>DE MOVIMENTO</small>
        </div>
      </div>
      <div class="feature-item">
        <span class="feature-icon">◈</span>
        <div>
          <strong>ALTA</strong>
          <small>DURABILIDADE</small>
        </div>
      </div>
    </div>
  </div>

  <section id="catalogo" class="catalog-section">
    <div class="catalog-header">
      <div class="breadcrumbs">INÍCIO <span>›</span> UNIFORMES <span>›</span> VÔLEI DE QUADRA</div>
      <div class="filters">
        <button
          class="filter"
          :class="{ active: activeFilter === 'todos' }"
          :aria-pressed="activeFilter === 'todos'"
          @click="activeFilter = 'todos'"
        >
          TODOS
        </button>
        <button
          class="filter"
          :class="{ active: activeFilter === 'masculino' }"
          :aria-pressed="activeFilter === 'masculino'"
          @click="activeFilter = 'masculino'"
        >
          MASCULINO
        </button>
        <button
          class="filter"
          :class="{ active: activeFilter === 'feminino' }"
          :aria-pressed="activeFilter === 'feminino'"
          @click="activeFilter = 'feminino'"
        >
          FEMININO
        </button>
      </div>
      <select v-model="sortOrder" class="sort-button" aria-label="Ordenar produtos">
        <option value="">ORDENAR POR</option>
        <option value="price-desc">PREÇO: MAIOR PARA MENOR</option>
        <option value="price-asc">PREÇO: MENOR PARA MAIOR</option>
        <option value="title-asc">ORDEM ALFABÉTICA</option>
      </select>
    </div>

    <div class="product-grid">
      <article
        v-for="product in visibleProducts"
        :key="product.id"
        class="product-card"
        @click="abrirProduto(product)"
      >
        <div class="product-tag" :class="{ 'product-tag--male': product.gender === 'masculino' }">
          {{ product.tag }}
        </div>
        <div class="product-figure">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.title"
            class="product-image"
          />
        </div>
        <h3>{{ product.title }}</h3>
        <div class="rating">
          ★★★★★ <span>({{ product.rating }})</span>
        </div>
        <div class="sizes">
          <span>P</span><span>M</span><span>G</span><span>GG</span><span>XXG</span>
        </div>
        <div class="price">R$ {{ product.price.toFixed(2).replace('.', ',') }}</div>
        <button
          type="button"
          :class="{ 'is-added': isInCart(product.id) }"
          :aria-pressed="isInCart(product.id)"
          @click.stop="toggleCartItem(product)"
        >
          {{ isInCart(product.id) ? 'RETIRAR DO CARRINHO' : 'ADICIONAR AO CARRINHO' }}
        </button>
      </article>
    </div>
    <p v-if="!visibleProducts.length" class="no-products">Nenhum produto encontrado.</p>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 700px;
  padding: 4.5rem 2.5rem 2rem;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 0, 170, 0.18), transparent 22%),
    linear-gradient(
      120deg,
      rgba(8, 16, 32, 0.95) 0%,
      rgba(3, 10, 18, 0.96) 55%,
      rgba(12, 24, 46, 0.85) 100%
    );
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      120deg,
      transparent 35%,
      rgba(14, 82, 255, 0.2) 42%,
      rgba(255, 0, 170, 0.18) 52%,
      transparent 64%
    ),
    linear-gradient(135deg, transparent 15%, rgba(0, 255, 230, 0.08) 18%, transparent 28%);
  transform: skewY(-10deg) scale(1.4) translateY(-10%);
  opacity: 0.9;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding: 4rem 0 1.5rem;
}

.eyebrow {
  color: #b3d8ff;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(2.8rem, 5vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: #f5f8ff;
}

.hero-content h1 span {
  display: block;
  font-size: clamp(0.9rem, 1.8vw, 1.3rem);
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.8rem;
}

.hero-content p {
  max-width: 620px;
  margin-top: 1.5rem;
  color: rgba(226, 233, 255, 0.72);
  font-size: 1.02rem;
  line-height: 1.7;
}

.cta-button {
  display: inline-block;
  margin-top: 2rem;
  border: none;
  background: linear-gradient(90deg, #f3a0ff, #bc6eff 48%, #78d7ff);
  color: #0f1425;
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(191, 113, 255, 0.4);
  text-decoration: none;
}

.cta-button span {
  margin-left: 0.8rem;
}

.hero-features {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 3rem auto 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(10, 18, 32, 0.4);
  color: #edf4ff;
}

.feature-icon {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ff7fe8;
  font-size: 1.1rem;
}

.feature-item strong,
.feature-item small {
  display: block;
}

.feature-item strong {
  font-size: 0.85rem;
  letter-spacing: 0.04em;
}

.feature-item small {
  font-size: 0.68rem;
  color: rgba(225, 232, 255, 0.7);
  letter-spacing: 0.08em;
}

.catalog-section {
  max-width: 1360px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
  scroll-margin-top: 1rem;
}

.catalog-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.breadcrumbs {
  color: rgba(206, 221, 255, 0.75);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.breadcrumbs span {
  color: #f25ad3;
}

.filters {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.filter,
.sort-button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(14, 26, 39, 0.9);
  color: rgba(227, 238, 255, 0.82);
  padding: 0.8rem 1.1rem;
  border-radius: 10px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  font-weight: 700;
  text-transform: uppercase;
}

.sort-button {
  cursor: pointer;
  color-scheme: dark;
}

.filter.active {
  background: linear-gradient(90deg, rgba(255, 122, 230, 0.2), rgba(140, 156, 255, 0.2));
  border-color: rgba(255, 122, 230, 0.6);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 1.25rem;
}

.product-card {
  position: relative;
  padding: 1rem 1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(12, 19, 31, 0.95), rgba(10, 17, 27, 0.95));
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.product-tag {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  z-index: 2;
  background: linear-gradient(90deg, #f748c5, #ff8df2);
  color: #0c1020;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  font-weight: 800;
  padding: 0.35rem 0.5rem;
  border-radius: 999px;
}

.product-tag--male {
  background: linear-gradient(90deg, #54c9f0, #8be6ff);
  color: #071522;
}

.product-figure {
  position: relative;
  height: 230px;
  margin: 1.5rem 0 1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  mix-blend-mode: screen;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.28));
}

.product-figure::before,
.product-figure::after {
  display: none;
}

.product-card h3 {
  color: #f5f8ff;
  margin: 0.75rem 0 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 48px;
}

.rating {
  color: #ffce66;
  font-size: 0.7rem;
}

.rating span {
  color: rgba(225, 232, 255, 0.7);
}

.sizes {
  display: flex;
  gap: 0.4rem;
  margin: 0.85rem 0;
  flex-wrap: wrap;
}

.sizes span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(236, 241, 255, 0.75);
  font-size: 0.62rem;
}

.price {
  color: #ff84d9;
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0.3rem 0 1rem;
}

.product-card > button {
  width: 100%;
  border: 1px solid rgba(255, 116, 225, 0.8);
  background: rgba(255, 116, 225, 0.08);
  color: #fff5ff;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  padding: 0.9rem 0.75rem;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
}

.product-card > button.is-added {
  border-color: rgba(113, 220, 255, 0.75);
  background: rgba(75, 185, 255, 0.12);
  color: #8be6ff;
}

@media (max-width: 1080px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 760px) {
  .hero-section {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
  }

  .catalog-header {
    grid-template-columns: 1fr;
  }

  .filters {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .hero-features {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
