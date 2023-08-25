<template>
  <el-container>
    <el-main>
      <avue-crud
        ref="crud"
        v-model="form"
        :permission="permission"
        :option="option"
        :data="data"
        :page.sync="page"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @current-change="currentChange"
        @size-change="sizeChange"
        @tree-load="treeLoad"
      >
        <template slot="menu" slot-scope="{row}">
          <el-button v-show="permission.addBtn" class="el-button el-button--text el-button--small" @click="handleAdd(row)">新增子级</el-button>
          <el-button
            v-show="permission.bindBtn"
            class="el-button el-button--text el-button--small"
            type="button"
            @click="openBindRole(row)"
          >分配角色</el-button>
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
    <el-drawer ref="drawer" title="分配角色" :visible.sync="drawer" direction="rtl">
      <el-container>
        <el-main>
          <el-tree
            ref="tree"
            :data="roleData"
            :default-checked-keys="checkedKeys"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="treeProps"
          />
        </el-main>
        <el-footer>
          <div class="avue-crud__header">
            <div class="avue-crud__left" />
            <div class="avue-crud__right">
              <el-button class="" type="primary" @click="bindRole">提交</el-button>
              <el-button @click="$refs.drawer.closeDrawer()">取 消</el-button>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-drawer>
  </el-container>
</template>

<script>
import { list, children, save, update, enable, disable, remove } from '@/api/dept'
import { option as roleList } from '@/api/role'
export default {
  data() {
    return {
      parentId: undefined,
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
      permission: {
        delBtn: true,
        editBtn: true,
        addBtn: true,
        bindBtn: true,
        menu: true
      },
      option: {
        searchMenuSpan: 4,
        headerAlign: 'center',
        menuWidth: 380,
        align: 'center',
        border: true,
        rowKey: 'id',
        rowParentKey: 'pid',
        lazy: true,
        column: [
          {
            label: '部门编号',
            prop: 'code',
            align: 'left',
            width: 200,
            search: true,
            span: 12
          },
          {
            label: '部门名称',
            prop: 'name',
            span: 24,
            search: true,
            type: 'input'
          },
          {
            label: '部门描述',
            span: 24,
            prop: 'remark',
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
          }
        ]
      },
      roleData: [
      ],
      checkedKeys: [3, 4],
      drawer: false,
      treeProps: {
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
    this.getRoleList()
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
          form.id = res.data
        }
        done(form)
        this.parentId = undefined
      })
    },
    rowDel(form, index, done) {
      if (form.hasChildren) {
        this.$message('存在子部门不能删除，如果部门废弃可以通过禁用隐藏部门，如果维护错误可以先删除子部门后再尝试删除父部门！')
        return
      }
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
      })
    },
    enableChange(row) {
      row.enabled = !row.enabled
      if (row.enabled) {
        enable(row.id).then((res) => {
        })
      } else {
        disable(row.id).then((res) => {
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
    handleAdd(row) {
      this.parentId = row.id
      this.$refs.crud.rowAdd()
    },
    treeLoad(tree, treeNode, resolve) {
      const params = {
        parentId: tree.id
      }
      children(params).then((res) => {
        resolve(res.data)
      })
    },
    getRoleList() {
      console.log('getRoleList')
      const params = {}
      roleList(params).then((res) => {
        this.roleData = res.data
      })
    },
    openBindRole(row) {
      this.$message.success('加载菜单成功')
      this.drawer = true
      this.checkedData = [3, 4]
    },
    bindRole() {
      this.$message.success('绑定角色成功')
      const checkedData = this.$refs.tree.getCheckedKeys()
      console.log(checkedData)
      this.$refs.drawer.closeDrawer()
    }
  }
}
</script>
