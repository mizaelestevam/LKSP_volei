<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeProducts } from '../../data/storeProducts.js'
import { isInCart } from '../../data/cart.js'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['add-to-cart', 'remove-from-cart'])

const currentImageIndex = ref(0)
const selectedSize = ref('')
const sizeError = ref('')
const isPortraitImage = ref(false)

const catalog = storeProducts

const product = computed(() => {
  return catalog.find((item) => item.id === Number(route.params.id)) || catalog[0]
})

const colorVariants = computed(() => {
  const colorGroup = product.value.colorGroup
  if (!colorGroup) return [product.value]

  return catalog.filter((item) => item.colorGroup === colorGroup)
})

const recommendation = computed(() => {
  const currentTag = product.value.tag || product.value.title || ''
  const normalizedTag = currentTag.toUpperCase()

  if (normalizedTag.includes('RELÓGIO')) {
    const currentColor = (product.value.colorName || '').toLowerCase()
    const targetColor = currentColor.includes('preto') ? 'branco' : 'preto'

    const oppositeColorWatch = catalog.find(
      (item) =>
        item.id !== product.value.id &&
        (item.tag || item.title || '').toUpperCase().includes('RELÓGIO') &&
        (item.colorName || '').toLowerCase().includes(targetColor),
    )

    return oppositeColorWatch || null
  }

  if (normalizedTag.includes('TÊNIS')) {
    return null
  }

  const baseTag = currentTag.replace(/\s+(FEMININA|MASCULINA)$/i, '').trim()
  const oppositeGender = product.value.gender === 'masculino' ? 'feminino' : 'masculino'

  return (
    catalog.find(
      (item) =>
        item.id !== product.value.id &&
        (item.tag || item.title || '').replace(/\s+(FEMININA|MASCULINA)$/i, '').trim() ===
          baseTag &&
        item.gender === oppositeGender,
    ) || null
  )
})

const formatPrice = computed(() => `R$ ${product.value.price.toFixed(2).replace('.', ',')}`)
const productInCart = computed(
  () => Boolean(selectedSize.value) && isInCart(product.value.id, selectedSize.value),
)

const productImages = computed(() => product.value.images || [])

const currentImage = computed(() => {
  const images = productImages.value
  if (!images.length) return ''
  return images[currentImageIndex.value % images.length]
})

