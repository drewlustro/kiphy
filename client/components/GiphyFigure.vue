<template>
  <div class="giphy-figure">
    <div v-if="type === 'gif'">
      <router-link :to="{ name: 'gif', params: { query: query, gifId: id }}">
        <img :src="stillUrl" :alt="id" :title="slug" class="still">
        <img :src="url" :alt="id" :title="slug" class="animated">
      </router-link>
      <input type="text" :value="id" @click="selectAll">
    </div>
    <div v-else-if="type === 'video'">
      Video '{{ url }}'
    </div>
    <div v-else>
      Unknown / not enough props.
    </div>
  </div>
</template>

<script>
export default {
  name: 'giphy-figure',
  // props: ['id', 'type', 'slug', 'gifUrl', 'videoUrl'],
  props: ['apiData'],
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
      switch (this.type) {
        case 'gif':
          return this.apiData.images.fixed_height.url
        case 'video':
          return this.apiData.images.looping.mp4
        default:
          ; //
      }
      return false
    },
    stillUrl () {
      switch (this.type) {
        case 'gif':
        case 'video':
          return this.apiData.images.fixed_height_still.url
        default:
          ; //
      }
      return false
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

.still
  display: block
.animated
  display: none

</style>
