<template>
  <div class="search-box-wrapper">
    <form v-on:submit.prevent>
      <input type="text" :value="draftQuery" @input="updateDraftQuery" placeholder="Kiphy search..." >
      <button @click="search()">Search</button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  computed: mapState(['draftQuery']),

  methods: {
    updateDraftQuery (e) {
      this.$store.commit('updateDraftQuery', e.target.value)
    },
    search () {
      this.$router.push({ name: 'term', params: { query: this.$store.state.draftQuery }})
    }
  }
}
</script>

<style lang="sass">

</style>
