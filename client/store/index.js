import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import { giphyApi, cancelTokenSource, handleGiphyApiException } from 'api'

Vue.use(Vuex)

// persistent browser localStorage
const sessionStore = require('store')
const defaultsPlugin = require('store/plugins/defaults')
sessionStore.addPlugin(defaultsPlugin)
sessionStore.defaults({
  lastUpdated: undefined,
  favoriteIds: [],
  library: [],
})

const state = {
  query: '',
  gifId: '',
  isApiFetching: false,
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
      return undefined
    }
    const filtered = state.giphy.results.filter(x => x.id !== excludeId)
    if (filtered.length > 0) {
      const randomIdx = Math.floor(Math.random() * filtered.length)
      return state.giphy.results[randomIdx]
    }
    return undefined
  }
}

const mutations = {
  [types.SET_API_FETCHING] (state, isApiFetching) {
    state.isApiFetching = isApiFetching
  },
  [types.UPDATE_QUERY] (state, query) {
    state.query = query
  },
  [types.UPDATE_GIF_ID] (state, gifId) {
    state.gifId = gifId
  },

  [types.STORE_SINGLE_RESPONSE] (state, response) {
    state.giphy.single = response.data.data
  },
  [types.STORE_SEARCH_RESPONSE] (state, response) {
    state.giphy.results = response.data.data
  },
  [types.STORE_FAVORITES_RESPONSE] (state, response) {
    state.giphy.favorites = response.data.data
  },

  [types.ADD_FAVORITE] (state, gifId) {
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
  [types.REMOVE_FAVORITE] (state, gifId) {
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

  [types.CLEAR_GIPHY_SEARCH_TERMS] (state) {
    state.query = ''
  },

  [types.CLEAR_GIPHY_API_CACHE] (state) {
    state.gifId = ''
    state.query = ''
    state.isApiFetching = false
    state.giphy.single = undefined
    state.giphy.results = undefined
    state.giphy.favorites = undefined
  }
}

const actions = {
  search ({ commit, state }, query) {
    if (!query || query === '') {
      return Promise.reject(new Error(`No need to run new search; '${query}' is invalid.`))
    }

    if (state.isApiFetching) {
      cancelTokenSource.cancel('[API] Operation cancelled by user; replaced by new query.')
    }

    console.log(`[API] search '${query}'  ...`)

    commit(types.UPDATE_QUERY, query)
    commit(types.SET_API_FETCHING, true)

    /* eslint-disable camelcase */
    return giphyApi.get('/gifs/search', {
      params: {
        q: state.query
      }
    }).then((response) => {
      if (response.status === 200) {
        commit(types.STORE_SEARCH_RESPONSE, response)
      } else {
        console.err('[API] Failed to query giphy api!', response)
      }
    })
    .catch(handleGiphyApiException)
    .then(() => commit(types.SET_API_FETCHING, false))
  },

  searchByGifId ({ commit, state }, gifId) {
    if (!gifId || gifId === '') {
      return Promise.reject(new Error(`No need to run new gifId query; '${gifId}' is invalid.`))
    }

    if (state.isApiFetching) {
      cancelTokenSource.cancel('[API] Operation cancelled by user; replaced by single-gif query.')
    }

    console.log(`[API] searchByGifId '${gifId}' ...`)

    commit(types.UPDATE_GIF_ID, gifId)
    commit(types.SET_API_FETCHING, true)

    return giphyApi.get(`/gifs/${state.gifId}`)
    .then((response) => {
      if (response.status === 200) {
        commit(types.STORE_SINGLE_RESPONSE, response)
      } else {
        console.err('[API] Failed to query giphy api!', response)
      }
    })
    .catch(handleGiphyApiException)
    .then(() => commit(types.SET_API_FETCHING, false))
  },

  searchFavorites ({ commit, state, getters }) {
    if (getters.favoriteIdsCount <= 0) {
      return Promise.reject(new Error(`No favorites to fetch.`))
    }

    if (state.isApiFetching) {
      cancelTokenSource.cancel('[API] Operation cancelled by user; replaced by new query.')
    }

    const ids = getters.favoriteIds.join(',')
    console.log(`[API] searchByGifIds '${ids}' ...`)

    commit(types.SET_API_FETCHING, true)

    return giphyApi.get('/gifs', {
      params: { ids }
    }).then((response) => {
      if (response.status === 200) {
        commit(types.STORE_FAVORITES_RESPONSE, response)
      } else {
        console.err('[API] Failed to query giphy api for favorites!', response)
      }
    })
    .catch(handleGiphyApiException)
    .then(() => commit(types.SET_API_FETCHING, false))
  },

  [types.CLEAR_GIPHY_API_CACHE] ({ commit, state }) {
    if (state.isApiFetching) {
      cancelTokenSource.cancel('[API] Operation cancelled by user.')
    }
    commit(types.CLEAR_GIPHY_API_CACHE)
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  types,
  strict: true,
})

export default store
