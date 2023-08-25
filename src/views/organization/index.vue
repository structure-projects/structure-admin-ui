<template>
  <el-container>
    <el-main>
      <avue-form :key="key" ref="form" v-model="organization" :option="option" @submit="submit" />
    </el-main>
  </el-container>
</template>

<script>
import { getCurrent, changCurrent } from '@/api/organization.js'
export default {
  data() {
    return {
      key: 'form',
      organization: {
        // name: '企业一站式解决方案基金会',
        // address: '北京省北京市',
        // domain: 'structured.cn',
        // introduce: '一个专注于企业解决方案的团队',
        // adminName: '管理员',
        // adminPhone: '1888888888',
        // config: {
        //   title: '项目名称',
        //   themeColors: '#1890FF',
        //   logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png',
        //   loginBg: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
        // }
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
            label: '机构名称',
            span: 24,
            display: true,
            prop: 'name'
          },
          {
            type: 'input',
            label: '机构地址',
            span: 24,
            display: true,
            prop: 'address'
          },
          {
            type: 'input',
            label: '域账号',
            span: 24,
            display: true,
            disabled: true,
            prop: 'domain'
          },
          {
            type: 'textarea',
            label: '机构介绍',
            span: 24,
            display: true,
            prop: 'introduce'
          },
          {
            type: 'input',
            label: '管理员名称',
            span: 12,
            display: true,
            prop: 'adminName'
          },
          {
            type: 'input',
            label: '管理员电话',
            span: 12,
            display: true,
            prop: 'adminPhone'
          }
        ]
        // {
        //   label: '个性化',
        //   prop: 'style',
        //   arrow: false,
        //   collapse: true,
        //   display: true,
        //   column: [
        //     {
        //       type: 'input',
        //       label: '项目名称',
        //       span: 12,
        //       display: true,
        //       prop: 'title',
        //       colorFormat: 'hex',
        //       bind: 'config.title',
        //       showAlpha: false
        //     },
        //     {
        //       type: 'color',
        //       label: '主题颜色',
        //       span: 12,
        //       display: true,
        //       prop: 'themeColors',
        //       bind: 'config.themeColors',
        //       colorFormat: 'hex',
        //       showAlpha: false
        //     },
        //     {
        //       type: 'upload',
        //       label: 'logo',
        //       dataType: 'string',
        //       span: 24,
        //       display: true,
        //       prop: 'logo',
        //       bind: 'config.logo',
        //       title: '上传字段',
        //       action: 'https://wpimg.wallstcn.com/',
        //       listType: 'picture-img',
        //       propsHttp: {
        //         res: 'data'
        //       }
        //     },
        //     {
        //       type: 'upload',
        //       label: '登录背景图',
        //       span: 24,
        //       display: true,
        //       prop: 'loginBg',
        //       bind: 'config.loginBg',
        //       title: '上传字段',
        //       action: 'https://api.avuejs.com/imgupload',
        //       dataType: 'string',
        //       listType: 'picture-img',
        //       propsHttp: {
        //         res: 'data'
        //       }
        //     }
        // ]
        // }
        // ]
      }
    }
  },
  created() {
    getCurrent(this.page, this.params).then((res) => {
      this.organization = res.data
    })
    console.log(this.organization)
  },
  methods: {
    submit(form, done) {
      this.$message.success('操作成功，需要重新加载后生效！', JSON.stringify(form))
      changCurrent(form).then((res) => {
      })
      done()
    }
  }
}
</script>