function previousImage() {
  if (!productImages.value.length) return
  currentImageIndex.value =
    (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length
}

function nextImage() {
  if (!productImages.value.length) return
  currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
}

function selectImage(index) {
  currentImageIndex.value = index
}

function selectSize(size) {
  selectedSize.value = size
  sizeError.value = ''
}

function selectColorVariant(variant) {
  if (variant.id === product.value.id) return

  currentImageIndex.value = 0
  selectedSize.value = ''
  sizeError.value = ''
  isPortraitImage.value = false
  router.push(`/produto/${variant.id}`)
}

function updateImageOrientation(event) {
  const image = event.target
  isPortraitImage.value = image.naturalHeight > image.naturalWidth
}

function voltar() {
  router.push('/')
}

function adicionarAoCarrinho() {
  if (!selectedSize.value) {
    sizeError.value = 'Selecione um tamanho antes de adicionar ao carrinho.'
    return
  }

  if (productInCart.value) {
    emit('remove-from-cart', product.value.id, selectedSize.value || undefined)
    return
  }

  sizeError.value = ''
  emit('add-to-cart', { ...product.value, tamanho: selectedSize.value })
}
</script>

<template>
  <section class="detail-page">
    <div class="detail-shell">
      <button class="back-button" @click="voltar">← VOLTAR</button>

      <div class="detail-layout">
        <div class="detail-visual">
          <div class="image-stage">
            <button
              v-if="productImages.length > 1"
              class="carousel-button left"
              @click="previousImage"
              aria-label="Imagem anterior"
            >
              ‹
            </button>

            <div class="image-frame">
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="product.title"
                class="detail-product-image"
                :class="{ portrait: isPortraitImage }"
                @load="updateImageOrientation"
              />
            </div>

            <button
              v-if="productImages.length > 1"
              class="carousel-button right"
              @click="nextImage"
              aria-label="Próxima imagem"
            >
              ›
            </button>
          </div>

          <div class="thumbnail-row" v-if="productImages.length > 1">
            <button
              v-for="(image, index) in productImages"
              :key="image"
              class="thumbnail-button"
              :class="{ active: index === currentImageIndex }"
              @click="selectImage(index)"
              :aria-label="`Selecionar imagem ${index + 1}`"
            >
              <img :src="image" :alt="`${product.title} ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="detail-info">
          <div v-if="product.gender === 'unissex'" class="detail-tag detail-tag--unisex">
            UNISSEX
          </div>
          <div
            v-else
            class="detail-tag"
            :class="{ 'detail-tag--male': product.gender === 'masculino' }"
          >
            {{ product.gender === 'masculino' ? 'MASCULINO' : 'FEMININO' }}
          </div>
          <h1>{{ product.title }}</h1>
          <div class="price">{{ formatPrice }}</div>

          <p class="description">
            <template v-if="product.descriptionLead">
              <strong>{{ product.descriptionLead }}</strong>
              {{ product.descriptionRight }}
            </template>
            <template v-else>{{ product.description }}</template>
          </p>

          <div class="swatches">
            <span v-if="colorVariants.length > 1">CORES DISPONÍVEIS</span>
            <span v-else>COR DO PRODUTO: {{ product.colorName }}</span>
            <div class="swatch-row">
              <button
                v-for="variant in colorVariants"
                :key="variant.id"
                type="button"
                class="swatch-option"
                :class="{ selected: variant.id === product.id }"
                :aria-label="`Selecionar cor ${variant.colorName}`"
                :aria-pressed="variant.id === product.id"
                :title="variant.colorName"
                @click="selectColorVariant(variant)"
              >
                <i
                  class="swatch"
                  :style="{ background: variant.swatchColor || variant.color }"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>

          <div class="sizes">
            <button
              v-for="size in ['P', 'M', 'G', 'GG', 'XXG']"
              :key="size"
              type="button"
              :class="{ selected: selectedSize === size }"
              :aria-pressed="selectedSize === size"
              @click="selectSize(size)"
            >
              {{ size }}
            </button>
          </div>
          <p v-if="sizeError" class="size-error" role="alert">{{ sizeError }}</p>

          <button
            class="buy-button"
            :class="{ 'is-added': productInCart }"
            :aria-pressed="productInCart"
            @click="adicionarAoCarrinho"
          >
            {{ productInCart ? 'RETIRAR DO CARRINHO' : 'ADICIONAR AO CARRINHO' }}
          </button>
        </div>

        <aside v-if="recommendation" class="recommendation-box">
          <p>RECOMENDAÇÃO</p>
          <div class="mini-figure">
            <img :src="recommendation.image" :alt="recommendation.title" />
          </div>
          <h3>{{ recommendation.title }}</h3>
          <button @click="router.push(`/produto/${recommendation.id}`)">VER MODELO</button>
        </aside>

        <aside v-else class="recommendation-box recommendation-box--unisex">
          <p>UNISSEX</p>
          <div class="mini-figure mini-figure--unisex">
            <img :src="product.image" :alt="product.title" />
          </div>
          <h3>{{ product.title }}</h3>
        </aside>
      </div>

      <section v-if="product.descriptionProductFeatures" class="product-description">
        <h2>Descrição do produto</h2>
        <ul class="product-features">
          <li v-for="feature in product.descriptionProductFeatures" :key="feature.title">
            <strong>{{ feature.title }}</strong>
            <template v-if="feature.system">
              (<em>{{ feature.system }}</em
              >)</template
            >:
            <template v-if="feature.parts">
              <template v-for="(part, index) in feature.parts" :key="index">
                <em v-if="part.emphasis === 'italic'">{{ part.text }}</em>
                <template v-else>{{ part.text }}</template>
              </template>
            </template>
            <template v-else>{{ feature.text }}</template>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 3rem 2rem 4rem;
  background:
    radial-gradient(circle at top left, rgba(255, 90, 210, 0.2), transparent 26%),
    radial-gradient(circle at bottom right, rgba(89, 176, 255, 0.16), transparent 24%),
    linear-gradient(180deg, #040c1a 0%, #020b14 100%);
}

.detail-shell {
  max-width: 1300px;
  margin: 0 auto;
  background: rgba(10, 16, 29, 0.93);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 1.25rem 1.5rem 1.5rem;
  box-shadow: 0 26px 48px rgba(0, 0, 0, 0.4);
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

.detail-layout {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.7fr;
  gap: 1.5rem;
  align-items: center;
}

.product-description {
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(221, 228, 250, 0.8);
}

.product-description h2 {
  margin: 0 0 0.65rem;
  color: #f5f7ff;
  font-size: 1.1rem;
}

.product-features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.product-features li {
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.7;
}

.product-features strong {
  color: #f5f7ff;
  font-weight: 800;
}

.product-features em {
  color: #7ae5ff;
}

@media (max-width: 760px) {
  .product-features {
    grid-template-columns: 1fr;
  }
}

.detail-visual {
  min-height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 110, 200, 0.09), rgba(103, 166, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  overflow: hidden;
  padding: 1rem;
}

.image-stage {
  width: 100%;
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 14px;
}

.image-frame {
  position: absolute;
  inset: 0;
}

.carousel-button {
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: #edf5ff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.carousel-button.left {
  left: 0.75rem;
}

.carousel-button.right {
  right: 0.75rem;
}

.detail-product-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: none;
  filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.35));
  background: transparent;
}

