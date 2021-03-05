import request from "@/plugin/tools/request";

// 查询审核状态
export const auditStatus = params => request.post('/operator/serviceUserManage/quaEndEleAuditStatus',params);

// 待审查
export const toReview = {
	// 添加审核结果
	audit:params => request.post('/operator/serviceUserManage/review/audit',params),
	// 待审查——服务商详情
	detail:params => request.post('/operator/serviceUserManage/review/detail',params),
	// 保存/更新面谈印象
	impression:params => request.post('/operator/serviceUserManage/review/impression',params),
	// 待审查--列表页
	list:params => request.post('/operator/serviceUserManage/review/list',params),
	// 待审查--点击标记已读
	read:params => request.post('/operator/serviceUserManage/review/read',params),
	// 待审查--全部标记已读
	readAll:params => request.post('/operator/serviceUserManage/review/readAll',params),
	// 查询服务商管理-待审查模块的未读标志
	unreadInfo:() => request.get('/operator/serviceUserManage/review/unreadInfo'),
};

// 已入库
export const beStorage = {
	// 添加合作印象
	impression:params => request.post('/operator/serviceUserManage/storage/addCooImpression',params),
	// 查询合作印象记录
	impressionList:id=>request.get(`/operator/serviceUserManage/storage/findCooImpression?id=${id}`),
	// 已入库——资质/要素修改审核
	audit:params => request.post('/operator/serviceUserManage/storage/audit',params),
	// 已入库服务商-->列表
	list:params => request.post('/operator/serviceUserManage/storage/findAll',params),
	// 修改资质未读、要素修改未读
	unreadInfo:params => request.post('/operator/serviceUserManage/storage/findUnRead',params),
	// 已入库--点击标记已读
	read:params => request.post('/operator/serviceUserManage/storage/read',params),
	// 已入库——服务商画像详情
	detail:params => request.post('/operator/serviceUserManage/storage/userDetail',params),
	// 已入库服务商导
	export:()=>request({method: 'post', url: '/operator/serviceUserManage/storage/export', responseType: 'blob'})
};
