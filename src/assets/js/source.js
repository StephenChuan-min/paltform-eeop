
// 地区-选项
export const areaOption = global.FIELD_ADDRESS || [];

// 服务商类型
export const proType = [
	{ id: 1, label: '律师', value: '1' },
	{ id: 2, label: '机构', value: '2' },
];

// 擅长业务类型
export const orgAdvType = [
	{ id: 1, label: '工业', value: 1 },
	{ id: 2, label: '商业', value: 2 },
	{ id: 3, label: '住宅', value: 3 },
	{ id: 4, label: '纯担保类', value: 4 },
	{ id: 0, label: '其他', value: 0 },
];

// 投资偏好类型
export const hisCoo = [
	{ id: 1, label: '债权', value: 1 },
	{ id: 2, label: '债券', value: 2 },
	{ id: 3, label: '股权', value: 3 },
	{ id: 4, label: '居民用房', value: 4 },
	{ id: 5, label: '商业用房', value: 5 },
	{ id: 6, label: '工业用房', value: 6 },
	{ id: 7, label: '土地使用权', value: 7 },
	{ id: 8, label: '在建或其他房地产', value: 8 },
	{ id: 9, label: '收益权', value: 9 },
	{ id: 10, label: '矿权', value: 10 },
	{ id: 11, label: '船舶', value: 11 },
	{ id: 12, label: '车辆', value: 12 },
	{ id: 13, label: '机器设备', value: 13 },
	{ id: 14, label: '林权', value: 14 },
];

// 擅长业务类型 - 律师
export const lawAdvType = [
	{id:1, value:1, label:"立案/保全"},
	{id:2, value:2, label:"诉讼"},
	{id:3, value:3, label:"执行"},
	{id:4, value:4, label:"财产发现"},
	{id:5, value:5, label:"拍卖腾空"},
	{id:6, value:6, label:"破产/重组"},
	{id:7, value:7, label:"代位权/撤销权"},
	{id:8, value:8, label:"担保合同纠纷"},
	{id:9, value:9, label:"资管"},
	{id:10,value:10, label:"境外追索"},
	{id:11,value:11, label:"股东责任"},
	{id:12,value:12, label:"公司法律纠纷"},
	{id:13,value:13, label:"贸融"},
	{id:14,value:14, label:"能矿"},
	{id:15,value:15, label:"房地产"},
	{id:16,value:16, label:"票据"},
	{id:17,value:17, label:"刑事交叉"},
	{id:18,value:18, label:"融资租赁"},
	{id:19,value:19, label:"并购重组"},
	{id:20,value:20, label:"资产推介"},
	{id:21,value:21, label:"投行业务"},
	{id:0, value:0, label:"其他"},
];

// 擅长-其他资源
export const lawAdvList = [
	{ id: 1, label: '仲裁', value: '1' },
	{ id: 2, label: '政府', value: '2' },
	{ id: 3, label: '资金方', value: '3' },
	{ id: 4, label: '公证', value: '4' },
	{ id: 0, label: '其他', value: '0' },
];

// 从业不良时间经验
export const expOption = [
	{ id: 1, label: '1年以内', value: '1' },
	{ id: 2, label: '1-3年', value: '2' },
	{ id: 3, label: '3年以上', value: '3' },
	{ id: 0, label: '暂未有实际项目落地', value: '0' },
];

// 历史合作amc
export const hisFour = [
	{ id: 1, label: '东方', value: '1' },
	{ id: 2, label: '长城', value: '2' },
	{ id: 3, label: '华融', value: '3' },
	{ id: 4, label: '信达', value: '4' },
	{ id: 5, label: '银河', value: '5' },
	{ id: 0, label: '地方持牌AMC', value: '0' },
];

// 过往合作类型
export const typeOfCooperation = [
	{ id: 1, label: '配资收购', value: '1' },
	{ id: 2, label: '资产包收购', value: '2' },
	{ id: 3, label: '债权清收', value: '3' },
	{ id: 0, label: '其他（投行等）', value: '0' },
];

// 后续期望合作方向 - 合作意向
export const cooIntent = [
	{ id: 1, label: '合作清收', value: '1' },
	{ id: 2, label: '保底清收', value: '2' },
	{ id: 3, label: '跟投', value: '3' },
	{ id: 4, label: '介绍投资人', value: '4' },
	{ id: 5, label: '担保类项目', value: '5' },
	{ id: 0, label: '其他', value: '0' },
];

// 律所信息 - 担任职务
export const lawDuty = [
	{ id: 1, label: '主任', value: '1' },
	{ id: 2, label: '合伙人', value: '2' },
	{ id: 3, label: '律师', value: '3' },
	{ id: 4, label: '其他', value: '0' },
];

// 律所信息 - 律所类型
export const lawType = [
	{ id: 1, label: '公司制', value: '1' },
	{ id: 2, label: '合伙制', value: '2' },
];

// 是否其他+
export const isOther = [
	{ id: 1, label: '是', value: '1' },
	{ id: 2, label: '否', value: '2' },
	{ id: 0, label: '其他', value: '0' },
];
