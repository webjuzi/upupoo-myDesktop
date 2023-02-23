
import request from "@/axios/axios";
// 获取服务器信息
interface ServerParams {
  data: {
    cmd: string
    vps_type?: string
    id?: string
    ptype?: string
  }
  headers: {
    'Content-Type': string
    cookie: string
  }
}
export function getServerApi(data: ServerParams) {
  return request({
    url: '/sanfeng/server',
    method: 'post',
    data: {
      ...data,
      requestUrl: '/www/vps'
    }
  })
}

// 可延期时间
export function delayApi(data: ServerParams) {
  return request({
    url: '/sanfeng/server',
    method: 'post',
    data: {
      ...data,
      requestUrl: '/www/renew'
    }
  })
}

// 我的资产
interface MoneyParams {
  data: {
    uidOrFr: string
    headers: any
  },
}
export function moneySumApi(data: MoneyParams) {
  return request({
    url: '/asset/list',
    method: 'post',
    data,
  })
}
// 查询月账单
interface MonthParams {
  data: {
    uidOrFr: string
    headers: any
    bookid: string
    withbudget: string
    year: number
    month: number
  },
}
export function monthDataApi(data: MonthParams) {
  return request({
    url: '/bill/list',
    method: 'post',
    data,
  })
}

// api列表
export function apiListApi() {
  return request({
    url: '/apiList',
    method: 'get',
  })
}

// 获取B站粉丝数
export function bliFansApi() {
  return request({
    url: '/bliFans',
    method: 'get',
  })
}