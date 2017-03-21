<template>
  <div class="page">
    <search-box></search-box>
    <counter></counter>

  </div>
</template>

<script>
import Counter from 'components/Counter'
import SearchBox from 'components/SearchBox'

export default {
  components: {
    Counter,
    'search-box': SearchBox
  },
  methods: {
    search (q) {

    }
  }
}
</script>
