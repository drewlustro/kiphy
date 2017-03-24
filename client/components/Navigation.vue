<template>
  <nav class="navigation">
    <router-link to="/" class="logo">Kiphy</router-link>
    <search-box :draft-query="draftQuery" class="search-box"></search-box>
    <router-link :to="{ name: 'favorites' }" class="aside-link">Favorites <span v-show="favoriteCount > 0">({{ favoriteCount }})</span></router-link>
  </nav>
</template>

<script>
import SearchBox from 'components/SearchBox'
import { mapGetters } from 'vuex'

export default {
  name: 'navigation',
  computed: {
    ...mapGetters({
      favoriteCount: 'favoriteCount',
    })
  },
  props: {
    draftQuery: {
      type: String,
      default: ''
    }
  },
  components: {
    'search-box': SearchBox,
  },
}
</script>

<style lang="sass">
@import ~styles/common

.navigation
  display: flex
  flex-wrap: wrap
  width: 100%
  max-width: $primary-column-max-width
  margin-left: auto
  margin-right: auto
  margin-bottom: 2em
  +respond-to(desktop-width)
    flex-wrap: nowrap


  .logo
    order: 1
    flex-grow: 1
    width: 50%
    height: 60px
    line-height: 60px * 0.9
    padding-left: 1rem
    font-size: 1.5rem
    font-style: italic
    text-decoration: none
    background-color: $grey-85
    color: $grey-20
    text-align: left

    +respond-to(desktop-width)
      flex-grow: 0
      height: 80px
      line-height: 80px * 0.9
      max-width: 100px
      margin-right: 0.5em
      padding-left: 0
      background-color: transparent
      color: $grey-85
      font-size: 2rem

  .search-box
    order: 3
    flex-grow: 1
    padding: 0.5em
    +respond-to(desktop-width)
      order: 2

  .aside-link
    order: 2
    flex-grow: 1
    width: auto
    text-align: right
    background-color: $grey-85
    line-height: 60px * 0.9
    color: $grey-40
    padding: 0 1rem
    text-decoration: none
    font-size: 1.1rem

    +respond-to(desktop-width)
      order: 3
      flex-grow: 0
      margin-left: 1em
      height: 80px
      line-height: 80px * 0.9
      background-color: transparent




</style>
