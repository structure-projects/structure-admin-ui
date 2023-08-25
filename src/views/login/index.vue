<template>
  <div ref="loginContainer" class="login-container">
    <div class="login-wp">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-form-item prop="password">
          <el-button class="login-btn" :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
          <span class="more-auth">
            <el-dropdown @command="showAuthCode">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">中心认证</el-dropdown-item>
                <el-dropdown-item command="1">钉钉认证</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>

        </el-form-item>
      </el-form>
    </div>
    <transition name="el-fade-in-linear">
      <div v-show="tripartiteAuthVisible" ref="tripartiteAuth" class="tripartite-auth-container">
        <div class="tripartite-auth-box">
          <div class="tripartite-auth-title">{{ tripartiteAuth.title }}
            <i class="el-icon-close tripartite-auth-close" @click="closeTripartiteAuth" />
          </div>
          <iframe class="tripartite-auth-code" :src="tripartiteAuth.url" scrolling="no" frameborder="0" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位！'))
      } else {
        callback()
      }
    }
    return {
      tripartiteAuthVisible: false,
      tripartiteAuthList: [
        { title: '中心认证',
          url: '',
          authType: 'center'
        },
        { title: '钉钉认证',
          url: 'https://login.dg-work.cn/oauth2/auth.htm?response_type=code&client_id=jz_oauth_dingoa&redirect_uri=http://127.0.0.1:8010/&scope=get_user_info&authType=QRCODE',
          authType: 'dingding'
        }
      ],
      tripartiteAuth: {},
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      bgImg: sessionStorage.getItem('loginBg')
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.bgImg = sessionStorage.getItem('loginBg')
    if (this.bgImg) {
      console.log('crate' + this.$refs.loginContainer)
      this.$refs.loginContainer.style = "background-image: url('" + this.bgImg + "');"
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  updated() {

  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.authType = 'password'
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showAuthCode(command) {
      this.tripartiteAuth = this.tripartiteAuthList[command]
      this.tripartiteAuthVisible = true
    },
    handleAuthCode() {
      const authParams = {
        authType: 'code',
        code: 'aaa'
      }
      this.$store.dispatch('user/login', authParams)
        .then(() => {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    closeTripartiteAuth() {
      this.tripartiteAuthVisible = false
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    position: relative;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      color: $light_gray;
      // height: 47px;
      caret-color: $cursor;
      font-size: 24px;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        background-color: transparent !important; //设置input框记住密码背景颜色
        background-image: none;
        transition: background-color 50000s ease-in-out 0s;
        -webkit-text-fill-color: #fff !important; //设置浏览器默认密码字体颜色
      }
      &::-webkit-input-placeholder {
        color: #fff !important;
        font-size: 24px !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
::v-deep .el-form-item__content {
  height: 72px !important;
  line-height: 72px !important;
}
::v-deep .el-form-item__error {
  font-size: 24px !important;
}

.login-container {
  min-height: 100%;
  background-color: $bg;
  width: 100%;
  background-image: url("../../assets/login.jpeg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  .login-wp {
    width: 642px;
    min-height: 100%;
    background: rgba(2, 77, 153, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-form {
    width: 525px;
    max-width: 100%;
    overflow: hidden;
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-bottom: 2px solid rgba(47, 160, 224, 0.6);
      margin-bottom: 52px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0px 20px 6px 15px;
    color: #ffffff;
    vertical-align: middle;
    width: 30px;
    font-size: 24px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 15px;
    top: 0px;
    font-size: 24px;
    color: #ffffff;
    cursor: pointer;
    user-select: none;
  }
  .login-btn{
    width: 100%;
    height: 72px;
    background-color: rgba(0, 144, 255, 1);
    font-size: 30px;
    font-weight: 400;
    color: #ffffff;
  }

  .more-auth {
    position: absolute;
    right: 15px;
    top: 0px;
    font-size: 24px;
    color: #ffffff;
    cursor: pointer;
    user-select: none;
    .el-dropdown-link{
      font-size: 24px;
      color: #ffffff;
    }
  }

  .tripartite-auth-container{
    display:flex;
    transform:translate(-50%,-50%);
    position:absolute;
    left: 50%;
    top: 50%;
    .tripartite-auth-box{
      justify-content:center;
      background-color: #fff;
      width: 260px;
      height: 300px;
      border-radius: 5px;
    }
    .tripartite-auth-title{
      width: 100%;
      text-align: center;
      top: 0px;
      font-size: 24px;
      padding-top: 10px;
       position: relative;
    }
    .tripartite-auth-close{
      position: absolute;
      right: 15px;
      cursor: pointer;
    }
    .tripartite-auth-code{
      position:absolute;
      padding: 20px;
      width: 260px;
      height: 260px;
      margin: 0;
    }
  }
}
</style>
