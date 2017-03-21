import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0,
  draftQuery: '',
  query: '',
  giphy: {
    results: [],
  },
}

const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  },
  updateDraftQuery (state, query) {
    state.draftQuery = query
  },
  updateQuery (state, query) {
    state.query = query
  },
  updateResults (state, results) {
    state.giphy.results = results
  },
}

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  },

  search ({ commit, state }) {
    if (!state.draftQuery || state.draftQuery === '' || state.draftQuery === state.query) {
      console.log(`No need to run new query; draftQuery is invalid.`)
      return
    }

    console.log(`*new* search('${state.draftQuery}') giphy async...`)
    console.log(commit, state)
    setTimeout(() => {
      commit('updateResults', ['fake result 1', 'fake result 2'])
      commit('updateQuery', state.draftQuery)
    }, 500)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  strict: true,
})

export default store
