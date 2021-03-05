<template>
  <div class="workbench-wrapper">
    <div class="workbench-item workbench-left">
      <div class="item-wrapper item-border">
        <div class="item-title item-format ">服务商注册情况</div>
        <div class="item-content item-format">
          <div class="number">
            <span class="total">累计注册服务商 <u style="color:#333333">{{echarts.totalRegUserNum}}名</u></span>
            <span class="total">昨日新增注册 <u style="color:#333333">{{echarts.lastDayRegUserNum}}名</u></span>
          </div>
          <div class="data-display">
            <!-- 饼图显示 -->
            <div class="chart">
              <div id="main"></div>
            </div>
            <div class="schemeProcess">
              <a-badge text="仅注册" color="#0EA5FF"/>
              <span style="margin-left: 75px">{{echarts.onlyRegUserNum}}</span>
              <br />
              <a-badge text="仅提交资质" color="#9200FF"/>
              <span style="margin-left: 48px">{{echarts.confirmQuaUserNum}}</span>
              <br />
              <a-badge text="待审核" color="#67CE57" />
              <span style="margin-left: 75px">{{echarts.submitEleUserNum}}</span>
              <br />
              <a-badge text="已入库" color="#F7CE22"/>
              <span style="margin-left: 75px">{{echarts.storageUserNum}}</span>
              <br />
              <a-badge text="审核未通过" color="#FF5F80"/>
              <span style="margin-left: 48px">{{echarts.notPassAuditUserNum}}</span>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item-title item-format ">待办事项</div>
        <div class="progress">
          <img src="../../../assets/img/toDoList.png" alt="待办事项">
        </div>
      </div>
    </div>
    <div class="workbench-item workbench-right">
      <div class="item-wrapper">
        <div class="item-title item-format ">我的日程</div>
        <div class="unItem">
          <a-calendar/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { getEchartsInvestMent } from "@/plugin/api/echarts";
import echarts from "echarts";
export default {
  name: "Workbench",
  nameComment: "工作台",
  data() {
    return {
      // 后台图表的数据
      echarts: {},
    };
  },
  methods: {
    //echarts饼图项目招商
    initECharts () {
      let myChart = echarts.init(document.getElementById("main"));
      getEchartsInvestMent().then((res)=>{
        if(res.code === 20000){
          this.echarts = res.data;
          return res.data;
        }else {
          this.$message.error('获取图表数据失败');
        }
      }).then((data={})=>{
        const { onlyRegUserNum,confirmQuaUserNum,submitEleUserNum,storageUserNum,notPassAuditUserNum }=data;
        let option = {
          color: ['#0EA5FF', '#9200FF','#67CE57','#F7CE22','#FF5F80'],
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: onlyRegUserNum, name: '仅注册'},
                { value: confirmQuaUserNum, name: '仅提交资质'},
                { value: submitEleUserNum, name:'待审核'},
                { value: storageUserNum, name: '已入库'},
                { value: notPassAuditUserNum, name: '审核未通过'}
              ]
            }
          ]
        };
        myChart.setOption(option,true);
      });
    },
  },
  mounted() {
    this.initECharts()
  },
}
</script>

<style scoped lang="scss">
$leftWidth: 550px;
.workbench-wrapper {
  height: 100%;
  padding: 16px;
  a {
      text-decoration: none!important;
      color: #0A91B4!important;
    }
  .workbench {
    &-item {
      height: 100%;
      background-color: #ffffff;
    }
    &-left {
      float: left;
      width: $leftWidth;
      border-right: 10px solid $background-base;
    }
    &-right {
      margin-left: $leftWidth;
    }
  }
  .item {
    &-format {
      padding: 10px;
      font-size: 14px;
      line-height: 1;
      border-bottom: 1px solid #E9E9E9;
    }
    &-border {
      border-bottom: 10px solid $background-base;
    }
    &-title {
      padding: 20px 24px;
      border-bottom: 1px solid #E9E9E9;
      line-height: 1.5;
      font-size: 18px;
      font-weight: 600;
      color: #262626;
    }
    &-project {
      padding: 20px 24px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 16px;
    }
    &-content {
      min-height: 280px;
    }
    &-thing {
      min-height: 432px;
    }

  }
    .data-display {
      display: flex;
      justify-content: flex-start;
      // align-items: center;
      width: 100%;
      height: 262px;
      margin-top: 20px;
      .ant-badge {
        margin: 10px 10px;
      }
    }
    .chart {
      position: relative;
      width: 250px;
      height: 250px;
      border-radius: 50%;
    }
    .schemeProcess {
      width: 40%;
      margin: 0 10px;
      span {
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      /deep/.ant-badge-status-dot {
        width: 10px!important;
        height: 10px!important;
      }
    }
    .total {
      font-size: 16px;
      padding: 0 20px;
      margin-left: 10px;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
      letter-spacing: 0.5px;
    }
  }
  .number {
    margin-top: 24px;
  }
  span {
    font-weight: 400;
    font-size: 16px;
    padding: 3px 0;
  }
  u {
    text-decoration: none;
    font-weight: 600;
    font-size: 20px;
  }
  .progress {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    img {
			// vertical-align: middle;
     width: 200px;
     height: 200px;
    }
  }
  .unItem {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 800px;
    img {
     width: 200px;
     height: 200px;
    }
  }
  #main{
    position: absolute;
    top: -28px;
    left: 10px;
    width: 250px;
    height: 250px;
  }
  /deep/.ant-btn {
    padding: unset;
    height: 20px;
    line-height: 20px;
  }
</style>
