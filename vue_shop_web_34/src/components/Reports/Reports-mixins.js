//按需导入echarts
import echarts from "echarts/lib/echarts";
//按需导入echarts样式  折线图的基本构造
import "echarts/lib/chart/line";
//鼠标跟随效果
import "echarts/lib/component/tooltip";
//显示 标题 用户来源
import "echarts/lib/component/title";
//头部的 图例
import "echarts/lib/component/legendScroll";
//导入lodash
import _ from "lodash";

export default {
  data() {
    return {};
  },
  //此时,页面元素已经渲染完成
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);

    const { data: res } = await this.$http.get("reports/type/1");

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "用户来源"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#E9EEF3"
          }
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ]
    };

    //合并数据对象
    const result = _.merge(res.data, option);

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
};
