import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Canvas from '../views/canvas'
import Product from '../views/product'
import Calendar from "../views/data-calendar";
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
  }, {
    path: '/calendar',
    name: 'calendar',
    component: Calendar
  },
  {
    path: '/product',
    name: 'product',
    component: Product
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
