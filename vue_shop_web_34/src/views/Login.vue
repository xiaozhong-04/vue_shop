<template>
  <div class="login">
    <div class="login_box">
      <!-- 图片 -->
      <div class="avatar_box">
        <img src="../assets/image/logo.png" alt="logo图标" />
      </div>
      <!-- 表单 -->
      <el-form
        class="login-form"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        status-icon
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" @keyup.enter.native="login">
            <i slot="prefix" class="iconfont icon-morentouxiang"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            show-password
            @keyup.enter.native="login"
          >
            <i slot="prefix" class="iconfont icon-lock_fill"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //登录
    login() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        // 发起ajax
        let { data: res } = await this.$http.post("login", this.ruleForm);
        // console.log(res);
        //判断用户名或者密码是否正确
        if (res.meta.status !== 200) {
          window.sessionStorage.removeItem("token");
          return this.$message.error("登录失败,您的用户名或密码错误!!!");
        }
        sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
        return this.$message.success("登录成功");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 304px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 0 10px #eee;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
}

.login-form {
  width: 100%;
  padding: 20px;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
}
</style>
