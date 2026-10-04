import { computed, ref } from 'vue'

const storageKey = 'lksp-cart'

function loadCartItems() {
  try {
    const savedItems = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(savedItems)) return []

    return savedItems.filter(
      (item) =>
        Number.isInteger(item.id) &&
        Number.isFinite(item.preco) &&
        Number.isInteger(item.quantidade) &&
        item.quantidade > 0,
    )
  } catch {
    return []
  }
}

export const cartItems = ref(loadCartItems())
export const cartCount = computed(() =>
  cartItems.value.reduce((count, item) => count + item.quantidade, 0),
)
export const cartTotal = computed(() =>
  cartItems.value.reduce((total, item) => total + item.preco * item.quantidade, 0),
)

export function isInCart(productId, size) {
  return cartItems.value.some(
    (item) => item.id === productId && (size === undefined || (item.tamanho || '') === size),
  )
}

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cartItems.value))
  } catch {
    return
  }
}

function sameCartLine(item, productId, size) {
  return item.id === productId && (item.tamanho || '') === size
}

export function addToCart(product) {
  const price = Number(product.price ?? product.preco)
  if (!Number.isInteger(product.id) || !Number.isFinite(price)) return

  const size = product.tamanho || ''
  const existingItem = cartItems.value.find((item) => sameCartLine(item, product.id, size))

  if (existingItem) {
    existingItem.quantidade += 1
  } else {
    cartItems.value.push({
      ...product,
      preco: price,
      tamanho: size,
      quantidade: 1,
    })
  }

  saveCart()
}

export function increaseQuantity(product) {
  const item = cartItems.value.find((current) =>
    sameCartLine(current, product.id, product.tamanho || ''),
  )
  if (!item) return

  item.quantidade += 1
  saveCart()
}

export function decreaseQuantity(product) {
  const itemIndex = cartItems.value.findIndex((current) =>
    sameCartLine(current, product.id, product.tamanho || ''),
  )
  if (itemIndex === -1) return

  if (cartItems.value[itemIndex].quantidade > 1) {
    cartItems.value[itemIndex].quantidade -= 1
  } else {
    cartItems.value.splice(itemIndex, 1)
  }

  saveCart()
}

export function removeFromCart(productId, size) {
  cartItems.value = cartItems.value.filter(
    (item) => !sameCartLine(item, productId, size ?? (item.tamanho || '')),
  )
  saveCart()
}

export function clearCart() {
  cartItems.value = []
  saveCart()
}
