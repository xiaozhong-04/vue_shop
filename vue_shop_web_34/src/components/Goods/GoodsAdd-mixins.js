//导入全局的配置文件(根路径)
import config from "../../config.json";
//导入lodash
import _ from "lodash";
export default {
  data() {
    return {
      //默认激活的Tab标签
      activeName: "0",
      // 添加商品的表单对象
      addForm: {
        //商品名称
        goods_name: "",
        //商品所属分类  级联选中的ID存储在这
        goods_cat: [],
        //商品价格
        goods_price: "",
        //商品数量
        goods_number: "",
        //商品重量
        goods_weight: "",
        //商品介绍:
        goods_introduce: "",
        // 商品的图片
        pics: [],
        //商品的参数信息
        attrs: []
      },
      // 添加商品的校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },
      //获取分类列表 级联数据源
      cateList: [],
      //级联配置对象
      cascaderProp: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //分类动态参数
      manyTabData: [],
      //分类静态属性
      onlyTabData: [],
      //图片上传的URl地址
      uploadURL: config.baseURL + "upload",
      //上传图片的请求头
      headersObj: {
        Authorization: sessionStorage.getItem("token")
      },
      //控制预览图片对话框
      previewVisible: false,
      //预览图片的URl地址
      previewImgpath: ""
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 }
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败!");
      this.cateList = res.data;
    },
    //级联选项修改时触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 在离开Tab标签前触发
    beforeTableave(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName);
      if (oldActiveName === "0" && this.cateId === null) {
        this.$message.error("请先选择商品分类！");
        // 阻止页面切换
        return false;
      }
    },
    //Tab栏的点击事件
    async handleClick() {
      // console.log(this.activeName);
      if (this.activeName == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取分类动态参数失败!");
        //把字符串切割成数组
        res.data.forEach(itme => {
          //判断是否是空字符串
          itme.attr_vals = itme.attr_vals ? itme.attr_vals.split(" ") : [];
          // console.log(itme.attr_vals);
        });
        this.manyTabData = res.data;
      } else if (this.activeName === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取分类静态属性失败!");
        this.onlyTabData = res.data;
      }
    },
    //预览图片
    handlePreview(result) {
      console.log(result);
      this.previewImgpath = result.response.data.url;
      this.previewVisible = true;
    },
    //移除图片
    handleRemove(result) {
      // console.log(result);
      const picPath = result.response.data.tmp_path;
      const i = this.addForm.pics.findIndex(x => x.pic === picPath);
      // console.log(i);
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    //上传成功.触发该函数
    handSuccess(result) {
      // console.log(result);
      if (result.meta.status === 200) {
        const o = { pic: result.data.tmp_path };
        this.addForm.pics.push(o);
        // console.log(this.addForm);
      }
    },
    addGoods() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate(async valid => {
        //表单验证失败
        if (!valid) return this.$message.error("请完善表单数据后再添加");
        //处理和组织表单数据
        const form = _.cloneDeep(this.addForm);
        //处理goods_cat
        form.goods_cat = form.goods_cat.join(",");
        //处理动态参数
        // console.log(this.manyTabData);
        this.manyTabData.forEach(itme => {
          const newInfo = {
            attr_id: itme.attr_id,
            attr_value: itme.attr_vals.join(" ")
          };
          form.attrs.push(newInfo);
        });
        //处理静态属性
        // console.log(this.onlyTabData);
        this.onlyTabData.forEach(itme => {
          const newInfo = {
            attr_id: itme.attr_id,
            attr_value: itme.attr_vals
          };
          form.attrs.push(newInfo);
        });
        // console.log(form);
        const { data: res } = await this.$http.post("goods", form);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加商品成功!");
        this.$router.push("/goods/list");
      });
    }
  },
  //计算属性
  computed: {
    //级联选中的Id
    cateId: function() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
      }
      return null;
    }
  }
};
