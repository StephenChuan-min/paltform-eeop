<template>
  <div class="qualifies-info-wrapper">
    <div class="info-item" data-label="我的资质认证信息-律师" v-if="isLawyer">
      <div class="info-item_date" v-if="noDate">提交日期：
        <span>{{ dataSource.createTime }}</span>
      </div>
      <div class="info-item_title" v-if="statusNeed">我的资质认证信息</div>
      <div class="info-item_list">
        <div class="info-item_list-title">律师名称</div>
        <div class="info-item_list-content">{{ dataSource.lawyerName || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">身份证号码</div>
        <div class="info-item_list-content">{{ dataSource.cardNumber || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">性别</div>
        <div class="info-item_list-content">{{ dataSource.sex|sex }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">执业证号</div>
        <div class="info-item_list-content">{{ dataSource.licenseNumber || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">执业开始年份</div>
        <div class="info-item_list-content">{{ dataSource.licenseStart || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">挂靠律所</div>
        <div class="info-item_list-content">{{ dataSource.lawOffice || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">邮箱地址</div>
        <div class="info-item_list-content">{{ dataSource.email || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">备用邮箱</div>
        <div class="info-item_list-content">{{ dataSource.backupEmail || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">身份证照片</div>
        <div class="info-item_list-content">
          <FileList :fileList="dataSource.frontOfCard"/>
          <FileList :fileList="dataSource.backOfCard"/>
        </div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">从业资格证</div>
        <div class="info-item_list-content">
          <FileList :fileList="dataSource.qualificationCertificate"/>
        </div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">保密承诺函</div>
        <div class="info-item_list-content">
          <FileList :fileList="dataSource.confidentialityCommitmentLetter"/>
        </div>
      </div>
      <template v-if="statusNeed">
        <div class="info-item_title">资质更改证明</div>
        <div class="info-item_list">
          <div class="info-item_list-title">资质更改证据材料</div>
          <div class="info-item_list-content">
            <FileList :fileList="dataSource.qualifyMaterial"/>
          </div>
        </div>
      </template>
    </div>
    <div class="info-item" data-label="我的资质认证信息-机构" v-else>
      <div class="info-item_date" v-if="noDate">提交日期：
        <span>{{ dataSource.createTime }}</span>
      </div>
      <div class="info-item_title" v-if="statusNeed">我的资质认证信息</div>
      <div class="info-item_list">
        <div class="info-item_list-title">机构名称</div>
        <div class="info-item_list-content">{{ dataSource.name || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">统一社会信用代码</div>
        <div class="info-item_list-content">{{ dataSource.orgSocialCreditCode || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">合伙人身份</div>
        <div class="info-item_list-content">{{ dataSource.partnerDetail || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">邮箱地址</div>
        <div class="info-item_list-content">{{ dataSource.email || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">备用邮箱</div>
        <div class="info-item_list-content">{{ dataSource.backupEmail || '-' }}</div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">营业执照</div>
        <div class="info-item_list-content">
          <FileList :fileList="dataSource.businessLicense"/>
        </div>
      </div>
      <div class="info-item_list">
        <div class="info-item_list-title">保密承诺函</div>
        <div class="info-item_list-content">
          <FileList :fileList="dataSource.confidentialityCommitmentLetter"/>
        </div>
      </div>

      <template v-if="statusNeed">
        <div class="info-item_title">资质更改证明</div>
        <div class="info-item_list">
          <div class="info-item_list-title">资质更改证据材料</div>
          <div class="info-item_list-content">
            <FileList :fileList="dataSource.qualifyMaterial"/>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import FileList from '@/components/file-list';
// import RowLayout from '../common/row-layout';
export default {
  name: 'QualifyInfo',
  nameComment: '资质认证',
  data() {
    return {}
  },
  props: {
    source: {
      type: Object,
      default: () => {
      },
    },
    isLawyer: {
      type: Boolean,
      default: true,
    },
    noTitle: {
      type: Boolean,
      default: true,
    },
    noDate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 1,
    }
  },
  components: {
    FileList,
    // RowLayout
  },
  computed: {
    dataSource() {
      return {...this.source};
    },
    statusNeed() {
      return this.status >= 3;
    }
  }

}
</script>

<style lang="scss">

</style>
