<template>
  <view class="menu-box" v-if="personalMenu.length > 0">
    <swiper
      class="swiper"
      @change="swiperChange"
      :style="{
        height: is_expand ? '306rpx' : '165rpx',
        transitionDuration: '100',
        transitionProperty: 'height',
      }"
    >
      <swiper-item v-for="(item, index) in personalMenu" :key="index">
        <view class="swiper-item-box">
          <view
            class="swiper-item"
            :class="'swiper-item' + (indexs + 1)"
            v-for="(items, indexs) in item"
            :key="indexs"
            @click="toPage(items.url)"
          >
            <view class="img-pic-box">
              <image class="img-pic" :src="items.pic"></image>
            </view>
            <text class="text">{{ items.name }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="Indicator" v-if="personalMenu.length > 1">
      <view
        v-for="(item, index) in personalMenu"
        :key="index"
        class="Indicator-box"
        :class="{
          'Indicator-boxs': (index + 1) % 2 == 0,
          'Indicator-active': index == swiper_current,
        }"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";


const personalMenu = ref([]);
const swiper_current = ref(0);
const is_expand = ref(false);
// 获取个人中心图标
function getMyMenus() {
  personalMenu.value = [
    [
      {
        name: "我的订单",
        pic: "https://mall-cdn.mdd3.cn/def/cfd9d202506250959376584.png",
        url: "/pagesOrder/order-list/index"
      },
      {
        name: "地址管理",
        pic: "https://mall-cdn.mdd3.cn/def/64959202506251359448072.png",
        url: "/pagesMine/user-address-list/index"
      },
      {
        name: "我的收藏",
        pic: "https://mall-cdn.mdd3.cn/def/09202202506251008175766.png",
        url: "/pagesMine/user-goods-collection/index"
      },
      {
        name: "关注店铺",
        pic: "https://mall-cdn.mdd3.cn/def/store_follow.png",
        url: "/pagesMine/follow-store/index"
      },
      {
        name: "浏览记录",
        pic: "https://mall-cdn.mdd3.cn/def/23698202506251016086167.png",
        url: "/pagesMine/browsingHistory/index"
      }
    ]
  ]
}
// 轮播切换
function swiperChange(data) {
  console.log(data.detail.current);
  swiper_current.value = data.detail.current;
  //  当前分页是否超过5条数据
  is_expand.value = personalMenu.value[swiper_current.value].length > 5;
}
// 页面跳转
function toPage(url) {
  if (url.slice(0, 4) == "http") {
    uni.navigateTo({
      url: "/packages/mall/views/pages/supply/supply_chain/index",
    });
    return;
  }
  uni.navigateTo({
    url: url,
  });
}

onMounted(async () => {
  getMyMenus();
});
</script>

<style lang="less" scoped>
.acea-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-box {
  width: 710rpx;
  background: #ffffff;
  box-shadow: 0 0 10rpx 6rpx rgba(238, 238, 238, 0.502);
  border-radius: 8rpx;
  margin-top: 16rpx;
  .Indicator {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 6rpx auto;
    margin-bottom:22rpx;
    width: 710rpx;
    padding-bottom: 12rpx;
  }
  .Indicator-box {
    width: 8rpx;
    height: 8rpx;
    background: #e7e7e7;
    border-radius: 8rpx;
    margin-right: 8rpx;
  }
  .Indicator-boxs {
    width: 26rpx;
  }
  .Indicator-active {
    background: #1b9aff;
  }
  .swiper {
    height: 170rpx;
    transition: 0.2s !important;
    padding-top: 16rpx;

    flex-shrink: 0;
    .swiper-item-box {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      // width: 630rpx;
      padding-left: 6rpx;
      transition-duration: 0.3s !important;
      transition-property: height;
      // padding-top: 16rpx;
      .swiper-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        // margin-right: 48rpx;
        width: 140rpx;
        margin-bottom: 32rpx;
        padding: 0rpx 12rpx;
        .img-pic-box {
          width: 88rpx;
          height: 88rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .img-pic {
          width: 88rpx;
          height: 88rpx;
        }
        .text {
          font-size: 24rpx !important;
          font-weight: 600;
          text-align: center;
        }
      }
      .swiper-item5,
      .swiper-item10 {
        margin-right: 0rpx;
      }
    }
  }
  .is-expand {
    height: 306rpx;
  }
}

.alliance {
  width: 400rpx;
  height: 66rpx;
  background: rgba(0, 194, 255, 0.5);
  font-size: 28rpx;
  border-radius: 16rpx;
  line-height: 66rpx;
  text-align: center;
  color: #fff;
}
</style>
