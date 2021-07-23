import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/reset.css';
import 'element-ui/lib/theme-chalk/index.css';
// import i18n from './language' // 多语言
import utils from './utils/index' // 工具函数
import axios from 'axios'
var echarts = require("echarts") // 引入echarts

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts // 挂载在原型，组件内使用直接this.$echarts调用
Vue.prototype.$local = utils.local // localStorage本地永久存储
Vue.prototype.$store = store // localStorage本地永久存储
Vue.prototype.$session = utils.session // sessionStorage本地会话存储
Vue.prototype.$utils = utils.utils // 工具函数
Vue.use(ElementUI);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  // i18n,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  }
}).$mount('#app')
