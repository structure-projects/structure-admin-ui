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
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
        <template slot="menu" slot-scope="{row}">
          <el-button
            type="button"
            class="el-button el-button--text el-button--small"
            @click="rowView(row)"
          ><span>查看</span>
          </el-button>
          <el-button
            type="button"
            class="el-button el-button--text el-button--small"
            @click="enableChange(row)"
          ><span v-show="row.enabled">停用</span>
            <span v-show="!row.enabled">启用</span>
          </el-button>
        </template>
        <template slot="userForm" slot-scope="">
          <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 avue-form__row">
            <div class="el-form-item el-form-item--small avue-form__item--">
              <label class="el-form-item__label" style="width: 90px;">部门:</label>
              <div class="el-form-item__content" style="margin-left: 90px;">
                <avue-select v-model="deptForm" all multiple placeholder="请选择部门" type="tree" :dic="deptDic" />
              </div>
            </div>
          </div>
          <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 avue-form__row">
            <div class="el-form-item el-form-item--small avue-form__item--">
              <label class="el-form-item__label" style="width: 90px;">添加用户:</label>
              <div class="el-form-item__content" style="margin-left: 90px;">
                <el-popover
                  ref="popover"
                  placement="bottom"
                  width="200"
                  trigger="focus"
                >
                  <el-table :data="searchData" @row-click="addUser">
                    <el-table-column width="80" property="empNo" label="职工编号" />
                    <el-table-column width="80" property="name" label="用户名" />
                  </el-table>
                  <el-input
                    slot="reference"
                    v-model="searchText"
                    placeholder="搜索：工号、手机号、姓名"
                    clearable
                  />
                </el-popover>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 avue-form__row">
              <avue-crud
                ref="crudUser"
                :option="userOption"
                :data="user"
                @row-del="userDel"
              />
            </div>
          </div>
        </template>
      </avue-crud>
    </el-main>
  </el-container>
</template>
<script>
import { list, save, update, enable, disable, remove } from '@/api/space'
export default {
  data() {
    return {
      key: 'space',
      form: {
      },
      deptForm: {
      },
      user: [],
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
      permission: { },
      searchText: '',
      searchData: [
        {
          id: '111',
          empNo: '111',
          name: '张三',
          dict: '1'
        },
        {
          id: '222',
          empNo: '111',
          name: '李四',
          dict: '2'
        }
      ],
      deptDic: [{
        label: '选项1',
        desc: '描述1',
        value: 0
      }, {
        label: '选项2',
        desc: '描述2',
        value: 1
      }],
      data: [
      ],
      userOption: {
        columnBtn: false,
        editBtn: false,
        addBtn: false,
        column: [
          {
            label: '职工编号',
            prop: 'empNo'
          },
          {
            label: '用户名',
            prop: 'name'
          },
          {
            label: '职务',
            prop: 'dict'
          }
        ]
      },
      option: {
        dialogDirection: 'rtl',
        dialogType: 'drawer',
        dialogWidth: '50%',
        columnBtn: false,
        searchMenuSpan: 4,
        border: true,
        column: [
          {
            label: '空间名称',
            prop: 'name',
            search: true,
            editDisplay: true
          },
          {
            label: '空间编码',
            prop: 'code',
            search: true
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
            labelWidth: 0,
            label: '',
            prop: 'user',
            span: 24,
            hide: true,
            formslot: true,
            editDisplay: false,
            addDisplay: false
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
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
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
    rowView(row, index) {
      this.$refs.crud.rowView(row)
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
    showEdit(row) {
      this.form = row.user
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
    addUser(row) {
      console.log(row)
      const user = this.searchData.find(item => {
        return item.id === row.id
      })
      console.log(JSON.stringify(user))
      if (!user) {
        this.user.push(row)
      }
      console.log(this.$refs)
      this.$refs.popover.doClose()
    },
    userDel(form, index, done) {
      done(form)
    }
  }
}
</script>
<style>
.btnSearceUser{
  height:  36px;
}
.avue--detail .el-form-item__content {
  padding-left: 0px;
}
</style>
