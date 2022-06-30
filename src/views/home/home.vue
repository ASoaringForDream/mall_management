<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="~@/assets/img/logo/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
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
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getAsideMenu } from "network/authority";
export default {
  name: "home",
  data() {
    return {
      menuList: [],
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
    this.defaultPath = window.sessionStorage.getItem('activePath')
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
      console.log(res.data);
      this.menuList = res.data;
    });
  },
  methods: {
    logout() {
      this.$router.push("/login");
      ElMessage({
        showClose: true,
        message: "退出成功",
        type: "success",
        duration: 600,
      });
      window.sessionStorage.removeItem('activePath',path)
      this.defaultPath = ''
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if(this.isCollapse){
        this.$refs.toggle.textContent = '《》'
      }else {
        this.$refs.toggle.textContent = '》》《《'
      }
    },
    saveNavStatus(path) {
      window.sessionStorage.setItem('activePath',path)
      this.defaultPath = path
    }
  },
};
</script>

<style lang="less" scoped>
.el-container {
  width: 100vw;
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
