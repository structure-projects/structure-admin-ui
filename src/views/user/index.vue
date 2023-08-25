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
        <template slot="menu" slot-scope="{ row, index }">
          <el-button
            icon="el-icon-check"
            type="button"
            class="el-button el-button--text el-button--small"
            @click="showResetPassword(row, index)"
          >重置密码
          </el-button>
          <el-button
            type="button"
            class="el-button el-button--text el-button--small"
            @click="enableChange(row)"
          ><span v-show="row.enabled">停用</span>
            <span v-show="!row.enabled">启用</span>
          </el-button>
          <el-button
            type="button"
            class="el-button el-button--text el-button--small"
            @click="lockedChange(row)"
          ><span v-show="row.locked">解锁</span>
            <span v-show="!row.locked">锁定</span>
          </el-button>
        </template>
      </avue-crud>
      <el-drawer
        ref="drawer"
        title="重置密码"
        :visible.sync="drawer"
        direction="rtl"
      >
        <el-container>
          <avue-form
            :key="resetKey"
            ref="resetForm"
            v-model="resetForm"
            :option="resetPasswordOption"
            @submit="resetPassword"
          />
        </el-container>
      </el-drawer>
    </el-main>
  </el-container>
</template>
<script>
import { get, list, save, update, enable, disable, remove, lock, unlock, resetPassword } from '@/api/user'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      drawer: false,
      resetForm: {},
      key: 'user',
      resetKey: 'resetPwd',
      page: {
        background: false,
        currentPage: 1,
        pages: 1,
        pageSize: 10,
        total: 20
      },
      params: {
        enabled: true,
        locked: false
      },
      form: {

      },
      permission: {

      },
      data: [
      ],
      option: {
        menuWidth: 380,
        viewBtn: true,
        searchMenuSpan: 4,
        searchSpan: 4,
        searchShow: false,
        border: true,
        column: [
          {
            label: '用户名',
            prop: 'username',
            search: true,
            editDisabled: true,
            length: 10,
            rules: [{
              type: 'string',
              // max: 50,
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }]
          },
          {
            hide: true,
            label: '密码',
            prop: 'password',
            type: 'password',
            editDisplay: false,
            viewDisplay: false
          },
          {
            label: '邮箱',
            prop: 'email',
            width: 160
          },
          {
            label: '昵称',
            prop: 'nickName',
            search: true
          },
          {
            label: '电话',
            prop: 'phone',
            search: true
          },

          {
            type: 'upload',
            label: '头像',
            prop: 'photo',
            dataType: 'string',
            span: 24,
            display: true,
            // value: 'f778738c-e4f8-4870-b634-56703b4acafe.gif',
            title: '上传字段',
            action: '/api/file/upload',
            listType: 'picture-img',
            headers: {
              Authorization: 'Bearer ' + getToken()
            },
            propsHttp: {
              url: 'url',
              name: 'name',
              res: 'data'
            }
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
            label: '是否锁定',
            prop: 'locked',
            search: true,
            dataType: 'string',
            searchValue: 'false',
            type: 'switch',
            span: 12,
            value: false,
            editDisplay: false,
            dicData: [
              {
                label: '锁定',
                value: true
              },
              {
                label: '未锁定',
                value: false
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
            label: '角色',
            prop: 'role',
            type: 'select',
            dataType: 'array',
            multiple: true,
            span: 12,
            props: {
              label: 'name',
              value: 'id'
            },
            dicUrl: '/api/role/list/',
            dicHeaders: {
              Authorization: 'Bearer ' + getToken()
            }
          }
        ]
      },
      obj: {},
      resetPasswordOption: {
        column: [
          {
            type: 'password',
            label: '新密码',
            span: 24,
            display: true,
            prop: 'newPassword'
          },
          {
            type: 'password',
            label: '确认密码',
            span: 24,
            display: true,
            prop: 'verifyPassword'
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
      console.log(this.params)
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
      save(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        }
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
      console.log(type)
      if (type === 'view' || type === 'edit') {
        console.log('getUser')
        const params = {
          userId: this.form.id
        }
        get(params).then((res) => {
          this.form = res.data
        })
      }
      done()
    },
    showResetPassword(row, index) {
      this.resetForm.id = row.id
      this.drawer = true
      this.$refs.resetForm.resetForm()
    },
    resetPassword(resetForm, done) {
      if (resetForm.newPassword !== resetForm.verifyPassword) {
        this.$message.error('新密码不一致不能提交')
      } else {
        const resetData = {
          id: resetForm.id,
          newPassword: resetForm.newPassword
        }
        resetPassword(resetData).then((res) => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '密码重置成功!'
            })
          }
          done()
          this.drawer = false
        })
      }
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
    lockedChange(row) {
      row.locked = !row.locked
      if (row.locked) {
        lock(row.id).then((res) => {
          this.getList()
        })
      } else {
        unlock(row.id).then((res) => {
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
    }
  }
}
</script>
