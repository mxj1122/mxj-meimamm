import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from '@/router'
// 导入elementui
import "@/plugins/elementui"
// 导入axios
import "@/utils/request"


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
