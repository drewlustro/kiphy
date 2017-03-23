<template>
  <div class="giphy-figure">
    <div v-if="size === 'thumbnail'">
      <router-link :to="{ name: 'single', params: { query: query, gifId: id }}" class="thumbnail-link">
        <img :src="stillUrl" :alt="id" :title="slug" class="still">
        <img :src="url" :alt="id" :title="slug" class="animated">
      </router-link>
      <!-- <input type="text" :value="id" @click="selectAll"> -->
    </div>
    <div v-else-if="size === 'single'">
      <div class="single">
        <img :src="originalStillUrl" :alt="id" :title="slug" class="still">
        <img :src="originalUrl" :alt="id" :title="slug" class="animated">
      </div>

      <div class="metadata">
        <a href="#" v-on:click.prevent class="fave" @click="fave">Fave</a>
        <strong>Dimensions:</strong> {{ width }} &times; {{ height }} pixels <br>
        <strong>Source:</strong> <a :href="source" target="_blank" rel="noopener">{{ source }}</a><br>
        <strong>Rating:</strong> {{ rating }} <br>
        Uploaded {{ importDatetimeRelativeToNow }} <br>

        <button class="shuffle" @click="shuffle">Shuffle</button>
      </div>


    </div>
    <div v-else>
      Unknown / not enough props.
    </div>
  </div>
</template>

<script>

import moment from 'moment'

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
    source () {
      return this.apiData.source
    },
    rating () {
      return this.apiData.rating
    },
    importDatetime () {
      return this.apiData.import_datetime
    },
    importDatetimeRelativeToNow () {
      return moment(this.importDatetime).fromNow()
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
    },
    shuffle (e) {
      console.log('shuffle clicked!')
    },
    fave (e) {
      this.$store.commit('ADD_FAVORITE', this.id)
    }
  }
}
</script>
<style lang="sass">
@import ~styles/common

.giphy-figure
  width: 100%
  cursor: pointer
  text-align: center
  +respond-to(desktop-width)
    margin: 1em 0

  &:hover
    .still
      display: none
    .animated
      display: inline-block

  .thumbnail-link
    display: block
    text-align: center

  .metadata
    @extend %primary-column-bound
    font-size: 1rem
    text-align: left
    padding: 1em
    line-height: 1.41

    .fave
      float: right
      width: 50%
      max-width: 100px
      margin-right: 1em
      margin-top: 1em

  .single
    +clearfix
    img
      width: 100%
      max-width: 100%
      max-height: 60vh
      overflow: hidden

  .shuffle
    margin-top: 1em
    display: block
    width: 100%
    text-align: center
    background-color: lighten($dropbox-color,40%)
    padding: 10px 30px
    border: 1px solid darken($dropbox-color, 10%)
    color: mix($dropbox-color, $white, 90%)
    font-size: 1rem
    text-transform: uppercase
    letter-spacing: 0.1em


.still
  display: inline-block
.animated
  display: none

</style>
