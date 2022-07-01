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
              <el-button type="warning" icon="Setting" size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog
      ref="deleteUserForm"
      title="删除用户信息"
      width="35%"
      v-model="deleteUserDialogShow"
    >
      <span>删除用户 {{ deleteUserInfo.username }}?</span>
      <template #footer>
        <span>
          <el-button @click="closeDeleteUserDialog()">取消</el-button>
          <el-button type="danger" @click="deleteUser()">删除</el-button>
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
} from "network/user.js";
import { dataFormat } from "common/utils.js";
export default {
  name: "userList",
  data() {
    const checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.userInfo.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
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
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      totalUser: 0,
      addUserDialogShow: false,
      changeUserDialogShow: false,
      deleteUserDialogShow: false,
      userInfo: {
        username: "admin",
        password: "123456",
        rePassword: "123456",
        email: "210923720@qq.com",
        mobile: "15588888888",
      },
      changeInfo: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      deleteUserInfo: {
        id: "",
        username: "",
      },
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
            message: "请输入密码",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList(this.queryInfo);
  },
  methods: {
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
    async searchUser(id) {
      const { data } = await searchUser(id);
      // console.log(data)
      this.userList = data.users;
      this.totalUser = data.total;
      for (let item of this.userList) {
        item.create_time = dataFormat(item.create_time);
      }
    },
    tableRowClassName({ row }) {
      if (row.mg_state) {
        return "success";
      } else {
        return "error";
      }
    },
    handleSizeChange() {
      this.getUserList(this.queryInfo);
    },
    handleCurrentChange() {
      this.getUserList(this.queryInfo);
    },
    statusChange(user) {
      // console.log(user.id, user.mg_state);
      this.changeUserStatus(user.id, user.mg_state);
    },
    search() {
      this.searchUser(this.queryInfo);
    },
    showAddUserDialog() {
      this.addUserDialogShow = true;
    },
    closeAddUserDialog() {
      this.addUserDialogShow = false;
    },
    addUserDialogClose() {
      this.$refs.addUserForm.resetFields();
    },
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
    closeChangeUserDialog() {
      this.changeUserDialogShow = false;
    },
    changeUserDialogClose() {
      this.$refs.changeUserForm.resetFields();
    },
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
    closeDeleteUserDialog() {
      this.deleteUserDialogShow = false;
    },
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
