<template>
  <form @submit.prevent="addNewData">
    <input placeholder="Nome" id="name" v-model="dataN.Nome" name="name" type="text">
    <input placeholder="Tipo" id="type" v-model="dataN.Tipo" name="type" type="text">
    <input placeholder="Quantas imagens vai adicionar?" id="qtd" v-model="lenght" name="lenght" type="number">
    <p class="lower">Slug: {{ slug }}</p>
    <p class="none lower">{{ id }}</p>
    <blockquote>
      <p>Selecione as iamgens, a primeira será a capa</p>
    </blockquote>
      <div class="col s12">
        <div class="file-field input-field">
          <div class="btn">
            <span>Nova Imagem</span>
            <input accept="image/*"
            multiple
            @change="handleFile($event)"
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
export default {
  name: 'new-form',
  data() {
    return {
      dataN: {
        Nome: null,
        Tipo: null,
        Imagens: [],
        receipt: [],
        Data: null,
        Slug: null,
      },
      receipt: [],
      lenght: null,
      slug: null,
      id: null,
      fileName: [],
    };
  },
  watch: {
    'dataN.Nome' (val) {
      const now = new Date;
      const id = this.dataN.Nome;
      const slug = id.replace(/[' ']/g, '-');
      const newId = id.replace(/[' ']/g, '_');
      this.slug = slug;
      let lowerS = slug.toLowerCase();
      this.dataN.Slug = lowerS;
      let lowerI = newId.toLowerCase();
      this.id = lowerI;
    }
  },
  methods: {
    async addNewData() {
      const now = new Date;
      const date = now.getDate() +'/'+ now.getMonth() + '/' + now.getFullYear()
      this.dataN.Data = date;
      const url = [];
      if (this.receipt) {
        for (let i = 0; i < this.lenght; i++) {
            const snapshot = await this.$firebase.storage()
            .ref(this.dataN.Nome)
            .child(this.fileName[i])
            .put(this.dataN.receipt[i]);
            url.push(await snapshot.ref.getDownloadURL());
        }
        this.dataN.Imagens = url
        const payload = {
            Nome: this.dataN.Nome,
            Tipo: this.dataN.Tipo,
            Imagens: this.dataN.Imagens,
            Data: this.dataN.Data,
            Slug: this.dataN.Slug,
        };
        this.$firebase.firestore().collection('jobs').doc(this.id).set(payload).then(() => {
          alert('Novo projeto criado com sucesso!');
          this.dataN = [];
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
      }
    },
    handleFile({ target }) {
      for (let i = 0; i < this.lenght; i++){
        this.dataN.receipt.push(target.files[i])
        this.receipt.push(target.files[i])
      }
      const {receipt} = this.dataN;
      if (receipt) {
        for (let i = 0; i < this.lenght; i++) {
          const split = receipt[i].name.split('.');
          this.fileName.push(`${split[0]}-${new Date().getTime()}.${split[1]}`)
        }
      } else {
        return ''
      }
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
