<template>
  <g-main class="payment-result-page">
    <view class="payment-result-container" :style="{ paddingTop: systemBarHeight * 2 + 'rpx' }">
      <view class="payment-result-title" v-if="order_info.status == 1">
        <image
          mode="aspectFit"
          class="status-icon"
          :src="imgUrlEvent('/images/kkyz/v-pay-status-success.png','aliyunImgUrl')"
        ></image>
        <text class="status-tip">恭喜您，支付成功！</text>
      </view>
      <view class="payment-result-title" v-else>
        <image
          mode="aspectFit"
          class="status-icon"
          :src="imgUrlEvent('/images/kkyz/v-pay-status-fail.png','aliyunImgUrl')"
        ></image>
        <text class="status-tip">支付失败，取消支付！</text>
      </view>
      <view class="payment-result-desc">
        <view class="desc-text">
          <text class="lable">支付方式：</text>
          <text class="value">微信</text>
        </view>
        <view class="desc-text">
          <text class="lable">支付金额：</text>
          <text class="value">￥{{ order_info.pay_price }}</text>
        </view>
      </view>
      <view class="payment-result-btn" @click.stop="finish">
        <text class="text">完成</text>
      </view>
    </view>
  </g-main>

</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls.ts";
import { merOfflineOrderDetail } from '@/business/api/modules/order';

const order_info = ref({})

const systemBarHeight = uni.getSystemInfoSync().statusBarHeight;

// 获取订单详情、订单状态
async function getMerOfflineOrderDetail (order_id) {
  // order_id: 1004
  let res = await merOfflineOrderDetail(order_id)
  order_info.value = res.data.order_info
}

function finish () {
  // #ifdef MP-WEIXIN
  wx.exitMiniProgram();
  // #endif
}

onLoad((options) => {
  if (options.order_id) {
    getMerOfflineOrderDetail(options.order_id)
  }
})

</script>
<style scoped lang="less">
.payment-result-page {
  display: flex;
  flex-direction: column;
}
.payment-result-container {
  position: relative;
  flex: 1;
  overflow-y: auto;
  .payment-result-btn {
    position: absolute;
    bottom: 200rpx;
    width: 300rpx;
    height: 92rpx;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 8rpx;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      font-size: 28rpx;
      color: #000000;
      font-weight: 500;
      text-align: center;
    }
  }
  .payment-result-title {
    width: 750rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40rpx 0;
    .status-icon {
      width: 120rpx;
      height: 120rpx;
      display: block;
      margin-right: 12rpx;
    }
    .status-tip {
      font-size: 32rpx;
      font-weight: 600;
      color: #111;
    }
  }
  .payment-result-desc {
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 72rpx;
    .desc-text {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      font-weight: 400;
      margin: 12rpx 0;
      .lable {
        color: #111111;
      }
      .value {
        color: #a5a5a5;
      }
    }
  }
  .payment-result-ad {
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .ad-item {
      width: 686rpx;
      min-height: 120rpx;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: rgba(0, 0, 0, 0.1) 0rpx 8rpx 24rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      padding: 32rpx 24rpx;
      margin-bottom: 20rpx;
      .ad-item-text {
        flex: 1;
        word-break: break-all;
        font-weight: 500;
        font-size: 28rpx;
        color: #000000;
      }
      .ad-item-link {
        font-weight: 500;
        font-size: 28rpx;
        color: #fc5555;
        margin-left: 8rpx;
      }
    }
  }
}
</style>
