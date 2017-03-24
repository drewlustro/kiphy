<template>
  <div class="page">
    <navigation :draft-query="query"></navigation>
    <h1 class="title">GIF Detail</h1>

    <div v-if="gifId">
      <div class="breadcrumb">
        <router-link :to="breadcrumbParentLink">{{ query ? query : 'favorites' }}</router-link> / {{ gifId }}
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
  computed: {
    breadcrumbParentLink () {
      if (this.query) {
        return { name: 'search', params: { query: this.query }}
      } else if (this.$route.name === 'favorite-single') {
        return { name: 'favorites' }
      }
      return { name: 'index' }
    },
    ...mapState({
      // gifs: state => state.giphy.results ? state.giphy.results : [],
      single: state => state.giphy.single ? state.giphy.single : false,
      query: state => state.route.params.query,
      gifId: state => state.route.params.gifId
    })
  },
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
