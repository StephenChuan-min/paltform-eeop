<template>
  <div class="login-container">
      <div class="login-box">
          <div class="logo">
            <img src="../../assets/image/logo.jpg" alt="logo">
          </div>
          <div class="login-video">
          </div>
             <!-- 表单区域 -->
            <div class="login-content">
              <div class="title">服务商招募管理系统</div>
                <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs" >
                  <el-tab-pane class="q-login" label="快捷登录" name="first">
                    <el-form ref="reform1" :model="form" class="login-form" :rules="dynamincRules">
                          <el-form-item prop="phone">
                              <el-input v-model="form.phone" class="input" placeholder="请输入手机号" maxlength="11" prefix-icon="el-icon-user"></el-input>
                            </el-form-item>
                            <el-form-item prop="phoneCode" class="pr">
                                <el-input placeholder="请输入验证码" id="inp" v-model="form.phoneCode" prefix-icon="el-icon-user" >
                                </el-input>
                                <el-button @click="getCode" class="code-btn" :disabled="!show">
                                    <span v-show="show">发送验证码</span>
                                    <span v-show="!show" class="count">获取验证码({{countCode}} s)</span>
                                </el-button>
                            </el-form-item>
                            <el-form-item class="btns">
                                <el-button  class="login-text" type="info" @click="login1">登 录</el-button>
                            </el-form-item>
                            <!-- 注册成为浙商资产服务商 -->
                          <div class="login-service"><u>注册成为浙商资产服务商</u></div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="密码登录" name="second" >
                        <el-form ref="reform" :model="form" class="login-form" :rules="dynamincRules">
                          <el-form-item prop="phone" type="number">
                              <el-input v-model="form.phone" prefix-icon="el-icon-user" placeholder="请输入手机号" maxlength="11"></el-input>
                          </el-form-item>
                          <el-form-item prop="password">
                              <el-input v-model="form.password" type="password"  prefix-icon="el-icon-user" placeholder="请输入密码"></el-input>
                          </el-form-item>
                          <el-form-item prop="pictureCode" v-if="count >= 3 ? this.titleClass: false"  class="verification-item" >
                              <el-input v-model="form.pictureCode" id="verification-code" placeholder="请输入图片验证码">
                              </el-input>
                                  <span class="verification-get">验证码图片</span>
                          </el-form-item>
                          <el-form-item class="btns" :class="{titleClass}">
                              <!-- v-if="this.isNum===0 ? disabled : !disabled" -->
                              <el-button
                              class="login-text"
                              type="info"
                              @click="login"
                              plain
                              >登 录</el-button>
                          </el-form-item>
                          <!-- <el-form-item>
                            <el-button
                                class="login-text"
                                type="info"
                                @click="handleSubmit"
                                plain
                            >模 拟 登 录</el-button>
                          </el-form-item>
                          注册成为浙商资产服务商 -->
                          <div class="login-service"><u>注册成为浙商资产服务商</u></div>
                        </el-form>
                  </el-tab-pane>
                </el-tabs>
            </div>
      </div>
  </div>
</template>

