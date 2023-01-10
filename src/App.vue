<template>
  <div class="app">
    <!-- 服务器信息 -->
    <Server></Server>
    <!-- 钱迹 -->
    <Money></Money>
  </div>
</template>

<script lang="ts" setup>
import Server from '@/components/server.vue'
import Money from '@/components/money.vue'
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
