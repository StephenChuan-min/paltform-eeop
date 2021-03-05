<template>
  <div class="personal-main">
    <div class="container" ref="container">
      <a-modal
        :bodyStyle="{ display: 'flex', justifyContent: 'center' }"
        :centered="true"
        :maskClosable="false"
        :getContainer="() => $refs.container"
        width="600px"
        :maskStyle="{ background: 'rgba(0, 0, 0, 0.5)' }"
        v-model="visible"
        title="修改登录密码"
      >
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item class="old-pwd" label="原密码" prop="oldPassword">
            <a-input
              type="password"
              placeholder="请输入原密码"
              v-model="form.oldPassword"
            />
          </a-form-model-item>
          <a-form-model-item class="new-pwd" label="新密码" prop="newPassword">
            <div slot="help" v-if="helpMsg">
              <div :class="passwordCheck[0] ? 'help act' : 'help'">
                • 长度6-20位
              </div>
              <div :class="passwordCheck[1] ? 'help act' : 'help'">
                • 同时包含字母和数字
              </div>
              <div :class="passwordCheck[2] ? 'help act' : 'help'">
                • 不支持空格
              </div>
            </div>
            <a-input
              placeholder="请输入长度6-20位，同时包含数字和字母密码"
              type="password"
              @change="check"
              v-model="form.newPassword"
            />
          </a-form-model-item>
          <a-form-model-item class="confirm-pwd" label="确认密码" prop="confirmPwd">
            <a-input
              placeholder="请再次输入登录密码"
              type="password"
              v-model="form.confirmPwd"
            />
          </a-form-model-item>
        </a-form-model>
        <button slot="footer" class="cancel-btn" @click="cancel">取消</button>
        <button slot="footer" class="save-btn" @click="doSave">保存</button>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { updatePassword } from "@/plugin/api/personal";
import { encryptEditPwd } from "@/plugin/tools/encrypt";
export default {
  data() {
    return {
      visible: false,
      form: {
        editType:this.passwordChanged,
        newPassword: "",
        oldPassword: "",
        confirmPwd: "",
      },
      passwordCheck: [false, false, false],
      helpMsg:false,
      rules: {
        oldPassword: [
          {
            required: true,
            message: "• 请输入原密码",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === this.form.oldPassword) {
                callback("• 新密码不能与原密码相同");
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        confirmPwd: [
          {
            required: true,
            message: "• 密码输入不一致,请重新输入",
            validator: (rule, value, callback) => {
              if (value !== this.form.newPassword) {
                callback("• 密码输入不一致,请重新输入");
              }
              callback();
            },
            trigger: "blur",
          },
        ],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  },
  computed:{
    passwordChanged(){
        return this.$store.getters.getInfo.passwordChanged
      }
  },
  watch:{
    visible:function(){
      if(this.visible === false) {
        this.$refs.ruleForm.resetFields();
        this.helpMsg = false;
        for(let i = 0;i < this.passwordCheck.length;i ++){
          this.passwordCheck[i] = false;
        }
      }
    }
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    cancel() {
      this.visible = false;
    },
    check() {
      this.helpMsg = true;
      //长度6-20位校验
      const lengthCheck = (value) => !(value.length < 6 || value.length > 20);
      //校验是否有数字
      const numberCheck = /\d/;
      //校验是否有字母
      const letterCheck = /[a-zA-Z]/;
      //校验是否有空格
      const blankSpaceCheck = /^[^ ]+$/;
      this.passwordCheck[0] = lengthCheck(this.form.newPassword);
      this.passwordCheck[1] =
        letterCheck.test(this.form.newPassword) &&
        numberCheck.test(this.form.newPassword);
      this.passwordCheck[2] = blankSpaceCheck.test(this.form.newPassword);
    },
    doSave() {
      if (this.form.newPassword === "") return this.$message.error("请输入密码");
      if (this.passwordCheck.every((item) => item === true)) {
        this.$refs.ruleForm.validate((checkStatus) => {
          if (checkStatus) {
            updatePassword(
              encryptEditPwd({
                editType: this.editType,
                oldPassword: this.form.oldPassword,
                newPassword: this.form.newPassword,
              })
            ).then((res) => {
              console.log(res);
              if (res.code === 20000) {
                this.$message.success("密码修改成功,请重新登录");
                this.$router.push('/login')
              }
              if (res.code === 50001) this.$message.error("密码错误,请重新输入");
              if (res.code !== 20000 && res.code !== 50001) this.$message.error("密码修改失败");
            });
          }
        });
      } else {
        this.$message.error("新密码不可用");
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.save-btn {
  width: 60px;
  height: 32px;
  background: #008CB0;
  border-radius: 2px;
  border: none;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 20px;
}
.cancel-btn {
  width: 60px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
  margin-left: 10px;
}
.help {
  font-size: 12px;
  font-weight: 400;
  color: #f5222d;
  line-height: 17px;
  margin-top: 4px;
  & ~ & {
    margin-top: 8px;
  }
  &.act {
    font-size: 12px;
    font-weight: 400;
    color: #52c41a;
    line-height: 17px;
  }
}
</style>
<style lang="scss">
.personal-main{
  .ant-modal-title{
    font-size: 16px;
    font-weight: 600;
    color: #262626;
  }
  .ant-modal-body{
    .ant-form-item{
      margin-top: 24px;
      height: 32px;
      input{
        width: 388px;
        height: 32px;
        &::placeholder{
          font-size: 14px;
          font-weight: 400;
          color: #BFBFBF;
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
    line-height: 12px;
    margin-top: 4px;
  }
}
</style>
