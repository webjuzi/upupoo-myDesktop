<template>
  <div>
    <div class="server" v-if="serverDetails.server.EndTime">
      <div class="title">服务器信息</div>
      <div class="text"><span>到期时间：</span>{{serverDetails.server.EndTime}}</div>
      <div class="text" v-show="serverDetails.server.next_time && serverDetails.time"><span>可续期时间：</span>{{nextTime}}</div>
      <div class="text" v-show="serverDetails.time"><span>运行时间：</span>{{runTime}}</div>
    </div>
    <div class="server" v-else-if="invalidSookie">
      <textarea v-model="cookie" class="input"></textarea>
      <div class="btn" @click="setCookie">设置cookie</div>
    </div>
    <div class="apiList">
      <div class="apiItem" v-for="(item,index) in apiList">
        {{item.date}} {{item.url}}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getServerApi, delayApi, apiListApi } from '@/api/app'
onMounted(()=>{
  getApiDataOne()
})

// 登录
function setCookie() {
  invalidSookie.value = false
  localStorage.setItem('cookie', cookie.value)
  getApiDataOne()
}
// 服务器信息
interface Server {
  server: any
  state: Object
  time: string
  img: any
}
const serverDetails = ref<Server>({
  server: {},
  state: {},
  img: {},
  time: ''
})
let invalidSookie = ref<boolean>(false)
let nextTime = ref<String>('')
let nextCountDown = ref<number>(0)
let cookie = ref<string>(localStorage.getItem('cookie') || '')
async function getApiDataOne() {
  // 服务器信息
  await getServerApi({
    data: {
      cmd: 'vps_list',
      vps_type: 'free',
      id: '403808'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: cookie.value
    }
  }).then((res: any)=>{
    if (res.data.response == '50140') {
      invalidSookie.value = true
    } else {
      serverDetails.value.server = res.data.msg.content[0]
    }
  })
  if (invalidSookie.value) return
  // 可续期时间
  await delayApi({
    data: {
      cmd: 'check_free_delay',
      ptype: 'vps'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: cookie.value
    }
  }).then((res: any)=>{
    serverDetails.value.server.next_time = res.data.msg.next_time
    nextCountDown.value = Math.floor((new Date(res.data.msg.next_time).getTime() - new Date().getTime()) / 1000)
  })
  // 运行时间
  await getServerApi({
    data: {
      cmd: 'getRunTime',
      id: '403808'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: cookie.value
    }
  }).then((res: any)=>{
    serverDetails.value.time = res.data.msg
    let dayArr = res.data.msg.split(' ')
    let arr = []
    let alreadyTimeSum = 0
    if (dayArr.length > 1) {
      arr = dayArr[1].split(':')
      alreadyTimeSum = Number(arr[0]) * 3600 + Number(arr[1]) * 60 + Number(arr[2]) + Number(dayArr[0]) * 86400
    } else {
      arr = dayArr[0].split(':')
      alreadyTimeSum = Number(arr[0]) * 3600 + Number(arr[1]) * 60 + Number(arr[2])
    }
    setTime(alreadyTimeSum)
  })
  getApiData()
}
// 计时
let timer:any = undefined
let runTime = ref<String>('')
function setTime(sum:number) {
  let sumTime:number = sum
  let countDown:number = nextCountDown.value
  timer && clearInterval(timer)
  timer = setInterval(() => {
    sumTime++
    let d = Math.floor(sumTime / 86400)
    let h = Math.floor(sumTime % 86400 / 3600)
    let m = Math.floor(sumTime % 86400 % 3600 / 60)
    let s = Math.floor(sumTime % 86400 % 3600 % 60)
    runTime.value = `${d>0?d+':':''}${h>9?h:'0'+h}:${m>9?m:'0'+m}:${s>9?s:'0'+s}`
    if (countDown > 0) {
      countDown--
      let cd = Math.floor(countDown / 86400)
      let ch = Math.floor(countDown % 86400 / 3600)
      let cm = Math.floor(countDown % 86400 % 3600 / 60)
      let cs = Math.floor(countDown % 86400 % 3600 % 60)
      nextTime.value = `${cd>0?cd+':':''}${ch>9?ch:'0'+ch}:${cm>9?cm:'0'+cm}:${cs>9?cs:'0'+cs}`
    } else {
      nextTime.value = '已到时间'
    }
  }, 1000)
}
const apiList = ref<any>([])
async function getApiData() {
  setTimeout(() => {
    getApiData()
  }, 60000);
  // 截图
  await apiListApi().then((res: any)=>{
    apiList.value = res.data
  })
}
</script>
<style lang="scss" scoped>
.server {
  position: absolute;
  top: 80px;
  right: 80px;
  width: 270px;
  height: 290px;
  background: rgb(#000, .5);
  border-radius: 12px;
  .title {
    text-align: center;
    margin: 10px 0;
    color: #1296db;
    font-weight: 700;
    font-size: 18px;
  }
  .text {
    color: #fff;
    span {
      display: inline-block;
      text-align: right;
      width: 100px;
    }
  }
  .input {
    display: block;
    width: 200px;
    height: 50px;
    margin: 10px auto 10px;
    padding: 10px;
    box-sizing: border-box;
  }
  .btn {
    width: 100px;
    height: 30px;
    background: #1296db;
    color: #fff;
    border-radius: 8px;
    line-height: 30px;
    font-weight: 700;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
  }
}
.apiList {
  position: absolute;
  top: 210px;
  right: 100px;
  width: 230px;
  height: 140px;
  background: rgb(#000, .5);
  border-radius: 8px;
  padding: 3px 10px;
  box-sizing: border-box;
  overflow: hidden;
  .apiItem {
    color: #fff;
  }
}
</style>