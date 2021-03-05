<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-content">
        <div class="video-wrapper">
          <div class="zs-logo">
            <img class="zs-logo-pic" src="../../assets/img/zs-logo.png" alt="">
          </div>
					<div style="width: 853px; height: 480px;overflow: hidden;">
						<video muted autoplay controls src="https://zsamc-public.zsamc.com/promotion-vedio.mp4"></video>
					</div>
        </div>
        <div class="login-wrapper" ref="loginContainer">
          <div class="login-title">服务商招募管理系统运营后台</div>
          <a-form-model
            layout="inline"
            :model="params"
            @submit.native.prevent
            :rules="rules"
            ref="ruleForm"
            class="login-form-wrapper"
          >
            <div style="height: 196px">
              <a-form-model-item prop="username">
                <a-input
                  v-model.trim="params.username"
                  placeholder="请输入您的工号"
                  v-bind="styleProps"
                  :maxLength="8"
									autocapitalize="off"
								>
                  <a-icon slot="prefix" type="user" style="color: #bfbfbf" />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="password">
                <a-input
                  v-model.trim="params.password"
                  type="password"
                  v-bind="styleProps"
                  @pressEnter="handleSubmit"
                  placeholder="请输入登录密码"
									autocapitalize="off"
                >
                  <a-icon slot="prefix" type="lock" style="color: #bfbfbf" />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="pictureCode" v-if="imgCode.status">
                <a-input
                  v-model.trim="params.pictureCode"
                  placeholder="请输入图形验证码"
                  v-bind="styleProps"
                  :maxLength="4"
                  @pressEnter="handleSubmit"
                >
                  <a-icon
                    slot="prefix"
                    type="safety"
                    style="color: #bfbfbf"
                  />
                  <template slot="suffix" @click="toGetImageCode">
                    <a-spin :spinning="imgCode.loading">
                      <div style="height: 34px; overflow: hidden; width: 110px" @click="toGetImageCode">
                        <img
                          :src="imgCode.url"
                          alt=""
                          style="
                            height: 39px;
                            width: 117px;
                            margin: -3px 0 0 -4px;
                          "
                        />
                      </div>
                    </a-spin>
                  </template>
                </a-input>
              </a-form-model-item>
              <a-button class="login-btn" type="primary" block @click="handleSubmit" size="large" :loading="loading"
							>登 录</a-button>
            </div>
          </a-form-model>
        </div>
      </div>
			<div class="register-record">
				浙公网安备 33010202000630号  Copyright © 2014 浙江省浙商资产管理有限公司版权所有 浙ICP备14030345号-1
			</div>
    </div>
  </div>
</template>

<script>
import * as api from "@/plugin/api/login";
import { encryptInfo } from "@/plugin/tools/encrypt";
import { ruleProcess } from "@/plugin/tools/rule";