<script>
import { authLogin, authCode } from "@/plugin/api/login";
import { encryptInfo } from "@/plugin/tools/encrypt";
const timeCount = 5; //倒计时时间
export default {
  name:'login',
  data () {
    // 手机号校验规则
    const checkMobile = (rule, value, callback) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        return callback()
      }
      return callback(new Error('手机号格式不正确'))
    };
    return {
      count: 0,
      activeName: 'second',
      // 控制验证码的显示与隐藏
      // isCountShow: false,
      // loginType: 2,
      form: {
        // {
        loginType: "",
        password: "123456",
        phone: "17630829902",
        phoneCode: "958260",
        pictureCode: ""
      },
      // 控制title的位置
        titleClass: false,
      // 定义校验规则phone
      rules: {
        phone: [
          { required: true, message: '请输入正确手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        pictureCode: [
          { required: true, message: '请输入图片验证码', trigger: 'blur' },
        ],
      },
      rules1: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      // 计算登陆错误的次数
      num: 0,
      // 快捷登录的次数
      // queryNum: 0,
      isNum:5,
      show: true,
      countCode: '',
      timer: null
    }
  },
  methods: {
    resetForm () {
      this.$refs.reform.resetFields()
    },
    // 密码登录
    login () {
      this.$refs.reform.validate(flag => {
        if (!flag) return;
        authLogin(encryptInfo({
        "loginType": 1,
        "password": this.form.password,
        "phone": this.form.phone,
        // "phoneCode": this.form.phoneCode,
        "pictureCode": this.form.pictureCode
        // "pictureCode": ""
        })).then(({data,code})=>{
          // console.log(code);
          // console.log(code.count);
            console.log(data.count);
          if (data.count >= 3) {
            this.count = data.count;
            this.titleClass = true;
            return
          }
          if (code === 30001) {
           return this.$message.error('手机号或密码错误')
          }
        })
      })
        // console.log(this.$refs.reform);
        // const correct = this.$refs.reform.model.phone === this.data.phone && this.$refs.reform.model.password === this.data.password
        // if(correct) {
        //   this.$message.success('登陆验证成功')
        //   this.$router.push('/overview')
        //   return
        // }
        // const normal = this.$refs.reform.model.phone === '15639782785' && this.$refs.reform.model.password === '123456' && this.form.phoneCode === '1111'
        // if (this.num > 0 && this.num <= 3) {
        //   if (this.num >= 2 && this.num < 4) {
        //     // console.log('输入3次了');
        //     this.titleClass = true
        //   }
        //   this.$message.error('账号或者密码错误,请重新登录')
        // }
        // if (this.num >= 4 && this.num < 9) {
        //       if(normal) {
        //         this.$message.success('登陆验证成功')
        //         this.$router.push('/overview')
        //         return
        //       }
        //       this.$message.error(`账号或者密码错误，您还可以尝试${this.isNum}次`)
        //       parseInt(this.isNum--)
        //     }
        //     if (this.num >= 9) {
        //       this.$message.error('您的账号已被冻结，一小时后再尝试')
        //       return false
        //     }
        // // 校验手机号和密码
        // const check = this.$refs.reform.model.phone !== '15639782785' || this.$refs.reform.model.password !== '123456'
        // if (check) {
        //   console.log(check);
        //   if (this.num === 0) {
        //     this.$message.error('账号或者密码错误,请重新登录')
        //   }
        //   parseInt(this.num++)
        //   return
        // }
        // // 验证码校验
        // const checkVerification = this.form.phoneCode !== '1111'
        // if (checkVerification) {
        //   return this.$message.error('验证码错误')
        // }
        // this.$message.success('登陆验证成功')
        // this.$router.push('/overview')
    },
    // 点击快捷登录按钮
    login1 () {
      this.$refs.reform1.validate(flag => {
        if (!flag) return;
        authLogin(encryptInfo({
        "loginType": 0,
        "password": '',
        "phone": this.form.phone,
        "phoneCode": this.form.phoneCode,
        // "pictureCode": ""
        })).then(({data,code})=>{
          // console.log(res.data.count);
          console.log(code);
          console.log(data);
          if(code === 20000) {
            this.$store.dispatch('login',data);
            this.$info({
              title: 'This is a notification message',
              content: '登录成功！确认后跳转',
              onOk:()=> {
                this.$router.push('/');
              },
            })
            // return
          }
          if(code === 30003) return this.$message.error('验证码错误')
          // 手机号是不是被锁定待完善
        })
      })
    },
    // 点击tab触发
    handleClick () {
      // 触发tab标签清空校验规则
      // this.activeName === 'second' ? this.$refs.reform.resetFields() : this.$refs.reform1.resetFields()
      // this.$refs.reform.resetFields()
      // this.$refs.reform1.resetFields()
      this.password = ''
    },
    // 点击发送验证码触发函数
    getCode: function () {
      // 验证手机号是否合法
      this.$refs.reform1.validateField('phone', async valid => {
        if (valid) {
          return false
        } else {
          this.show = false;
          const res = await authCode(encryptInfo({
            "boo": true,
            "datas": [2, 7, 9],
            "phone": this.form.phone
          }));
          console.log(res);
          // this.$message.successs('请在一分钟内获取验证码登录')
        }
      });
      // 验证码倒计时
      if (!this.timer) {
        this.countCode = timeCount;
        this.timer = setInterval(() => {
          if (this.countCode > 0 && this.countCode <= timeCount) {
            this.countCode--
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null
          }
        }, 1000)
      }
    }
  },
    // handleSubmit() {
    //   authLogin(encryptInfo({
    //     "loginType": 1,
    //     "password": "123456",
    //     "phone": "17630829902",
    //     "phoneCode": "",
    //     "pictureCode": ""
    //   })).then(({data,code})=>{
    //     if(code === 20000){
    //       console.log(data);
    //       this.$store.dispatch('login',data)
    //       this.$info({
    //         title: 'This is a notification message',
    //         content: '登录成功！确认后跳转',
    //         onOk:()=> {
    //           this.$router.push('/');
    //         },
    //       })
    //     }
    //   })
    // },
  mounted() {

  },
  computed :{
    // 动态切换校验规则
    dynamincRules () {
      console.log(1);
      return this.activeName === 'second' ? this.rules : this.rules1
    }
  }
}
</script>

