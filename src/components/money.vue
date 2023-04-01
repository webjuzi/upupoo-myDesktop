<template>
  <div class="qianji">
    <div class="title">{{200000}}{{title}}</div>
    <div class="text"><span>钱包：</span>{{planMoney.toFixed(2)}}</div>
    <div class="text"><span>{{currentMonth}}月结余：</span>{{(monthlyIncome-monthlyExpenditure).toFixed(2)}}</div>
    <div class="progress">
      <span>{{(planMoney/target*100).toFixed(2)}}%</span>
      <!-- 上月进度 -->
      <div class="lastMonth" :style="{width:planMoney/target*250+'px'}">
        <div class="lastMonthBox">
          <div class="thisMonth" :style="{
            width: monthlyBalance>0?monthlyBalance/target*250+'px':-monthlyBalance/target*250+'px',
            right: monthlyBalance>0?-monthlyBalance/target*250+'px':0,
            background: monthlyBalance>0?'#ff0000':'#0000ff'
          }"></div>
        </div>
      </div>
    </div>
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
import { ref } from 'vue';
const props = defineProps({
  assetList: {
    type: Object,
    default: () => {}
  },
  billList: {
    type: Object,
    default: () => {}
  }
})
const title = '小目标'
const target = 200000
function getFun() {
  getMoneySum(props.assetList)
}
// 资产
const planMoney = ref<number>(0)
function getMoneySum(assetList: any) {
  let money = 0
  for (let item of assetList.list) {
    money += item.money
  }
  if (planMoney.value !== money) {
    timer && clearInterval(timer)
    lateList.value = [] // 最近一天的记录
    monthlyExpenditure.value = 0
    monthlyIncome.value = 0
    monthlyBalance.value = 0
    getMonthData(props.billList)
  }
  planMoney.value = money
}
// 查询月
const currentMonth = ref<number>(0) // 当前月份
const lateList = ref<any>([]) // 最近一天的记录
const monthlyExpenditure = ref<number>(0)
const monthlyIncome = ref<number>(0)
const monthlyBalance = ref<number>(0)
function getMonthData(billList: any) {
  currentMonth.value = billList.month
  if (billList.list.length == 0) return // 没有数据时，不执行
  let expenditure = 0 // 支出
  let income = 0 // 收入
  let isDay = true // 是否是当天
  let lateDate = new Date(billList.list[0].time*1000)
  let lateDay = lateDate.getMonth()+1 + '月' + lateDate.getDate() + '日' // 最近记录的日期
  let list = [] // 最近一天的记录
  for (let item of billList.list) {
    if (item.type == 0) {
      expenditure += item.money // 月支出
    } else if (item.type == 1 || item.type ==20) {
      income += item.money // 月收入
    }
    if (isDay) { // 最近的一天
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
  list.length==1 && list.push(list[0]) // 只有一条数据时，复制一条
  lateList.value = list // 最近一天的记录
  monthlyIncome.value = income // 月收入
  monthlyExpenditure.value = expenditure // 月支出
  monthlyBalance.value = income - expenditure // 月结余
  carousel()
}
// 动画
const animate = ref<boolean>(false)
// 轮播
let timer: any = null
function carousel() {
  timer = setInterval(() => {
    animate.value = true;
    setTimeout(()=>{
      lateList.value.push(lateList.value[0]);
      lateList.value.shift();
      animate.value = false;
    }, 500)
  }, 1500); // 停留一段时间后来执行这个动画
}
defineExpose({
  getFun
})
</script>
<style lang="scss" scoped>
.qianji {
  position: absolute;
  top: 100px;
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
  .progress {
    position: relative;
    width: 250px;
    height: 20px;
    margin: 8px 0 0 10px;
    text-align: right;
    border: 1px solid #aaa;
    border-radius: 4px;
    color: #fff;
    overflow: hidden;
    font-size: 14px;
    line-height: 20px;
    span {
      margin-right: 10px;
    }
    .lastMonth {
      position: absolute;
      left: 0;
      top: 0;
      height: 20px;
      background: #00ffd5;
      border-radius: 3px 0 0 3px;
      .lastMonthBox {
        position: relative;
        width: 100%;
        height: 100%;
        .thisMonth {
          position: absolute;
          top: 0;
          height: 20px;
          opacity: .6;
        }
      }
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