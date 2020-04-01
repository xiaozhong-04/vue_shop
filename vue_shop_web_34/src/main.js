import Vue from "vue";
import App from "./App.vue";
import router from "./router";
//导入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
//导入树形表格组件
import treeTbale from "vue-table-with-tree-grid";
Vue.component("tree-table", treeTbale);

//导入全局的配置文件(根路径)
import config from "./config.json";

//导入富文本框
import VueQuillEditor from "vue-quill-editor";
//配置富文本框
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//安装富文本框
Vue.use(VueQuillEditor);

// 时间过滤器
Vue.filter("dateFormat", originVal => {
  const dt = new Date(originVal);
  //年月日 时分秒
  const YY = dt
    .getFullYear()
    .toString()
    .padStart(2, "0");
  const MM = (dt.getMonth() + 1).toString().padStart(2, "0");
  const DD = dt
    .getDate()
    .toString()
    .padStart(2, "0");
  const hh = dt
    .getHours()
    .toString()
    .padStart(2, "0");
  const mm = dt
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const ss = dt
    .getSeconds()
    .toString()
    .padStart(2, "0");
  return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
});

//导入axios
import axios from "axios";
//设置请求头
axios.defaults.baseURL = config.baseURL;
//全局配置axios 的 request 拦截器
axios.interceptors.request.use(config => {
  //通过拦截request请求,主动为 请求头,追加新属性Authorization等于token
  // console.log(config.headers);
  config.headers.Authorization = sessionStorage.getItem("token");
  return config;
});
//挂载axios到Vue原型
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

//导入小图标样式
import "./assets/font_1191071_2xgwb2ncmjo/iconfont.css";

//导入基础样式
import "./assets/css/base.css";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
