<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/images/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!-- element-ui form表单 -->
      <el-form class="elForm" :model="formIfo" :rules="rules" status-icon ref="elForm">
        <el-form-item prop="phone">
          <el-input v-model="formIfo.phone" prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formIfo.password"
            prefix-icon="el-icon-s-goods"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input v-model="formIfo.code" prefix-icon="el-icon-key" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="10">
              <img :src="codeURL" @click="codeClick" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheck">
          <el-checkbox v-model="formIfo.isCheck"></el-checkbox>我已阅读并同意
          <el-link type="primary">用户协议</el-link>和
          <el-link type="primary">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginClick">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerClick">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/images/login_bg.png" alt />
    </div>
    <register ref="registerRef"></register>
  </div>
</template>

<script>
import { setToken } from "@/utils/token";
// 导入注册子组件
import register from './register'


export default {
  name: "login",
  
  data() {
    return {
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      // 表单数据
      formIfo: {
        phone: "18511111111",
        password: "12345678",
        code: "",
        isCheck: true
      },
      // 表单校验
      rules: {
        phone: [
          //   { required: true, message: "请输入手机号码", trigger: "blur" },
          //   { min: 11, max: 11, message: "手机号不合法", trigger: "blur" }

          // 自定义校验
          {
            validator: (rule, value, callback) => {
              const reg = /^1[3456789][0-9]{9}$/;
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }
              if (!reg.test(value)) {
                return callback(new Error("请填写正确的手机号！"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少需要6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码为4位", trigger: "blur" }
        ],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("必须同意用户协议！"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    codeClick() {
      this.codeURL =
        process.env.VUE_APP_BASEURL + "/captcha?type=login&r=" + Math.random();
    },
    loginClick() {
      this.$refs.elForm.validate(async valid => {
        if (!valid) return;
        const res = await this.$axios.post("/login", this.formIfo);
        console.log(res);
        
        if (res.data.code === 200) {
          this.$message({
            showClose: true,
            message: "登录成功！",
            type: "success",
            center: true
          });
          // 保存token
          setToken(res.data.data.token);
          // 跳转到layout页面
          this.$router.push("/layout");
        } else {
          // 刷新验证码
          this.codeURL =
            process.env.VUE_APP_BASEURL +
            "/captcha?type=login&r=" +
            Math.random();
          // 提示信息
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "warning"
          });
        }
      });
    },
    registerClick() {
      this.$refs.registerRef.dialogVisible=true
    }
  },
  components:{
    register
  }
};
</script>

<style lang='less'>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .elForm {
      margin-top: 20px;
      img {
        width: 100%;
        height: 40px;
      }
      button {
        width: 100%;
      }
    }
  }
}
</style>