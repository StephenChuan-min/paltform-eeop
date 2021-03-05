import request,{ENV} from "@/plugin/tools/request";

export const amcProjectListApi = params => request.post('/service/amcProject',params);

export const signUpApi = id => request.post(`/service/amcProject/checkin/${id}`);

//招商项目管理列表接口
export const projectFind = params => request.post('/operator/project/findAll',params);

// 详情页-获取项目基本信息接口
export const projectDetail = params => request.get(`/operator/project/details?projectId=${params}`);

//报名服务商列表接口
export const signService = params => request.post('/operator/project/signService',params);

//服务商提交方案列表接口
export const serviceCaseSubmit = params => request.post('/operator/project/serviceCaseSubmit',params);

//修改项目招商信息接口
export const updateProjectInfo = params => request.post('/operator/project/updateProjectInfo',params);

//上传表格上传
export  const  upFiles = ENV === 'development' ? '/proxy-api/operator/project/importExcel' : '/api/operator/project/importExcel';
