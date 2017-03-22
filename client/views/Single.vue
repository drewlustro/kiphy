<template>
  <div class="page">
    <h4>Single</h4>
    <search-box :draft-query="query"></search-box>
    <div v-if="gifId">
      <div class="search-breadcrumb">
        <router-link :to="{ name: 'search', params: { query: query }}">{{ query }}</router-link> / {{ gifId }}
      </div>
      <giphy-figure v-if="single" size="single" :api-data="single"></giphy-figure>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import GiphyFigure from 'components/GiphyFigure'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    // gifs: state => state.giphy.results ? state.giphy.results : [],
    single: state => state.giphy.single ? state.giphy.single : false,
    query: state => state.route.params.query,
    gifId: state => state.route.params.gifId
  }),
  components: {
    'search-box': SearchBox,
    'giphy-figure': GiphyFigure
  },

  created () {
    if (this.gifId) {
      this.findById()
    }
  },

  watch: {
    '$route': 'findById'
  },

  methods: {
    findById () {
      this.$store.dispatch('searchByGifId', this.gifId)
    }
  },

}
</script>
<style lang="sass">


.search-breadcrumb
  text-align: left
  font-size: 1rem
  padding: 1em
</style>
