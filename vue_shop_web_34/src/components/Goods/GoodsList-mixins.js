export default {
  data() {
    return {
      //查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //商品列表数据
      goodsList: [],
      //总共多少条数据
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败!");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    //分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
    },
    // 删除
    async remove(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(confirm);
      if (confirm != "confirm") return this.$message("已取消删除");
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除商品失败!");
      if (this.goodsList.length == 1 && this.queryInfo.pagenum > 1) {
        this.queryInfo.pagenum--;
      }
      this.$message.success("删除商品成功!");
      this.getGoodsList();
    },
    goAddPage() {
      // console.log(this);
      this.$router.push("/goods/add");
    }
  }
};
