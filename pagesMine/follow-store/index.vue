<template>
  <view class="collection-count" :style="{ height: hei + 'px' }">
    <scroll-view
      :scroll-y="true"
      class="scroll-view"
      :show-scrollbar="false"
      @scrolltolower="scrolltolower"
      v-if="product_list.items.length > 0"
    >
      <!-- 收藏商品组件 -->
      <storeLtem v-for="(item, index) in product_list.items" :key="index" :list="item">
        <template #btn>
          <view class="btn" @click.stop="Unfollow(item)"
            ><text class="text">取消关注</text></view
          >
        </template>
      </storeLtem>
      <uni-load-more
        status="loading"
        iconType="circle"
        color="#007AFF"
        v-if="is_loading && product_list.items.length > 0"
      ></uni-load-more>
      <view
        class="text-null"
        v-if="
          product_list.items.length > 0 &&
          product_list.items.length == product_list.pageInfo.total &&
          product_list.items.length > 6
        "
        ><text class="text">暂无更多内容~</text></view
      >
    </scroll-view>
    <c-null v-else></c-null>
  </view>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
  defineAsyncComponent,
  nextTick,
  defineProps,
  defineEmits,
} from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onInit,
  onHide,
  onUnload,
  onReachBottom,
  onPageScroll,
} from "@dcloudio/uni-app";
import { mineApi } from "@/business/api/index.ts";
import storeLtem from "../components/store-item.vue";
import uerStore from "/business/store/modules/home.ts";
const store = uerStore();
let hei = uni.getSystemInfoSync().windowHeight;
const is_loading = ref(false);
const params_product = ref({
  page: 1,
  pageSize: 10,
});

const product_list = ref({ items: [], pageInfo: {} });

// 滚动到底部
function scrolltolower() {
  if (product_list.value.items.length >= product_list.value.pageInfo.total) return;
  params_product.value.page += 1;
  getMerchantist();
}

// 获取关注店铺
async function getMerchantist() {
  try {
    is_loading.value = true;
    const { data } = await mineApi.getMerchantListApi(params_product.value);
    product_list.value.items = product_list.value.items.concat(data.items);
    product_list.value.pageInfo = data.pageInfo;
    is_loading.value = false;
  } catch (err) {
    is_loading.value = false;
  }
}

// 初始化关注店铺列表
function initProductList() {
  params_product.value.page = 1;
  product_list.value = { items: [], pageInfo: {} };
  getMerchantist();
}

// 取消关注
async function Unfollow({ type, type_id, post_id, merchant }) {
  try {
    await mineApi.relationCancelApi({ type, type_id });
    uni.showToast({
      title: "取消成功",
      icon: "none",
      duration: 2000,
    });
    initProductList();
    uni.$emit("Cancel_store_subscription", merchant.mer_id);
  } catch (err) {
    console.log(err);
  }
}
onLoad(() => {
  getMerchantist();
});
</script>

<style scoped lang="scss">
.text-null {
  width: 750rpx;
  display: flex;
  justify-content: center;
  margin: 40rpx 0rpx;
  height: 100rpx;
  .text {
    color: #a5a5a5;
  }
}
.collection-count {
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  overflow: hidden;
  .scroll-view {
    flex: 1;
    overflow: auto;
    margin-top: 20rpx;
    .btn {
      width: 140rpx;
      height: 60rpx;
      border: 2rpx solid #d3d3d3;
      border-radius: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .text {
        font-size: 28rpx;
        color: #000000;
      }
    }
  }
  .header {
    width: 750rpx;
    height: 44px;
    background: #fff;
    .u-tab {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
