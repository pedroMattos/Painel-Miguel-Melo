<template>
  <!-- Modal Structure -->
  <div :id="identificador" class="custom row">
    <div class="content">
      <h4>{{ dados.name }}</h4>
      <div class="col s12 m4" v-for="images in dados.images" :key="images">
        <div>
          <img :src="images" alt="">
        </div>
      </div>
      <form @submit.prevent="attData">
        <div class="row">
          <div class="col s12">
            <div class="file-field input-field">
              <div class="btn">
                <span>Nova Imagem</span>
                <input accept="image/*"
                @change="handleFile($event)"
                type="file">
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text">
              </div>
            </div>
            <p
            v-if="receipt.name"
            >{{ receipt.name }}</p>
            <!-- <button v-if="receipt.name" @click="this.$set(receipt, 'name', null)">Remover</button> -->
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input v-model="dados.name" type="text">
            <label for="email">Nome</label>
          </div>
          <div class="input-field col s12">
            <input v-model="dados.slug" type="text">
            <label for="email">Slug</label>
          </div>
          <div class="input-field col s12">
            <input v-model="dados.type" type="text">
            <label for="email">Tipo</label>
          </div>
        </div>
        <input class="btn blue darken-2" type="submit" value="Atualizar">
        <button @click.prevent="close" class="btn red accent-4">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-edit',
  props: ['projeto', 'id'],
  data() {
    return {
      dados: this.projeto,
      identificador: this.id,
      receipt: {
        name: null,
      },
    };
  },
  computed: {
    fileName() {
      const {receipt} = this.dados;

      if (receipt) {
        const split = receipt.name.split('.');
        return `${split[0]}-${new Date().getTime()}.${split[1]}`
      } else {
        return ''
      }
    },
  },
  methods: {
    async attData() {
      const now = new Date;
      const id = this.dados.slug;
      const newId = id.replace(/[-]/g, '_');
      const date = now.getDate() +'/'+ now.getMonth()
      const newData = {
          Nome: this.dados.name,
          Slug: this.dados.slug,
          Tipo: this.dados.type,
          Imagens: this.dados.images,
          Last: date,
          // last_edit: doc.data().Last,
      };
          if (this.receipt) {
            const snapshot = await this.$firebase.storage()
              .ref(this.dados.name)
              .child(this.fileName)
              .put(this.dados.receipt);

              const url = await snapshot.ref.getDownloadURL();
              this.dados.images.push(url)
                    this.$firebase.firestore().collection('jobs').doc(newId).update(newData,
        ).then(() => {
          // eslint-disable-next-line no-alert
          alert('Atualizado com sucesso!');
          const custom = document.getElementById(this.dados.slug);
          custom.removeAttribute('style');
        })
          .catch((error) => {
            // eslint-disable-next-line no-alert
            alert(error);
            const custom = document.getElementById(this.dados.slug);
            custom.removeAttribute('style');
          });
          }
      },
      close() {
        const custom = document.getElementById(this.dados.slug);
        custom.removeAttribute('style');
      },
      handleFile({ target }) {
        this.dados.receipt = target.files[0]
        this.receipt = target.files[0];
        console.log(this.dados.images);
      },
  },
};
</script>
