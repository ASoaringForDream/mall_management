import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import {ElMessage} from 'element-plus';
// 引入element-plus样式
import 'element-plus/theme-chalk/index.css';
import 'assets/fonts/iconfont.css'
// 树形表格
import { TreeTable } from 'vue-table-with-tree-grid'
const app = createApp(App)
// 引入element-plus图标

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('treeTable', TreeTable)
app.use(store).use(router).mount('#app')