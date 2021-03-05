<template>
  <a-layout style="padding: 76px 120px 30px;">
    <a-spin v-if="loading" class="spin-wrapper" size="large" tip="数据加载中，请稍后..."/>
    <div class="investment-center-wrapper" v-else>
      <div class="header">
        <img :src="img.logo" alt="">
        <span>浙商资产服务项目招商</span>
      </div>
      <div v-if="!isAttestationOmission">
        <div class="query-wrapper">
          <div class="content">
            <div class="part" v-for="(item,index) in queryOptions" :key="item.code">
              <div class="label">{{ item.label }}</div>
              <a-radio-group v-model="queryParams[item.code]" @change="getTableList" button-style="solid">
                <a-radio-button v-for="childItem in (item.isCollapsed?item.list:item.list.slice(0,item.sliceKey))"
                                :value="childItem.value" :key="childItem.value">
                  {{ childItem.label }}
                </a-radio-button>
              </a-radio-group>
              <div class="collapse" v-if="item.code!=='priceType'">
                <span v-if="item.isCollapsed" @click="handleCollapse('up',index)">收起<a-icon type="up"
                                                                                            :style="{ fontSize: '12px', color: '#666' }"/></span>
                <span v-else @click="handleCollapse('down',index)">更多<a-icon type="down"
                                                                             :style="{ fontSize: '12px', color: '#666' }"/></span>
              </div>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <div class="total-tips">
            *当前条件下共有 {{ total }} 条正在招商的项目
          </div>
          <a-table :columns="columns" :data-source="amcProjectInfo" :row-key="record => record.id"
                   :pagination="pagination" @change="handleTabChange">
            <template slot="amount" slot-scope="amount">{{ amount|amountTh }}</template>
            <template slot="security" slot-scope="{security}">{{ SECURITY_TYPE[security] }}</template>
            <template slot="collateralType" slot-scope="{amcProjectCollaterals}">
              <span v-for="item in amcProjectCollaterals" :key="item.id"
                    :style="{marginRight:'5px'}">{{ item.collateralType| collateralType }}</span>
            </template>
            <template slot="area" slot-scope="{amcProjectCollaterals}">
              <p v-for="item in amcProjectCollaterals" :key="item.id">{{ item|area }}</p>
            </template>
            <template slot="auction" slot-scope="item">
              <a-button type="link" size="small" @click="handleAuction(item,'view')">查看抵押物清单</a-button>
              <a-divider type="vertical" style="margin:0"/>
              <a-button type="link" size="small" v-if="!parseInt(item.isSign)" @click="handleAuction(item,'signUp')">
                竞标报名
              </a-button>
              <a-button type="link" size="small" v-else disabled>已报名</a-button>
            </template>
          </a-table>
        </div>
      </div>
      <AttestationOmission v-else :attestation="isAttestationOmission===1?'资质认证':'要素认证'"/>
      <ProjectModal :projectInfo="projectInfo" :sign="'signUp'" ref="signUpModal" @handleSignUp="getTableList"/>
      <MsgInfoModal ref="msgInfoModal" :msgInfo="projectInfo"/>
    </div>
  </a-layout>
</template>

<script>
import {columns, SECURITY_TYPE, SORTER_TYPE, queryOptions} from "./source";
import ProjectModal from '@/components/modal/project-modal';
import MsgInfoModal from './msgsInfo-modal';
import AttestationOmission from '@/components/authentication-omission';
import {clearProto, removeObjectNullVal, getArea} from "@/plugin/tools";
import logo from "@/assets/img/logo.png";
import {amcProjectListApi} from "@/plugin/api/investment-center";
import {message} from "ant-design-vue";

export default {
  name: 'InvestmentCenter',
  nameComment: '服务项目招商中心',
  data() {
    return {
      img: {
        logo,
      },
      loading: false,
      columns,
      SECURITY_TYPE, //担保方式
      SORTER_TYPE, //排序方式
      queryOptions, //搜索条件
      isAttestationOmission: 0, //是否完成资质认证或要素认证
      total: 0, //总数
      viewModalVisible: false, //查看抵质押物清单弹窗
      pagination: {},
      queryParams: { //入参
        page: 1,
        size: 10,
        sortOrder: 'DESC',
        provinceCode: '',
        type: '',
        priceType: '',
      },
      amcProjectInfo: [], //项目信息
      projectInfo: {}, //弹窗信息
    };
  },
  components: {
    ProjectModal,
    MsgInfoModal,
    AttestationOmission,
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      amcProjectListApi(removeObjectNullVal(this.queryParams)).then((res) => {
        this.loading = true;
        if (res.code === 20000) {
          const data = res.data;
          this.total = data.total;
          this.amcProjectInfo = data.list;
          this.loading = false;
        } else {
          this.loading = false;
          message.warning(res.message);
        }
      })
    },

    //查看抵押物信息 竞标报名弹窗
    handleAuction(params, sign) {
      this.projectInfo = clearProto(params);
      if (sign === 'signUp') {
        this.$refs.signUpModal.handleOpenModal();
      } else {
        this.$refs.msgInfoModal.handleOpenModal();
      }
    },

    //换页 排序
    handleTabChange(pagination, filters, sorter) {
      const params = {...this.queryParams};
      params.page = pagination.current;
      params.sortOrder = SORTER_TYPE[sorter.order];
      this.queryParams = params;
      this.getTableList();
    },

    /**
     * 搜索条件 展开收起
     * @param flag down：展开 up：收起
     * @param index 0地域  1类型
     */
    handleCollapse(flag, index) {
      if (flag === 'down') {
        this.queryOptions[index].isCollapsed = true;
      } else {
        this.queryOptions[index].isCollapsed = false;
      }
    }
  },
  filters: {
    //地区
    area: (params) => {
      return getArea(params.provinceCode, params.cityCode, params.areaCode);
    },
    //抵质押物类型
    collateralType: (val) => {
      if (!val) return "-";
      return queryOptions[1].list.find(i => val === i.value).label;
    }
  }
}
</script>

<style lang='scss'>
.investment-center-wrapper {
  flex: 1;
  background: #ffffff;

  .header {
    display: flex;
    height: 56px;
    align-items: center;
    padding-left: 24px;
    border-bottom: 1px solid #E8E8E8;

    span {
      margin-left: 8px;
      color: #262626;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .query-wrapper {
    padding: 24px;

    .content {
      border: 1px solid #E9E9E9;
    }

    .part {
      display: flex;
      padding: 12px 24px 4px 16px;
      border-bottom: 1px solid #E9E9E9;

      &:last-child {
        border: none;
      }

      .label {
        min-width: 108px;
      }

      .collapse {
        min-width: 112px;
        text-align: right;
        margin-left: auto;
        color: #666;
        cursor: pointer;
      }
    }

    .ant-radio-button-wrapper {
      border: none;
      box-shadow: none;
      height: 22px;
      line-height: 22px;
      border-radius: 2px;
      transition: none;
      margin-bottom: 8px;
    }

    .ant-radio-button-wrapper::before {
      content: none;
    }
  }

  .table-wrapper {
    padding: 0 24px;

    .total-tips {
      font-size: 14px;
      padding-bottom: 16px;
      line-height: 14px;
      color: #8C8C8C;
    }

    p {
      margin-bottom: 0;
    }
  }
}

.spin-wrapper {
  width: 100%;
  padding-top: 10vh !important;
}
</style>




