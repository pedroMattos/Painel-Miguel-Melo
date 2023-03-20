<template>
  <section>
    <div v-for="(item, key) in projectsData"
    :key="key"
    class="projeto modal-trigger-custom">
      <p class="remove red-text" @click.prevent="removeItem(projectData[key].name)">X</p>
      <div class="row">
        <div class="img-area col s12 m6">
          <img :src="getImageUrl(item.banner)">
        </div>
        <div class="infos col s12 m6">
          <p>Nome: {{ item.title }}</p>
          {{ '../assets/images/'+item.banner+'.png' }}
          <p>Imagens: {{ item.media.length }}</p>
          <p>Slug: {{ item.slug }}</p>
          <p>Postado em: {{ item.date }} - Última edição: {{ item?.last_edit }}</p>
          <button class="trigger btn" :target="item.slug">Editar</button>
        </div>
      </div>
      <modal-edit :projeto="item" :id="item.slug"></modal-edit>
    </div>
  </section>
</template>

<script>
import modalEdit from './modal.vue'
import getProject from "@/services/getProjects";

export default {
  name: 'projects',
  components: {
    'modal-edit': modalEdit,
  },
  data() {
    return {
      projectsData: null,
      projectData: [],
    };
  },
  mounted() {
    // this.getData();
  },
  beforeMount() {
    this.displayProjects();
  },
  methods: {
    async displayProjects() {
      this.projectsData = await getProject();
      this.loaded = true;
    },
    getImageUrl(url) {
      return 'https://cdn.pixabay.com/photo/2023/01/01/21/33/mountain-7690893_960_720.jpg';
    },
    getData() {
      const ref = this.$firebase.firestore().collection('jobs');
      const ctx = this;
      ref.get().then((docs) => {
        docs.forEach((doc) => {
          const dataProject = {
            name: doc.data().Nome,
            slug: doc.data().Slug,
            type: doc.data().Tipo,
            images: doc.data().Imagens,
            date: doc.data().Data,
            last_edit: doc.data().Last,
            alt: doc.data().Nome,
          };
          ctx.projectData.push(dataProject);
        });
        setTimeout(() => {
          this.initModal();
        }, 500);
      });
    },
    initModal() {
      const trigger = document.getElementsByClassName('trigger');
      const modal = document.getElementsByClassName('custom');
      for (let i = 0; i < trigger.length; i++) {

        trigger[i].addEventListener('click', () => {
          const target = trigger[i].getAttribute('target');
          for (let j = 0; j < modal.length; j++) {
            if (modal[j].getAttribute('id') == target) {
              modal[j].setAttribute('style', 'display:block');
            }
          }
        })
      }
    },
    removeItem(id) {
      const lower = id.toLowerCase();
      const newId = lower.replace(/[' ']/g, '_');
      this.$firebase.firestore().collection('jobs').doc(newId).delete().then(() => {
        // eslint-disable-next-line no-alert
        alert('Entrada removida do histórico');
      })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error removing document: ', error);
      });
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
</style>
