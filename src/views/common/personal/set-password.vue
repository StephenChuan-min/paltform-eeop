<template>
  <div class="personal-main">
    <div class="container" ref="container">
      <a-modal
        :bodyStyle="{ display: 'flex', justifyContent: 'center' }"
        :centered="true"
        :getContainer="() => $refs.container"
        :maskStyle="{ background: 'rgba(0, 0, 0, 0.5)' }"
        v-model="visible"
        title="设置登录密码"
      >
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="登录密码" prop="newPassword">
            <div slot="help" :class="passwordCheck[0] ? 'help act' : 'help'">
              • 长度6-20位
            </div>
            <div slot="help" :class="passwordCheck[1] ? 'help act' : 'help'">
              • 同时包含字母和数字
            </div>
            <div slot="help" :class="passwordCheck[2] ? 'help act' : 'help'">
              • 不支持空格
            </div>
            <a-input
              placeholder="请输入长度6-20位，同时包含数字和字母密码"
              v-model="form.newPassword"
              type="password"
              @change="check"
            />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="confirmPwd">
            <a-input
              placeholder="请再次输入登录密码"
              type="password"
              v-model="form.confirmPwd"
            />
          </a-form-model-item>
        </a-form-model>
        <button slot="footer" class="save-btn" @click="doSave">保存</button>
        <button slot="footer" class="cancel-btn" @click="cancel">取消</button>
      </a-modal>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { editPassword } from "@/plugin/api/personal";
import { encryptEditPwd } from "@/plugin/tools/encrypt";
export default {
  data() {
    return {
      visible: false,
      form: {
        newPassword: "",
        confirmPwd: "",
      },
      passwordCheck: [false, false, false],
      countdown: null,
      rules: {
        newPassword: [
          {
            required: true,
            trigger: "change",
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
  methods: {
    showModal() {
      this.visible = true;
    },
    check() {
      if (this.form.newPassword === "") {
        this.$refs.ruleForm.resetFields();
      }
      //长度6-20位校验
      const lengthCheck = (value) => {
        return !(value.length < 6 || value.length > 20);
      };
      //校验是否有数字
      const numberCheck = /\d/;
      //校验是否有字母
      const letterCheck = /[a-zA-Z]/;
      //校验是否有空格
      const blankSpaceCheck = /^[^ ]+$/;
      this.passwordCheck[0] = lengthCheck(this.form.newPassword);
      this.passwordCheck[1] = letterCheck.test(this.form.newPassword) && numberCheck.test(this.form.newPassword);
      this.passwordCheck[2] = blankSpaceCheck.test(this.form.newPassword);
    },
    cancel() {
      this.visible = false;
    },
    doSave() {
      if (this.form.newPassword === "") {
        this.$message.error("请输入密码");
        return;
      }
      if (this.passwordCheck.every((item) => item === true)) {
        this.$refs.ruleForm.validate((validate) => {
          if (!validate) {
            return false;
          } else {
            editPassword(
              encryptEditPwd({
                editType: 0,
                newPassword: this.form.newPassword,
              })
            ).then((res) => {
              console.log(res);
              if (res.code === 20000) {
                this.$message.success("密码设置成功,请重新登录");
                this.$router.push('/login')
              }
              if (res.code !== 20000) this.$message.error("密码设置失败");
            });
          }
        });
      } else {
        this.$message.error("该密码不可用");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.save-btn {
  width: 60px;
  height: 32px;
  background: #cccccc;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  border: none;
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
