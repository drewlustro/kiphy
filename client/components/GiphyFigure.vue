<template>
  <div class="giphy-figure">
    <div v-if="size === 'thumbnail'">
      <router-link :to="thumbnailLink" class="thumbnail-link">
        <img :src="stillUrl" :alt="id" :title="slug" class="still">
        <img :src="url" :alt="id" :title="slug" class="animated">
      </router-link>
      <!-- <input type="text" :value="id" @click="selectAll"> -->
    </div>
    <div v-else-if="size === 'single'">
      <div class="single">
        <img :src="originalUrl" :alt="id" :title="slug">
      </div>

      <div class="metadata">
        <button v-on:click.prevent :class="favoriteClass" @click="favorite">&#9733;</button>

        <span class="spec">Dimensions: {{ width }} &times; {{ height }} pixels</span>
        <span class="spec">Source: <a :href="source" target="_blank" rel="noopener" class="source">{{ source }}</a></span>
        <span class="spec">Rating: {{ rating }} </span>
        <span class="spec">Uploaded {{ importDatetimeRelativeToNow }} </span><br>

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
    isFaved () {
      return this.$store.getters.isFavoritedId(this.id)
    },
    favoriteClass () {
      return {
        'favorite': true,
        'active': this.isFaved
      }
    },
    thumbnailLink () {
      if (this.isFaved) {
        return {
          name: 'favorite-single',
          params: { gifId: this.id }
        }
      }
      return {
        name: 'single',
        params: { query: this.query, gifId: this.id }
      }
    },
    query () {
      if (this.$store.state.query) {
        return this.$store.state.query
      } else if (this.$route.params.query) {
        return this.$route.params.query
      } else if (this.isFaved) {
        return 'favorites'
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
    favorite (e) {
      if (!this.isFaved) {
        this.$store.commit('ADD_FAVORITE', this.id)
      } else {
        this.$store.commit('REMOVE_FAVORITE', this.id)
      }
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

    .favorite
      float: right
      width: 50%
      max-width: 100px
      font-size: 3rem
      padding: 1rem
      text-align: right
      color: $grey-30
      font-weight: bold
      border: 0
      background-color: transparent
      cursor: pointer
      +no-outline

      &.active
        color: gold
        font-weight: bold

  .single
    +clearfix
    img
      width: 100%
      max-width: 100vmin
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

.spec
  display: block
  +text-tail-truncate($single-line: true)
  max-width: 70vw
</style>
