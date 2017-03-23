<template>
  <div class="page">
    <navigation :draft-query="query"></navigation>
    <h1 class="title">Gif Detail</h1>
    <div v-if="gifId">
      <div class="breadcrumb">
        <router-link :to="{ name: 'search', params: { query: query }}">{{ query }}</router-link> / {{ gifId }}
      </div>
      <giphy-figure v-if="single" size="single" :api-data="single"></giphy-figure>
    </div>
  </div>
</template>

<script>
import Navigation from 'components/Navigation'
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
    'navigation': Navigation,
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
