<template>
  <form @submit.prevent="addNewData">
    <input placeholder="Nome" id="name" v-model="dataNew.name" name="name" type="text">
    <input placeholder="credits" id="credits" v-model="dataNew.credits" name="credits" type="text">
    <input placeholder="description" id="description" v-model="dataNew.description" name="description" type="text">
    <p class="lower">Slug: {{ slug }}</p>
    <!-- <p class="none lower">{{ id }}</p> -->

      <div class="col s12">
        <div class="file-field input-field">
          <div class="btn">
            <span>Escolher Banner</span>
            <input accept="image/*"
            @change="handleFile"
            type="file">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text">
          </div>
        </div>
      </div>
      <input class="btn blue darken-2" type="submit" value="Adicionar">
  </form>
</template>

<script>
import addNewProject from '@/services/addNewProject.js'
import uploadImage from '@/services/uploadImage.js'
export default {
  name: 'new-form',
  data() {
    return {
      dataNew: {
        name: null,
        credits: null,
        description: null,
        date: null,
        slug: null,
        banner: null,
        receipt: []
      },
      receipt: [],
      banner: {
        name: null,
        file: null
      },
      slug: null,
      fileNames: [],
      id: null,
    };
  },
  watch: {
    'dataNew.name' (val) {
      const slug = val.replace(/[' ']/g, '-');
      this.slug = slug;
      let lowerS = slug.toLowerCase();
      this.dataNew.slug = lowerS;
    }
  },
  methods: {
    async addNewData() {
      const now = new Date;
      const date = now.getDate() +'/'+ now.getMonth() + '/' + now.getFullYear()
      this.dataNew.date = date;
      const url = [];
      if (this.banner) {
        uploadImage(this.banner, this.dataNew)
      }
      // addNewProject(this.dataNew)
      // if (this.receipt) {
      //   for (let i = 0; i < this.lenght; i++) {
      //       const snapshot = await this.$firebase.storage()
      //       .ref(this.dataN.Nome)
      //       .child(this.fileName[i])
      //       .put(this.dataN.receipt[i]);
      //       url.push(await snapshot.ref.getDownloadURL());
      //   }
      //   this.dataN.Imagens = url
      //   const payload = {
      //       Nome: this.dataN.Nome,
      //       Tipo: this.dataN.Tipo,
      //       Imagens: this.dataN.Imagens,
      //       Data: this.dataN.Data,
      //       Slug: this.dataN.Slug,
      //   };
      //   this.$firebase.firestore().collection('jobs').doc(this.id).set(payload).then(() => {
      //     alert('Novo projeto criado com sucesso!');
      //     this.dataN = [];
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line no-alert
      //     alert(error);
      //   });
      // }
    },
    handleFile({ target }) {
      const split = target.files[0].name.split('.');
      this.banner.name = `${split[0]}-${new Date().getTime()}.${split.at(-1)}`
      this.banner.file = target.files[0]
    },
  },
};
</script>

<style lang="scss">
  .none {
    display: none;
    text-transform: lowercase;
  }
  .lower{
    text-transform: lowercase;
  }
</style>