.detail-product-image.portrait {
  object-fit: contain;
  padding: 0.75rem;
  box-sizing: border-box;
}

.thumbnail-row {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-bottom: 0.25rem;
}

.thumbnail-button {
  width: 72px;
  height: 72px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.thumbnail-button.active {
  border-color: rgba(255, 127, 233, 0.9);
  transform: translateY(-2px);
}

.thumbnail-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail-figure {
  position: relative;
  width: min(82%, 440px);
  height: 460px;
  border-radius: 28px;
  transform: rotate(-8deg);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.detail-figure::before,
.detail-figure::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.detail-figure--dark {
  background: linear-gradient(135deg, rgba(255, 90, 220, 0.9), rgba(77, 86, 247, 0.8));
}

.detail-figure--dark::before {
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(7, 10, 18, 0.8) 25%,
    rgba(7, 10, 18, 0.8) 70%,
    transparent 70%
  );
}

.detail-figure--dark-alt {
  background: linear-gradient(135deg, rgba(95, 205, 255, 0.8), rgba(106, 87, 245, 0.8));
}

.detail-figure--dark-alt::before {
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(10, 13, 20, 0.82) 25%,
    rgba(10, 13, 20, 0.82) 70%,
    transparent 70%
  );
}

.detail-figure--white {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(132, 173, 255, 0.7));
}

.detail-figure--white::before {
  background: linear-gradient(
    90deg,
    transparent 23%,
    rgba(16, 25, 34, 0.8) 23%,
    rgba(16, 25, 34, 0.8) 69%,
    transparent 69%
  );
}

.detail-figure--black {
  background: linear-gradient(135deg, rgba(17, 27, 39, 0.95), rgba(77, 84, 255, 0.8));
}

.detail-figure--black::before {
  background: linear-gradient(
    90deg,
    transparent 24%,
    rgba(18, 24, 32, 0.92) 24%,
    rgba(18, 24, 32, 0.92) 68%,
    transparent 68%
  );
}

.detail-info {
  color: #ecf3ff;
}

.detail-tag {
  display: inline-block;
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  color: #ff88da;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.02);
}

.detail-tag--male {
  border-color: rgba(113, 220, 255, 0.35);
  color: #71dcff;
  background: rgba(75, 185, 255, 0.08);
}

.detail-tag--unisex {
  border-color: rgba(142, 163, 255, 0.35);
  color: #a8b8ff;
  background: rgba(129, 140, 248, 0.1);
}

