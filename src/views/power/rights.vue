<template>
  <div>
    <!-- 权限列表面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表卡片区域 -->
    <el-card class="box-card" >
      <!-- 权限列表 -->
      <el-table :data="rightsList" stripe style="width: 100%" border height="420">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="authName" label="权限名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="level" label="权限等级">
          <template #default="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/power.js";
export default {
  name: "rights",
  data() {
    return {
      // 权限列表
      rightsList: [],
    };
  },
  created() {
    // 获取权限列表
    this.getRightsList("list");
  },
  methods: {
    // 获取权限列表
    async getRightsList(type) {
      let { data, meta } = await getRightsList(type);
      if (meta.status === 200) {
        // console.log(data)
        this.rightsList = data;
      } else {
        ElMessage({
          showClose: true,
          message: '拉取权限列表失败',
          type: "error",
          duration: 1000,
        });
        this.$router.push('/home')
      }
    }
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 12px;
}
.box-card {
  margin-top: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  .el-table {
    margin-top: 50px;
  }
  .pagination {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
