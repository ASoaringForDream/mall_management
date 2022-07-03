<template>
  <el-container>
    <!-- 主页头部 -->
    <el-header>
      <div class="logo">
        <img src="~@/assets/img/logo/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主页主体 -->
    <el-container>
      <!-- 主页侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '160px'">
        <div ref="toggle" class="toggle_btn" @click="toggleCollapse">》》《《</div>
        <el-menu
          background-color = "#b0c4de"
          :default-active = "defaultPath"
          class = "el-menu-vertical-demo"
          active-text-color = "	#00BFFF"
          unique-opened
          :collapse = "isCollapse"
          :collapse-transition = "false"
          :router = "true"
        >
          <el-sub-menu :index="String(item.id)" v-for="item of menuList" :key="item">
            <template #title>
              <el-icon>
                <i class="iconfont" :class="icons[item.id]"></i>
              </el-icon>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/'+String(i.path)" v-for="i of item.children" :key="i" @click="saveNavStatus('/'+String(i.path))">
              <el-icon><Menu /></el-icon>
              {{ i.authName }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 主页内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getAsideMenu } from "network/menu.js";
export default {
  name: "home",
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 左侧菜单栏对应图标
      icons: {
        125: "icon-users",
        103: "icon-tijikongjian",
        101: "icon-shangpin",
        102: "icon-danju",
        145: "icon-baobiao",
      },
      isCollapse: false,
      defaultPath:''
    };
  },
  created() {
    // 获取初始的菜单显示
    this.defaultPath = window.sessionStorage.getItem('activePath')
    // 获取左侧菜单列表
    getAsideMenu().then((res) => {
      if (res.meta.status !== 200) {
        ElMessage({
          showClose: true,
          message: "服务器请求错误",
          type: "error",
          duration: 600,
        });
        this.$router.push("/login");
        return;
      }
      this.menuList = res.data;
    });
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.removeItem('activePath')
      window.sessionStorage.removeItem('token')
      this.defaultPath = ''
      this.$router.push("/login");
      ElMessage({
        showClose: true,
        message: "退出成功",
        type: "success",
        duration: 600,
      });
      
    },
    // 左侧菜单栏显示风格切换
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if(this.isCollapse){
        this.$refs.toggle.textContent = '《》'
      }else {
        this.$refs.toggle.textContent = '》》《《'
      }
    },
    // 保存当前菜单
    saveNavStatus(path) {
      window.sessionStorage.setItem('activePath',path)
      this.defaultPath = path
    }
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #b0c4de;
    color: #fff;
    font-size: 22px;
    .logo {
      display: flex;
      align-items: center;
      vertical-align: middle;
      height: 60px;
      img {
        width: 60px;
        height: 60px;
      }
    }
  }
  .el-container {

    .el-aside {
      background-color: #b0c4de;
      overflow: hidden;
      // background-image: linear-gradient(to bottom right, #5EFCE8 , #736EFE);
      .toggle_btn {
        width: 100%;
        height: 24px;
        font-size: 10px;
        color: #fff;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.2em;
        background-color: #90c4de;
        cursor: pointer;
        user-select: none;
      }
    }
    .el-main {
      padding: 20px;
      background-color: #e6e6fa;
    }
  }
}
</style>
