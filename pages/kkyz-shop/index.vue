<template>
  <view
    :style="{
      height: windowHeight + 'px',
    }"
    class="mall-container"
  >
    <image
      :src="imgUrlEvent('/images/kkyz/mall-home-bck1.jpg', 'aliyunImgUrl')"
      class="mall-home-bg"
    ></image>
    <view>
      <view
        class="mall-title"
        :style="{ paddingTop: systemBarHeight * 2 + 32 + 'rpx' }"
      >
        <text class="text">看看宇宙商城</text>
      </view>
      <view class="header-top">
        <view class="search-box">
          <view class="input" @click="toSearch">
            <uni-icons type="search" color="#CCCCCC" size="20"></uni-icons>
            <text style="font-size: 24rpx; color: #d3d3d3; margin-left: 8rpx"
              >搜一下就出来了…</text
            >
          </view>
          <view class="icon2-box" @click="shoppingCart">
            <image
              :src="
                imgUrlEvent('/images/kkyz/mall-home-icon2.png', 'aliyunImgUrl')
              "
              class="img-ai icon2"
            ></image>
            <view class="Corner acea-row row-middle row-center" v-if="shop_list > 0">
              <text class="text">{{ shop_list > 99 ? "99+" : shop_list }}</text>
            </view>
          </view>
          <view class="icon2-box" @click="toCustomerService">
            <image
              :src="
                imgUrlEvent('/images/kkyz/mall-home-icon3.png', 'aliyunImgUrl')
              "
              class="img-ai icon3"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <scroll-view
      class="mall-content"
      :scroll-y="true"
      lower-threshold="100"
      :show-scrollbar="false"
      @scrolltolower="loadmore"
    >
      <view style="padding: 0 20rpx;">
        <MoreNotice></MoreNotice>
        <Menu style="margin-top: 20rpx"></Menu>
        <!-- 商品切换组件 -->
        <GoodList :dataConfig="goodListData[0]" @changeSwitch="Changswitch" @changeList="changeList" @skeletonChange="skeletonChange" @statusChange="loadStatusChange" v-if="goodListData[0]?.name == 'goodList'"></GoodList>
      </view>
      <CWaterfall ref="c_waterfall_ref" :productList="productList" v-show="!skeleton_loading" :is_switch="is_switch"></CWaterfall>
      <view class='loadingicon acea-row row-center-wrapper' v-show='loading && !skeleton_loading'>
        <text class='loading iconfont icon-jiazai' v-show='loading && !skeleton_loading'></text>
      </view>
      <uv-skeletons :loading="skeleton_loading" :skeleton="list_skeleton"></uv-skeletons>
      
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import MoreNotice from "@/pagesProduct/product-details/components/mall/moreNotice.vue";
import Menu from "@/pagesProduct/product-details/components/mall/menu.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { homeApi } from "@/business/api/index.ts";
import { getProductHot } from "@/business/api/modules/store.ts";
import GoodList from "@/pagesProduct/product-details/components/home/good-list.vue";
import store from "@/business/store/modules/mall.ts";
import CWaterfall from "@/components/waterfall/index.vue";
import { getCartCounts } from "@/business/api/modules/order-new.ts";
import _ from "lodash";
import useMine from '@/business/store/modules/mine.ts';
const mine_store = useMine()
import { toLogin } from '@/infrastructure/libs/login.js';

const isLogin = computed(() => {
	return mine_store.isLogin
})

