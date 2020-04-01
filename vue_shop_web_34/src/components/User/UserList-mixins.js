export default {
  data() {
    //自定义电话校验规则
    const addMobileRules = (rule, value, callback) => {
      if (
        /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
          value
        )
      ) {
        callback();
      } else {
        callback(new Error("电话格式错误!!!"));
      }
    };
    return {
      // 用户列表
      userlist: [],
      // 查询参数对象
      queryInfo: {
        //搜索条件
        query: "",
        //当前第几页的数据
        pagenum: 1,
        //每页显示多少数据
        pagesize: 2
      },
      // 总共多少条数据
      total: 0,
      // 控制添加用户显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户的校验规则
      addFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: ["blur"] }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: addMobileRules, trigger: "blur" }
        ]
      },
      // 控制修改的显示和隐藏
      showModifyThe: false,
      // 修改的数据
      modifyForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 修改的校验规则
      modifyRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: ["blur"] }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: addMobileRules, trigger: "blur" }
        ]
      },
      //控制修改角色的显示和隐藏
      editRoleVisible: false,
      //需要修改角色的数据
      editInfo: {},
      //所有的角色有那些
      rolesList: [],
      //被选中的角色ID
      selectedRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //当pagesize值改变时,触发这个方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //当页数改变时,触发这个方法
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //修改状态开关的
    async stateChange(id, state, user) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("修改用户状态失败");
      }
    },
    //重置添加用户表单
    resetForm() {
      this.$refs.addFormRef.resetFields();
    },
    //添加用户
    addUser() {
      // 判断校验是否正确
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201)
          return this.$message.error("添加用户失败!!!");
        this.$message.success("添加用户成功");
        this.addDialogVisible = !this.addDialogVisible;
        this.getUserList();
      });
    },
    //删除用户
    async remove(id) {
      const comfix = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(comfix);
      if (comfix !== "confirm") return this.$message("已取消删除");
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      // 此时，只是把当前页面上，唯一的一条数据，从数据库中删除了，但是，userList 的长度还为 1
      if (this.userlist.length === 1 && this.queryInfo.pagenum > 1) {
        this.queryInfo.pagenum--;
      }
      this.getUserList();
    },
    //修改回显
    async modifyThe(id) {
      this.showModifyThe = !this.showModifyThe;
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败");
      this.modifyForm = res.data;
    },
    //清除修改的校验
    resetModify() {
      this.$refs.modifyForm.resetFields();
    },
    //修改提交
    saveUserInfo() {
      this.$refs.modifyForm.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          "users/" + this.modifyForm.id,
          {
            email: this.modifyForm.email,
            mobile: this.modifyForm.mobile
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("编辑用户失败");
        this.$message.success("编辑用户成功");
        this.showModifyThe = !this.showModifyThe;
        this.getUserList();
      });
    },
    //修改角色回显
    async editRole(userInfo) {
      this.editRoleVisible = !this.editRoleVisible;
      this.editInfo = userInfo;
      //获取角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败!");
      // console.log(res);
      this.rolesList = res.data;
    },
    // 修改角色提交
    async saveRoleInfo() {
      if (!this.selectedRoleId)
        return this.$message.warning("请选择分配的新角色!");
      const { data: res } = await this.$http.put(
        "users/" + this.editInfo.id + "/role",
        { rid: this.selectedRoleId }
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("分配角色失败!");
      // console.log(res);
      this.$message.success("分配角色成功");
      this.getUserList();
      this.editRoleVisible = !this.editRoleVisible;
    }
  }
};
