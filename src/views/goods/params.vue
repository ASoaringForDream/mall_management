<template>
  <div>
    <el-scrollbar class="scrollbar">
      <!-- 商品参数面包屑 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区域 -->
      <el-card class="box-card">
        <!-- 警告提升 -->
        <el-alert title="仅可以为第三级分类设置参数" show-icon type="warning" :closable="false" />
        <!-- 选择商品分类 -->
        <el-row class="chooseCate">
          <el-col>
            <span>选择商品分类：</span>
            <span>
              <el-cascader ref="cascader" :options="allCateList" :props="props" clearable v-model="selectedKeys"
                @change="chooseCateChange()" />
            </span>
          </el-col>
        </el-row>
        <!-- tabs标签页 -->
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
          <el-tab-pane label="动态参数" name="params">
            <!-- 添加参数 -->
            <el-row>
              <el-col>
                <el-button type="primary" :disabled="isBtnDisabled" @click="showAddParamsDialog">添加参数</el-button>
              </el-col>
            </el-row>
            <!-- 动态参数列表 -->
            <el-table :data="params" style="width: 100%" border stripe row-key="attr_id" max-height="400">
              <!-- 展开列 -->
              <el-table-column type="expand">
                <template #default="{ row }">
                  <el-tag size="large" v-for="tag, index in row.attr_vals" style="margin: 10px 30px" :key="tag"
                    class="mx-1" closable :disable-transitions="false" @close="deleteCurrentParams(row, index)">
                    {{ tag }}
                  </el-tag>
                  <el-input v-if="row.inputvisible" ref="inputParams" style="width: 150px; margin-left: 30px"
                    v-model="row.inputValue" class="ml-1 w-20" @keyup.enter="addParamsConfirm(row)"
                    @blur="addParamsConfirm(row)" />
                  <el-button style="margin-left: 30px" v-else class="button-new-tag ml-1" @click="showParamsInput(row)">
                    + 动态参数可选项
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="attr_id" label="ID" />
              <el-table-column prop="attr_name" label="参数名称" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button type="primary" icon="Edit" size="small" @click="showEditParamsDialog(row)">编辑</el-button>
                  <el-button type="danger" icon="Delete" size="small" @click="deleteParams(row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="attrs">
            <!-- 添加属性 -->
            <el-row>
              <el-col>
                <el-button type="primary" :disabled="isBtnDisabled" @click="showAddAttrsDialog">添加属性</el-button>
              </el-col>
            </el-row>
            <!-- 静态属性列表 -->
            <el-table :data="attrs" style="width: 100%" border stripe row-key="attr_id" max-height="400">
              <!-- 展开列 -->
              <el-table-column type="expand">
                <template #default="{ row }">
                  <el-tag size="large" v-for="tag, index in row.attr_vals" style="margin: 10px 30px" :key="tag"
                    class="mx-1" closable :disable-transitions="false" @close="deleteCurrentAttrs(row, index)">
                    {{ tag }}
                  </el-tag>
                  <el-input v-if="row.inputvisible" ref="inputAttrs" style="width: 150px; margin-left: 30px"
                    v-model="row.inputValue" class="ml-1 w-20" @keyup.enter="addAttrsConfirm(row)"
                    @blur="addAttrsConfirm(row)" />
                  <el-button style="margin-left: 30px" v-else class="button-new-tag ml-1" @click="showAttrsInput(row)">
                    + 静态属性值
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="attr_id" label="ID" />
              <el-table-column prop="attr_name" label="参数名称" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                    <el-button type="primary" icon="Edit" size="small" @click="showEditAttrsDialog(row)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
                    <el-button type="danger" icon="Delete" size="small" @click="deleteAttrs(row)">
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-scrollbar>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + addwords" width="45%" v-model="addDialogShow" @close="addDialogClose()">
      <el-form ref="addForm" label-width="80px" :model="addInfo" :rules="infoRules">
        <el-form-item :label="addwords + '名称'" prop="attr_name">
          <el-input v-model="addInfo.attr_name"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddDialog()">取消</el-button>
          <el-button type="primary" @click="addParams()">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title="'编辑' + editwords" width="45%" v-model="editDialogShow">
      <el-form ref="editForm" label-width="80px" :model="editInfo" :rules="infoRules">
        <el-form-item :label="editwords + '名称'" prop="attr_name">
          <el-input v-model="editInfo.attr_name"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeeditDialog()">取消</el-button>
          <el-button type="primary" @click="editParams()">编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCateList, getGoodsAttrs, addGoodsAttrs, editGoodsAttrs, deleteGoodsAttrs } from "network/goods.js";
