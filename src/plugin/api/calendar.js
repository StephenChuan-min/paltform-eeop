import request from "@/plugin/tools/request";

// 获取待办事项的数据
export const getTODoList = () => request.get('/service/workTable');