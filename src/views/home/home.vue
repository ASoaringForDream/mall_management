<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="160px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.el-container {
  width: 100vw;
  height: 100vh;
  .el-header {
    background-color: #B0C4DE;
  }
  .el-container {
    .el-aside {
      background-color: #B0C4DE;
      // background-image: linear-gradient(to bottom right, #5EFCE8 , #736EFE);
    }
    .el-main {
      padding: 10px;
      background-color: #E6E6FA;
    }
  }
}
</style>