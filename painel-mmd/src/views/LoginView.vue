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
export default {
  name: 'login',
  data() {
    return {
      mail: null,
      password: null,
      error: null,
    };
  },
  methods: {
    async login() {
      this.$router.push({ name: 'Pannel' });
      window.uid = '123456';
      localStorage.setItem('Uid', '123456');
      window.location.reload();
      // const context = this;
      // // recupera o valor das variaveis
      // const { mail, password } = this;
      // try {
      //   // realiza a autenticação
      //   const res = await this.$firebase.auth().signInWithEmailAndPassword(mail, password);
      //   window.uid = res.user.uid;
      //   localStorage.setItem('Uid', res.user.uid);
      //   if (window.uid) {
      //     this.$router.push({ name: 'Pannel' });
      //     window.location.reload();
      //   } else {
      //     this.$router.push({ name: 'login' });
      //   }
      // } catch (e) {
      //   // Tratamento de erros
      //   const notExist = 'Error: There is no user record corresponding to this identifier. The user may have been deleted.';
      //   const invalidPass = 'Error: The password is invalid or the user does not have a password.';
      //   const connection = 'Error: A network error (such as timeout, interrupted connection or unreachable host) has occurred.';
      //   context.error = e;
      //   // eslint-disable-next-line eqeqeq
      //   if (e == connection) {
      //     const error = 'Erro: Ocorreu um erro de rede (como tempo limite, conexão interrompida ou host inacessível)';
      //     context.err = error;
      //   }
      //   // eslint-disable-next-line eqeqeq
      //   if (e == invalidPass) {
      //     const error = 'Erro: a senha é inválida.';
      //     context.err = error;
      //   }
      //   // eslint-disable-next-line eqeqeq
      //   if (e == notExist) {
      //     const error = 'Erro: não há registro de usuário correspondente a este email. O usuário pode ter sido excluído.';
      //     context.err = error;
      //   }
      // }
    },
  },
};
</script>
