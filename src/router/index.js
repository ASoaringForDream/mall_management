import { createRouter, createWebHistory } from 'vue-router'
const login = () => import('views/login/login.vue')
const home = () => import('views/home/home.vue')
const welcome = () => import('views/welcome/welcome.vue')
const userList = () => import('views/users/userList.vue')
const routes = [
  {
    path:'/',
    redirect: '/login'
  },
  {
    path:'/login',
    component:login
  },
  {
    path:'/home',
    component:home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:welcome
      },
      {
        path:'/users',
        component: userList
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next) => {
  if(to.path === '/login')
    return next()
  const token = window.sessionStorage.getItem('token')
  if(!token){
    return next('/login')
  }
  next()
})

export default router
