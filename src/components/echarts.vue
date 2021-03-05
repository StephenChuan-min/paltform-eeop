<template>
  <a-spin :spinning="loading" :style="chartStyle">
    <div :id="chartId" :style="chartStyle" />
  </a-spin>
</template>

<script>
import {ranStr} from "@/plugin/tools";

const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title');

export default {
  name: 'ECharts',
  nameComment: 'echarts图例',
  data() {
    return {
      chartId:'',
      chartStyle:{
        height: '200px',
        width:'100%'
      },
      myChart:null,
    };
  },
  props:{
    option:Object,
    styles:Object,
    loading:{
      type:Boolean,
      default:true,
    },
    addListener:{
      type:Boolean,
      default:false,
    },
  },
  created() {
    this.chartId = ranStr(8);
  },
  mounted(){
    if(!this.loading){
      this.drawInit();
      this.drawLine();
    }
  },
  methods: {
    drawInit(){
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById(this.chartId))
    },
    drawLine(){
      // 绘制图表
      this.myChart.setOption({
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
      if(this.addListener && this.myChart){
        setTimeout( ()=>{
          const _this = this;
          window.onresize = function () { _this.myChart.resize(); }
        },200)
      }
    }
  },
  watch:{
    loading:(oldVal,newVal)=>{
      if(oldVal !== newVal){
        if(!this.myChart) this.drawInit();
        newVal ? this.myChart.clear() : this.drawLine();
      }
    },
  },
  beforeDestroy() {
    this.myChart = null;
  }
}
</script>

<style scoped lang='scss'>

</style>
