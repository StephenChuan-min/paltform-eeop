<template>
  <div class="frame-wrapper">
    <Breadcrumb :source="navData" icon="environment">
      <template slot="suffix">
        <a-button class="addAccount" @click="handleAccount('add')">
          <a-icon type="user"/>
          新建角色
        </a-button>
      </template>
    </Breadcrumb>
    <div class="frame-wrapper-content">
      <div class="frame-query">
        <a-form-model layout="inline">
          <a-form-model-item label="角色名称">
            <a-input v-model="queryParams.roleName" placeholder="请输入角色名称" class="custom-prefix-6"/>
          </a-form-model-item>
          <a-form-model-item class="reset">
            <a-button @click="handleQuery('reset')">重置</a-button>
          </a-form-model-item>
          <a-form-model-item class="query">
            <a-button type="primary" @click="handleQuery('search')">查询</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="frame-content">
        <a-tabs @change="handleTabChange" :activeKey="queryParams.isDeleted" :animated="false">
          <a-tab-pane key="0" tab="正常角色"></a-tab-pane>
          <a-tab-pane key="1" tab="已删除角色"></a-tab-pane>
        </a-tabs>
        <div style="height: 4px"></div>
        <a-table :columns="column" :data-source="dataSource" size="middle" :pagination="pagination"
                 @change="handleTableChange" :row-key="record => record.id" :loading="loading"
        >
          <template slot="auction" slot-scope="text,record">
            <a-button type="link" size="small" :style="{paddingLeft: 0}" @click="handleAccount('edit',record)">编辑
            </a-button>
            <a-divider type="vertical"/>
            <a-button type="link" size="small" class="delete" @click="handleDel(record.id)"
                      :disabled="Boolean(record.userCount)">删除
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
        :title="`${modalSign === 'add' ?'新增':'编辑'}角色`"
        v-model="modalVisible"
        :destroyOnClose="true"
        dialogClass="role-modal"
        :confirm-loading="confirmLoading"
        :maskClosable="false"
        @ok="handleSubmit"
        @cancel="handleResetFields('form')"
    >
      <div class="role-modal-wrapper">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
          <div class="part-title">角色名称</div>
          <a-form-model-item label="角色名称" prop="roleName">
            <a-input
                v-model="form.roleName"
                placeholder="请输入角色名称"
            />
          </a-form-model-item>
          <div class="part-title">角色权限配置</div>
          <a-form-model-item prop="serviceUserManage">
            <a-checkbox v-model="form.serviceUserManage">
              服务商名单管理
            </a-checkbox>
          </a-form-model-item>
          <template v-if="form.serviceUserManage">
            <a-form-model-item label="管理权限" prop="managePermission">
              <a-radio-group v-model="form.managePermission">
                <a-radio value="1">
                  审核
                </a-radio>
                <a-radio value="2">
                  仅查看
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <template v-if="form.managePermission === '2'">
              <a-form-model-item label="查看范围" prop="readScope">
                <a-radio-group v-model="form.readScope">
                  <a-radio value="1">
                    全阶段名单
                  </a-radio>
                  <a-radio value="2">
                    仅入库名单
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </template>
            <a-form-model-item label="导出权限" prop="exportPermission">
              <a-radio-group v-model="form.exportPermission">
                <a-radio value="1">
                  有
                </a-radio>
                <a-radio value="2">
                  无
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </template>
          <a-form-model-item prop="attractInvestmentManage">
            <a-checkbox v-model="form.attractInvestmentManage">
              招商项目管理
            </a-checkbox>
          </a-form-model-item>
          <template v-if="form.attractInvestmentManage">
            <a-form-model-item label="服务项目查看" prop="projectManage">
              <a-radio-group v-model="form.projectManage">
                <a-radio value="1">
                  发布及进展管理
                </a-radio>
                <a-radio value="2">
                  仅查看
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </template>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Breadcrumb from '@/components/bread-crumb';
import userAuthApi from '@/plugin/api/user-auth';
import {clearProto} from "@/plugin/tools";
import {SORTER_TYPE, roleColumns} from "./source";


