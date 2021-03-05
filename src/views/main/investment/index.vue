<template>
  <div class="frame-wrapper">
    <Breadcrumb :source="navData" icon="environment">
      <template slot="suffix">
        <a-button @click="showModal" v-if="this.projectManage === 1">
          <a-icon type="snippets"/>发布新项目
        </a-button>
      </template>
    </Breadcrumb>
    <div class="content" >
      <!--收索框-->
      <a-row class="search_box" type="flex" >
        <a-col :span="11">
          <span>债务人名称：</span>
          <a-input  v-model="findAll.debtor" style="width: 80%"   placeholder="请输入债务人的名称" class="custom-prefix-6">
          </a-input>
        </a-col>
        <a-col :span="10">
          <div style="width: 586px;">
          <span>报名截止日期：</span>
          <a-date-picker
              v-model="field.startTime"
              placeholder="搜索范围起始日期"
              :disabled-date="val=>disabledDate(val,field.endTime,'start')"
          />
          <span style="margin: 0 6px">至</span>
          <a-date-picker
              v-model="field.endTime"
              placeholder="搜索范围截止日期"
              :disabled-date="val=>disabledDate(field.startTime,val)"
          />
          </div>
        </a-col>
        <a-col  style="text-align: right;margin-left: auto;" >
             <a-button class="reset-but" @click="reset" type="primary">重置</a-button>
             <a-button @click="inquire" type="primary">查询</a-button>
        </a-col>
      </a-row>
      <!--展示招商项目表格-->
        <a-table   @change="tableHanges" v-bind="tableSource" rowKey=id :columns="columns"  >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template slot="security" slot-scope="text,row">{{row.security|guarantyType}}</template>
          <template slot="debtCaptial" slot-scope="text,row">{{row.debtCaptial|amountTh}}</template>
          <template slot="debtInterest" slot-scope="text,row">{{row.debtInterest|amountTh}}</template>
          <template slot="deadline" slot-scope="text,row">{{row.deadline|show_}}</template>
          <template slot="action" slot-scope="text,row">
            <span class="table-view"  @click="viewDetails(row)">查看详情</span>
          </template>
        </a-table>
    </div>
    <!--弹框对话框文件上传-->
    <div>
      <a-modal :centered="true" v-model="visible"  title="发布新项目" @ok="handleOk">
        <template  slot="footer">
          <div style="text-align: center">
            <a-button @click="handleOk">取消</a-button>
            <a-button
                type="primary"
                :disabled="fileList.length === 0"
                :loading="uploading"
                style="margin-top: 16px"
                @click="handleUpload"
                class="uplode-files"
            >
              {{ uploading ? '正在上传' : '确定' }}
            </a-button>
          </div>
        </template>
        <div class="pop-up">
          <span style="margin-left: 18px">招商服务项目信息:</span>
         <div class="file-conent">
            <a-upload :showUploadList="false" v-if="showUploadList" :file-list="fileList" :before-upload="beforeUpload">
              <a-button> <a-icon type="upload" /> 点击上传 </a-button>
            </a-upload>
            <a style="margin:0 18px;display:block"  v-else>{{fileName}}&nbsp;<a-icon type="close" @click="offFil"></a-icon></a>
         </div>
          <a class="download" href="https://zsamc-public.zsamc.com/%E6%9C%8D%E5%8A%A1%E6%8B%9B%E5%95%86%E9%A1%B9%E7%9B%AE%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">导入模板下载</a>
        </div>
        <div class="caution">
          <span>*支持导入单笔及多笔招商服务项目；</span><br>
          <span>请保证招商服务项目信息满足模板要求；</span><br>
          <span>文件最大支持16M；</span><br>
          <span>支持拓展名.xls或.xlsx的文件</span>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/bread-crumb';
import { projectFind,upFiles} from "@/plugin/api/investment-center";
import { disabledDate,clearObject } from "@/plugin/tools";
import store from '@/plugin/store';
import reqest from 'axios';

