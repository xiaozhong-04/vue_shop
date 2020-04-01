export default {
  data() {
    return {
      //查询参数对象
      queryInfo: {
        //查三层数据
        type: 3,
        //当前页码值
        pagenum: 1,
        //当前显示数据条数
        pagesize: 5
      },
      //商品分类数据
      CategoriesList: [],
      //定义树形表格列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
          width: "200px"
        }
      ],
      //总共多少分类
      total: 0,
      //控制添加分类对话框的显示和隐藏
      addCsteDialogVisible: false,
      //添加分类的数据
      cateForm: {
        //分类父ID
        cat_pid: 0,
        //分类名称
        cat_name: "",
        //分类层级
        cat_level: 0
      },
      //校验
      cateFormRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      //级联选择的配置对象
      cascaderProp: {
        expandTrigger: true,
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //被选中 父级ID 都会被存储到这
      selectedCateList: [],
      //控制编辑对话框的显示和隐藏
      editorDialogVisible: false,
      editorForm: {
        cat_name: ""
      },
      //编辑校验
      editorFormRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    //获取所有商品分类
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      this.CategoriesList = res.data.result;
      this.total = res.data.total;
    },
    //当页数改变时,触发这个方法
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCategoriesList();
    },
    //点击添加按钮显示添加对话框并查询父级列表
    async addCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      this.parentCateList = res.data;
      this.addCsteDialogVisible = !this.addCsteDialogVisible;
    },
    //当父级选项改变就触发
    handleChange() {
      // console.log(this.selectedCateList);
      if (this.selectedCateList.length === 0) {
        this.cateForm.cat_pid = 0;
        this.cateForm.cat_level = 0;
      } else {
        this.cateForm.cat_pid = this.selectedCateList[
          this.selectedCateList.length - 1
        ];
        this.cateForm.cat_level = this.selectedCateList.length;
      }
    },
    //当对话框关闭时
    resetForm() {
      //重置表单
      this.$refs.cateFormRef.resetFields();
      //重置父级列表选项
      this.selectedCateList = [];
      //重置父级ID
      this.cateForm.cat_pid = 0;
      //重置层级
      this.cateForm.cat_level = 0;
    },
    //添加分类
    addCate() {
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          "categories",
          this.cateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加分类失败!");
        // console.log(res);
        this.$message.success("添加分类成功!");
        this.getCategoriesList();
        this.addCsteDialogVisible = !this.addCsteDialogVisible;
      });
    },
    //删除
    async remove(id) {
      // console.log(id);
      const config = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(config);
      if (config !== "confirm") return this.$message("已取消删除!");
      const { data: res } = await this.$http.delete("categories/" + id);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除分类失败");
      this.$message.success("删除分类成功!");
      this.getCategoriesList();
    },
    //编辑回显
    async editor(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("categories/" + id);
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类对象失败");
      this.editorForm = res.data;
      this.editorDialogVisible = !this.editorDialogVisible;
    },
    //编辑分类
    addEditor() {
      this.$refs.editorFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.editorForm.cat_id}`,
          {
            cat_name: this.editorForm.cat_name
          }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("编辑分类失败!");
        this.$message.success("编辑分类成功!");
        this.getCategoriesList();
        this.editorDialogVisible = !this.editorDialogVisible;
      });
    }
  }
};
