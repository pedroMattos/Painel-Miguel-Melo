<template>
  <section id="new-project">
    <h1>Adicionar novo</h1>
    <form-n/>
  </section>
</template>

<script>
import form from '../components/formAddNew.vue';

export default {
  name: 'new-project',
  components: {
    'form-n': form,
  },
};
</script>
