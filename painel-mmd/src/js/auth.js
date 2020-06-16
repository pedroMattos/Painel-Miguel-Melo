
export default signin (mail, pass) = {
  async login() {
    const context = this;
    // recupera o valor das variaveis
    const { mail, pass } = this;
    try {
      // realiza a autenticação
      const res = await this.$firebase.auth().signInWithEmailAndPassword(mail, pass);
      window.uid = res.user.uid;
      if (window.uid) {
        this.$router.push({ name: 'Home' });
      } else {
        this.$router.push({ name: 'login' });
      }
    } catch (e) {
      // Tratamento de erros
      const notExist = 'Error: There is no user record corresponding to this identifier. The user may have been deleted.';
      const invalidPass = 'Error: The password is invalid or the user does not have a password.';
      const connection = 'Error: A network error (such as timeout, interrupted connection or unreachable host) has occurred.';
      // eslint-disable-next-line eqeqeq
      if (e == connection) {
        const error = 'Erro: Ocorreu um erro de rede (como tempo limite, conexão interrompida ou host inacessível)';
        context.err = error;
      }
      // eslint-disable-next-line eqeqeq
      if (e == invalidPass) {
        const error = 'Erro: a senha é inválida.';
        context.err = error;
      }
      // eslint-disable-next-line eqeqeq
      if (e == notExist) {
        const error = 'Erro: não há registro de usuário correspondente a este email. O usuário pode ter sido excluído.';
        context.err = error;
      }
    }
  },
}
