<template>
	<div class="frame-wrapper">
		<Breadcrumb :source="navSource" icon="environment"></Breadcrumb>
		<div class="frame-wrapper-content" v-if="spinning">
			<div style="height: 10vh;"></div>
			<a-spin class="spin-wrapper" tip="Loading......" size="large"/>
		</div>
		<div class="frame-wrapper-content" style="padding-top: 0" v-else>
			<a-affix :offset-top="64">
				<div class="custom-card-position">
					<UserInfo :info="source.user" :isLawyer="source.isLawyer" />
				</div>
			</a-affix>
			<QualifyInfo v-bind="info" :source="source.qualify" v-if="type === 2" />
			<FactorInfo v-bind="info" :source="source.factor" v-if="type === 3"/>
			<a-affix :offset-bottom="0" v-if="auditStatus">
				<div class="review-audit-wrapper">
					<a-button type="primary" @click="visible = true">添加审核结果</a-button>
				</div>
			</a-affix>
		</div>
		<a-modal v-model="visible" title="审核结果" v-bind="modal">
				<a-form-model  :label-col="{ span:6}" :wrapper-col="{ span: 18}">
					<a-form-model-item :label="`${type===2?'资质':'要素'}信息审核结果`"  >
						<a-radio-group v-model="form.audit">
							<a-radio :value="1" style="margin-right: 50px">通过</a-radio>
							<a-radio :value="0">不通过</a-radio>
						</a-radio-group>
					</a-form-model-item>
					<a-form-model-item label="未通过原因" v-if="form.audit === 0" required>
						<a-textarea v-model="form.notPassReason" :rows="4" style="width: 500px"
												:maxLength="1024" placeholder="请反馈审核不通过原因"></a-textarea>
					</a-form-model-item>
				</a-form-model>
			<div slot="footer" style="text-align: center">
				<a-button type="primary" :loading="loading" @click="toAuditSubmit">提交</a-button>
				<a-button @click="visible = fasle">取消</a-button>
			</div>
		</a-modal>

	</div>
</template>

<script>
	import Breadcrumb from '@/components/bread-crumb';
	import UserInfo from '../_common/user-info';
	import QualifyInfo from '../_common/qualify-info';
	import FactorInfo from '../_common/factor-info';
	import { beStorage } from "@/plugin/api/provider";
	// import { processData } from '../to-review/deploy';

	export default {
		name: 'Audit',
		data() {
			const { roleConfig } = this.$store.getters.getRole;
			return {
				auditStatus:roleConfig.managePermission === 1,
				source:{
					isLawyer: true,
					user:{},
					qualify:{},
					factor:{},
				},
				infoId:'',
				spinning:true,
				visible:false,
				loading:false,
				type:'',
				form:{
					audit:'',
					notPassReason:'',
				},
				modal:{
					width:'800px',
					centered:true,
					maskClosable:true,
					keyboard:false,
					closable:false,
				}
			};
		},
		components:{
			Breadcrumb,
			UserInfo,
			QualifyInfo,
			FactorInfo,
		},
		created() {
			const { id,type } = this.$route.query;
			this.userId = id;
			this.type = Number(type);
			if(type === '2' || type === '3') {
				beStorage.detail({id,type:this.type}).then(res=>{
					if(res.code === 20000){
						const { elementModifyVO, qualifyModifyVO } = res.data;
						const { identity, name, phone,} = elementModifyVO || qualifyModifyVO || {};
						this.source.isLawyer = identity === 1;
						this.source.identity = identity;
						this.source.user = {
							identity,
							name:identity === 2 ? ((qualifyModifyVO || {}).organizationQualify || {}).name : name,
							contact:name,
							lawOffice:((qualifyModifyVO || {}).lawyerQualify || {}).lawOffice,
							phone,
						};
						if(this.type === 2){
							const { organizationQualify = {} ,lawyerQualify = {}, qualifyId} = qualifyModifyVO;
							this.source.qualify = {
								...lawyerQualify,
								...organizationQualify,
							};
							this.infoId = qualifyId;
						}
						if(this.type === 3){
							const { organizationElement = {} ,lawyerElement = {}, elementId} = elementModifyVO;
							this.source.factor = {
								...lawyerElement,
								...organizationElement,
							};
							this.infoId = elementId;
						}
					} else{
						this.$message.error('网络请求异常，请稍后再试！',1,()=>{
							this.$router.push('/provider/storage')
						})
					}
					this.spinning = false;
				})
			}else{
				this.$message.error('当前数据有误，请重新查询！',1,()=>{
					this.$router.push('/provider/storage')
				})
			}
		},
		methods:{
			toAuditSubmit(){
				const { audit, notPassReason } = this.form;
				if(audit === 0 && !notPassReason) return this.$message.error('请反馈审核不通过原因');
				beStorage.audit({
					audit,
					notPassReason,
					type:this.type === 2 ? 1 : 2,
					serviceUserId:this.userId,
					identity:this.source.identity,
					id:this.infoId
				}).then(res=>{
					if(res.code === 20000){
						this.$message.success('审核操作成功！',1,this.$router.push('/provider/storage'));
					}else{
						this.$message.error('操作失败，请稍后再试！');
					}
				});
				console.log('toAuditSubmit');
			}
		},
		computed:{
			info(){
				return {
					isLawyer:this.source.isLawyer,
					status:3
				}
			},
			navSource(){
				const { type } = this.$route.query;
				const str = (type === '2' || type === '3' )
					? (type === '2' ? ' - 资质修改申请' : ' - 要素修改申请') : '';
				return [
					{id:1,title:'服务商管理',path:'/provider/review'},
					{id:2,title:'已入库',path:'/provider/storage'},
					{id:3,title:`服务商详情页${str}`,path:''},
				]
			}
		},
	}
</script>

<style scoped lang="scss">
	.custom-card-position{
		position: relative;
		border-bottom: 1px solid $border-base;
		margin-bottom: 10px;
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
		background-color: #086DD9;
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
