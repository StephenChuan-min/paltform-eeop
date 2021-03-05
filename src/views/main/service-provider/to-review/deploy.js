/**
 * 返回 tab 相应table-columns
 * @param type
 * @param sortOrder
 * @returns {*[]}
 */
export const columns = ({ type = 1, sortOrder}) =>{

	// 基础列表
	const baseColumns = [
		{
			title: '联络人姓名',
			key: 'name',
			width:'14%',
			scopedSlots: { customRender: 'readStatus' },
		},
		{
			title: '联系方式',
			dataIndex: 'phone',
			key: 'phone',
			customRender:val=>val || '-',
		},
		{
			title: '服务商类型',
			dataIndex: 'identity',
			key: 'address1',
			customRender:(val)=> (val && (val === 1 ? '律师' : '机构')) || '-',
		},
		{
			title: '机构名称/挂靠律师',
			dataIndex: 'orgOfficeName',
			key: 'address 2',
			width:'17%',
			customRender:val=>val || '-',
		},
	];
	const auction = {
		key: 'auction',
		slots: { title: 'customAuction' },
		scopedSlots: { customRender: 'auction' },
	};

	if(type === 1){
		return [
			...baseColumns,
			{
				title: '所在地',
				dataIndex: 'address',
				key: 'add31',
				// customRender:val=>val || '-',
				width:'17%',
				scopedSlots: { customRender: 'address' },

			},
			{
				title: '从业不良时间',
				dataIndex: 'workingTime',
				key: 'address41',
				scopedSlots: { customRender: 'workingTime' },
			},
			{
				title: '要素提交日期',
				dataIndex: 'gmtCreate',
				key: 'timeField',
				sorter: true,
				sortOrder: sortOrder || false,
				customRender:val=>val || '-',
			},
			auction
		];
	}
	if(type === 2){
		return [
			...baseColumns,
			{
				title: '认证提交日期',
				dataIndex: 'gmtCreate',
				key: 'timeField',
				sorter: true,
				sortOrder: sortOrder || false,
				customRender:val=>val || '-',
			},
			auction
		];
	}
	if(type === 3){
		return [
			{
				title: '联络人姓名',
				key: 'name',
				scopedSlots: { customRender: 'readStatus' },
			},
			{
				title: '联系方式',
				dataIndex: 'phone',
				key: 'age',
				customRender:val=>val || '-',
			},
			{
				title: '注册日期',
				dataIndex: 'gmtCreate',
				key: 'timeField',
				sorter: true,
				sortOrder: sortOrder || false,
				customRender:val=>val || '-',
			},
		];
	}
	if(type === 4){
		return [
			...baseColumns,
			{
				title: '后台导入日期',
				dataIndex: 'gmtCreate',
				key: 'timeField',
				sorter: true,
				sortOrder: sortOrder || false,
				customRender:val=>val || '-',
			},
			auction
		];
	}
	if(type === 5){
		return [
			...baseColumns,
			{
				title: '未通过项',
				key: 'address 3',
				customRender:({isCertification,isConfirmElements})=> {
					const _ary = [];
					isCertification === 0 ? _ary.push('资质认证') : '';
					isConfirmElements === 0 ? _ary.push('要素认证') : '';
					return _ary.join('、')
				},
			},
			{
				title: '审核日期',
				dataIndex: 'gmtModify',
				key: 'address 41',
				sorter: true,
				sortOrder: sortOrder || false,
				customRender:val=>val || '-',
			},
			auction
		];
	}
	return baseColumns;
};

/**
 * 处理详情数据
 * @param source
 * @param coo
 * @returns {*}
 */
export const processData = (source, coo = false) => {
	const { lawyerElement = {},lawyerQualify = {},organizationElement = {},organizationQualify = {}, identity,
		cooperationImpressionList, interviewImpression,elementStatus,qualifyStatus } = source;
	const _source = {
		identity: source.identity,
		isLawyer: source.identity === 1,
		user:{
			identity: source.identity,
			name:identity === 2 ? (organizationQualify || {}).name : source.name,
			contact:source.name,
			lawOffice:(lawyerQualify || {}).lawOffice,
			phone:source.phone,
			storageAuditor:source.storageAuditor,
			storageTime:source.storageTime,
		},
		qualify:source.identity === 1 ? lawyerQualify : organizationQualify,
		factor:source.identity === 1 ? lawyerElement : organizationElement,
		qualifyCondition:source.qualifyCondition,
		elementCondition:source.elementCondition,
	};
	if(!coo) return _source;
	return {
		source: {
			..._source,
			cooperationImpressionList,
			interviewImpression
		},
		elementStatus,
		qualifyStatus
	}

};
