<template>
  <div class="frame-wrapper">
    <Breadcrumb :source="navData" icon="environment">
      <template slot="suffix">
        <a-button class="addAccount" @click="handleAccount('add')">
          <a-icon type="user"/>
          添加账号
        </a-button>
      </template>
    </Breadcrumb>
    <div class="frame-wrapper-content">
      <div class="frame-query">
        <a-form-model layout="inline">
          <a-form-model-item>
            <a-input-group compact>
              <a-select v-model="searchParams">
                <a-select-option value="1">
                  按姓名查询
                </a-select-option>
                <a-select-option value="2">
                  按账号查询
                </a-select-option>
              </a-select>
              <a-input v-model="queryParams.name" placeholder="请输入姓名" class="custom-prefix-6"
                       v-if="searchParams==='1'"/>
              <a-input v-model="queryParams.username" placeholder="请输入账号" class="custom-prefix-6" v-else/>
            </a-input-group>
          </a-form-model-item>
          <a-form-model-item label="角色">
            <a-select
                v-model="queryParams.roleId"
                placeholder="请选择角色"
                style="width: 180px"
                allowClear
            >
              <a-select-option v-for="item in role" :key="item.id" :value="item.id">{{ item.value }}</a-select-option>

            </a-select>
          </a-form-model-item>
          <a-form-model-item label="所属部门">
            <a-select
                v-model="queryParams.departmentId"
                placeholder="请选择所属部门"
                style="width: 180px"
                allowClear
            >
              <a-select-option v-for="item in department" :key="item.id" :value="item.id">{{ item.value }}
              </a-select-option>

            </a-select>
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
          <a-tab-pane key="0" tab="正常账号"></a-tab-pane>
          <a-tab-pane key="1" tab="已删除账号"></a-tab-pane>
        </a-tabs>
        <div style="height: 4px"></div>
        <a-table :columns="column" :data-source="dataSource" size="middle" :pagination="pagination"
                 @change="handleTableChange" :row-key="record => record.id" :loading="loading"
        >
          <template slot="auction" slot-scope="text,record">
            <a-button type="link" size="small" :style="{paddingLeft: 0}" @click="handleAccount('edit',record)">编辑
            </a-button>
            <a-divider type="vertical"/>
            <a-button type="link" size="small" @click="handleResetPsd(record.id)">重置密码</a-button>
            <a-divider type="vertical"/>
            <a-button type="link" size="small" @click="handleDel(record.id)">删除</a-button>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
        :title="`${modalSign === 'add' ?'添加':'编辑'}账号`"
        v-model="modalVisible"
        :destroyOnClose="true"
        dialogClass="account-modal"
        :maskClosable="false"
        @ok="handleSubmit"
        @cancel="handleResetFields('form')"
        :confirm-loading="confirmLoading"
    >
      <div class="account-modal-wrapper">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="所属部门" prop="departmentId">
            <a-select v-model="form.departmentId" placeholder="请选择部门">
              <a-select-option v-for="item in department" :value="item.id" :key="item.id">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="请选择角色" prop="roleId">
            <a-select v-model="form.roleId" placeholder="请选择角色">
              <a-select-option v-for="item in role" :value="item.id" :key="item.id">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="姓名" prop="name">
            <a-input
                v-model="form.name"
                placeholder="请输入姓名"
            />
          </a-form-model-item>
          <template>
            <template v-if="modalSign === 'add'">
              <a-form-model-item ref="username" label="账号" prop="username">
                <a-input
                    v-model="form.username"
                    placeholder="请输入账号"
                    @blur="handleAutoCompletePsw"
                    :maxLength="8"
                    style="width: 314px"
                />
              </a-form-model-item>
            </template>
            <template v-else>
              <a-form-model-item label="账号">
                {{ form.username }}
              </a-form-model-item>
            </template>
          </template>
          <template v-if="modalSign === 'add'">
            <a-form-model-item ref="password" label="密码" prop="password">
              <a-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  :maxLength="20"
              />
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
import {encryptInfo} from "@/plugin/tools/encrypt";
import {SORTER_TYPE, accountColumns} from "./source";