const columns = (sortedInfo) =>{
  return  [
  {
    title: '债务人名称',
    dataIndex: 'debtor',
    key: 'name',
  },
  {
    title: '债权本金(万元)',
    dataIndex: 'debtCaptial',
    key: 'debtCaptial',
    align:'right',
    scopedSlots: {customRender: 'debtCaptial'},
  },
  {
    title: '债权利息(万元)',
    dataIndex: 'debtInterest',
    key: 'debtInterest',
    align:'right',
    scopedSlots: {customRender: 'debtInterest'},
  },
  {
    title: '担保方式',
    dataIndex: 'security',
    key: 'security',
    scopedSlots: {customRender: 'security'},
  },
  {
    title: '项目发布日期',
    dataIndex: 'gmtCreate',
    sorter: true,//排序
    sortOrder: sortedInfo.columnKey === 'gmtCreate' && sortedInfo.order
  },
  {
    title: '报名截止日期',
    dataIndex: 'deadline',
    sorter: true,//排序
    scopedSlots: {customRender: 'deadline'},
    sortOrder: sortedInfo.columnKey === 'deadline' && sortedInfo.order
  },
  {
    title: '当前报名人数',
    dataIndex: 'numsSignIn',
  },
  {
    title: '当前方案提交人数',
    dataIndex: 'numsSubmit',
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
]
};
const navData = [
  {id: 1, title: "招商管理", path: "/investment/list"},
  {id: 2, title: "招商项目管理", path: "/investment/list"},
];
export default {
  name: "Investment",
  data() {
    return {
      fileList: [],
      uploading: false,//点击上传
      upFiles,
      navData,
      disabledDate,
      visible: false,
      showUploadList:true,
      fileName:'',
      tableSource:{
        class:'frame-content-table',
        dataSource:[],
        pagination: {
          total: 0,
          current:1,
          showQuickJumper: true,
          showTotal:(val)=>`共${val}条`
        },
      },
      sortedInfo:null,
      headers: {
        authorization: 'authorization-text',
        token: window.localStorage.token,
      },
      findAll:{
        caseType: "",
        debtor: "",
        endDate: "",
        id: "",
        page: 1,
        size: 10,
        sortField: "gmtCreate",
        sortOrder: "DESC",
        startDate: ""
      },
      field:{
        startTime:'',
        endTime:'',
      },
      projectManage:"",//权限管理
    };
  },
  components: {
    Breadcrumb
  },
  computed:{
    columns(){
      let {sortedInfo} = this;
      sortedInfo = sortedInfo || {};
      return columns(sortedInfo)
    }
  },
  created() {
    const {config} = store.getters.getInfo;
    this.projectManage = config.projectManage;
    this.requestInquire()
  },
  watch:{
    'field':{
      handler:function({startTime,endTime}){
        this.findAll.startDate = startTime ? startTime.format('YYYY-MM-DD') : '';
        this.findAll.endDate = endTime ? endTime.format('YYYY-MM-DD') : '';
      },
      deep:true
    }
  },
  filters:{
    //没有值展示'-'
    show_(val){
      if(!val)return '-';
      return val;
    }
  },
  methods: {
    offFil(){
      this.showUploadList = true;
      this.fileList = []
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      const isLimit16M = file.size / 1024 / 1024 <= 16;
      const isSheet  = /\.(xlsx|xls)$/.test(file.name);
      if(!isLimit16M) this.$message.error("文件大小不能超过16M,请重新上传");
      if(!isSheet) this.$message.error("请上传.xls/.xlsx文件");
      if(isSheet && isLimit16M){
        this.showUploadList = false;
        this.fileName = file.name;
      }else {
        this.fileList = []
      }
      return isSheet && isLimit16M;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {formData.append('file', file);
      });
      this.uploading = true;
	    reqest({
        url: this.upFiles,
        method: 'post',
        headers:this.headers,
        processData: false,
        data: formData,
      }).then((val)=>{
          const res =  val.data;
          this.fileList = [];
          this.uploading = false;
          if(res.code ===  60001) return this.$message.error(res.message,5);
          if(res.code === 20000){
              this.visible = false;
              this.$message.success('上传成功');
              this.requestInquire();
          }
      })
    },
    // 请求封装
    requestInquire(){
      projectFind(clearObject(this.findAll)).then((res)=>{
        if(res.code !== 20000 ) return this.$message.error('请求失败');
        this.tableSource.dataSource = res.data.list;
        this.tableSource.pagination.total = res.data.total;
      })
    },
    inquire(){
      this.sortedInfo = null;
      this.findAll.page = 1;
      this.tableSource.pagination.current = 1;
      this.requestInquire()
    },
    reset(){
      this.findAll.page = 1;
      this.tableSource.pagination.current = 1;
      this.findAll.debtor = "";
      this.findAll.endDate = this.field.endTime = '';
      this.findAll.startDate = this.field.startTime = '';
      this.sortedInfo = null;
      this.findAll.sortField = "";
      this.findAll.sortOrder = '';
      this.requestInquire()
    },
    tableHanges(pagination, filters, sorter,) {
      //排序
      this.findAll.sortField = sorter.order ? sorter.field : "";
      this.sortedInfo = sorter;
      this.findAll.sortOrder = sorter.order ? sorter.order === "ascend" ? "ASC" : "DESC" : "";
      this.findAll.page = pagination.current;
      this.tableSource.pagination.current = pagination.current;
      this.findAll.size = pagination.pageSize;
      this.requestInquire()
    },
    viewDetails(v) {
      this.$router.push({name: 'investment/item-detail', query: {id: v.id}})
    },
    showModal() {
      this.visible = true;
      this.showUploadList = true;
      this.fileList = []
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  }
};
</script>

<style lang="scss" scoped>
.frame-wrapper{
  padding: 16px;
}
.upProject {
  width: 120px;
  height: 30px;
  background-color: #fff;
  border: #999999 1px solid;
  border-radius: 6px;
}
.search_box {
  margin: 20px 0;
}
.content {
  padding: 0px 20px 20px 20px;
  background-color: #fff;
}
.pop-up {
  display: flex;
  align-items: center;
  button {
    margin: 0 20px;
  }
  .download{
    text-decoration:underline;
  }
}
.caution {
  width: 260px;
  margin-top: 12px;
  margin-left: 60%;
  transform: translateX(-50%);
  color: #999999;
}
.table-view{
  color: #0A91B4;
  cursor:pointer;
}
.reset-but{
  margin-right: 16px;
  background-color: #fff;
  color: #666666;
  border: 1px solid #dddddd;
}
.file-conent{
  width: 160px;
}
</style>
