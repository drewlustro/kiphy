<template>
  <div class="giphy-figure">
    <div v-if="size === 'thumbnail'">
      <router-link :to="{ name: 'single', params: { query: query, gifId: id }}">
        <img :src="stillUrl" :alt="id" :title="slug" class="still">
        <img :src="url" :alt="id" :title="slug" class="animated">
      </router-link>
      <input type="text" :value="id" @click="selectAll">
    </div>
    <div v-else-if="size === 'single'">
      <img :src="originalStillUrl" :alt="id" :title="slug" class="still">
      <img :src="originalUrl" :alt="id" :title="slug" class="animated">

      <div class="metadata">
        <strong>Dimensions:</strong> {{ width }} &times; {{ height }} pixels <br>
        <strong>Size:</strong> {{ filesize }} bytes <br>
        <strong>Frames:</strong> {{ frames }} <br>
      </div>
    </div>
    <div v-else>
      Unknown / not enough props.
    </div>
  </div>
</template>

<script>
export default {
  name: 'giphy-figure',
  props: {
    apiData: {
      required: true,
    },
    size: {
      type: String,
      default: 'thumbnail',
      required: false
    },
  },
  computed: {
    id () {
      return this.apiData ? this.apiData.id : ''
    },
    type () {
      return this.apiData ? this.apiData.type : 'none'
    },
    slug () {
      return this.apiData ? this.apiData.slug : ''
    },
    url () {
      return this.apiData.images.fixed_height.url
    },
    stillUrl () {
      return this.apiData.images.fixed_height_still.url
    },
    originalUrl () {
      return this.apiData.images.original.url
    },
    originalStillUrl () {
      return this.apiData.images.original_still.url
    },
    width () {
      return this.apiData.images.original.width
    },
    height () {
      return this.apiData.images.original.height
    },
    filesize () {
      return this.apiData.images.original.size
    },
    frames () {
      return this.apiData.images.original.frames
    },
    query () {
      if (this.$store.state.query) {
        return this.$store.state.query
      } else if (this.$route.params.query) {
        return this.$route.params.query
      }
      return undefined
    }
  },
  data () {
    return {

    }
  },
  methods: {
    selectAll (e) {
      e.target.select()
    }
  }
}
</script>
<style lang="sass">
.giphy-figure
  min-width: 200px
  min-height: 200px
  border: 1px solid #ccc
  margin: 1em
  cursor: pointer
  text-align: center

  &:hover
    .still
      display: none
    .animated
      display: block

  .metadata
    font-size: 1rem
    text-align: left
    padding: 1em

.still
  display: block
.animated
  display: none

</style>
