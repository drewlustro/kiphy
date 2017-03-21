<template>
  <div class="page">
    <search-box></search-box>
    <div v-if="gifId">
      <giphy-figure v-if="single" :api-data="single"></giphy-figure>
    </div>
    <div v-else-if="gifs">
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
    gifs: state => state.giphy.response.data ? state.giphy.response.data : [],
    single: state => state.giphy.single.data ? state.giphy.single.data : false,
  }),
  components: {
    'search-box': SearchBox,
    'giphy-figure': GiphyFigure
  },

  created () {
    if (this.$route.params.gifId || this.$route.params.query) {
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

</style>
