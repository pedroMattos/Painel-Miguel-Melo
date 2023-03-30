<template>
  <section class="container" id="login-container">
      <h1>login</h1>
      <form @submit.prevent="login" class="col s6">
        <div class="row">
          <div class="input-field col s12">
            <input id="email" v-model="mail" type="email" class="validate">
            <label for="email">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input v-model="password" id="password" type="password" class="validate">
            <label for="password">Password</label>
          </div>
        </div>
        <input class="btn" type="submit" value="Entrar">
        <p class="red-text">{{ error }}</p>
      </form>
  </section>
</template>

<script>
import loginWithEmail from "@/services/loginWithEmail.js"
export default {
  name: 'login',
  data() {
    return {
      mail: null,
      password: null,
      error: null,
    };
  },
  mounted() {
    if (localStorage.getItem('Uid')) {
      this.$router.push({ name: 'Pannel' });
      window.location.reload();
    }
  },
  methods: {
    async login() {
      const response = await loginWithEmail(this.mail, this.password)
      console.log({response})
      
      if (response.status)
        this.$router.push({ name: 'Pannel' });
    },
  },
};
</script>
