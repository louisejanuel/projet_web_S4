import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ExplorerView from './views/ExplorerView.vue'
import SavedView from './views/SavedView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/explorer', component: ExplorerView },
  { path: '/saved', component: SavedView }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})