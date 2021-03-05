<template>
  <div class="investment-detail-block">
    <Breadcrumb :source="navData" icon="environment" />
    <div class="detail-wrapper">
      <h2 class="title1">基本信息</h2>
      <div class="detail-conten">
        <!-- 债权基本信息-->
        <div>
          <h3 class="title2">债权基本信息</h3>
          <a-row type="flex">
            <a-col :span="8">
              资产包所属机构：<span>{{ detailInfo.capitalOrg  |show_}}</span>
            </a-col>
            <a-col :span="8">
              资产包收益权所属机构：<span>{{detailInfo.capitalProfitOrg |show_}}</span>
            </a-col>
            <a-col :span="8">
              当前诉讼状态：<span>{{ detailInfo.isLawsuit|isLawsuitType }}</span>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="8">
              资产包名称：<span>{{ detailInfo.assetPackage |show_}}</span>
            </a-col>
            <a-col :span="8">
              资产包收购时间：<span>{{ detailInfo.capitalPurchaseTime|show_ }}</span>
            </a-col>
            <a-col :span="8">
              担保方式：<span>{{ detailInfo.security|guarantyType}}</span>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="8">
              债务人名称：<span>{{ detailInfo.debtor |show_}}</span>
            </a-col>
            <a-col :span="8"> 保证人：<span>{{detailInfo.amcProjectGuarantors|guarantorsList}}</span> </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="8">
              债权本金：<span>{{ detailInfo.debtCaptial|amountTh }}万元</span>
            </a-col>
            <a-col :span="8">
              债权利息：<span>{{ detailInfo.debtInterest|amountTh }}万元</span>
            </a-col>
          </a-row>
          <div class="guarantee">
            <span style="color:#666666">抵质押物清单：{{detailInfo.amcProjectCollaterals == "" ? '-' : ''}}</span>
            <div>
              <p style="margin:0" v-for="(i, index) in detailInfo.amcProjectCollaterals" :key="index">
                {{index+1}}. {{i.collateralType|collateralType}}、{{i|arease}}、{{i.collateralName}}
              </p>
            </div>
          </div>
          <a-row type="flex">
            <a-col :span="8">
              所属业务团队：<span>{{ detailInfo.businessTeam |show_}}</span>
            </a-col>
            <a-col :span="8">
              项目经理：<span>{{ detailInfo.projectManager |show_}}</span>
            </a-col>
            <a-col :span="8">
              联系方式：<span>{{ detailInfo.contact|show_ }}</span>
            </a-col>
          </a-row>
        </div>
        <!--项目招商信息-->
        <div>
          <h3  class="title2">项目招商信息 <a-icon v-if="projectManage === 1" @click="showModal" type="form" /></h3>
          <a-row type="flex">
            <a-col :span="8">
              报名截止日期：<span>{{ detailInfo.deadline|show_ }}</span>
            </a-col>
            <a-col :span="8">
              方案提交截止日期：<span>{{ detailInfo.submitDeadline|show_ }}</span>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="8">
              期限上限：<span>{{ detailInfo.targetYearUpperLimit|show_ }}个月</span>
            </a-col>
            <a-col :span="8">
              目标回款金额下限：<span>{{
                detailInfo.targetAmountLowerLimit|amountTh
              }}万元</span>
            </a-col>
          </a-row>
        </div>
        <!--债权清收情况 -->
        <div>
          <h3 class="title2">债权清收情况</h3>
          <a-row type="flex">
            <a-col :span="8">
              是否有代理律师：<span>{{ detailInfo.isHaveProxyLawyer|whether }}</span>
            </a-col>
            <a-col :span="8">
              代理律师联系方式：<span>{{ detailInfo.proxyLawyerContact|show_ }}</span>
            </a-col>
            <a-col :span="8">
              代理截止日期：<span>{{ detailInfo.proxyLimit|show_ }}</span>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="8">
              代理律师姓名：<span>{{ detailInfo.proxyLawyerName|show_ }}</span>
            </a-col>
          </a-row>
          <div class="creditor-condition">
            已清收情况：<span>{{ detailInfo.alreadyCollectionStatus|show_ }}</span>
          </div>
          <div class="creditor-condition">
            司法进展情况：<span>{{ detailInfo.judicialProcess |show_}}</span>
          </div>
          <div class="creditor-condition">
            财产线索情况：<span>{{ detailInfo.propertyClue |show_}}</span>
          </div>
          <div class="creditor-condition">
            处置简述：<span>{{ detailInfo.disposeDescription |show_}}</span>
          </div>
          <a-row type="flex">
            <a-col :span="8">
              业务部门计划清收目标：<span>{{detailInfo.businessDepartmentTarget |show_}} 万元</span>
            </a-col>
            <a-col :span="8">
              业务部门计划清收时间：<span>{{detailInfo.businessDepartmentRecoveryTime |show_}} 年</span>
            </a-col>
          </a-row>
          <div class="creditor-condition">
            处置难点：<span>{{ detailInfo.disposeDifficulty |show_}}</span>
          </div>
          <div class="creditor-condition">
            债务人现状：<span>{{ detailInfo.debtorStatus |show_}}</span>
          </div>
          <div class="creditor-condition">
            保证人现状：<span>{{ detailInfo.guarantorStatus|show_ }}</span>
          </div>
          <div class="creditor-condition">
            抵质押人现状：<span>{{ detailInfo.mortgagorStatus |show_}}</span>
          </div>
        </div>
        <!--报名服务商列表-->
        <div>
          <h3 class="title-table">报名服务商列表 {{tableSource.applyServeTable.pagination.total}}</h3>
          <div class="table-block">
            <a-table v-bind="tableSource.applyServeTable" @change="applyServeTableChange" rowKey=id >
              <template slot="name" slot-scope="name,row">
                <a  @click="goAvatar(row.id)">{{ name|show_ }}</a>
              </template>
              <template slot="phone" slot-scope="phone">{{ phone|show_ }}</template>
              <template slot="identity" slot-scope="identity">{{identity|identityType}}</template>
              <template slot="orgOfficeName" slot-scope="orgOfficeName,row">
                <a v-if="orgOfficeName"  @click="goAvatar(row.id)">{{orgOfficeName}}</a>
                <div v-else>-</div>
              </template>
              <template slot="workingTime" slot-scope="workingTime">{{workingTime|workingTimeText}}</template>
             <template slot="areasOfGoodCases" slot-scope="areasOfGoodCases">{{areaAnalysis(areasOfGoodCases,false)|areas|fill}}</template>
              //擅长业务类型
              <template slot="goodCases"   slot-scope="text,row">
                <span v-if="row.identity === 1">
                  {{row.goodCases|attorneyBes}}
                </span>
                <span v-else>{{row.goodCases|goodCasesType}}</span>
              </template>
              <template slot="applyDate" slot-scope="applyDate">{{applyDate|show_}}</template>
              <template slot="gmtModify" slot-scope="gmtModify">{{gmtModify|show_}}</template>
              <template slot="caseFileStatus" slot-scope="caseFileStatus">
                <div :style="{color:caseFileStatus===1?'#008CB0':''}">{{caseFileStatus|caseFileText}}</div>
              </template>
            </a-table>
          </div>
        </div>
        <!--服务商提交方案列表-->
        <div>
          <h3 class="title-table">服务商提交方案列表 {{planCount.validCount+planCount.invalidCount}}</h3>
          <a-radio-group @change="changType" v-model="params.caseType" style="margin-bottom: 16px">
            <a-radio-button :value="1"> 有效方案 {{planCount.validCount}}</a-radio-button>
            <a-radio-button :value="2"> 末通过系统筛选 {{planCount.invalidCount}}</a-radio-button>
          </a-radio-group>
          <div class="table-block">
            <a-table  v-bind="tableSource.submitPlanTable" @change="submitPlanTableChange" :columns="columns2" rowKey=id>
              <template slot="gmtCreate" slot-scope="gmtCreate">{{gmtCreate|show_}}</template>
              <template slot="name" slot-scope="name,row">
                <a  @click="goAvatar(row.id)">{{ name }}</a>
              </template>
              <template slot="phone" slot-scope="phone">{{phone|show_}}</template>
              <template slot="identity" slot-scope="identity">{{identity|identityType}}</template>
              <template slot="orgOfficeName" slot-scope="orgOfficeName,row">
                <a v-if="orgOfficeName" type="link" @click="goAvatar(row.id)">{{orgOfficeName}}</a>
                <div v-else>-</div>
              </template>
              <template slot="serviceTime" slot-scope="serviceTime,row">
                <div>{{serviceTime|show_}}个月</div>
                <div v-if="row.serviceTimeInvalid===1" class="tag">未达标</div>
              </template>
              <template slot="aimBackPrice" slot-scope="aimBackPrice,row">
                <div>{{aimBackPrice|amountTh}}</div>
                <div v-if="row.aimBackPriceInvalid===1" class="tag">未达标</div>
              </template>
              <template slot="scheduleManagements" slot-scope="scheduleManagements,row">
                <div :class="exhibit === row.id ? 'plans' : 'plan'" >
                    <p v-for="(item,index) in scheduleManagements" :key="index">{{item.dateMonth}}个月内完成{{item.dateMatters}}</p>
                </div>
                <a style="color: #008CB0; margin-left: 60%" @click="bit(row)" v-if="scheduleManagements.length >= 4" >{{exhibit === row.id ? '收起' :'展开'}}</a>
              </template>
              <template slot="caseFileAddress" slot-scope="caseFileAddress">
                <FileList :file-list="JSON.stringify([caseFileAddress])"></FileList>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <div>
    <!-- 修改项目招商信息弹窗 -->
    <a-modal
      v-model="visible"
      title="修改项目招商信息"
      @ok="handleOk"
      dialogClass="edit-modal"
      :centered="true"
      :maskClosable="false"
    >
      <a-form-model
        :model="editInfo"
        :label-col="labelCol"
        ref="ruleForm"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="报名截止日期" >
          <a-date-picker
            class="editIpt"
            valueFormat="YYYY-MM-DD"
            v-model="editInfo.signDeadline"
            :disabled-date="disabledDate"
            :disabled="detailInfo.deadline === null ? false : detailInfo.deadline >= $moment().format('YYYY-MM-DD')?false:true"
          />
        </a-form-model-item>
        <a-form-model-item label="方案提交截止日期" >
          <a-date-picker
            class="editIpt"
            valueFormat="YYYY-MM-DD"
            v-model="editInfo.submitDeadline"
            :disabled-date="disabledDate"
          />
        </a-form-model-item>
        <a-form-model-item label="期限上限" >
          <div class="editIpt">
            <a-input-number class="numberIpt"  v-model="editInfo.dateLimit" :min="0" />
            <span>个月</span>
          </div>
        </a-form-model-item>
        <a-form-model-item label="目标回款金额下限" >
           <div class="editIpt">
             <a-input-number class="numberIpt" v-model="editInfo.aimedPriceBack" :min="0"  :precision="2"/>
             <span>万元</span>
           </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
  </div>
