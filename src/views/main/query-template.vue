<template>
	<div class="frame-wrapper">
		<Breadcrumb :source="navData" icon="environment">
			<OpenAccount slot="suffix" />
		</Breadcrumb>
		<div class="frame-wrapper-content">
			<div class="frame-query">
				<a-form-model layout="inline" @submit="handleSubmit" @submit.native.prevent>
					<a-form-model-item>
						<a-input v-model="query.username" placeholder="请输入联络人姓名" class="custom-prefix-6">
							<template slot="prefix" >
								<div class="query-item-prefix">联络人姓名</div>
							</template>
						</a-input>
					</a-form-model-item>
					<a-form-model-item label="提交日期：" style="margin-bottom:0;">
						<a-form-model-item>
							<a-date-picker v-model="query.startTime" style="width: 100%" placeholder="搜索范围起始日期"
														 :disabled-date="val=>disabledDate(val,query.endTime,'start')"></a-date-picker>
						</a-form-model-item>
						<span :style="{ display: 'inline-block',marginLeft:'-5px',width:'20px'}">至</span>
						<a-form-model-item>
							<a-date-picker v-model="query.endTime" style="width: 100%" placeholder="搜索范围截止日期"
														 :disabled-date="val=>disabledDate(query.startTime,val)"></a-date-picker>
						</a-form-model-item>
					</a-form-model-item>
					<a-form-model-item label="机构类型：">
						<a-select v-model="query.orgType" placeholder="请选择机构类型" style="width: 150px">
							<a-select-option value="1">Option 1</a-select-option>
							<a-select-option value="2">Option 2</a-select-option>
							<a-select-option value="3">Option 3</a-select-option>
						</a-select>
					</a-form-model-item>
					<a-form-model-item>
						<a-button type="primary" html-type="submit">查询</a-button>
					</a-form-model-item>
				</a-form-model>
			</div>
			<div class="frame-content">
				<a-tabs @change="handleTabChange">
					<a-tab-pane v-for="i in tabPane" :key="i.id" :tab="i.title"></a-tab-pane>
				</a-tabs>
				<div style="height: 4px"></div>
				<div class="content-action">
					<a-button>全部</a-button>
					<a-button>只显示未读</a-button>
					<a-button>全部标为已读</a-button>
					<a-button icon="search">名单一键导出</a-button>
				</div>
				<div style="height: 4px"></div>
				<a-table :columns="columns" :data-source="dataSource" size="middle" :pagination="pagination" @change="handleTableChange">
					<template slot="auction">
						<a-button type="link" size="small" icon="file-text" :style="{paddingLeft: 0}">详情</a-button>
						<a-icon type="line" :style="{transform: 'rotate(90deg)',margin:'0 -5px'}"/>
						<a-button type="link" size="small" icon="form" >标签及审核结果添加</a-button>
					</template>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script>
	import Breadcrumb from '@/components/bread-crumb';
	import OpenAccount from './service-provider/_common/account';
	import { clearProto, disabledDate } from "@/plugin/tools";

	const columns1 = [
		{
			title: '联络人姓名',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '联系方式',
			dataIndex: 'age',
			key: 'age',
			width: 80,
		},
		{
			title: '机构类型',
			dataIndex: 'address',
			key: 'address 1',
		},
		{
			title: '机构名称',
			dataIndex: 'address',
			key: 'address 2',
		},
		{
			title: '从业时长',
			dataIndex: 'address',
			key: 'address 3',
		},
		{
			title: '涉业地区',
			dataIndex: 'address',
			key: 'address 41',
		},
		{
			title: '团队规模',
			dataIndex: 'address',
			key: 'address 42',
		},
		{
			title: '要素提交日期',
			dataIndex: 'address',
			key: 'address 43',
		},
		{
			title: '操作',
			dataIndex: 'address',
			key: 'address 44',
			scopedSlots: { customRender: 'auction' },
			width: 260,
		},
	];

	export default {
		name: 'ToReview',
		data() {
			return {
				navData:[
					{id:1,title:'服务商管理',path:'/provider/review'},
					{id:2,title:'待审查',path:'/provider/review'},
				],
				tabPane:[
					{ id:'1', title:'已提交要素表' },
					{ id:'2', title:'已认证资质' },
					{ id:'3', title:'仅注册' },
					{ id:'4', title:'开户确认中' },
					{ id:'5', title:'审核未通过' },
				],
				columns:columns1,
				dataSource:[{
					key:1,
					name:'临时用户',
				}],
				query:{
					username:"",
					startTime:'',
					endTime:'',
					orgType:undefined,
				},
				pagination:{
					current:1,
					total:1,
					showQuickJumper:true,
					showLessItems:true,
					size:'middle',
					showTotal:val=>`共${val}条信息`,
				},
				disabledDate,
			};
		},
		components:{
			OpenAccount,
			Breadcrumb,
		},
		created() {
		},
		methods:{
			handleSubmit(e){
				e.preventDefault();
				console.log(clearProto(this.query));
			},
			handleTabChange(val){
				console.log(val);
			},
			handleTableChange(ev){
				console.log(ev);
			},
		},
		computed:{
		},
	}
</script>

<style scoped>
	.content-action{
		margin-bottom: 10px;
	}
	.content-action button{
		margin-right: 15px;
	}
</style>
