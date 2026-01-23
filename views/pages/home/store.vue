<template>
  <view class="mian-box flex" :style="{ height: hei + 'px' }">
    <view class="header">
      <image
        class="bck-img"
        :style="{ height: statusBarHeight + 105 + 'px' }"
        :src="mer_type !== 'seller' ? store_info.mer_avatar : store_info.bg_img"
        mode="aspectFill"
      ></image>
      <view class="masks" :style="{ height: statusBarHeight + 105 + 'px' }"></view>
    </view>
    <view class="content">
      <view
        class="back-icon"
        @click="backEvent"
        :style="{ marginTop: statusBarHeight + 10 + 'px' }"
      >
        <uni-icons type="left" color="#000" size="26"></uni-icons>
      </view>
      <view class="store-info">
        <image
          class="store-avatat"
          :src="store_info.mer_avatar"
          mode="aspectFill"
          @click="toStoreDetail"
        ></image>
        <view class="store-info-right">
          <view class="top">
            <view class="top-left" @click="toStoreDetail">
              <view class="name"
                ><text class="text">{{ store_info.mer_name }}</text></view
              >
              <view class="rate" v-if="mer_type !== 'seller'">
                <text class="text">店铺评级：</text>
                <uni-rate
                  :readonly="true"
                  :value="
                    getScoring(
                      store_info.postage_score,
                      store_info.product_score,
                      store_info.service_score
                    )
                  "
                  size="12"
                />
                <text class="score-num">{{
                  getScoring(
                    store_info.postage_score,
                    store_info.product_score,
                    store_info.service_score
                  )
                }}</text>
              </view>
            </view>
            <view class="top-right">
              <image
                class="img"
                :src="imgUrlEvent('/images/wx-applet/home/daohang.png', 'aliyunImgUrl')"
                mode="aspectFill"
                @click="getLocation"
                v-if="mer_type !== 'seller'"
              ></image>
              <image
                class="img"
                :src="imgUrlEvent('/images/wx-applet/home/dianhua.png', 'aliyunImgUrl')"
                mode="aspectFill"
                v-if="mer_type !== 'seller'"
                @click="customerService"
              ></image>
            </view>
          </view>
          <view class="mer_address" :class="mer_type == 'seller' ? 'seller' : ''" @click="toStoreDetail"
            ><text class="text">{{ store_info.mer_address }}</text></view
          >
          <view class="signature" v-if="mer_type == 'seller'"><text class="text">{{ store_info.signature ? store_info.signature : '这个人很懒，还没有个性签名哦！' }}</text></view
          >
        </view>
      </view>
      <view class="commodity">
        <view class="h-search df-r ai-c">
            <image
                :src="imgUrlEvent('/images/kkyz/v3-d-search.png', 'aliyunImgUrl')"
                class="h-icon"
                mode="aspectFill"
            ></image>
            <input v-model="keyword" confirm-type="search" placeholder="搜索" class="input" @confirm="handleSearch" />
        </view>
        <view class="title" v-if="!show_tab"><text class="text">{{ title_name }}</text></view>
        <view class="tab-wrap" v-else>
          <uv-tabs
            @change="navTabChange"
            :current="tab_current"
            :inactiveStyle="{
              color: '#000000',
              fontWeight: 600,
              fontSize: '28rpx',
            }"
            :activeStyle="{
              color: '#1B9AFF',
              fontWeight: 600,
              fontSize: '28rpx',
            }"
            :itemStyle="{ height: '70rpx', padding: '0rpx 44rpx' }"
            lineHeight="4"
            lineWidth="20"
            lineColor="#1B9AFF"
            :scrollable="true"
            :list="tab_list"
          ></uv-tabs>
        </view>
        <scroll-view
          :style="{ height: hei - 220 + 'px' }"
          :scroll-y="true"
          class="scroll-view"
          :show-scrollbar="false"
          @scrolltolower="scrolltolower"
          v-if="products_list.length > 0 && !show_skeletons"
        >
          <view class="list" v-for="(item, index) in products_list" :key="index" @click="toDetail(item)">
            <image class="list-img" :src="item?.image" mode="aspectFill"></image>
            <view class="commodity-right">
              <view class="commodity-name"
                ><text class="text">{{ item.store_name }}</text></view
              >
              <view class="type">
                <view class="type-box">
                  <text
                    class="text"
                    v-if="
                      item.merchant && item.merchant.type_name && item.product_type == 0
                    "
                    >{{ item.merchant.type_name }}</text
                  >
                  <text
                    class="text"
                    v-else-if="item.merchant.is_trader && item.product_type == 0"
                    >自营</text
                  >
                </view>
                <view class="type-box" v-if="item.issetCoupon">
                  <text class="text">领券</text>
                </view>
                <view
                  class="type-box"
                  v-if="item.delivery_free == 1 && item.sc_product_type != 1"
                >
                  <text class="text">包邮</text>
                </view>
                <text class="promotion-text" v-if="mer_type == 'seller' && Number(item.ticket) > 0">赠{{ decimalExchangeCoupons(item.ticket) }}兑换券</text>  
                <template
                  v-if="
                    item.zone_type == 'hot' ||
                    item.zone_type == 'premium' ||
                    item.zone_type == 'exchange'
                  "
                >
                  <text class="promotion-text" v-if="item.zone_type == 'exchange' && item.product?.super_integral">{{
                    "兑换积分最多抵扣" + item.product?.super_integral
                  }}</text>
                  <text class="promotion-text" v-if="item.product?.consume_points"
                    >赠{{
                      item.product && item.product.consume_points
                        ? decimalExchangeCoupons(item.product.consume_points)
                        : 0
                    }}本店消费积分</text
                  >
                </template>
                <template v-else>
                  <text
                    class="promotion-text"
                    v-if="item.product?.consume_points && Number(item.ticket) > 0"
                    >赠{{ decimalExchangeCoupons(item.ticket) }}兑换券</text
                  >
                </template>
                <!-- 店长带货 -->
                <text class="promotion-text" v-if="item?.max_share_benefit_price">折扣总额{{item.max_share_benefit_price}}</text>
                <!-- 店铺商品 -->
                <text class="promotion-text" v-else-if="item.product?.max_share_benefit_price">折扣总额{{item.product.max_share_benefit_price}}</text>
              </view>
              <view class="commodity-footer">
                <view class="footer-left">
                  <text class="price"
                    ><text style="font-size: 22rpx">￥</text>{{ item.price }}</text
                  >
                  <text class="ot_price">￥{{ item.ot_price }}</text>
                </view>
                <button class="btn">抢购</button>
              </view>
            </view>
          </view>
          <uni-load-more
            status="loading"
            iconType="circle"
            color="#007AFF"
            v-if="is_loading && products_list.length > 0"
          ></uni-load-more>
          <view
            class="text-null"
            v-if="
              products_list.length > 0 &&
              products_list.length == page_info &&
              products_list.length > 4
            "
            ><text class="text">暂无更多商品~</text></view
          >
          <view style="height: 40rpx;"></view>
        </scroll-view>
        <c-null v-if="!products_list.length && !show_skeletons"></c-null>
        <uv-skeletons :loading="show_skeletons" v-if="show_skeletons" :skeleton="list_skeleton"></uv-skeletons>
      </view>
    </view>
  </view>
  <view class="global-tips df-r ai-c jc-c" v-if="main_store.is_wechat_moments_share">点击下方按钮前往小程序使用完整服务</view>
  <g-login-modal ref="login_modal" @loginCallback="loginCallback"></g-login-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import {
  onLoad,
  onShow,
  onReady,
  onInit,
  onHide,
  onUnload,
  onBackPress,
  onShareAppMessage,
  onShareTimeline
} from "@dcloudio/uni-app";
import { homeApi } from "@/business/api/index.ts";
import { checkTokenEventAst } from "/infrastructure/utils/util";
import useMain from "@/business/store/index";
let hei = uni.getSystemInfoSync().windowHeight;
const main_store = useMain();
const store_info = ref({});
const products_list = ref([]);
const page_info = ref({});
const mer_id = ref("");
const current_invite_code = ref("");
const is_loading = ref(false);
const mer_type = ref('')
const params = ref({
  page: 1,
  pageSize: 10, 
});
const systemInfo = uni.getSystemInfoSync();
const statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度
const login_modal = ref()

