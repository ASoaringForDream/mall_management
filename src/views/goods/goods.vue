<template>
  <div>
    <el-scrollbar class="scrollbar">
      <!-- 商品列表面包屑 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区域 -->
      <el-card class="box-card">
        <!-- 搜索和添加 -->
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input placeholder="搜索内容" class="input-with-select" clearable size="large" @blur="searchInputBlur"
              @clear="getGoodsList()" v-model="queryInfo.query">
              <template #append>
                <el-button icon="Search" @click="search()" />
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="large" @click="goAddPage()">添加商品</el-button>
          </el-col>
        </el-row>
        <!-- 商品列表 -->
        <el-table :data="goodsList" style="width: 100%" border max-height="400">
          <el-table-column fixed type="index" label="#" width="50" />
          <el-table-column fixed prop="goods_name" label="名称" />
          <el-table-column prop="goods_price" label="商品价格(元)" width="110px" />
          <el-table-column prop="goods_weight" label="商品重量" width="90px" />
          <el-table-column prop="add_time" label="添加时间" width="180px" />
          <el-table-column label="操作" fixed="right" width="120px">
            <template #default="{ row }">
              <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                <el-button type="primary" icon="Edit" size="small" @click="editGoodDialogShow(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
                <el-button type="danger" icon="Delete" size="small" @click="deleteCurrentGood(row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination ref="pagination" v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
            :page-sizes="[5, 10, 15, 20]" background="background" :default-page-size="5"
            layout="sizes, prev, pager, next, jumper, ->, total" :total="totalGoods" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-card>
    </el-scrollbar>
    <!-- 编辑参数对话框 -->
    <el-dialog title="编辑商品" width="60%" v-model="editDialogShow" @close="closeeditDialog" @opened="editDialogOpen">
      <el-form ref="editForm" label-width="80px" :model="editInfo" :rules="formRules">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editInfo.goods_name"> </el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editInfo.goods_price" type="number"> </el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editInfo.goods_number" type="number"> </el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editInfo.goods_weight" type="number"> </el-input>
        </el-form-item>
        <el-form-item v-for="item in goodsParams" :key="item.attr_id" :label="item.attr_name">
          <el-checkbox-group v-model="params">
            <el-checkbox style="margin: 5px" v-for="i in item.attr_vals" :key="i" :label="i" border
              @change="(value) => changeParams(value, { attr_id: item.attr_id, attr_value: i })" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload :file-list="fileList" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
            list-type="picture-card" :headers="headers" :on-success="handleSuccess">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品介绍">
          <quill-editor ref="quillEditor" theme="snow" style="height: 260px; width: 100%; margin: 10px 0"
            v-model:content="content"></quill-editor>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeeditDialog()">取消</el-button>
          <el-button type="primary" @click="editGood()">编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, deleteGood, getGoodById, getGoodsAttrs, editGood } from "network/goods.js"
