import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import URLSafeBase64 from 'urlsafe-base64'
import encrypt from '../utils/encrypt'
import { Message } from 'element-ui'
import { debuglog } from 'util';

Vue.use(VueAxios, axios)

const hcaxios = {
  instance: null,
  loading: null,

  // 初始化axios实例
  init: function () {
    if (this.instance) return

    const instance = axios.create()
    instance.defaults.timeout = 20000
    let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
    let CancelToken = axios.CancelToken
    let removePending = (config, needCancel) => {
      for (let p in pending) {
        if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
          if (needCancel) { 
            pending[p].f() // 执行取消操作
          }
          pending.splice(p, 1) // 把这条记录从数组中移除
        }
      }
    }

    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      removePending(config, 1) // 在一个ajax发送前执行一下取消操作
      config.cancelToken = new CancelToken(c => {
        pending.push({ u: config.url + '&' + config.method, f: c })
      })
      return config
    }, error => {
      return Promise.reject(error)
    })

    // response的拦截器，在此进行错误处理，并返回data.data以方便使用
    instance.interceptors.response.use(response => {
      // removePending(response.config, 0) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
      if (parseInt(data.code) === 401) { // 未登录
        const newurl = data.data.replace('#host#', window.location.host).replace('#url#', URLSafeBase64.encode(encrypt(window.location.href)))
        window.location.href = newurl
        return
      }

      if (data.code === 200) {
        return data.data
      }
      else {
        return data
      }
    }, function (error) {
      if (error instanceof axios.Cancel) {
        error.isCanceled = true
      } else {
        error.isCanceled = false
        Message({message: '请求异常或超时，请稍后重新尝试！', type: 'warning'})
      }
      return Promise.reject(error)
    })

    this.instance = instance
  },

  get: function (apiName, opts) {
    if (opts && typeof opts === 'object') {
      opts = { params: opts }
    }
    return hcaxios.request(apiName, opts, 'get')
  },

  send: function (apiName, opts) {
    if (opts && typeof opts === 'object') {
      opts = { data: opts }
    }
    return hcaxios.request(apiName, opts, 'post')
  },

  request: function (apiName, opts, method) {
    console.log('call api',apiName)
    this.init()

    if (typeof apiName === 'object') {
      opts = apiName
      apiName = opts.apiName
    } else if (typeof apiName === 'string') {
      if (typeof opts === 'object') {
        opts = { data: opts.data, params: opts.params }
      } else {
        opts = {data: {}, params: {}}
      }
    } else {
      throw new Error('hxaios的参数不正确')
    }
    if (!apiName) {
      throw new Error('apiName is not defined!')
    }

    const {data, params, ...rest} = opts

    return this.instance.request({
      url: apiName,
      method: method,
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json', 'charset': 'UTF-8'},
      params,
      ...rest
    })
  }
}

export default {
  get: hcaxios.get,
  send: hcaxios.send
}
