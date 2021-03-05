<template>
  <div class="layout-menu">
    <a-menu
        mode="inline"
        theme="dark"
        :default-selected-keys="defaultKey"
        :selectedKeys="selectedKeys"
        :inlineCollapsed="collapsed"
        :default-open-keys="defaultOpenKey"
    >
      <a-sub-menu v-for="item in source" :key="item.id">
        <span slot="title" v-if="item.title">
          <a-icon :type="item.icon" v-if="item.icon"/>{{item.title}}
        </span>
        <a-menu-item v-for="cItem in item.child" :key="`${item.id}${cItem.id}`">
          <router-link :to="`${item.path||''}${cItem.path||''}`">{{ cItem.title }}</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <div class="layout-menu-button" v-if="openCollapsed">
      <a-button type="link" block size="large" @click="toggleCollapsed">
        <a-icon type="swap" />
      </a-button>
    </div>
  </div>
</template>

<script>
	import { getMenu } from "@/plugin/tools/rule";

		export default {
		name: 'Menu',
		data() {
			return {
				openCollapsed:true,
				collapsed:false,
				defaultKey:['11'],
				selectedKeys:[],
				defaultOpenKey:['1','2','3','4','11'],
				source:[],
			};
		},
		created(){
			this.source = getMenu();
			const { path } = this.$route;
			this.selectedKeys = this.getSelectKey(path);
		},
		methods:{
			getSelectKey(path){
				let defaultKey = '1';
				let childKey = '1';
				this.source.filter(i=>i.path).forEach(i=>{
					if(new RegExp('^' + i.path).test(path)){
						defaultKey = i.id;
						(i.child || []).filter(i=>i.path).forEach(item=>{
							if(new RegExp('^' + i.path + item.path).test(path)) childKey = item.id;
						})
					}
				});
				return [defaultKey + childKey];
			},
			toggleCollapsed(){
				this.collapsed = !this.collapsed;
			},
		},
		mounted(){
		},
		watch:{
			$route(to,from){
				// console.log("to.path",to.path,from.path);
				if(to.path !== from.path) this.selectedKeys = this.getSelectKey(to.path);
			}
		}
	}
</script>

<style scoped>
.layout-menu{
  background-color: #001529;
  height: 100%;
  padding-bottom: 40px;
  position: relative;
}
.layout-menu .layout-menu-button{
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 1;
}
.layout-menu .ant-menu-item{
  margin: 0!important;
}
</style>
