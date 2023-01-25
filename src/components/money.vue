<template>
  <div class="qianji">
    <div class="title">{{plan.name}}</div>
    <div class="text"><span>还差：</span>{{notYet.toFixed(2)}}</div>
    <div class="text"><span>进度：</span>{{((planMoney+notYet)/planMoney*100).toFixed(2)}}%</div>
    <div class="text"><span>{{currentMonth}}月结余：</span>{{(monthlyIncome-monthlyExpenditure).toFixed(2)}}</div>
    <div class="marquee_box cen" v-if="lateList.length">
      <ul class="marquee_list" :class="{marquee_top:animate}">
        <li v-for="(item, index) in lateList" :key="index" :style="{color: item.type==0?'blue':'red'}">
          <div class="typeItem" v-if="item.type == 2">
            <span style="color:#fff">{{item.descinfo}}转账{{item.money}}元</span>
          </div>
          <div class="typeItem" v-else>
            <img class="public" :src="item.category.icon" alt="">
            <span>{{item.date}}{{item.category.name}}（{{item.fromact}}）{{item.type==0?'支出':'收入'}}{{item.money}}元</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { moneySumApi, monthDataApi } from '@/api/app'
onMounted(()=>{
  getMonthData()
  carousel()
})
const headers:any = {
  devid: '8793f2fd2d25c2ffc081850f8cc31232',
  os: '1',
  ctrl: 'asset',
  cregion: 'CN',
  pkg: 'com.mutangtech.qianji',
  network: 'wifi',
  vsn: '3.2.1.9',
  tok: 'e0ca4e762d30015d1ef23f2e3a624545',
  act: 'list',
  devbrand: 'IENGLISH',
  clang: 'zh',
  osvs: '27',
  utoken: 'c11b8afb4776e7975e3ddb0c5e6ae849f8d4f81a',
  devname: 'iEnglish 4',
  reso: '800,1214',
  reqidv2: '2e74e8e1e7c52b698a4bbb627dc3e838',
  vs: '710',
  mk: 'guanwang',
  htoken: '1',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
}
const notYet = ref<number>(0)
interface Plan {
  name: string
}
const plan = ref<Plan>({
  name: ''
})
const planMoney = ref<number>(0)
// 资产
function getMoneySum() {
  moneySumApi({
    data: {
      uidOrFr: '220317806232af02732d2',
      headers
    },
  }).then(res => {
    let list:any = []
    let not = 0
    for (let item of res.data.data.list) {
      not+=item.money
      !list[item.type] && (list[item.type] = [])
      list[item.type].push(item)
    }
    notYet.value = not
    list = list.filter((item: any) => item)
    plan.value = list[1][0]
    planMoney.value = Math.abs(list[1][0].money)
  })
}
// 查询月
const currentMonth = ref<number>(0)
const lateList = ref<any>([])
const monthlyExpenditure = ref<number>(0)
const monthlyIncome = ref<number>(0)
function getMonthData() {
  let date = new Date();
  let year = date.getFullYear()
  currentMonth.value = date.getMonth() + 1
  let day = date.getDate()
  monthDataApi({
    data: {
      headers,
      uidOrFr: '220317806232af02732d2',
      bookid: '-1',
      withbudget: '0',
      year: year,
      month: currentMonth.value
    }
  }).then(res => {
    let expenditure = 0
    let income = 0
    let isDay = true // 是否是当天
    let lateDate = new Date(res.data.data.list[0].time*1000)
    let lateDay = lateDate.getMonth()+1 + '月' + lateDate.getDate() + '日'
    let list = []
    for (let item of res.data.data.list) {
      if (item.type == 0) {
        expenditure += item.money
      } else if (item.type == 1 || item.type ==20) {
        income += item.money
      }
      if (isDay) {
        let itemDate = new Date(item.time*1000)
        let itemDay = itemDate.getMonth()+1 + '月' + itemDate.getDate() + '日'
        if (lateDay == itemDay) {
          item.date = `${itemDate.getHours()>9?itemDate.getHours():'0'+itemDate.getHours()}:${itemDate.getMinutes()>9?itemDate.getMinutes():'0'+itemDate.getMinutes()}`
          list.push(item)
        } else {
          isDay = false
        }
      }
    }
    list.length==1 && list.push(list[0])
    lateList.value = list
    if (monthlyExpenditure.value!=expenditure || monthlyIncome.value!=income) {
      getMoneySum()
    }
    monthlyExpenditure.value = expenditure
    monthlyIncome.value = income
  }).catch(err => {
  })
  // 轮训获取
  setTimeout(() => {
    getMonthData()
  }, 60 * 1000);
}
// 动画
const animate = ref<boolean>(false)
// 轮播
let timer: any = null
function carousel() {
  timer && clearInterval(timer)
  timer = setInterval(() => {
    animate.value = true;
    setTimeout(()=>{
      lateList.value.push(lateList.value[0]);
      lateList.value.shift();
      animate.value = false;
    }, 500)
  }, 5000); // 停留一段时间后来执行这个动画
}
</script>
<style lang="scss" scoped>
.qianji {
  position: absolute;
  top: 400px;
  right: 80px;
  width: 270px;
  height: 176px;
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
}
.marquee_box {
  position: relative;
  overflow: hidden;
  height: 30px;
  margin-top: 20px;
  .marquee_list {
    position: absolute;
    top: 0;
    left: 10px;
    li {
      width: 250px;
      line-height: 30px;
      background: rgb(#fffbe5, .4);
      border-radius: 15px;
      padding: 0 6px;
      position: relative;
      display: flex;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      text-align: center;
      display: flex;
      justify-content: center;
      font-weight: 700;
      .typeItem {
        display: flex;
      }
      .public {
        display: block;
        width: 16px;
        height: 16px;
        margin: 7px 7px 0 7px;
      }
    }
  }
}
.marquee_top {
  transition: all 0.5s;
  margin-top: -30px
}
</style>