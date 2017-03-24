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
}
</script>
<style lang="sass">

@import ~styles/common

</style>
