<template>
  <g-main>
    <view class="copy-wrap">
      <view class="copy-tips">{{ type == 'douyin' ? '点击下方按钮复制链接，打开抖音观看' : '点击下方按钮复制链接，打开浏览器观看' }}</view>
      <view class="copy-btn" @click="copyLink">
        <text class="text">复制链接</text>
      </view>
    </view>
  </g-main>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

const transfer_link = ref("");

const props = defineProps({
  type: {
    type: String,
    default: 'douyin',
  },
});

function copyLink() {
  uni.setClipboardData({
    data: transfer_link.value,
    success: () => {
      uni.showToast({ title: "复制成功", icon: "none" });
    },
    fail: (err) => {
      console.error("复制失败", err);
    },
  });
}

onLoad((options) => {
    if (options.link) {
        transfer_link.value = options.link
    }
});
</script>
<style scoped lang="less">
.copy-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .copy-tips {
    color: #6e2000;
    font-family: "PingFang SC";
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 40rpx;
  }
  .copy-btn {
    width: 682rpx;
    height: 96rpx;
    border-radius: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, #ff8638 0%, #f34 100%);
    .text {
      color: #ffffff;
      font-family: "PingFang SC";
      font-size: 32rpx;
      font-weight: 600;
    }
  }
}
</style>
