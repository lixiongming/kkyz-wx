<template>
  <view class="list-item" @click="toDetail">
    <image class="img" :src="tab_index == 0 ? list.spu?.image : list.cover_image" mode="aspectFill"></image>
    <image class="play-icon-img" v-if="tab_index == 1" :src="imgUrlEvent('/images/wx-applet/mine/play-icon-img.png', 'aliyunImgUrl')" mode="aspectFill"></image>
    <view class="right-box">
      <view class="name"
        ><text class="text">{{ tab_index == 0 ? list.spu?.store_name : list.title }}</text></view
      >
      <view class="footer" :class="{'footers' : tab_index == 1}">
        <text class="price" v-if="tab_index == 0"><text style="font-size:22rpx">￥ </text>{{ list.spu?.price }}</text> 
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
  tab_index:{
    type:Number, // 0 = 商品，1 = 视频
    default: {},
  }
});

// 跳转详情
function toDetail() {
  if(props.tab_index == 0) {
  uni.navigateTo({
    url: `/pagesProduct/goods_details/index?id=${props.list.spu.product_id}`,
  });
  }else{
   uni.navigateTo({
    url: `/views/pages/home/video-detail?post_id=${props.list.post_id}&post_user_id=${props.list.post_user_id}`,
  });
  }
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
        justify-content: space-between;
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
