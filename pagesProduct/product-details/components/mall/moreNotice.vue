<template>
  <view class="news">
    <image
      class="pictrue"
      :src="imgUrlEvent('/images/kkyz/mall-home-icon5.png', 'aliyunImgUrl')"
      mode="heightFix"
    ></image>
    <view class="item-txt">
      <u-notice-bar
        class="uni-notice-bar"
        v-if="noticeList[0]?.title"
        :fontSize="'22rpx'"
        color="#002D51"
        bgColor="rgba(0,0,0,0)"
        :icon="false"
        :text="noticeList[0]?.title"
      />
    </view>
    <view class="more" @click="toNoticeList">
      <text class="more-text" :style="'color: #A5A5A5'">更多</text>
      <uni-icons type="right" color="#A5A5A5" size="14"></uni-icons>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { getNoticeListApi } from "@/business/api/modules/user.ts";

const noticeList = ref([{ title: "" }]);

const toNoticeList = () => {
  uni.navigateTo({
    url: "/pagesProduct/notice/index",
  });
};

const getNoticeList = async () => {
  try {
    getNoticeListApi({
      page: 1,
      page_size: 1,
    })
      .then((res) => {
        if (res.data && res.data.items && res.data.items.length > 0) {
          noticeList.value = res.data.items;
        }
      })
      .catch(() => {});
  } catch (err) {}
};

onMounted(() => {
  getNoticeList();
});
</script>

<style lang="less" scoped>
.item-txt::v-deep .uni-noticebar__content-text {
  font-size: 20rpx !important;
}

.uni-notice-bar {
  padding: 0rpx !important;
  margin-bottom: 0rpx !important;
  box-sizing: content-box !important;
  font-size: 20rpx !important;
}
.news {
  flex: 1;
  height: 64rpx;
  padding: 0 20rpx;
  flex-direction: row;
  align-items: center !important;
  display: flex !important;
  background: linear-gradient(to bottom, #ecf8ff, #ffffff);
  box-shadow: 0 0 20rpx 12rpx rgba(238, 238, 238, 0.502);
  border-radius: 16rpx;
}
.news .pictrue {
  width: 32rpx;
  height: 32rpx;
  margin-right: 20rpx;
}
.news .more {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  .r_icon {
    width: 24rpx;
    height: 24rpx;
  }
  .more-text {
    font-size: 20rpx;
    margin-right: 8rpx;
    margin-left: 8rpx;
  }
}

.announcement {
  background: rgba(29, 176, 253, 1);
  transform: skewX(-10deg);
}
.news .swiperTxt {
  width: 510rpx;
  height: 100%;
  line-height: 44rpx;
  overflow: hidden;
}
.item-txt {
  flex: 1;
  width: 538rpx;
  font-size: 20rpx !important;
}

.news .swiperTxt .text .label {
  font-size: 20rpx;
  color: #ff4c48;
  width: 64rpx;
  height: 30rpx;
  border-radius: 40rpx;
  text-align: center;
  line-height: 28rpx;
  border: 2rpx solid #ff4947;
}
.news .swiperTxt .text .newsTitle {
  font-size: 20rpx;
  color: #666;
}
.news .swiperTxt .iconfont {
  font-size: 22rpx;
  color: #282828;
}
.news .swiperTxt swiper {
  height: 100%;
}
.swiperTxt {
  &.singleBar {
    flex: 1;
    font-size: 20rpx;
    :deep(.u-notice__left-icon) {
      display: none;
    }
    :deep(.u-notice-bar) {
      padding: 0;
    }
  }
}
</style>
