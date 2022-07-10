<template>
  <div>
    <!-- 订单列表面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="搜索内容" class="input-with-select" clearable size="large" @blur="searchInputBlur"
            @clear="getOrdersList()" v-model="queryInfo.query">
            <template #append>
              <el-button icon="Search" @click="search()" />
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="ordersList" style="width: 100%" border max-height="400">
        <el-table-column fixed type="index" label="#" width="50" />
        <el-table-column fixed prop="order_number" label="订单编号" />
        <el-table-column prop="order_price" label="订单价格(元)" width="110px" />
        <el-table-column prop="is_send" label="是否发货" width="110px" />
        <el-table-column prop="pay_status" label="是否付款" width="90px">
          <template #default="{ row }">
            <el-tag v-if="row.pay_status === '1'" class="ml-2" type="success">已付款</el-tag>
            <el-tag v-else-if="row.pay_status === '0'" class="ml-2" type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180px" />
        <el-table-column label="操作" fixed="right" width="120px">
          <template #default="{ row }">
            <el-tooltip class="box-item" effect="dark" content="修改订单地址" placement="top">
              <el-button type="primary" icon="Edit" size="small" @click="editOrderDialogShow(row)"></el-button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="查询物流进度" placement="top">
              <el-button type="success" icon="Tools" size="small" @click="showLogisticsDialog(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination ref="pagination" v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
          :page-sizes="[5, 8, 10, 15]" background="background" :default-page-size="5"
          layout="sizes, prev, pager, next, jumper, ->, total" :total="totalOrder" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 修改订单地址对话框 -->
    <el-dialog title="修改订单地址" width="60%" v-model="editDialogShow" @close="closeeditDialog">
      <el-form ref="editForm" label-width="100px" :model="editInfo" :rules="formRules">
        <el-form-item label="省市县/区" prop="address">
          <el-cascader ref="cascader" :options="allAddressList" clearable v-model="editInfo.address" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="editInfo.detail"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeeditDialog()">取消</el-button>
          <el-button type="primary">修改</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查询物流进度对话框 -->
    <el-dialog title="物流进度" width="60%" v-model="logisticsDialogShow">
      <el-steps direction="vertical" :active="9">
        <el-step title="已下单" description="商品已经下单" />
        <el-step title="待发货" description="您的订单将由HLA（北京海淀区清河中街店）门店安排发货。" />
        <el-step title="已发货" description="卖家发货" />
        <el-step title="已收件" description="顺丰速运 已收取快件" />
        <el-step title="已装车" description="快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]" />
        <el-step title="已到达 [北京顺义集散中心]" description="快件到达 [北京顺义集散中心]" />
        <el-step title="已装车" description="快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]" />
        <el-step title="已到达 [北京海淀育新小区营业点]" description="快件到达 [北京海淀育新小区营业点]" />
        <el-step title="正在配送" description="[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件" />
        <el-step title="已签收" description="已签收,感谢使用顺丰,期待再次为您服务" />
      </el-steps>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeLogisticsDialog()">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList, getLogistics } from 'network/orders.js'
import { dataFormat } from "common/utils.js";
import Address from 'common/citydata.js';
export default {
  name: 'orders',
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 订单总数
      totalOrder: 0,
      // 订单列表
      ordersList: [],
      // 编辑信息
      editInfo: {
        address: [],
        detail: ""
      },
      // 修改地址对话框显示状态
      editDialogShow: false,
      // 物流状态对话框显示状态
      logisticsDialogShow: false,
      // 省市区县
      allAddressList: Address,
      // 表单验证规则
      formRules: {
        address: [
          {
            required: true,
            message: "请输入省市县/区",
            trigger: "blur",
          }
        ],
        detail: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          }
        ],
      }
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取商品列表
    async getOrdersList() {
      let { data, meta } = await getOrdersList(this.queryInfo);
      console.log(data);
      if (meta.status === 200) {
        this.ordersList = data.goods;
        this.totalOrder = data.total
        for (let item of this.ordersList) {
          item.create_time = dataFormat(item.create_time)
        }
      } else {
        ElMessage({
          showClose: true,
          message: "拉取订单列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/home");
        window.sessionStorage.setItem('activePath', '/home')
      }
    },
    // 搜索框失去焦点处理
    searchInputBlur() {
      if (this.queryInfo.query.trim() == '') {
        this.getOrdersList()
      } else {
        this.search()
      }
    },
    // 搜索功能
    search() {
      console.log(this.queryInfo)
      this.getOrdersList()
    },
    // 编辑窗口显示
    editOrderDialogShow() {
      this.editDialogShow = true
    },
    // 处理分页大小变化
    handleSizeChange() {
      this.getOrdersList()
    },
    // 处理分页选中变化
    handleCurrentChange() {
      this.getOrdersList()
    },
    // 关闭修改地址对话框
    closeeditDialog() {
      this.editDialogShow = false
      this.editInfo.address = []
      this.editInfo.detail = ''
    },
    //显示物流状态对话框 
    async showLogisticsDialog() {
      this.logisticsDialogShow = true
    },
    closeLogisticsDialog() {
      this.logisticsDialogShow = false
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

  .el-table {
    margin-top: 10px;
  }
}
</style>