<template>
  <view>
    <view class="payment-status">
      <view class="icon">
        <image
          src="@/static/pay-success.png"
          alt=""
          class="success-img"
        ></image>
      </view>
      <view class="status">{{ payResult }}</view>
      <view class="wrapper">
        <view v-if="order_type == 20" class="item acea-row row-between-wrapper">
          <view>订单编号</view>
          <view class="itemCom">{{ order_pay_info.group_order_sn }}</view>
        </view>
        <view class="item acea-row row-between-wrapper">
          <view>{{ order_type == 20 ? "兑换时间" : "下单时间" }}</view>
          <view class="itemCom">{{ order_pay_info.create_time }}</view>
        </view>
        <view v-if="order_type == 20" class="item acea-row row-between-wrapper">
          <view>兑换方式</view>
          <view class="itemCom">积分兑换</view>
        </view>
        <view v-else class="item acea-row row-between-wrapper">
          <view>支付方式</view>
          <view class="itemCom">微信</view>
        </view>
        <view v-if="order_type == 20" class="item acea-row row-between-wrapper">
          <view>支付积分</view>
          <view class="itemCom">{{ order_pay_info.integral }}</view>
        </view>
        <view class="item acea-row row-between-wrapper">
          <view>支付金额</view>
          <view class="itemCom">{{ order_pay_info.pay_price }}</view>
        </view>
        <view
          v-if="order_pay_info.give_integral > 0 && order_pay_info.paid"
          class="item acea-row row-between-wrapper"
        >
          <view>赠送积分</view>
          <view class="itemCom t-color">{{
            order_pay_info.give_integral
          }}</view>
        </view>
      </view>
      <button
        v-if="!order_pay_info.paid || order_pay_info.activity_type != 4"
        @click="goIndex"
        class="returnBnt s-Color"
        formType="submit"
        hover-class="none"
      >
        返回首页
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getPayOrder } from "@/business/api/modules/mall.ts";

const order_pay_info = ref({});
const order_type = ref("");
const payResult = ref("正在查询支付结果...");
const orderId = ref("");

function goIndex() {
  uni.switchTab({
    url: `/views/pages/home/index`,
  });
}

/**
 *
 * 支付完成查询支付状态
 *
 */
function getOrderPayInfo() {
  getPayOrder(orderId.value)
    .then((res) => {
      order_pay_info.value = res.data;
      if (order_type.value == 20) {
        payResult.value = res.data.paid == 1 ? "商品兑换成功" : "支付失败";
      } else {
        payResult.value = res.data.paid == 1 ? "支付成功" : "支付失败";
      }
    })
    .catch((err) => {});
}

onLoad((options) => {
  orderId.value = options.order_id;
  getOrderPayInfo();
});
</script>
<style scoped lang="scss">
.payment-status {
  background-color: #fff;
  margin: 92rpx 30rpx 30rpx;
  border-radius: 10rpx;
  padding: 1rpx 0 28rpx 0;
}
.payment-status .icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  text-align: center;
  line-height: 140rpx;
  margin: -76rpx auto 0 auto;
  .success-img {
    width: 140rpx;
    height: 140rpx;
    object-fit: cover;
  }
  &.icon-duihao2 {
    background-color: #1db0fc;
  }
}
.payment-status .icon.fail {
  text-shadow: 0px 4px 0px #7a7a7a;
}
.payment-status .status {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin: 25rpx 0 37rpx 0;
}
.payment-status .wrapper {
  border: 1px solid #eee;
  margin: 0 30rpx 47rpx 30rpx;
  padding: 35rpx 0;
  border-left: 0;
  border-right: 0;
}
.payment-status .wrapper .item {
  font-size: 28rpx;
  color: #282828;
}
.payment-status .wrapper .item ~ .item {
  margin-top: 20rpx;
}
.payment-status .wrapper .item .itemCom {
  color: #666;
}
.payment-status .returnBnt {
  width: 630rpx;
  height: 86rpx;
  border-radius: 50rpx;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  line-height: 86rpx;
  margin: 0 auto 20rpx auto;
  &.gColor {
    background-color: #1db0fc;
  }
  &.s-Color {
    color: #1db0fc;
    border: 1px solid #1db0fc;
  }
  &.b-Color {
    color: rgba(0, 0, 0, 0.4);
    background-color: #f5f5f5;
  }
}
.t-color {
  color: #1db0fc !important;
}
.coupon-wrapper {
  .hd {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30rpx 0;
    color: #999999;
    font-size: 24rpx;
    .line {
      width: 70rpx;
      height: 1px;
      background: #dcdcdc;
    }
    .txt {
      margin: 0 20rpx;
    }
  }
  .coupon-box {
    height: 356rpx;
    padding: 0 20rpx;
    overflow: hidden;
    &.on {
      height: auto;
    }
    .coupon-item {
      width: 100%;
      margin-bottom: 20rpx;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
      .left-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 236rpx;
        height: 160rpx;
        color: #fff;
        font-size: 64rpx;
        text {
          margin-top: 26rpx;
          font-size: 36rpx;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 20rpx;
        padding: 20rpx 0;
        .title {
          color: #282828;
          font-size: 30rpx;
        }
        .des {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }
  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 24rpx;
    font-size: 24rpx;
    color: #999999;
    .iconfont {
      margin-top: 6rpx;
      margin-left: 10rpx;
      font-size: 20rpx;
    }
  }
}
.acea-row {
  display: flex;
  flex-wrap: wrap;
}
.acea-row.row-middle {
  align-items: center;
}
.acea-row.row-top {
  align-items: flex-start;
}
.acea-row.row-bottom {
  align-items: flex-end;
}
.acea-row.row-center {
  justify-content: center;
}
.acea-row.row-right {
  justify-content: flex-end;
}
.acea-row.row-left {
  justify-content: flex-start;
}
.acea-row.row-between {
  justify-content: space-between;
}
.acea-row.row-around {
  justify-content: space-around;
}
.acea-row.row-column-around {
  flex-direction: column;
  justify-content: space-around;
}
.acea-row.row-column {
  flex-direction: column;
}
.acea-row.row-column-between {
  flex-direction: column;
  justify-content: space-between;
}
.acea-row.row-center-wrapper {
  align-items: center;
}
.acea-row.row-between-wrapper {
  align-items: center;
  justify-content: space-between;
}
</style>
