<template>
	<div class="user-info-wrapper">
		<div class="info-icon">
			<img :src="icon" alt="" style="width: 80px;">
		</div>
		<div class="info-detail">
			<div class="info-detail_name">{{info.name}}</div>
			<div v-if="isLawyer">
				<span>服务商类型：<i>{{identity||'-'}}</i></span>
				<a-divider type="vertical" />
				<span>联系方式：<i>{{info.phone||'-'}}</i></span>
				<a-divider type="vertical" />
				<span>挂靠律所：<i>{{info.lawOffice||'-'}}</i></span>
			</div>
			<div v-else>
				<span>服务商类型：<i>{{identity||'-'}}</i></span>
				<a-divider type="vertical" />
				<span>联络人：<i>{{info.contact||'-'}}</i></span>
				<a-divider type="vertical" />
				<span>联系方式：<i>{{info.phone||'-'}}</i></span>
			</div>
		</div>
		<div class="info-audit info-detail" v-if="audit">
			<span>入库时间：<i>{{info.storageTime||'-'}}</i></span>
			<a-divider type="vertical" />
			<span>审核人：<i>{{info.storageAuditor||'-'}}</i></span>
		</div>
	</div>
</template>

<script>

	import IconLaw from '@/assets/img/lawyer.png';
	import IconOrg from '@/assets/img/org.png';

	export default {
		name:'UserInfo',
		props:{
			isLawyer:{
				type: Boolean,
				default:true,
			},
			info:{
				type:Object,
				default:()=>({})
			},
			audit:{
				type: Boolean,
				default:false,
			}
		},
		computed:{
			icon(){
				return this.isLawyer ? IconLaw : IconOrg;
			},
			identity(){
				if(this.info.identity){
					return (this.info.identity).toString() === '1' ? "律师" : "机构"
				}
				return ''
			}
		}
	}
</script>

<style scoped lang="scss">
.user-info-wrapper{
	display: flex;
	position: relative;
	background: #ffffff;
	padding: 15px 0;
	.info-icon{
		width: 80px;
		height: 80px;
		float: left;
		border-radius: 50%;
	}
	.info-detail{
		margin-left: 20px;
		&_name{
			font-size: 18px;
			line-height: 30px;
			font-weight: bold;
			margin-top: 10px;
			margin-bottom: 5px;
		}
		span{
			font-size: 14px;
			line-height: 20px;
			color: $text-remark;
			i{
				font-style: normal;
				color: $text-title;
			}
		}
	}
	.info-audit{
		position: absolute;
		right: 0;
		top: 10px;
		z-index: 2;
	}
	.ant-divider-vertical{
		margin: 0 20px;
	}
}
</style>