<style scoped lang='scss'>
    .login-container {
        position: relative;
        height: 100%;
        width: 100%;
        background-color: #2b4b6b;
        /deep/.el-tabs__nav-wrap::after {
          width: 0;
        }
        .login-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform:translate(-50%,-50%);
            width: 1306px;
            height: 480px;
            // background: #FFFFFF;
            box-shadow: 4px 6px 15px 0 rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            box-sizing: border-box;
            display: flex;
            .logo {
              position: absolute;
              width: 223px;
              height: 72px;
              top: -96px;
              left: 0;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .login-video {
            width: 879px;
            height: 480px;
            background-color: #ccc;
            }
            .login-content {
              // position: relative;
              margin-left: 25px;
              width: 402px;
              height: 480px;
              background: #FFFFFF;
              box-shadow: 4px 6px 15px 0 rgba(0, 0, 0, 0.2);
              border-radius: 2px;
              .tabs {
                width: 368px;
                 color: #008CB0;
                /deep/.el-tabs__nav-scroll {
                  width: 368px;
                  display: flex;
                  font-size: 16px;
                  /*font-family: PingFangSC-Regular, PingFang SC;*/
                  font-weight: 400;
                  color: #008CB0;
                  // margin-top: 50px;
                  justify-content: space-around;
                }
              }
              //输入框
              /deep/.input-code {
                padding: 0!important;
              }
              .el-tabs__nav-scroll {
                position: relative;
                // color: pink;
              }
              /deep/.el-tabs__item  {
                position: relative;
                width: 112px;
                font-size: 16px;
                text-align: center;
                color: #666;
                box-sizing: content-box;
              }
              /deep/.el-tabs__active-bar {
                width: 112px;
                height: 2px;
                background: #008CB0;
              }
              /deep/.is-active {
                color: #008CB0;
              }
              .title {
                margin: 42px 55px 50px;
                width: 254px;
                height: 28px;
                font-size: 28px;
                /*font-family: PingFangSC-Medium, PingFang SC;*/
                font-weight: 500;
                color: #008CB0;
                line-height: 28px;
              }
              .titleClass {
                margin-top: 30px!important;
              }
              // /deep/#inp {

              // }
              .el-input {
                width: 338px;
                height: 40px;
                background: #FFFFFF;
                border-radius: 2px;
                // border: 1px solid #D9D9D9;
                margin: 0 30px;
                // margin-top: 8px;
                position: relative;
                // 验证码
                .checking {
                  position: absolute;
                  top: 12px;
                  right: 16px;
                  width: 128px;
                  height: 40px;
                  font-size: 16px;
                  font-weight: 400;
                  color: #008CB0;
                  line-height: 16px;
                }
              }
              /deep/.el-form-item__error {
                padding-left: 30px;
              }
            }
            // 按钮
            .btns {
              margin: 0 30px;
              margin-top: 70px;
              width: 338px;
              height: 40px;
              line-height: 40px;
              background: #008CB0;
              border-radius: 2px;
              color: #ccc;
              text-align: center;
              .login-text {
              width: 100%;
              background: #008CB0;
              border-radius: 2px;
              height: 24px;
              font-size: 16px;
              font-weight: 400;
              color: #FFFFFF;
              line-height: 24px;
              }
              .el-button {
                width: 100%;
                padding: unset;
                background: unset;
                border: unset;
              }
            }
            // .el-button {
            //   // width: 100%;
            // }
            // 验证码框外层
            .verification-item {
              position: relative!important;
              border: none;
              .verification-get {
                position: absolute;
                top: 0;
                right: 0;
                text-align: center;
                width: 128px;
                height: 40px;
                background: #FFFFFF;
                border-radius: 2px;
                border: 1px solid #D9D9D9;
              }
            }
            // 验证码左侧框
            /deep/#verification-code {
              position: relative;
              width: 200px;
              height: 40px;
              background: #FFFFFF;
              border-radius: 2px;
              border: 1px solid #D9D9D9;
            }
       }
    }
    // input外层组件包裹样式清除
    /deep/.el-form-item {
      width: 368px;
      height: 40px;
      background: #FFFFFF;
      border-radius: 2px;
      margin-top: 8px;
      position: relative;
    }
    .login-service {
      margin-top: 24px;
      width: 154px;
      height: 14px;
      font-size: 14px;
      /*font-family: PingFangSC-Regular, PingFang SC;*/
      font-weight: 400;
      color: #008CB0;
      line-height: 14px;
      float: right;
    }
    // 倒计时效果
    .pr {
      position: relative;
    }
    .code-btn {
      width: 100px;
      height: 34px;
      position: absolute;
      top: 3px;
      right: 25px;
      z-index: 222;
      color: #333;
      font-size: 14px;
      border: none;
      // border-left: 1px solid #bababa;
      // padding-right: 16px;
      background-color: #fff;
    }
</style>
