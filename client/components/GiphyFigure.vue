<template>
  <div class="giphy-figure">
    <div v-if="type === 'gif'">
      <img :src="url" :alt="id" :title="slug">
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
    }
  },
  data () {
    return {

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
</style>
