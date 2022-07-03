<template>
  <div>
    <!-- 角色列表面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog()">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-scrollbar height="440px">
        <el-table :data="rolesList" style="width: 100%" border stripe row-key="id">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template #default="{ row }">
              <!-- 权限列表 -->
              <el-row
                style="align-items: center"
                :class="['borderBottom', index1 === 0 ? 'borderTop' : '']"
                v-for="(item1, index1) in row.children"
                :key="item1.id"
              >
                <!-- 一级权限列表 -->
                <el-col :span="4">
                  <el-tag class="mx-1" closable @close="deleteCurrentRight(row, item1)">
                    {{ item1.authName }}
                  </el-tag>
                  <el-icon>
                    <CaretRight />
                  </el-icon>
                </el-col>
                <el-col :span="20">
                  <el-row
                    style="align-items: center"
                    :class="[index2 !== 0 ? 'borderTop' : '']"
                    v-for="(item2, index2) in item1.children"
                    :key="item2.id"
                  >
                    <!-- 二级权限列表 -->
                    <el-col :span="6">
                      <el-tag
                        class="mx-1"
                        type="success"
                        closable
                        @close="deleteCurrentRight(row, item2)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                      <el-icon>
                        <CaretRight />
                      </el-icon>
                    </el-col>
                    <!-- 三级权限列表 -->
                    <el-col :span="18">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        class="mx-1"
                        closable
                        type="warning"
                        @close="deleteCurrentRight(row, item3)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="50" />
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="roleDesc" label="角色描述" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="Edit"
                  size="small"
                  @click="showEditRoleDialog(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click="showDeleteRoleDialog(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="分配权限"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="Setting"
                  size="small"
                  @click="ShowAllocationRoleDialog('tree',row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      width="35%"
      v-model="addRoleDialogShow"
      @close="addRoleDialogClose()"
    >
      <el-form
        ref="addRoleForm"
        label-width="80px"
        :model="roleInfo"
        :rules="roleInfoRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="添加角色的名称" v-model="roleInfo.roleName"> </el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="对添加角色的描述" v-model="roleInfo.roleDesc">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddRoleDialog">取消</el-button>
          <el-button type="primary" @click="addRole">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" width="35%" v-model="editRoleDialogShow">
      <el-form
        ref="editRoleForm"
        label-width="80px"
        :model="editInfo"
        :rules="roleInfoRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editInfo.roleName"> </el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editInfo.roleDesc"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditRoleDialog()">取消</el-button>
          <el-button type="primary" @click="editRole()">修改</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除角色对话框 -->
    <el-dialog
      ref="deleteUserForm"
      title="删除角色"
      width="35%"
      v-model="deleteRolesDialogShow"
    >
      <span>删除用户 {{ deleteRoleInfo.roleName }}?</span>
      <template #footer>
        <span>
          <el-button @click="closeDeleteRoleDialog()">取消</el-button>
          <el-button type="danger" @click="deleteRole()">删除</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" width="50%" v-model="allocationRoleDialogShow">
      <el-tree
        ref="checkRights"
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedArray"
        :props="defaultProps"
        default-expand-all
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAllocationRoleDialog()">取消</el-button>
          <el-button type="primary" @click="allocationRole()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRightsList,
  getRolesList,
  addRole,
  getRole,
  editRole,
  deleteRole,
  deleteCurrentRight,
  allocationRight
} from "network/power.js";
export default {
  name: "roles",
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色对话框显示状态
      addRoleDialogShow: false,
      // 编辑角色对话框显示状态
      editRoleDialogShow: false,
      // 删除角色对话框显示状态
      deleteRolesDialogShow: false,
      // 分配角色权限对话框显示状态
      allocationRoleDialogShow: false,
      // 添加角色信息
      roleInfo: {
        roleName: "",
        roleDesc: "",
      },
      // 编辑角色信息
      editInfo: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      // 删除角色信息
      deleteRoleInfo: {
        id: "",
        roleName: "",
      },
      // 权限列表
      rightsList: [],
      // 树形控件参数
      defaultProps: {
        children: "children",
        label: "authName",
      },
      // 修改前角色权限列表
      checkedArray:[],
      checkedRole:{
        id: -1,
        roleName: ''
      },
      // 验证规则
      roleInfoRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "角色名长度应在3-10个字符之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur",
          },
          {
            min: 2,
            max: 15,
            message: "角色描述应在2-15个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // 获取角色列表
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      let { data, meta } = await getRolesList();
      // console.log(data);
      if (meta.status === 200) {
        this.rolesList = data;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取角色列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/home");
      }
    },
    // 关闭添加角色对话框
    closeAddRoleDialog() {
      this.addRoleDialogShow = false;
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleForm.validate(async (valid) => {
        if (valid) {
          const { data, meta } = await addRole(this.roleInfo);
          // console.log(data);
          if (meta.status === 201) {
            ElMessage({
              showClose: true,
              message: `添加角色${data.roleName}成功`,
              type: "success",
              duration: 1000,
            });
            this.addRoleDialogShow = false;
            this.getRolesList();
          } else {
            this.addUserDialogShow = false;
            ElMessage({
              showClose: true,
              message: meta.msg,
              type: "error",
              duration: 1000,
            });
          }
        } else {
          return;
        }
      });
    },
    // 显示添加角色对话框
    showAddRoleDialog() {
      this.addRoleDialogShow = true;
    },
    // 重置添加角色表单
    addRoleDialogClose() {
      this.$refs.addRoleForm.resetFields();
    },
    // 显示编辑角色对话框
    async showEditRoleDialog(row) {
      let { data, meta } = await getRole(row.id);
      // console.log(data, meta);
      if (meta.status == 200) {
        this.editRoleDialogShow = true;
        this.editInfo.id = data.roleId;
        this.editInfo.roleName = data.roleName;
        this.editInfo.roleDesc = data.roleDesc;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取角色信息失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 关闭编辑角色对话框
    closeEditRoleDialog() {
      this.editRoleDialogShow = false;
    },
    // 编辑角色
    editRole() {
      this.$refs.editRoleForm.validate(async (valid) => {
        if (valid) {
          console.log(this.editInfo.id);
          let { data, meta } = await editRole(this.editInfo.id, {
            roleName: this.editInfo.roleName,
            roleDesc: this.editInfo.roleDesc,
          });
          // console.log(data, meta);
          if (meta.status == 200) {
            this.editRoleDialogShow = false;
            ElMessage({
              showClose: true,
              message: `修改角色${data.roleName}的信息成功`,
              type: "success",
              duration: 1000,
            });
            this.getRolesList();
          } else {
            this.editRoleDialogShow = false;
            ElMessage({
              showClose: true,
              message: `修改角色信息失败`,
              type: "error",
              duration: 1000,
            });
          }
        } else {
          return;
        }
      });
    },
    // 关闭删除角色对话框
    closeDeleteRoleDialog() {
      this.deleteRolesDialogShow = false;
    },
    // 显示删除角色对话框
    async showDeleteRoleDialog(row) {
      let { data, meta } = await getRole(row.id);
      console.log(data, meta);
      if (meta.status == 200) {
        this.deleteRolesDialogShow = true;
        this.deleteRoleInfo.id = data.roleId;
        this.deleteRoleInfo.roleName = data.roleName;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取角色信息失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 删除角色
    async deleteRole() {
      let { data, meta } = await deleteRole(this.deleteRoleInfo.id);
      console.log(data, meta);
      if (meta.status == 200) {
        this.deleteRolesDialogShow = false;
        ElMessage({
          showClose: true,
          message: `删除角色${this.deleteRoleInfo.roleName}的信息成功`,
          type: "success",
          duration: 1000,
        });
        this.getRolesList();
      } else {
        this.deleteRolesDialogShow = false;
        ElMessage({
          showClose: true,
          message: `修改角色信息失败`,
          type: "error",
          duration: 1000,
        });
      }
    },
    // 删除指定权限
    async deleteCurrentRight(row, item) {
      // console.log(row);
      // console.log(item);
      ElMessageBox.confirm(
        `确认删除  ${row.roleName}  的  ${item.authName}  权限?`,
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteCurrentRight(row.id, item.id).then((res) => {
            console.log(res);
            if (res.meta.status === 200) {
              ElMessage({
                type: "success",
                message: "删除完成",
                duration: 1000,
              });
              // this.getRolesList();
              row.children = res.data;
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
    // 显示分配权限对话框
    async ShowAllocationRoleDialog(type,row) {
      this.checkedArray = []
      this.allocationRoleDialogShow = true;
      let { data, meta } = await getRightsList(type);
      if (meta.status === 200) {
        // console.log(data, meta);
        this.checkedRole.id = row.id
        this.checkedRole.roleName = row.roleName
        this.rightsList = data;
        for(let item1 of row.children){
          for(let item2 of item1.children){
            for(let item3 of item2.children){
              this.checkedArray.push(item3.id)
            }
          }
        }

      } else {
        ElMessage({
          showClose: true,
          message: "拉取权限列表失败",
          type: "error",
          duration: 1000,
        });
        this.$router.push("/home");
      }
    },
    // 关闭分配权限对话框
    closeAllocationRoleDialog() {
      this.allocationRoleDialogShow = false;
      this.checkedArray = []
    },
    // 分配权限
    async allocationRole() {
      let checked = this.$refs.checkRights.getCheckedKeys()
      let halfChecked = this.$refs.checkRights.getHalfCheckedKeys()
      console.log(checked,halfChecked)
      console.log(this.checkedRole)
      let { meta } = await allocationRight(this.checkedRole.id,[...checked,...halfChecked].join(','))
      console.log(meta)
      if(meta.status == 200){
        ElMessage({
          showClose: true,
          message: `为角色 ${this.checkedRole.roleName} 分配权限成功`,
          type: "success",
          duration: 1000,
        });
        this.getRolesList();
      }else {
        ElMessage({
          showClose: true,
          message: `为角色 ${this.checkedRole.roleName} 分配权限失败`,
          type: "error",
          duration: 1000,
        });
      }
      this.allocationRoleDialogShow = false
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
    margin-top: 30px;

    .borderTop {
      border-top: 1px solid #eee;
    }

    .borderBottom {
      border-bottom: 1px solid #eee;
    }

    .el-row {
      margin: 0 50px;
    }

    .el-tag {
      margin: 10px;
    }
  }

  .pagination {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
