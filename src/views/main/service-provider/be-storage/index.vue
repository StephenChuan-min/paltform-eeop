<template>
	<div class="frame-wrapper">
		<Breadcrumb :source="navData" icon="environment" />
		<div class="frame-wrapper-content">
			<div class="frame-query frame-query-position">
				<a-form-model layout="inline" @submit="handleSubmit" @submit.native.prevent >
					<a-form-model-item style="float: right;margin-right: 0;">
						<a-space>
							<a-button style="width: 60px" @click="toResetQuery">重置</a-button>
							<a-button type="primary" html-type="submit" style="width: 60px">查询</a-button>
						</a-space>
					</a-form-model-item>
					<div style="padding-right: 150px">
						<a-form-model-item label="联络人姓名">
							<a-input v-model="query.name" placeholder="请输入联络人姓名" style="width: 200px"></a-input>
						</a-form-model-item>
						<a-form-model-item label="机构名称/挂靠律所">
							<a-input v-model="query.orgOfficeName" placeholder="请输入机构名称/挂靠律所名称" style="width: 270px">
							</a-input>
						</a-form-model-item>
						<a-form-model-item label="服务商类型：">
							<a-select v-model="query.identity" placeholder="请选择身份类型" style="width: 150px" allowClear>
								<a-select-option :value="1">律师</a-select-option>
								<a-select-option :value="2">机构</a-select-option>
							</a-select>
						</a-form-model-item>
						<a-form-model-item label="擅长业务区域："  v-if="activeKey===1">
							<a-cascader v-model="query.areaGoodCases" v-bind="areaProps" style="width: 230px" />
						</a-form-model-item>
						<a-form-model-item label="合作意向：" v-if="activeKey===1">
							<a-select v-model="query.cooperationIntention" placeholder="请选择合作意向" style="width: 150px" allowClear >
								<a-select-option v-for="i in cooIntent" :key="i.id" :value="i.value">{{i.label}}</a-select-option>
							</a-select>
						</a-form-model-item>
					</div>
				</a-form-model>
				<a-tabs @change="handleTabChange" :activeKey="activeKey">
					<a-tab-pane v-for="i in tabPane" :key="i.id">
						<a-badge :dot="i.dot" class="dot-badge" slot="tab">{{i.title}}</a-badge>
					</a-tab-pane>
				</a-tabs>
				<div class="export-template" v-if="activeKey===1 && exportPermission">
					<a-button icon="export" @click="toExport">名单一键导出</a-button>
				</div>
			</div>
			<div class="frame-content">
				<a-table v-bind="props" @change="handleTableChange" :dataSource="dataSource" :columns="columns"
								 :customRow="customRow" :loading="loading">
					<span slot="customAuction" style="padding-left: 15px">操作</span>
					<ReadStatus slot="readStatus" slot-scope="item" :dot="item.isRead===0">{{item.name}}</ReadStatus>
					<span slot="workingTime" slot-scope="item">{{item|single('expOption')}}</span>
					<span slot="coo" slot-scope="item">{{item|multi('cooIntent')}}</span>
					<span slot="address" slot-scope="item">{{areaAnalysis(item,false)|areas|fill}}</span>
					<Ellipsis slot="address" slot-scope="item" :width="160" :title="areaAnalysis(item,false)|areas|fill">
						{{areaAnalysis(item,false)|areas|fill}}
					</Ellipsis>
					<template slot="auction" slot-scope="item">
						<div v-if="activeKey === 1" class="frame-content-table_auction">
							<a-button type="link" icon="file-text" @click="toLink(item)">详情</a-button>
							<a-divider type="vertical" />
							<a-button type="link" icon="audit" @click="toEffect(item)" v-if="auditStatus">印象添加</a-button>
						</div>
						<a-button type="link" :icon="normal.icon" @click="toLink(item,true)" v-else>{{normal.text}}</a-button>
					</template>
				</a-table>
			</div>
		</div>
		<EffectModal ref="effect" />
	</div>
</template>