.detail-info h1 {
  margin: 1rem 0 0.6rem;
  font-size: clamp(2rem, 3vw, 3.2rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.price {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.description {
  margin-top: 1rem;
  color: rgba(221, 228, 250, 0.8);
  line-height: 1.7;
  font-size: 1rem;
}

.description strong {
  color: #f5f7ff;
  font-weight: 800;
}

.description em {
  color: #7ae5ff;
}

.swatches {
  margin-top: 1.5rem;
}

.swatches > span {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: rgba(224, 235, 255, 0.68);
  margin-bottom: 0.65rem;
}

.swatch-row {
  display: flex;
  gap: 0.35rem;
}

.swatch-option {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.swatch-option:hover,
.swatch-option:focus-visible,
.swatch-option.selected {
  border-color: #7ae5ff;
  outline: none;
}

.swatch-option.selected {
  box-shadow: 0 0 0 2px rgba(122, 229, 255, 0.18);
}

.swatch {
  width: 23px;
  height: 23px;
  display: block;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.sizes {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.3rem;
  flex-wrap: wrap;
}

.sizes button {
  min-width: 42px;
  padding: 0.6rem 0.4rem;
  text-align: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f0f5ff;
  font-weight: 700;
  cursor: pointer;
}

.sizes button.selected {
  background: rgba(255, 106, 223, 0.16);
  border-color: #ff6adf;
  color: #ff9be9;
  box-shadow: inset 0 0 0 1px rgba(255, 106, 223, 0.16);
}

.size-error {
  margin: 0.55rem 0 0;
  color: #ff9be6;
  font-size: 0.82rem;
}

.buy-button {
  width: 100%;
  margin-top: 1.6rem;
  border: none;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  background: linear-gradient(90deg, #ff6adf, #8d7cff);
  color: #0b1120;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.buy-button.is-added {
  background: linear-gradient(90deg, #71dcff, #8ce4bd);
}

.recommendation-box button {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #f4f7ff;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  align-self: stretch;
}

.recommendation-box {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  color: #edf6ff;
}

.recommendation-box p {
  margin: 0 0 0.8rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: rgba(227, 237, 255, 0.7);
  text-transform: uppercase;
}

.recommendation-box--unisex {
  background: rgba(121, 135, 255, 0.05);
  border-color: rgba(136, 163, 255, 0.25);
}

.recommendation-box--unisex p {
  color: #99b2ff;
}

.mini-figure {
  height: 180px;
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.mini-figure img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: screen;
}

.mini-figure--unisex {
  border: 1px solid rgba(153, 178, 255, 0.2);
}

.recommendation-box h3 {
  margin: 0.9rem 0 1rem;
  font-size: 1.2rem;
  line-height: 1.3;
}

.recommendation-box button {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #f4f7ff;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 980px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-visual {
    min-height: 0;
  }

  .recommendation-box {
    max-width: 420px;
    width: 100%;
  }

  .image-stage {
    aspect-ratio: 1;
  }

  .carousel-button {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 640px) {
  .detail-page {
    padding: 1.25rem 0.75rem 2.5rem;
  }

  .detail-shell {
    padding: 0.85rem;
    border-radius: 16px;
  }

  .detail-layout {
    margin-top: 1rem;
    gap: 1rem;
  }

  .detail-visual {
    padding: 0.65rem;
    border-radius: 15px;
  }

  .image-stage {
    max-height: min(82vw, 420px);
  }

  .thumbnail-row {
    gap: 0.5rem;
    overflow-x: auto;
    justify-content: flex-start;
  }

  .thumbnail-button {
    flex: 0 0 58px;
    width: 58px;
    height: 58px;
  }

  .detail-info h1 {
    font-size: clamp(1.8rem, 9vw, 2.5rem);
    overflow-wrap: anywhere;
  }

  .price {
    font-size: 1.65rem;
  }

  .description {
    font-size: 0.92rem;
  }

  .recommendation-box {
    max-width: none;
  }
}
</style>
