import Vue from 'vue'
import Router from 'vue-router'
import Search from '../views/Search'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      name: 'index',
      path: '/',
      component: Search
    },
    {
      name: 'gif',
      path: '/:query/:gifId',
      component: Search,
      props: true,
    },
    {
      name: 'search',
      path: '/:query',
      component: Search,
      props: true,
    },

  ]
})
