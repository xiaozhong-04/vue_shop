export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      wlInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表数据失败！");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    async showLogistics() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error("获取物流信息失败！");
      this.wlInfo = res.data;
      this.dialogVisible = true;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    }
  }
};
