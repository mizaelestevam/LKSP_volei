<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeProducts } from '../../data/storeProducts.js'
import { isInCart } from '../../data/cart.js'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['add-to-cart', 'remove-from-cart'])
const selectedSizes = ref({})

const tagParam = computed(() => (route.params.tag || '').toLowerCase())
const isSearchPage = computed(() => route.name === 'Search')
const shoeSizes = Array.from({ length: 13 }, (_, index) => String(34 + index))
const searchQuery = computed(() => {
  const query = route.query.q
  return Array.isArray(query) ? query[0] || '' : query || ''
})

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

function getProductSizes(product) {
  const normalizedText = `${product.tag || ''} ${product.title || ''}`.toUpperCase()
  return normalizedText.includes('TÊNIS') || normalizedText.includes('TENIS')
    ? shoeSizes
    : ['P', 'M', 'G', 'GG', 'XXG']
}

const categoryTitle = computed(() => {
  if (isSearchPage.value) return 'RESULTADOS DA BUSCA'

  const map = {
    masculino: 'MASCULINO',
    feminino: 'FEMININO',
    unissex: 'UNISSEX',
    tenis: 'TÊNIS',
    uniformes: 'UNIFORMES',
    tecnologia: 'TECNOLOGIA',
    sobre: 'SOBRE NÓS',
    'sobre-nos': 'SOBRE NÓS',
    sobrenos: 'SOBRE NÓS',
  }

  return map[tagParam.value] || 'PRODUTOS'
})

const products = computed(() => {
  const slug = tagParam.value

  if (isSearchPage.value) {
    const terms = normalizeSearchText(searchQuery.value).trim().split(/\s+/).filter(Boolean)
    if (!terms.length) return []

    return storeProducts.filter((product) => {
      const searchableText = normalizeSearchText(
        [product.title, product.tag, product.description, product.colorName, product.gender]
          .filter(Boolean)
          .join(' '),
      )
      return terms.every((term) => searchableText.includes(term))
    })
  }

  if (slug === 'masculino') {
    return storeProducts
      .filter((product) => {
        const isTennis = (product.tag || product.title || '').toUpperCase().includes('TÊNIS')
        return product.gender === 'masculino' || isTennis
      })
      .sort((first, second) => {
        const firstIsTennis = (first.tag || first.title || '').toUpperCase().includes('TÊNIS')
          ? 1
          : 0
        const secondIsTennis = (second.tag || second.title || '').toUpperCase().includes('TÊNIS')
          ? 1
          : 0
        return firstIsTennis - secondIsTennis
      })
  }

  if (slug === 'feminino') {
    return storeProducts
      .filter((product) => {
        const isTennis = (product.tag || product.title || '').toUpperCase().includes('TÊNIS')
        return product.gender === 'feminino' || isTennis
      })
      .sort((first, second) => {
        const firstIsTennis = (first.tag || first.title || '').toUpperCase().includes('TÊNIS')
          ? 1
          : 0
        const secondIsTennis = (second.tag || second.title || '').toUpperCase().includes('TÊNIS')
          ? 1
          : 0
        return firstIsTennis - secondIsTennis
      })
  }

  if (slug === 'unissex') {
    return storeProducts.filter((product) => product.gender === 'unissex')
  }

  if (slug === 'tenis') {
    return storeProducts.filter((product) =>
      (product.tag || product.title || '').toUpperCase().includes('TÊNIS'),
    )
  }

  if (slug === 'uniformes') {
    return storeProducts.filter(
      (product) =>
        !(product.tag || product.title || '').toUpperCase().includes('TÊNIS') &&
        !(product.tag || product.title || '').toUpperCase().includes('RELÓGIO'),
    )
  }

  if (slug === 'tecnologia') {
    const result = storeProducts.filter((product) =>
      (product.tag || product.title || '').toUpperCase().includes('RELÓGIO'),
    )
    return result.length ? result : storeProducts
  }

  if (slug === 'sobre' || slug === 'sobre-nos' || slug === 'sobrenos') {
    return storeProducts
  }

  return storeProducts
})

function abrirProduto(producto) {
  router.push(`/produto/${producto.id}`)
}

function toggleCartItem(product) {
  const size = selectedSizes.value[product.id]
  if (!size) return

  if (isInCart(product.id, size)) {
    emit('remove-from-cart', product.id, size)
    return
  }

  emit('add-to-cart', { ...product, tamanho: size })
}
</script>

<template>
  <section class="category-page">
    <div class="category-header">
      <button class="back-button" @click="router.push('/')">← VOLTAR</button>
      <p class="eyebrow">{{ isSearchPage ? 'BUSCA' : 'CATEGORIA' }}</p>
      <h1>{{ categoryTitle }}</h1>
      <p v-if="isSearchPage" class="search-query">Resultados para “{{ searchQuery }}”</p>
    </div>

    <div class="product-grid">
      <article
        v-for="product in products"
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

    <p v-if="!products.length" class="no-products">
      {{
        isSearchPage
          ? 'Nenhum produto encontrado para esta busca.'
          : 'Nenhum produto encontrado nesta categoria.'
      }}
    </p>
  </section>
</template>

<style scoped>
.category-page {
  max-width: 1360px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}

.category-header {
  margin-bottom: 2rem;
}

.back-button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(14, 26, 39, 0.9);
  color: rgba(227, 238, 255, 0.82);
  padding: 0.8rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.eyebrow {
  color: #b3d8ff;
  letter-spacing: 0.2em;
  font-size: 0.78rem;
  margin: 1.2rem 0 0.5rem;
  text-transform: uppercase;
}

.category-header h1 {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 4rem);
  letter-spacing: -0.05em;
}

.search-query {
  margin: 0.5rem 0 0;
  color: rgba(228, 236, 255, 0.7);
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
  cursor: pointer;
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

.no-products {
  color: rgba(228, 236, 255, 0.7);
  font-size: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 1080px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 760px) {
  .category-page {
    padding: 1.5rem 1rem 3rem;
  }

  .category-header {
    margin-bottom: 1.25rem;
  }

  .category-header h1 {
    font-size: clamp(1.8rem, 9vw, 2.7rem);
    overflow-wrap: anywhere;
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
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
