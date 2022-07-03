<template>
  <div>
    <!-- 用户列表面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表卡片 -->
    <el-card class="box-card">
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="搜索内容"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            size="large"
            v-model="queryInfo.query"
          >
            <template #append>
              <el-button icon="Search" @click="search()" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="large" @click="showAddUserDialog()"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column fixed type="index" label="#" width="50" />
        <el-table-column fixed prop="username" label="名称" width="180" />
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="mobile" label="电话" width="180" />
        <el-table-column prop="role_name" label="角色" width="180" />
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column prop="mg_state" label="状态" width="180">
          <template #default="{ row }">
            <el-switch v-model="row.mg_state" @change="statusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                size="small"
                @click="showChangeUserDialog(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="showDeleteUserDialog(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="Setting"
                size="small"
                @click="showAllocationRoleDialog(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          ref="pagination"
          v-model:currentPage="queryInfo.pagenum"
          v-model:page-size="queryInfo.pagesize"
          :page-sizes="[2, 5, 8, 10]"
          background="background"
          :default-page-size="2"
          layout="sizes, prev, pager, next, jumper, ->, total"
          :total="totalUser"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      width="35%"
      v-model="addUserDialogShow"
      @close="addUserDialogClose()"
    >
      <el-form
        ref="addUserForm"
        label-width="80px"
        :model="userInfo"
        :rules="userInfoRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="输入用户名" v-model="userInfo.username"> </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password placeholder="输入密码" v-model="userInfo.password">
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            show-password
            placeholder="再次输入密码"
            v-model="userInfo.rePassword"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="userInfo.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="userInfo.mobile"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddUserDialog">取消</el-button>
          <el-button type="primary" @click="addUser">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      width="35%"
      v-model="changeUserDialogShow"
      @close="changeUserDialogClose()"
    >
      <el-form
        ref="changeUserForm"
        label-width="80px"
        :rules="userInfoRules"
        :model="changeInfo"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="changeInfo.username"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="changeInfo.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="changeInfo.mobile"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeChangeUserDialog()">取消</el-button>
          <el-button type="primary" @click="changeUser">修改</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除用户对话框 -->
    <el-dialog
      ref="deleteUserForm"
      title="删除用户信息"
      width="35%"
      v-model="deleteUserDialogShow"
      @close="resetRoleId()"
    >
      <span>删除用户 {{ deleteUserInfo.username }}?</span>
      <template #footer>
        <span>
          <el-button @click="closeDeleteUserDialog()">取消</el-button>
          <el-button type="danger" @click="deleteUser()">删除</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      ref="deleteUserForm"
      title="分配角色"
      width="35%"
      v-model="allocationRoleDialogShow"
    >
      <div class="allocInfo">
        <div>
          <p>当前用户:{{ checkedUser.username }}</p>
          <p>当前角色:{{ checkedUser.role_name }}</p>
          <p>
            <el-select
              v-model="checkedUser.roleId"
              class="m-2"
              placeholder="选择角色"
            >
              <el-option
                v-for="item in rightsList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </p>
        </div>
      </div>
      <template #footer>
        <span>
          <el-button @click="closeAllocationRoleDialog()">取消</el-button>
          <el-button type="danger" @click="allocationRole()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  changeUserStatus,
  searchUser,
  addUser,
  getUser,
  changeUser,
  deleteUser,
  allocationRole,
} from "network/user.js";
import { getRolesList } from "network/power.js";
import { dataFormat } from "common/utils.js";
export default {
  name: "userList",
  data() {
    // 自定义验证规则
    // 确认密码
    const checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.userInfo.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    // 邮箱验证
    const checkEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!value) {
        callback();
      } else if (!reg.test(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    // 手机号验证
    const checkMobile = (rule, value, callback) => {
      const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (!value) {
        callback();
      } else if (!reg.test(value)) {
        callback(new Error("手机号码格式错误"));
      } else {
        callback();
      }
    };
    return {
      // 用户请求信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      // 用户列表
      userList: [],
      // 用户总数
      totalUser: 0,
      // 添加用户对话框显示状态
      addUserDialogShow: false,
      // 编辑用户对话框显示状态
      changeUserDialogShow: false,
      // 删除用户对话框显示状态
      deleteUserDialogShow: false,
      // 分配角色对话框显示状态
      allocationRoleDialogShow: false,
      // 添加用户信息
      userInfo: {
        username: "admin",
        password: "123456",
        rePassword: "123456",
        email: "210923720@qq.com",
        mobile: "15588888888",
      },
      // 编辑用户信息
      changeInfo: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      // 删除用户信息
      deleteUserInfo: {
        id: "",
      },
      // 分配角色选中的用户
      checkedUser: {
        id: -1,
        username: "",
        role_name: "",
        roleId: "",
      },
      // 角色列表
      rightsList: [],
      // 验证规则
      userInfoRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名长度应在3-10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码长度应在6-15个字符之间",
            trigger: "blur",
          },
        ],
        rePassword: [
          {
            required: true,
            message: "请确认密码",
            trigger: "blur",
          },
          { validator: checkPassword, trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 获取用户列表
    this.getUserList(this.queryInfo);
  },
  methods: {
    // 获取用户列表
    async getUserList(params = "") {
      params = params == "" ? this.queryInfo : params;
      const { data } = await getUserList(params);
      // console.log(data);
      this.userList = data.users;
      this.totalUser = data.total;
      for (let item of this.userList) {
        item.create_time = dataFormat(item.create_time);
      }
    },
    // 改变用户状态
    async changeUserStatus(uid, type) {
      const { meta } = await changeUserStatus(uid, type);
      // console.log(meta);
      if (meta.status == 200) {
        ElMessage({
          showClose: true,
          message: "修改用户状态成功",
          type: "success",
          duration: 600,
        });
      } else {
        ElMessage({
          showClose: true,
          message: "修改用户状态失败",
          type: "error",
        });
      }
    },
    // 通过Id搜索用户
    async searchUser(id) {
      const { data } = await searchUser(id);
      // console.log(data)
      this.userList = data.users;
      this.totalUser = data.total;
      for (let item of this.userList) {
        item.create_time = dataFormat(item.create_time);
      }
    },
    // 显示用户状态
    tableRowClassName({ row }) {
      if (row.mg_state) {
        return "success";
      } else {
        return "error";
      }
    },
    // 处理分页大小变化
    handleSizeChange() {
      this.getUserList(this.queryInfo);
    },
    // 处理选中分页
    handleCurrentChange() {
      this.getUserList(this.queryInfo);
    },
    // 改变用户状态事件
    statusChange(user) {
      // console.log(user.id, user.mg_state);
      this.changeUserStatus(user.id, user.mg_state);
    },
    // 搜索用户事件
    search() {
      this.searchUser(this.queryInfo);
    },
    // 显示添加用户对话框
    showAddUserDialog() {
      this.addUserDialogShow = true;
    },
    // 关闭添加用户对话框
    closeAddUserDialog() {
      this.addUserDialogShow = false;
    },
    // 重置添加用户表单
    addUserDialogClose() {
      this.$refs.addUserForm.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addUserForm.validate(async (valid) => {
        if (valid) {
          let { data, meta } = await addUser(
            this.userInfo.username,
            this.userInfo.password,
            this.userInfo.email,
            this.userInfo.mobile
          );
          if (meta.status == 201) {
            this.addUserDialogShow = false;
            ElMessage({
              showClose: true,
              message: `添加用户${data.username}成功`,
              type: "success",
              duration: 1000,
            });
            this.getUserList(this.queryInfo);
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
    // 显示编辑用户对话框
    async showChangeUserDialog(row) {
      let { data, meta } = await getUser(row.id);
      // console.log(res);
      if (meta.status == 200) {
        this.changeUserDialogShow = true;
        this.changeInfo.id = data.id;
        this.changeInfo.username = data.username;
        this.changeInfo.email = data.email;
        this.changeInfo.mobile = data.mobile;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取用户信息失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 关闭编辑用户对话框
    closeChangeUserDialog() {
      this.changeUserDialogShow = false;
    },
    // 重置编辑用户表单
    changeUserDialogClose() {
      this.$refs.changeUserForm.resetFields();
    },
    // 编辑用户
    changeUser() {
      this.$refs.changeUserForm.validate(async (valid) => {
        if (valid) {
          let { data, meta } = await changeUser(
            this.changeInfo.id,
            this.changeInfo.email,
            this.changeInfo.mobile
          );
          console.log(data, meta);
          if (meta.status == 200) {
            this.changeUserDialogShow = false;
            ElMessage({
              showClose: true,
              message: `修改用户${data.username}的信息成功`,
              type: "success",
              duration: 1000,
            });
            this.getUserList(this.queryInfo);
          } else {
            this.changeUserDialogShow = false;
            ElMessage({
              showClose: true,
              message: `修改用户信息失败`,
              type: "error",
              duration: 1000,
            });
          }
        } else {
          return;
        }
      });
    },
    // 显示删除用户对话框
    async showDeleteUserDialog(row) {
      let { data, meta } = await getUser(row.id);
      // console.log(data,meta)
      if (meta.status == 200) {
        this.deleteUserDialogShow = true;
        this.deleteUserInfo.id = row.id;
        this.deleteUserInfo.username = data.username;
      } else {
        ElMessage({
          showClose: true,
          message: "拉取用户信息失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 关闭删除用户对话框
    closeDeleteUserDialog() {
      this.deleteUserDialogShow = false;
    },
    // 删除用户
    async deleteUser() {
      let { data, meta } = await deleteUser(this.deleteUserInfo.id);
      // console.log(data, meta);
      if (meta.status == 200) {
        this.deleteUserDialogShow = false;
        ElMessage({
          showClose: true,
          message: `删除用户${this.deleteUserInfo.username}成功`,
          type: "success",
          duration: 1000,
        });
        this.getUserList(this.queryInfo);
      } else {
        this.deleteUserDialogShow = false;
        ElMessage({
          showClose: true,
          message: meta.msg,
          type: "error",
          duration: 1000,
        });
      }
    },
    // 分配角色
    async allocationRole() {
      if (this.checkedUser.roleId === "") {
        ElMessage({
          showClose: true,
          message: "尚未选择角色",
          type: "error",
          duration: 1000,
        });
      } else {
        let { data, meta } = await allocationRole(
          this.checkedUser.id,
          this.checkedUser.roleId
        );
        console.log(data,meta)
        if (meta.status == 200) {
          ElMessage({
            showClose: true,
            message: `成功为 ${data.username} 分配角色`,
            type: "success",
            duration: 1000,
          });
          this.getUserList(this.queryInfo);
        } else {
          ElMessage({
            showClose: true,
            message: "分配角色失败",
            type: "error",
            duration: 1000,
          });
        }
        this.allocationRoleDialogShow = false;
        this.checkedUser.roleId = ""
      }
    },
    //关闭分配角色的对话框
    closeAllocationRoleDialog() {
      this.allocationRoleDialogShow = false;
      this.checkedUser.roleId = "";
    },
    // 打开分配角色的对话框
    async showAllocationRoleDialog(row) {
      let { data, meta } = await getRolesList();
      if (meta.status == 200) {
        this.allocationRoleDialogShow = true;
        this.checkedUser.id = row.id;
        this.checkedUser.username = row.username;
        this.checkedUser.role_name = row.role_name;
        // console.log(this.checkedUser);
        this.rightsList = data;
        // console.log(this.rightsList);
      } else {
        ElMessage({
          showClose: true,
          message: "拉取角色列表信息失败",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 重置选择的角色Id
    resetRoleId(){
      this.checkedUser.roleId = ""
    }
  },
  computed: {},
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
