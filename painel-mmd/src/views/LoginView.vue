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
        <div v-if="load" class="loader">
          <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
          <p>Entrando...</p>
        </div>
        <input v-else class="btn" type="submit" value="Entrar">
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
      load: false
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
      this.load = true
      const response = await loginWithEmail(this.mail, this.password)
      
      if (response.status === 'finished') {
        this.load = false
        this.$router.push({ name: 'Pannel' });
        return
      }
      
      
      this.load = false
      this.error = response.msg
    },
  },
};
</script>