const show_skeletons = ref(true);

const list_skeleton = ref([{
    type: 'line',
    num: 8,
    gap: '0rpx',
    style: {
        width: '710rpx',
        height: '200rpx',
        marginLeft: '0rpx',
        marginTop: '16rpx'
    }
}]);

const tab_current = ref(0);
const tab_list = ref([
  { name: "店长推荐", id: 1 },
  { name: "店长带货", id: 2 }
]);

const keyword = ref("")

const title_name = ref('店长推荐')
const show_tab = ref(false)

const shareTimelineareOptions = ref({
  title: '',
  query: '',
  imageUrl: ''
})

const setShareTimelinePath = () => {
  shareTimelineareOptions.value.query = `mer_id=${mer_id.value}&mer_type=${mer_type.value}${current_invite_code.value ? `&invite_code=${current_invite_code.value}` : ''}`
  shareTimelineareOptions.value.imageUrl = store_info.value.mer_avatar
  shareTimelineareOptions.value.title = store_info.value.mer_name
}

// 分享到朋友圈
onShareTimeline((res) => {
  setShareTimelinePath()
  return shareTimelineareOptions.value
})

//搜索
function handleSearch(){
  show_skeletons.value = true;
  products_list.value = [];
  params.value = {
    page: 1,
    pageSize: 10, 
  }
  getProductList(true);
}

