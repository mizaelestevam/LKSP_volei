<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from './components/layout/AppFooter.vue'
import {
  addToCart,
  cartCount,
  cartItems,
  cartTotal,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from './data/cart.js'

const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
  console.log('Pesquisando por:', searchQuery.value)
}

const navigation = [
  { label: 'HOME', href: '/' },
  { label: 'MASCULINO', href: '#' },
  { label: 'FEMININO', href: '#' },
  { label: 'TÊNIS', href: '#' },
  { label: 'UNIFORMES', href: '#' },
  { label: 'TECNOLOGIA', href: '#' },
  { label: 'SOBRE', href: '/equipe' },
]

const categoryDetails = {
  HOME: {
    title: 'KIT OFICIAL LKSP',
    subtitle: 'VÔLEI DE QUADRA',
    price: 'R$ 349,90',
    description:
      'Desempenho, conforto e tecnologia em cada movimento. O uniforme oficial LKSP foi desenvolvido para quem busca leveza, estilo e performance.',
    accent: '#ff5fd2',
    image: 'linear-gradient(135deg, rgba(255,95,210,0.9), rgba(89,136,255,0.7))',
  },
  MASCULINO: {
    title: 'KIT MASCULINO',
    subtitle: 'DESEMPENHO TOTAL',
    price: 'R$ 389,90',
    description:
      'Coleção masculina com modelagem esportiva, tecido respirável e acabamento premium para quadra e treino.',
    accent: '#7ce7ff',
    image: 'linear-gradient(135deg, rgba(85,163,255,0.9), rgba(112,218,255,0.7))',
  },
  FEMININO: {
    title: 'KIT FEMININO',
    subtitle: 'ESTILO E FORÇA',
    price: 'R$ 399,90',
    description:
      'Linha feminina com visual moderno, conforto extremo e liberdade de movimento para performance em alto nível.',
    accent: '#ff78d9',
    image: 'linear-gradient(135deg, rgba(255,98,178,0.9), rgba(144,94,255,0.7))',
  },
  TÊNIS: {
    title: 'COLLECTION TÊNIS',
    subtitle: 'VIBE DE PERFORMANCE',
    price: 'R$ 429,90',
    description:
      'Soluções pensadas para quem tem estilo e exige leveza, aderência e conforto em cada passo.',
    accent: '#89f0a6',
    image: 'linear-gradient(135deg, rgba(74,196,131,0.8), rgba(78,110,255,0.75))',
  },
  UNIFORMES: {
    title: 'UNIFORMES LKSP',
    subtitle: 'EQUIPAMENTO PROFISSIONAL',
    price: 'R$ 459,90',
    description:
      'Uniformes para quadra com tecnologia de ventilação e cortes funcionais para máxima mobilidade.',
    accent: '#f4c957',
    image: 'linear-gradient(135deg, rgba(255,194,87,0.8), rgba(255,96,176,0.7))',
  },
  TECNOLOGIA: {
    title: 'TECNOLOGIA LKSP',
    subtitle: 'INOVAÇÃO EM TEXTIL',
    price: 'R$ 469,90',
    description:
      'Materiais inteligentes com respirabilidade, secagem rápida e acabamento premium para alto desempenho.',
    accent: '#85d4ff',
    image: 'linear-gradient(135deg, rgba(72,153,255,0.8), rgba(123,104,255,0.7))',
  },
  SOBRE: {
    title: 'SOBRE NÓS',
    subtitle: 'A HISTÓRIA DA MARCA',
    price: 'LKSP',
    description:
      'Uma marca apaixonada por performance e identidade visual, focada em roupa esportiva com design irado e tecnologia premium.',
    accent: '#ff86d9',
    image: 'linear-gradient(135deg, rgba(255,104,211,0.8), rgba(117,118,255,0.75))',
  },
}

const activePanel = ref(null)

