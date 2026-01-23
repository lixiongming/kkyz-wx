<template>
  <view class="list-item" @click="toDetail">
    <image class="img" :src="list.merchant.mer_avatar" mode="aspectFill"></image>
    <view class="right-box">
      <view class="name"
        ><text class="text">{{ list.merchant.mer_name }}</text></view
      >
      <view class="footer">
        <slot name="btn"></slot>
      </view>
    </view>
  </view>
</template>
                
<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
  defineAsyncComponent,
  nextTick,
  defineProps,
  defineEmits,
} from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onInit,
  onHide,
  onUnload,
  onReachBottom,
  onPageScroll,
} from "@dcloudio/uni-app";
import { mineApi } from "@/business/api/index.ts";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
const props = defineProps({
  list: {
    type: Object,
    default: {},
  },
});

// 跳转详情
function toDetail() {
  uni.navigateTo({
    url: "/views/pages/home/store?mer_id=" + props.list.merchant.mer_id,
  });
}
</script>

<style scoped lang="scss">
.list-item {
  display: flex;
  width: 710rpx;
  height: 200rpx;
  background: #ffffff;
  box-shadow: 0 0 20rpx 12rpx #eeeeee80;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  margin-left: 20rpx;
  padding: 16rpx;
  position: relative;
  .right-box {
    margin-left: 16rpx;
    width: 486rpx;
    height: 168rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .footer {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      .price {
        color: #fc5555;
        font-size: 32rpx;
        font-face: PingFangSC;
        font-weight: 500;
      }
    }
    .footers{
      justify-content: flex-end;
    }
    .name {
      overflow: hidden;
      word-break: break-all; /* break-all(允许在单词内换行。) */
      text-overflow: ellipsis; /* 超出部分省略号 */
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 2; /** 显示的行数 **/
      .text {
        font-weight: 500;
        font-size: 30rpx;
        color: #000000;
      }
    }
  }
  .img {
    width: 168rpx;
    height: 168rpx;
    border-radius: 16rpx;
  }
  .play-icon-img{
    width: 60rpx;
    height: 60rpx;
    position: absolute;
    left: 70rpx;
    top: 70rpx;
  }
}
</style>