export default {
  name: 'Role',
  nameComment: '内部权限管理/角色管理',
  data() {
    return {
      modalSign: 'add',
      modalVisible: false,
      loading: false,
      confirmLoading:false,
      navData: [
        {id: 1, title: '内部权限管理', path: '/auth/role'},
        {id: 2, title: '角色管理', path: '/auth/role'},
      ],
      dataSource: [],
      queryParams: {
        isDeleted: '0', //是否删除（0-否、1-是），默认为0
        roleName: '',
        page: 1,
        sortColumn: 'DEFAULT', //排序字段
        sortOrder: '', //排序顺序
      },
      form: {
        serviceUserManage: false,
        attractInvestmentManage: false,
        projectManage: '',//项目管理权限（1：发布及进展管理，2：仅查看）
        roleName: '',
        exportPermission: '',//导出权限（1：有，2：无）
        managePermission: '',//管理权限（1：审核，2：仅查看）
        readScope: '',//查看范围（1：全阶段名单，2：仅入库名单）
        id: '',
      },
      pagination: {
        current: 1,
        total: 1,
        showQuickJumper: true,
        showLessItems: true,
        size: 'middle',
        showTotal: val => `共${val}条信息`,
      },
      labelCol: {span: 7},
      wrapperCol: {span: 16},
      rules: {
        roleName: [
          {required: true, message: '请输入角色名称'},
          {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: "仅支持汉字和字母", trigger: 'blur'},
        ],
        projectManage: [
          {required: true, message: '请选择项目管理权限', trigger: 'change'},
        ],
        exportPermission: [
          {required: true, message: '请选择导出权限', trigger: 'change'},
        ],
        managePermission: [
          {required: true, message: '请选择管理权限', trigger: 'change'},
        ],
        readScope: [
          {required: true, message: '请选择查看范围', trigger: 'change'},
        ],
      },
    };
  },
  components: {
    Breadcrumb,
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      this.dataSource = [];
      this.loading = true;
      userAuthApi.listRole(clearProto(this.queryParams)).then((res) => {
        if (res.code === 20000) {
          const data = res.data;
          this.dataSource = data.list;
          this.pagination.total = data.total;
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    //重置表单|重置搜索条件|tab切换
    handleResetFields(flag) {
      if (flag === 'form') {
        this.form = {
          serviceUserManage: false,
          attractInvestmentManage: false,
          projectManage: '',
          roleName: '',
          exportPermission: '',
          managePermission: '',
          readScope: '',
          id: '',
        }
      } else {
        this.queryParams = {
          ...this.queryParams,
          roleName: '',
          page: 1,
          sortColumn: 'DEFAULT', //排序字段
          sortOrder: '', //排序顺序
        };
        this.pagination.current = 1;
      }
    },
    //查询||重置 搜索条件
    handleQuery(flag) {
      if (flag === 'reset') {
        this.handleResetFields('resetQuery');
      }
      this.pagination.current = 1;
      this.queryParams.page = 1;
      this.getTableList();
    },
    //tab切换
    handleTabChange(val) {
      this.queryParams.isDeleted = val;
      this.handleResetFields('tab');
      this.getTableList();
    },
    //翻页||排序
    handleTableChange(pgt, filters, sorter) {
      const params = {...this.queryParams};
      this.pagination.current = pgt.current;
      params.page = pgt.current;
      params.sortOrder = SORTER_TYPE[sorter.order];
      params.sortColumn = sorter.order ? SORTER_TYPE[sorter.field] : '';
      this.queryParams = params;
      this.getTableList();
    },
    //删除角色
    handleDel(id) {
      this.$confirm({
        title: '确定删除这个角色吗？',
        content: '',
        onOk: () => {
          userAuthApi.deleteRole({id}).then((res) => {
            if (res.code === 20000) {
              this.$message.success('删除成功');
              this.getTableList();
            } else {
              this.$message.error(res.message);
            }
          })
        },
      });
    },
    //打开弹窗 添加||编辑
    handleAccount(sign, record) {
      if (sign === 'edit') {
        userAuthApi.findConfig(record.id).then((res) => {
          if (res.code === 20000) {
            const data = res.data;
            this.form = {
              id: record.id,
              roleName: record.roleName,
              attractInvestmentManage: data && data.attractInvestmentManage || false,
              serviceUserManage: data && data.serviceUserManage || false,
              exportPermission: data && data.exportPermission && data.exportPermission.toString() || '',
              managePermission: data && data.managePermission && data.managePermission.toString() || '',
              readScope: data && data.readScope && data.readScope.toString() || '',
              projectManage: data && data.projectManage && data.projectManage.toString() || '',
            }
          }
        })
      }
      this.modalSign = sign;
      this.modalVisible = true;
    },
    //添加||编辑 角色
    handleSubmit(e) {
      e.preventDefault();
      const {serviceUserManage, attractInvestmentManage} = this.form;
      if (!(serviceUserManage || attractInvestmentManage)) {
        this.$message.warning('至少勾选1个模块')
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const {id, roleName, projectManage, exportPermission, managePermission, readScope} = clearProto(this.form);
            const params = {
              id,
              roleName,
              attractInvestmentManage: attractInvestmentManage ? {
                projectManage,
              } : '',
              serviceUserManage: serviceUserManage ? {
                exportPermission,
                managePermission,
                readScope
              } : ''
            };
            this.confirmLoading = true;
            userAuthApi.saveRole(params).then((res) => {
              if (res.code === 20000) {
                this.$message.success('保存成功');
                this.handleResetFields('form');
                this.modalVisible = false
                this.getTableList();
              } else if (res.code === 30008) {
                this.$message.warning('角色已存在');
              } else {
                this.$message.warning(res.message);
              }
            }).finally(()=> this.confirmLoading = false);
          } else {
            return false;
          }
        });
      }
    },
  },
  computed: {
    column: function () {
      const {isDeleted, sortOrder, sortColumn} = this.queryParams;
      const sort = Object.keys(SORTER_TYPE).find(i => SORTER_TYPE[i] === sortOrder);
      return roleColumns(sort, isDeleted, sortColumn);
    },
  },
  watch: {
    'form.attractInvestmentManage'() {
      if (!this.form.attractInvestmentManage) {
        this.form.projectManage = '';
      }
    },
    'form.serviceUserManage'() {
      if (!this.form.serviceUserManage) {
        this.form.exportPermission = '';
        this.form.managePermission = '';
        this.form.readScope = '';
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.role-modal {
  width: 680px !important;

  .ant-modal-body {
    .role-modal-wrapper {
      .part-title {
        font-weight: bold;
        color: #333333;
        font-size: 16px;
        padding: 12px;
      }
    }
  }

  .ant-modal-footer {
    text-align: center;
  }
}

.addAccount {
  border: 1px solid #008CB0;
  border-radius: 2px;
  color: #008CB0;
}

/deep/ .ant-form {
  position: relative;

  .custom-prefix-6 {
    width: 352px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #D9D9D9;
  }

  .reset {
    position: absolute;
    right: 70px;
    top: 0;
  }

  .query {
    position: absolute;
    right: -10px;
    top: 0;
  }
}

.edit {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #008CB0;
  line-height: 20px;
}

// .delete {
//   font-size: 14px;
//   font-family: PingFangSC-Regular, PingFang SC;
//   font-weight: 400;
//   color: #999999;
//   line-height: 20px;
// }
// tabs
/deep/ .ant-tabs-tab-active {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #008CB0;
  line-height: 14px;
}

/deep/ .ant-table-column-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #262626;
  line-height: 20px;
}

</style>
