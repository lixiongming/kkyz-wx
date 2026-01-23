<template>
  <g-main>
    <view class="confirm-order-container" @click="hideHandle" :style="{ backgroundImage: `url(${imagesUrl}/mine/v-order-bg.png)` }">
      <view class="pay-input-text">
        <text class="num-text" v-if="is_open">{{ input_value }}</text>
        <text class="num-text" v-if="!is_open" @click.stop="showHandle">输入金额</text>
        <view class="blinking-cursor" v-if="is_open"></view>
      </view>

      <view class="mer-name">{{ merchant_info.mer_name }}</view>
      <view class="mer-ctn">
        <view
            class="discount-tip"
            v-if="finish_task && merchant_info.discounts_json.reduce_price"
            >您已完成任务，自动扣减{{
              merchant_info.discounts_json.reduce_price
            }}元</view
          >
        <view
            class="discount-tip"
            v-if="finish_task && merchant_info.discounts_json.reduce_price && pay_params.price"
            >实付款：{{ discounts_money }}元</view
          >
      </view>

      <view class="planet" v-for="(item,index) in nearby_list" @click.stop="downloadApp" :class="[ show_ani ? getDyClass(index + 1) : '', getDyAniClass(index + 1) ]">
        <image
          mode="aspectFit"
          :class="getDyImgClass(index + 1)"
          :src="imagesUrl + '/mine/planet-' + (index + 1) + '.gif'"
        ></image>
        <text class="planet-text" :class="getDyTextClass(index + 1)">{{ item.mer_name }}</text>
      </view>

    </view>
  </g-main>

  <uv-popup
    ref="popup"
    mode="bottom"
    :overlay="false"
    :safeAreaInsetBottom="true"
  >
    <c-keyboard
      :value_="input_value"
      :is_down="is_down"
      @focus_="focusHandle"
      @submit_="createdHandle"
      @change_="changeHandle"
    ></c-keyboard>
  </uv-popup>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { merOfflineOrderCreate } from '@/business/api/modules/order';
import { merOfflineNearbyApi } from "@/business/api/modules/mall.ts";
import uerStore from "@/business/store/modules/mine";
import CKeyboard from "@/pagesOfflinePayment/payment/components/c-keyboard.vue";
import Routine from "@/infrastructure/libs/routine";
import { mineApi } from "@/business/api/index.ts";

const store = uerStore();

const show_ani = ref(false);

const imagesUrl = uni.$config.mddAliyunImgUrl;

function getDyClass (index)  {
  return 'planet-' + index
}

function getDyImgClass (index)  {
  return 'img-' + index
}
function getDyTextClass (index)  {
  return 'text-' + index
}
function getDyAniClass (index)  {
  return 'planet-ani-' + index
}

function downloadApp() {
  // let query = {invite_code:uni.getStorageSync('user_code')}
  // let queryString = Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&')
  // // 对其进行转码
  // let res = encodeURIComponent(queryString)
  // 缓存上级邀请码
  // query.invite_code && uni.setStorageSync('invite_code',query.invite_code)
  uni.switchTab({
    url: `/views/pages/home/index`,
  })
}

const discounts_money = computed(() => {
  return (
    pay_params.value.price - merchant_info.value.discounts_json.reduce_price
  ).toFixed(2);
});

const finish_task = ref(false);

const creating = ref(false);

const merchant_info = ref({});

const pay_params = ref({
  price: "",
  is_discount: 2,
  mer_id: "",
  remark: "",
  // 支付方式 wx_pay=微信h5  wx_lite=微信小程序 ali_lite=支付宝小程序  ali_pay=支付宝h5
  pay_type: "wx_lite",
  return_url: "",
});

// 点赞链接
const unique_links = ref([])
const unique_link_index = ref(-1)
const has_discount = ref(false)
const discount_unique_links_active = ref([])

const is_down = ref(false);

function hideLoading_ () {
    uni.hideLoading()
    creating.value = false;
}

