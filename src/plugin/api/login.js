import request from "@/plugin/tools/request";

// 登录接口
export const login = params => request.post('/operator/amcOperatorUser/login',params);

// 登录前判断当前账号状态
export const accountStatus = params => request.get(`/operator/amcOperatorUser/loginPreCheckAccountStatus?username=${params}`);

// 获取图片验证码
export const getCaptcha = params => request.post(`/operator/amcOperatorUser/getCaptcha?username=${params}`);

// 退出登录
export const logout = () => request.post('/operator/amcOperatorUser/logout' );



