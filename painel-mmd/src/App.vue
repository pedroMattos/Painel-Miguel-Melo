<template>
  <div id="app">
    <navbar/>
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
      uid: window.uid,
    };
  },
  mounted() {
    this.uid = window.uid;
  },
};
</script>
