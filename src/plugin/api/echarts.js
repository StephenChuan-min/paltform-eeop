import request from "@/plugin/tools/request";

// 获取echarts服务商招商情况
export const getEchartsInvestMent = (params) => request.get('/operator/workTable/registerCondition', {params});