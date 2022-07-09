<template>
  <div>
    <!-- 添加商品面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 警告提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false" />
      <!-- 步骤条 -->
      <el-steps class="steps" :active="activeStep - 0" align-center>
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>
      <el-scrollbar>
        <!-- 添加商品表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="top" label-width="100px">
          <!-- 左侧标签页 -->
          <el-tabs tab-position="left" v-model="activeStep" class="demo-tabs">
            <el-tab-pane label="基本信息" disabled name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <span>
                  <el-cascader ref="cascader" :options="allCateList" :props="props" clearable
                    v-model="addForm.goods_cat" @change="handleChange" />
                </span>
              </el-form-item>
              <div class="btnBox">
                <el-button class="toNextStep" type="primary" @click="toStep2">下一步</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="商品参数" disabled name="1">
              <el-form-item v-for="item in goodsParams" :key="item.attr_id" :label="item.attr_name">
                <el-checkbox-group v-model="params">
                  <el-checkbox v-for="i in item.attr_vals" :key="i" :label="i" border
                    @change="(value) => changeParams(value, { attr_id: item.attr_id, attr_value: i })" />
                </el-checkbox-group>
              </el-form-item>
              <div class="btnBox">
                <el-button class="toNextStep" @click="backStep1">上一步</el-button>
                <el-button class="toNextStep" type="primary" @click="toStep3">下一步</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="商品属性" disabled name="2">
              <el-form-item v-for="item in goodsAttrs" :key="item.attr_id" :label="item.attr_name">
                <el-input disabled v-model="item.attr_vals"></el-input>
              </el-form-item>
              <div class="btnBox">
                <el-button class="toNextStep" @click="backStep2">上一步</el-button>
                <el-button class="toNextStep" type="primary" @click="toStep4">下一步</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="商品图片" disabled name="3">
              <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                list-type="picture-card" :headers="headers" :on-success="handleSuccess">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
              <div class="btnBox">
                <el-button class="toNextStep" @click="backStep3">上一步</el-button>
                <el-button class="toNextStep" type="primary" @click="toStep5">下一步</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="商品内容" disabled name="4">
              <quill-editor theme="snow" style="height: 260px; margin: 10px 0"  v-model:content = "content"></quill-editor>
              <div class="btnBox">
                <el-button class="toNextStep" type="primary" @click="addGoods">完成</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-scrollbar>
    </el-card>
    <el-dialog title="图片预览" width="50%" v-model="PreviewDialog">
      <img :src="picUrl" style="width: 100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCateList, getGoodsAttrs, addGood } from "network/goods.js";
