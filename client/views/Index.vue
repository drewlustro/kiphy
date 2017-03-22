<template>
  <div class="page">
    <h4>Index</h4>
    <search-box></search-box>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    // draftQuery: state => state.draftQuery,
  }),
  components: {
    'search-box': SearchBox,
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
