<template>
  <div>
    <!-- 商品分类面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表 -->
      <el-table
        height="380"
        :data="cateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        v-loading="loading"
        :load="load"
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column fixed prop="cat_id" label="ID" width="180" />
        <el-table-column prop="cat_name" label="分类名称" />
        <el-table-column prop="cat_deleted" label="是否有效">
          <template #default="{ row }">
            <el-tag v-if="!row.cat_deleted" class="ml-2" type="success">
              <el-icon>
                <Check />
              </el-icon>
            </el-tag>
            <el-tag v-if="row.cat_deleted" class="ml-2" type="error">
              <el-icon>
                <Close />
              </el-icon>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="分类等级">
          <template #default="{ row }">
            <el-tag v-if="row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="row.cat_level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="showEditCateDialog(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="Delete"
              size="small"
              @click="deleteCurrentCate(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          ref="pagination"
          v-model:currentPage="queryInfo.pagenum"
          v-model:page-size="queryInfo.pagesize"
          :page-sizes="[5, 10, 15]"
          background="background"
          :default-page-size="2"
          :total="totalCate"
          layout="sizes, prev, pager, next, jumper, ->, total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      width="45%"
      v-model="addCateDialogShow"
      @close="addCateDialogClose()"
    >
      <el-form
        ref="addCateForm"
        label-width="80px"
        :model="cateInfo"
        :rules="cateInfoRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="添加分类的名称" v-model="cateInfo.cat_name"> </el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            ref="cascader"
            :options="allCateList"
            :props="props"
            clearable
            v-model="selectedKeys"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddCateDialog">取消</el-button>
          <el-button type="primary" @click="addCate">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="修改分类"
      width="45%"
      v-model="editCateDialogShow"
      @close="editCateDialogClose()"
    >
      <el-form
        ref="editCateForm"
        label-width="80px"
        :model="editInfo"
        :rules="cateInfoRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="添加分类的名称" v-model="editInfo.cat_name"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditCateDialog">取消</el-button>
          <el-button type="primary" @click="editCategories">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsCateList,
  getGoodsCateById,
  addGoodsCate,
  deleteGoodsCate,
  editGoodsCate,
} from "network/goods.js";
export default {
  name: "",
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 分类列表
      cateList: [],
      // 总数据
      totalCate: 0,
      // 表格加载动画
      loading: true,
      //控制添加分类对话框显示状态
      addCateDialogShow: false,
      // 编辑分类对话框显示状态
      editCateDialogShow: false,
      // 添加分类信息
      cateInfo: {
        // 父分类ID，如果没有则为0
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        // 分类层级，0为一级，1为二级，2为三级
        cat_level: 0,
      },
      // 分类级联选择框选项
      allCateList: [],
      // 级联选择器配置
      props: {
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover",
      },
      // 选中的父级分类
      selectedKeys: [],
      // 存储懒加载resolve函数
      lazyLoadResolve: {},
      editInfo: {
        cat_id: 0,
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      // 验证规则
      cateInfoRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "分类名称长度应在2-10个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getGoodsCateList(2);
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCateList(type) {
      this.loading = true;
      this.queryInfo.type = type;
      let { data, meta } = await getGoodsCateList(this.queryInfo);
      // console.log(data);
      if (meta.status == 200) {
        this.cateList = data.result;
        this.cateList.forEach((item) => {
          if (item.children && item.children.length !== 0) {
            item.hasChildren = true;
            item.children = null;
          }
        });
        // console.log(this.cateList);
        this.totalCate = data.total;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取分类列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/home");
        window.sessionStorage.setItem('activePath','/home')
      }
      this.loading = false;
    },
    // 处理分页大小变化
    handleSizeChange() {
      this.getGoodsCateList(2);
    },
    // 处理分页选中变化
    handleCurrentChange() {
      this.getGoodsCateList(2);
    },
    // 懒加载
    async load(tree, treeNode, resolve) {
      // console.log(tree.children);
      // console.log(treeNode);
      this.handleLoad(tree, resolve);
      this.lazyLoadResolve[tree.cat_id] = {};
      this.lazyLoadResolve[tree.cat_id].resolve = resolve;
    },
    // 懒加载函数
    async handleLoad(tree, resolve) {
      this.queryInfo.type = 3;
      // console.log(tree)
      let { data, meta } = await getGoodsCateList(this.queryInfo);
      // console.log(data);
      if (meta.status == 200) {
        if (tree.cat_level == 0) {
          data.result.forEach((item) => {
            if (item.cat_id == tree.cat_id) {
              item.children.forEach((item) => {
                if (item.children && item.children.length !== 0) {
                  item.hasChildren = true;
                  item.children = null;
                }
              });
              // console.log(item.children);
              resolve(item.children);
              return;
            }
          });
        } else if (tree.cat_level == 1) {
          for (let item1 of data.result) {
            for (let item2 of item1.children) {
              if (item2.cat_id == tree.cat_id) {
                // console.log(item2.children);
                if( !item2.children || item2.children.length == 0){
                  resolve([])
                }else
                 resolve(item2.children);
                return;
              }
            }
          }
        }
      } else {
        ElMessage({
          showClose: true,
          message: "拉取子分类列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/categories");
      }
    },
    // 显示编辑分类对话框
    async showEditCateDialog(row) {
      let { data, meta } = await getGoodsCateById(row.cat_id);
      // console.log(res)
      if (meta.status == 200) {
        this.editInfo.cat_id = data.cat_id;
        this.editInfo.cat_name = data.cat_name;
        this.editInfo.cat_level = data.cat_level;
        this.editInfo.cat_pid = data.cat_pid;
        this.editCateDialogShow = true;
      } else {
        ElMessage({
          showClose: true,
          message: "加载编辑页面失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    //重置编辑分类表单
    editCateDialogClose() {
      this.$refs.editCateForm.resetFields();
    },
    // 关闭编辑分类对话框
    closeEditCateDialog() {
      this.editCateDialogShow = false;
    },
    // 编辑分类
    editCategories() {
      this.$refs.editCateForm.validate(async (valid) => {
        if (valid) {
          let { meta } = await editGoodsCate(this.editInfo.cat_id, {
            cat_name: this.editInfo.cat_name,
          });
          console.log(meta)
          if (meta.status == 200) {
            ElMessage({
              showClose: true,
              message: `编辑分类成功`,
              type: "success",
              duration: 1000,
            });
            this.editCateDialogShow = false;
            if (this.lazyLoadResolve[this.editInfo.cat_pid] && this.editInfo.cat_level != 0) {
              this.handleLoad(
                {
                  cat_id: this.editInfo.cat_pid,
                  cat_level: this.editInfo.cat_level - 1,
                },
                this.lazyLoadResolve[this.editInfo.cat_pid].resolve
              );
            } else if (this.editInfo.cat_level == 0) {
              this.getGoodsCateList(2);
            }
          } else {
            ElMessage({
              showClose: true,
              message: `编辑分类失败`,
              type: "error",
              duration: 1000,
            });
            this.editCateDialogShow = false;
          }
        }
      });
    },
    // 关闭添加分类对话框
    closeAddCateDialog() {
      this.addCateDialogShow = false;
      this.selectedKeys = []
    },
    // 显示添加分类对话框
    async showAddCateDialog() {
      let { data, meta } = await getGoodsCateList({ type: 2 });
      // console.log(data,meta)
      if (meta.status == 200) {
        this.addCateDialogShow = true;
        this.allCateList = data;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取父级分类列表失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 重置添加分类表单
    addCateDialogClose() {
      this.$refs.addCateForm.resetFields();
    },
    // 添加分类
    addCate() {
      let pCate = this.$refs.cascader.getCheckedNodes();
      // console.log(pCate)
      // console.log(pCate.length)
      if (pCate.length == 0) {
        this.cateInfo.cat_pid = 0;
        this.cateInfo.cat_level = 0;
      } else {
        this.cateInfo.cat_pid = pCate[0].data.cat_id;
        this.cateInfo.cat_level = pCate[0].level;
      }
      // console.log(this.cateInfo);
      this.$refs.addCateForm.validate(async (valid) => {
        if (valid) {
          const { data, meta } = await addGoodsCate(this.cateInfo);
          // console.log(data, meta);
          if (meta.status == 201) {
            this.addCateDialogShow = false;
            this.selectedKeys = []
            this.getGoodsCateList(2);
            ElMessage({
              showClose: true,
              message: "创建分类成功",
              type: "success",
              duration: 1000,
            });
            if (
              this.lazyLoadResolve[this.cateInfo.cat_pid] &&
              this.cateInfo.cat_level != 0
            ) {
              this.handleLoad(
                { cat_id: this.cateInfo.cat_pid, cat_level: this.cateInfo.cat_level - 1 },
                this.lazyLoadResolve[this.cateInfo.cat_pid].resolve
              );
            }
          } else {
            ElMessage({
              showClose: true,
              message: "创建分类失败",
              type: "error",
              duration: 1000,
            });
            this.addCateDialogShow = false;
          }
        } else {
          return;
        }
      });
    },
    // 删除商品分类
    async deleteCurrentCate(row) {
      console.log(row);
      ElMessageBox.confirm(`确认删除分类  ${row.cat_name}?`, "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGoodsCate(row.cat_id).then((res) => {
            console.log(res);
            if (res.meta.status === 200) {
              ElMessage({
                type: "success",
                message: "删除完成",
                duration: 1000,
              });
              if (this.lazyLoadResolve[row.cat_pid] && row.cat_level != 0) {
                this.handleLoad(
                  {
                    cat_id: row.cat_pid,
                    cat_level: row.cat_level - 1,
                  },
                  this.lazyLoadResolve[row.cat_pid].resolve
                );
              } else if (row.cat_level == 0) {
                this.getGoodsCateList(2);
              }
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