async function orderCreate() {
  if (creating.value) return;
  creating.value = true;
  is_down.value = true;
  uni.showLoading({
      title: '订单创建中',
      mask: true
  })
  try {
    let res = await merOfflineOrderCreate({ ...pay_params.value, openid: uni.getStorageSync('o_id') });
    if (res && res.code && res.code == 200) {
      // 已享受优惠
      if (has_discount.value) {
        let current_unique_link = unique_links.value[unique_link_index.value]
        const now = new Date().getTime()
        if (discount_unique_links_active.value && discount_unique_links_active.value.length) {
          discount_unique_links_active.value.push({
            value: current_unique_link,
            expiry: now + 3600 * 1000 * 24
          })
          uni.setStorageSync("discount_unique_links",discount_unique_links_active.value);
        } else {
          uni.setStorageSync(
            "discount_unique_links",
            [{
              value: current_unique_link,
              expiry: now + 3600 * 1000 * 24
            }]
          );
        }
      }
      // window.location.href = res.data.config.payInfo;
      let jsConfig = JSON.parse(res.data.config.payInfo)
      let { timeStamp,nonceStr,signType,paySign } = jsConfig
      hideLoading_()
      uni.requestPayment({
          provider: 'wxpay',
          timeStamp,
          nonceStr,
          signType,
          paySign,
          package: jsConfig.package,
          success: (e) => {
              uni.showToast({
                title: "支付成功",
                icon: "success"
              })
              setTimeout(() => {
                  // #ifdef MP-WEIXIN
                  // wx.exitMiniProgram();
                  // #endif
                  uni.navigateBack({
                    delta: 1
                  });
              }, 1500)
          },
          fail: (err) => {
            // 取消支付，支付失败，返回支付首页
            const errMsg = err.errMsg || '';
            uni.showToast({
              title: errMsg && errMsg.includes('cancel') ? '取消支付' : '支付失败',
              icon: 'none',
              duration: 3000
            })
            // uni.navigateBack()
          },
          complete: () => {
            hideLoading_()
          }
      });
    }
    creating.value = false;
    is_down.value = false;
  } catch (err) {
    creating.value = false;
    is_down.value = false;
    hideLoading_()
    uni.showToast({
      title: err.message,
      icon: "none",
    });
  }
}

const popup = ref();
const input_value = ref("");
const is_open = ref(true);

// 获取附近商户
const nearby_list = ref([])

// 显示键盘
function focusHandle() {
  uni.hideKeyboard();
  is_open.value = !is_open.value;
  if (is_open.value) {
    popup.value.open("bottom");
  } else {
    popup.value.close();
  }
}

function hideHandle () {
  is_open.value = false;
  popup.value.close();
}
function showHandle () {
  is_open.value = true;
  popup.value.open("bottom");
}

function remarkFocus () {
  is_open.value = false;
  popup.value.close();
}

function checkSessionPromise() {
  return new Promise((resolve, reject) => {
    uni.checkSession({
      success(e) {
        resolve(e);
      },
      fail(e) {
        Routine.getCode()
          .then((code) => {
            uni.setStorageSync("wx_login_code", code);
            resolve(code);
          })
          .catch((err) => reject(err));
      },
    });
  });
}

// 创建订单
async function createdHandle() {
  if (uni.getStorageSync('o_id')) {
    orderCreate();
  } else {
    await checkSessionPromise();
    let res = await mineApi.bindMiniProgram({ code: uni.getStorageSync("wx_login_code"), appid: 'wx29df62cbac3abc9a' })
    uni.setStorageSync("o_id", res.data.routine_openid);
    orderCreate();
  }
}

function changeHandle(val) {
  input_value.value = val;
  pay_params.value.price = input_value.value - 0
}

function areArraysEqualUnorderedSome(arr1, arr2) {
  if (!arr2.length || !arr1.length) return false;
  return arr2.some(item => arr1.includes(item));
}

// 获取缓存是否过期
function getStorageWithExpiry (expiry) {
  const now = new Date().getTime()
  return now > expiry
}

async function getNearby () {
  let res = await merOfflineNearbyApi({ mer_id: 131, limit: 12 });
  nearby_list.value = res.data
  setTimeout(() => {
    show_ani.value = true
  },300)
}

onShow(async () => {
  await nextTick()
  popup.value.open("bottom");
});

