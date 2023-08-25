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
        <template slot="itemForm" slot-scope="scope">
          <avue-crud
            ref="crudItem"
            :option="itemOption"
            :data="item"
            @row-save="itemSave"
            @row-update="itemUpdate"
            @row-del="itemDel"
          >
            <template slot="menu" slot-scope="{row}">
              <el-button
                type="button"
                class="el-button el-button--text el-button--small"
                @click="itemEnableChange(row)"
              ><span v-show="row.enabled">停用</span>
                <span v-show="!row.enabled">启用</span>
              </el-button>
            </template>
          </avue-crud>
        </template>
      </avue-crud>
    </el-main>
  </el-container>
</template>
<script>
import { list, save, update, enable, disable, remove, listItem, saveItem, updateItem, removeItem, enableItem, disableItem } from '@/api/dict'
export default {
  data() {
    return {
      key: 'dict',
      form: {},
      item: [],
      permission: {},
      params: {
        enabled: true
      },
      page: {
        background: false,
        currentPage: 1,
        pageSize: 20,
        total: 20
      },
      data: [
      ],
      itemParams: {

      },
      option: {
        addBtn: true,
        columnBtn: false,
        menuWidth: 280,
        delBtn: true,
        editBtn: true,
        border: true,
        searchMenuSpan: 4,
        dialogType: 'drawer',
        column: [
          {
            label: '字典名称',
            prop: 'name',
            search: true
          },
          {
            label: '字典编码',
            prop: 'code',
            search: true
          },
          {
            label: '字符上限',
            prop: 'upperLimit'
          },
          {
            label: '权重顺序',
            prop: 'sequence',
            type: 'number'
          },
          {
            hide: true,
            label: '字典描述',
            prop: 'remark',
            span: 24,
            type: 'textarea'
          },
          {
            label: '字典类型',
            prop: 'type',
            disabled: true,
            addDisplay: false,
            editDisplay: false,
            value: 2,
            dicData: [
              {
                label: '系统',
                value: 1
              },
              {
                label: '用户',
                value: 2
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
            labelWidth: 0,
            label: '',
            prop: 'item',
            span: 24,
            hide: true,
            formslot: true,
            editDisplay: false,
            addDisplay: false
          }
        ]
      },
      itemOption: {
        columnBtn: false,
        rowSort: true,
        column: [
          {
            label: '字典项',
            prop: 'name'
          },
          {
            label: '字典值',
            prop: 'value'
          },
          {
            label: '是否启用',
            prop: 'enabled',
            searchValue: 'true',
            dataType: 'string',
            type: 'switch',
            value: true,
            editDisplay: false,
            viewDisplay: false,
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
      save(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        }
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
    rowView(row, index) {
      this.itemParams.dictCategoryCode = row.code
      this.getListItem()
      this.$refs.crud.rowView(row)
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
    getListItem() {
      listItem(this.itemParams).then((res) => {
        this.item = res.data
      })
    },
    itemSave(form, done, loading) {
      form.code = this.itemParams.dictCategoryCode
      form.sequence = 0
      loading()
      saveItem(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        }
        form.id = res.data
        done(form)
        this.getListItem()
      })
    },
    itemDel(form, index, done) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done(form)
        console.log(form.id)
        removeItem(form.id).then((res) => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => { })
    },
    itemUpdate(form, index, done, loading) {
      setTimeout(() => {
        loading()
      }, 1000)
      updateItem(form).then((res) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
        done(form)
      })
    },
    itemEnableChange(row) {
      row.enabled = !row.enabled
      if (row.enabled) {
        enableItem(row.id).then((res) => {
        })
      } else {
        disableItem(row.id).then((res) => {
        })
      }
    }
  }
}
</script>
