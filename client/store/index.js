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
  favoriteIds: [],
  library: [],
})

const state = {
  query: '',
  gifId: '',
  isFetching: false,
  giphy: {
    single: undefined,
    results: undefined,
    favorites: undefined,
  },
  session: {
    lastUpdated: sessionStore.get('updated'),
    favoriteIds: sessionStore.get('favoriteIds'),
    library: sessionStore.get('library')
  }
}

const getters = {
  favoriteCount: state => state.session.favoriteIds.length,
  favoriteIds: state => state.session.favoriteIds,
  isFavoritedId: (state, getters) => (id) => {
    return getters.favoriteIds.includes(id)
  },
  getRandomGifResult: state => (excludeId) => {
    if (!state.giphy.results || state.giphy.results.length <= 0) {
      console.log('no results', state.giphy.results)
      return undefined
    }
    const filtered = state.giphy.results.filter(x => x.id !== excludeId)
    if (filtered.length > 0) {
      const randomIdx = Math.floor(Math.random() * filtered.length)
      return state.giphy.results[randomIdx]
    }
    console.log('no filtered to choose from: ', filtered)
    return undefined
  }
}

const mutations = {

  updateQuery (state, query) {
    state.query = query
  },
  updateGifId (state, gifId) {
    state.gifId = gifId
  },

  storeSingleResponse (state, response) {
    state.giphy.single = response.data.data
  },
  storeSearchResponse (state, response) {
    state.giphy.results = response.data.data
  },
  storeFavoritesResponse (state, response) {
    state.giphy.favorites = response.data.data
  },

  setFetching (state, isFetching) {
    state.isFetching = isFetching
  },

  UPDATE_STORE_TIMESTAMP (state) {
    state.session.lastUpdated = (new Date()).toISOString()
    sessionStore.set('lastUpdated', state.session.lastUpdated)
  },

  ADD_FAVORITE (state, gifId) {
    if (state.session.favoriteIds.indexOf(gifId) !== -1) {
      console.log(`${gifId} already in favoriteIds. Ignoring...`)
      return
    }
    state.session.favoriteIds.push(gifId) // naive
    sessionStore.set('favoriteIds', state.session.favoriteIds)
    console.log(`[ADD_FAVORITE] after: ${sessionStore.get('favoriteIds')}`)

    // will force refetch when visiting /favorites
    state.giphy.favorites = undefined
  },

  REMOVE_FAVORITE (state, gifId) {
    const favoriteIds = state.session.favoriteIds
    const idx = favoriteIds.indexOf(gifId)
    if (idx !== -1) {
      const deleted = favoriteIds.splice(idx, 1)
      console.log(`Deleted ${deleted} from store at index ${idx}.`)
      state.session.favoriteIds = favoriteIds
      sessionStore.set('favoriteIds', state.session.favoriteIds)

      // will force refetch when visiting /favorites
      state.giphy.favorites = undefined // known inefficient
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
    state.giphy.favorites = undefined
  }
}

const actions = {
  search ({ commit, state }, query) {
    if (!query || query === '') {
      console.log(`No need to run new search; '${query}' is invalid.`)
      return
    }

    if (state.isFetching) {
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
      } else {
        console.log('Axios Error: ', error.message)
      }
      commit('setFetching', false)
    })
  },

  searchByGifId ({ commit, state }, gifId) {
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

  searchFavorites ({ commit, state, getters }) {
    if (getters.favoriteIdsCount <= 0) return

    if (state.isFetching) {
      source.cancel('Operation cancelled by user; replaced by new query.')
    }

    commit('setFetching', true)
    const ids = getters.favoriteIds.join(',')
    /* eslint-disable camelcase */
    return axios.get('http://api.giphy.com/v1/gifs', {
      cancelToken: source.token,
      params: {
        ids: ids,
        api_key: 'dc6zaTOxFJmzC',
      }
    }).then((response) => {
      if (response.status === 200) {
        commit('storeFavoritesResponse', response)
      } else {
        console.err('Failed to query giphy api for favorites!', response)
      }
      commit('setFetching', false)
    }).catch((error) => {
      if (axios.isCancel(error)) {
      } else if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
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
  getters,
  mutations,
  actions,
  strict: true,
})

export default store
