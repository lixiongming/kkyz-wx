<template>
  <view class="spread-wrap">
    <view 
        class="head-title" 
        :style="{
        height: status_barHeight + 44 + 'px',
        paddingTop: status_barHeight + 'px',
        }"
    >
        <view class="title-txt" @click="backEvent">
            <u-icon name="arrow-left" size="24" color="#000000"></u-icon>
            <text class="txt-cs">推广达人</text>
        </view>
    </view>
    <image mode="aspectFill" class="img-block head-img" :src="$imgUrl('/images/wx-applet/spread/spread-icon1.png')"></image>
    <image mode="aspectFill" class="img-block spread-step" :src="$imgUrl('/images/wx-applet/spread/spread-step.png')"></image>
    <image mode="aspectFill" class="img-block commission-step" :src="$imgUrl('/images/wx-applet/spread/commission-step.png')"></image>
    <button class="reset-btn" :style="{ paddingTop: '4px' }" open-type="contact" :session-from="session_from.download" hover-class="none">
        <image mode="aspectFill" class="img-block download-app-icon" :src="$imgUrl('/images/wx-applet/spread/download-app-icon.png')"></image>
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
const status_barHeight = uni.getSystemInfoSync().statusBarHeight;
const is_ios = ref(false);
is_ios.value = uni.getSystemInfoSync().platform == "ios";
const session_from = ref({
    download: '',
})
onShow(() => {
    session_from.value.download = `{ "app_type": "${is_ios.value ? 'ios' : 'android'}", "source": "download" }`;
})

function backEvent(){
  uni.navigateBack()
}
</script>

<style lang="less" scoped>
.spread-wrap {
    background-color: #FFB268;
    .head-img {
        width: 750rpx;
        height: 700rpx;
    }
    .head-title {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        padding-left: 40rpx;
        .title-txt {
            text-align: left;
            line-height: 88rpx;
            height: 88rpx;
            font-weight: 500;
            font-size: 30rpx;
            color: #000000;
            display: flex;
            align-items: center;
        }
        .txt-cs {
            line-height: 88rpx;
            text-align: center;
            color: #111111;
            font-size: 32rpx;
            font-style: normal;
            font-weight: 600;
            margin-left: 16rpx;
        }
    }
    .img-block {
        display: block;
    }
    .spread-step {
        width: 738rpx;
        height: 1006rpx;
        margin: -182rpx auto 0;
    }
    .commission-step {
        width: 738rpx;
        height: 472rpx;
        margin: -20rpx auto 0;
    }
    .download-app-icon {
        width: 694rpx;
        height: 212rpx;
        margin: -10rpx auto;
        padding-bottom: 40rpx;
        box-sizing: content-box;
    }
}
/* 1. 彻底重置默认外观 */
.reset-btn {
    /* 去掉按钮默认外观 */
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    line-height: inherit;
    font-size: inherit;
    color: inherit;
    text-align: left;
    /* 保证点击区域继承父级大小 */
    width: 100%;
    display: flex;
}
</style>
