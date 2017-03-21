import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

Vue.use(Vuex)

const state = {
  count: 0,
  draftQuery: '',
  query: '',
  gifId: '',
  giphy: {
    isFetching: false,
    single: {
      data: undefined
    },
    response: {
      data: []
    }
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
  updateGiphyResponse (state, response) {
    state.giphy.response = response
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
  }
}

const actions = {
  search ({ commit, state }) {
    if (!state.draftQuery || state.draftQuery === '' || state.draftQuery === state.query) {
      console.log(`No need to run new query; draftQuery is invalid.`)
      return
    }

    if (state.giphy.isFetching) {
      source.cancel('Operation cancelled by user; replaced by new query.')
    }

    console.log(`*new* search('${state.draftQuery}') giphy async...`)
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
        commit('updateGiphyResponse', response.data)
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
    if (state.giphy.response && state.giphy.response.length > 0) {
      let idx = state.giphy.response.findIndex(g => g.id === state.gifId)
      if (idx !== -1) {
        console.log(`Success! Found giphy data via local store. [idx: ${idx}]`)
        commit('updateGiphySingle', state.giphy.response[idx])
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
        commit('updateGiphySingle', response.data)
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
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  strict: true,
})

export default store
