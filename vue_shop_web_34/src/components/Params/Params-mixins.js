export default {
  data() {
    return {
      //所有商品分类的列表,默认为空
      cateList: [],
      //级联选择所有选中的存储ID数组
      selectedCataList: [],
      //指定 分类级联选择框中的配置选项
      cascaderProp: {
        expandTrigger: true,
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //设置 Tab栏中,默认选中的 页签
      activeName: "many",
      //动态参数数据
      manyTabData: [],
      // 静态属性数据
      onlyTabData: [],
      // 控制添加框
      addDialogVisible: false,
      //添加数据
      addCateForm: {
        attr_name: ""
      },
      //添加参数校验
      addCateFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur"
        }
      },
      //修改框
      editDialogVisible: false,
      //修改数据
      editForm: {
        attr_name: ""
      },
      //修改校验
      editFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur"
        }
      },
      //控制文本输入框和按钮的显示和隐藏
      inputVisible: false,
      //文本输入框的值
      inputValue: ""
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 }
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败!");
      this.cateList = res.data;
    },
    //当级联选择的内容发生改变时 触发change事件
    handleChange() {
      // console.log(this.selectedCataList);
      //判断级联选中是不是三级分类
      if (this.selectedCataList.length !== 3) {
        //如果选中不是三级分类,就强行清空
        this.selectedCataList = [];
        this.manyTabData = [];
        this.onlyTabData = [];
      } else {
        this.getParamsList();
      }
    },
    // 根据 选中的商品类型,和商品参数,获取表格数据
    async getParamsList() {
      //选中了三级分类
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) return this.$message.error("获取数据失败!");
      //把res.data数组中,每一个参数项的attr_vals属性,使用空格 分割成 数组
      res.data.forEach(itme => {
        itme.attr_vals = itme.attr_vals ? itme.attr_vals.split(" ") : [];
      });
      // console.log(res);
      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    //标签页改变时
    handleClick() {
      if (!this.cateId) return;
      this.getParamsList();
    },
    //重置
    addResetting() {
      this.$refs.addCateFormRef.resetFields();
    },
    //添加
    addParams() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addCateForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败!");
        // console.log(res);
        this.$message.success("添加成功!");
        this.getParamsList();
        this.addDialogVisible = !this.addDialogVisible;
      });
    },
    //删除
    async remove(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(confirm);
      if (confirm !== "confirm") return this.$message("已取消删除");
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getParamsList();
    },
    //修改回显
    async editParams(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取失败!");
      this.editForm = res.data;
      this.editDialogVisible = !this.editDialogVisible;
    },
    //修改重置
    editResetting() {
      this.$refs.editFormRef.resetFields();
    },
    //编辑保存
    editAddParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("编辑失败!");
        this.$message.success("编辑成功!");
        this.getParamsList();
        this.editDialogVisible = !this.editDialogVisible;
      });
    },
    //点击按钮显示文本输入框
    showInput() {
      this.inputVisible = !this.inputVisible;
      this.$nextTick(_ => {
        _;
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //失去焦点和按enter触发该事件
    async handleInputConfirm(row) {
      // 判断文本输入框是不是空
      if (this.inputValue.trim().length === 0) {
        this.inputValue = "";
        this.inputVisible = false;
        return;
      }
      // console.log("ok");
      row.attr_vals.push(this.inputValue.trim());
      this.inputValue = "";
      this.inputVisible = false;

      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("更新参数失败！");
    },
    //删除参数
    async handleClose(row, i) {
      row.attr_vals.splice(i, 1);
      // console.log(row.attr_vals);
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("更新参数失败！");
    }
  },
  computed: {
    isDisabled: function() {
      if (this.selectedCataList.length === 3) return false;
      return true;
    },
    cateId: function() {
      if (this.selectedCataList.length === 3) return this.selectedCataList[2];
      return null;
    }
  }
};
