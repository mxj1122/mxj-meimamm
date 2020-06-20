<template>
  <div class="layout-user">
    <!-- 顶部区域 -->
    <el-card shadow="hover">
      <el-form :model="searchForm" ref="searchFormRef" label-width="80px" inline class="searchForm">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="searchForm.username" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="searchForm.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearFormIfo">清空</el-button>
          <el-button type="primary" @click="addUser">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容区域 -->
    <el-card shadow="hover" style="margin-top:20px">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="180"></el-table-column>

        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="role" label="角色" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" width="280"></el-table-column>
        <el-table-column label="状态" width="80">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- vue.js内联样式style三元运算表达式以及普通三元运算表达式 -->
            <span
              :style="{'color':scope.row.status===0? 'red':'blue'}"
            >{{scope.row.status===0?"禁用":'启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status===0?'success':'info'"
              @click="changeStatus(scope.row.id)"
            >{{scope.row.status===0?'启用':'禁用'}}</el-button>
            <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="danger" @click="removeUser(scope.row.id,scope.row.username)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <user-edit ref="userEditRef"></user-edit>
  </div>
</template>
<script>
import UserEdit from "./user-add-edit";
export default {
  name: "user",
  components: {
    UserEdit
  },
  data() {
    return {
      searchForm: {
        username: "",
        email: "",
        role_id: ""
      },
      tableData: [], //内容表格数据
      page: 1, //页数
      limit: 5, //每页显示多少条
      total: 0 //总共有多少页
    };
  },
  methods: {
    //   获取表格数据
    async getTableIfo() {
      const res = await this.$axios("/user/list", {
        params: {
          page: this.page,
          limit: this.limit,
          // 展开运算符
          ...this.searchForm
        }
      });
      if (res.data.code === 200) {
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索
    search() {
      // 始终显示第一页数据
      this.page = 1;
      this.getTableIfo();
    },
    // 清空
    clearFormIfo() {
      // 调用elform事件,调用改事件表单每项必须要有prop属性,官方没有说明
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 新增
    addUser() {
      this.$refs.userEditRef.model = "add";
      this.$refs.userEditRef.centerDialogVisible = true;
      // 优化再次打开新增界面时任然保留上次输入内容和校验的BUG
      // 要拿到el-form元素必须渲染之后才可以   因为vue在display=none时不会加载el-form
      this.$nextTick(() => {
        this.$refs.userEditRef.$refs.userEditFormRef.resetFields();
      });
    },
    // 编辑
    editUser(row) {
      this.$refs.userEditRef.model = "edit";
      this.$refs.userEditRef.centerDialogVisible = true;
      // 深/浅拷贝以及通过绑定属性使字符串直接成为数字（字符串：value="1" /数字：:value="1"）
      this.$refs.userEditRef.userEditForm=JSON.parse(JSON.stringify(row));
    },
    // 改变 禁/启用 状态
    async changeStatus(id) {
      const res = await this.$axios.post("/user/status", { id });
      if (res.data.code === 200) {
        this.getTableIfo();
      }
    },
    // 删除用户
    removeUser(id, username) {
      //   使用模板字符串方法识别username
      this.$confirm(`该操作将永久删除用户《${username}》,是否继续？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/user/remove", { id });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getTableIfo();
        })
        .catch(() => {});
    },
    //   每页val条改变事件
    handleSizeChange(val) {
      this.limit = val;
      this.search();
    },
    //   当前val页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.getTableIfo();
    }
  },
  created() {
    //   获取表格用户信息
    this.getTableIfo();
  }
};
</script>
<style lang="less">
.layout-user {
  .searchForm {
    text-align: center;
  }
  .pagination {
    text-align: center;
    margin-top: 30px;
    background-color: skyblue;
  }
}
</style>