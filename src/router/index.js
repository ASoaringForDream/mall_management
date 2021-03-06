import { createRouter, createWebHistory } from 'vue-router'
const login = () => import('views/login/login.vue')
const home = () => import('views/home/home.vue')
const welcome = () => import('views/welcome/welcome.vue')
const userList = () => import('views/users/userList.vue')
const rights = () => import('views/power/rights.vue')
const roles = () => import('views/power/roles.vue')
const categories = () => import('views/goods/categories.vue')
const params = () => import('views/goods/params.vue')
const goods = () => import('views/goods/goods.vue')
const addGood = () => import('views/goods/addGood.vue')
const orders = () => import('views/order/orders.vue')
const report = () => import('views/report/report.vue')
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: userList
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/categories',
        component: categories
      },
      {
        path: '/params',
        component: params
      },
      {
        path: '/goods',
        component: goods
      },
      {
        path: '/goods/add',
        component: addGood
      },
      {
        path: '/orders',
        component: orders
      }
      ,
      {
        path: '/reports',
        component: report
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login')
    return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