<script>
	import Breadcrumb from '@/components/bread-crumb';
	import ReadStatus from '@/components/table/read-status';
	import { clearProto, disabledDate,clearObject,areaAnalysis } from "@/plugin/tools";
	import { beStorage } from "@/plugin/api/provider";
	import EffectModal from './effect';
	import { columns } from './deploy';
	import { areaOption, cooIntent } from '@/assets/js/source'

	//处理请求数据
	const handleProcess = data =>{
		const {areaGoodCases:a} = data;
		return {
			...data,
			areaGoodCases: (a || []).length ? a.join('/') : ''
		}
	};

	export default {
		name: 'BeStorage',
		data() {
		  const { roleConfig } = this.$store.getters.getRole;
		  // console.log(roleConfig.managePermission);
			return {
				navData:[
					{id:1,title:'服务商管理',path:'/provider/review'},
					{id:2,title:'已入库',path:'/provider/storage'},
				],
				activeKey:1,
				tabPane:[
					{ id:1, title:'全部已入库', dot: false, },
					{ id:2, title:'资质修改申请', dot: false, },
					{ id:3, title:'要素修改申请', dot: false, },
				],
				props:{
					size:'middle',
					rowKey:'id',
					class:'frame-content-table',
					pagination:{
						current:1,
						total:1,
						showQuickJumper:true,
						showLessItems:true,
						size:'middle',
						showTotal:val=>`共${val}条信息`,
					},
					rowClassName: i=> (i || {}).unread ? 'frame-table-bold' : '',
				},
				dataSource:[],
				query:{
					name:undefined,
					orgOfficeName:undefined,
					identity:undefined,
					areasOfGoodCases:undefined,
					goodCases:undefined,
					cooperationIntention:undefined,
				},
				spinning:true,
				loading:false,
				sortOrder:"",
				sortField:"",
				disabledDate,
				areaAnalysis,
				auditStatus:roleConfig.managePermission === 1,
				exportPermission:roleConfig.exportPermission === 1,
				areaProps:{
					allowClear: true,
					changeOnSelect: true,
					options: areaOption,
					placeholder: '请选择服务商擅长业务区域',
					fieldNames: {label: 'name', value: 'id', children: 'children'},
				},
				cooIntent
			};
		},
		components:{
			Breadcrumb,
			ReadStatus,
			EffectModal
		},
		created(){
			// console.log(this.$store.getters.getRole);
			this.toQuery();
			this.toQueryUnread();
		},
		methods:{
			// table 行属性
			customRow(item){
				return {
					on:{
						click:()=>{
							if(item.isRead === 0){
								let logId = '';
								if(this.activeKey === 3) logId = item.elementLogId;
								if(this.activeKey === 2) logId = item.qualifyLogId;
								beStorage.read({
									"identity": item.identity,
									logId,
									"type": this.activeKey === 2 ? 2 : 1,
								}).then(res=>{
									if(res.code === 20000){
										item.isRead = 1;
										this.toCheckUnread();
									}
								})
							}
						},
					},
				}
			},
			toResetQuery(){
				this.toResetCondition();
				this.toQuery();
				this.toQueryUnread();
			},
			// 初始化条件
			toResetCondition(){
				this.query = {
					...this.query,
					name:undefined,
					orgOfficeName:undefined,
					identity:undefined,
					areaGoodCases:undefined,
					goodCases:undefined,
					cooperationIntention:undefined,
				};
				this.sortOrder = false;
				this.sortField = '';
				this.props.pagination.current = 1;
				this.props.pagination.total = 1;
			},
			status(rule){
				const activeKey = this.activeKey.toString();
				return rule.toString() ? new RegExp(activeKey).test(rule) : false;
			},
			handleSubmit(e){
				(e || window.event).preventDefault();
				// this.toQuery(handleProcess(clearObject(this.query)));
				this.toQuery(handleProcess(clearObject(this.query)));
				this.toQueryUnread();
			},
			// tab切换点击
			handleTabChange(val){
				this.activeKey = val;
				this.toResetCondition();
				this.toQuery();
				this.toQueryUnread();
			},
			// 表格变化事件
			handleTableChange(row,obs,col){
				this.props.pagination.current = row.current;
				this.sortOrder = col.field ? col.order : "";
				this.sortField = col.field;
				this.toQuery({ page:row.current });
			},
			// link 跳转
			toLink(item,audit){
				if(audit){
					this.$router.push({
						path:'/provider/storage/audit',
						query: clearObject({ id:item.id,type:this.activeKey })
					})
				}else{
					this.$router.push({
						path:'/provider/storage/detail',
						query: clearObject({ id:item.id })
					})
				}

			},
			toEffect(item){
				if(item.id) this.$refs.effect.toAdd(item.id);
			},
			// 查询数据
			toQuery(params = {}){
				this.loading = true;
				const queryField = handleProcess(clearProto(this.query));
				const sortOrder  = this.sortOrder ? ( this.sortOrder === 'ascend' ? 'ASC' : 'DESC' ) : '';
				beStorage.list(clearObject({
					type:Number(this.activeKey),
					page:1,
					size:10,
					sortOrder,
					...queryField,
					sortField:this.sortField,
					...params,
				})).then(res=>{
					if(res.code === 20000){
						const source = clearObject(res.data || {});
						this.dataSource = source.list;
						this.props.pagination.current = source.page;
						this.props.pagination.total = source.total;
					}
				}).finally(()=>{
					this.loading = false;
				});
			},
			// 查询未读数据
			toQueryUnread(){
				beStorage.unreadInfo().then(res=>{
					if(res.code === 20000){
						const { elementUnRead,qualifyUnRead} = res.data;
						this.tabPane = [
							{ id:1, title:'全部已入库', dot: false, },
							{ id:2, title:'资质修改申请', dot: qualifyUnRead === 0 },
							{ id:3, title:'要素修改申请', dot: elementUnRead === 0, },
						]
					}
				})
			},
			toExport() {
				beStorage.export().then(({dis,data}) => {
					if(dis){
						const filename = dis.split('filename=')[1];
						this.exportFile(data,filename);
					}else{
						this.$message.error("文件导出失败");
					}
					// this.exportFile(res);
				});
			},
			// 把文件流转为excel的方法
			exportFile(res,filename) {
				const url = window.URL.createObjectURL(new Blob([res]));
				const link = document.createElement("a");
				link.style.display = "none";
				link.href = url;
				link.setAttribute("download", filename);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			},

		},
		computed:{
			normal(){
				const res = !(this.activeKey === 1) && !this.auditStatus;
				return {
					icon: res ? 'file-text' : 'audit',
					text: res ? '查询详情' : '审核'
				};
			},
			columns(){
				return columns({
					type: this.activeKey,
					sortOrder:this.sortOrder,
					sortField:this.sortField
				})
			},
		},
	}
</script>

<style scoped lang="scss">
.frame-query-position{
	position: relative;
	.export-template{
		position: absolute;
		bottom: 30px;
		right: 0;
		z-index: 1;

	}
}
</style>
