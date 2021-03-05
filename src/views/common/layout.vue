<template>
  <div style="height: 100%" id="root-node-wrapper">
    <a-layout style="min-height: 100%" class="layout-wrapper">
      <a-layout-header class="header-wrapper" :style="{ position: 'fixed', zIndex: 99, width: '100%' }">
        <a-icon class="header-icon" type="codepen"/>
        <span class="header-title">浙商资产服务商招募管理系统-运营后台</span>
        <a-menu theme="dark" mode="horizontal" :default-selected-keys="[selectedKey]"
                :style="{ lineHeight: '64px',display:'inline-block',verticalAlign: 'top',height:'64px' }" />
        <div class="header-info">
          <a-dropdown :trigger="['click']" placement="bottomRight" size="large"
                      :getPopupContainer="e=>e.parentElement" >
            <a-menu slot="overlay" >
              <a-menu-item key="1">
                <div @click="handleModifyPwd"><a-icon class="personal-icon" type="lock" />修改登录密码</div>
              </a-menu-item>
              <a-menu-item key="2">
                <div @click="backLogin"><a-icon class="personal-icon" type="poweroff" />退出登录</div>
              </a-menu-item>
            </a-menu>
            <a-button type="link" icon="down" style="color:#fff;">Hi，{{username}}</a-button>
          </a-dropdown>
        </div>
      </a-layout-header>
      <router-view></router-view>
    </a-layout>
    <ModifyPwdModal ref="modifyPwd"></ModifyPwdModal>
  </div>
</template>
<script>
  // import { getInfo} from "@/plugin/api/base";
  import ModifyPwdModal from "./personal/modify-password";
  import { logout } from "@/plugin/api/login"
  export default {
    data() {
      return {
        loading:true,
        selectedKey:'a',
        info:{},
      };
    },
    components: {
      ModifyPwdModal,
    },
    methods:{
      handleModifyPwd(){
        this.$refs.modifyPwd.showModal()
      },
      backLogin(){
        this.$confirm({
          title:"是否退出登录?",
          centered:true,
					onOk:()=>{
						logout()
						this.$router.push('/login');
					}
        })
      }
    },
    created() {
			if(!window.localStorage.token) return this.$router.push('/login');
      if(this.passwordChanged === 0){
        const _this = this;
        this.$confirm({
          title:"为了您的账号和安全,请及时修改密码",
          centered:true,
          icon:"exclamation-circle",
          onOk(){
            _this.$refs.modifyPwd.showModal()
          }
        })
      }
      const { pathname } = window.location;
      if(/center/.test(pathname))this.selectedKey = 'b';
    },
    mounted() {
      // console.log('默认页面：首次加载！');
      // console.log('检查校验：判断及检查相关token信息！');
    },
    computed:{
      username(){
        return this.$store.getters.getInfo.name;
      },
      passwordChanged(){
        return this.$store.getters.getInfo.passwordChanged
      }
    }
  };
</script>

<style lang="scss">
.root-node-wrapper{

}
.layout-wrapper {
  .header{
    &-wrapper{
      padding: 0 20px;
    }
    &-icon{
      margin-right: 15px;
      font-size: 20px;
      color: #fff;
    }
    &-title{
      color: #fff;
      font-size: 16px;
      margin-right: 15px;
    }
    &-info{
      float: right;
      &-text{
        color: #FFFFFF;
        height: 100%;
        padding: 0 12px;
        line-height: 65px;
        &:hover{
          background-color: $common-base-active;
          cursor:pointer;
        }
      }
    }
  }
}
.personal-icon{
  padding-right: 6px;
}
.ant-modal-confirm-btns{
  margin-right:50%;
  transform: translateX(50%);
}
.spin-wrapper{
  width: 100%;
  padding-top: 10vh!important;
}
.ant-modal-confirm-btns{
  margin-right: 50%;
  transform: translateX(50%);
}
</style>
