<template>
  <el-container style="padding: 20px;">
    <avue-crud
      ref="crud"
      :key="key"
      v-model="form"
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
      @tree-load="treeLoad"
    >
      <template slot="icon" slot-scope="scope">
        <i :class="scope.row.icon" style="font-size:24px" />
      </template>
      <template slot="menu" slot-scope="{row,size}">
        <el-button
          type="button"
          class="el-button el-button--text el-button--small"
          @click="enableChange(row)"
        ><span v-show="row.enabled">停用</span>
          <span v-show="!row.enabled">启用</span>
        </el-button>
        <el-button
          :disabled="row.menuType === 1"
          type="button"
          class="el-button el-button--text el-button--small"
          :size="size"
          @click="handleAdd(row)"
        >
          <span>新增子级</span>
        </el-button>
      </template>
    </avue-crud>
  </el-container>
</template>

<script >
import { list, save, update, enable, disable, remove, children } from '@/api/menu'
export default {
  data() {
    return {
      key: 'menu',
      pid: 0,
      form: {},
      page: {
        background: false,
        currentPage: 1,
        pageSize: 20,
        total: 20
      },
      data: [
      ],
      params: {
        enabled: true
      },
      permission: {},
      option: {
        searchMenuSpan: 4,
        menuWidth: 380,
        headerAlign: 'center',
        align: 'center',
        border: true,
        rowKey: 'id',
        rowParentKey: 'pid',
        viewBtn: true,
        rowSort: false,
        lazy: true,
        column: [
          {
            label: '菜单名称',
            prop: 'name',
            align: 'left',
            width: 200,
            search: true
          },
          {
            label: '菜单编码',
            prop: 'code',
            search: true
          },
          {
            label: '权限标识',
            prop: 'permission'
          },
          {
            label: '打开方式',
            prop: 'openType',
            type: 'select',
            dicData: [
              {
                label: '内部',
                value: 2
              },
              {
                label: '内部',
                value: 2
              },
              {
                label: '外部',
                value: 3
              }
            ]
          },
          {
            label: '图标',
            prop: 'icon',
            type: 'icon',
            iconList: [
              {
                label: '基本图标',
                list: [{
                  label: '详情',
                  value: 'el-icon-info'
                }, {
                  label: '异常',
                  value: 'el-icon-error'
                }, {
                  label: '成功',
                  value: 'el-icon-success'
                }, {
                  label: '警告',
                  value: 'el-icon-warning'
                }, {
                  label: '问题',
                  value: 'el-icon-question'
                }]
              }]
          },
          {
            label: '菜单类型',
            prop: 'type',
            type: 'select',
            value: 1,
            dicData: [
              {
                label: '功能',
                value: 1
              },
              {
                label: '菜单',
                value: 2
              },
              {
                label: '按钮',
                value: 3
              }
            ]
          },
          {
            label: '菜单级别',
            prop: 'menuType',
            display: true,
            type: 'select',
            value: 2,
            formatter: (val, value, label) => {
              return value === 1 ? '内置' : label
            },
            dicData: [
              {
                label: '内部',
                value: 2
              },
              {
                label: '外部',
                value: 3
              }
            ]
          },
          {
            label: '权重',
            prop: 'sequence',
            type: 'number',
            value: 0
          },
          {
            hide: true,
            label: '组件',
            prop: 'component',
            type: 'select',
            dicData: [
              {
                label: '菜单',
                value: 'Layout'
              },
              {
                label: '表格',
                value: '@/views/component/crud'
              },
              {
                label: '表单',
                value: '@/views/component/form'
              },
              {
                label: '看板',
                value: '@/views/component/dashboard'
              },
              {
                label: '自定义',
                value: '@/views/component/custom'
              },
              {
                label: '无组件（无需选择的功能例如按钮）',
                value: ''
              }
            ]
          },
          {
            hide: true,
            label: '重定向地址',
            prop: 'redirect',
            span: 24
          },
          {
            hide: true,
            label: '路由地址',
            prop: 'router',
            span: 24
          },
          {
            hide: true,
            label: '是否可见',
            prop: 'visible',
            searchValue: true,
            type: 'switch',
            span: 12,
            value: true,
            editDisplay: false,
            dicData: [
              {
                label: '不可见',
                value: false
              },
              {
                label: '可见',
                value: true
              }
            ]
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
            label: '描述',
            span: 24,
            prop: 'remark',
            type: 'textarea'
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
      this.page.currentPage = 1
      this.getList()
    },
    refreshChange() {
      this.getList()
    },
    rowSave(form, done, loading) {
      loading()
      form.pid = this.parentId
      save(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        }
        form.id = res.data
        done(form)
        this.parentId = undefined
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
    handleAdd(row) {
      this.parentId = row.id
      this.$refs.crud.rowAdd()
    },
    showEdit(row) {
      this.$DialogForm.show({
        title: '编辑',
        data: row,
        option: this.option,
        beforeClose: (done) => {
          this.$message.success('关闭前方法')
          done()
        },
        callback: (res) => {
          console.log(res.data)
          this.$message.success('关闭等待框')
          setTimeout(() => {
            res.done()
            setTimeout(() => {
              this.$message.success('关闭弹窗')
              res.close()
            }, 1000)
          }, 1000)
        }
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
    treeLoad(tree, treeNode, resolve) {
      const params = {
        parentId: tree.id
      }
      children(params).then((res) => {
        resolve(res.data)
      })
    },
    sortableChange(oldindex, newindex, row, list) {
      this.$message.success(oldindex + ',' + newindex)
      console.log(oldindex, newindex)
    }
  }
}
</script>
