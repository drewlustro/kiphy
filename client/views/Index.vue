<template>
  <div class="page">
    <navigation></navigation>
    <h1 class="title">Welcome</h1>
    <div class="hero-notice">
      Why not search for some GIF's? They'll appear here ;)
    </div>
  </div>
</template>

<script>
import Navigation from 'components/Navigation'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    // draftQuery: state => state.draftQuery,
  }),
  components: {
    Navigation,
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
.hero-notice
  @extend %primary-column-bound
  border: 2px solid #ddd
  border-radius: 2px
  padding: 4em
  text-align: center
  font-size: 2em
  background-color: #fafafa
  color: #aaa
  font-weight: 200
</style>
