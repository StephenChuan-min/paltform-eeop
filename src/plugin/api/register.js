import request from '@/plugin/tools/request';

// 获取手机验证码接口
export const registerCode = params => request.post(`/service/auth/register/code?phone=${params}`)

//注册接口
export const authRegister = params => request.post('/service/auth/register', params)