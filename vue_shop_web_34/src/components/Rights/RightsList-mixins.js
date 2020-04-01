export default {
  data() {
    return {
      //权限列表数据
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightsList = res.data;
    }
  }
};