const list_skeleton = ref([
  {
    type: 'flex',
    num: 1,
    children: [{
      type: 'custom',
      num: 1,
      style: 'width:348rpx;height:348rpx;marginLeft: 20rpx;marginRight: 14rpx;border-radius: 16rpx;'
    }, {
      type: 'custom',
      num: 1,
      style: 'width:348rpx;height:348rpx;border-radius: 16rpx;'
    }]
  },
  10,
  {
    type: 'flex',
    num: 1,
    children: [{
      type: 'line',
      num: 4,
      style: ['height:80rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;', 'height:30rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;', 'height:30rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;','height:40rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;']
    },{
      type: 'line',
      num: 4,
      style: ['height:80rpx;width:348rpx;', 'height:30rpx;width:348rpx;', 'height:30rpx;width:348rpx;','height:40rpx;width:348rpx;']
    }]
  },
  10,
  {
    type: 'flex',
    num: 1,
    children: [{
      type: 'custom',
      num: 1,
      style: 'width:348rpx;height:348rpx;marginLeft: 20rpx;marginRight: 14rpx;border-radius: 16rpx;'
    }, {
      type: 'custom',
      num: 1,
      style: 'width:348rpx;height:348rpx;border-radius: 16rpx;'
    }]
  },
  10,
  {
    type: 'flex',
    num: 1,
    children: [{
      type: 'line',
      num: 4,
      style: ['height:80rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;', 'height:30rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;', 'height:30rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;','height:40rpx;width:348rpx;marginLeft: 20rpx;marginRight: 14rpx;']
    },{
      type: 'line',
      num: 4,
      style: ['height:80rpx;width:348rpx;', 'height:30rpx;width:348rpx;', 'height:30rpx;width:348rpx;','height:40rpx;width:348rpx;']
    }]
  },
])

const loading = ref(true)
const skeleton_loading = ref(false)

const styleConfig = ref([]);

const hotLoading = ref(false);

const hotTitle = ref("加载更多");

const diyId = ref(0);

const Store = store();
const recommend_switch = ref(Store.globalData["recommend_switch"] || 0);

const goodListData = computed(() => {
  return styleConfig.value.filter((item) => item.name == "goodList");
});

// 获取首页配置数据
async function diyData(id) {
  let parmas = { id: id, did: diyId.value, version: "221" };
  styleConfig.value = [];
  const res = await homeApi.getMallCommonDiy(parmas);
  let flag = setTimeout(() => {
    clearTimeout(flag);
  }, 0);
  let data = res.data.data;
  uni.setNavigationBarTitle({
    title: data?.title,
  });

  styleConfig.value = objToArr(data.value);
  styleConfig.value.forEach((item, index, arr) => {
    item.did = data.id;
    if (item.name == "pageFoot") {
      uni.setStorageSync(
        "FOOTER_BAR",
        item.status && item.status.status ? true : false
      );
      item.menuList.map((path, index) => {
        if (
          path.link === "/pagesProduct/order_addcart/order_addcart"
        ) {
          uni.setStorageSync("FOOTER_ADDCART", index);
        }
      });
      arr.splice(index, 1);
    }
    // if (recommend_switch.value == 1) get_host_product();
  });
}

// 获取我的推荐
async function get_host_product() {
  if (hotLoading.value) return;
  hotLoading.value = true;
  hotTitle.value = "";
  try {
    const res = await getProductHot(hotPage.value, hotLimit.value);
    let list = res.data.list;
  } catch (err) {}
}

// 对象转数组
function objToArr(data) {
  if (!data || typeof data !== "object") return [];
  return Object.keys(data)
    .sort()
    .map((key) => data[key]);
}

const productList = ref([]);
const productListOrigin = ref([]);

const count = ref(0);

const is_switch = ref(false);
const is_wait = ref(true)

const c_waterfall_ref = ref()

// 切换商品布局
function Changswitch(data) {
  is_switch.value = data == 0;
  productList.value = [];
  c_waterfall_ref.value.change()
  nextTick(() => {
    productList.value = productListOrigin.value
  })

}

const more_loading = ref(false);

function moreLoadingChange (status) {
  more_loading.value = status
}

// 获取商品组件数据
function changeList(data, counts) {
  console.log("counts", counts);
  if (data.length > productList.value.length) {
    productListOrigin.value = _.cloneDeep(data);
  } else {
    productList.value = [];
    c_waterfall_ref.value.change()
    productListOrigin.value = _.cloneDeep(data);
  }
  nextTick(() => {
    productList.value = data
  })
  count.value = counts;
  is_wait.value = false
}