export default {
  name: "RegisterView",
  nameComment: "注册页面",
  data() {
    //自定义工号校验规则
    const numberCheck = (rule, value, callback) => {
      const reg = /^[0-9]{8}$/;
      if (!reg.test(value)) {
        callback("请输入8位数字的工号");
      }
      callback();
    };
    return {
      params: {
        username: "",
        password: "",
        pictureCode: "",
      },
			loading:false,
      imgCode: {
        status: false,
        loading: false,
        url: "",
      },
      styleProps: {
        autoComplete: "off",
        size: "large",
        style: {
          width: "338px",
        },
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入8位数字的工号",
            trigger: "blur",
            validator: numberCheck,
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        pictureCode: [
          { required: true, message: "请输入图形验证码", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
		window.localStorage.clear();
    this.form = this.$refs.ruleForm;
  },
  methods: {
    // 获取图片验证码
    toGetImageCode() {
      if (this.imgCode.loading) return;
      this.imgCode.loading = true;
      api
        .getCaptcha(this.params.username)
        .then((res) => {
          if (res.code === 20000) {
            this.imgCode.url = res.data.captcha;
          } else {
            this.$message.error("图片验证码失败");
          }
        })
        .finally(() => {
          this.imgCode.loading = false;
        });
    },
    toLogin() {
      // api.login(encryptInfo(this.params)).then(res=>{
      //   console.log(res)
      // })
			this.loading = true;
      api
        .accountStatus(this.params.username)
        .then((res) => {
          if (res.code === 20000) {
            const { needPicCode } = res.data;
            const { status } = this.imgCode;
            if (needPicCode) {
              if (status) {
                return api.login(encryptInfo(this.params));
              } else {
                this.imgCode.status = true;
	              this.loading = false;
	              this.toGetImageCode();
              }
            } else {
              return api.login(encryptInfo(this.params));
            }
          }else{
	          this.loading = false;
          }
        })
        .then((res) => {
          if (res.code === 20000) {

	          this.$store.dispatch("login", res.data);
	          ruleProcess(this,res.data);
	          this.$router.push("/");
          } else{
	          this.params.pictureCode = "";
            if(this.imgCode.status) this.toGetImageCode();
	          this.loading = false;
	          if (res.data && res.data.count >= 5) return this.$message.error(`账号或密码错误,您还可以尝试${10 - res.data.count}次`);
            if (res.code === 30001) return this.$message.error("账号或密码错误");
            if (res.code === 30006) return this.$warning({
              title:"账号冻结提示",
              content:"账号或密码输入错误次数过多，请在1小时后尝试",
              centered:true,
              mask:false,
              okText:"我知道了",
              getContainer:()=>this.$refs.loginContainer
            });
            if (res.code === 30009) return this.$message.error("账号不存在,请先进行注册");
            if (res.code === 30010) return this.$message.error("图片验证码错误");
          }
        });
    },
    // 点击登录操作
    handleSubmit() {
      this.form.validate((valid) => {
        if (valid) this.toLogin();
      });
    },
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
};
</script>

<style scoped lang='scss'>
.register-wrapper {
  height: 100vh;
  display: flex;
  .register {
    &-container {
			position: relative;
      width: 100%;
      height: 560px;
      background: #1a1939 url("../../assets/img/background.jpg") center no-repeat;
      margin: auto;
      padding-top: 40px;
    }
    &-content {
      width: 1306px;
      height: 480px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
    }
  }
  .video-wrapper {
    position: relative;
    //width: 879px; 视频左右两侧会留白
    width: 853px;
    height: 100%;
    background-color: #fff;
    .zs-logo{
      position: absolute;
      top: -135px;
			z-index: 1;
    }
    video{
      // width: 100%;
      height: 100%;
      &:focus{
        outline: none;
      }
    }
  }
	.register-record{
		position: absolute;
		bottom: -40px;
		width: 100%;
		text-align: center;
		font-size: 14px;
	}
  .login {
    &-wrapper {
      width: 402px;
      height: auto;
      padding: 30px;
      background: #ffffff;
    }
    &-title {
      line-height: 36px;
      font-size: 28px;
      color: $common-base-active;
      text-align: center;
      width: 255px;
      margin: 0 auto;
      margin-bottom: 70px;
    }
  }
}
</style>
<style lang="scss">
.login-wrapper {
  .login-tab-theme {
    .ant-tabs-bar {
      border-bottom: none !important;
      margin-bottom: 24px !important;
    }
    .ant-tabs-nav {
      padding-left: 47px;
    }
  }
  .login-form-wrapper {
    .ant-form-item {
      margin-bottom: 23px !important;
    }
    .ant-form-item-with-help {
      margin-bottom: -1px !important;
    }
    .ant-form-explain,
    .ant-form-extra {
      margin-top: 0;
      min-height: 25px;
    }
  }
  input,
  button {
    border-radius: 2px !important;
  }
  .login-btn{
    margin-top: 46px;
  }
}
.register-content{
  .login-wrapper{
    .ant-modal{
      &-confirm-title{
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
      }
      &-confirm-title{
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
      &-confirm-btns{
        width: 72px;
        height: 24px;
        background: #008CB1;
        border-radius: 2px;
        margin: 0 auto;
        margin-right: 50%;
        margin-top: 12px;
        transform: translateX(50%);
      }
    }
  }
}
</style>
