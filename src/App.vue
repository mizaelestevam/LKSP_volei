<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from './components/layout/AppFooter.vue'
import { storeProducts } from './data/storeProducts.js'
import {
  addToCart,
  cartCount,
  cartItems,
  cartTotal,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from './data/cart.js'

const searchQuery = ref('')
const isSearchOpen = ref(false)
const profileOpen = ref(false)
const isMobileMenuOpen = ref(false)
const registeredProfile = ref(null)
const profileEditing = ref(false)
const profileError = ref('')
const postalCodeStatus = ref('')
const postalCodeRequestId = ref(0)
let postalCodeController
const deleteConfirmation = ref(false)
const checkoutConfirmation = ref(null)
const router = useRouter()
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function emptyProfile() {
  return {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
    postalCode: '',
    state: '',
    city: '',
    neighborhood: '',
  }
}

const profileForm = ref(emptyProfile())
const isRegisteredProfileView = computed(
  () => Boolean(registeredProfile.value) && !profileEditing.value,
)

function openProfile() {
  profileOpen.value = true
  profileError.value = ''
  postalCodeStatus.value = ''
  deleteConfirmation.value = false
  postalCodeController?.abort()
  postalCodeRequestId.value += 1
  profileEditing.value = !registeredProfile.value
  profileForm.value = registeredProfile.value
    ? { ...registeredProfile.value, confirmPassword: registeredProfile.value.password }
    : emptyProfile()
}

function closeProfile() {
  profileOpen.value = false
  deleteConfirmation.value = false
  profileError.value = ''
  postalCodeController?.abort()
  postalCodeRequestId.value += 1
}

function editProfile() {
  profileForm.value = {
    ...registeredProfile.value,
    confirmPassword: registeredProfile.value.password,
  }
  profileEditing.value = true
  profileError.value = ''
}

function cancelProfileEdit() {
  profileForm.value = {
    ...registeredProfile.value,
    confirmPassword: registeredProfile.value.password,
  }
  profileEditing.value = false
  profileError.value = ''
}

function cleanProfileText(value) {
  return value.replace(/[^\p{L}\s'-]/gu, '').replace(/\s{2,}/g, ' ')
}

function sanitizeProfileText(field, event) {
  const value = cleanProfileText(event.target.value)
  profileForm.value[field] = value
  event.target.value = value
}

function sanitizeState(event) {
  const value = event.target.value.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase()
  profileForm.value.state = value
  event.target.value = value
}

async function handlePostalCodeInput(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 8)
  profileForm.value.postalCode =
    digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  profileError.value = ''
  postalCodeRequestId.value += 1
  const requestId = postalCodeRequestId.value
  postalCodeController?.abort()
  profileForm.value.state = ''
  profileForm.value.city = ''
  profileForm.value.neighborhood = ''

  if (!digits) {
    postalCodeStatus.value = ''
    return
  }

  if (digits.length < 8) {
    postalCodeStatus.value = ''
    return
  }

  postalCodeController = new AbortController()
  postalCodeStatus.value = 'Consultando CEP...'

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${digits}/json/`,
      { signal: postalCodeController.signal },
    )
    if (!response.ok) {
      throw new Error(`Consulta de CEP falhou com status ${response.status}.`)
    }

    const address = await response.json()
    if (requestId !== postalCodeRequestId.value) return

    if (address.erro) {
      postalCodeStatus.value = 'CEP não encontrado. Confira o número e tente novamente.'
      return
    }

    profileForm.value.state = (address.uf || '').replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase()
    profileForm.value.city = cleanProfileText(address.localidade || '')
    profileForm.value.neighborhood = cleanProfileText(address.bairro || '')
    postalCodeStatus.value = 'Endereço encontrado e preenchido.'
  } catch (error) {
    if (error.name === 'AbortError' || requestId !== postalCodeRequestId.value) return
    postalCodeStatus.value =
      'Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.'
  }
}

function handleProfileImage(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    profileError.value = 'Escolha um arquivo de imagem.'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    profileError.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }

  const reader = new FileReader()
  reader.addEventListener('load', () => {
    profileForm.value.image = String(reader.result || '')
    profileError.value = ''
  })
  reader.readAsDataURL(file)
}

function saveProfile() {
  profileForm.value.name = profileForm.value.name.trim()
  profileForm.value.state = profileForm.value.state.trim().toUpperCase()
  profileForm.value.city = profileForm.value.city.trim()
  profileForm.value.neighborhood = profileForm.value.neighborhood.trim()

  if (!/^\p{L}[\p{L}\s'-]*$/u.test(profileForm.value.name)) {
    profileError.value = 'O nome deve conter apenas letras.'
    return
  }

  if (!/^\d{5}-?\d{3}$/.test(profileForm.value.postalCode)) {
    profileError.value = 'Digite um CEP válido com 8 números.'
    return
  }

  if (!/^[A-Z]{2}$/.test(profileForm.value.state)) {
    profileError.value = 'O estado deve conter apenas a sigla com 2 letras.'
    return
  }

  if (
    !/^\p{L}[\p{L}\s'-]*$/u.test(profileForm.value.city) ||
    !/^\p{L}[\p{L}\s'-]*$/u.test(profileForm.value.neighborhood)
  ) {
    profileError.value = 'Cidade e bairro devem conter apenas letras.'
    return
  }

  if (profileForm.value.password.length < 6) {
    profileError.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  if (profileForm.value.password !== profileForm.value.confirmPassword) {
    profileError.value = 'As senhas não coincidem.'
    return
  }

  registeredProfile.value = { ...profileForm.value }
  profileEditing.value = false
  profileError.value = ''
  deleteConfirmation.value = false
}

function deleteProfile() {
  registeredProfile.value = null
  profileForm.value = emptyProfile()
  profileEditing.value = true
  deleteConfirmation.value = false
  profileError.value = ''
}

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

const searchResults = computed(() => {
  const terms = normalizeSearchText(searchQuery.value).trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  return storeProducts
    .filter((product) => {
      const searchableText = normalizeSearchText(
        [product.title, product.tag, product.description, product.colorName, product.gender]
          .filter(Boolean)
          .join(' '),
      )
      return terms.every((term) => searchableText.includes(term))
    })
    .slice(0, 6)
})

function openProduct(product) {
  searchQuery.value = product.title
  isSearchOpen.value = false
  router.push(`/produto/${product.id}`)
}

function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query) return

  isSearchOpen.value = false
  router.push({ name: 'Search', query: { q: query } })
}

const navigation = [
  { label: 'HOME', href: '/', icon: 'mdi-home-outline' },
  { label: 'MASCULINO', href: '/categoria/masculino', icon: 'mdi-account-outline' },
  { label: 'FEMININO', href: '/categoria/feminino', icon: 'mdi-account-outline' },
  { label: 'TÊNIS', href: '/categoria/tenis', icon: 'mdi-shoe-sneaker' },
  { label: 'UNIFORMES', href: '/categoria/uniformes', icon: 'mdi-tshirt-crew-outline' },
  { label: 'TECNOLOGIA', href: '/categoria/tecnologia', icon: 'mdi-lightning-bolt-outline' },
  { label: 'SOBRE-NÓS', href: '/equipe', icon: 'mdi-information-outline' },
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

  if (item.href.startsWith('/categoria/')) {
    activePanel.value = null
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

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function completeCheckout() {
  if (!cartItems.value.length) return

  if (!registeredProfile.value) {
    openProfile()
    profileEditing.value = true
    profileError.value = 'Você precisa concluir o cadastro antes de finalizar a compra.'
    return
  }

  checkoutConfirmation.value = cartTotal.value
  clearCart()
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <RouterLink to="/" class="logo" aria-label="LKSP, página inicial">LKSP</RouterLink>
      </div>

      <button
        class="menu-toggle"
        type="button"
        :aria-label="isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="isMobileMenuOpen"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        class="nav-section"
        :class="{ 'nav-open': isMobileMenuOpen }"
        aria-label="Menu principal"
      >
        <ul class="nav-menu">
          <li v-for="item in navigation" :key="item.label">
            <a
              :href="item.href"
              class="nav-link"
              @click="openMenuPanel(item, $event); closeMobileMenu()"
            >
              <i class="nav-icon mdi" :class="item.icon" aria-hidden="true"></i>
              <span>{{ item.label }}</span>
            </a>
          </li>
          <li class="nav-mobile-only">
            <RouterLink to="/carrinho" class="nav-link" @click="closeMobileMenu">
              <i class="nav-icon mdi mdi-cart-outline" aria-hidden="true"></i>
              <span>Carrinho</span>
              <span v-if="cartCount" class="nav-cart-count">{{ cartCount }}</span>
            </RouterLink>
          </li>
          <li class="nav-mobile-only">
            <button class="nav-link nav-action" type="button" @click="openProfile(); closeMobileMenu()">
              <i class="nav-icon mdi mdi-account-circle-outline" aria-hidden="true"></i>
              <span>Perfil</span>
            </button>
          </li>
        </ul>
      </nav>

      <div class="header-tools">
        <div class="search-container">
          <div class="search-wrapper">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar produtos..."
              class="search-input"
              role="combobox"
              aria-label="Buscar produtos"
              aria-autocomplete="list"
              :aria-expanded="isSearchOpen && Boolean(searchQuery.trim())"
              @focus="isSearchOpen = true"
              @input="isSearchOpen = true"
              @keyup.enter="handleSearch"
              @keyup.esc="isSearchOpen = false"
            />
            <button @click="handleSearch" class="search-button" title="Buscar" aria-label="Buscar">
              <i class="mdi mdi-magnify"></i>
            </button>
          </div>

          <div
            v-if="isSearchOpen && searchQuery.trim()"
            class="search-results"
            role="listbox"
            aria-label="Resultados da busca"
          >
            <button
              v-for="product in searchResults"
              :key="product.id"
              class="search-result"
              type="button"
              role="option"
              @click="openProduct(product)"
            >
              <img :src="product.image" alt="" class="search-result-image" />
              <span class="search-result-info">
                <strong>{{ product.title }}</strong>
                <small>{{ product.tag }}</small>
              </span>
              <span class="search-result-price">
                R$ {{ product.price.toFixed(2).replace('.', ',') }}
              </span>
            </button>
            <p v-if="!searchResults.length" class="search-empty">Nenhum produto encontrado.</p>
          </div>
        </div>

        <div class="icons-group">
          <RouterLink to="/carrinho" class="icon-button" title="Carrinho">
            <i class="mdi mdi-cart-outline"></i>
            <span v-if="cartCount" class="cart-count">{{ cartCount }}</span>
          </RouterLink>
          <button class="icon-button" title="Perfil" aria-label="Abrir perfil" @click="openProfile">
            <i class="mdi mdi-account"></i>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div v-if="profileOpen" class="profile-backdrop" tabindex="-1">
    <section class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <header class="profile-modal-header">
        <div>
          <p class="profile-kicker">CONTA LKSP</p>
          <h2 id="profile-title">{{ registeredProfile ? 'Meu perfil' : 'Criar perfil' }}</h2>
        </div>
        <button
          class="profile-close"
          type="button"
          aria-label="Fechar perfil"
          @click="closeProfile"
        >
          ×
        </button>
      </header>

      <div v-if="registeredProfile" class="registered-badge">
        <i class="mdi mdi-check-circle"></i>
        CADASTRADO
      </div>

      <form class="profile-form" @submit.prevent="saveProfile">
        <div class="profile-avatar-block">
          <div class="profile-avatar">
            <img v-if="profileForm.image" :src="profileForm.image" alt="Foto do perfil" />
            <i v-else class="mdi mdi-account"></i>
          </div>
          <label v-if="!isRegisteredProfileView" class="profile-image-button">
            {{ profileForm.image ? 'Alterar imagem' : 'Adicionar imagem' }}
            <input
              type="file"
              accept="image/*"
              aria-label="Adicionar imagem de perfil"
              @change="handleProfileImage"
            />
          </label>
        </div>

        <label class="profile-field">
          <span>Nome</span>
          <input
            v-model="profileForm.name"
            type="text"
            autocomplete="name"
            placeholder="Seu nome"
            required
            :readonly="isRegisteredProfileView"
            @input="sanitizeProfileText('name', $event)"
          />
        </label>
        <label class="profile-field">
          <span>E-mail</span>
          <input
            v-model="profileForm.email"
            type="email"
            autocomplete="email"
            placeholder="voce@exemplo.com"
            required
            :readonly="isRegisteredProfileView"
          />
        </label>
        <label class="profile-field">
          <span>Senha</span>
          <input
            v-model="profileForm.password"
            type="password"
            autocomplete="new-password"
            placeholder="Mínimo de 6 caracteres"
            minlength="6"
            required
            :readonly="isRegisteredProfileView"
          />
        </label>
        <label class="profile-field">
          <span>Confirmar senha</span>
          <input
            v-model="profileForm.confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Digite a senha novamente"
            minlength="6"
            required
            :readonly="isRegisteredProfileView"
          />
        </label>

        <section class="profile-address" aria-labelledby="profile-address-title">
          <h3 id="profile-address-title">Endereço de entrega</h3>
          <div class="profile-address-grid">
            <label class="profile-field">
              <span>CEP</span>
              <input
                v-model="profileForm.postalCode"
                type="text"
                inputmode="numeric"
                autocomplete="postal-code"
                placeholder="00000-000"
                maxlength="9"
                pattern="\d{5}-?\d{3}"
                title="Digite um CEP válido com 8 números."
                required
                :readonly="isRegisteredProfileView"
                @input="handlePostalCodeInput"
              />
            </label>
            <label class="profile-field">
              <span>Estado</span>
              <input
                v-model="profileForm.state"
                type="text"
                autocomplete="address-level1"
                placeholder="UF"
                maxlength="2"
                required
                :readonly="isRegisteredProfileView"
                @input="sanitizeState"
              />
            </label>
            <label class="profile-field">
              <span>Cidade</span>
              <input
                v-model="profileForm.city"
                type="text"
                autocomplete="address-level2"
                placeholder="Cidade"
                required
                :readonly="isRegisteredProfileView"
                @input="sanitizeProfileText('city', $event)"
              />
            </label>
            <label class="profile-field">
              <span>Bairro</span>
              <input
                v-model="profileForm.neighborhood"
                type="text"
                autocomplete="address-level3"
                placeholder="Bairro"
                required
                :readonly="isRegisteredProfileView"
                @input="sanitizeProfileText('neighborhood', $event)"
              />
            </label>
          </div>
          <p v-if="postalCodeStatus" class="postal-code-status" role="status" aria-live="polite">
            {{ postalCodeStatus }}
          </p>
        </section>

        <p v-if="profileError" class="profile-error" role="alert">{{ profileError }}</p>

        <button v-if="!isRegisteredProfileView" class="profile-primary" type="submit">
          {{ registeredProfile ? 'SALVAR ALTERAÇÕES' : 'FINALIZAR CADASTRO' }}
        </button>

        <div v-if="registeredProfile && !deleteConfirmation" class="profile-actions">
          <button v-if="!profileEditing" class="profile-primary" type="button" @click="editProfile">
            EDITAR PERFIL
          </button>
          <button
            v-if="profileEditing"
            class="profile-secondary"
            type="button"
            @click="cancelProfileEdit"
          >
            CANCELAR EDIÇÃO
          </button>
          <button class="profile-delete" type="button" @click="deleteConfirmation = true">
            EXCLUIR PERFIL
          </button>
        </div>

        <div v-if="deleteConfirmation" class="delete-confirmation">
          <p>Excluir os dados deste perfil?</p>
          <div>
            <button class="profile-delete" type="button" @click="deleteProfile">
              CONFIRMAR EXCLUSÃO
            </button>
            <button class="profile-secondary" type="button" @click="deleteConfirmation = false">
              VOLTAR
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>

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
        :can-checkout="Boolean(registeredProfile)"
        @increase-qty="increaseQuantity"
        @decrease-qty="decreaseQuantity"
        @remove-from-cart="removeFromCart"
        @go-to-store="router.push('/')"
        @checkout="completeCheckout"
      />
      <component
        v-else
        :is="Component"
        @add-to-cart="addToCart"
        @remove-from-cart="removeFromCart"
      />
    </RouterView>
  </main>

  <div v-if="checkoutConfirmation !== null" class="checkout-backdrop">
    <section
      class="checkout-confirmation"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <span class="checkout-check"><i class="mdi mdi-check"></i></span>
      <p class="checkout-kicker">PEDIDO LKSP</p>
      <h2 id="checkout-title">Compra confirmada</h2>
      <p class="checkout-message">Sua compra foi realizada com sucesso.</p>
      <div class="checkout-total">
        <span>Valor total</span>
        <strong>{{ currencyFormatter.format(checkoutConfirmation) }}</strong>
      </div>
      <button class="checkout-close" @click="checkoutConfirmation = null">CONTINUAR</button>
    </section>
  </div>

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
  position: relative;
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

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 0.28rem;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 0 auto;
  border-radius: 999px;
  background: #edf5ff;
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

.nav-icon,
.nav-mobile-only {
  display: none;
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

.search-container {
  position: relative;
  width: 100%;
  min-width: 240px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  overflow: hidden;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 40;
  width: 100%;
  max-height: min(360px, 60vh);
  overflow-y: auto;
  padding: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: #101a29;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.38);
}

.search-result {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  min-height: 58px;
  padding: 0.55rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #edf6ff;
  text-align: left;
  cursor: pointer;
}

.search-result:hover,
.search-result:focus-visible {
  background: rgba(255, 255, 255, 0.08);
  outline: none;
}

.search-result-image {
  width: 40px;
  height: 42px;
  flex: 0 0 40px;
  object-fit: contain;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.search-result-info {
  display: grid;
  min-width: 0;
  gap: 0.1rem;
}

.search-result-info strong,
.search-result-info small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result-info strong {
  font-size: 0.82rem;
}

.search-result-info small {
  color: rgba(226, 233, 255, 0.62);
  font-size: 0.68rem;
}

.search-result-price {
  margin-left: auto;
  flex: 0 0 auto;
  font-size: 0.75rem;
  font-weight: 700;
}

.search-empty {
  margin: 0;
  padding: 0.9rem;
  color: rgba(226, 233, 255, 0.72);
  font-size: 0.82rem;
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

.profile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(2, 7, 18, 0.78);
  backdrop-filter: blur(8px);
}

.profile-modal {
  width: min(500px, 100%);
  max-height: min(760px, calc(100dvh - 2rem));
  overflow-y: auto;
  padding: 1.5rem;
  border: 1px solid rgba(122, 229, 255, 0.28);
  border-radius: 16px;
  background:
    radial-gradient(circle at 95% 0%, rgba(255, 95, 210, 0.13), transparent 32%),
    linear-gradient(155deg, #101b2b, #07111f 72%);
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.58),
    0 0 32px rgba(122, 229, 255, 0.08);
  color: #edf5ff;
}

.profile-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.profile-kicker {
  margin: 0 0 0.25rem;
  color: #7ae5ff;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.profile-modal-header h2 {
  margin: 0;
  color: #f5f7ff;
  font-size: 1.55rem;
}

.profile-close {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: #edf5ff;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
}

.registered-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid rgba(122, 229, 255, 0.3);
  border-radius: 999px;
  background: rgba(122, 229, 255, 0.08);
  color: #7ae5ff;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.profile-form {
  display: grid;
  gap: 0.8rem;
}

.profile-address {
  display: grid;
  gap: 0.7rem;
  padding-top: 0.35rem;
}

.profile-address h3 {
  margin: 0;
  color: #f5f7ff;
  font-size: 0.9rem;
}

.profile-address-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.postal-code-status {
  margin: -0.2rem 0 0;
  color: rgba(237, 245, 255, 0.72);
  font-size: 0.75rem;
}

.profile-avatar-block {
  display: grid;
  justify-items: center;
  gap: 0.6rem;
  margin: 0.1rem 0 0.25rem;
}

.profile-avatar {
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  overflow: hidden;
  border: 2px solid rgba(122, 229, 255, 0.7);
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(122, 229, 255, 0.18), rgba(255, 95, 210, 0.22));
  color: #dff8ff;
  font-size: 2.3rem;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-image-button {
  position: relative;
  overflow: hidden;
  color: #ff9be6;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.profile-image-button input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.profile-field {
  display: grid;
  gap: 0.35rem;
  color: rgba(237, 245, 255, 0.82);
  font-size: 0.8rem;
  font-weight: 700;
}

.profile-field input {
  width: 100%;
  min-height: 44px;
  padding: 0.65rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.055);
  color: #f5f7ff;
  font-size: 0.9rem;
}

.profile-field input:focus {
  border-color: #7ae5ff;
  box-shadow: 0 0 0 2px rgba(122, 229, 255, 0.13);
}

.profile-field input[readonly] {
  color: rgba(237, 245, 255, 0.76);
  background: rgba(255, 255, 255, 0.035);
}

.profile-error {
  margin: 0;
  color: #ff9be6;
  font-size: 0.82rem;
}

.profile-primary,
.profile-secondary,
.profile-delete {
  min-height: 44px;
  padding: 0.7rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.profile-primary {
  background: linear-gradient(90deg, #ff74df, #7ae5ff);
  color: #081321;
}

.profile-secondary {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: #edf5ff;
}

.profile-delete {
  border-color: rgba(255, 116, 223, 0.35);
  background: rgba(255, 116, 223, 0.08);
  color: #ff9be6;
}

.profile-actions,
.delete-confirmation > div {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.delete-confirmation p {
  margin: 0 0 0.65rem;
  color: #f5f7ff;
  font-size: 0.88rem;
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

.checkout-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(2, 7, 18, 0.78);
  backdrop-filter: blur(7px);
}

.checkout-confirmation {
  width: min(420px, 100%);
  padding: 2rem;
  border: 1px solid rgba(122, 229, 255, 0.28);
  border-radius: 16px;
  background:
    radial-gradient(circle at 95% 0%, rgba(255, 95, 210, 0.13), transparent 35%),
    linear-gradient(155deg, #101b2b, #07111f 72%);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
  color: #edf5ff;
  text-align: center;
}

.checkout-check {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 1rem;
  border: 1px solid rgba(122, 229, 255, 0.5);
  border-radius: 50%;
  background: rgba(122, 229, 255, 0.12);
  color: #7ae5ff;
  font-size: 1.7rem;
}

.checkout-kicker {
  margin: 0 0 0.35rem;
  color: #ff9be6;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.checkout-confirmation h2 {
  margin: 0;
  color: #f5f7ff;
  font-size: 1.55rem;
}

.checkout-message {
  margin: 0.5rem 0 1.3rem;
  color: rgba(237, 245, 255, 0.72);
  font-size: 0.9rem;
}

.checkout-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(237, 245, 255, 0.75);
  font-size: 0.88rem;
}

.checkout-total strong {
  color: #7ae5ff;
  font-size: 1.1rem;
}

.checkout-close {
  width: 100%;
  min-height: 46px;
  margin-top: 1.2rem;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(90deg, #ff74df, #7ae5ff);
  color: #081321;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  cursor: pointer;
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
    justify-content: space-between;
    gap: 0.8rem 1.2rem;
  }

  .logo-section {
    order: 0;
    margin-right: auto;
  }

  .menu-toggle {
    order: 1;
  }

  .nav-section {
    display: none;
    order: 3;
    width: 100%;
  }

  .nav-section.nav-open {
    display: block;
  }

  .menu-toggle {
    display: flex;
  }

  .header-tools {
    order: 2;
    width: 100%;
    min-width: 0;
    justify-content: space-between;
  }

  .nav-menu {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
    gap: 0.55rem;
    padding: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    background: rgba(6, 14, 24, 0.98);
    box-shadow: 0 18px 32px rgba(0, 0, 0, 0.22);
  }

  .nav-menu li {
    min-width: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.55rem;
    width: 100%;
    min-height: 42px;
    padding: 0.55rem 0.65rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.035);
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.68rem;
    letter-spacing: 0.035em;
    text-align: left;
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    border-color: rgba(122, 229, 255, 0.35);
    background: rgba(122, 229, 255, 0.08);
    color: #fff;
    outline: none;
  }

  .nav-icon {
    flex: 0 0 auto;
    font-size: 1.1rem;
    color: #7ae5ff;
  }

  .nav-mobile-only {
    display: list-item;
  }

  .nav-action {
    cursor: pointer;
    font-family: inherit;
  }

  .nav-cart-count {
    margin-left: auto;
    color: #ff9be6;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .icons-group {
    display: none;
  }
}

@media (max-width: 720px) {
  .header-container {
    padding: 0.8rem 1rem;
  }

  .logo {
    font-size: 2rem;
  }

  .header-tools {
    width: 100%;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .search-container {
    min-width: 0;
    flex: 1;
  }

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
    gap: 0.75rem;
  }

  .logo {
    font-size: 1.8rem;
  }

  .profile-modal {
    padding: 1.1rem;
  }

  .delete-confirmation > div {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .profile-backdrop {
    padding: 0.6rem;
  }

  .profile-modal {
    max-height: calc(100dvh - 1.2rem);
    padding: 0.9rem;
    border-radius: 13px;
  }

  .profile-modal-header h2 {
    font-size: 1.3rem;
  }

  .profile-field input {
    min-height: 42px;
  }

  .profile-address-grid {
    grid-template-columns: 1fr;
  }
}
</style>