function navTabChange (data) {
  tab_current.value = data.index;
  show_skeletons.value = true;
  products_list.value = [];
  keyword.value = ''
  params.value = {
    page: 1,
    pageSize: 10, 
  }
  if (tab_current.value == 0) {
    getStoreProductList()
  } else if (tab_current.value == 1) {
    getMerSellProductList()
  }
}

onLoad((opt) => {
  console.log(opt.mer_id,opt);
  if(opt.invite_code){
    // 缓存上级邀请码
    uni.setStorageSync('invite_code',opt.invite_code)
    current_invite_code.value = opt.invite_code;
    console.log('成功缓存上级code')
  }
  mer_id.value = opt.mer_id;
  mer_type.value = opt.mer_type
  if (mer_type.value == 'seller') {
    title_name.value = '店长带货'
    show_tab.value = false
  }
  getInfo();
  getProductList();

});

// 授权登录回调
function loginCallback() {
  products_list.value = []
  params.value.page = 1
  getInfo();
  getProductList();
}

// 获取店铺信息
async function getInfo() {
  mer_type.value == 'seller' ? getSellInfo() : getStoreInfo()
}

// 获取商户店铺信息
async function getStoreInfo() {
  const { data } =  await homeApi.geiMinimerApi({ mer_id: mer_id.value });
  store_info.value = data;
}

// 获取达人店铺信息
async function getSellInfo() {
  const { data } =  await homeApi.sellHomeApi({ sell_uid: mer_id.value }) 
  store_info.value = data;
}

// 获取推荐商品
async function getProductList(is_search) {
   mer_type.value == 'seller' ? getSellProductList() : getStoreProductList(is_search)
}

const has_store_product_list = ref(true)

// 获取店铺推荐商品列表
async function getStoreProductList(is_search) {
  // is_loading.value = true;
  try {
    const { data } =  await homeApi.geiMinimerProductsApi({...params.value,mer_id: mer_id.value,keyword: keyword.value});
    products_list.value = products_list.value.concat(data.list)
    page_info.value = data.count;
    has_store_product_list.value = data.count > 0
    is_loading.value = false;
    if ((show_tab.value || title_name.value == '店长推荐') && is_search) {
      if (tab_current.value == 0) {
        show_skeletons.value = false;
        return
      } else if (tab_current.value == 1) {
        products_list.value = []
      }
    };
    if (title_name.value == '店长带货' && is_search) {
      products_list.value = []
    }
    getMerSellProductList(is_search)
  } catch (err) {
    show_skeletons.value = false;
    is_loading.value = false;
  }
}

