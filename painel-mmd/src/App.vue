<template>
  <div id="app">
    <navbar v-if="Uid"/>
    <router-view class="container"/>
  </div>
</template>

<script>
import navbar from './components/global/navbar.vue';

export default {
  name: 'app',
  components: {
    navbar,
  },
  data() {
    return {
      Uid: null,
    }
  },
  watch: {
    $route() {
      this.Uid = localStorage.getItem('Uid');
    }
  },
  mounted() {
    this.Uid = localStorage.getItem('Uid');
  },
};
</script>
