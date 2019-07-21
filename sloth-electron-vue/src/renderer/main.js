import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VuePaginate from 'vue-paginate'

Vue.use(BootstrapVue)
Vue.use(VuePaginate)

import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// js files below...


// css files below...
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../../static/style/style.css'
import '../../static/style/font-awesome.min.css'

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
