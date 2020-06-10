 <template>
  <div class="register">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <!-- 顶部区域 -->
      <span slot="title" class="title">注册</span>
      <!--中间form表单区域 -->
      <el-form
        label-position="left"
        label-width="80px"
        :rules="rules"
        status-icon
        :model="registerForm"
        ref="registerRef"
      >
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <el-row>
            <el-col :span="10">
              <el-input v-model.number="registerForm.code"></el-input>
            </el-col>
            <el-col :span="6" class="emp"></el-col>
            <el-col :span="8">
              <img @click="resetCode" class="captcha" :src="codeUrl" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row>
            <el-col :span="10">
              <el-input v-model.number="registerForm.rcode"></el-input>
            </el-col>
            <el-col :span="6" class="emp"></el-col>
            <el-col :span="8">
              <el-button class="rcode" @click="getRcode">获取手机验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
      dialogVisible: false, //控制注册组件的显示和隐藏
      imageUrl: "", //头像上传成功之后服务器返回的服务器保存头像的地址
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads", //头像上传地址
      registerForm: {
        username: "sas",
        email: "asds@qq.com",
        phone: "19925663326",
        password: "0000000",
        code: "",
        rcode: "",
        avatar: ""
      },
      rules: {
        avatar: [{ required: true, message: "请上传头像！", trigger: "blur" }],
        username: [
          { required: true, message: "请输入昵称！", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入邮箱！"));
              }
              const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              if (!reg.test(value)) {
                return callback(new Error("邮箱不合法！"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入手机号码！"));
              }
              const reg = /^[1][3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号码不合法！"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "blur" },
          { min: 6, message: "密码长度不能小于6位！", trigger: "blur" }
        ],
        code: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入图形码！"));
              }
              if (!Number.isInteger(value)) {
                callback(new Error("请输入数字值"));
              }
              if (value.toString().length != 4) {
                return callback(new Error("图形码为4位！"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        rcode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入验证码！"));
              }
              if (!Number.isInteger(value)) {
                callback(new Error("请输入数字值"));
              }
              if (value.toString().length != 4) {
                return callback(new Error("验证码为4位！"));
              }
              callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //   头像上传之前调用的函数 做上传文件限制处理,参数是上传文件file
    beforeAvatarUpload(file) {
      // 限制上传文件格式
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      //   限制上传文件大小：小于2MB
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    // 头像上传成功之后的函数，参数上传成功返回数据res和上传文件file
    handleAvatarSuccess(res) {
      // 保存服务器图片地址  是注册用的参数
      this.registerForm.avatar = res.data.file_path;
      // 给imageUrl赋值，让图片显示出来 拼接时需要加上"/"
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
    },
    resetCode() {
      this.codeUrl =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&r=" +
        Math.random();
    },
    async getRcode() {
      const res = await this.$axios.post("/sendsms", {
        code: this.registerForm.code,
        phone: this.registerForm.phone
      });
      if (res.data.code == 200) {
        this.registerForm.rcode = res.data.data.captcha;
      } else {
        this.resetCode();
        this.$message({
          message: res.data.message,
          type: "warning"
        });
      }
    },
    submit() {
      this.$refs.registerRef.validate(async valid => {
        if (!valid) {
          return;
        }
        let res = await this.$axios.post("/register", this.registerForm);
        if (res.data.code !== 200) {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        } else {
          this.$message({
            message: "注册成功！",
            type: "success"
          });
          this.dialogVisible = false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.register {
  .title {
    display: block;
    height: 53px;
    background: #03c0f9;
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
  .emp {
    height: 40px;
  }
  .rcode {
    width: 100%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  //   头像上传居中
  //   .avatar-uploader {
  //       text-align: center;
  //   }
}
</style>