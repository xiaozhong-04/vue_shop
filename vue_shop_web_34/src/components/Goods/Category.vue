<template>
  <div class="category">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加商品分类 -->
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addCateList">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格 -->
      <tree-table
        style="margin-top: 15px;"
        :data="CategoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
      >
        <!-- 是否有效插槽 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color:#20b2aa"
          ></i>
          <i class="el-icon-circle-close" v-else style="color:red"></i>
        </template>
        <!-- 排序插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二级</el-tag
          >
          <el-tag
            type="warning"
            v-else-if="scope.row.cat_level === 2"
            size="mini"
            >三级</el-tag
          >
        </template>
        <!-- 操作插槽 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="editor(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="remove(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCsteDialogVisible"
      width="50%"
      @closed="resetForm"
    >
      <el-form
        :model="cateForm"
        :rules="cateFormRules"
        ref="cateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedCateList"
            :options="parentCateList"
            :props="cascaderProp"
            @change="handleChange"
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCsteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="editorDialogVisible" width="50%">
      <el-form
        :model="editorForm"
        :rules="editorFormRules"
        ref="editorFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editorForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mix from "./Category-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style lang="less" scoped></style>
