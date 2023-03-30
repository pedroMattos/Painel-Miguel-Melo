<template>
  <nav class="grey darken-4">
    <div class="container nav-wrapper">
      <router-link to="/painel" class="brand-logo">
        <img width="50" src="../../assets/logo.png" alt="logo">
      </router-link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><router-link :to="{ name: 'NewProject' }">Adicionar</router-link></li>
        <li @click.prevent="logout"><a href="/">Logout</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import logoutUser from '../../services/logoutUser';
export default {
  name: 'navbar',
  methods: {
    async logout() {
      logoutUser()
      localStorage.removeItem('Uid')
      this.$router.push({ name: 'Login' });
      window.location.reload();
    },
  }
};
</script>
