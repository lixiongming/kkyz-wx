<template>
  <view class="collection-count" :style="{ height: hei + 'px' }">
    <view class="header">
      <view class="u-tab">
        <u-tabs
          :list="type_list"
          :activeStyle="{color:'rgb(60, 156, 255)'}"
          :itemStyle="{ width: '250rpx', height: '44px' }"
          @click="changeType"
        ></u-tabs>
      </view>
    </view>
    <scroll-view
      :scroll-y="true"
      class="scroll-view"
      :show-scrollbar="false"
      @scrolltolower="scrolltolower"
      v-if="product_list.items.length > 0"
    >
      <!-- 收藏商品组件 -->
      <listLtem
        v-for="(item, index) in product_list.items"
        :tab_index="tab_index"
        :key="index"
        :list="item"
      >
        <template #btn>
          <view class="btn" @click.stop="Unfollow(item)"
            ><text class="text">取消收藏</text></view
          >
        </template>
      </listLtem>
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
import listLtem from "../components/list-item.vue";
import uerStore from "/business/store/modules/home.ts";
const store = uerStore();
let hei = uni.getSystemInfoSync().windowHeight;
const is_loading = ref(false);
const type_list = [
  { name: "商品", id: 1 },
  { name: "视频", id: 2 },
];
const params_product = ref({
  page: 1,
  pageSize: 10,
});
const tab_index = ref(0);
const product_list = ref({ items: [], pageInfo: {} });
// 切换类型
function changeType(e) {
  console.log(e);
  tab_index.value = e.index;
  initProductList();
}

// 滚动到底部
function scrolltolower() {
  if (product_list.value.items.length >= product_list.value.pageInfo.total) return;
  params_product.value.page += 1;
  if (tab_index.value == 0) {
    getProductList();
  } else {
    getVideoList();
  }
}

// 获取商品收藏列表
async function getProductList() {
  try {
    is_loading.value = true;
    const { data } = await mineApi.getRelationListApi(params_product.value);
    product_list.value.items = product_list.value.items.concat(data.items);
    product_list.value.pageInfo = data.pageInfo;
    is_loading.value = false;
  } catch (err) {
    is_loading.value = false;
  }
}

// 初始化商品列表
function initProductList() {
  params_product.value.page = 1;
  product_list.value = { items: [], pageInfo: {} };
  if (tab_index.value == 0) {
    getProductList();
  } else {
    getVideoList();
  }
}

// 取消收藏商品
async function Unfollow({ type, type_id, post_id }) {
  if (tab_index.value == 1) {
    store.favoriteApi({ id: post_id }).then((res) => {
      initProductList();
      uni.$emit('Unfollow-video',post_id)
    });
  } else {
    try {
      await mineApi.relationCancelApi({ type, type_id });
      uni.showToast({
        title: "取消成功",
        icon: "none",
        duration: 2000,
      });
    
      initProductList();
    } catch (err) {
      console.log(err);
    }
  }
}
// 获取收藏视频列表
async function getVideoList() {
  try {
    is_loading.value = true;
    const { data } = await mineApi.favoriteVideosApi(params_product.value);
    product_list.value.items = product_list.value.items.concat(data.items);
    product_list.value.pageInfo = data.pageInfo;
    is_loading.value = false;
  } catch (err) {
    is_loading.value = false;
  }
}

onLoad(() => {
  getProductList();
});
onShow(() => {
  if (tab_index.value == 1) {
    initProductList();
  }
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
