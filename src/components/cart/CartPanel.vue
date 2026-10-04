<script setup>
import CartItem from './CartItem.vue'
import CartSummary from './CartSummary.vue'

defineProps({
  cartItems: {
    type: Array,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: true,
  },
  canCheckout: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'increase-qty',
  'decrease-qty',
  'remove-from-cart',
  'go-to-store',
  'checkout',
])
</script>

<template>
  <div class="cart-page">
    <div class="cart-wrapper">
      <h1 class="cart-title">Carrinho</h1>

      <div v-if="cartItems.length" class="cart-container">
        <div class="cart-main">
          <div class="cart-header">
            <span class="header-titulo">Título</span>
            <span class="header-quantidade">Quantidade</span>
            <span class="header-subtotal">Subtotal</span>
          </div>

          <div class="cart-items">
            <CartItem
              v-for="item in cartItems"
              :key="`${item.id}-${item.tamanho || ''}`"
              :item="item"
              @increase-qty="emit('increase-qty', item)"
              @decrease-qty="emit('decrease-qty', item)"
              @remove-from-cart="emit('remove-from-cart', $event, item.tamanho)"
            />
          </div>

          <div class="footer-layout-container">
            <button class="btn-back" @click="emit('go-to-store')">VOLTAR À LOJA</button>
            <CartSummary :totalProdutos="cartTotal" :can-checkout="canCheckout" @checkout="emit('checkout')" />
          </div>
        </div>
      </div>

      <div v-else class="cart-empty">
        <i class="mdi mdi-cart-outline" aria-hidden="true"></i>
        <h2>Seu carrinho está vazio</h2>
        <p>Explore a coleção e adicione seus produtos favoritos para continuar.</p>
        <button class="btn-back" @click="emit('go-to-store')">EXPLORAR PRODUTOS</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: calc(100vh - 90px);
  padding: 3.5rem 2rem 5rem;
  color: #edf5ff;
}

.cart-wrapper {
  max-width: 1250px;
  margin: 0 auto;
}

.cart-title {
  margin: 0 0 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  color: #f5f8ff;
  font-size: 2rem;
}

.cart-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px 140px;
  padding: 0 0 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(227, 238, 255, 0.72);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.header-quantidade {
  text-align: center;
}

.header-subtotal {
  text-align: right;
}

.cart-items {
  margin-bottom: 2rem;
}

.footer-layout-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 370px);
  align-items: start;
  gap: 2rem;
}

.btn-back {
  min-height: 44px;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(255, 116, 225, 0.65);
  border-radius: 9px;
  background: transparent;
  color: #fff5ff;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  cursor: pointer;
}

.btn-back:hover {
  background: rgba(255, 116, 225, 0.1);
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  text-align: center;
}

.cart-empty > i {
  color: #ff82dc;
  font-size: 3rem;
}

.cart-empty h2 {
  margin: 1rem 0 0.4rem;
  font-size: 1.35rem;
}

.cart-empty p {
  max-width: 420px;
  margin: 0 0 1.5rem;
  color: rgba(227, 238, 255, 0.7);
}

@media (max-width: 700px) {
  .cart-page {
    padding: 1.75rem 1rem 3rem;
  }

  .cart-header {
    grid-template-columns: minmax(0, 1fr) 82px 90px;
    font-size: 0.6rem;
  }

  .footer-layout-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .cart-title {
    margin-bottom: 1.25rem;
    font-size: 1.65rem;
  }

  .btn-back {
    min-height: 46px;
  }
}

@media (max-width: 520px) {
  .cart-header {
    display: none;
  }

  .cart-items {
    margin-bottom: 1rem;
  }

  .footer-layout-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .footer-layout-container > * {
    width: 100%;
  }
}
</style>
