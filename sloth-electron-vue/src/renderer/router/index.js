import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Tab/Home'
import Sloth_MySQL from '@/components/Tab/MySQL'
import Sloth_NPM from '@/components/Tab/NPM'
import Sloth_Design from '@/components/Tab/Design'
import Sloth_Server from '@/components/Tab/Server'
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
        default: Sloth_MySQL,
        header: Header,
        footer: Footer

      }
    },
    {
      path: '/npm',
      name: 'menu-npm',
      components: {
        default: Sloth_NPM,
        header: Header,
        footer: Footer

      }
    },
    {
      path: '/server',
      name: 'menu-server',
      components: {
        default: Sloth_Server,
        header: Header,
        footer: Footer

      }
    },
    {
      path: '/design',
      name: 'menu-design',
      components: {
        default: Sloth_Design,
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
