<template>
  <g-main v-if="open_offline_code">
    <view class="title-info df-r ai-c" :style="{ paddingTop: systemBarHeight * 2 + 'rpx' }">
      <!-- <image
        mode="aspectFit"
        class="home-icon"
        :src="`${imagesUrl}/supply/v-home.png`"
        @click="goHome"
      ></image> -->
      <text class="info-value mgr-12" @click="goHome">去首页</text>
      <text class="info-label">欢迎您！</text>
      <text class="info-value" v-if="is_login && my_info.nickname">{{ my_info.nickname }}</text>
      <text class="info-value" v-else @click="isLoginEvent">请登录</text>
    </view>
    <!-- 商户 -->
    <view
      class="home-content"
      v-if="is_mer"
      :style="{ backgroundImage: `url(${imagesUrl}/supply/coupon-out-bg.png)` }"
    >
      <view class="merchant-info">
        <image
          mode="aspectFit"
          class="merchant-icon"
          :src="merchant_info.mer_avatar"
        ></image>
        <text class="text">{{ merchant_info.mer_name }}</text>
      </view>
      <view class="coupon-ctn">
        <view class="coupon-title">完成任务享优惠</view>
        <view
          class="coupon-dtl"
          :style="{ backgroundImage: `url(${imagesUrl}/supply/coupon-bg.png)` }"
        >
          <text
            class="conpon-text"
            v-if="merchant_info.discounts_json.type == 'full'"
            >满{{ (merchant_info.discounts_json.full_price - 0).toFixed(2) }}元减{{
              (merchant_info.discounts_json.reduce_price - 0).toFixed(2)
            }}元</text
          >
          <text
            class="conpon-text"
            v-if="merchant_info.discounts_json.type == 'off'"
            >优惠{{ merchant_info.discounts_json.rate }}%</text
          >
          <text
            class="conpon-text"
            v-if="merchant_info.discounts_json.type == 'desc'"
            >{{ merchant_info.discounts_json.content }}</text
          >
        </view>
      </view>
      <view class="btns">
          <view class="btn-pay btn" @click="toPay('mer')">
            <text class="text">直接支付</text>
          </view>
          <template v-if="merchant_info.merchant_video && merchant_info.merchant_video.length && is_login">
            <view v-for="(item, index) in merchant_info.merchant_video" :key="index">
              <view class="btn-discount btn" @click="toThumbsUp('mer',item)">
                <text class="text">{{ getTypeName(item.type) }}</text>
              </view>
            </view>
          </template>
      </view>
    </view>
  </g-main>
  <view class="null-ctn" v-else>
    <text class="text" v-if="open_offline_code">当前使用APP不支持打开此页面</text>
    <text class="text" v-if="!open_offline_code && !is_load">{{ err_tip }}</text>
  </view>
  
  <g-login-modal ref="login_modal"  @loginCallback="_onShow"></g-login-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { checkTokenEventAst } from "/infrastructure/utils/util";
import { mineApi } from "@/business/api/index.ts";
import { fetchMerchantInfoApi, getVideoApi } from "@/business/api/modules/mall.ts";

const imagesUrl = uni.$config.mddAliyunImgUrl;

const systemBarHeight = uni.getSystemInfoSync().statusBarHeight;

const my_info = ref({});

const login_modal = ref()

const err_tip = ref("该商户未开启线下收款");

// 商家信息
const merchant_info = ref({});
// 是否商户
const is_mer = ref(true);

const mer_video_info = ref(null);

const cur_mer_info = ref({});

const open_offline_code = ref(false);

const is_login = ref(false);

const is_load = ref(false)

// 跳转首页
function goHome () {
  uni.switchTab({
    url: "/views/pages/home/index",
  });
}

// 是否登录
const isLoginEvent = () => {
  if (!is_login.value) {
    login_modal.value.open()
    return true;
  }
};

//获取用户信息
const getUserMyInfo = () => {
  mineApi.getUserMyInfoApi().then(({ data }) => {
    my_info.value = data;
  }).catch(() => { });
}

function toPay(name) {
  if (isLoginEvent()) return;
  uni.setStorageSync('merchant_info',merchant_info.value)
  switch(name){
    case "mer":
      uni.navigateTo({
        url: `/pagesOfflinePayment/payment/confirm-order`,
      })
      break;
  }
}

function toWeixin(name) {
  switch(name){
    case "mer":
      // window.location.href = `weixin://dl/business/?appid=wx29df62cbac3abc9a&query=${last_query}&path=pages/users/helper/index&env_version=release`;
      wx.openChannelsActivity({
        finderUserName: mer_video_info.value.finder_user_id,
        feedId: mer_video_info.value.feed_id,
        success: function (res) {},
        fail: function (err) {},
      });
      break;
  }
}

function toThumbsUp (user_type: any, item: any) {
  if (isLoginEvent()) return;
  // 完成任务 唯一标识
  let unique_links = uni.getStorageSync('unique_links')
  if (unique_links && unique_links.length) {
    if (!unique_links.includes(item.feed_id)) {
      unique_links.push(item.feed_id)
      uni.setStorageSync('unique_links',unique_links)
    }
  } else {
    uni.setStorageSync('unique_links',[item.feed_id])
  }
  switch(item.type){
    case "wx_channels":
      toWeixin(user_type)
    break;
    case "douyin":
      uni.navigateTo({
        url: `/pagesOfflinePayment/payment/transfer-page?link=${item.content}`,
      })
      break;
    case "xiaohongshu":
      // if (isAlipay()) {
      //   AlipayJSBridge.call('pushWindow', {
      //     url: item.feed_id,
      //     param: {
      //         readTitle: false,
      //         transparentTitle: 'none',
      //         showOptionMenu: false
      //     }
      //   });
      // } else {
      //   window.location.href = item.feed_id;
      // }
      uni.navigateTo({
        url: `/pagesOfflinePayment/payment/transfer-page?link=${item.feed_id}&type=${item.type}`,
      })
    break;
  }
}