import { nextTick } from "vue-demi";
export default {
  name: "params",
  data() {
    return {
      // 所有分类列表
      allCateList: [],
      // 级联选择器参数
      props: {
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover",
      },
      // 级联选择器选中的值
      selectedKeys: [],
      // 被激活的页签
      activeName: "params",
      // 动态参数列表
      params: [],
      // 静态属性列表
      attrs: [],
      // 添加参数/属性
      addInfo: {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },
      // 编辑参数/属性
      editInfo: {
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
        attr_id: ""
      },
      // 添加参数/属性对话框显示状态
      addDialogShow: false,
      // 编辑参数/属性对话框显示状态
      editDialogShow: false,
      // 添加的是参数还是属性
      addwords: "",
      // 编辑的是参数还是属性
      editwords: "",
      // 验证规则
      infoRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          }
        ],
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
        window.sessionStorage.setItem("activePath", "/home");
      }
    },
    // 选中一个商品分类
    async chooseCateChange() {
      let res = await Promise.all([
        getGoodsAttrs(this.selectedKeys[this.selectedKeys.length - 1], { sel: "only" }),
        getGoodsAttrs(this.selectedKeys[this.selectedKeys.length - 1], { sel: "many" }),
      ]);
      console.log(res);
      if (res[0].meta.status == 200 && res[1].meta.status == 200) {
        this.params = res[1].data;
        for (let item of this.params) {
          item.inputvisible = false
          item.inputValue = ""
          if (item.attr_vals.trim() !== '') {
            item.attr_vals = item.attr_vals.split(",");
          } else {
            item.attr_vals = []
          }
        }
        this.attrs = res[0].data;
        for (let item of this.attrs) {
          item.inputvisible = false
          item.inputValue = ""
          if (item.attr_vals.trim() !== '') {
            item.attr_vals = item.attr_vals.split(",");
          } else {
            item.attr_vals = []
          }
        }
      } else {
        ElMessage({
          showClose: true,
          message: "拉取分类参数失败",
          type: "error",
          duration: 1000,
        });
        this.selectedKeys = [];
      }
    },
    // 显示新增动态参数选项输入框
    showParamsInput(row) {
      row.inputvisible = true;
      nextTick(() => {
        this.$refs.inputParams.focus();
      });
    },
    // 提交新增动态参数选项
    async addParamsConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputvisible = false;
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputvisible = false;
      let { meta } = await editGoodsAttrs(this.selectedKeys[2], row.attr_id, { attr_name: row.attr_name, attr_sel: 'many', attr_vals: row.attr_vals.join(',') })
      if (meta.status == 200) {
        ElMessage({
          type: "success",
          message: `新增参数成功`,
          duration: 1000,
        });
      } else {
        ElMessage({
          type: "error",
          message: `新增参数失败`,
          duration: 1000,
        });
      }
    },
    // 删除指定的动态参数选项
    async deleteCurrentParams(row, index) {
      // console.log(index)
      row.attr_vals.splice(index, 1)
      let { meta } = await editGoodsAttrs(this.selectedKeys[2], row.attr_id, { attr_name: row.attr_name, attr_sel: 'many', attr_vals: row.attr_vals.join(',') })
      if (meta.status == 200) {
        ElMessage({
          type: "success",
          message: `删除参数成功`,
          duration: 1000,
        });
      } else {
        ElMessage({
          type: "error",
          message: `删除参数失败`,
          duration: 1000,
        });
      }
    },
    // 显示新增静态属性选项输入框
    showAttrsInput(row) {
      row.inputvisible = true;
      nextTick(() => {
        this.$refs.inputAttrs.focus();
      });
    },
    // 提交新增静态属性值
    async addAttrsConfirm(row) {
      console.log(row)
      if (row.inputValue.trim() === '') {
        row.inputvisible = false;
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputvisible = false;
      let { meta } = await editGoodsAttrs(this.selectedKeys[2], row.attr_id, { attr_name: row.attr_name, attr_sel: 'only', attr_vals: row.attr_vals.join(',') })
      if (meta.status == 200) {
        ElMessage({
          type: "success",
          message: `新增属性成功`,
          duration: 1000,
        });
      } else {
        ElMessage({
          type: "error",
          message: `新增属性失败`,
          duration: 1000,
        });
      }
    },
    // 删除指定的静态属性值
    async deleteCurrentAttrs(row, index) {
      row.attr_vals.splice(index, 1)
      let { meta } = await editGoodsAttrs(this.selectedKeys[2], row.attr_id, { attr_name: row.attr_name, attr_sel: 'only', attr_vals: row.attr_vals.join(',') })
      if (meta.status == 200) {
        ElMessage({
          type: "success",
          message: `删除属性成功`,
          duration: 1000,
        });
      } else {
        ElMessage({
          type: "error",
          message: `删除属性失败`,
          duration: 1000,
        });
      }
    },
    // 显示添加动态参数对话框
    showAddParamsDialog() {
      this.addDialogShow = true
      this.addwords = '参数'
    },
    // 显示添加静态属性对话框
    showAddAttrsDialog() {
      this.addDialogShow = true
      this.addwords = '属性'
    },
    // 关闭添加参数对话框
    closeAddDialog() {
      this.addDialogShow = false
    },
    // 重置添加参数表单
    addDialogClose() {
      this.$refs.addForm.resetFields();
    },
    // 添加参数
    addParams() {
      this.$refs.addForm.validate(async valid => {
        console.log(this.addInfo)
        if (valid) {
          if (this.addwords === '参数') {
            this.addInfo.attr_sel = 'many'
          } else if (this.addwords === '属性') {
            this.addInfo.attr_sel = 'only'
          }
          let { data, meta } = await addGoodsAttrs(this.selectedKeys[2], this.addInfo)
          if (meta.status == 201) {
            this.chooseCateChange()
            ElMessage({
              type: "success",
              message: `添加${this.addwords}成功`,
              duration: 1000,
            });
          } else {
            ElMessage({
              type: "error",
              message: `添加${this.addwords}失败`,
              duration: 1000,
            });
          }
          this.addDialogShow = false
        }
      })
    },
    // 显示编辑参数对话框
    showEditParamsDialog(row) {
      this.editDialogShow = true
      this.editInfo.attr_name = row.attr_name
      this.editInfo.attr_id = row.attr_id
      this.editwords = '参数'
      this.editInfo.attr_sel = 'many'
    },
    // 显示编辑属性对话框
    showEditAttrsDialog(row) {
      this.editDialogShow = true
      this.editInfo.attr_name = row.attr_name
      this.editInfo.attr_id = row.attr_id
      this.editwords = '属性'
      this.editInfo.attr_sel = 'only'
    },
    // 关闭编辑对话框
    closeeditDialog() {
      this.editDialogShow = false
    },
    // 编辑参数
    editParams() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          let { meta } = await editGoodsAttrs(this.selectedKeys[2], this.editInfo.attr_id, this.editInfo)
          if (meta.status == 200) {
            this.chooseCateChange()
            ElMessage({
              type: "success",
              message: `更新${this.editwords}成功`,
              duration: 1000,
            });
          } else {
            ElMessage({
              type: "error",
              message: `更新${this.editwords}失败`,
              duration: 1000,
            });
          }
          this.editDialogShow = false
        }
      })
    },
    // 删除动态参数
    deleteParams(row) {
      ElMessageBox.confirm(
        `确认删除动态参数的  ${row.attr_name}  ?`,
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteGoodsAttrs(this.selectedKeys[2], row.attr_id).then((res) => {
            console.log(res);
            if (res.meta.status === 200) {
              this.chooseCateChange()
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
    // 删除静态属性
    deleteAttrs(row) {
      ElMessageBox.confirm(
        `确认删除动态参数的  ${row.attr_name}  ?`,
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteGoodsAttrs(this.selectedKeys[2], row.attr_id).then((res) => {
            console.log(res);
            if (res.meta.status === 200) {
              this.chooseCateChange()
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
    }
  },
  computed: {
    // 添加参数的按钮是否被禁用
    isBtnDisabled() {
      return this.selectedKeys.length !== 3;
    },
  },
};
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

  .chooseCate {
    margin: 20px 0;
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
