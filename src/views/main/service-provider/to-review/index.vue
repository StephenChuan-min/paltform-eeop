<template>
	<div class="frame-wrapper">
		<Breadcrumb :source="navData" icon="environment" />
		<div class="frame-wrapper-content">
			<div class="frame-query">
				<a-form-model layout="inline" @submit="handleSubmit" @submit.native.prevent>
					<a-form-model-item style="float: right;margin-right: 0;">
						<a-space>
							<a-button style="width: 60px" @click="toResetQuery">重置</a-button>
							<a-button type="primary" html-type="submit" style="width: 60px">查询</a-button>
						</a-space>
					</a-form-model-item>
					<div style="padding-right: 150px">
						<a-form-model-item label="联络人姓名">
							<a-input v-model="query.userName" placeholder="请输入联络人姓名" style="width: 200px"></a-input>
						</a-form-model-item>
						<a-form-model-item label="机构名称/挂靠律所" v-if="status(1245)">
							<a-input v-model="query.officeName" placeholder="请输入机构名称/挂靠律所名称" style="width: 270px">
							</a-input>
						</a-form-model-item>
						<a-form-model-item label="服务商类型：" v-if="status(1245)">
							<a-select v-model="query.identity" placeholder="请选择身份类型" style="width: 150px" allowClear>
								<a-select-option :value="1">律师</a-select-option>
								<a-select-option :value="2">机构</a-select-option>
							</a-select>
						</a-form-model-item>
						<a-form-model-item label="提交日期：" v-if="status(12)">
							<a-form-model-item>
								<a-date-picker v-model="field.startTime" style="width: 100%" placeholder="搜索范围起始日期"
															 :disabled-date="val=>disabledDate(val,field.endTime,'start')"></a-date-picker>
							</a-form-model-item>
							<span :style="{ display: 'inline-block',marginLeft:'-8px',width:'20px'}">至</span>
							<a-form-model-item>
								<a-date-picker v-model="field.endTime" style="width: 100%" placeholder="搜索范围截止日期"
															 :disabled-date="val=>disabledDate(field.startTime,val)"></a-date-picker>
							</a-form-model-item>
						</a-form-model-item>
						<a-form-model-item label="注册日期：" style="margin-bottom:0;" v-if="status(3)">
							<a-form-model-item>
								<a-date-picker v-model="field.startTime" style="width: 100%" placeholder="搜索范围起始日期"
															 :disabled-date="val=>disabledDate(val,field.endTime,'start')"></a-date-picker>
							</a-form-model-item>
							<span :style="{ display: 'inline-block',marginLeft:'-8px',width:'20px'}">至</span>
							<a-form-model-item>
								<a-date-picker v-model="field.endTime" style="width: 100%" placeholder="搜索范围截止日期"
															 :disabled-date="val=>disabledDate(field.startTime,val)"></a-date-picker>
							</a-form-model-item>
						</a-form-model-item>
					</div>


				</a-form-model>
				<a-tabs @change="handleTabChange" :activeKey="activeKey" :animated="false">
					<a-tab-pane v-for="i in tabPane" :key="i.id">
						<a-badge :dot="Boolean(i.dot)" class="dot-badge" slot="tab">{{i.title}}</a-badge>
					</a-tab-pane>
				</a-tabs>
				<div v-if="status(1234)">
					<a-space >
						<a-button :type="!query.isReadAll ? 'primary':''" @click='handleRead()'>全部</a-button>
						<a-button :type="query.isReadAll === 2 ? 'primary':''" @click='handleRead(2)'>只显示未读</a-button>
						<a-button @click='handleReadAll'>全部标为已读</a-button>
					</a-space>
					<div style="height: 10px"></div>
				</div>
			</div>
			<div class="frame-content">
				<a-table v-bind="props" @change="handleTableChange" :dataSource="dataSource" :columns="columns"
				:customRow="customRow" :loading="loading">
					<span slot="customAuction" style="padding-left: 15px">操作</span>
					<ReadStatus slot="readStatus" slot-scope="item" :dot="item.isRead===0">
						{{item.name}}
						<div v-if="activeKey === 1">
							<a-tag color="blue" v-if="(item||{}).reSubmit">重新提交</a-tag>
							<a-tag color="orange" v-if="(item||{}).registerType">后台开户</a-tag>
						</div>
					</ReadStatus>
					<template slot="auction" slot-scope="item">
						<a-button type="link" :icon="normal.icon" @click="toLink(item)">{{normal.text}}</a-button>
					</template>
					<span slot="address" slot-scope="item">{{areaAnalysis(item)|area|fill}}</span>
					<span slot="workingTime" slot-scope="item">{{item|single('expOption')}}</span>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script>
	import Breadcrumb from '@/components/bread-crumb';
	import ReadStatus from '@/components/table/read-status';
	import { clearProto, disabledDate,clearObject,areaAnalysis } from "@/plugin/tools";
	import { toReview } from "@/plugin/api/provider";
	import { columns } from './deploy';
	export default {
		name: 'ToReview',
		data() {
			const { roleConfig } = this.$store.getters.getRole;
			return {
				navData:[
					{id:1,title:'服务商管理',path:'/provider/review'},
					{id:2,title:'待审查',path:'/provider/review'},
				],
				activeKey:1,
				tabPane:[
					{ id:1, title:'待审核' },
					{ id:2, title:'仅提交资质' },
					{ id:3, title:'仅注册' },
					{ id:4, title:'开户待确认' },
					{ id:5, title:'审核未通过' },
				],
				props:{
					size:'middle',
					rowKey:(i,index)=>`${index}_${i.id}`,
					class:'frame-content-table',
					pagination:{
						current:1,
						total:1,
						showQuickJumper:true,
						showLessItems:true,
						size:'middle',
						showTotal:val=>`共${val}条信息`,
					},
					rowClassName: i=> (i || {}).isRead === 0 && 'frame-table-bold',
				},
				loading:false,
				dataSource:[],
				query:{
					userName:"",
					officeName:"",
					startTime:'',
					endTime:'',
					identity:undefined,
					isReadAll:'',
				},
				field:{
					startTime:'',
					endTime:'',
				},
				sortOrder:"",
				sortField:"",
				disabledDate,
				areaAnalysis,
				auditStatus:roleConfig.managePermission === 1,
				checkUnread:false,
			};
		},
		components:{
			Breadcrumb,
			ReadStatus,
		},
		created(){
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
								if(this.activeKey === 1) logId = item.elementLogId;
								if(this.activeKey === 2) logId = item.qualifyLogId;
								toReview.read({
									"identity": item.identity,
									logId,
									"type": Number(this.activeKey),
									"userId": item.id,
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
			// 状态判断
			status(rule){
				const activeKey = this.activeKey.toString();
				return rule.toString() ? new RegExp(activeKey).test(rule) : false;
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
					userName:"",
					officeName:"",
					startTime:'',
					endTime:'',
					identity:undefined,
					isReadAll:"",
				};
				this.field = {
					startTime:'',
					endTime:'',
				};
				this.sortOrder = false;
				this.sortField = '';
				this.props.pagination.current = 1;
				this.props.pagination.total = 1;
			},
			// form 点击查询
			handleSubmit(e){
				(e || window.event).preventDefault();
				this.toQuery(clearObject(this.query));
				this.toCheckUnread();
			},
			// 全部/未读 切换
			handleRead(val){
				this.query.isReadAll = val;
				this.handleSubmit();
			},
			handleReadAll(){
				toReview.readAll({type:this.activeKey}).then(res=>{
					if(res.code === 20000){
						this.toQuery();
						this.toQueryUnread();
					}else{
						this.$message.error('操作失败！');
					}
				})
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
				this.sortOrder = col.order;
				this.sortField = col.field;
				this.toQuery({ page:row.current });
			},
			// link 跳转
			toLink(item){
				this.$router.push({
					path:'/provider/review/detail',
					query: clearObject({
						id:item.id,
						qid:(item.qualifyLogId || item.qualifyId),
						eid:item.elementLogId,
					})
				})
			},
			// 查询数据
			toQuery(params = {}){
				this.loading = true;
				const queryField = clearProto(this.query);
				const sortOrder  = this.sortOrder ? (
					this.sortOrder === 'ascend' ? 'ASC' : 'DESC'
					) : '';
				toReview.list(clearObject({
					type:this.activeKey,
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
					}else{
						this.$message.error('查询失败');
					}
				}).finally(()=>{
					this.loading = false;
				});
			},
			// 查询未读数据
			toQueryUnread(){
				toReview.unreadInfo().then(res=>{
					if(res.code === 20000){
						const { elementUnRead,inConfirmUnRead,qualifyUnRead,registerUnRead} = res.data;
						this.tabPane = [
							{ id:1, title:'待审核', dot:elementUnRead === 0,},
							{ id:2, title:'仅提交资质', dot:qualifyUnRead === 0,},
							{ id:3, title:'仅注册', dot:registerUnRead === 0, },
							{ id:4, title:'开户待确认', dot:inConfirmUnRead === 0 },
							{ id:5, title:'审核未通过', dot:false },
						]
					}
				})
			},
			// 查询未读数据【定时】
			toCheckUnread(){
				if(this.checkUnread)clearTimeout(this.checkUnread);
				this.checkUnread = setTimeout(()=>{
					this.toQueryUnread();
					if(this.checkUnread)clearTimeout(this.checkUnread);
				},3000)
			}
		},
		computed:{
			normal(){
				const res = !(this.activeKey === 1 && this.auditStatus);
				return {
					icon: res ? 'file-text' : 'audit',
					text: res ? '查看详情' : '审核'
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
		watch:{
			'field':{
				handler:function({startTime,endTime}){
					this.query.startTime = startTime ? startTime.format('YYYY-MM-DD') : '';
					this.query.endTime = endTime ? endTime.format('YYYY-MM-DD') : '';
				},
				deep:true
			}
		}
	}
</script>

<style scoped>

</style>
