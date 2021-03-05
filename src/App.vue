<template>
  <a-config-provider :locale="locale">
    <div id="app">
			<a-spin v-if="loading" class="spin-wrapper" size="large" tip="数据加载中，请稍后..." />
			<router-view v-else ></router-view>
    </div>
  </a-config-provider>
</template>
<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
	import { getInfo } from "@/plugin/api/base";
	import { ruleProcess } from "@/plugin/tools/rule";

	export default {
		name: 'rootNode',
		data() {
			return {
				locale: zhCN,
				loading: false,
			};
		},
		created(){
			const { hash } = window.location;
			// console.log(!window.localStorage.token,(/^#\/login/.test(hash)));
			if(!window.localStorage.token || (/^#\/login/.test(hash))){
				this.$router.push('/login');
			}else{
				this.loading = true ;
				getInfo().then(res=>{
					if(res.code === 20000){
						ruleProcess(this,res.data);
						this.loading = false;
					}else{
						this.$router.push('/login');
						this.loading = false;
					}
				}).catch(()=>{
					this.loading = false;
					this.$router.push('/login');
				})
			}
		}
	}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  min-width: 1200px;
}
.spin-wrapper{
	width: 100%;
	padding-top: 10vh!important;
}


</style>

