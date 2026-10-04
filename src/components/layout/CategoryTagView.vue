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

const categoryTitle = computed(() => {
  if (isSearchPage.value) return 'RESULTADOS DA BUSCA'

  const map = {
    masculino: 'MASCULINO',
    feminino: 'FEMININO',
    unissex: 'UNISSEX',
    tenis: 'TÊNIS',
    uniformes: 'UNIFORMES',
    tecnologia: 'TECNOLOGIA',
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
    return storeProducts.filter((product) =>
      (product.tag || product.title || '').toUpperCase().includes('RELÓGIO'),
    )
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
            v-for="size in ['P', 'M', 'G', 'GG', 'XXG']"
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
  max-width: 1380px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}

.category-header {
  margin-bottom: 2rem;
}

.back-button {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: #ebf2ff;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.06em;
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
  margin: 0.5rem 0 1rem;
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
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.28));
}

.product-card h3 {
  margin: 0.2rem 0 0.6rem;
  font-size: 1.2rem;
  line-height: 1.2;
}

.rating {
  color: #ffd96d;
  font-size: 0.9rem;
}

.rating span {
  color: rgba(228, 236, 255, 0.7);
}

.rating-new {
  color: #7ae5ff !important;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.sizes {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
  flex-wrap: wrap;
}

.sizes button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  color: #edf5ff;
  cursor: pointer;
}

.sizes button.selected {
  border-color: #7ae5ff;
  background: rgba(122, 229, 255, 0.14);
  color: #7ae5ff;
}

.price {
  margin-top: 0.9rem;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.product-card button {
  width: 100%;
  margin-top: 1rem;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  background: linear-gradient(90deg, #ff6adf, #8d7cff);
  color: #0b1120;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.product-card button.is-added {
  background: linear-gradient(90deg, #71dcff, #8ce4bd);
}

.product-card button:disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(228, 236, 255, 0.55);
  cursor: not-allowed;
}

.no-products {
  color: rgba(228, 236, 255, 0.7);
  font-size: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 980px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (max-width: 640px) {
  .category-page {
    padding: 1.25rem 1rem 3rem;
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
  }

  .product-card h3 {
    font-size: 0.9rem;
    line-height: 1.35;
  }

  .price {
    font-size: 1.15rem;
  }

  .product-card button {
    min-height: 42px;
    padding: 0.65rem 0.4rem;
    font-size: 0.58rem;
    line-height: 1.3;
  }

  .sizes {
    gap: 0.3rem;
  }

  .sizes button {
    min-width: 25px;
    height: 27px;
    font-size: 0.65rem;
  }
}

@media (max-width: 360px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
