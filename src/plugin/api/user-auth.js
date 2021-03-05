import request from "@/plugin/tools/request";

const userAuthApi = {
    //账号列表
    listUser: params => request.post('/operator/userManage/listUser', params),
    //添加编辑账号
    saveUser: params => request.post('/operator/userManage/saveUser', params),
    //删除账号
    deleteUser: params => request.post('/operator/userManage/deleteUser', params),
    //重置密码
    resetPassword: params => request.post('/operator/userManage/resetPassword', params),

    // 获取部门管理列表
    getSectionList: params => request.post('/operator/department/listDepartment', params),
    // 删除部门
    removeSection: params => request.post('/operator/department/deleteDepartment', params),
    // 添加编辑部门
    addSection: params => request.post('/operator/department/saveDepartment', params),
    // 账号管理-获取部门管理列表
    getSectionListManagement: () => request.post('/operator/department/simpleListDepartment', {}),

    //角色列表
    //验证原手机号接口

    listRole: params => request.post('/operator/role/listRole', params),
    //添加编辑角色
    saveRole: params => request.post('/operator/role/saveRole', params),
    //删除角色
    deleteRole: params => request.post('/operator/role/deleteRole', params),
    //账号管理等->获取角色列表
    getSimpleListUser: () => request.post('/operator/role/simpleListUser', {}),
    //单角色查询
    findConfig: (id) => request.get(`/operator/role/findConfig?id=${id}`),
};
export default userAuthApi;