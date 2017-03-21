import Vue from 'vue'
import Router from 'vue-router'
import Search from '../views/Search'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Search
    }
  ]
})
