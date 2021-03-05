<template>  <div>    <Breadcrumb :source="navData" icon="environment">      <a-button icon="search">后台开户</a-button>
    </Breadcrumb>
    <div class="to-review-wrapper">
      <div class="to-review-query">
        <a-form-model layout="inline" @submit="handleSubmit" @submit.native.prevent>
          <a-form-model-item>
            <a-input v-model="query.username" placeholder="请输入债务人名称" class="custom-prefix-5" :style="{width:'500px'}">
              <template slot="prefix" >
                <div class="query-item-prefix">债务人名称</div>
              </template>
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" html-type="submit">查询</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="to-review-content">
        <a-tabs @change="handleTabChange" v-model="query.tab">
          <a-tab-pane v-for="item in tabOption" :key="item.key" :tab="item.label"/>
        </a-tabs>
        <div class="content-action">
          <a-button icon="search">方案一键导出</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="middle" :pagination="pagination" @change="handleTableChange">
          <template slot="auction" slot-scope="text,row">
            <a-button type="link" size="small" icon="file-text" :style="{paddingLeft: 0}" @click="toDetail(row)">查看详情</a-button>
            <a-icon type="line" :style="{transform: 'rotate(90deg)',margin:'0 -5px'}"/>
            <a-button type="link" size="small" icon="form" >方案审批</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/bread-crumb';
import { clearProto, disabledDate } from "@/plugin/tools";

const columns1 = [
  {
    title: '债务人名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '债权本金（万元）',
    dataIndex: 'address',
    key: 'address 1',
  },
  {
    title: '债权利息（万元）',
    dataIndex: 'address',
    key: 'address 2',
  },
  {
    title: '担保方式',
    dataIndex: 'address',
    key: 'address 3',
  },
  {
    title: '方案提交人数',
    dataIndex: 'address',
    key: 'address 41',
  },
  {
    title: '提交完成日期',
    dataIndex: 'address',
    key: 'address 42',
  },
  {
    title: '有效方案数量',
    dataIndex: 'address',
    key: 'address 43',
  },
  {
    title: '操作',
    dataIndex: 'address',
    key: 'address 44',
    scopedSlots: { customRender: 'auction' },
  },
];

const tabOption = [
  { key:1,label:'报名中'},
  { key:2,label:'方案提交中'},
  { key:3,label:'方案提交完成'},
  { key:4,label:'招商失效'},
]

export default {
  name: 'ToReview',
  data() {
    return {
      navData:[
        {id:1,title:'招商管理',path:'/investment/list'},
        {id:2,title:'招商项目管理',path:''},
      ],
      tabOption,
      columns:columns1,
      dataSource:[{
        key:1,
        name:'临时用户',
        id:111,
      }],
      query:{
        username:"",
        tab:2,
      },
      pagination:{
        current:1,
        total:1,
        showQuickJumper:true,
        showLessItems:true,
        size:'middle',
        showTotal:val=>`共${val}条信息`,
      },
      disabledDate,
    };
  },
  components:{
    Breadcrumb,
  },
  created() {
  },
  methods:{
    handleSubmit(e){
      e.preventDefault();
      console.log(clearProto(this.query));
    },
    handleTabChange(val){
      console.log(val);
    },
    handleTableChange(ev){
      console.log(ev);
    },
    toDetail(row){
      this.$router.push('/investment/list/detail/' + row.id)
    }
  }
}
</script>

<style scoped>
.to-review-wrapper{
  padding: 16px;
}
.query-item-prefix{
  font-size: 14px;
}
.content-action{
  margin-bottom: 20px;
}
.content-action button{
  margin-right: 15px;
}
</style>
<style lang="scss">
.query-item-prefix{
  height: 100%;
  width: 80px;
  text-align:left;
  border-right: 1px solid #ddd;
}
.custom-prefix-5 input{
  padding-left: 100px!important;
}
</style>
