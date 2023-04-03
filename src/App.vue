<template>
  <div class="app">
    <!-- 钱迹 -->
    <Money ref="moneyRef" v-if="apiData.assetList" :assetList="apiData.assetList" :billList="apiData.billList"></Money>
    <!-- 哔哩哔哩 -->
    <!-- <Bli></Bli> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import request from "@/axios/axios";
import Money from '@/components/money.vue'
import Bli from '@/components/bli.vue'
const apiData = ref<any>({})
const moneyRef = ref<any>(null)
onMounted(() => {
  getApiData()
})
function getApiData() {
  request({
    url: '/desktop',
    method: 'get',
  }).then(res => {
    apiData.value = res
    setTimeout(() => {
      moneyRef.value.getFun()
    }, 0);
    setTimeout(() => {
      getApiData()
    }, 1000 * 60);
  }).catch(err => {
    setTimeout(() => {
      getApiData()
    }, 1000 * 60 * 60);
  })
}
</script>
  
<style lang="scss" scoped>
.app {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('/public/bg.png') no-repeat;
  background-size: 100% 100%;
}
</style>
