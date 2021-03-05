<template>
	<div class="qualifies-info-wrapper impression-wrapper">
		<div class="info-item">
			<div class="info-item_subtitle">入库审核面谈印象</div>
			<div class="info-item_list">
				<div class="info-item_list-title">擅长业务补充说明</div>
				<div class="info-item_list-content">{{dataSource.goodCaseDescription||'-'}}</div>
			</div>
			<div class="info-item_list">
				<div class="info-item_list-title">社会资源补充说明</div>
				<div class="info-item_list-content">{{dataSource.socialResourcesDescription||'-'}}</div>
			</div>
			<div class="info-item_list">
				<div class="info-item_list-title">标的金额补充说明</div>
				<div class="info-item_list-content">{{dataSource.amountRangeDescription||'-'}}</div>
			</div>
			<div class="info-item_list">
				<div class="info-item_list-title">其他补充说明</div>
				<div class="info-item_list-content">{{dataSource.otherDescription||'-'}}</div>
			</div>
			<div class="info-item_list">
				<div class="info-item_list-title">推荐人</div>
				<div class="info-item_list-content">{{dataSource.referrer||'-'}}</div>
			</div>
			<div class="info-item_subtitle">合作印象</div>
			<div class="info-item_timeLine" v-if="cooList.length">
				<a-timeline>
					<a-timeline-item color="#008CB0" v-for="(item,index) in cooList" :key="`list${index}`">
						<div class="info-timeLine-wrapper">
							<div class="info-timeLine-content">
								<span style="width:170px">添加时间：<i>{{item.addTime||'-'}}</i></span>
								<span>添加人：<i>{{item.operator||'-'}}</i></span>
							</div>
							<span>合作印象：<i>{{item.impression||'-'}}</i></span>
						</div>
					</a-timeline-item>
					<a-timeline-item color="#008CB0" v-if="auditStatus">
						<a-button @click="toAddEffect" icon="plus" size="large"
											style="width: 200px;margin-left: 20px"
						>添加合作印象</a-button>
					</a-timeline-item>
				</a-timeline>
			</div>
			<div class="info-item_img" v-else>
				<img :src="noFinished" alt="" style="width: 265px;"/>
				<div class="title">暂无合作印象</div>
				<a-button type="primary" @click="toAddEffect" v-if="auditStatus">添加第一条合作印象</a-button>
			</div>
		</div>
		<EffectModal ref="effect" @change="onEffectChange"></EffectModal>
	</div>
</template>

<script>

	import noFinished from '@/assets/img/no-finished.png';
	import { beStorage } from "@/plugin/api/provider";
	import EffectModal from './effect';

	export default {
		name:'Impression',
		props:{
			source:{
				type:Object,
				default:()=>({})
			},
			userId:String
		},
		data(){
			const { roleConfig } = this.$store.getters.getRole;
			return{
				noFinished,
				data:'',
				auditStatus:roleConfig.managePermission === 1,

			}
		},
		methods:{
			toAddEffect(){
				this.$refs.effect.toAdd(this.userId);
			},
			onEffectChange(){
				beStorage.impressionList(this.userId).then(res=>{
					if(res.code === 20000){
						this.data = res.data;
					}
				})
			}
		},
		components:{
			EffectModal,
		},
		computed:{
			dataSource(){
				return {...(this.source.int || {})}
			},
			cooList(){
				return  this.data || (this.source.coo || [])
			}

		}

	}
</script>

<style scoped lang="scss">

	.impression-wrapper{
		padding-top: 15px;
		.info-item{
			&_img{
				padding: 25px 0;
				text-align: center;
				.title{
					margin: 10px 0 20px 0;
				}
			}
			&_timeLine{
				padding: 30px 30px 30px 15%;
			}
		}
		.info-timeLine-wrapper{
			padding-bottom: 20px;
			padding-left: 20px;
			.info-timeLine-content{
				margin-bottom: 15px;
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
	}
</style>
