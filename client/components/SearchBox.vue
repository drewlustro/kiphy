<template>
  <div class="search-box-wrapper">
    <form v-on:submit.prevent>
      <input type="text" v-model="query" placeholder="search gifs..." >
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
@import ~styles/common

.search-box-wrapper
  form
    display: flex
    // padding-right: 2em

    input[type=text]
      flex-grow: 1
      margin: 0
      margin-right: 0.5em
      font-size: 2rem
      padding: 10px 20px
      width: calc(100% - 4em - 0.5em)
      +respond-to(desktop-width)
        max-width: none

    button
      flex-grow: 0
      min-width: 4em
      background-color: $dropbox-color
      padding: 10px 30px
      border: 1px solid darken($dropbox-color, 10%)
      color: mix($dropbox-color, $white, 22%)
      font-size: 1.1rem
      text-transform: uppercase
      letter-spacing: 0.1em
      text-shadow: 0 1px 0 darken($dropbox-color, 50%)

    input[type=text], button
      max-height: 60px

</style>
