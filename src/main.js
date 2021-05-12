import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from "./api/common";
Vue.prototype.$api= api
Vue.config.productionTip = false
// 引入组件
import '@/ui'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
