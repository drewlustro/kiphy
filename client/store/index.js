import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const sessionStore = require('store')
const defaultsPlugin = require('store/plugins/defaults')
const CancelToken = axios.CancelToken
const source = CancelToken.source()

Vue.use(Vuex)

sessionStore.addPlugin(defaultsPlugin)
sessionStore.defaults({
  lastUpdated: undefined,
  favorites: [],
  library: [],
})

const state = {
  query: '',
  gifId: '',
  isFetching: false,
  giphy: {
    single: undefined,
    results: undefined,
  },
  session: {
    lastUpdated: sessionStore.get('updated'),
    favorites: sessionStore.get('favorites'),
    library: sessionStore.get('library')
  }
}

const mutations = {
  // search gif via term
  // updateDraftQuery (state, query) {
  //   state.draftQuery = query
  // },
  updateQuery (state, query) {
    state.query = query
  },
  updateGifId (state, gifId) {
    state.gifId = gifId
  },

  storeSearchResponse (state, response) {
    state.giphy.results = response.data.data
  },
  storeSingleResponse (state, response) {
    state.giphy.single = response.data.data
  },
  setFetching (state, isFetching) {
    state.isFetching = isFetching
  },

  UPDATE_STORE_TIMESTAMP (state) {
    state.session.lastUpdated = (new Date()).toISOString()
    sessionStore.set('lastUpdated', state.session.lastUpdated)
  },

  ADD_FAVORITE (state, gifId) {
    if (state.session.favorites.indexOf(gifId) !== -1) {
      console.log(`${gifId} already in favorites. Ignoring...`)
      return
    }
    console.log(`[ADD_FAVORITE] before: ${state.session.favorites}`)
    state.session.favorites.push(gifId) // naive
    sessionStore.set('favorites', state.session.favorites)
    console.log(`[ADD_FAVORITE] after: ${sessionStore.get('favorites')}`)
  },

  REMOVE_FAVORITE (state, gifId) {
    const favorites = state.session.favorites
    const idx = favorites.indexof(gifId)
    if (idx !== -1) {
      const deleted = favorites.splice(idx, 1)
      console.log(`Deleted ${deleted} from store at index ${idx}.`)
      state.session.favorites = favorites
      sessionStore.set('favorites', state.session.favorites)
    }
  },

  // utility
  clearAll (state) {
    state.gifId = ''
    state.query = ''
    state.draftQuery = ''
    // TODO: revise to repeatable defaults
    state.isFetching = false
    state.giphy.single = undefined
    state.giphy.results = undefined
  }
}

const actions = {
  search ({ commit, state }, query) {
    if (!query || query === '') {
      console.log(`No need to run new search; '${query}' is invalid.`)
      return
    }

    if (state.isFetching) {
      console.log('Canceled existing search.')
      source.cancel('Operation cancelled by user; replaced by new query.')
    }

    commit('updateQuery', query)
    commit('setFetching', true)

    /* eslint-disable camelcase */
    return axios.get('http://api.giphy.com/v1/gifs/search', {
      cancelToken: source.token,
      params: {
        q: state.query,
        api_key: 'dc6zaTOxFJmzC',
      }
    }).then((response) => {
      if (response.status === 200) {
        commit('storeSearchResponse', response)
      } else {
        console.err('Failed to query giphy api!', response)
      }
      commit('setFetching', false)
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.log('Request cancelled.', error.message)
      } else if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else {
        console.log('Axios Error: ', error.message)
      }
      commit('setFetching', false)
    })
  },

  searchByGifId ({ commit, state }, gifId) {
    // try last local search results first
    // [REFACTOR] into main store insead of naive last search store
    // if (state.giphy.results && state.giphy.results.length > 0) {
    //   let idx = state.giphy.results.findIndex(g => g.id === state.gifId)
    //   if (idx !== -1) {
    //     commit('storeSingleResponse', state.giphy.results[idx])
    //     return
    //   }
    // }
    if (!gifId || gifId === '' || gifId === state.gifId) {
      console.log(`No need to run new gifId query; '${gifId}' is invalid.`)
    }
    if (state.isFetching) {
      source.cancel('Operation cancelled by user; replaced by single-gif query.')
    }

    console.log(`*new* searchByGifId('${gifId}') ...`)
    commit('updateGifId', gifId)
    commit('setFetching', true)

    /* eslint-disable camelcase */
    return axios.get(`http://api.giphy.com/v1/gifs/${state.gifId}`, {
      cancelToken: source.token,
      params: {
        api_key: 'dc6zaTOxFJmzC',
      }
    }).then((response) => {
      if (response.status === 200) {
        commit('storeSingleResponse', response)
      } else {
        console.err('Failed to query giphy api!', response)
      }
      commit('setFetching', false)
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.log('Request cancelled.', error.message)
      } else if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else {
        console.log('Axios Error: ', error.message)
      }
      commit('setFetching', false)
    })
  },

  clearAll ({ commit, state }) {
    if (state.isFetching) {
      source.cancel('Operation cancelled by user; replaced by new query.')
    }
    commit('clearAll')
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  strict: true,
})

export default store
