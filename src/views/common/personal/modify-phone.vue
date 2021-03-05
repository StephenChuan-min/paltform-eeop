<template>
  <div class="personal-main">
    <div class="container" ref="container">
      <a-modal
        :bodyStyle="{ display: 'flex', justifyContent: 'center' }"
        :centered="true"
        :getContainer="()=>$refs.container"
        :maskStyle="{ background: 'rgba(0, 0, 0, 0.5)' }"
        v-model="visible"
        title="修改绑定手机号"
      >
        <a-form-model
          ref="ruleForm"
          :rules="rules"
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          v-if="step !== 3"
        >
          <a-form-model-item v-if="step === 1" label="原账号" prop="phone">
            <a-input placeholder="请输入原账号" :maxLength="11" v-model.trim="form.phone" />
          </a-form-model-item>
          <a-form-model-item v-else label="新账号" prop="phone">
            <a-input
              placeholder="请输入需要绑定的新手机号"
              :maxLength="11"
              v-model.trim="form.phone"
            />
          </a-form-model-item>
          <a-form-model-item label="验证码" prop="code">
            <a-input placeholder="请输入短信验证码" :maxLength="6" v-model.trim="form.code">
              <div slot="suffix" class="verify-code" @click="sendVerifyCode">
                获取验证码<span v-if="countdown">({{ countdown }}s)</span>
              </div>
            </a-input>
          </a-form-model-item>
        </a-form-model>
        <div class="success" v-else>
          <img
            class="success-pic"
            src="../../../assets/image/success.png"
            alt=""
          />
          <div class="success-info">
            手机号修改成功，已自动为您切换到最新手机号登陆
          </div>
        </div>
        <button
          slot="footer"
          class="next-btn"
          v-if="step === 1"
          @click="goNext"
        >
          下一步
        </button>
        <button
          slot="footer"
          class="next-btn"
          v-if="step === 2"
          @click="goNext"
        >
          确认绑定新手机号
        </button>
        <button
          slot="footer"
          class="next-btn"
          v-if="step === 3"
          @click="goNext"
        >
          知道了
        </button>
      </a-modal>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import {
  oldPhoneCode,
  verifyOldPhone,
  newPhoneCode,
  bindNewPhone,
} from "@/plugin/api/personal";
export default {
  data() {
    //自定义手机号校验规则
    const phoneCheck = (rule, value, callback) => {
      const reg = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
      if (!reg.test(value)) {
        callback("请输入正确的手机号码");
      }
      callback();
    };
    return {
      visible: false,
      step: 1,
      form: {
        phone: "",
        code: "",
      },
      countdown: null,
      rules: {
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入正确的手机号",
            validator: phoneCheck,
            trigger: "blur",
          },
        ],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    sendVerifyCode() {
      this.$refs.ruleForm.validateField("phone", (validate) => {
        if (validate) {
          return false;
        } else {
          //60秒倒计时阶段不可发送验证码
          if (this.countdown) return;
          this.countdown = 60;
          this.timer = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) clearInterval(this.timer);
          }, 1000);
          //step==1,原账号发送验证码
          if (this.step === 1) {
            oldPhoneCode(this.form.phone).then((res) => {
              console.log(res);
              if (res.code === 20000) this.$message.success("验证码发送成功");
              if (res.code !== 20000) this.$message.error("验证码发送失败");
            });
          }
          //step==2,新手机号发送验证码
          if (this.step === 2) {
            newPhoneCode(this.form.phone).then((res) => {
              console.log(res);
              if (res.code === 20000) this.$message.success("验证码发送成功");
              if (res.code !== 20000) this.$message.error("验证码发送失败");
            });
          }
        }
      });
    },
    goNext() {
      if (this.step === 3) {
        this.visible = false;
        this.step = 1;
      }
      this.$refs.ruleForm.validate((validate) => {
        console.log(validate);
      });
      //step==1,验证原手机号
      if (this.step === 1) {
        verifyOldPhone(this.form.code, this.form.phone).then((res) => {
          console.log(res);
          if (res.code === 20000) {
            this.$message.success("验证通过");
            this.form.phone = "";
            this.form.code = "";
            clearInterval(this.timer);
            this.countdown = null;
            this.step++;
          }
          if (res.code === 20001) this.$message.error("验证失败");
          if (res.code === 30003) this.$message.error("验证码错误");
          if (res.code === 30006) this.$message.error("账号被锁定");
          if (res.code === 30009) this.$message.error("手机号不存在");
        });
      }
      //step==2,绑定新手机
      if (this.step === 2) {
        bindNewPhone(this.form.code, this.form.phone).then((res) => {
          console.log(res);
          if (res.code === 20000) {
            this.$message.success("绑定新手机号成功");
            this.form.phone = "";
            this.form.code = "";
            clearInterval(this.timer);
            this.countdown = null;
            this.step++;
          }
          if (res.code === 20001) this.$message.error("验证新手机号失败");
          if (res.code === 30003) this.$message.error("验证码错误");
          if (res.code === 30006) this.$message.error("账号被锁定");
          if (res.code === 30008) this.$message.error("该手机号已被注册");
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.verify-code {
  font-size: 14px;
  font-weight: 400;
  color: #008cb0;
  line-height: 20px;
  cursor: pointer;
}
.next-btn {
  padding: 6px 16px;
  background: #cccccc;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  border: none;
}
</style>
<style lang="scss">
.personal-main{
  .container{
    .ant-modal-root {
      .ant-modal-content {
        width: 600px;
        .ant-modal-title {
          font-size: 16px;
          font-weight: 500;
          color: #262626;
          line-height: 16px;
        }
        .ant-modal-body {
          padding: 0;
          .ant-form-item {
            margin-top: 24px;
            .ant-form-item-control-wrapper {
              .ant-form-item-control {
                width: 388px;
              }
            }
            .ant-input {
              height: 32px;
              background: #ffffff;
              border-radius: 2px;
              border: 1px solid #d9d9d9;
              &::placeholder {
                font-size: 14px;
                font-weight: 400;
                color: #bfbfbf;
                line-height: 20px;
              }
            }
            .ant-form-item-required {
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
            }
          }
        }
        .ant-modal-footer {
          text-align: center;
        }
        //表单校验提示信息样式
        .ant-form-explain {
          font-size: 12px;
          font-weight: 400;
          color: #f5222d;
          line-height: 12px;
          margin-top: 4px;
        }
      }
    }
    .success {
      text-align: center;
      &-pic {
        width: 54px;
        height: 54px;
        margin-top: 24px;
      }
      &-info {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
        margin-top: 14px;
        margin-bottom: 32px;
      }
    }
  }
}

</style>
