import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Canvas from '../views/canvas'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: Canvas
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
