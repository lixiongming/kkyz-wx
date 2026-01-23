<template>
    <view class="main-box" :style="{ height: hei + 'px' }">
      <!-- navbar -->
      <!-- <Header  v-bind="_attrs" v-if="props.gTitle">
        <template #left>
          <slot name="left"></slot>
        </template>
        <template #right>
          <slot name="right"></slot>
        </template>
      </Header>
   -->

      <view class="main-container"  :style="{ height: hei + 'px' }">
        <slot></slot>
      </view>
    </view>
  </template>
  
<script setup lang="ts">
  import { ref, watch, computed, useAttrs, defineProps  } from "vue";
  import Header from "../header/index.vue"
  
  const props = defineProps({
    gTitle: {
      type: String,
      default: ""
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  });

  // 收集透传属性
  const attrs = useAttrs();
const hei = uni.getSystemInfoSync().windowHeight ;
  

  watch(() => props.gTitle, (val) => {
    _attrs.value = {
      ...attrs,
      title: val || ''
    }
  })

  const _attrs = ref({
    ...attrs,
    title: props.gTitle || ''
  });

  // const bgStyle = computed(() => {
  //  return {
  //    background: `url(${attrs.navBgImg}) transparent left top / 100% auto no-repeat`,
  //    backgroundAttachment: 'fixed'
  //  };
  // })

</script>
  
<style lang="less">
.main-box {
  width: 750rpx;
}
.main-container {
  width: 750rpx;
  display: flex;
  flex-direction: column;
}

</style>
  