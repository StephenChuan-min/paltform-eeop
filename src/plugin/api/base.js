import request from "@/plugin/tools/request";

// 获取token 信息
export const getInfo = params => request.get('/operator/amcOperatorUser/getInfo',params);

// 获取上传凭证 - 七牛
export const getUploadToken = () => request.get('/file/getAuthToken');

// 获取下载凭证 - 七牛
export const getDownLoadToken = fileKey => request.get(`/file/downLoadToken?fileKey=${fileKey}`);
