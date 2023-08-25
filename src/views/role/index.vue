<template>
  <el-container>
    <el-main>
      <avue-crud
        ref="crud"
        :key="key"
        v-model="form"
        :data="data"
        :option="option"
        :page.sync="page"
        :permission="permission"
        :before-open="beforeOpen"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
        <template
          slot="menu"
          slot-scope="{row,index}"
        >
          <el-button
            :disabled="row.type === 1"
            type="button"
            class="el-button el-button--text el-button--small avue-crud__editBtn "
            @click="$refs.crud.rowEdit(row, index)"
          >
            <i class="el-icon-edit" />
            <span>编 辑
            </span>
          </el-button>
          <el-button
            :disabled="row.type === 1"
            type="button"
            class="el-button el-button--text el-button--small avue-crud__delBtn"
            @click="$refs.crud.rowDel(row, index)"
          >
            <i class="el-icon-delete" />
            <span>
              删 除
            </span>
          </el-button>
          <el-button
            type="button"
            class="el-button el-button--text el-button--small"
            @click="enableChange(row)"
          ><span v-show="row.enabled">停用</span>
            <span v-show="!row.enabled">启用</span>
          </el-button>
        </template>
      </avue-crud>
    </el-main>
  </el-container>
</template>
<script>
import { get, list, save, update, enable, disable, remove } from '@/api/role'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      key: 'role',
      data: [
      ],
      page: {
        background: false,
        currentPage: 1,
        pages: 1,
        pageSize: 10,
        total: 20
      },
      params: {
        enabled: true
      },
      permission: {},
      form: {},
      option: {
        dialogDirection: 'rtl',
        dialogType: 'drawer',
        dialogWidth: '50%',
        columnBtn: false,
        viewBtn: true,
        delBtn: false,
        editBtn: false,
        menuWidth: 380,
        searchMenuSpan: 4,
        searchSpan: 4,
        border: true,
        column: [
          {
            label: '角色名称',
            prop: 'name',
            search: true,
            editDisplay: true
          },
          {
            label: '角色编码',
            prop: 'code',
            search: true
          },
          {
            label: '角色类型',
            prop: 'type',
            addDisplay: false,
            editDisplay: false,
            disabled: true,
            type: 'select',
            search: true,
            value: 2,
            dicData: [
              {
                label: '系统角色',
                value: 1
              },
              {
                label: '用户角色',
                value: 2
              }
            ]
          },
          {
            hide: true,
            label: '字典描述',
            prop: 'remark',
            span: 24,
            type: 'textarea'
          },
          {
            label: '是否启用',
            prop: 'enabled',
            search: true,
            searchValue: 'true',
            dataType: 'string',
            type: 'switch',
            value: true,
            editDisplay: false,
            span: 12,
            dicData: [
              {
                label: '停用',
                value: false
              },
              {
                label: '启用',
                value: true
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
          },
          {
            hide: true,
            label: '权限',
            prop: 'authorities',
            dataType: 'array',
            type: 'tree',
            multiple: true,
            span: 24,
            props: {
              label: 'name',
              value: 'id'
            },
            dicUrl: '/api/menu/option',
            dicHeaders: {
              Authorization: 'Bearer ' + getToken()
            }
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      list(this.page, this.params).then((res) => {
        this.page.total = parseInt(res.data.total)
        this.data = res.data.records
      })
    },
    searchChange(params, done) {
      if (done) done()
      this.params = params
      this.getList()
    },
    refreshChange() {
      this.getList()
    },
    rowSave(form, done, loading) {
      loading()
      save(form).then((res) => {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        form.id = res.data
        done(form)
        this.getList()
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
    beforeOpen(done, type) {
      if (type === 'view' || type === 'edit') {
        const params = {
          roleId: this.form.id
        }
        get(params).then((res) => {
          this.form = res.data
        })
        this.treeData = this.authoritiesData
      }
      done()
    },
    enableChange(row) {
      row.enabled = !row.enabled
      if (row.enabled) {
        enable(row.id).then((res) => {
          this.getList()
        })
      } else {
        disable(row.id).then((res) => {
          this.getList()
        })
      }
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
    checkChange(data, checked, indeterminate) {
      this.$message.success(JSON.stringify(data))
    }
  }
}
</script>
