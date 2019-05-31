import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/sort'
  },
  {
    name: 'sort',
    component: () => import('../view/sort'),
    meta: {
      title: '请选择'
    }
  },
  {
    name: 'home',
    component: () => import('../view/home'),
    meta: {
      title: '自助签约'
    }
  },
  {
    name: 'agree',
    component: () => import('../components/Agreement'),
    meta: {
      title: '协议'
    }
  },
  {
    name: 'industry',
    component: () => import('../components/Industry'),
    meta: {
      title: '协议'
    }
  },
  {
    name: 'info',
    component: () => import('../view/info'),
    meta: {
      title: '填写银豹账号'
    }
  },
  {
    name: 'signlist',
    component: () => import('../view/signlist'),
    meta: {
      title: ''
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};