<template>
	<div class="common-file-list">
		<div class="upload-wrapper" v-if="file.length">
			<a-upload :file-list="file" :remove="()=>false" size="large"  v-on="on"/>
		</div>
		<div v-else>-</div>
	</div>
</template>

<script>
	import { fileListRule } from "@/plugin/tools";
	import Deploy from '@/plugin/tools/qiniu-deploy';

	export default {
		name:'FileList',
		nameComment: '文件列表',
		props:{
			fileList:{
				type: String,
				default:''
			}
		},
		data() {
			return{
				list:[],
				on:{
					...Deploy.event
				}
			};
		},
		mounted(){
			// fileListRuleAsync(this.fileList).then(res=>this.list = res);
		},
		computed:{
			file(){
				return fileListRule(this.fileList)
			}
		},
		watch:{
			// fileList(oldVal,newVal){
			// 	if(oldVal !== newVal){
			// 		fileListRuleAsync(newVal).then(res=>this.list = res);
			// 	}
			// }
		},
	}
</script>

<style lang="scss">
	.common-file-list{
		/*display: inline-block;*/
		> span{
			display: flex;
		}
		.ant-upload-list{
			display: inline-block;
		}
		.ant-upload-list-item-card-actions{
			display: none;
		}
		.ant-upload-list-item{
			margin-top: 0;
			line-height: 24px;
			margin-bottom: 3px;
		}
		.ant-upload-list-item-info{
			padding-left: 0;
		}
	}
</style>
