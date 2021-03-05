<template>
  <div class="frame-wrapper">
    <Breadcrumb :source="navData" icon="environment">
      <template slot="suffix">
        <a-button class="addAccount" @click="handleSection('add')">
          <a-icon type="user"/>
          新建部门
        </a-button>
      </template>
    </Breadcrumb>
    <div class="frame-wrapper-content">
      <div class="frame-query">
        <a-form-model layout="inline">
          <a-form-model-item label="部门名称">
            <a-input v-model="queryParams.departmentName" placeholder="请输入部门名称" class="custom-prefix-6"/>
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
          <a-tab-pane key="0" tab="正常部门"></a-tab-pane>
          <a-tab-pane key="1" tab="已删除部门"></a-tab-pane>
        </a-tabs>
        <div style="height: 4px"></div>
        <a-table :columns="column" :data-source="dataSource" size="middle" :pagination="pagination"
                 @change="handleTableChange" :row-key="record => record.id" :loading="loading"
        >
          <template slot="auction" slot-scope="text,record">
            <a-button type="link" size="small" class="edit" :style="{paddingLeft: 0}"
                      @click="handleSection('edit',record)">编辑
            </a-button>
            <a-divider type="vertical"/>
            <a-button type="link" class="delete" size="small" @click="handleDel(record.id)">删除</a-button>
          </template>
        </a-table>
      </div>
      <a-modal
          :title="`${modalSign === 'add' ?'新建':'编辑'}部门`"
          v-model="modalVisible"
          :destroyOnClose="true"
          dialogClass="section-modal"
          :maskClosable="false"
          @ok="handleSubmit"
          @cancel="handleResetFields('form')"
          :confirm-loading="confirmLoading"
      >
        <div class="section-modal-wrapper">
          <a-form-model
              ref="ruleForm"
              :model="form"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="部门名称" prop="departmentName">
              <a-input
                  v-model="form.departmentName"
                  placeholder="请输入部门名称"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/bread-crumb';
import userAuthApi from '@/plugin/api/user-auth';
import {clearProto} from "@/plugin/tools";
import {SORTER_TYPE, sectionColumns} from "./source";

export default {
  name: 'Seciton',
  nameComment: '内部权限管理/部门管理',
  data() {
    return {
      modalVisible: false,
      modalSign: 'add',
      loading: false,
      confirmLoading:false,
      navData: [
        {id: 1, title: '内部权限管理', path: '/auth/role'},
        {id: 2, title: '部门管理', path: '/auth/section'},
      ],
      dataSource: [],
      queryParams: {
        isDeleted: '0', //是否删除（0-否、1-是），默认为0
        departmentName: '',
        page: 1,
        sortColumn: '', //排序字段
        sortOrder: '', //排序顺序
      },
      form: {
        departmentName: '',
        id: '',
      },
      rules: {
        departmentName: [
          {required: true, message: '请输入部门名称'},
          {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: "仅支持汉字和字母", trigger: 'blur'},
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
    this.getTableList();
  },
  methods: {
    getTableList() {
      this.loading = true;
      this.dataSource = [];
      userAuthApi.getSectionList(this.queryParams).then((res) => {
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
    handleResetFields(flag) {
      if (flag === 'form') {
        this.form = {
          departmentName: '',
          id: '',
        }
      } else {
        this.queryParams = {
          ...this.queryParams,
          departmentName: '',
          page: 1,
          sortColumn: '', //排序字段
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
      this.queryParams.page = 1;
      this.pagination.current = 1;
      this.getTableList();
    },
    //删除部门
    handleDel(id) {
      this.$confirm({
        title: '确定删除此部门？',
        content: '删除部门会同时删除部门内所有账号，且部门删除后，不可恢复',
        onOk: () => {
          userAuthApi.removeSection({id}).then((res) => {
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

    //tab切换
    handleTabChange(val) {
      this.queryParams.isDeleted = val;
      this.handleResetFields('tab');
      this.getTableList();
    },

    //排序-翻页
    handleTableChange(pgt, filters, sorter) {
      const params = {...this.queryParams};
      this.pagination.current = pgt.current;
      params.page = pgt.current;
      params.sortOrder = SORTER_TYPE[sorter.order];
      params.sortColumn = sorter.order ? SORTER_TYPE[sorter.field] : '';
      this.queryParams = params;
      this.getTableList();
    },

    //打开添加/编辑部门弹窗
    handleSection(sign, record) {
      if (sign === 'edit') {
        this.form.departmentName = record.departmentName;
        this.form.id = record.id;
      }
      this.modalVisible = true;
      this.modalSign = sign;
    },

    //添加/编辑部门
    handleSubmit(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = clearProto(this.form);
          this.confirmLoading = true;
          userAuthApi.addSection(params).then((res) => {
            if (res.code === 20000) {
              this.$message.success('保存成功');
              this.handleResetFields('form');
              this.modalVisible = false
              this.getTableList();
            } else if (res.code === 30008) {
              this.$message.warning('部门已存在');
            } else {
              this.$message.warning(res.message);
            }
          }).finally(()=> this.confirmLoading = false);
        } else {
          return false;
        }
      });
    },
  },
  computed: {
    column: function () {
      const {isDeleted, sortOrder} = this.queryParams;
      const sort = Object.keys(SORTER_TYPE).find(i => SORTER_TYPE[i] === sortOrder);
      return sectionColumns(sort, isDeleted);
    },
  },
}
</script>

<style scoped lang="scss">
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
