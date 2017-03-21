<template>
  <div class="page">
    <search-box></search-box>
    <ul id="gif-list" class="gif-list">
      <li v-for="g in gifs">
        <giphy-figure :api-data="g"></giphy-figure>
      </li>
    </ul>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import GiphyFigure from 'components/GiphyFigure'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    gifs: state => state.giphy.response.data
  }),
  components: {
    'search-box': SearchBox,
    'giphy-figure': GiphyFigure
  },
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