</template>

<script>
/*eslint-disable*/
import {projectDetail,signService,serviceCaseSubmit,updateProjectInfo} from "@/plugin/api/investment-center";
import {collateralTypeData} from "./source"
import {getArea,areaAnalysis,clearObject} from "@/plugin/tools"
import Breadcrumb from "@/components/bread-crumb";
import store from '@/plugin/store';
import  FileList  from '@/components/file-list'

//报名服务商表数据
const columns = [
  {
    title: "联络人",
    dataIndex: "name",
    width: "150px",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "联系方式",
    dataIndex: "phone",
    width: "200px",
    scopedSlots: { customRender: "phone" },
  },
  {
    title: "服务商类型",
    dataIndex: "identity",
    width: "200px",
    scopedSlots: { customRender: "identity" },
  },
  {
    title: "机构名称/挂靠律所",
    dataIndex: "orgOfficeName",
    width: "200px",
    scopedSlots: { customRender: "orgOfficeName" },
  },
  {
    title: "从业不良时间",
    dataIndex: "workingTime",
    width: "200px",
    scopedSlots: { customRender: "workingTime" },
  },
  {
    title: "擅长业务区域",
    dataIndex: "areasOfGoodCases",
    width: 200,
    scopedSlots: { customRender: "areasOfGoodCases" },
  },
  {
    title: "擅长业务类型",
    dataIndex: "goodCases",
    width: 200,
    scopedSlots: { customRender: "goodCases" },
  },
  {
    title: "报名日期",
    dataIndex: "applyDate",
    sorter: true,
    width: "200px",
    scopedSlots: { customRender: "applyDate" },
  },
  {
    title: "服务方案提交日期",
    dataIndex: "gmtModify",
    sorter: true,
    width: "200px",
    scopedSlots: { customRender: "gmtModify" },
  },
  {
    title: "方案提交情况",
    dataIndex: "caseFileStatus",
    width: "200px",
    scopedSlots: { customRender: "caseFileStatus" },
  },
];
//服务商提交方案表数据
const columns2 = (sortOrder) =>[
  {
    title: "服务方案提交日期",
    dataIndex: "gmtCreate",
    width: 200,
    sorter: true, //排序
    sortOrder: sortOrder || false,
    scopedSlots: { customRender: "gmtCreate" },
  },
  {
    title: "联络人",
    dataIndex: "name",
    width: 200,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "联系方式",
    dataIndex: "phone",
    width: 200,
    scopedSlots: { customRender: "phone" },
  },
  {
    title: "服务商类型",
    dataIndex: "identity",
    width: 200,
    scopedSlots: { customRender: "identity" },
  },
  {
    title: "机构名称/挂靠律所",
    dataIndex: "orgOfficeName",
    width: 200,
    scopedSlots: { customRender: "orgOfficeName" },
  },
  {
    title: "服务期限",
    dataIndex: "serviceTime",
    width: 200,
    scopedSlots: { customRender: "serviceTime" }
  },
  {
    title: "回款目标(万元)",
    dataIndex: "aimBackPrice",
    width: 200,
    scopedSlots: { customRender: "aimBackPrice" }
  },
  {
    title: "处置计划",
    dataIndex: "scheduleManagements",
    width: 200,
    scopedSlots: { customRender: "scheduleManagements" }
  },
  {
    title: "服务方案文档",
    dataIndex: "caseFileAddress",
    width: 200,
    scopedSlots: { customRender: "caseFileAddress" }
  },
];
const navData = [
  { id: 1, title: "招商管理", path: "/investment/list" },
  { id: 2, title: "招商项目管理", path: "/investment/list" },
  { id: 2, title: "招商项目详情", path: "" },
];
export default {
  name: "ItemDetail",
  data() {
    return {
      exhibit:false,
      visible:false,
      areaAnalysis,
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      navData,
      planCount:{
        validCount:'',
        invalidCount:''
      },
      //修改项目招商信息
      editInfo:{
        aimedPriceBack: '',
        dateLimit: '',
        id: this.$route.query.id,
        signDeadline: '',
        submitDeadline: ''
      },
      params:{
        caseType: 1,
        debtor: "",
        endDate: "",
        id: this.$route.query.id,
        page: 1,
        size: 10,
        sortField: '',
        sortOrder: "",
        startDate: ""
      },
      detailInfo: {
        alreadyCollectionStatus: "",
        amcProjectCollaterals: [],
        amcProjectGuarantors: [],
        assetPackage: "",
        businessDepartmentRecoveryTime: '',
        businessDepartmentTarget: '',
        businessTeam: "",
        capitalOrg: "",
        capitalProfitOrg: "",
        capitalPurchaseTime: "",
        contact: "",
        deadline: "",
        debtCaptial: '',
        debtInterest: '',
        debtor: "",
        debtorStatus: "",
        disposeDescription: "",
        disposeDifficulty: "",
        guarantorStatus: "",
        id: '',
        isHaveProxyLawyer: '',
        isLawsuit: '',
        judicialProcess: "",
        mortgagorStatus: "",
        projectManager: "",
        propertyClue: "",
        proxyLawyerContact: "",
        proxyLawyerName: "",
        proxyLimit: "",
        security: '',
        submitDeadline: "",
        targetAmountLowerLimit: '',
        targetYearUpperLimit: '',
      },
      sortOrder:'',
      //table表格数据
      tableSource: {
        //报名服务商列表
        applyServeTable: {
          columns,
          dataSource: [],
          pagination: {
            total: 0,
            pageSize:10,
            showQuickJumper: true,
            showTotal: (val) => `共${val}条信息`,
          },
        },
        //服务方案提交列表
        submitPlanTable: {
          dataSource: [],
          pagination: {
            total: 0,
            current:1,
            pageSize:10,
            showQuickJumper: true,
            showTotal: (val) => `共${val}条信息`,
          },
        },
      },
      projectManage:"",//权限管理
    };
  },
  computed:{
    columns2(){
      return columns2(this.sortOrder)
    },
  },
  methods: {
    bit(val){
      if(this.exhibit === val.id){
        this.exhibit = false
        return false
      }
      this.exhibit = val.id
    },
    //获取项目基本信息
    getProjectDetail(){
      projectDetail(this.params.id).then(res=>{
        if(res.code === 20000){
          this.detailInfo = res.data;
        }else{
          console.log('error...');
        }
      });
    },
    //获取报名服务商列表
    getSignServiceList(){
      signService(clearObject(this.params)).then(res=>{
        console.log(res)
        if(res.code === 20000){
          this.tableSource.applyServeTable.pagination.total = res.data.total;
          this.tableSource.applyServeTable.dataSource = res.data.list;
        }else{
          this.$message.error("获取报名服务商列表失败,请重新加载")
        }
      })
    },
    //获取服务商提交方案列表
    getServiceCaseSubmitList(){
      serviceCaseSubmit(clearObject(this.params)).then(res=>{
        if(res.code === 20000){
          this.tableSource.submitPlanTable.pagination.total = res.data.total;
          this.tableSource.submitPlanTable.dataSource = res.data.list;
        }else{
          this.$message.error("获取服务商提交方案列表失败,请重新加载")
        }
      })
    },
    //有效方案&未通过系统筛选切换
    changType(){
      this.params.page = 1;//改回来
      this.params.size = 10;
      this.params.sortField = "";
      this.params.sortOrder = "";
      this.tableSource.submitPlanTable.pagination.current = 1;
      this.sortOrder = false;
      this.getServiceCaseSubmitList();
    },
    goAvatar(v){
      console.log("跳转到画像页面",v);
      this.$router.push({path:'/provider/storage/detail', query: {id: v}})
    },
    //报名服务商列表分页,排序操作
    applyServeTableChange(pagination, filters, sorter){
      this.params.page = pagination.current;
      this.params.size = pagination.pageSize;
      this.params.sortField = sorter.order ?  sorter.field : "";
      this.params.sortOrder = sorter.order
        ? sorter.order === "ascend"
          ? "ASC"
          : "DESC"
        : "";
      this.getSignServiceList();
    },
    //服务商提交方案列表分页,排序操作
    submitPlanTableChange(pagination, filters, sorter){
      this.params.page = pagination.current;
      this.tableSource.submitPlanTable.pagination.current = pagination.current;
      this.params.size = pagination.pageSize;
      this.params.sortField = sorter.field;
      this.sortOrder = sorter.order;
      this.params.sortField = sorter.order ?  sorter.field : "";
      this.params.sortOrder = sorter.order
        ? sorter.order === "ascend"
          ? "ASC"
          : "DESC"
        : "";
      this.getServiceCaseSubmitList();
    },
    disabledDate(current) {
      return current && current < this.$moment().subtract(1, "days");
    },
    showModal(){
      this.visible = true;
      const { targetYearUpperLimit:t } = this.detailInfo;
      this.editInfo.signDeadline = this.detailInfo.deadline;
      this.editInfo.submitDeadline = this.detailInfo.submitDeadline;
      this.editInfo.dateLimit = t === 0 ? null : t;
      this.editInfo.aimedPriceBack = this.detailInfo.targetAmountLowerLimit;
    },
    handleOk(){
      this.$refs.ruleForm.validate( validate => {
        if(validate) {
          updateProjectInfo(this.editInfo).then(res=>{
            if(res.code === 20000) {
              this.$message.success("修改成功")
              this.visible = false;
              // this.getProjectDetail();
              // this.getServiceCaseSubmitList();
              // this.getSignServiceList();
              // this.getCount(1);
              // this.getCount(2);
              projectDetail(this.params.id).then((response)=>{
                if(response.code === 20000){
                  this.detailInfo = response.data;
                  this.getServiceCaseSubmitList();
                  this.getSignServiceList();
                  this.getCount(1);
                  this.getCount(2);
                }
              });
            }else{
              this.$message.error("修改失败")
            }
          })
        }else{
          return false;
        }
      })
    },
    getCount(caseType){
      serviceCaseSubmit({caseType,id:this.$route.query.id,page:1,size:10}).then(res=>{
        if(res.code === 20000){
          if(caseType === 1){
            this.planCount.validCount = res.data.total;
            this.tableSource.submitPlanTable.pagination.total = res.data.total;
            this.tableSource.submitPlanTable.dataSource = res.data.list;
          }
          if(caseType === 2){
            this.planCount.invalidCount = res.data.total;
          }
        }else{
          this.$message.error("获取服务商提交方案列表失败,请重新加载")
        }
      });
    }
  },
  filters:{
    //没有值展示'-'
    show_(val){
      if(!val)return '-';
      return val;
    },
    whether(val){
      return  val === 0 ? '否' : val === 1 ? '是' :'-'
    },
    guarantorsList: (arr = []) => {
      if(arr.length == 0) return '-'
      return arr.map((i) => i.guarantorName).join("、");
    },
    workingTimeText(val){
      if(val === null) return '-';
      let workingTimeObj = {
        0:'暂未有实际项目落地',
        1:'一年以内',
        2:'1-3年',
        3:'3年以上'
      };
      return workingTimeObj[val];
    },
    //擅长业务类型服务商机构
    goodCasesType(val){
      if(val === "") return '-';
      let goodCasesObj = {
        1:'工业',
        2:'商业',
        3:'住宅',
        4:'纯担保',
        0:'其他'
      };
      let arr = val.split(",")
      arr.forEach((v,i)=>{
        arr[i] = goodCasesObj[v] || ''
      });
      return arr.join("、");
    },
    //擅长业务类型服务商律师
    attorneyBes(val){
      if(val === "") return '-';
      let goodCasesObj = {
        1:'立案/保全',
        2:'公诉',
        3:'执行',
        4:'财产发现',
        5:'拍卖腾空',
        6:'破产/重组',
        7:'代位权/撤销权',
        8:'担保合同纠纷',
        9:'资管',
        10:'境外追索',
        11:'股东责任',
        12:'公司法律纠纷',
        13:'贸融',
        14:'能矿',
        15:'房地产',
        16:'票据',
        17:'刑事交叉',
        18:'融资租赁',
        19:'并购重组',
        20:'资产推介',
        21:'投行业务',
        0:'其他'
      };
      let arr = val.split(",")
      arr.forEach((v,i)=>{
        arr[i] = goodCasesObj[v] || ''
      });
      return arr.join("、");
    },
    caseFileText(val){
      return val === 0 ? "未提交" : "已提交";
    },
    isLawsuitType(val){
      if(!val)return '-';
      let isLawsuitObj = {
        1:'未诉',
        2:'已诉未判决',
        3:'已判决未执行',
        4:'已执行',
        5:'破产'
      };
      return isLawsuitObj[val]
    },
    arease:(params) => {
      return getArea(params.provinceCode,params.cityCode,params.areaCode);
    },
    collateralType:(val)=>{
      if(!val)return"-";
      return collateralTypeData.list.find(i=>val === i.value).label;
    }
  },
  components: {
    Breadcrumb,
    FileList
  },
  watch:{
    visible:function (){
      if(this.visible === false){
        this.$refs.ruleForm.resetFields();
      }
    }
  },
  created() {
    this.getProjectDetail();
    this.getSignServiceList();
    this.getCount(1);
    this.getCount(2);
    // serviceCaseSubmit({caseType:1,id:this.$route.query.id,page:1,size:10}).then(res=>{
    //   if(res.code === 20000){
    //     this.planCount.validCount = res.data.total;
    //     this.tableSource.submitPlanTable.pagination.total = res.data.total;
    //     this.tableSource.submitPlanTable.dataSource = res.data.list;
    //   }else{
    //     this.$message.error("获取服务商提交方案列表失败,请重新加载")
    //   }
    // });
    // serviceCaseSubmit({caseType:2,id,page:1,size:10}).then(res=>{
    //   if(res.code = 20000){
    //     this.planCount.invalidCount = res.data.total;
    //   }else{
    //     return false;
    //   }
    // });
    //权限控制
    const {config} = store.getters.getInfo;
    this.projectManage = config.projectManage
  },
};
</script>

