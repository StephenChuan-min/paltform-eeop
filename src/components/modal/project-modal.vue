<template>
  <a-modal
      :title="!isSignUpSuccess ? sign === 'fail' ? '放弃竞标' : '竞标报名' : '竞标报名-报名成功'"
      v-model="visible"
      :destroyOnClose="true"
      dialogClass="fail-modal"
      :maskClosable="false"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" @click="handleModify(sign)">
        {{ !isSignUpSuccess ? sign === 'fail' ? '确认放弃' : '确认报名' : '前往查看竞标项目' }}
      </a-button>
      <a-button key="back" @click="handleCancel">
        {{ isSignUpSuccess ? '继续浏览招商项目' : '取消' }}
      </a-button>
    </template>
    <div class="fail-modal-wrapper" v-if="!isSignUpSuccess">
      <div class="header">
        <a-icon type="exclamation-circle" :style="{color:'orange',marginRight:'5px'}"/>
        <span v-if="sign==='fail'">确认要放弃以下项目的服务 竞标吗？放弃后，对该项目的竞标不可恢复!</span>
        <span v-else>确认要对以下项目进行服务报名吗？报名后，项目信息将会进入您的竞标项目管理列表，您需要完成债权尽调并提交服务方案。</span>
      </div>
      <div class="content">
        <ul>
          <li>
            <p>债务人名称：</p>
            <p>{{ projectInfo.debtor }}</p>
          </li>
          <li>
            <p>担保方式：</p>
            <p>{{ SECURITY_TYPE[projectInfo.security] }}</p>
          </li>
          <li>
            <p>债权本金：</p>
            <p>{{ projectInfo.debtCaptial|amountTh }}万元</p>
          </li>
          <li>
            <p>债权利息：</p>
            <p>{{ projectInfo.debtInterest|amountTh }}万元</p>
          </li>
          <li>
            <p>保证人清单：</p>
            <p>{{ projectInfo.amcProjectGuarantors|guarantorsList }}</p>
          </li>
          <li>
            <p>
              抵押物清单：
            </p>
            <div>
              <div v-for="item in projectInfo.amcProjectCollaterals" :key="item.id">{{ item.collateralName }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="signup-success-wrapper" v-else>
      <img src="../../assets/img/logo.png" alt="">
      <p>报名成功！项目已进入您的竞标项目管理列表，您可前往列表查看项目详情和进行方案提交</p>
      <p>本项目的项目经理为：{{ projectInfo.projectManager }}，联系方式：{{ projectInfo.contact }}</p>
      <p>请您尽快联系项目经理，完成尽调并提交服务方案</p>
    </div>
  </a-modal>
</template>

<script>
import {signUpApi} from "@/plugin/api/investment-center";
import {SECURITY_TYPE} from "@/views/investment-center/source";
import {message} from "ant-design-vue";

export default {
  name: "ProjectModal",
  nameComment: '竞标报名/放弃竞标弹窗',
  data() {
    return {
      visible: false,
      isSignUpSuccess: false,
      SECURITY_TYPE,
    }
  },
  props: {
    projectInfo: {
      type: Object,
      default: () => {
      },
    },
    sign: {
      type: String,
      default: 'signUp',
    },
  },
  methods: {
    handleOpenModal() {
      this.visible = true;
    },
    handleModify() {
      if (this.isSignUpSuccess) {
        this.visible = false;
        this.$router.push('/project/biding');
      } else {
        if (this.sign === 'signUp') {
          const id = parseInt(this.projectInfo.id);
          signUpApi(id).then((res) => {
            if (res.code === 20000) {
              this.isSignUpSuccess = true;
              this.$emit('handleSignUp');
            } else {
              message.warning(res.message, 2, () => {
                this.visible = false;
              })
            }
          })
        } else {
          this.visible = false;
        }
      }

    },
    handleCancel() {
      this.visible = false;
      this.isSignUpSuccess = false;
    },
  },
  filters: {
    guarantorsList: (arr = []) => {
      return arr.map(i => i.guarantorName).join("、");
    },
  }
}
</script>

<style lang="scss">
.fail-modal {
  width: 1000px !important;

  .ant-modal-content {
    width: 100%;
  }

  .ant-modal-body {
    padding: 0 24px 24px !important;

    .fail-modal-wrapper {
      .header {
        padding: 33px 0;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
      }

      .content {
        padding: 24px;
        background: rgba(8, 109, 217, 0.05);

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;

          li {
            display: flex;
            width: 25%;

            &:nth-child(n+5) {
              width: 100%;
            }

            p {
              word-break: break-all;

              &:first-child {
                color: #333;
                min-width: 84px;
                text-align: right;
              }
            }

            div {
              p {
                margin-bottom: 10px;

                &:last-child {
                  margin: 0;
                }
              }
            }
          }
        }
      }
    }

    .signup-success-wrapper {
      text-align: center;
      padding-top: 32px;

      img {
        height: 68px;
        margin-bottom: 24px;
      }

      p {
        margin-bottom: 8px;
      }
    }
  }

  .ant-modal-footer {
    text-align: center;
    border-top: none;
    padding: 8px 0 24px;
  }
}
</style>
