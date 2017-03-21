<template>
  <div class="page">
    <router-link to="/">Kiphy</router-link>
    <br>

    <search-box></search-box>
    <div v-if="gifId">
      <div class="search-breadcrumb">
        <router-link :to="{ name: 'term', params: { query: query }}">{{ query }}</router-link> / {{ gifId }}
      </div>
      <giphy-figure v-if="single" size="single" :api-data="single"></giphy-figure>
    </div>
    <div v-else-if="gifs">
      <div class="search-breadcrumb">
        {{ query }} / {{ gifs.length }} results
      </div>
      <ul id="gif-list" class="gif-list">
        <li v-for="g in gifs">
          <giphy-figure :api-data="g"></giphy-figure>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import GiphyFigure from 'components/GiphyFigure'
import { mapState } from 'vuex'

export default {
  props: {
    query: {
      type: String,
      required: false
    },
    gifId: {
      type: String,
      required: false
    }
  },
  computed: mapState({
    gifs: state => state.giphy.searchResponse ? state.giphy.searchResponse : [],
    single: state => state.giphy.single ? state.giphy.single : false,
    draftQuery: state => state.draftQuery,
  }),
  components: {
    'search-box': SearchBox,
    'giphy-figure': GiphyFigure
  },

  created () {
    if (this.$route.params.gifId || this.$route.params.query) {
      if (!this.draftQuery || this.draftQuery === '') {
        this.$store.commit('updateDraftQuery', this.$route.params.query)
      }
      this.search()
    }
  },

  watch: {
    '$route': 'search'
  },

  methods: {
    search () {
      if (this.$route.params.gifId) {
        if (this.$route.params.query) {
          this.$store.commit('updateQuery', this.$route.params.query)
        }
        this.$store.commit('updateGifId', this.$route.params.gifId)
        this.$store.dispatch('searchSingleGif')
      } else if (this.$route.params.query) {
        this.$store.commit('updateDraftQuery', this.$route.params.query)
        this.$store.dispatch('search')
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    if (to.name === 'index' && from && from.name !== 'index') {
      this.$store.dispatch('clearAll')
    }
    next()
  }

}
</script>
<style lang="sass">
.gif-list
  list-style: none
  padding: 0
  margin: 0
  display: block
  height: 100%
  display: flex
  flex-wrap: wrap
  align-content: flex-start

  li
    width: 50%
    overflow: hidden

.search-breadcrumb
  text-align: left
  font-size: 1rem
  padding: 1em
</style>
