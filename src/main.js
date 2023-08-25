import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
import axios from 'axios'
import AvueFormDesign from '@sscfaith/avue-form-design'
import AvueUeditor from 'avue-plugin-ueditor'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.use(Avue, {
  axios
})
Vue.use(AvueFormDesign)
Vue.use(AvueUeditor)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
