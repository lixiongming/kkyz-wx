<template>
  <view class="payment-result-page">
    <view class="payment-result-container">
      <view class="payment-result-title" v-if="order_info.paid == 10">
        <image
          mode="aspectFit"
          class="status-icon"
          :src="imgUrlEvent('/images/kkyz/v-pay-status-success.png', 'aliyunImgUrl')"
        ></image>
        <text class="status-tip">恭喜您，支付成功！</text>
      </view>
      <view class="payment-result-title" v-if="order_info.paid == 0">
        <image
          mode="aspectFit"
          class="status-icon"
          :src="imgUrlEvent('/images/kkyz/v-pay-status-fail.png', 'aliyunImgUrl')"
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
      <view class="payment-result-btn back" @click="goBack">返回首页</view>
      <view class="payment-result-btn" @click="toPage">查看订单</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { orderStatus } from '@/business/api/modules/order-new.ts';

const modal_events = ref();

const order_info = ref({
  paid: 1,
  pay_price: '100.00'
})

function goBack () {
  uni.switchTab({
    url: '/pages/kkyz-shop/index'
  })
}

function toPage () {
  let status = order_info.value.paid == 1 ? 2 : 1
  uni.navigateTo({
    url: `/pagesOrder/order-list/index?status=${status}`
  })
}


// 获取订单详情、订单状态
async function getOrderPayInfo (order_id) {
  orderStatus({ id: order_id }).then(async (res) => {
    order_info.value = res.data
  })
}

onLoad((options) => {
  if (options.orderId) {
    getOrderPayInfo(options.orderId);
  }
})

</script>
<style scoped lang="less">
.payment-result-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .payment-result-container {
    flex: 1;
    overflow-y: auto;
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
    .payment-result-btn {
      width: 686rpx;
      height: 80rpx;
      background: #FA6262;
      border-radius: 8rpx;
      font-weight: 500;
      font-size: 28rpx;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 32rpx;
      &.back {
        background: transparent;
        border: 2rpx solid #ddd;
        color: #111;
        margin-bottom: 20rpx;
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
}
.popup-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  .popup-tip {
    font-weight: 400;
    font-size: 24rpx;
    color: #A5A5A5;
    margin-bottom: 12rpx;
  }
  .popup-icon {
    width: 240rpx;
    height: 240rpx;
  }
}
</style>
