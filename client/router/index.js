import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/Index'
import Search from '../views/Search'
import Single from '../views/Single'
import Favorites from '../views/Favorites'

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
      name: 'favorites',
      path: '/favorites',
      component: Favorites
    },
    {
      name: 'favorite-single',
      path: '/favorites/:gifId',
      component: Single,
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
