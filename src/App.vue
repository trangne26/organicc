<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// App.vue now only contains router-view
// Layout is handled by individual layout components (ClientLayout, AdminLayout)
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>