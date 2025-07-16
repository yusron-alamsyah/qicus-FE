import { createRouter, createWebHistory } from 'vue-router'
import ChatLayout from './components/ChatLayout.vue'

const routes = [
  {
    path: '/chat/:roomId',
    name: 'ChatRoom',
    component: ChatLayout
  },
  {
    path: '/',
    redirect: '/chat/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