// 富文本编辑器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
  name: "addGood",
  components:{
    QuillEditor
  },
  data() {
    return {
      // 步骤条激活状态
      activeStep: "0",
      // 表单信息
      addForm: {
        goods_name: "123",
        goods_price: 123,
        goods_number: 123,
        goods_weight: 123,
        goods_cat: [],
        attrs: [],
        pics: [],
        goods_introduce: ""
      },
      // 商品参数列表
      goodsParams: [],
      // 商品属性列表
      goodsAttrs: [],
      // 商品分类
      allCateList: [],
      // 级联选择器参数
      props: {
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover",
      },
      //选中参数列表
      params: [],
      // 选中属性列表
      attrs: [],
      // 上传图片URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 预览窗口显示状态
      PreviewDialog: false,
      // 预览图片地址
      picUrl: "",
      // 上传图片请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 商品内容
      content:"",
      // 表单验证规则
      addFormRules: {
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
    };
  },
  created() {
    this.getAllGoodsCate();
  },
  methods: {
    // 获取所有的分类
    async getAllGoodsCate() {
      let { data, meta } = await getGoodsCateList({ type: 3 });
      // console.log(data,meta)
      if (meta.status == 200) {
        // this.addCateDialogShow = true;
        this.allCateList = data;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取分类列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/home");
      }
    },
    // 处理级联选择器选中事件
    async handleChange() {
      this.addForm.attrs = []
      this.params = []
      this.attrs = []
      this.addForm.pics = []
      if (!this.addForm.goods_cat || this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
      let { data, meta } = await getGoodsAttrs(this.addForm.goods_cat[2], { sel: 'only' })
      if (meta.status == 200) {
        this.goodsAttrs = data
        for (let item of this.goodsAttrs) {
          if (item.attr_vals.trim() !== '') {
            for (let item1 of item.attr_vals.split(',')) {
              this.addForm.attrs.push({ attr_id: item.attr_id, attr_value: item1 })
            }
          } else {
            this.addForm.attrs.push({ attr_id: item.attr_id, attr_value: '' })
          }
        }
        // console.log(this.addForm.attrs)
      }
    },
    // 跳转到step2
    async toStep2() {
      const arr = ['goods_name', 'goods_price', 'goods_number', 'goods_weight', 'goods_cat']
      let flag = true
      await Promise.all([this.$refs.addForm.validateField(arr[0], (valid) => {
        if (!valid) {
          flag = false
        }
      }), this.$refs.addForm.validateField(arr[1], (valid) => {
        if (!valid) {
          flag = false
        }
      }),
      this.$refs.addForm.validateField(arr[2], (valid) => {
        if (!valid) {
          flag = false
        }
      }),
      this.$refs.addForm.validateField(arr[3], (valid) => {
        if (!valid) {
          flag = false
        }
      }),
      this.$refs.addForm.validateField(arr[4], (valid) => {
        if (!valid) {
          flag = false
        }
      })])
      // console.log(flag)
      if (flag) {
        this.activeStep = '1'
        let { data, meta } = await getGoodsAttrs(this.addForm.goods_cat[2], { sel: 'many' })
        if (meta.status == 200) {
          this.goodsParams = data
          for (let item of this.goodsParams) {
            if (item.attr_vals.trim() !== '') {
              item.attr_vals = item.attr_vals.split(',')
            } else {
              item.attr_vals = []
            }
          }
          // console.log(this.goodsParams)
        }
      } else {
        ElMessage({
          showClose: true,
          message: "缺少必填字段",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 参数选择状态切换
    changeParams(value, info) {
      // console.log(value,info)
      if (value) {
        this.addForm.attrs.push(info)
      } else {
        for (let i = 0; i < this.addForm.attrs.length; i++) {
          if (this.addForm.attrs[i].attr_id === info.attr_id && this.addForm.attrs[i].attr_value === info.attr_value) {
            this.addForm.attrs.splice(i, 1)
            break
          }
        }
      }
      console.log(this.addForm.attrs)
    },
    // 返回第一步
    backStep1() {
      this.activeStep = '0'
    },
    //跳转到第三步
    async toStep3() {
      this.activeStep = '2'
    },
    // 返回第二步
    backStep2() {
      this.activeStep = '1'
    },
    // 跳转到第四步
    toStep4() {
      this.activeStep = '3'
    },
    // 返回第三步
    backStep3() {
      this.activeStep = '2'
    },
    // 跳转到第五步
    toStep5() {
      this.activeStep = '4'
    },
    //预览图片 
    handlePreview(file) {
      // console.log(file)
      this.picUrl = file.response.data.url
      this.PreviewDialog = true
    },
    // 移除图片
    handleRemove(file) {
      // console.log(file)
      for (let index in this.addForm.pics) {
        if (this.addForm.pics[index].pic == file.response.data.tmp_path) {
          this.addForm.pics.splice(index, 1)
        }
      }
      // console.log(this.addForm.pics)
    },
    //将上传的图片添加到请求参数当中
    handleSuccess(response) {
      let { data } = response
      // this.addForm.pics.push({ pic: data.tmp_path })
      // console.log(this.addForm.pics)
    },
    // 添加商品
    async addGoods() {
      // console.log(this.content.ops[0].insert)
      this.addForm.goods_introduce = this.content ? this.content.ops[0].insert : ''
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      console.log(this.addForm)
      let {data,meta} = await addGood(this.addForm)
      // console.log(data,meta)
      if(meta.status == 201){
        ElMessage({
          showClose: true,
          message: "创建商品成功",
          type: "success",
          duration: 1000,
        });
      }else {
        ElMessage({
          showClose: true,
          message: "创建商品失败",
          type: "error",
          duration: 1000,
        });
      }
      this.$router.push("/goods");
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

  .steps {
    margin: 15px 0;
  }

  .el-scrollbar {
    height: 380px;
  }

  .btnBox {
    display: flex;
    justify-content: center;
  }

  .el-checkbox {
    margin-top: 10px;
  }

  .el-table {
    margin-top: 10px;
  }

  .pagination {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
