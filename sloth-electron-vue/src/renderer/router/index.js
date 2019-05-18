import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import Header from '@/components/Shared/header.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      components: {
        default: LandingPage,
        header: Header
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
