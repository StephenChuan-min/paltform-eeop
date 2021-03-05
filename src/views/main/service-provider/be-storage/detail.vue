<template>
	<div class="frame-wrapper">
		<Breadcrumb :source="navData" icon="environment"></Breadcrumb>
		<div class="frame-wrapper-content" v-if="spinning">
			<div style="height: 10vh;"></div>
			<a-spin class="spin-wrapper" tip="Loading......" size="large"/>
		</div>
		<div class="frame-wrapper-content" style="padding-top: 0" v-else>
			<a-affix :offset-top="64">
				<div class="custom-card-position">
					<UserInfo :info="source.user" :isLawyer="source.isLawyer" audit />
					<div class="custom-card-container-remark">
						<div class="custom-card-container custom-card-container_normal">
							<a-tabs type="card" :active-key="activeKey" @change="val=>activeKey=val">
								<a-tab-pane key="1" tab="资质信息"></a-tab-pane>
								<a-tab-pane key="2" tab="要素信息"></a-tab-pane>
								<a-tab-pane key="3" tab="印象标签"></a-tab-pane>
							</a-tabs>
						</div>
					</div>
				</div>
			</a-affix>
			<div class="custom-card-container custom-card-container_hidden">
				<a-tabs type="card" :active-key="activeKey">
					<a-tab-pane key="1" tab="资质信息">
						<div class="detail-audit-wrapper" v-if="qualifyStatus.isUpdate">
							<p>存在资质认证修改申请！</p>
							<a-button type="primary" @click="toAudit(2)">去查看</a-button>
						</div>
						<div class="audit-info-wrapper">
							<span style="width: 230px;">资质信息最后更新时间：<i>{{qualifyStatus.lastUpdateTime||'-'}}</i></span>
							<a-divider type="vertical" />
							<span>最后审核人：<i>{{qualifyStatus.lastAuditor||'-'}}</i></span>
						</div>
						<QualifyInfo :isLawyer="source.isLawyer" :source="source.qualify"/>
					</a-tab-pane>
					<a-tab-pane key="2" tab="要素信息">
						<div class="detail-audit-wrapper" v-if="elementStatus.isUpdate">
							<p>存在要素认证修改申请！</p>
							<a-button type="primary" @click="toAudit(3)">去查看</a-button>
						</div>
						<div class="audit-info-wrapper">
							<span style="width: 230px;">要素信息最后更新时间：<i>{{elementStatus.lastUpdateTime||'-'}}</i></span>
							<a-divider type="vertical" />
							<span>最后审核人：<i>{{elementStatus.lastAuditor||'-'}}</i></span>
						</div>
						<FactorInfo :isLawyer="source.isLawyer" :source="source.factor"/>
					</a-tab-pane>
					<a-tab-pane key="3" tab="印象标签">
						<Impression ref="impression" :source="impSource" :userId="userId" @Change="onEffectChange"/>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
	</div>
</template>

<script>
	import Breadcrumb from '@/components/bread-crumb';
	import UserInfo from '../_common/user-info';
	import QualifyInfo from '../_common/qualify-info';
	import FactorInfo from '../_common/factor-info';
	import Impression from './impression';
	import { beStorage } from "@/plugin/api/provider";
	import { processData } from '../to-review/deploy';

	export default {
		name: 'ToReview',
		data() {
			const { roleConfig } = this.$store.getters.getRole;
			return {
				navData:[
					{id:1,title:'服务商管理',path:'/provider/review'},
					{id:2,title:'已入库',path:'/provider/storage'},
					{id:3,title:'服务商详情页',path:''},
				],
				activeKey:'1',
				source:{
					isLawyer: true,
					user:{},
					qualify:{},
					factor:{},
				},
				spinning:true,
				userId:'',
				elementStatus:{},
				qualifyStatus:{},
				auditStatus:roleConfig.managePermission === 1,
			};
		},
		components:{
			Breadcrumb,
			UserInfo,
			QualifyInfo,
			FactorInfo,
			Impression
		},
		created() {
			const { id } = this.$route.query;
			this.userId = id;
			beStorage.detail({id,type:1}).then(res=>{
				if(res.code === 20000){
					const { storageUserDetail } = res.data;
					const { source,elementStatus,qualifyStatus} = processData(storageUserDetail,true);
					this.qualifyStatus = qualifyStatus;
					this.elementStatus = elementStatus;
					this.source = source;
					this.spinning = false;
				}else if(res.code === 80001){
					this.$message.error('数据请求错误，请稍后再试！',1,this.$router.replace('/provider/storage'))
				} else{
					this.$message.error('网络请求异常，请稍后再试！')
				}
			})
		},
		methods:{
			onEffectChange(status){
				console.log(status);
			},
			toAudit(type){
				this.$router.push({
					path:'/provider/storage/audit',
					query: { type,id:this.userId }
				})
			}
		},
		computed:{
			impSource(){
				return {
					int:this.source.interviewImpression,
					coo:this.source.cooperationImpressionList,
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	.custom-card-position{
		position: relative;
		.custom-card-container-remark{
			position: absolute;
			z-index: 1;
			bottom: -40px;
			width: 100%;
		}
		.custom-card-container_normal .ant-tabs-tabpane{
			padding: 0;
		}
	}
	.detail-audit-wrapper{
		height: 115px;
		background: rgba(8, 109, 217, 0.05);
		padding: 15px;
		text-align: center;
		p{
			margin: 10px 0;
		}
	}
	.audit-info-wrapper{
		margin-top: 15px;
		.ant-divider-vertical{
			margin: 0 20px;
		}
		span{
			font-size: 14px;
			line-height: 20px;
			color: $text-remark;
			display: inline-block;
			i{
				font-style: normal;
				color: $text-title;
			}
		}
	}

	.qualifies-info-wrapper{
		.info-item{
			padding: 7px 0;
			position: relative;
			&_date{
				position: absolute;
				top: 0;
				right: 20px;
				text-align: left;
				height: 20px;
				line-height: 20px;
				font-size: 14px;
				color: $text-remark;
				span{
					font-size: 16px;
					color: $text-title;
				}
			}
			&_title{
				border-left: 4px solid $common-base-active;
				padding-left: 6px;
				font-size: 16px;
				height: 25px;
				line-height: 25px;
			}
			&_subtitle{
				font-size: 14px;
				height: 25px;
				line-height: 25px;
				color: $text-title;
			}
			&_list{
				margin:22px 0;
				display: flex;
				line-height: 25px;
				&-title{
					width: 33.3%;
					font-size: 14px;
					color: $text-title;
					text-align: right;
					padding-right: 10px;
					&:after{
						content:'：'
					}
				}
				&-content{
					flex: 1;
					color: $text-content;
					.remark{
						display: block;
						font-size: 12px;
						color: $text-remark;
					}
				}
			}
		}
	}
</style>
<style lang="scss">
	.review-audit-wrapper{
		text-align: center;
		padding: 15px;
		border-top:1px solid #ddd;
		background: #fff;
		button{
			width: 200px;
			&:nth-child(1){
				margin-right: 20px;
			}
		}
	}

</style>
