<template>
    <view
        class="flex jc-ct flex-ac flex-column"
        :style="{ height: customHeight }"
      >
        <image
          style="width: 256rpx; height: 256rpx"
          class="iconimg3"
          :src="imgUrlEvent('/images/save-money/nullImg.png')"
          mode=""
        ></image>
        <text class="fs-24 fc-777777">暂无数据</text>
      </view>
  </template>
  
  <script setup lang="ts">
  import { ref, computed,  } from "vue";
  import uerStore from "@/views/pages/save-money/store/index";
  import { imgUrlEvent } from "@/views/pages/save-money/infrastructure/utils/imgUrls.ts";
  
  const props = defineProps({
    height: {
      type: String,
      default: "",
    }
  })
  const store = uerStore();
  const windowHeight = store.windowHeight;
  
  let customHeight = computed(()=>{
      return props.height ? props.height + 'px' : windowHeight - 160 + 'px'
  })
  
  </script>
  <style scoped lang="less">
  </style>
  