<script setup>
const emit = defineEmits(['checkout'])

defineProps({
  totalProdutos: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <aside class="cart-summary">
    <h2 class="summary-title">Total da compra</h2>

    <div class="summary-row border-bottom">
      <span>produtos:</span>
      <span>R$ {{ totalProdutos.toFixed(2).replace('.', ',') }}</span>
    </div>

    <div class="summary-row border-bottom">
      <span>Frete:</span>
      <span class="frete-gratis">Grátis</span>
    </div>

    <div class="summary-row total-row">
      <span>Total:</span>
      <strong>R$ {{ totalProdutos.toFixed(2).replace('.', ',') }}</strong>
    </div>

    <button class="btn-checkout" @click="emit('checkout')">Pagar</button>
  </aside>
</template>

<style scoped>
.cart-summary {
  width: 100%;
  padding: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(10, 18, 32, 0.82);
  color: #edf5ff;
}

.summary-title {
  margin: 0 0 1.3rem;
  color: #f5f8ff;
  font-size: 1.1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
  color: rgba(227, 238, 255, 0.74);
  font-size: 0.9rem;
}

.border-bottom {
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.frete-gratis {
  color: #8ce4bd;
}

.total-row {
  margin: 1rem 0 0;
  color: #fff;
  font-size: 1rem;
}

.total-row strong {
  color: #ff84d9;
  font-size: 1.1rem;
}

.btn-checkout {
  width: 100%;
  min-height: 48px;
  margin-top: 1.4rem;
  border: 0;
  border-radius: 9px;
  background: linear-gradient(90deg, #ff6adf, #8d7cff);
  color: #0b1120;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  cursor: pointer;
}

.btn-checkout:hover {
  filter: brightness(1.08);
}
</style>
