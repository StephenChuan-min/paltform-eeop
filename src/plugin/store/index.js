import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    info:{},
    isLogin:false,
	  roleName:'',
	  roleConfig:{},
  },
  getters:{
    getInfo:(state)=> state.info,
	  getRole:({roleName,roleConfig})=>({roleName,roleConfig}),
  },
  mutations: {
    updateLoginStates:(state)=>{
      state.isLogin = true;
    },
    updateInfo:(state,infoSource = {})=>{
      state.info = Object.assign({},state.info,infoSource)
    },
	  updateToken:(state,token)=>{
		  window.localStorage.token = token;
	  },
    resetInfo:(state)=>{
      state.info = {};
      state.isLogin = false;
      window.localStorage.token = '';
    },
	  ruleInfo:(state,{roleName,config:deploy})=>{
			state.roleName = roleName;
			state.roleConfig = deploy;
	  },
  },
  actions: {
    updateInfo:(context,source)=>{
      context.commit('updateInfo',source);
    },
    login:(context,source)=>{
      context.commit('updateInfo',source);
	    context.commit('updateToken',source.token);
	    context.commit('updateLoginStates');
    },
  },
  modules: {
  }
})