export default {
  name: 'Account',
  nameComment: '内部权限管理/账号管理',
  data() {
    return {
      modalVisible: false,
      modalSign: 'add',
      searchParams: '1',
      loading: false,
      confirmLoading:false,
      navData: [
        {id: 1, title: '内部权限管理', path: '/auth/role'},
        {id: 2, title: '账号管理', path: '/auth/account'},
      ],
      role: [],
      department: [],
      dataSource: [],
      form: {
        departmentId: undefined,
        roleId: undefined,
        name: '',
        username: '',
        password: '',
      },
      queryParams: {
        isDeleted: '0', //是否删除（0-否、1-是），默认为0
        name: '',
        page: 1,
        roleId: undefined, //	角色ID
        departmentId: undefined,//部门ID
        sortColumn: '', //排序字段
        sortOrder: '', //排序顺序
        username: '', //账号
      },
      rules: {
        departmentId: [
          {required: true, message: '请输入所属部门'},
        ],
        roleId: [
          {required: true, message: '请输入角色'},
        ],
        name: [
          {required: true, message: '请输入姓名'},
          {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: "仅支持汉字和字母", trigger: 'blur'},
        ],
        username: [
          {required: true, message: '请输入账号'},
          {min: 8, message: '账号格式不正确，需为8位数字工号', trigger: 'blur'},
          {pattern: /^\d+$/, message: '账号格式不正确，需为8位数字工号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码'},
          {min: 6, max: 20, message: '密码长度需6-20位', trigger: 'blur'},
          {pattern: /^[^ ]+$/, message: "密码不支持空格", trigger: 'blur'},
          {pattern: /^[^\u4e00-\u9fa5]{0,}$/, message: "密码不支持中文", trigger: 'blur'},
        ],
      },
      labelCol: {span: 5},
      wrapperCol: {span: 16},
      pagination: {
        current: 1,
        total: 1,
        showQuickJumper: true,
        showLessItems: true,
        size: 'middle',
        showTotal: val => `共${val}条信息`,
      },
    };
  },
  components: {
    Breadcrumb,
  },
  created() {
    userAuthApi.getSectionListManagement().then((res) => {
      if (res.code === 20000) {
        this.department = res.data.length ? res.data : [];
      } else {
        this.$message.error(res.message);
      }
    });
    userAuthApi.getSimpleListUser().then((res) => {
      if (res.code === 20000) {
        this.role = res.data.length ? res.data : [];
      } else {
        this.$message.error(res.message);
      }
    });
    this.getTableList();
  },
  methods: {
    getTableList() {
      this.loading = true;
      this.dataSource = [];
      userAuthApi.listUser(clearProto(this.queryParams)).then((res) => {
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
    //查询||重置 搜索条件
    handleQuery(flag) {
      if (flag === 'reset') {
        this.handleResetFields('resetQuery');
      }
      this.pagination.current = 1;
      this.queryParams.page = 1;
      this.getTableList();
    },
    //删除账号
    handleDel(id) {
      this.$confirm({
        title: '确定删除账号？',
        content: '账号删除后，不可恢复',
        onOk: () => {
          userAuthApi.deleteUser({id}).then((res) => {
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
    //重置密码
    handleResetPsd(id) {
      this.$confirm({
        title: '确定重置密码？',
        content: '重置后用户的密码将变更为账号后6位',
        onOk: () => {
          userAuthApi.resetPassword({id}).then((res) => {
            if (res.code === 20000) {
              this.$message.success('重置密码成功');
              this.getTableList();
            } else {
              this.$message.error(res.message);
            }
          })
        },
      });
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
    handleFindKey(val, arr) {
      if (!arr.length) return '';
      const list = arr.find(i => i.value === val);
      return list ? list.id : '';
    },
    //密码自动填充为账号后六位
    handleAutoCompletePsw() {
      const username = this.form.username;
      if (/^\d{8}$/.test(username)) {
        let defautlPsw = username.length > 6 ? username.substring(username.length - 6) : username;
        this.form.password = defautlPsw;
      }
    },
    //打开弹窗 编辑||添加
    handleAccount(sign, record) {
      if (sign === 'edit') {
        const obj = {
          ...this.form,
          departmentId: this.handleFindKey(record.departmentName, this.department),
          id: record.id,
          roleId: this.handleFindKey(record.roleName, this.role),
          username: record.username,
          name: record.name
        };
        this.form = obj;
      }
      this.modalVisible = true;
      this.modalSign = sign;
    },
    //添加||编辑 账号
    handleSubmit(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = clearProto(this.form);
          this.confirmLoading = true;
          userAuthApi.saveUser(encryptInfo(params)).then((res) => {
            if (res.code === 20000) {
              this.$message.success('保存成功');
              this.handleResetFields('form');
              this.modalVisible = false;
              this.getTableList();
            } else if (res.code === 30008) {
              this.$message.warning('账号已存在');
            } else {
              this.$message.warning(res.message);
            }
          }).finally(()=> this.confirmLoading = false);
        } else {
          return false;
        }
      });
    },
    //重置表单|重置搜索条件|tab切换
    handleResetFields(flag) {
      if (flag === 'form') {
        this.form = {
          departmentId: undefined,
          roleId: undefined,
          name: '',
          username: '',
          password: '',
        };
      } else {
        this.queryParams = {
          ...this.queryParams,
          name: '',
          page: 1,
          roleId: undefined,
          departmentId: undefined,
          sortColumn: '',
          sortOrder: '',
          username: '',
        };
        this.pagination.current = 1;
      }

    }
  },
  computed: {
    column: function () {
      const {isDeleted, sortOrder} = this.queryParams;
      const flag = isDeleted === '0';
      const sort = Object.keys(SORTER_TYPE).find(i => SORTER_TYPE[i] === sortOrder);
      const dynamicColumn = flag ? accountColumns : accountColumns.slice(0, 4);
      const obj = {
        title: `${flag ? '创建' : '删除'}日期`,
        dataIndex: flag ? 'gmtCreate' : 'gmtDeleted',
        key: 'date',
        sorter: true,
        sortOrder: sort || false,
        customRender: val => val || '-',
      };
      return [obj, ...dynamicColumn]
    },
  },
  watch: {
    searchParams() {
      this.queryParams.name = '';
      this.queryParams.username = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.account-modal {
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
    width: 445px;
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

.delete {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}

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