// 获取达人商品列表
async function getSellProductList() {
  // is_loading.value = true;
  try {
    const { data } = await homeApi.sellProductsApi({...params.value,sell_uid: mer_id.value,keyword: keyword.value})
    products_list.value = products_list.value.concat(data.items)
    page_info.value = data.pageInfo.total;
    is_loading.value = false;
    title_name.value = '店长带货'
    show_tab.value = false;
    show_skeletons.value = false;
  } catch (err) {
    is_loading.value = false;
    show_skeletons.value = false;
  }
}
// 获取店铺主带货商品
async function getMerSellProductList(is_search) {
  // is_loading.value = true;
  try {
    const { data } = await homeApi.merSellProductsApi({...params.value,mer_id: mer_id.value,keyword: keyword.value})
    if (!has_store_product_list.value) {
      page_info.value = data.pageInfo.total;
      products_list.value = products_list.value.concat(data.items)
    }
    is_loading.value = false;
    show_skeletons.value = false;
    if (!has_store_product_list.value) {
      if (is_search) return;
      if (!products_list.value.length) {
        title_name.value = '店长推荐'
        show_tab.value = false
      } else {
        title_name.value = '店长带货'
        tab_current.value = 1
        show_tab.value = false
      }
    } else {
      if (tab_current.value == 0) {
        if (is_search) return;
        if (!data.items.length) {
          title_name.value = '店长推荐'
          show_tab.value = false
        } else {
          show_tab.value = true
        }
      } else if (tab_current.value == 1) {
        page_info.value = data.pageInfo.total;
        products_list.value = products_list.value.concat(data.items)
      }
      
    }
  } catch (err) {
    show_skeletons.value = false;
    is_loading.value = false;
  }
}



function getScoring(a, b, c) {
  const numbers = [Number(a), Number(b), Number(c)];
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;
  const rounded = Math.round(average * 2) / 2;
  return rounded;
}

//打开地图
function getLocation() {
  console.log(store_info.value.lat, store_info.value.long);
  uni.openLocation({
    latitude: Number(store_info.value.lat),
    longitude: Number(store_info.value.long),
    address: store_info.value.mer_address,
    success: function () {
      console.log("success");
    },
  });
}

// 联系客服
function customerService() {
  uni.showModal({
    title: "提示",
    content: "暂无在线客服，确定拨打客服电话:" + store_info.value.mer_phone + "吗？",
    success: function (res) {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: store_info.value.mer_phone,
        });
      }
    },
  });
}
// 校验登录状态
async function checkLogin() {
  // 判断token是否过期
  if (!(await checkTokenEventAst())) {
    login_modal.value.open();
    return true;
  }
}
// 购买商品
async function toDetail(data) {
 if (await checkLogin()) return;
 // 带货商品
 let is_commerce_goods = (!show_tab.value && title_name.value == '店长带货') || (show_tab.value && tab_current.value == 1)
 let is_commerce = mer_type.value == 'seller' ? 1 : is_commerce_goods ? 1 : 2
 // 是否店铺带货
 let is_store_sell = (mer_type.value != 'seller' && is_commerce_goods);
  uni.navigateTo({
    url: `/pagesProduct/goods_details/index?id=${data.product_id}&mall_uid=${is_store_sell ? data.sell_uid :　(mer_id.value || '')}&is_commerce=${is_commerce}`,
  });
}

