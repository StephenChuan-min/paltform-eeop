//资产服务项目招商列表
export const columns = [
    {
        title: '债务人名称',
        dataIndex: 'debtor',
        key: 'debtor',
    },
    {
        title: '债权本金（万元）',
        dataIndex: 'debtCaptial',
        key: 'debtCaptial',
        scopedSlots: {customRender: 'amount'},
        align: 'right',
    },
    {
        title: '债权利息（万元）',
        dataIndex: 'debtInterest',
        key: 'debtInterest',
        scopedSlots: {customRender: 'amount'},
        align: 'right',
    },
    {
        title: '担保方式',
        key: 'security',
        scopedSlots: {customRender: 'security'},
    },
    {
        title: '抵质押物类型',
        key: 'collateralType',
        scopedSlots: {customRender: 'collateralType'},
    },
    {
        title: '抵质押物分布区域',
        key: 'area',
        scopedSlots: {customRender: 'area'},
    },
    {
        title: '报名截止日期',
        dataIndex: 'deadline',
        key: 'deadline',
        sorter: true,
    },
    {
        title: '操作',
        scopedSlots: {customRender: 'auction'},
        key: 'auction',
    },
];

//查看抵押物清单弹窗-抵押物列表
export const msgInfoColumns = [
    {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        customRender: (text, record, index) => index + 1
    },
    {
        title: '抵押物类型',
        key: 'collateralType',
        scopedSlots: {customRender: 'collateralType'},
    },
    {
        title: '抵押物名称',
        key: 'collateralName',
        dataIndex: 'collateralName',
    },
    {
        title: '抵押物所在地',
        key: 'area',
        scopedSlots: {customRender: 'area'},
    },
];

export const queryOptions = [
    {
        label: '资产地域',
        isCollapsed: false,
        code: 'provinceCode',
        sliceKey:15,
        list: [
            {label: '全部', value: ''},
            {label: '浙江', value: '33'},
            {label: '四川', value: '51'},
            {label: '广东', value: '44'},
            {label: '福建', value: '35'},
            {label: '山东', value: '37'},
            {label: '江苏', value: '32'},
            {label: '河北', value: '13'},
            {label: '陕西', value: '61'},
            {label: '山西', value: '14'},
            {label: '辽宁', value: '21'},
            {label: '吉林', value: '22'},
            {label: '黑龙江', value: '23'},
            {label: '安徽', value: '34'},
            {label: '河南', value: '41'},
            {label: '湖北', value: '42'},
            {label: '湖南', value: '43'},
            {label: '海南', value: '46'},
            {label: '贵州', value: '52'},
            {label: '云南', value: '53'},
            {label: '甘肃', value: '62'},
            {label: '青海', value: '63'},
            {label: '江西', value: '36'},
            {label: '内蒙古自治区', value: '15'},
            {label: '广西壮族自治区', value: '45'},
            {label: '西藏自治区', value: '54'},
            {label: '宁夏回族自治区', value: '64'},
            {label: '新疆维吾尔自治区', value: '65'},
        ],
    },
    {
        label: '抵质押物类型',
        isCollapsed: false,
        code: 'type',
        sliceKey:10,
        list: [
            {label: '全部', value: ''},
            {label: '住宅', value: 1},
            {label: '商业', value: 2},
            {label: '办公楼', value: 3},
            {label: '工业房地产', value: 4},
            {label: '光地（工业）', value: 5},
            {label: '光地（商业）', value: 6},
            {label: '光地（商住）', value: 7},
            {label: '光地（住宅）', value: 8},
            {label: '在建工程', value: 9},
            {label: '机器设备', value: 10},
            {label: '生产设备', value: 11},
            {label: '运输设备', value: 12},
            {label: '林权', value: 13},
            {label: '海域使用权', value: 14},
            {label: '船舶', value: 15},
            {label: '其他', value: 16},
            {label: '产品、材料等', value: 17},
            {label: '大宗物资', value: 18},
            {label: '工业品、家电等', value: 19},
            {label: '粮食物资', value: 20},
        ],
    },
    {
        label: '资产规模',
        isCollapsed: false,
        code: 'priceType',
        sliceKey:10,
        list: [
            {label: '全部', value: ''},
            {label: '1000w以下', value: 1},
            {label: '1000w-5000w', value: 2},
            {label: '5000w-10000w', value: 3},
            {label: '10000w以上', value: 4},
        ],
    },
]


//担保方式
export const SECURITY_TYPE = {
    1: '担保',
    2: '抵押+担保',
};

//排序
export const SORTER_TYPE = {
    ascend: 'ASC',
    descend: 'DESC',
};