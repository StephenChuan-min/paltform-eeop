<template>
	<div class="frame-wrapper">
		<Breadcrumb :source="navData" icon="environment"></Breadcrumb>
		<div class="frame-wrapper-content" v-if="spinning">
			<div style="height: 10vh;"></div>
			<a-spin class="spin-wrapper" tip="Loading......" size="large"/>
		</div>
		<div class="frame-wrapper-content" v-else style="padding-top: 0">
			<a-affix :offset-top="64">
				<div class="custom-card-position">
					<UserInfo :info="source.user" :isLawyer="isLawyer" />
					<div class="custom-card-container-remark">
						<div class="custom-card-container custom-card-container_normal">
							<a-tabs type="card" :active-key="activeKey" @change="val=>activeKey=val">
								<a-tab-pane key="1" tab="资质信息"></a-tab-pane>
								<a-tab-pane key="2" tab="要素信息" v-if="status.code !== 2"></a-tab-pane>
							</a-tabs>
						</div>
					</div>
				</div>
			</a-affix>
			<div class="custom-card-container">
				<a-tabs type="card" :active-key="activeKey" @change="val=>activeKey=val">
					<a-tab-pane key="1" tab="资质信息">
						<LastAudit type-text="资质" :source="source.qualifyCondition"/>
						<QualifyInfo :isLawyer="isLawyer" :source="source.qualify"/>
					</a-tab-pane>
					<a-tab-pane key="2" tab="要素信息" v-if="status.code !== 2">
						<LastAudit type-text="要素" :source="source.elementCondition" />
						<FactorInfo :isLawyer="isLawyer" :source="source.factor"/>
					</a-tab-pane>
				</a-tabs>
			</div>
			<a-affix :offset-bottom="0" v-if="status.code === 1">
				<div class="review-audit-wrapper" v-if="auditStatus">
					<a-button @click="toIntAdd">{{interview.status?"查看/编辑面谈印象":"添加面谈印象"}}</a-button>
					<a-button type="primary" @click="toAuditAdd" >添加审核结果</a-button>
				</div>
			</a-affix>
		</div>
		<a-modal v-model="interview.visible" title="面谈印象" v-bind="modal" dialogClass="audit-modal">
			<div style="padding-right: 100px">
				<a-form-model :model="interview.form" :label-col="{ span:8}" :wrapper-col="{ span: 16}">
					<a-form-model-item label="擅长业务补充说明">
						<a-textarea v-model="interview.form.goodCaseDescription" :rows="3"
												:maxLength="1024" placeholder="请输入服务商擅长业务的补充说明"></a-textarea>
					</a-form-model-item>
					<a-form-model-item label="社会资源补充说明">
						<a-textarea v-model="interview.form.socialResourcesDescription" :rows="4"
												:maxLength="1024" placeholder="请输入服务商社会资源优势的补充说明"
						></a-textarea>
					</a-form-model-item>
					<a-form-model-item label="金额范围补充说明">
						<a-textarea v-model="interview.form.amountRangeDescription" :rows="3"
												:maxLength="1024" placeholder="请输入服务商历史服务标的金额范围的补充说明"></a-textarea>
					</a-form-model-item>
					<a-form-model-item label="推荐人">
						<a-input v-model="interview.form.referrer" :maxLength="40" placeholder="请输入服务商的推荐人"/>
					</a-form-model-item>
					<a-form-model-item label="其他补充说明">
						<a-textarea v-model="interview.form.otherDescription" :rows="3"
												:maxLength="1024" placeholder="请输入其他方面补充说明"></a-textarea>
					</a-form-model-item>
				</a-form-model>
			</div>
			<div slot="footer" style="text-align: center">
        <a-button @click="toIntCancel">取消</a-button>
				<a-button type="primary" :loading="interview.loading" @click="toIntSubmit">提交</a-button>
			</div>
		</a-modal>
		<a-modal v-model="audit.visible" :title="audit.status ===1 ?'审核结果':'审核结果提交成功'" v-bind="modal"
		:width="audit.status === 1?'800px':'600px'"  dialogClass="audit-modal">
			<div style="padding:0 40px" v-if="audit.status ===1">
				<a-form-model :model="audit.form" :label-col="{ span:8}" :wrapper-col="{ span: 16}">
					<div class="text-dangerous">*资质信息与要素信息均审核通过后，该服务商将进入已入库名单，并获得已入库服务商权限。</div>
					<div class="common-text-subtitle" style="margin-top: 20px">资质信息审核</div>
					<a-form-model-item label="资质信息审核结果" v-if="audit.form.qualifyAudit !== 3">
						<span class="text-success" v-if="audit.form.qualifyAudit === 2">已通过</span>
						<a-radio-group v-model="audit.form.qualifyAudit" v-else>
							<a-radio :value="1" style="margin-right: 50px">通过</a-radio>
							<a-radio :value="0">不通过</a-radio>
						</a-radio-group>
					</a-form-model-item>
					<a-form-model-item label="未通过原因" v-if="audit.form.qualifyAudit === 0" required>
						<a-textarea v-model="audit.form.qualifyNotPassReason" :rows="3"
												:maxLength="1024" placeholder="请反馈审核不通过原因"></a-textarea>
					</a-form-model-item>
					<div class="common-text-subtitle" style="margin-top: 20px">要素信息审核</div>
					<a-form-model-item label="要素信息审核结果"  >
						<span class="text-success" v-if="audit.form.elementAudit === 2">已通过</span>
						<a-radio-group v-model="audit.form.elementAudit" v-else>
							<a-radio :value="1" style="margin-right: 50px">通过</a-radio>
							<a-radio :value="0">不通过</a-radio>
						</a-radio-group>
					</a-form-model-item>
					<a-form-model-item label="未通过原因" v-if="audit.form.elementAudit === 0" required>
						<a-textarea v-model="audit.form.elementNotPassReason" :rows="3"
												:maxLength="1024" placeholder="请反馈审核不通过原因"></a-textarea>
					</a-form-model-item>
				</a-form-model>
			</div>
			<div style="height: 95px;text-align: center" v-else>
				<a-icon type="check-circle" theme="filled" style="color: #3DBD7D;font-size: 56px;"/>
				<div class="text-remark" style="line-height: 20px;font-size: 14px;margin-top: 12px;">
					{{audit.status === 3
					?'审核结果提交成功，该服务商已进入“审核未通过”列表'
					:"审核结果提交成功，该服务商已成功入库！"}}
				</div>
			</div>
			<div slot="footer" style="text-align: center">
				<template v-if="audit.status ===1">
          <a-button @click="toAuditCancel">取消</a-button>
					<a-button type="primary" :loading="audit.loading" @click="toAuditSubmit">提交</a-button>
				</template>
				<router-link to="/provider/review"  v-else>
					<a-button type="primary">返回审核列表</a-button>
				</router-link>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import Breadcrumb from '@/components/bread-crumb';
	import UserInfo from '../_common/user-info';
	import QualifyInfo from '../_common/qualify-info';
	import FactorInfo from '../_common/factor-info';
	import LastAudit from './last-audit';
	import { auditStatus, toReview } from "@/plugin/api/provider";
	import { clearObject } from "@/plugin/tools";
	import { processData } from './deploy';

	// 获取当前状态
	const toStatus = ({qualifyStatus:q,elementStatus:e}) => {
		if(q === null && e === null) return { text:'开户待确认', code:4 };
		if(q === 2 || e === 2) return { text:'审核未通过', code:5 };
		if(q === 1 && e === null) return { text:'仅提交资质', code:2 };
		if((q === 1 && (e === 1 || e >= 3)) || (q >= 3 && e === 1)) return { text:'待审核', code:1 };
		if(q >= 3 && e >= 3) return { text:'当前服务商已入库', code:8 };
		return { text:'查询失败，请稍后重新！', code: 9 };
	};

	export default {
		name: 'ToReview',
		data() {
			const { roleConfig } = this.$store.getters.getRole;
			return {
				spinning: true,
				isLawyer:true,
				activeKey: '1',
				status: {},
				source:{
					user:{},
					qualify:{},
					factor:{},
				},
				interview:{
					status:false,
					loading:false,
					visible:false,
					backup:{},
					form:{
						amountRangeDescription:"",
						goodCaseDescription:"",
						otherDescription:"",
						referrer:"",
						serviceUserId:"",
						socialResourcesDescription:"",
					}
				},
				audit:{
					// 审核：1-待审核 2-审核通过 3-审核未通过
					status:1,
					loading:false,
					visible:false,
					form:{
						elementAudit:"",
						elementNotPassReason:"",
						qualifyAudit:"",
						qualifyNotPassReason:"",
					}
				},
				resultVisible: true,
				resultStatus: 1,
				auditStatus:roleConfig.managePermission === 1,
				modal:{
					width:'800px',
					centered:true,
					maskClosable:true,
					keyboard:false,

				}
			};
		},
		components:{
			Breadcrumb,
			UserInfo,
			QualifyInfo,
			FactorInfo,
			LastAudit,
		},
		created() {},
		methods:{
			toIntAdd(){
				console.log(this.interview);
				this.interview.form = {
					...this.interview.backup
				};
				this.$nextTick(()=>{
					this.interview.visible = true;
				});
			},
			toIntSubmit(){
				this.interview.loading = true;
				const { id } = this.$route.query;
				const form = this.interview.form;
				if(JSON.stringify(clearObject(form)) === '{}'){
					this.$message.error('请至少输入一项面谈印象');
					this.interview.loading = false;
				}else {
					toReview.impression({
						...form,
						serviceUserId:id,
					}).then(res=>{
						this.interview.loading = false;
						if(res.code === 20000){
							this.interview.visible = false;
							this.interview.status = true;
							this.interview.backup = { ...form };
							this.$message.success('操作成功！');
						}else{
							this.$message.error('添加/编辑面谈印象失败');
						}
					}).catch(()=>this.interview.loading = false);
				}
			},
			toIntCancel(){
				this.interview.visible = false;
			},
			toAuditAdd(){
				this.audit.visible = true;
			},
			toAuditSubmit(){
				this.audit.loading = true;
				const { elementAudit, qualifyAudit, elementNotPassReason, qualifyNotPassReason } = this.audit.form;
				if(elementAudit !== "" && qualifyAudit !== ""){
					if(qualifyAudit !== "" && qualifyAudit === 0 && !qualifyNotPassReason){
						this.audit.loading = false;
						return 	this.$message.error('请填写资质审核不通过原因');
					}
					if(elementAudit !== "" && elementAudit === 0 && !elementNotPassReason){
						this.audit.loading = false;
						return 	this.$message.error('请填写要素审核不通过原因');
					}
					const { id:serviceUserId, eid:elementId, qid:qualifyId } = this.$route.query;
					toReview.audit(clearObject({
						serviceUserId,
						elementId,
						qualifyId,
						identity:this.source.identity,
						...this.audit.form
					})).then(res=>{
						this.audit.loading = false;
						if(res.code === 20000){
							this.audit.status = (elementAudit === 0 || qualifyAudit === 0) ? 3 : 2;
						}else{
							this.$message.error('网络请求失败，请稍后再试！');
						}
					})
				}else {
					this.$message.error('请选择相关审核');
					this.audit.loading = false;
				}
			},
			toAuditCancel(){
				this.audit.visible = false;
			},
		},
		computed:{
			navData(){
				const str = this.status.text ? ('-' + this.status.text) : "";
				return [
					{id:1,title:'服务商管理',path:'/provider/review'},
					{id:2,title:'待审查',path:'/provider/review'},
					{id:3,title:'服务商详情页' + str,path:''},
				]
			},
		},
		mounted(){
			const { id, eid:elementId, qid:qualifyId } = this.$route.query;
			const params = {id,elementId,qualifyId};
			auditStatus(params).then(res=>{
				if(res.code === 20000){
					const _status = toStatus(res.data);
					const { qualifyStatus,elementStatus} = res.data;
					if(qualifyStatus >= 3) this.audit.form.qualifyAudit = 2;
					if(elementStatus >= 3) this.audit.form.elementAudit = 2;
					const { code, text } = _status;
					if(code === 8 || code === 9) {
						this.$message.error(text,1,()=> this.$router.push('/provider/review'));
					} else {
						toReview.detail(params).then(_res=>{
							if(_res.code === 20000){
								const { interviewImpression} = _res.data;
								this.interview.serviceUserId = id;
								if(interviewImpression){
									this.interview.status = true;
									this.interview.form = {
										...this.interview.form,
										...(interviewImpression || {}),
									};
									this.interview.backup = {
										...this.interview.form
									};
								}else{
									this.interview.status = false;
								}
								console.log(this.interview);

								this.source = processData(_res.data);
								this.status = _status;
								this.isLawyer = this.source.identity === 1;
								this.spinning = false;
							}else if(res.code === 80001){
								this.$message.error('数据请求错误，请稍后再试！',1,this.$router.replace('/provider/review'))
							} else{
								this.$message.error('网络请求异常，请稍后再试！')
							}
						})
					}
				}else{
					// this.$message.error('网络请求错误',1,()=> this.$route.push('/provider/review'));
				}
			})
		}
	}
</script>
<style lang="scss" scoped>
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

<style lang="scss">
.audit-modal{
  .ant-modal-header{
    .ant-modal-title{
      font-size: 18px;
      font-weight: bolder;
    }
  }
}
</style>