function openMenuPanel(item, event) {
  if (item.href === '#' || item.href === '') {
    event.preventDefault()
    activePanel.value = item.label
    return
  }

  if (item.href === '/equipe') {
    activePanel.value = null
    return
  }

  activePanel.value = null
}

function closePanel() {
  activePanel.value = null
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <RouterLink to="/" class="logo" aria-label="LKSP, página inicial">LKSP</RouterLink>
      </div>

      <nav class="nav-section" aria-label="Menu principal">
        <ul class="nav-menu">
          <li v-for="item in navigation" :key="item.label">
            <a :href="item.href" class="nav-link" @click="openMenuPanel(item, $event)">{{
              item.label
            }}</a>
          </li>
        </ul>
      </nav>

      <div class="header-tools">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button" title="Buscar">
            <i class="mdi mdi-magnify"></i>
          </button>
        </div>

        <div class="icons-group">
          <RouterLink to="/carrinho" class="icon-button" title="Carrinho">
            <i class="mdi mdi-cart-outline"></i>
            <span v-if="cartCount" class="cart-count">{{ cartCount }}</span>
          </RouterLink>
          <button class="icon-button" title="Perfil">
            <i class="mdi mdi-account"></i>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div v-if="activePanel" class="menu-panel-backdrop" @click="closePanel"></div>
  <aside
    v-if="activePanel"
    class="menu-panel"
    :style="{ '--panel-accent': categoryDetails[activePanel]?.accent || '#ff5fd2' }"
  >
    <button class="panel-close" @click="closePanel" aria-label="Fechar aba">×</button>

    <div
      class="panel-visual"
      :style="{
        background:
          categoryDetails[activePanel]?.image || 'linear-gradient(135deg, #ff5fd2, #7a7cff)',
      }"
    >
      <div class="panel-badge">LANÇAMENTO</div>
      <div class="panel-figure"></div>
    </div>

    <div class="panel-content">
      <p class="panel-kicker">{{ categoryDetails[activePanel]?.subtitle || 'COLEÇÃO' }}</p>
      <h2>{{ categoryDetails[activePanel]?.title || 'KIT OFICIAL' }}</h2>
      <div class="panel-price">{{ categoryDetails[activePanel]?.price || 'R$ 349,90' }}</div>
      <p class="panel-description">
        {{
          categoryDetails[activePanel]?.description ||
          'Coleção premium com estilo, conforto e tecnologia para alto rendimento.'
        }}
      </p>

      <div class="panel-options">
        <span>CORES DISPONÍVEIS</span>
        <div class="color-row">
          <i class="color-chip magenta"></i>
          <i class="color-chip cyan"></i>
          <i class="color-chip violet"></i>
        </div>
      </div>

      <button class="panel-button">ADICIONAR AO CARRINHO</button>
    </div>
  </aside>

  <main class="page-shell">
    <RouterView v-slot="{ Component, route }">
      <component
        v-if="route.name === 'Cart'"
        :is="Component"
        :cart-items="cartItems"
        :cart-total="cartTotal"
        @increase-qty="increaseQuantity"
        @decrease-qty="decreaseQuantity"
        @go-to-store="router.push('/')"
      />
      <component
        v-else
        :is="Component"
        @add-to-cart="addToCart"
        @remove-from-cart="removeFromCart"
      />
    </RouterView>
  </main>

  <AppFooter />
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: linear-gradient(90deg, rgba(4, 11, 24, 0.96), rgba(8, 18, 31, 0.96));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
}

.header-container {
  max-width: 1450px;
  margin: 0 auto;
  padding: 0.9rem 1.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
}

.logo-section {
  min-width: 120px;
}

