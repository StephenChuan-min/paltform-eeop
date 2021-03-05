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
			scopedSlots: { customRender: 'readStatus' },
			width:'12%',
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
			key: 'identity',
			customRender:(val)=> (val && (val === 1 ? '律师' : '机构')) || '-',
		},
		{
			title: '机构名称/挂靠律师',
			dataIndex: 'orgOfficeName',
			key: 'orgOfficeName',
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
				title: '擅长业务区域',
				dataIndex: 'areasOfGoodCases',
				key: 'address3',
				width:'14%',
				scopedSlots: { customRender: 'address' },
			},
			{
				title: '合作意向',
				dataIndex: 'cooperationIntention',
				key: 'address31',
				scopedSlots: { customRender: 'coo' },
			},
			{
				title: '入库时间',
				sorter: true,
				sortOrder: sortOrder || false,
				dataIndex: 'gmtCreate',
				key: 'address41',
				customRender:val=>val || '-',
				width:100,
			},
			{
				...auction,
				width:230,
			}
		];
	}
	if(type === 2){
		return [
			...baseColumns,
			{
				title: '资质修改提交日期',
				sorter: true,
				sortOrder: sortOrder || false,
				dataIndex: 'gmtModify',
				key: 'gmtModify1',
				customRender:val=>val || '-',
				width:150,
			},
			auction
		];
	}
	if(type === 3){
		return [
			...baseColumns,
			{
				title: '要素修改提交日期',
				sorter: true,
				sortOrder: sortOrder || false,
				dataIndex: 'gmtModify',
				key: 'address41',
				customRender:val=>val || '-',
				width:150,
			},
			auction
		];
	}
	return baseColumns;
};
