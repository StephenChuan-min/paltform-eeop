<template>
  <div class="register-wrapper">
    <div class="register-container">
      <!-- logo图片 -->
      <div class="logo">
        <img class="logo-pic" src="../../assets/image/logo.jpg" alt="" />
      </div>
      <!-- 注册表单 -->
      <div class="register-block" v-if="next">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :form="form"
          class="register-form"
        >
          <a-form-model-item class="user-name-item" prop="username">
            <a-input
              class="form-userName-input"
              placeholder="请输入您的姓名"
              v-model.trim="form.username"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0, 0, 0, 0.25)"
              />
            </a-input>
          </a-form-model-item>
          <a-form-model-item class="tel-item" prop="phone">
            <a-input
              autocomplete="off"
              class="form-tel-input"
              :maxLength="11"
              v-model.trim="form.phone"
              placeholder="请输入您本人实名登记的手机号码"
            >
              <a-icon
                slot="prefix"
                type="mobile"
                style="color: rgba(0, 0, 0, 0.25)"
              />
            </a-input>
          </a-form-model-item>
          <a-form-model-item class="verify-item" prop="code">
            <a-input
              autocomplete="off"
              v-model.trim="form.code"
              :maxLength="6"
              placeholder="请输入验证码"
            >
              <div slot="suffix" @click="sendVerifyCode" class="phonecode">
                获取验证码 <span v-if="countdown">({{ countdown }}s)</span>
              </div>
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button
              type="primary"
              class="register-form-button"
              @click="doRegister"
              >下一步</a-button
            >
          </a-form-model-item>
        </a-form-model>
      </div>
      <!-- 注册成功 -->
      <div class="register-success-block" v-else>
        <div class="success">
          <img
            class="success-pic"
            src="../../assets/image/success.png"
            alt=""
          />
          <div class="success-prompt">您已成功注册成为浙商资产服务商！</div>
          <div class="verify-prompt">
            为了更精准地给您推送优质项目，请您尽快进行服务商要素认证
          </div>
          <div class="login-attestation">登陆并前往资质认证</div>
        </div>
      </div>
      <div class="login" @click="goLogin">使用已有账号登录</div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { registerCode, authRegister } from "@/plugin/api/register";
export default {
  name: "RegisterView",
  nameComment: "注册页面",
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
      next: true,
      countdown: null,
      form: {
        username: "",
        phone: "",
        code: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入您的名字", trigger: "blur" },
        ],
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
    };
  },
  methods: {
    //点击下一步注册
    doRegister() {
      this.$refs.ruleForm.validate((validate) => {
        console.log(validate);
        if (!validate) return this.$message.error("必填信息不能为空");
        authRegister(this.form)
          .then((res) => {
            console.log(res);
            if (res.code === 20000) {
              this.$message.success("注册成功");
              this.next = false;
            }
            if (res.code === 20001) this.$message.error("注册失败");
            if (res.code === 30003) this.$message.error("验证码错误");
            if (res.code === 30006) this.$message.error("账号被锁定");
            if (res.code === 30008) this.$message.error("该手机号已被注册");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    //点击发送验证码
    sendVerifyCode() {
      this.$refs.ruleForm.validateField("phone", (validate) => {
        if (validate) {
          return false;
        } else {
          //60秒倒计时阶段不可发送验证码
          if (this.countdown) return;
          this.countdown = 60;
          const timer = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) clearInterval(timer);
          }, 1000);
          registerCode(this.form.phone).then((res) => {
            console.log(res);
            if (res.code === 20000) this.$message.success("验证码发送成功");
            if (res.code !== 20000) this.$message.error("验证码发送失败");
          });
        }
      });
    },
    goLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang='scss'>
.register-wrapper {
  background-color: $background-base;
  height: 100vh;
  display: flex;
  .register {
    &-container {
      width: 402px;
      height: 512px;
      background: #ffffff;
      box-shadow: 4px 6px 15px 0 rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      margin: auto;
      .logo {
        width: 190px;
        height: 60px;
        margin: 0 auto;
        margin-top: 52px;
        &-pic {
          width: 100%;
          height: 100%;
        }
      }
      .register-form {
        // overflow: hidden;
        height: 254px;
        .ant-form-item {
          width: 338px;
          height: 40px;
          margin: 0 auto;
          text-align: center;
          /deep/.ant-input {
            width: 338px;
            height: 40px;
            background: #ffffff;
            border-radius: 2px;
            border: 1px solid #dadde6;
            &::placeholder {
              font-size: 16px;
              font-weight: 400;
              color: #bfbfbf;
              line-height: 18px;
            }
          }
          .register-form-button {
            width: 338px;
            height: 40px;
            font-size: 16px;
            line-height: 16px;
            font-weight: 500;
            color: #ffffff;
            background: #008cb0;
            border-radius: 2px;
            margin-top: 46px;
          }
        }
        .user-name-item {
          margin-top: 44px;
        }
        .tel-item {
          margin-top: 24px;
        }
        .verify-item {
          margin-top: 24px;
          .phonecode {
            height: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #bfbfbf;
            line-height: 16px;
            cursor: pointer;
          }
        }
      }
      .register-success-block {
        .success {
          text-align: center;
          margin-top: 44px;
          &-pic {
            width: 88px;
            height: 88px;
            border-radius: 50%;
          }
          .success-prompt {
            width: 224px;
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #595959;
            line-height: 20px;
            margin: 0 auto;
            margin-top: 24px;
          }
          .verify-prompt {
            width: 294px;
            height: 40px;
            font-size: 14px;
            font-weight: 400;
            color: #595959;
            line-height: 20px;
            margin: 0 auto;
            margin-top: 8px;
          }
          .login-attestation {
            margin: 0 auto;
            margin-top: 34px;
            width: 176px;
            height: 40px;
            background: #008cb0;
            border-radius: 2px;
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 40px;
            cursor: pointer;
          }
        }
      }
      // 表单校验提示信息样式
      /deep/.ant-form-explain {
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        color: #f5222d;
        line-height: 12px;
        margin-top: 4px;
      }
      .login {
        font-size: 14px;
        font-weight: 400;
        color: #008cb0;
        line-height: 20px;
        margin-top: 24px;
        text-align: center;
        cursor: pointer;
      }
      .spin-wrapper {
        width: 100%;
        padding-top: 10vh !important;
      }
    }
  }
}
</style>
