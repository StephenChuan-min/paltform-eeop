import request from "@/plugin/tools/request";

const userAuth = {
    //账号列表
    listUser: params => request.get('/operator/userManage/listUser', params),
    //添加编辑账号
    saveUser: params => request.post('/operator/userManage/saveUser', params),
    //删除账号
    deleteUser: params => request.post('/operator/userManage/deleteUser', params),
    //重置密码
    resetPassword: params => request.post('/operator/userManage/resetPassword', params),

    // 获取部门管理列表
    getSection: params => request.post('/operator/department/listDepartment', params),
    // 删除部门
    removeSection: params => request.post('/operator/department/deleteDepartment', params),
    // 添加编辑部门
    addSectionData: params => request.post('/operator/department/saveDepartment', params),
    // 账号管理-获取部门管理列表
    getSectionListManagement: params => request.get('/operator/department/simpleListDepartment', params),
};
export default userAuth;