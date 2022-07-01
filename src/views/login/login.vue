<template>
  <div class="loginForm_container">
    <div class="formBox">
      <div class="avatar">
        <img src="~@/assets/img/avatar/avatar.jpg" alt="" />
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        label-width="80px"
        :rules="loginFormRules"
        class="loginForm"
        hide-required-asterisk
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" maxlength="15">
            <template #prefix>
              <el-icon>
                <UserFilled />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="loginForm.password" maxlength="20">
            <template #prefix>
              <i class="iconfont icon-3702mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "network/login.js";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
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
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.loginForm.username, this.loginForm.password).then(
            (res) => {
              // console.log(res);
              if (res.meta.status == 200) {
                ElMessage({
                  showClose: true,
                  message: "登录成功",
                  type: "success",
                  duration:600
                });
                window.sessionStorage.setItem('token', res.data.token)
                this.$router.push('/home')
              } else {
                ElMessage({
                  showClose: true,
                  message: "登录失败",
                  type: "error",
                });
              }
            }
          );
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.loginForm_container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url(~@/assets/img/background/background.jpg) no-repeat;
  background-size: 100vw;

  .formBox {
    width: 450px;
    height: 350px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background-color: #e0ffff;
    opacity: 0.85;

    .avatar {
      width: 80px;
      height: 80px;
      position: absolute;
      left: 50%;
      top: -40px;
      transform: translate(-50%);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50% 50%;
        border: 10px solid #e0ffff;
      }
    }

    .loginForm {
      margin: 120px 50px;

      .btns {
        position: absolute;
        right: 50px;
      }
    }
  }
}
</style>
