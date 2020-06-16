import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/LoginView.vue';
import Pannel from '../views/Painel.vue';
import NewProject from '../views/NewProject.vue';


import '@/assets/scss/main.scss';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/painel',
    name: 'Pannel',
    component: Pannel,
  },
  {
    path: '/new-project',
    name: 'NewProject',
    component: NewProject,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
