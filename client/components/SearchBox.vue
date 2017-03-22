<template>
  <div class="search-box-wrapper">
    <form v-on:submit.prevent>
      <input type="text" v-model="query" placeholder="Kiphy search..." >
      <button @click="search()">Search</button>
    </form>
  </div>
</template>

<script>

export default {
  props: {
    draftQuery: {
      type: String,
      default: ''
    }
  },
  created () {
    if (this.draftQuery && this.draftQuery !== '') {
      this.query = this.draftQuery
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    // updateDraftQuery (e) {
    //   this.$store.commit('updateDraftQuery', e.target.value)
    // },
    search () {
      this.$router.push({ name: 'search', params: { query: this.query }})
    }
  }
}
</script>

<style lang="sass">

</style>
