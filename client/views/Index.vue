<template>
  <div class="page">
    <navigation></navigation>
    <h1 class="title">Index</h1>

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


</style>
