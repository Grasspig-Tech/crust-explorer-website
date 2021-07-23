import axios from 'axios'
import store from '@/store/index.js'

console.log('base_url---', process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/')
// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: 100000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (Number(res.code) !== 200) {
      store.state.vuethis.$message.error(res.msg);
      // return Promise.reject('error')
      return response.data
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    store.state.vuethis.$message.error(error.message);
    return Promise.reject(error)
  }
)

export default service
