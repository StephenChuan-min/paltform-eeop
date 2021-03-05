<template>
	<div v-if="source" style="padding-top: 10px;">
		<a-row style="margin-bottom: 10px">
			<a-col :span="8">
				<div class="span-wrapper">
					<span>上次{{typeText}}审核结果：<i :class="status.class">{{status.text}}</i></span>
				</div>
			</a-col>
			<a-col :span="8">
				<div class="span-wrapper">
					<span>上次审核时间：<i class="normal">{{info.auditTime||'-'}}</i></span>
				</div>
			</a-col>
			<a-col :span="8">
				<div class="span-wrapper">
					<span>上次审核人：<i class="normal">{{info.auditor||'-'}}</i></span>
				</div>
			</a-col>
		</a-row>
		<a-row v-if="!status.code">
			<a-col :span="24">
				<div class="span-wrapper">
					<span>未通过原因：<i class="normal">{{info.notPassReason||'-'}}</i></span>
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script>
	export default {
		name:'LastAudit',
		props:{
			source:Object,
			typeText:{
				type:String,
				default:''
			}
		},
		computed:{
			info(){
				return {...this.source}
			},
			status(){
				return{
					code:this.info.auditResult,
					class:this.info.auditResult ? 'text-title' : "text-error",
					text:this.info.auditResult ? '已通过' : '不通过',
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.span-wrapper{
		span{
			font-size: 14px;
			line-height: 20px;
			color: $text-remark;
			i{
				font-style: normal;
			}
			.normal{
				color: $text-title;
			}
		}
	}
</style>
