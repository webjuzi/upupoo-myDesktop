import axios from 'axios'
const service = axios.create({
  baseURL: 'https://fc-mp-7bb6a3c5-0fb6-4f30-93c8-39aff081b52c.next.bspapp.com',
  timeout: 30000, // request timeout
})
// 请求拦截
service.interceptors.request.use(
  (config: any) => {
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response: any) => {
    const res = response.data
    if (res.code !== 1 || res.code !== 200) {
      return response.data
    } else {
      return response.data
    }
  },
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          break
        default:
          if (error.response.data.error == 'invalid_grant') {
          }
          return Promise.reject(error)
      }
    }
  }
)

export default service
