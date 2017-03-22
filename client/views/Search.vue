<template>
  <div class="page">
    <h4>Search</h4>
    <search-box :draft-query="query"></search-box>

    <div v-if="gifs">
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
  computed: mapState({
    gifs: state => state.giphy.results ? state.giphy.results : [],
    single: state => state.giphy.single ? state.giphy.single : false,
    query: state => state.route.params.query,
  }),
  components: {
    'search-box': SearchBox,
    'giphy-figure': GiphyFigure
  },

  created () {
    if (this.query) {
      this.search()
    }
  },

  watch: {
    '$route': 'search'
  },

  methods: {
    search () {
      if (this.query) {
        this.$store.dispatch('search', this.query)
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
