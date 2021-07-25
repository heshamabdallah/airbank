import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'transactions',
    component: () => import('@/views/Transactions.vue')
  },
  {
    path: '/transactions/:id',
    name: 'transactions-view',
    component: () => import('@/views/TransactionsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
