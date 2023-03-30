<template>
  <!-- Modal Structure -->
  <div :id="identificador" class="custom row">
    <div class="content">
      <h4>{{ dados.title }}</h4>
      <div class="col s12 m4" v-for="(receipt, index) in dados.receipt" :key="index">
        <div class="image-area">
          <p class="remove red-text" @click.prevent="() => removeItem(index)">X</p>
          <img v-if="receipt.type === 'image'" :src="receipt.image" alt="">
          <iframe v-else :src="receipt.image" frameborder="0" allow="autoplay" scrolling="no"></iframe>

          <input v-model="receipt.title" placeholder="Titulo da imagem" type="text">
        </div>
      </div>
      <form @submit.prevent="attData">
        <!-- <div class="row">
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
          </div>
        </div> -->
        <div class="row">
          <div class="input-field col s6">
            <input v-model="dados.title" type="text">
            <label for="email">Nome</label>
          </div>
          <div class="input-field col s12">
            <textarea id="credits" v-model="dados.credits" class="materialize-textarea"></textarea>
            <label for="credits">Créditos</label>
          </div>
          <div class="input-field col s12">
            <textarea id="description" v-model="dados.description" class="materialize-textarea"></textarea>
            <label for="description">Descrição</label>
          </div>
        </div>
        <div class="actions">
          <input class="btn blue darken-2" :disabled="isInvalidProject()" @click="() => $emit('reload', true)" type="submit" value="Atualizar">
          <button @click.prevent="() => $emit('cancel', true)" class="btn red accent-4">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import updateProject from '../services/updateProject';

export default {
  name: 'modal-edit',
  props: ['projeto', 'id'],
  data() {
    return {
      dados: this.projeto,
      identificador: this.id,
      images: null,
      receipt: {
        name: null,
      },
    };
  },
  methods: {
    isInvalidProject() {
      return !this.dados.title || !this.dados.receipt.length
    },
    removeItem(receiptIndex) {
      this.dados.receipt = this.dados.receipt.filter(((image, index) => index !== receiptIndex))
    },
    async attData() {
      const now = new Date()
      this.dados.lastUpdate = now.getDate() +'/'+ now.getMonth() + '/' + now.getFullYear()
      const response = await updateProject(this.dados)
    }
  },
};
</script>

<style lang="scss" scoped>
.image-area {
  border: 1px solid green;
  border-radius: 4px;
  padding: 4px;
}
</style>