onLoad(() => {
  merchant_info.value = uni.getStorageSync("merchant_info");
  unique_links.value = uni.getStorageSync('unique_links')

  let isLogin = uni.getStorageSync("isLogin");

  let discount_unique_links = uni.getStorageSync("discount_unique_links")
  if (discount_unique_links && discount_unique_links.length) {
    // 过期优惠链接删除
    discount_unique_links_active.value = discount_unique_links.filter(item => {
      return item.expiry && !getStorageWithExpiry(item.expiry)
    })
  }

  let feed_ids = (merchant_info.value.merchant_video && merchant_info.value.merchant_video.length) ? merchant_info.value.merchant_video.map(item => item.feed_id) : [];

  if (unique_links.value && unique_links.value.length && feed_ids) {
    let index_ = unique_links.value.findIndex(item => feed_ids.includes(item) && !discount_unique_links_active.value.map(citem => citem.value).includes(item))
    has_discount.value = index_ > -1
    if (has_discount.value) {
      unique_link_index.value = index_
    }
  }

  finish_task.value = areArraysEqualUnorderedSome(feed_ids,unique_links.value) && has_discount.value && isLogin;

  if (finish_task.value) {
    // 是否优惠
    pay_params.value.is_discount = 1;
  }
  pay_params.value.mer_id = merchant_info.value.mer_id;

  getNearby()
});
</script>
<style scoped lang="less">
.confirm-order-container {
  height: 100%;
  padding: 56rpx 0rpx 0rpx;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  background-position: left top;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  .pay-input-text {
    position: absolute;
    left: 50%;
    top: 580rpx;
    transform: translateX(-50%);
    height: 74rpx;
    font-weight: 600;
    font-size: 52rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: #FFFFFF;
    }
    .blinking-cursor {
      display: inline-block;
      width: 4rpx;
      height: 74rpx;
      background-color: #fff;
      animation: blink 1s step-end infinite;
      vertical-align: middle;
    }
  }

  .mer-name {
    width: 100%;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 80rpx;
    transform: translateX(-50%);
    font-weight: 600;
    font-size: 34rpx;
    color: #fff;
    padding: 0 20rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .mer-ctn {
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    top: 160rpx;
    display: flex;
    justify-content: space-around;
    .discount-tip {
      font-weight: 400;
      font-size: 24rpx;
      color: #fff;
    }
  }

  .planet {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 580rpx;
    left: 320rpx;
    opacity: 0;
    transform: scale(0);
    .planet-text {
      color: #fff;
      font-weight: 400;
      max-width: 140rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.planet-ani-1 {
      transition: all 1s ease-in-out;
    }
    &.planet-1 {
      top: 750rpx;
      left: 238rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-1 {
      width: 60rpx;
      height: 60rpx;
    }
    .text-1 {
      font-size: 18rpx;
    }
    &.planet-ani-2 {
      transition: all 1.4s ease-in-out;
    }
    &.planet-2 {
      top: 680rpx;
      left: 103rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-2 {
      width: 80rpx;
      height: 80rpx;
    }
    .text-2 {
      font-size: 18rpx;
    }
    &.planet-ani-3 {
      transition: all 1.8s ease-in-out;
    }
    &.planet-3 {
      top: 536rpx;
      left: 65rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-3 {
      width: 84rpx;
      height: 84rpx;
    }
    .text-3 {
      font-size: 20rpx;
    }
    &.planet-ani-4 {
      transition: all 2.2s ease-in-out;
    }
    &.planet-4 {
      top: 372rpx;
      left: 85rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-4 {
      width: 84rpx;
      height: 84rpx;
    }
    .text-4 {
      font-size: 20rpx;
    }
    &.planet-ani-5 {
      transition: all 2.6s ease-in-out;
    }
    &.planet-5 {
      top: 226rpx;
      left: 205rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-5 {
      width: 120rpx;
      height: 120rpx;
    }
    .text-5 {
      font-size: 22rpx;
    }
    &.planet-ani-6 {
      transition: all 3s ease-in-out;
    }
    &.planet-6 {
      top: 232rpx;
      left: 405rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-6 {
      width: 104rpx;
      height: 104rpx;
    }
    .text-6 {
      font-size: 24rpx;
    }
    &.planet-ani-7 {
      transition: all 3.4s ease-in-out;
    }
    &.planet-7 {
      top: 328rpx;
      left: 555rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-7 {
      width: 112rpx;
      height: 112rpx;
    }
    .text-7 {
      font-size: 24rpx;
    }
    &.planet-ani-8 {
      transition: all 3.8s ease-in-out;
    }
    &.planet-8 {
      top: 488rpx;
      left: 605rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-8 {
      width: 120rpx;
      height: 120rpx;
    }
    .text-8 {
      font-size: 26rpx;
    }
    &.planet-ani-9 {
      transition: all 4.2s ease-in-out;
    }
    &.planet-9 {
      top: 688rpx;
      left: 553rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-9 {
      width: 152rpx;
      height: 152rpx;
    }
    .text-9 {
      font-size: 26rpx;
    }
    &.planet-ani-10 {
      transition: all 4.6s ease-in-out;
    }
    &.planet-10 {
      top: 852rpx;
      left: 419rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-10 {
      width: 160rpx;
      height: 160rpx;
    }
    .text-10 {
      font-size: 28rpx;
    }
    &.planet-ani-11 {
      transition: all 5s ease-in-out;
    }
    &.planet-11 {
      top: 962rpx;
      left: 240rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-11 {
      width: 172rpx;
      height: 172rpx;
    }
    .text-11 {
      font-size: 28rpx;
    }
    &.planet-ani-12 {
      transition: all 5.4s ease-in-out;
    }
    &.planet-12 {
      top: 1046rpx;
      left: 10rpx;
      opacity: 1;
      transform: scale(1);
    }
    .img-12 {
      width: 240rpx;
      height: 240rpx;
    }
    .text-12 {
      font-size: 28rpx;
    }
  }
}

@keyframes blink {
  from,
  to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
