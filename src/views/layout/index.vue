<template>
  <el-container class="layout">
    <!-- 头部 -->
    <el-header class="header">
      <div class="left">
        <i style="font-size: 20px;" class="el-icon-s-fold" @click="isCollapse=!isCollapse"></i>
        <img src="@/assets/images/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <span class="name">
          <i>{{username}}</i>, 欢迎您
        </span>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside width="auto" class="aside">
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          router
          :default-active="activeMenu"
        >
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main style="background-color:#e8e9ec;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { delToken } from "@/utils/token";
export default {
  name:'layout',
  data() {
    return {
      isCollapse: false, //控制侧边栏收缩
      avatar: "", //用户头像
      username: "", //用户名
      activeMenu: "/layout/user" //默认选中的侧边栏:用户列表
    };
  },
   created() {
    //  获取用户信息
    this.getUserInfo();
    // 侧边栏选中在刷新时不变
    // console.log(this.$router);
    this.activeMenu=this.$router.currentRoute.fullPath;
    
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      const res = await this.$axios.get("/info");
      // console.log(res);
      if (res.data.code == 200) {
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
        this.username = res.data.data.username;
      }
    },
    // 退出事件
    logout() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$axios.get("/logout");
        if (res.data.code == 200) {
          delToken();
          this.$message({
            type: "success",
            message: "成退出!"
          });
          this.$router.push("/login");
        }
      });
    }
  }
};
</script>

<style lang='less'>
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .aside {
    background-color: #545c64;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
      .el-menu {
        border-right: solid 0px #e6e6e6;
        list-style: none;
        position: relative;
        margin: 0;
        padding-left: 0;
        background-color: #fff;
      }
    }

    // .el-menu-vertical-demo:not(.el-menu--collapse) {
    //   width: 200px;
    //   min-height: 400px;
    // }
  }
}
</style>