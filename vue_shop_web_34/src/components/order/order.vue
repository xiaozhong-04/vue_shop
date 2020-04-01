<template>
  <div class="order">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80"
        ></el-table-column>
        <el-table-column label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay == 1">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80"
        ></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">{{
            scope.row.update_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-button
              type="primary"
              title="修改订单地址"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="success"
              title="物流信息"
              icon="el-icon-location"
              size="mini"
              @click="showLogistics"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 物流信息对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="dialogVisible" width="50%">
      <el-steps direction="vertical" :active="0">
        <el-step
          v-for="(itme, i) in wlInfo"
          :key="i"
          :title="itme.time"
          :description="itme.context"
        ></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
import mix from "./order-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style></style>
