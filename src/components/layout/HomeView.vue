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
const selectedSizes = ref({})

const shoeSizes = Array.from({ length: 13 }, (_, index) => String(34 + index))

function getProductSizes(product) {
  const normalizedText = `${product.tag || ''} ${product.title || ''}`.toUpperCase()
  return normalizedText.includes('TÊNIS') || normalizedText.includes('TENIS')
    ? shoeSizes
    : ['P', 'M', 'G', 'GG', 'XXG']
}

const visibleProducts = computed(() => {
  const filteredProducts = products
    .filter((product) => {
      if (activeFilter.value === 'todos') return true

      const isTennis = (product.tag || product.title || '').toUpperCase().includes('TÊNIS')

      if (activeFilter.value === 'unissex') {
        return product.gender === 'unissex' && !isTennis
      }

      if (activeFilter.value === 'masculino') {
        return product.gender === 'masculino' || isTennis
      }

      if (activeFilter.value === 'feminino') {
        return product.gender === 'feminino' || isTennis
      }

      return false
    })
    .sort((first, second) => {
      const firstIsTennis = (first.tag || first.title || '').toUpperCase().includes('TÊNIS') ? 1 : 0
      const secondIsTennis = (second.tag || second.title || '').toUpperCase().includes('TÊNIS')
        ? 1
        : 0

      if (activeFilter.value === 'masculino' || activeFilter.value === 'feminino') {
        return firstIsTennis - secondIsTennis
      }

      return 0
    })

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
  const size = selectedSizes.value[product.id]
  if (!size) return

  if (isInCart(product.id, size)) {
    emit('remove-from-cart', product.id, size)
    return
  }

  emit('add-to-cart', { ...product, tamanho: size })
}

function abrirProduto(producto) {
  router.push(`/produto/${producto.id}`)
}
</script>

<template>
  <div class="hero-section">
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <div class="eyebrow">LKSP SPORTSTECH</div>
      <h1>
        TECNOLOGIA QUE
        <span>MOVE O ESPORTE.</span>
      </h1>

      <p>
        Inovação em cada movimento.<br />
        <br />
        Desenvolvemos soluções esportivas que integram tecnologia, desempenho e conforto. Do
        vestuário inteligente aos equipamentos conectados, transformamos a experiência dentro e
        fora das quadras.
      </p>

      <a class="cta-button" href="#catalogo">CONHEÇA A LKSP <span>→</span></a>
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
        <button
          class="filter"
          :class="{ active: activeFilter === 'unissex' }"
          :aria-pressed="activeFilter === 'unissex'"
          @click="activeFilter = 'unissex'"
        >
          UNISSEX
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
          <template v-if="product.rating"
            >★★★★★ <span>({{ product.rating }})</span></template
          >
          <span v-else class="rating-new">KIT COMPLETO</span>
        </div>
        <div class="sizes">
          <button
            v-for="size in getProductSizes(product)"
            :key="size"
            type="button"
            :class="{ selected: selectedSizes[product.id] === size }"
            :aria-pressed="selectedSizes[product.id] === size"
            :aria-label="`Selecionar tamanho ${size} para ${product.title}`"
            @click.stop="selectedSizes[product.id] = size"
          >
            {{ size }}
          </button>
        </div>
        <div class="price">R$ {{ product.price.toFixed(2).replace('.', ',') }}</div>
        <button
          type="button"
          :class="{ 'is-added': isInCart(product.id, selectedSizes[product.id]) }"
          :aria-pressed="isInCart(product.id, selectedSizes[product.id])"
          :disabled="!selectedSizes[product.id]"
          @click.stop="toggleCartItem(product)"
        >
          {{
            !selectedSizes[product.id]
              ? 'ESCOLHA UM TAMANHO'
              : isInCart(product.id, selectedSizes[product.id])
                ? 'RETIRAR DO CARRINHO'
                : 'ADICIONAR AO CARRINHO'
          }}
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
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(2.8rem, 5vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 900;
  color: #f5f8ff;
}

.hero-content h1 span {
  display: block;
  font-size: clamp(0.9rem, 1.8vw, 1.3rem);
  letter-spacing: 0.04em;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  border: none;
  background: linear-gradient(90deg, #f3a0ff, #bc6eff 48%, #78d7ff);
  color: #0f1425;
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  padding: 1rem 2.4rem;
  border-radius: 0.8rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(191, 113, 255, 0.4);
  text-decoration: none;
  min-width: 360px;
  text-align: center;
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

.rating-new {
  color: #7ae5ff !important;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.sizes {
  display: flex;
  gap: 0.4rem;
  margin: 0.85rem 0;
  flex-wrap: wrap;
}

.sizes button {
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
  cursor: pointer;
}

.sizes button.selected {
  border-color: #7ae5ff;
  background: rgba(122, 229, 255, 0.14);
  color: #7ae5ff;
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

.product-card > button:disabled {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(236, 241, 255, 0.6);
  cursor: not-allowed;
}

@media (max-width: 1080px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 760px) {
  .hero-section {
    min-height: 0;
    padding: 1.5rem 1rem 1.25rem;
  }

  .hero-content {
    padding: 2rem 0 0.5rem;
  }

  .hero-content h1 {
    font-size: clamp(2.25rem, 11vw, 3.5rem);
    line-height: 1;
  }

  .hero-content p {
    margin-top: 1rem;
    font-size: 0.92rem;
  }

  .cta-button {
    margin-top: 1.25rem;
    padding: 0.85rem 1rem;
    font-size: 0.78rem;
  }

  .hero-section {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .catalog-header {
    grid-template-columns: 1fr;
    gap: 0.85rem;
    margin-bottom: 1.25rem;
  }

  .catalog-section {
    padding: 1.5rem 1rem 3rem;
  }

  .filters {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding: 0.1rem 0 0.4rem;
    scrollbar-width: thin;
  }

  .filter {
    flex: 0 0 auto;
    padding: 0.7rem 0.85rem;
    font-size: 0.68rem;
  }

  .sort-button {
    width: 100%;
    min-height: 44px;
  }

  .hero-features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
    margin-top: 1.5rem;
  }

  .feature-item {
    gap: 0.55rem;
    padding: 0.7rem;
  }

  .feature-item strong {
    font-size: 0.72rem;
  }

  .feature-item small {
    font-size: 0.58rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.7rem;
  }

  .product-card {
    min-width: 0;
    padding: 0.7rem;
  }

  .product-figure {
    height: clamp(135px, 42vw, 210px);
    margin: 0.5rem 0 0.65rem;
  }

  .product-card h3 {
    min-height: 0;
    font-size: 0.86rem;
    line-height: 1.35;
  }

  .product-card > button {
    min-height: 42px;
    padding: 0.65rem 0.4rem;
    font-size: 0.58rem;
    line-height: 1.3;
  }

  .sizes {
    gap: 0.3rem;
  }

  .sizes button {
    width: 1.7rem;
    height: 1.7rem;
  }
}

@media (max-width: 360px) {
  .hero-features {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
