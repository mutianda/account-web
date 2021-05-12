import Vue from 'vue'
import axios from 'axios'
import store from '@/store'

export default class AxiosRequest {
  baseURL
  instance
  cancelTokenFns = {}
  CancelToken = axios.CancelToken

  constructor (baseURL) {
    this.baseURL = baseURL
    this._init()
  }

  _init () {
    this.instance = axios.create(this.getDefaultConfig())
    this.initInterceptors()
  }

  /**
   * 用于获取默认配置
   */
  getDefaultConfig () {
    const config = {
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    return config
  }

  /**
   * 核心api，用于发送请求
   */
  request (options, shouldCancel = false) {
    const extraOptions = {}

    if (shouldCancel) {
      const url = options.url
      const cancelFns = this.cancelTokenFns
      const cancelFn = cancelFns[url]

      if (cancelFn) {
        cancelFn('cancel')
      }
      extraOptions.cancelToken = new this.CancelToken(function (c) {
        cancelFns[url] = c
      })
    }

    return this.instance({ ...options, ...extraOptions })
  }

  initInterceptors () {
    // 请求拦截
    const reqFn = config => {

      return config
    }
    const reqErrorFn = err => {
      return Promise.reject(err)
    }
    this.instance.interceptors.request.use(reqFn, reqErrorFn)

    // 响应拦截
    const resFn = ({ data, status }) => {
      return data
    }
    const resErrorFn = err => {

      return Promise.reject(err)
    }
    this.instance.interceptors.response.use(resFn, resErrorFn)
  }
}
