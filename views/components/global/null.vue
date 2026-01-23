<template>
  <view
      class="flex jc-ct flex-ac flex-column"
      :style="{ height: customHeight }"
    >
      <image
        style="width: 256rpx; height: 256rpx"
        class="iconimg3"
        :src="imgUrlEvent('/images/home/nullImg.png')"
        mode=""
      ></image>
      <text class="fs-24 fc-777777">暂无数据</text>
    </view>
</template>

<script setup lang="ts">
import { ref, computed,  } from "vue";
import uerStore from "@/business/store/index";
import Inav from "@/views/components/i-nav.nvue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";

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
