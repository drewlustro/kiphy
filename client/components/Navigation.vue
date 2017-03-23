<template>
  <nav class="navigation">
    <router-link to="/" class="logo">Kiphy</router-link>
    <search-box :draft-query="draftQuery" class="search-box"></search-box>
  </nav>
</template>

<script>
import SearchBox from 'components/SearchBox'

export default {
  name: 'navigation',
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
    flex-grow: 1
    width: 100%
    height: 60px
    line-height: 60px * 0.9
    padding-left: 0.2em
    font-size: 1.5rem
    font-style: italic
    text-decoration: none
    background-color: $grey-85
    color: $grey-20
    text-align: center

    +respond-to(desktop-width)
      flex-grow: 0
      height: 80px
      line-height: 80px * 0.9
      max-width: 100px
      margin-right: 0.5em
      padding-left: 0
      background-color: transparent
      color: $grey-85
      text-align: left
      font-size: 2rem

  .search-box
    flex-grow: 1
    padding: 0.5em



</style>