import { dataFormat } from "common/utils.js";
// 富文本编辑器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
  name: 'goods',
  components: {
    QuillEditor
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      goodsList: [],
      // 商品总数
      totalGoods: 0,
      // 编辑商品对话框显示状态
      editDialogShow: false,
      // 编辑商品信息
      editInfo: {
        id: "",
        goods_cat: "",
        goods_name: "",
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        attrs: [],
        pics: [],
        goods_introduce: ""
      },
      // 富文本编辑器绑定内容
      content: {
        ops: [{ insert: "" }]
      },
      // 商品参数列表
      goodsParams: [],
      // 上传图片URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 默认图片
      fileList: [],
      // 预览窗口显示状态
      PreviewDialog: false,
      // 预览图片地址
      picUrl: "",
      // 上传图片请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 多选框组默认值
      params: [],
      // 表单验证规则
      formRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ]
      },
    }
  },
  created() {
    this.getGoodsList(this.queryInfo)
  },
  methods: {
    async getGoodsList(params = "") {
      params = params == "" ? this.queryInfo : params;
      const { data, meta } = await getGoodsList(params);
      // console.log(data);
      if (meta.status == 200) {
        this.goodsList = data.goods
        this.totalGoods = data.total
        for (let item of this.goodsList) {
          item.add_time = dataFormat(item.add_time);
        }
      } else {
        ElMessage({
          showClose: true,
          message: "拉取商品列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push('/home')
      }
    },
    // 分页尺寸变化
    handleSizeChange() {
      this.getGoodsList(this.queryInfo)
    },
    // 分页选中变化
    handleCurrentChange() {
      this.getGoodsList(this.queryInfo)

    },
    //搜索
    search() {
      this.getGoodsList()
    },
    // 搜索输入框离开
    searchInputBlur() {
      if (this.queryInfo.query.trim() == '') {
        this.getGoodsList()
      } else {
        this.search()
      }
    },
    // 删除商品
    deleteCurrentGood(row) {
      // console.log(row)
      ElMessageBox.confirm(
        `确认删除商品${row.goods_name} ?`,
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteGood(row.goods_id).then((res) => {
            console.log(res);
            if (res.meta.status === 200) {
              this.getGoodsList(this.queryInfo)
              ElMessage({
                type: "success",
                message: "删除成功",
                duration: 1000,
              });
            } else {
              ElMessage({
                type: "error",
                message: "删除失败",
                duration: 1000,
              });
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除",
            duration: 1000,
          });
        });
    },
    // 跳转到添加页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 显示编辑商品对话框
    async editGoodDialogShow(row) {
      let { data, meta } = await getGoodById(row.goods_id)
      console.log(data)
      if (meta.status == 200) {
        this.editInfo.id = data.goods_id
        this.editInfo.goods_cat = data.goods_cat
        this.editInfo.goods_name = data.goods_name
        this.editInfo.goods_number = data.goods_number
        this.editInfo.goods_price = data.goods_price
        this.editInfo.goods_weight = data.goods_weight
        for (let item of data.attrs) {
          this.editInfo.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_value
          })
        }
        for (let item of data.pics) {
          this.editInfo.pics.push({
            pic: item.pics_big.replace('/uploads/goodspics/big_','tmp_uploads\\')
          })
        }
        this.content.ops[0].insert = data.goods_introduce
        // console.log(this.content)
        for (let item of data.pics) {
          this.fileList.push({ url: item.pics_big_url })
        }
        let { data: data1, meta: meta1 } = await getGoodsAttrs(data.cat_id, { sel: 'many' })
        if (meta1.status == 200) {
          this.goodsParams = data1
          for (let item of this.goodsParams) {
            item.attr_vals = item.attr_vals.trim() === '' ? [] : item.attr_vals.split(',')
            for (let i of this.editInfo.attrs) {
              if (item.attr_id === i.attr_id && item.attr_vals.includes(i.attr_value)) {
                this.params.push(i.attr_value)
              }
            }
          }

          this.editDialogShow = true
          // console.log(this.goodsParams)
        } else {
          ElMessage({
            type: "error",
            message: "获取参数信息失败",
            duration: 1000,
          });
        }
      } else {
        ElMessage({
          type: "error",
          message: "获取商品信息失败",
          duration: 1000,
        });
      }
    },
    // 对话框打开
    editDialogOpen() {
      this.$refs.quillEditor.setText(this.content.ops[0].insert)
    },
    // 关闭编辑商品对话框
    closeeditDialog() {
      this.editInfo.goods_name = ''
      this.editInfo.goods_number = ''
      this.editInfo.goods_price = ''
      this.editInfo.goods_weight = ''
      this.editInfo.goods_introduce = ''
      this.editInfo.attrs = []
      this.editInfo.pics = []
      this.params = []
      this.fileList = []
      this.editDialogShow = false
      this.content = {
        ops: [{ insert: "" }]
      }
    },
    // 编辑商品
    async editGood() {
      this.editInfo.goods_introduce = this.content.ops[0].insert
      console.log(this.editInfo)
      let { data, meta } = await editGood(this.editInfo.id, this.editInfo)
      console.log(data,meta)
      if (meta.status == 200) {
        this.getGoodsList(this.queryInfo)
        ElMessage({
          type: "success",
          message: "修改成功",
          duration: 1000,
        });
      } else {
        ElMessage({
          type: "error",
          message: "修改失败",
          duration: 1000,
        });
      }
      this.editDialogShow = false
    },
    // 选中参数改变
    changeParams(value, info) {
      if (value) {
        this.editInfo.attrs.push(info)
      } else {
        for (let i = 0; i < this.editInfo.attrs.length; i++) {
          if (this.editInfo.attrs[i].attr_id === info.attr_id && this.editInfo.attrs[i].attr_value === info.attr_value) {
            this.editInfo.attrs.splice(i, 1)
            break
          }
        }
      }
      console.log(this.editInfo)
    },
    // 图片上传成功
    handleSuccess(response) {
      console.log(response)
      let { data } = response
      this.editInfo.pics.push({ pic: data.tmp_path })
    },
    // 图片预览
    handlePreview() {

    },
    // 图片移除
    handleRemove(file) {
      for (let index in this.editInfo.pics) {
        if (this.editInfo.pics[index].pic == file.response.data.tmp_path) {
          this.editInfo.pics.splice(index, 1)
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.scrollbar {
  height: calc(100vh - 100px);
}

.el-breadcrumb {
  font-size: 12px;
}

.box-card {
  margin-top: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);

  .el-table {
    margin-top: 10px;
  }

  .pagination {
    width: 100%;
    margin-top: 20px;
  }
}
</style>