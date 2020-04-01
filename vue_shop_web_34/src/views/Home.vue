<template>
  <el-container class="home-box">
    <!-- 头部区域 -->
    <el-header>
      <div class="login-box">
        <img src="../assets/image/heima.png" alt="login图片" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <div class="toggle_bar" @click="collapse = !collapse">|||</div>
        <!-- 左侧menu菜单开始 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 子菜单 -->
          <el-submenu
            :index="itme.path"
            v-for="(itme, i) in menuList"
            :key="itme.id"
            :style="collapse ? 'width:64px' : 'width:200px'"
          >
            <template slot="title">
              <i :class="['iconfont', iocnList[i]]"></i>
              <span>{{ itme.authName }}</span>
            </template>
            <!-- 子菜单的Itme选项 -->
            <el-menu-item
              :index="'/' + subItme.path"
              v-for="subItme in itme.children"
              :key="subItme.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItme.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 左侧menu菜单结束 -->
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mix from "./Home-mixins";
export default {
  mixins: [mix]
};
</script>

<style lang="less" scoped>
.home-box {
  height: 100%;
  // 头部
  .el-header {
    background-color: #373d41;
    height: 60px;
    // 设置成伸缩盒子
    display: flex;
    // 两端对齐.中间自适应
    justify-content: space-between;
    // 居中对齐
    align-items: center;
    padding: 0;
    padding-right: 20px;
    user-select: none;
    .login-box {
      display: flex;
      color: #ffffff;
      align-items: center;
      font-size: 22px;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  // 左边
  .el-aside {
    background-color: #333744;
    user-select: none;
  }
  // 右边
  .el-main {
    background-color: #eaedf1;
  }
}
// 左边菜单toggle_bar的伸缩
.toggle_bar {
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 25px;
  background-color: #4a5064;
  user-select: none;
  //小手
  cursor: pointer;
  //字体间距
  letter-spacing: 0.1em;
}
</style>
