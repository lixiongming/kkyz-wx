<template>
  <view class="auth-phone-container">
    <view class="auth-phone-box">
      <image
        :src="
          imgUrlEvent('/images/wx-applet/mine/wx-auth-logo.png', 'aliyunImgUrl')
        "
        class="auth-logo"
      ></image>
      <text class="tip1">看看宇宙 申请使用</text>
      <text class="tip2">您的手机号码</text>
      <view class="btn auth-btn">
        授权手机号
      </view>
      <view class="btn cancel-btn">
        取消
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineExpose } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
</script>
<style scoped lang="less">
.auth-phone-container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.702);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  .auth-phone-box {
    width: 670rpx;
    min-height: 720rpx;
    background: #ffffff;
    box-shadow: 0 4rpx 16rpx 0 #c3c3c354;
    border-radius: 28rpx;
    padding-top: 100rpx;
    padding-bottom: 60rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .auth-logo {
        width: 200px;
        height: 200px;
        border-radius: 32rpx;
        margin-bottom: 24rpx;
    }
    .tip1 {
        display: inline-block;
        font-weight: 400;
        font-size: 28rpx;
        color: #000000;
        margin-bottom: 24rpx;
    }
    .tip2 {
        display: inline-block;
        font-weight: 400;
        margin-bottom: 40rpx;
        font-weight: 600;
        font-size: 34rpx;
        color: #111111;
    }
    .btn {
        width: 510rpx;
        height: 80rpx;
        border-radius: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        &.auth-btn {
            box-shadow: 0 10rpx 20rpx 0 #43acff80;
            background: #1B9AFF;
            margin-bottom: 24rpx;
            font-weight: 600;
            font-size: 28rpx;
            color: #FFFFFF;
        }
        &.cancel-btn {
            border: 1px solid #D3D3D3;
            font-weight: 600;
            font-size: 28rpx;
            color: #000000;
        }
    }
  }
}
</style>
