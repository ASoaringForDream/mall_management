import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import {ElMessage} from 'element-plus';
// import 'element-ui/lib/theme-chalk/index.css';
// import 'assets/fonts/iconfont.css'
const app = createApp(App)
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store).use(router).mount('#app')