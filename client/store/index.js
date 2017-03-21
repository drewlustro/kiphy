import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

Vue.use(Vuex)

const state = {
  draftQuery: '',
  query: '',
  gifId: '',
  giphy: {
    isFetching: false,
    single: undefined,
    searchResponse: undefined
  },
}

const mutations = {
  // search gif via term
  updateDraftQuery (state, query) {
    state.draftQuery = query
  },
  updateQuery (state, query) {
    state.query = query
  },
  updateGiphySearchResponse (state, response) {
    state.giphy.searchResponse = response
  },

  // search gif via id
  updateGifId (state, gifId) {
    state.gifId = gifId
  },
  updateGiphySingle (state, gifSingle) {
    state.giphy.single = gifSingle
  },
  setGiphyFetching (state, isFetching) {
    state.giphy.isFetching = isFetching
  },

  // utility
  clearAll (state) {
    state.gifId = ''
    state.query = ''
    state.draftQuery = ''
    // TODO: revise to repeatable defaults
    state.giphy.isFetching = false
    state.giphy.single = undefined
    state.giphy.searchResponse = undefined
  }
}

const actions = {
  search ({ commit, state }) {
    if (!state.draftQuery || state.draftQuery === '') {
      console.log(`No need to run new query; draftQuery is invalid.`)
      return
    }

    if (state.giphy.isFetching) {
      console.log('Canceled existing search.')
      source.cancel('Operation cancelled by user; replaced by new query.')
    }

    console.log(`*new* broad search ('${state.draftQuery}')...`)
    commit('updateQuery', state.draftQuery)
    commit('setGiphyFetching', true)

    /* eslint-disable camelcase */
    axios.get('http://api.giphy.com/v1/gifs/search', {
      cancelToken: source.token,
      params: {
        q: state.query,
        api_key: 'dc6zaTOxFJmzC',
      }
    }).then((response) => {
      if (response.status === 200) {
        commit('updateGiphySearchResponse', response.data.data)
      } else {
        console.err('Failed to query giphy api!', response)
      }
      commit('setGiphyFetching', false)
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
      commit('setGiphyFetching', false)
    })
  },

  searchSingleGif ({ commit, state }) {
    // try last local search results first
    if (state.giphy.searchResponse && state.giphy.searchResponse.length > 0) {
      let idx = state.giphy.searchResponse.findIndex(g => g.id === state.gifId)
      if (idx !== -1) {
        commit('updateGiphySingle', state.giphy.searchResponse[idx])
        return
      }
    }

    if (state.giphy.isFetching) {
      source.cancel('Operation cancelled by user; replaced by single-gif query.')
    }

    console.log(`*new* single search('${state.gifId}') ...`)
    commit('updateQuery', state.draftQuery)
    commit('setGiphyFetching', true)

    /* eslint-disable camelcase */
    axios.get(`http://api.giphy.com/v1/gifs/${state.gifId}`, {
      cancelToken: source.token,
      params: {
        api_key: 'dc6zaTOxFJmzC',
      }
    }).then((response) => {
      if (response.status === 200) {
        commit('updateGiphySingle', response.data.data)
      } else {
        console.err('Failed to query giphy api!', response)
      }
      commit('setGiphyFetching', false)
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
      commit('setGiphyFetching', false)
    })
  },

  clearAll ({ commit, state }) {
    if (state.giphy.isFetching) {
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
