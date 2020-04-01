export default {
  data() {
    return {
      //左侧菜单列表的数据
      menuList: [],
      //小图标
      iocnList: [
        "icon-users",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ],
      //控制左边菜单是否折叠
      collapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //点击退出
    exit() {
      sessionStorage.removeItem("token");
      this.$router.push("login");
      this.$message.success("退出成功");
    },
    //获取左侧菜单列表
    async getMenuList() {
      //
      let { data: res } = await this.$http.get("menus");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取左侧菜单失败!");
      this.menuList = res.data;
    }
  }
};