<style scoped lang="scss">
.investment-detail-block{
  padding: 16px;
  .detail-wrapper {
    padding: 16px;
    background-color: #fff;
    .detail-conten {
      padding-left: 8px;
      .title2 {
        margin-top: 24px;
        font-weight: bold;
        color: #333333;
        font-size: 14px;
      }
      .title-table{
        margin-top: 24px;
        font-weight: bold;
        color: #333333;
        font-size: 16px;
      }
      .ant-row-flex {
        padding-left: 8px;
        margin-top: 24px;
        .ant-col {
          color: #666666;
          font-size: 14px;
          span {
            color: #333333;
          }
        }
      }
      .creditor-condition {
        padding-left: 8px;
        margin-top: 24px;
        color: #666666;
        font-size: 14px;
        span {
          color: #333333;
        }
      }
      .guarantee {
        display: flex;
        padding-left: 8px;
        margin-top: 24px;
      }
    }
  }
  //我添加的样式
  .plans{
    white-space: nowrap;
    overflow:hidden;
    p{
      margin: 0;
      width: 200px;
      overflow: hidden;
      white-space: pre-wrap;
    }
  }
  .plan{
    max-height:60px;
    white-space: nowrap;
    overflow:hidden;
    p{
      margin: 0;
      width: 200px;
      overflow: hidden;
      white-space: pre-wrap;
    }
  }
  .ant-radio-button-wrapper {
    margin: 10px;
    border-radius: 2px;
  }
  .tag{
    width: fit-content;
    border-radius: 2px;
    border: 1px dashed #FAAD14;
    font-size: 12px;
    color: #FAAD14;
    padding: 0px 5px;
  }
}
.ant-form-horizontal{
  height: 230px;
}
</style>
<style lang="scss">
.table-block{
  table{
    border-bottom: 1px #E8E8E8 solid;
  }
  tr >td,tr >th{
		border-bottom: none;
  }
  tbody > tr{
    height: 80px;
  }
  tr:nth-child(2n){
    background: #FAFAFA;
  }
}
.title1{
  font-size: 16px;
  color: #333333;
  font-weight: 600;
}
.edit-modal{
  .ant-modal-body{
    padding: 0px;
    .ant-form-item{
      margin-top: 24px;
      height: 32px;
      .editIpt{
        width: 198px;
        height: 32px;
        line-height: 32px;
        position: relative;
        .numberIpt{
          width: 100%;
          height: 100%;
        }
        span{
          position: absolute;
          top: 2px;
          right: 4px;
          z-index: 100;
          background-color: #FFFFFF;
          height:28px;
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
  .ant-modal-footer {
    text-align: center;
  }
  .ant-form-explain {
    text-align: left;
    font-size: 12px;
    font-weight: 400;
    color: #f5222d;
  }
}
</style>
