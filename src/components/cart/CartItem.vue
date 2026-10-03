<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['decrease-qty', 'increase-qty'])
</script>

<template>
  <div class="cart-item">
    <div class="product-info">
      <img :src="item.image" :alt="item.title" class="item-capa" />
      <div class="text-details">
        <h3 class="item-titulo">{{ props.item.title }}</h3>
        <p class="item-autor">{{ props.item.autor || props.item.gender }}</p>
        <p v-if="props.item.tamanho" class="item-size">Tamanho: {{ props.item.tamanho }}</p>
        <p class="item-preco">R$ {{ props.item.preco.toFixed(2).replace('.', ',') }}</p>
      </div>
    </div>

    <div class="quantity-container">
      <div class="quantity-selector">
        <button
          class="qty-btn"
          :aria-label="item.quantidade === 1 ? 'Remover produto' : 'Diminuir quantidade'"
          @click="emit('decrease-qty', item)"
        >
          −
        </button>
        <span class="qty-value">{{ item.quantidade }}</span>
        <button
          class="qty-btn"
          aria-label="Aumentar quantidade"
          @click="emit('increase-qty', item)"
        >
          +
        </button>
      </div>
    </div>

    <div class="item-subtotal">
      R$ {{ (item.preco * item.quantidade).toFixed(2).replace('.', ',') }}
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px 140px;
  align-items: center;
  min-height: 150px;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #edf5ff;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-width: 0;
}

.item-capa {
  width: 100px;
  height: 112px;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  object-fit: cover;
  mix-blend-mode: screen;
}

.text-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.item-titulo {
  margin: 0;
  color: #f5f8ff;
  font-size: 1rem;
  line-height: 1.35;
}

.item-autor,
.item-size {
  margin: 0;
  color: rgba(227, 238, 255, 0.65);
  font-size: 0.8rem;
  text-transform: capitalize;
}

.item-preco {
  margin: 0;
  color: #ff84d9;
  font-size: 0.85rem;
  font-weight: 800;
}

.quantity-container {
  display: flex;
  justify-content: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.4rem 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.qty-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #ff9be9;
  font-size: 1.1rem;
  cursor: pointer;
}

.qty-btn:hover {
  background: rgba(255, 106, 223, 0.12);
}

.qty-value {
  min-width: 1rem;
  color: #f5f8ff;
  font-size: 0.9rem;
  text-align: center;
}

.item-subtotal {
  color: #f5f8ff;
  font-size: 0.95rem;
  font-weight: 800;
  text-align: right;
}

@media (max-width: 700px) {
  .cart-item {
    grid-template-columns: minmax(0, 1fr) 82px 90px;
    gap: 0.5rem;
  }

  .product-info {
    gap: 0.7rem;
  }

  .item-capa {
    width: 62px;
    height: 80px;
  }

  .item-titulo {
    font-size: 0.78rem;
  }

  .item-autor,
  .item-size,
  .item-preco,
  .item-subtotal {
    font-size: 0.7rem;
  }

  .quantity-selector {
    gap: 0.25rem;
    padding: 0.2rem;
  }
}
</style>
