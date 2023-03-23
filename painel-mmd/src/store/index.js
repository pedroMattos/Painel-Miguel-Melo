import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nextProject: null,
    images: []
  },
  getters: {
    getNextProject: (state) => state.nextProject,
    images: (state) => state.images,
  },
  mutations: {
    nextProject: (state, payload) => {
      state.nextProject = payload;
    },
    images: (state, payload) => {
      state.images.push(payload)
    }
  },
  actions: {},
  modules: {},
});
