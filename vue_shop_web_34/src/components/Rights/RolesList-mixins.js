export default {
  data() {
    return {
      //角色列表数据
      rolesList: [],
      //控制添加角色显示隐藏
      addRolesVisible: false,
      //添加角色数据
      addRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      //添加角色校验
      rolesFormRules: {
        roleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      //控制编辑的显示和隐藏
      editorDialogVisible: false,
      //编辑的数据
      editorForm: {
        roleName: "",
        roleDesc: ""
      },
      //编辑的校验规则
      editorFormRules: {
        roleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      //控制分配权限的显示和隐藏
      assignDialogVisible: false,
      //所有角色的权限
      permissionsList: [],
      //
      defaultProps: {
        label: "authName",
        children: "children"
      },
      //默认清空下,该用户的三级权限
      dataRolesKeys: "",
      //即将要分配角色权限的id
      rolesId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表数据失败");
      this.rolesList = res.data;
    },
    //清除添加角色校验
    resetCheck() {
      this.$refs.addRolesForm.resetFields();
    },
    //添加角色
    addRoles() {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.getRolesList();
        this.addRolesVisible = !this.addRolesVisible;
      });
    },
    //删除角色
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
      const { data: res } = await this.$http.delete("roles/" + id);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除该角色失败");
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
    //编辑回显
    async editor(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("查询角色信息失败");
      this.editorForm = res.data;
      this.editorDialogVisible = !this.editorDialogVisible;
    },
    //编辑提交
    editorAdd() {
      this.$refs.editorForm.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          "roles/" + this.editorForm.roleId,
          {
            roleName: this.editorForm.roleName,
            roleDesc: this.editorForm.roleDesc
          }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("编辑角色信息失败");
        this.$message.success("辑角色信息成功!");
        this.editorDialogVisible = !this.editorDialogVisible;
        this.getRolesList();
      });
    },
    //删除角色权限
    async removeRight(role, rightId) {
      const confirm = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirm !== "confirm") return this.$message("已取消删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("删除角色权限失败!");
      //把新的权限给该角色
      role.children = res.data;
    },
    //分配权限
    async AssignPermissions(roles) {
      //预先把角色id存储到data上
      this.rolesId = roles.id;
      const { data: res } = await this.$http.get("rights/tree");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取所有权限失败");
      this.permissionsList = res.data;
      //定义一个数组
      const Keys = [];
      this.getLeafId(roles, Keys);
      // console.log(Keys);
      this.dataRolesKeys = Keys;
      this.assignDialogVisible = !this.assignDialogVisible;
    },
    // 通过递归获取该用户所有的三级权限
    getLeafId(node, keyArr) {
      if (!node.children) {
        return keyArr.push(node.id);
      }
      node.children.forEach(itme => this.getLeafId(itme, keyArr));
    },
    //重新为该角色分配权限
    async redistribution() {
      //全选权限的id
      const k1 = this.$refs.tree.getCheckedKeys();
      //半选权限的id
      const k2 = this.$refs.tree.getHalfCheckedKeys();
      //拼接权限id为字符串
      const idStr = [...k1, ...k2].join(",");
      // console.log(idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.rolesId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败!");
      this.$message.success("分配权限成功!");
      this.getRolesList();
      this.assignDialogVisible = !this.assignDialogVisible;
    }
  }
};
