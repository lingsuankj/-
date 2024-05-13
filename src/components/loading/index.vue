<template>
  <div class="loaderBox" v-if="Object.keys(props.chartData).length === 0">
    <div class="loader"></div>
  </div>
</template>

<script setup>
const props = defineProps(['chartData']);
</script>

<style lang="less" scoped>
  .loaderBox {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .loader {
    width: 38px;
    aspect-ratio: 1;
    --_c:no-repeat radial-gradient(farthest-side,#1890FF 92%,#0000);
    background: 
      var(--_c) top,
      var(--_c) left,
      var(--_c) right,
      var(--_c) bottom;
    background-size: 10px 10px;
    animation: l7 1s infinite;
  }
  @keyframes l7 {to{transform: rotate(.5turn)}}
</style>
