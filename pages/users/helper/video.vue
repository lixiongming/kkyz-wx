<template>
  <view class="video-content" :style="{ height: window_height + 'px' }">
    <view class="btns">
      <view class="btn-discount btn" @click="toWeixin">
        <text class="text">打开视频</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

const window_height = uni.getSystemInfoSync().windowHeight;
const finderUserName = ref("");
const feedId = ref("");

onLoad((options) => {
  finderUserName.value = decodeURIComponent(options.finderUserName);
  feedId.value = decodeURIComponent(options.feedId);
  wx.openChannelsActivity({
    finderUserName: decodeURIComponent(options.finderUserName),
    feedId: decodeURIComponent(options.feedId),
    success: function (res) {},
    fail: function (err) {
      uni.showToast({
        title: "打开视频失败,请检查视频号或者视频ID是否正确"
      });
    },
  });
});

function toWeixin() {
  wx.openChannelsActivity({
    finderUserName: finderUserName.value,
    feedId: feedId.value,
    success: function (res) {},
    fail: function (err) {},
  });
}
</script>

<style scoped lang="scss">
.video-content {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  .btns {
    width: 686rpx;
    margin: 0 32rpx;
    .btn {
      width: 682rpx;
      height: 96rpx;
      border-radius: 32rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-discount {
      background: linear-gradient(90deg, #ff8638 0%, #f34 100%);
      .text {
        color: #ffffff;
        font-family: "PingFang SC";
        font-size: 32rpx;
        font-weight: 600;
      }
    }
  }
}
</style>
