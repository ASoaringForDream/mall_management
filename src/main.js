import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import {ElMessage} from 'element-plus';
// 引入element-plus样式
import 'element-plus/theme-chalk/index.css';
import 'assets/fonts/iconfont.css'
// import 'element-plus/es/components/message/style/index';
const app = createApp(App)
// 引入element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store).use(router).mount('#app')