<template>
  <div>
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="搜索内容"
            class="input-with-select"
            clearable
            size="large"
          >
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="large">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 12px;
}
.box-card {
  margin-top: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>