<template>
  <div>
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<script>
// 引入中文包
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default {
  components: {
    ElConfigProvider,
  },
  data() {
    return {
      locale: zhCn,
    };
  },
};
</script>
<style>
@import "assets/css/normalize.css";
</style>
