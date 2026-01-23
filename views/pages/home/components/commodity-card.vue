<template>
  <swiper
    class="swiper"
    autoplay
    circular
    v-if="list.length > 0"
    :style="{
      height: props.height + 48 + 'rpx',
      width: props.width + 'rpx',
    }"
  >
    <swiper-item v-for="(item, index) in list" :key="index">
      <view>
        <view
          class="card-header"
          :style="{
            width: props.width - 4 + 'rpx',
          }"
        >
          <text class="text" @click="toStore">{{ mer_info.mer_name }}｜优惠商品</text>
        </view>
        <view
          class="list-item"
          @click="toDetail(item)"
          :style="{
            height: props.height + 'rpx',
            width: props.width - 4 + 'rpx',
          }"
        >
          <image
            :src="item.image"
            class="imgs"
            mode="aspectFill"
            :style="{
              width: props.type == 2 ? '132rpx' : '100rpx',
              height: props.type == 2 ? '132rpx' : '100rpx',
            }"
          />
          <view
            class="item-right"
            :style="{
              height: props.type == 2 ? '132rpx' : '100rpx',
            }"
          >
            <view class="item-name"
              ><text class="text" :class="type == 1 ? 'nowrap' : 'nowrap-line2'">{{
                item.store_name
              }}</text></view
            >
            <view class="item-price">
              <view class="flex flex-culomn flex-ac">
                <text class="price-text">￥{{ item.price }}</text>
                <text class="Sold-text">￥{{ item.ot_price }}</text>
              </view>
              <view class="Discount"><text class="text">{{
                  setDiscount(item.price, item.ot_price)
                }}</text></view
              >
              <view class="btn"><text class="text">抢购</text></view>
            </view>
          </view>
        </view>
      </view>
    </swiper-item>
  </swiper>
  <g-login-modal ref="login_modal" @loginCallback="loginCallback"></g-login-modal>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, computed } from "vue";
import { checkTokenEventAst } from "/infrastructure/utils/util";
const props = defineProps({
  width: {
    type: Number,
    default: 710,
  },
  height: {
    type: Number,
    default: 164,
  },
  type: {
    type: Number,
    default: 2, //文字省略行数
  },
  list: {
    type: Array,
    default: [], //文字省略行数
  },
  mer_info: {
    type: Object,
    default: {}, //文字省略行数
  },
});
const login_modal = ref()
const emit = defineEmits(['loginCallback'])
// 校验登录状态
async function checkLogin() {
  if (!uni.getStorageSync("isLogin")) {
    login_modal.value.open();
    return true;
  }
  // 判断token是否过期
  if (!(await checkTokenEventAst())) {
    login_modal.value.open();
    return true;
  }
}
// 购买商品
async function toDetail(data) {
 if (await checkLogin()) return
 let is_commerce = props.mer_info.merchant_type == 'seller' ? 1 : 2
  uni.navigateTo({
    url: `/pagesProduct/goods_details/index?id=${data.product_id}&mall_uid=${props.mer_info.mer_uid || ''}&is_commerce=${is_commerce}`,
  });
}
// 计算折扣
function setDiscount(price, ot_price) {
  return ((price / ot_price) * 10).toFixed(1) + "折";
}

function toStore() {
  let id = props.mer_info.merchant_type == 'seller' ? props.mer_info.mer_uid : props.mer_info.mer_id
  uni.navigateTo({
    url: `/views/pages/home/store?mer_id=${id}&mer_type=${props.mer_info.merchant_type}`,
  });
}

function loginCallback() {
  emit('loginCallback')
}

</script>

<style lang="less" scoped>
.card-header {
  height: 74rpx;
  background: #fa6262;
  border-radius: 16rpx;
  position: absolute;
  //  display: flex;
  //  align-items: center;
  padding-top: 8rpx;
  .text {
    color: #fff;
    margin-left: 16rpx;
    font-size: 26rpx;
  }
}
.list-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  z-index: 2;
  transform: translateY(48rpx);
  // margin-right: 24rpx !important;

  .imgs {
    flex-shrink: 0;
    margin-right: 16rpx;
  }
  .item-right {
    flex: 1;
    width: 380rpx;
    display: flex;
    flex-direction: column;
    .item-price {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 24rpx;
      .Discount {
        padding: 2rpx 8rpx;
        background: #ffd76f;
        border-radius: 16rpx 16rpx 16rpx 0;
        position: absolute;
        right: 36rpx;
        bottom: 52rpx;
        .text {
          font-weight: 600;
          font-size: 24rpx;
          color: #fa6262;
        }
      }
      .btn {
        width: 116rpx;
        height: 48rpx;
        background: #fa6262;
        border-radius: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
          color: #fff;
          font-weight: 500;
          font-size: 20rpx;
        }
      }
      .price-text {
        color: #fa6262;
        font-weight: 600;
        font-size: 28rpx;
      }
      .Sold-text {
        font-size: 20rpx;
        color: #a5a5a5;
        margin-left: 8rpx;
        text-decoration: line-through;
      }
    }
    .item-name {
      display: flex;
      width: 380rpx;
      .text {
        word-break: break-all; /* break-all(允许在单词内换行。) */
        text-overflow: ellipsis; /* 超出部分省略号 */
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1; /** 显示的行数 **/
        font-size: 24rpx;
        color: #111;
        font-weight: 600;
      }
    }
  }
}
</style>
