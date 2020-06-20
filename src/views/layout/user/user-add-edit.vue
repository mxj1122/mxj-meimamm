<template>
  <div class="user-edit">
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
      <span slot="title" class="title">{{model==='add'?'新增用户':'编辑用户'}}</span>
      <el-form
        :model="userEditForm"
        ref="userEditFormRef"
        label-width="80px"
        label-position="left"
        :rules="rules"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userEditForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userEditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userEditForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="userEditForm.role_id" placeholder="请选择">
            <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="老师" :value="3"></el-option>
            <el-option label="学生" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userEditForm.status" placeholder='请选择'>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userEditForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "userEdit",
  data() {
    return {
      centerDialogVisible: false,
      model: "", //控制该窗口是新增还是编辑
      userEditForm: {
        username: "",
        email: "",
        phone: "",
        role_id: "",
        status: "",
        remark: ""
      },
      rules: {
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
        role_id: [
          { required: true, message: "请选择角色！", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择状态！", trigger: "change" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      // 提交前做表单校验
      this.$refs.userEditFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        let res = null;

        //    需要判断是新增还是编辑
        if (this.model === "add") {
          // 新增
          res = await this.$axios.post("/user/add", this.userEditForm);
        } else {
          // 编辑
          res = await this.$axios.post("/user/edit", this.userEditForm);
        }

        // 成功判断
        if (res.data.code === 200) {
          this.$message({
            showClose: true,
            message: this.model === "add" ? "新增成功！" : "修改成功！",
            type: "success"
          });
          this.centerDialogVisible = false;
          //   调用父级方法刷新
          this.model === "add"
            ? this.$parent.search()
            : this.$parent.getTableIfo();
        }else{
            // 失败提示
            this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang='less'>
.user-edit {
  .title {
    display: block;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: rgb(102, 177, 255);
    color: #fff;
    font-size: 20px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-icon-close:before {
    color: #fff;
  }
}
</style>