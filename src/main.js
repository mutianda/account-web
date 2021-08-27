import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from "./api/common";
import *as echarts from 'echarts'
Vue.prototype.$api= api
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
// 引入组件
import '@/ui'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
