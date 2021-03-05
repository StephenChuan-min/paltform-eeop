import {adminRoutes, getNormalRoutes, resetRouter} from "@/router";
import store from '@/plugin/store';

export const adminField = 'admin';

// 处理权限路由
export const ruleProcess = (_this, data) => {
    const {roleName, config} = data;
    _this.$store.commit('updateInfo', data);
    _this.$store.commit('ruleInfo',{roleName, config});

    resetRouter();
    const normalRoutes = getNormalRoutes(config);
    _this.$router.addRoutes(roleName === adminField ? adminRoutes : normalRoutes);
};

// 获取侧边栏导航
export const getMenu = () => {
    const {roleName} = store.getters.getRole;
    const {config} = store.getters.getInfo;
    // attractInvestmentManage, //是否有招商项目管理权限
    // serviceUserManage, //是否有服务商名单管理权限
    // managePermission, //管理权限（1：审核，2：仅查看）
    // readScope, //查看范围（1：全阶段名单，2：仅入库名单）
    // 工作台:有服务商名单管理权限 或者  !(管理权限为仅查看 查看范围为仅入库名单)
    // 服务商管理-待审查: !(管理权限为仅查看 查看范围为仅入库名单)
    const service = config && config.serviceUserManage;
    const org = config && config.attractInvestmentManage;
    const serviceChild = config && config.managePermission === 2 && config.readScope === 2;
    const overview = (config && config.managePermission === 1) || (config && config.readScope === 1);
    const normalField = [
        overview &&
        {
            id: '1',
            title: '概览',
            icon: 'appstore',
            path: '/overview',
            child: [
                {id: '1', title: '工作台', path: ''}
            ]
        },
        service &&
        {
            id: '2',
            title: '服务商管理',
            icon: 'solution',
            path: '/provider',
            child: [
                !serviceChild && {id: '1', title: '待审查', path: '/review'},
                {id: serviceChild ? '1' : '2', title: '已入库', path: '/storage'},
            ].filter(i => i)
        },
        org &&
        {
            id: '3',
            title: '招商管理',
            icon: 'schedule',
            path: '/investment',
            child: [
                {id: '1', title: '招商项目管理', path: '/list'},
            ]
        },
    ];
    return roleName === adminField ? [
        {
            id: '11',
            title: '内部权限管理',
            icon: 'key',
            path: '/auth',
            child: [
                {id: '1', title: '角色管理', path: '/role'},
                {id: '2', title: '部门管理', path: '/section'},
                {id: '3', title: '账号管理', path: '/account'},
            ]
        }
    ] : normalField.filter(i => i);

};
