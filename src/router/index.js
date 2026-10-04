import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/layout/HomeView.vue'
import TeamView from '@/components/layout/TeamView.vue'
import BookDetailView from '@/components/layout/BookDetailView.vue'
import CartPanel from '@/components/cart/CartPanel.vue'
import ProductList from '@/components/products/ProductList.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import CategoryTagView from '@/components/layout/CategoryTagView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/equipe',
    name: 'Team',
    component: TeamView,
  },
  {
    path: '/livro/:id',
    name: 'book-detail',
    component: BookDetailView,
  },
  {
    path: '/produto/:id',
    name: 'product-detail',
    component: BookDetailView,
  },
  {
    path: '/categoria/:tag',
    name: 'category-tag',
    component: CategoryTagView,
  },
  {
    path: '/busca',
    name: 'Search',
    component: CategoryTagView,
  },
  {
    path: '/carrinho',
    name: 'Cart',
    component: CartPanel,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
