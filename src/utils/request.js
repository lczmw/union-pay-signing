import axios from 'axios'
import { Toast  } from 'vant'

// 创建axios实例
const service = axios.create({
  baseURL: '/wxapi', // api 的 base_url
  timeout: 20000 // 请求超时时间
})

// response 拦截器
service.interceptors.response.use(
  response => {
    const { isShowError } = response.config
    const res = response.data
    if (res.successed !== true) {
      isShowError !== false && Toast.fail({
        message: res.message || '网络错误'
      })
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    console.log(error)
    Toast.fail({
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default service