// 滚动到底部
function scrolltolower() {
  if (products_list.value.length < page_info.value) {
    params.value.page += 1;
    is_loading.value = true;
    if (mer_type.value == 'seller') {
      getSellProductList()
    } else {
      if (tab_current.value == 0) {
        getStoreProductList()
      } else if (tab_current.value == 1) {
        getMerSellProductList()
      }
    }
    // getProductList();
  }
}

// 返回上一页
function backEvent() {
  // 获取当前打开过的页面路由数组
  let pages = getCurrentPages();
  console.log("路由：", pages.length);
  if (pages.length == 1) {
    // 扫码进入店铺返回视频首页
    uni.switchTab({
      url: "/views/pages/home/index",
    });
  } else {
    uni.navigateBack({
      delta: 1,
    });
  }
}
// 兑换券转换
function decimalExchangeCoupons(num) {
  return Number(num).toFixed(2);
}
// 跳转店铺详情
function toStoreDetail() {
  if (mer_type.value == 'seller') return;
  uni.navigateTo({
    url: `/views/pages/home/store-detail?mer_id=${store_info.value.mer_id}`,
  });
}
</script>

<style lang="less" scoped>
.promotion-text {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 22rpx;
  color: #fe8686;
  letter-spacing: 0;
  display: inline-block;
  // margin-bottom: 8rpx;
  margin: 4rpx 8rpx 4rpx 0;
  &.active {
    color: #00dcee;
  }
}
.mian-box {
  width: 750rpx;
  background: #ffffff;
  overflow: hidden;
  .header {
    position: absolute;
    // background: #f9f9f9;
    width: 750rpx;
    height: 400rpx;
  }
  .bck-img {
    // background-image: linear-gradient(to bottom, rgb(255, 255, 255), transparent);
    width: 750rpx;
    height: 224rpx;
    position: absolute;
    // -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
    // mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
    opacity: 1;
  }
  .masks {
    width: 750rpx;
    height: 224rpx;
    position: absolute;
    z-index: 1;
    background-image: url(http://kankan-cdn.mdd3.cn/images/wx-applet/home/mask-back.png);
    background-size: 100% 100%;
    opacity: 1;
    // border: none !important;
  }
  .content {
    position: relative;
    z-index: 8;
    display: flex;
    flex-direction: column;
    .commodity {
      width: 750rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      box-shadow: 0 4rpx 8rpx 0 rgba(231, 231, 231, 0.5);
      border-radius: 28rpx 28rpx 0 0;
      margin-top: 40rpx;
      padding: 20rpx 0rpx;
      padding-bottom: 0rpx;
      flex: 1;
      .h-search {
        width: 710rpx;
        height: 72rpx;
        background: #F5F5F5;
        border-radius: 36rpx;
        padding: 0 20rpx;
        margin-bottom: 20rpx;
        &.manage {
            width: 480rpx;
        }
        .h-icon {
            width: 32rpx;
            height: 32rpx;
            margin-right: 8rpx;
        }
        .input-placeholder {
			font-weight: 400;
            font-size: 24rpx;
            color: #D3D3D3;
		}
		
		.input {
            font-size: 24rpx;
			flex: 1;
		}
    }
      .tab-wrap {
        width: 750rpx;
        height: 70rpx;
        margin-bottom: 8rpx;
      }
      .scroll-view {
        width: 750rpx;
        overflow: auto;
        .text-null {
          width: 750rpx;
          display: flex;
          justify-content: center;
          margin: 40rpx 0rpx;
          padding-bottom: 40rpx;
          height: 120rpx;
          .text {
            color: #a5a5a5;
          }
        }
        .list {
          display: flex;
          background: #ffffff;
          box-shadow: 0 0 20rpx 12rpx #eeeeee80;
          border-radius: 16rpx;
          padding: 16rpx;
          width: 710rpx;
          margin-top: 20rpx;
          margin-left: 20rpx;
          .commodity-right {
            margin-left: 16rpx;
            .commodity-footer {
              margin-top: 22rpx;
              width: 486rpx;
              display: flex;
              justify-content: space-between;
              .btn {
                width: 140rpx;
                height: 60rpx;
                background: #fa6262;
                border-radius: 16rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                font-weight: 600;
                font-size: 28rpx;
                margin-right: 0rpx;
              }
              .footer-left {
                align-self: flex-end;
                .price {
                  color: #fc5555;
                  font-size: 32rpx;
                  font-weight: 500;
                }
                .ot_price {
                  font-size: 24rpx;
                  color: #a5a5a5;
                  text-decoration: line-through;
                  margin-left: 8rpx;
                }
              }
            }
            .type {
              margin-top: 12rpx;
              flex: 0;
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              .type-des {
                font-size: 24rpx;
                color: #a5a5a5;
                // margin-left: 16rpx;
              }
              .type-box {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 34rpx;
                padding: 0rpx 4rpx;
                border: 1px solid #fe8686;
                border-radius: 6rpx;
                margin-right: 12rpx;
                .text {
                  font-size: 24rpx;
                  color: #fe8686;
                }
              }
            }
            .commodity-name {
              overflow: hidden;
              word-break: break-all; /* break-all(允许在单词内换行。) */
              text-overflow: ellipsis; /* 超出部分省略号 */
              display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
              -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
              -webkit-line-clamp: 1; /** 显示的行数 **/
              .text {
                font-weight: 500;
                font-size: 30rpx;
                color: #000000;
              }
            }
          }
          .list-img {
            width: 168rpx;
            height: 168rpx;
            border-radius: 16rpx;
            flex-shrink: 0;
          }
        }
      }
      .title {
        width: 750rpx;
        margin-left: 40rpx;
        padding-bottom: 20rpx;
        .text {
          font-weight: 600;
          font-size: 30rpx;
          color: #000000;
        }
      }
    }
    .store-info {
      display: flex;
      padding: 0rpx 20rpx;
      padding-right: 40rpx;
      margin-top: 48rpx;
      width: 750rpx;

      .store-info-right {
        flex: 1;
        .mer_address {
          overflow: hidden;
          word-break: break-all; /* break-all(允许在单词内换行。) */
          text-overflow: ellipsis; /* 超出部分省略号 */
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 1; /** 显示的行数 **/
          &.seller {
            -webkit-line-clamp: 2; /** 显示的行数 **/
          }
          margin-top: 12rpx;
          .text {
            font-size: 24rpx;
            color: #a5a5a5;
          }
        }
        .signature {
          overflow: hidden;
          word-break: break-all; /* break-all(允许在单词内换行。) */
          text-overflow: ellipsis; /* 超出部分省略号 */
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 2; /** 显示的行数 **/
          margin-top: 12rpx;
          .text {
            font-size: 24rpx;
            color: #000;
          }
        }
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          .top-right {
            flex-shrink: 0;
            .img {
              width: 52rpx;
              height: 52rpx;
              margin-left: 32rpx;
            }
          }
          .score-num{
            font-size: 22rpx;
            margin-left: 16rpx;
            color: #a5a5a5;
          }
          .top-left {
            .rate {
              display: flex;
              align-items: center;
              .text {
                font-size: 24rpx;
                color: #a5a5a5;
              }
            }
            .name {
              margin-bottom: 12rpx;
              margin-top: 4rpx;
              overflow: hidden;
              word-break: break-all; /* break-all(允许在单词内换行。) */
              text-overflow: ellipsis; /* 超出部分省略号 */
              display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
              -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
              -webkit-line-clamp: 1; /** 显示的行数 **/
              width: 370rpx;
              .text {
                font-weight: 600;
                font-size: 34rpx;
                color: #111111;
              }
            }
          }
        }
      }
      .store-avatat {
        width: 134rpx;
        height: 136rpx;
        border-radius: 16rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
    }
    .back-icon {
      margin-left: 20rpx;
    }
  }
}
.global-tips {
  z-index: 9999;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.8);
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  border-radius: 12rpx 12rpx 0 0;
}
/deep/.uv-tabs__wrapper__nav__item__text--disabled {
    color: #000000 !important;
}
</style>
