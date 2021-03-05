import request from '@/plugin/tools/request';

//修改或设置密码接口
export const updatePassword = params => request.post('/operator/amcOperatorUser/updatePassword',params);
