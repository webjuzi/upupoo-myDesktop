<template>
  <view>
    <div class="bli">
      <div class="text">B数: {{ numberFans }}</div>
    </div>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { bliFansApi } from '@/api/app'
const numberFans = ref<number>(0)
function getBliFansApi() {
  bliFansApi().then(res => {
    numberFans.value = res.data.data.follower
    // 轮训获取
    setTimeout(() => {
      getBliFansApi()
    }, 60 * 1000);
  })
}
getBliFansApi()
</script>
<style lang="scss" scoped>
.bli {
  position: absolute;
  bottom: 0px;
  right: 560px;
  .text {
    font-size: 26px;
    color: #fff;
    font-weight: 700;
  }
}
</style>