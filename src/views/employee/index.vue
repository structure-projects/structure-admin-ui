<template>
  <el-container>
    <!-- 需要使用权限控制是否显示部门 只有管理员才会显示部门，如果时部门主管只显示当前部门和子部门的信息普通成员则如果有权限也不会显示这个区域 -->
    <el-aside v-show="isAdmin">
      <avue-tree key="dept" ref="tree" :option="treeOption" :data="treeData" @node-click="nodeClick">
        <span slot-scope="{node}" class="el-tree-node__label">
          <span>
            <i class="el-icon-user-solid" />
            {{ (node || {label}).label }}
          </span>
        </span>
      </avue-tree>
    </el-aside>
    <el-main>
      <avue-crud
        :key="key"
        ref="crud"
        v-model="obj"
        :data="data"
        :option="option"
        :page.sync="page"
        :permission="permission"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @current-change="currentChange"
        @size-change="sizeChange"
        @search-reset="resetChange"
      >
        <template slot="menu" slot-scope="{row,size}">
          <el-button
            :disabled="row.userId"
            type="button"
            class="el-button el-button--text el-button--small"
            :size="size"
            @click="handleUser(row)"
          >
            <span>邀请用户</span>
          </el-button>
        </template>
      </avue-crud>
    </el-main>
  </el-container>
</template>
<script>
import { list, save, update, get, remove } from '@/api/employee'
import { tree } from '@/api/dept'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      drawer: false,
      resetForm: {},
      key: 'member',
      isAdmin: true,
      page: {
        background: false,
        currentPage: 1,
        pageSize: 20,
        total: 20
      },
      deptId: undefined,
      permission: {},
      params: {
      },
      data: [
      ],
      option: {
        menuWidth: 280,
        viewBtn: true,
        searchMenuSpan: 4,
        border: true,
        column: [
          {
            label: '姓名',
            prop: 'name',
            search: true
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'select',
            dicData: [
              {
                label: '男',
                value: '1'
              },
              {
                label: '女',
                value: '2'
              }
            ]
          },
          {
            label: '电话',
            prop: 'phone'
          },
          {
            hide: true,
            label: '出生日期',
            prop: 'birthdate',
            type: 'date',
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          },
          {
            hide: true,
            label: '户口地址',
            prop: 'accountAddress'
          },
          {
            hide: true,
            label: '居住地址',
            prop: 'residenceAddress'
          },
          {
            hide: true,
            label: '身份证号',
            prop: 'idCard'
          },
          {
            hide: true,
            label: '学历',
            prop: 'education',
            type: 'select',
            props: {
              label: 'label',
              value: 'value'
            },
            dicData: [
              {
                label: '小学',
                value: '1'
              },
              {
                label: '初中',
                value: '2'
              },
              {
                label: '高中',
                value: '3'
              },
              {
                label: '中专',
                value: '4'
              },
              {
                label: '大专',
                value: '5'
              },
              {
                label: '本科',
                value: '6'
              },
              {
                label: '研究生',
                value: '5'
              }
            ]
          },
          {
            label: '工号',
            prop: 'empno',
            editDisplay: false,
            addDisplay: false,
            search: true
          },
          {
            label: '部门',
            prop: 'dept',
            type: 'cascader',
            dicUrl: '/api/dept/option/',
            editDisplay: false,
            props: {
              label: 'name',
              value: 'id'
            },
            dicHeaders: {
              Authorization: 'Bearer ' + getToken()
            }
          },
          {
            hide: true,
            label: '职称',
            prop: 'rank',
            type: 'select',
            props: {
              label: 'label',
              value: 'value'
            },
            dicData: [
              {
                label: '超级管理员',
                value: '1'
              },
              {
                label: '管理员',
                value: '2'
              },
              {
                label: '部门主管',
                value: '3'
              },
              {
                label: '普通职工',
                value: '4'
              },
              {
                label: '访客',
                value: '5'
              }
            ]
          },
          {
            hide: true,
            label: '职务',
            prop: 'duty',
            type: 'select',
            props: {
              label: 'label',
              value: 'value'
            },
            dicData: [
              {
                label: '超级管理员',
                value: '1'
              },
              {
                label: '管理员',
                value: '2'
              },
              {
                label: '部门主管',
                value: '3'
              },
              {
                label: '普通职工',
                value: '4'
              },
              {
                label: '访客',
                value: '5'
              }
            ]
          },
          {
            hide: true,
            label: '职位',
            prop: 'position',
            type: 'select',
            props: {
              label: 'label',
              value: 'value'
            },
            dicData: [
              {
                label: '超级管理员',
                value: '1'
              },
              {
                label: '管理员',
                value: '2'
              },
              {
                label: '部门主管',
                value: '3'
              },
              {
                label: '普通职工',
                value: '4'
              },
              {
                label: '访客',
                value: '5'
              }
            ]
          },
          {
            label: '入职日期',
            prop: 'entryDate',
            span: 12,
            type: 'date',
            hide: true,
            viewDisabled: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          },
          {
            search: true,
            label: '职工状态',
            prop: 'state',
            type: 'select',
            props: {
              label: 'label',
              value: 'value'
            },
            searchValue: '1',
            dicData: [
              {
                label: '在职',
                value: '1'
              },
              {
                label: '离职',
                value: '2'
              },
              {
                label: '待岗',
                value: '3'
              }
            ]
          },
          {
            label: '操作人',
            prop: 'operator',
            editDisplay: false,
            addDisplay: false
          },
          {
            label: '操作时间',
            prop: 'operatorTime',
            width: 160,
            editDisplay: false,
            addDisplay: false
          }
        ]
      },
      obj: {},
      treeData: [],
      treeOption: {
        addBtn: false,
        defaultExpandAll: true,
        props: {
          id: 'id',
          label: 'name',
          value: 'value',
          children: 'children'
        }
      }
    }
  },
  created() {
    this.getDeptTree()
    this.getList()
  },
  methods: {
    getList() {
      this.params.deptId = this.deptId
      list(this.page, this.params).then((res) => {
        this.page.total = parseInt(res.data.total)
        this.data = res.data.records
      })
    },
    searchChange(params, done) {
      if (done) done()
      this.params = params
      this.page.currentPage = 1
      this.getList()
    },
    refreshChange() {
      this.getList()
    },
    resetChange() {
      this.deptId = undefined
      this.params = {}
      this.getList()
    },
    rowSave(form, done, loading) {
      loading()
      save(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        }
        form.id = res.data
        done(form)
      })
    },
    rowDel(form, index, done) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done(form)
        console.log(form.id)
        remove(form.id).then((res) => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.getList()
        })
      }).catch(() => { })
    },
    rowUpdate(form, index, done, loading) {
      setTimeout(() => {
        loading()
      }, 1000)
      update(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
        done(form)
        this.getList()
      })
    },
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    getDeptTree() {
      tree().then((res) => {
        this.treeData = res.data
      })
    },
    nodeClick(data) {
      this.deptId = data.id
      this.getList()
    }
  }
}
</script>
