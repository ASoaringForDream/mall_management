<template>
  <div>
    <!-- 数据报表包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 卡片区域 -->
  <el-card class="box-card">
    <div ref="report" class="report">

    </div>
  </el-card>
</template>

<script>
import { getReport } from 'network/reports.js'
// 导入echarts
import * as echarts from 'echarts'
export default {
  name: "report",
  data() {
    return {
      // 报表配置项
      options: {},
      // echarts实例
    }
  },
  created() {
    this.getReport()
  },
  mounted() {
    // console.log(this.$refs.report)
    this.myecharts = echarts.init(this.$refs.report)
    // console.log(this.options)
  },
  methods: {
    async getReport() {
      let { data, meta } = await getReport()
      console.log(data)
      if (meta.status == 200) {
        this.options = data
        this.options.title = { text: '用户来源' }
        this.options.tooltip = {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        }
        this.options.toolbox = {
          show: true,
          feature: {
            saveAsImage: {}
          }
        }
        this.myecharts.setOption(this.options)
      } else {
        ElMessage({
          showClose: true,
          message: "拉取报表数据失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/home");
        window.sessionStorage.setItem('activePath', '/home')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 12px;
}

.box-card {
  margin-top: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);

  .report {
    width: 100%;
    height: 500px;
  }
}
</style>