.logo {
  display: inline-block;
  font-size: 2.35rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  background: linear-gradient(90deg, #f5f8ff 0%, #f29dff 35%, #7ae5ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
  text-decoration: none;
}

.nav-section {
  flex: 1;
}

.nav-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  gap: 1.4rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #ff6adf;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-width: 440px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: #edf6ff;
  padding: 0.8rem 0.9rem;
  font-size: 0.86rem;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-button {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 1.1rem;
}

.icons-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.icon-button {
  position: relative;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: #f2f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ff6adf;
  color: #101324;
  font-size: 0.62rem;
  font-weight: 900;
  line-height: 17px;
  text-align: center;
}

.page-shell {
  background:
    radial-gradient(circle at 15% 15%, rgba(255, 0, 150, 0.2), transparent 25%),
    radial-gradient(circle at 80% 20%, rgba(70, 166, 255, 0.18), transparent 20%),
    linear-gradient(180deg, #030d1d 0%, #040d1d 38%, #020914 100%);
}

.menu-panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 7, 18, 0.6);
  backdrop-filter: blur(2px);
  z-index: 30;
}

.menu-panel {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: min(540px, calc(100vw - 2rem));
  background: rgba(7, 15, 27, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.45);
  z-index: 31;
  overflow: hidden;
}

.panel-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: #f4f7ff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
}

.panel-visual {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-badge {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: white;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  font-weight: 800;
}

.panel-figure {
  width: 68%;
  height: 210px;
  border-radius: 30px 30px 20px 20px;
  background:
    linear-gradient(180deg, rgba(13, 17, 27, 0.1), rgba(13, 17, 27, 0.55)),
    radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.55), transparent 16%),
    linear-gradient(135deg, #1c2335 0%, #0b111b 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  transform: rotate(-4deg);
  position: relative;
}

.panel-figure::before,
.panel-figure::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.panel-figure::before {
  background: linear-gradient(
    90deg,
    transparent 22%,
    rgba(255, 95, 210, 0.9) 24%,
    rgba(255, 95, 210, 0.9) 31%,
    transparent 33%,
    transparent 63%,
    rgba(117, 234, 255, 0.9) 65%,
    rgba(117, 234, 255, 0.9) 72%,
    transparent 76%
  );
  opacity: 0.9;
}

.panel-figure::after {
  inset: 14% 10% 11% 10%;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-content {
  padding: 1.5rem 1.5rem 1.8rem;
  color: #edf3ff;
}

.panel-kicker {
  margin: 0 0 0.4rem;
  color: var(--panel-accent);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 800;
}

.panel-content h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.6rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.panel-price {
  margin-top: 0.6rem;
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
}

.panel-description {
  margin-top: 0.9rem;
  color: rgba(223, 231, 250, 0.8);
  line-height: 1.6;
  font-size: 0.95rem;
}

.panel-options {
  margin-top: 1.4rem;
}

.panel-options span {
  display: block;
  margin-bottom: 0.65rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: rgba(224, 235, 255, 0.7);
  text-transform: uppercase;
}

.color-row {
  display: flex;
  gap: 0.7rem;
}

.color-chip {
  width: 22px;
  height: 22px;
  display: inline-block;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.color-chip.magenta {
  background: #ff5fd2;
}
.color-chip.cyan {
  background: #6fe8ff;
}
.color-chip.violet {
  background: #8d7dff;
}

.panel-button {
  width: 100%;
  margin-top: 1.5rem;
  border: none;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  background: linear-gradient(90deg, #ff6adf, #8a7eff);
  color: #0b1120;
  font-size: 0.88rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .header-container {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-section {
    order: 3;
    width: 100%;
  }

  .header-tools {
    width: 100%;
    min-width: 0;
    justify-content: space-between;
  }
}

@media (max-width: 720px) {
  .menu-panel {
    right: 0.75rem;
    width: calc(100vw - 1.5rem);
  }

  .panel-visual {
    height: 260px;
  }
}

@media (max-width: 640px) {
  .header-container {
    padding: 0.8rem 1rem;
  }

  .nav-menu {
    flex-wrap: wrap;
    gap: 0.7rem 1rem;
  }

  .header-tools {
    flex-direction: column;
    align-items: stretch;
  }

  .icons-group {
    justify-content: center;
  }
}
</style>
