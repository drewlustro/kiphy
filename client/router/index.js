import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/Index'
import Search from '../views/Search'
import Single from '../views/Single'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index
    },
    {
      name: 'single',
      path: '/:query/:gifId',
      component: Single,
    },
    {
      name: 'search',
      path: '/:query',
      component: Search,
    },

  ]
})
