<template>
  <view
    class="home-content"
    :style="{ backgroundImage: `url(${imagesUrl}/supply/coupon-out-bg.png)` }"
  >
    <template v-if="is_mer">
      <view class="merchant-info">
        <image
          mode="aspectFit"
          class="merchant-icon"
          :src="merchant_info.mer_avatar"
        ></image>
        <text class="text">{{ merchant_info.mer_name }}</text>
      </view>
      <view class="coupon-ctn">
        <image
          mode="aspectFit"
          class="coupon-title"
          :src="imagesUrl + '/supply/coupon-title.png'"
        ></image>
        <view
          class="coupon-dtl"
          :style="{ backgroundImage: `url(${imagesUrl}/supply/coupon-bg.png)` }"
        >
          <text
            class="conpon-text"
            v-if="merchant_info.discounts_json.type == 'full'"
            >满{{ merchant_info.discounts_json.full_price }}元减{{
              merchant_info.discounts_json.reduce_price
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
        <view class="btn-discount btn" @click="toWeixin">
          <text class="text">去点赞</text>
        </view>
      </view>
    </template>
    <template v-if="!is_mer">
      <view class="merchant-info">
        <image
          mode="aspectFit"
          class="merchant-icon"
          :src="user_info?.user?.avatar"
        ></image>
        <text class="text">{{ user_info?.user?.nickname }}</text>
      </view>
      <view class="coupon-ctn">
        <image
          mode="aspectFit"
          class="coupon-title"
          :src="imagesUrl + '/supply/coupon-title.png'"
        ></image>
        <view
          class="coupon-dtl"
          :style="{ backgroundImage: `url(${imagesUrl}/supply/coupon-bg.png)` }"
        >
          <text
            class="conpon-text"
            v-if="user_info.discounts_json.type == 'full'"
            >满{{ user_info.discounts_json.full_price }}元减{{
              user_info.discounts_json.reduce_price
            }}元</text
          >
          <text
            class="conpon-text"
            v-if="user_info.discounts_json.type == 'off'"
            >优惠{{ user_info.discounts_json.rate }}%</text
          >
          <text
            class="conpon-text"
            v-if="user_info.discounts_json.type == 'desc'"
            >{{ user_info.discounts_json.content }}</text
          >
        </view>
      </view>
      <view class="btns">
        <view class="btn-discount btn" @click="toWeixin">
          <text class="text">去点赞</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { fetchMerchantInfoApi, getVideoApi, getUserFetchUidMarketingCodeInfo, userGetVideo } from "@/business/api/modules/mall.ts";
let IAMGES_URL = 'https://mall-cdn.mdd3.cn/images'
export default {
  components: {},
  data() {
    return {
      cur_mer_info: {
        mer_id: "",
        mer_no: "",
      },
      cur_user_info: {
        uid: "",
        uid_no: "",
      },
      merchant_info: {},
      mer_video_info: {},
      user_info: {},
      user_video_info: {},
      imagesUrl: IAMGES_URL,
      is_mer: false,
    };
  },
  onLoad(options) {
    if (options.mer_id && options.mer_no) {
      this.cur_mer_info = {
        mer_id: decodeURIComponent(options.mer_id),
        mer_no: decodeURIComponent(options.mer_no),
      };
      this.is_mer = true
      this.getmerchant_info();
      this.getVideo();
    } else if (options.uid && options.uid_no) {
      this.cur_user_info = {
        uid: decodeURIComponent(options.uid),
        uid_no: decodeURIComponent(options.uid_no),
      };
      this.is_mer = false
      this.getuser_info();
      this.getUserVideo();
    }
    wx.openChannelsActivity({
      finderUserName: decodeURIComponent(options.finderUserName),
      feedId: decodeURIComponent(options.feedId),
      success: function (res) {},
      fail: function (err) {},
    });
  },
  mounted() {},
  methods: {
    async getmerchant_info() {
      let res = await fetchMerchantInfoApi({
        mer_id: this.cur_mer_info.mer_id,
        mer_no: this.cur_mer_info.mer_no,
      });
      this.merchant_info = res.data;
    },
    async getuser_info() {
      let res = await getUserFetchUidMarketingCodeInfo({
        uid_no: this.cur_user_info.uid_no,
      });
      this.user_info = res.data;
    },
    async getVideo() {
      let res = await getVideoApi({
        mer_id: this.cur_mer_info.mer_id,
      });
      this.mer_video_info = res.data;
    },
    async getUserVideo() {
      let res = await userGetVideo({
        uid: this.cur_user_info.uid,
      });
      this.user_video_info = res.data;
    },
    toWeixin() {
      wx.openChannelsActivity({
        finderUserName: this.is_mer ? this.mer_video_info.finder_user_id : this.user_video_info.finder_user_id,
        feedId: this.is_mer ? this.mer_video_info.feed_id : this.user_video_info.feed_id,
        success: function (res) {},
        fail: function (err) {},
      });
    },
  },
};
</script>

<style scoped lang="scss">
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
      width: 282rpx;
      height: 48rpx;
      margin-bottom: 26rpx;
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
