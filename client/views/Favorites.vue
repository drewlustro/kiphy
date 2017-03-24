<template>
  <div class="page">
    <navigation :draft-query="query"></navigation>
    <h1 class="title">Favorites</h1>

    <div class="breadcrumb">
      {{ count }} favorites
    </div>

    <div v-if="gifs">

      <ul id="gif-list" class="gif-list">
        <li v-for="g in gifs">
          <giphy-figure :api-data="g"></giphy-figure>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Navigation from 'components/Navigation'
import GiphyFigure from 'components/GiphyFigure'
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      gifs: state => state.giphy.favorites ? state.giphy.favorites : [],
      single: state => state.giphy.single ? state.giphy.single : false,
      query: state => state.route.params.query,
    }),
    ...mapGetters({
      count: 'favoriteCount',
    })
  },
  components: {
    'navigation': Navigation,
    'giphy-figure': GiphyFigure
  },

  created () {
    this.search()
  },

  watch: {
    '$route': 'search'
  },

  methods: {
    search () {
      if (this.count > 0) {
        this.$store.dispatch('searchFavorites')
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

@import ~styles/common

.gif-list
  list-style: none
  padding: 0
  margin: 0
  display: block
  height: 100%
  display: flex
  flex-wrap: wrap
  justify-content: center
  align-content: center

  li
    overflow: hidden
    width: 100%
    text-align: center
    margin-bottom: 1em
    // border: 1px solid $grey-15
    // background-color: $grey-5

    +respond-to(desktop-width)
      width: 50%
      // background-color: transparent
      // border: 0

.search-breadcrumb
  text-align: left
  font-size: 1rem
  padding: 1em
</style>
