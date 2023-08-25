<template>
  <el-container>
    <el-main>
      <avue-form :key="key" ref="form" v-model="config" :option="option" @submit="submit" />
    </el-main>
  </el-container>
</template>

<script>
import { getSysConfig, changSysConfig } from '@/api/config.js'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      key: 'form',
      config: {
        // title: '项目名称',
        // themeColors: '#1890FF',
        // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png',
        // loginBg: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
      },
      option: {
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        menuBtn: true,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'input',
            label: '项目名称',
            span: 12,
            display: true,
            prop: 'title',
            colorFormat: 'hex',
            bind: 'title',
            showAlpha: false
          },
          {
            type: 'color',
            label: '主题颜色',
            span: 12,
            display: true,
            prop: 'themeColors',
            bind: 'themeColors',
            colorFormat: 'hex',
            showAlpha: false
          },
          {
            type: 'upload',
            label: 'logo',
            span: 24,
            display: true,
            prop: 'logo',
            bind: 'logo',
            title: '上传字段',
            action: '/api/file/upload',
            dataType: 'string',
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
            type: 'upload',
            label: '登录背景图',
            span: 24,
            display: true,
            prop: 'loginBg',
            bind: 'loginBg',
            title: '上传字段',
            action: '/api/file/upload',
            dataType: 'string',
            listType: 'picture-img',
            headers: {
              Authorization: 'Bearer ' + getToken()
            },
            propsHttp: {
              url: 'url',
              name: 'name',
              res: 'data'
            }
          }
        ]
      }
    }
  },
  created() {
    getSysConfig(this.params).then((res) => {
      this.config = res.data
    })
    console.log(this.organization)
  },
  methods: {
    submit(form, done) {
      this.$message.success('操作成功，需要重新加载后生效！', JSON.stringify(form))
      changSysConfig(form).then((res) => {
      })
      done()
    }
  }
}
</script>
