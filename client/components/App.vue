<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="sass">
body
  margin: 0
  font-size: 1.2rem
  font-family: -apple-system, BlinkMacSystemFont, 'avenir next', avenir, helvetica, 'helvetica neue', Ubuntu, 'segoe ui', arial, sans-serif

img
  max-width: 100%

.page
  text-align: center
  /* nesting for the need to test postcss */
  code
    background-color: #f0f0f0
    padding: 3px 5px
    border-radius: 2px
</style>
