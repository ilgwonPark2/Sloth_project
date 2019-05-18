import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import Home from '@/components/Tab/Home'
import Sloth_mysql from '@/components/Tab/MySQL'
import Sloth_npm from '@/components/Tab/NPM'
import Header from '@/components/Shared/header.vue'
import Footer from '@/components/Shared/footer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: Home,
        header: Header,
        footer: Footer

      }
    },
    {
      path: '/mysql',
      name: 'menu-mysqll',
      components: {
        default: Sloth_mysql,
        header: Header,
        footer: Footer

      }
    },
    {
      path: '/npm',
      name: 'menu-npm',
      components: {
        default: Sloth_npm,
        header: Header,
        footer: Footer

      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
