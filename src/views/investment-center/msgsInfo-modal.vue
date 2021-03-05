<template>
  <a-modal
      :title="`抵押物清单-${msgInfo.debtor}`"
      v-model="visible"
      :destroyOnClose="true"
      dialogClass="msgs-modal"
      :maskClosable="false"
      :footer="null"
  >
    <div class="msgs-modal-wrapper">
      <div class="part">
        <div class="title">
          保证人
        </div>
        <p>{{ msgInfo.amcProjectGuarantors|guarantorsList }}</p>
      </div>
      <div class="part">
        <div class="title">
          抵押物
        </div>
        <a-table :columns="msgInfoColumns" :data-source="msgInfo.amcProjectCollaterals" :row-key="record => record.id"
                 :pagination="false">
          <template slot="collateralType" slot-scope="{collateralType}">
            <span>{{ collateralType|collateralType }}</span>
          </template>
          <template slot="area" slot-scope="item">
            <span>{{ item|area }}</span>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {msgInfoColumns, MSGS_TYPE, queryOptions} from "./source";
import {getArea} from "@/plugin/tools";

export default {
  name: "MsgInfoModal",
  nameComment: '查看抵质押物清单弹窗',
  data() {
    return {
      visible: false,
      msgInfoColumns,
      MSGS_TYPE,
    }
  },
  props: {
    msgInfo: {
      type: Object,
      default: () => {
      },
    },
  },
  methods: {
    handleOpenModal() {
      this.visible = true;
    }
  },
  filters: {
    guarantorsList: (arr = []) => {
      return arr.map(i => i.guarantorName).join("、");
    },
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

<style lang="scss">
.msgs-modal {
  width: 1000px !important;

  .ant-modal-content {
    width: 100%;

    .ant-modal-body {
      padding: 0 24px 27px !important;

      .part {
        padding-top: 32px;

        .title {
          color: #333;
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 14px;
        }

        p {
          padding-left: 17px;
          margin: 0;
        }
      }
    }
  }
}
</style>