function loadStatusChange (status) {
  loading.value = status;
}
function skeletonChange (status) {
  skeleton_loading.value = status;
}


// 滚动到底部
function loadmore() {
  if (productList.value.length < count.value) {
    if (loading.value) return;
    loading.value = true;
    uni.$emit("loadmore_bottom", { msg: "滚动到底部" });
    is_wait.value = true
  }
}

// 更新自动调价商品
uni.$on('changeAutoPro',(res)=>{
    console.log('最新价格',res)
    productList.value.forEach((item)=>{
        if(item.product_id == res.product_id){
           item.price = res.price
        }
    })
})

// 购物车统计
function getCartCountsApi(isChange) {
  getCartCounts().then((res) => {
    shop_list.value = res.data[0].count || 0;
  });
}


const windowHeight = uni.getSystemInfoSync().windowHeight;
const systemBarHeight = uni.getSystemInfoSync().statusBarHeight;

const shop_list = ref(0);

onLoad(async (options) => {
  // const { data } = await middle_login({ middle_token: 'HK4921879A04BBA147ED80C5047E3ECD5038' });
  // uni.setStorageSync("token",data.token);
  // uni.setStorageSync("LOGIN_STATUS_TOKEN",data.token);
  diyId.value = options.diyId || 0;
  diyData(0)
})

onShow(() => {
  if (isLogin.value) {
    getCartCountsApi();
  }
})

// 搜索商品
function toSearch() {
  uni.navigateTo({
    url: "/pagesProduct/columnGoods/goods_search/index?type=0",
  });
}

// 跳转购物车
function shoppingCart() {
  if (!isLogin.value) {
		toLogin()
	} else {
    uni.navigateTo({
      url: "/pagesProduct/order_addcart/order_addcart",
    });
	}
}

// 跳转客服
function toCustomerService() {
  uni.navigateTo({
    url: "/pagesProduct/customer_list/index?type=0",
  });
}
</script>
<style scoped lang="less">
.mall-container {
  display: flex;
  flex-direction: column;
  position: relative;
  .mall-home-bg {
    position: absolute;
    height: 229px;
    width: 750rpx;
  }
  .mall-title {
    position: relative;
    margin-bottom: 20rpx;
    z-index: 1;
    padding-left: 40rpx;
    .text {
      font-weight: 600;
      font-size: 30rpx;
      color: #000000;
    }
  }
  .header-top {
    position: relative;
    width: 750rpx;
    z-index: 9;

    .tab-scroll {
      width: 750rpx;
      padding-left: 24rpx;
      margin-top: 16rpx;
      .tab-list {
        display: flex;
        flex-direction: row;
        .tab-item {
          margin-right: 47rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          .tab-slide {
            width: 40rpx;
            height: 4px;
            background: #1b9aff;
            border-radius: 4rpx;
            margin-top: 3px;
          }
          .text {
            font-size: 28rpx;
            font-weight: 600;
            color: #000000;
          }
          .text-active {
            color: #1b9aff;
          }
        }
      }
    }

    .search-box {
      padding: 0px 20rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .Corner {
        border-radius: 13rpx;
        background: #fc5555;
        position: absolute;
        top: 0px;
        right: 0rpx;
        padding: 0rpx 4rpx;
        min-width: 26rpx;
        height: 26rpx;
        .text {
          font-size: 16rpx;
          color: #fff;
        }
      }
      .icon2-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 65rpx;
        height: 30px;
        position: relative;
      }

      .input {
        width: 542rpx;
        height: 64rpx;
        border-radius: 14rpx;
        background: #fff;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 0rpx 20rpx;
        margin-right: 6rpx;
        .input-box {
          font-size: 24rpx;
        }
        .input-pla {
          font-size: 24rpx;
          color: #d3d3d3;
        }
      }
      .img-ai {
        width: 40rpx;
        height: 20px;
        flex-shrink: 0;
      }
    }
  }
  /deep/.mall-content {
    position: relative;
    margin-top: 20rpx;
    z-index: 1;
    flex: 1;
    overflow-y: auto;
  }
}
</style>
