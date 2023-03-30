<template>
  <section>
    <div v-for="(item, key) in projectsData"
    :key="key"
    class="projeto modal-trigger-custom">
      <div v-if="item.slug !== loadItem" class="item">
        <p class="remove red-text" @click.prevent="() => removeItem(item.slug)">X</p>
        <div class="row">
          <div class="img-area col s12 m6">
            <img :src="item.banner">
          </div>
          <div class="infos col s12 m6">
            <p>Nome: {{ item.title }}</p>
            <p>Imagens: {{ item.receipt.length }}</p>
            <p>Slug: {{ item.slug }}</p>
            <p>Postado em: {{ item.date }} - Última edição: {{ item?.lastUpdate }}</p>
            <button class="trigger btn" @click="() =>initModal(item.slug)">Editar</button>
          </div>
        </div>
      </div>
      <div v-else class="loader">
        <div class="preloader-wrapper active">
          <div class="spinner-layer spinner-red-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>
      <modal-edit @reload="() => updatedData()" @cancel="() => opennedModal = null"
        v-if="opennedModal === item.slug" :projeto="item"
        :id="item.slug" :toLocaleString="''" :toString="''" />
    </div>
  </section>
</template>

<script>
import modalEdit from './modal.vue'
import getProject from "@/services/getProjects";
import deleteProject from "@/services/deleteProject";

export default {
  name: 'projects',
  components: {
    'modal-edit': modalEdit,
  },
  data() {
    return {
      projectsData: null,
      projectData: [],
      opennedModal: null,
      loadItem: null
    };
  },
  beforeMount() {
    this.displayProjects();
  },
  methods: {
    updatedData() {
      this.loadItem = this.opennedModal
      this.loaded = false;
      this.opennedModal = null
      this.displayProjects();
    },
    async displayProjects() {
      this.projectsData = await getProject();
      this.loaded = true;
      this.loadItem = null
    },
    initModal(slug) {
      this.opennedModal = slug
    },
    async removeItem(id) {
      this.loadItem = id
      const response = await deleteProject(id)
      if (response.status === 'finished') {
        this.loaded = false;
        this.displayProjects();
        this.loadItem = null
      }
    },
  },
};
</script>

<style lang="scss">
  .projeto{
    img {
      width: 250px;
    }
  }
  .loader {
    display: flex;
    justify-content: center;
    height: 160px;
    align-items: center;
  }
</style>