function getTypeName (type: any) {
  switch(type){
    case "wx_channels":
      return '视频号点赞，领优惠'
    case "douyin":
      return '抖音点赞，领优惠'
    case "xiaohongshu":
      return '小红书点赞，领优惠'
  }
}

//获取商户视频
async function getVideo() {
  try {
    let res = await getVideoApi({
      mer_id: merchant_info.value.mer_id,
    });
    mer_video_info.value = res.data;
  } catch (err) {}
}

// 获取商家信息
async function getmerchant_info() {
  is_load.value = true;
  try {
    let res = await fetchMerchantInfoApi({
      mer_no: cur_mer_info.value.mer_no,
    });
    merchant_info.value = res.data;
    open_offline_code.value = true;
    is_load.value = false;
    getVideo();
    uni.setStorageSync('invite_code',merchant_info.value.mer_user_info.user_code)
  } catch (err) {
    if (err && err.status && err.status == 400) {
      open_offline_code.value = false;
      err.message && (err_tip.value = err.message)
    }
    is_load.value = false;
  }
}

async function _onShow () {
  is_login.value = await checkTokenEventAst()
  if (isLoginEvent()) return;
  if (is_login.value) {
    getUserMyInfo();
  }
}

onShow(_onShow)

onMounted(() => {
  // if (isLoginEvent()) return;
})

// 从URL中解析参数的函数
function GetWxMiniProgramUrlParam(url) {
  let theRequest = {};
  // 找到问号 ? 后面的参数字符串
  if (url.indexOf("?") != -1) {
    const str = url.split("?")[1];
    // 如果有多个参数，用 & 符号分割
    const strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      const [key, value] = strs[i].split("=");
      theRequest[key] = decodeURIComponent(value);
    }
  }
  return theRequest;
}

onLoad((options: any) => {
  if (options.q) {
    const qrUrl = decodeURIComponent(options.q);
    const urlParams = GetWxMiniProgramUrlParam(qrUrl);
    if (urlParams && urlParams.mer_no) {
      cur_mer_info.value = urlParams;
      is_mer.value = true
      getmerchant_info();
    }
  } else if (options && options.mer_no) {
    cur_mer_info.value = options;
    is_mer.value = true
    getmerchant_info();
  }
});
</script>
<style scoped lang="less">
.title-info {
  position: absolute;
  top: 40rpx;
  left: 32rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #555555;
  display: flex;
  align-items: center;
  .home-icon {
    width: 48rpx;
    height: 48rpx;
    display: block;
    margin-right: 12rpx;
  }
  .info-value {
    // color: #6ABDFF;
    background: linear-gradient(to right, #ff8638, #f34);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
    &.mgr-12 {
      display: inline-block;
      margin-right: 12rpx;
    }
  }
}
.home-content {
  flex: 1;
  background: #fffaf1;
  padding-top: 200rpx;
  background-position: left top;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .merchant-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 32rpx;
    margin-bottom: 72rpx;
    .merchant-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 80rpx;
      margin-bottom: 16rpx;
    }
    .text {
      color: #111111;
      font-family: "PingFang SC";
      font-size: 36rpx;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    .custom-input-wrapper {
      width: 100%;
      height: 80rpx;
      border-radius: 16rpx;
      padding: 0 8rpx 0 24rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      border: 1px solid #ddd;
      .unit-text {
        color: #111111;
        font-family: "PingFang SC";
        font-size: 28rpx;
        display: inline-block;
        margin-right: 8rpx;
        font-weight: 600;
      }
      .custom-input {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        .custom-input-text {
          color: #ccc;
          font-family: "PingFang SC";
          font-size: 28rpx;
          font-weight: 400;
        }
        .custom-input-number {
          color: #111111;
          font-family: "PingFang SC";
          font-size: 28rpx;
          font-weight: 500;
        }
      }
      .cursor {
        width: 3rpx;
        height: 30rpx;
        background-color: black;
        animation: blink 1s steps(1) infinite;
      }
    }
  }
  .coupon-ctn {
    width: 686rpx;
    min-height: 304rpx;
    border-radius: 32rpx;
    border: 2rpx solid #fff;
    background: linear-gradient(180deg, #fff5f0 0%, #fff 100%);
    margin: 0 32rpx 48rpx;
    padding: 32rpx;
    .coupon-title {
      // width: 282rpx;
      // height: 48rpx;
      font-size: 28rpx;
      margin-bottom: 26rpx;
      font-weight: 600;
      color: #6e2000;
    }
    .coupon-dtl {
      width: 622rpx;
      height: 176rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10rpx 40rpx;
      .conpon-text {
        color: #6e2000;
        font-family: "PingFang SC";
        font-size: 36rpx;
        font-weight: 600;
      }
    }
  }
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
    .btn-pay {
      border: 2rpx solid #ff4842;
      margin-bottom: 32rpx;
      .text {
        color: #ff4842;
        font-family: "PingFang SC";
        font-size: 32rpx;
        font-weight: 600;
      }
    }
    .btn-discount {
      background: linear-gradient(90deg, #ff8638 0%, #f34 100%);
      margin-bottom: 32rpx;
      .text {
        color: #ffffff;
        font-family: "PingFang SC";
        font-size: 32rpx;
        font-weight: 600;
      }
    }
  }
}
.null-ctn {
  width: 750rpx;
  height: 400rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    color: #666;
    font-family: "PingFang SC";
    font-size: 40rpx;
    font-weight: 600;
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
