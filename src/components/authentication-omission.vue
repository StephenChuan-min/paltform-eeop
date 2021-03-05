<template>
  <div class="qualifies-omission-wrapper">
    <div class="content">
      <img src="@/assets/img/no-finished.png" alt="">
      <p>您尚未完成{{ attestation }}，请先完成{{ attestation }}！</p>
      <a-button @click="goAttestationPage(attestation)">
        立即前往{{ attestation }}
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttestationOmission",
  nameComment: '服务招商中心认证未完成-导航页面',
  props: {
    attestation: {
      type: String,
      default: '资质认证',
    }
  },
  methods: {
    goAttestationPage(params) {
      const path = params === '资质认证' ? 'qualifies' : 'factor';
      this.$router.push(`/attest/${path}`);
    }
  }
}
</script>

<style scoped lang="scss">
  .qualifies-omission-wrapper{
    height: 100%;
    background: #fff;
    .content{
      text-align: center;
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%, -50%);
        p{
          color: #666666;
          font-weight: 500;
          line-height: 20px;
          margin: 12px 0 24px;
        }
      .ant-btn{
        width:144px;
        background-color:#008CB0;
        color: #fff;
        border-radius: 2px;
      }
    }
  }
</style>
