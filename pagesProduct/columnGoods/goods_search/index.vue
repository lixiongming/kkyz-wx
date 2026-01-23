<template>
	<view :style="localViewColor">
		<!-- 背景 -->
		<view class="add_page_bg" ></view>
		<view class='searchGood' :style="{'paddingTop':header_padding+'px'}">
			<view class='search acea-row row-middle'>
				<view class="iconfont icon-xiangzuo" @click="back"></view>
				<view class='input acea-row row-middle'>
					<text class='iconfont icon-xiazai5'></text>
					<input type='text' :value='searchValue' :focus="focus" placeholder='点击搜索商品、店铺名称' placeholder-class='placeholder'
					 @input="setValue" @confirm="searchBut"></input>
				</view>
				<!-- <view class='bnt' @tap='searchBut'>搜索</view> -->
				<view></view>
			</view>
			<view class='title'>历史记录 <text class="iconfont icon-shanchu" @click="remove"></text></view>
			<view class='list acea-row' :style="{'height':historyBox?'auto':'150rpx'}" v-if="historyList.length > 0">
				<block v-for="(item,index) in historyList" :key="index">
					<view class='item line1' @tap='setHotSearchValue(item,0)'>{{item}}</view>
				</block>
			</view>
			<view>
				<view class="more-btn" v-if="historyList.length>9 && !historyBox" @click="historyBox = true">
					展开全部<text class="iconfont icon-xiangxia"></text>
				</view>
				<view class="more-btn" v-if="historyList.length>9 && historyBox" @click="historyBox = false">
					收起<text class="iconfont icon-xiangshang"></text>
				</view>
			</view>
			<view v-if="historyList.length == 0" style="text-align: center; color: #999;">暂无搜索历史~</view>
			<view class='title'>热门搜索</view>
			<view class='list acea-row' :style="{'height': hotSearchBox?'auto':'150rpx'}">
				<block v-for="(item,index) in hotSearchList" :key="index">
					<view class='item line1' @tap='setHotSearchValue(item,1)'>{{item.keyword}}</view>
				</block>
			</view>
			<view>
				<view class="more-btn" v-if="hotSearchList.length>8 && !hotSearchBox" @click="hotSearchBox = true">
					展开全部<text class="iconfont icon-xiangxia"></text>
				</view>
				<view class="more-btn" v-if="hotSearchList.length>8 && hotSearchBox" @click="hotSearchBox = false">
					收起<text class="iconfont icon-xiangshang"></text>
				</view>
			</view>
		</view>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
	</view>
</template>
<script setup>
import { copyPasswordSearch } from '@/business/api/modules/store-old.ts';
import { getSearchKeyword } from '@/business/api/modules/store.ts';
import shareScence from '@/infrastructure/libs/spread.js';
import { silenceBindingSpread } from '@/infrastructure/utils/mall.js';
import { goShopDetail } from '@/infrastructure/libs/order.js';
import { initiateAssistApi } from '@/business/api/modules/activity.ts';
import { ref, computed } from 'vue';
import { onLoad, onShow, onReady, onInit, onHide, onUnload,onReachBottom } from "@dcloudio/uni-app";

// #ifndef H5
import passwordPopup from '@/components/passwordPopup';
// #endif
import { toLogin } from '@/infrastructure/libs/login.js';
import store from '@/business/store/modules/mall.ts';

const Store = store();
const isLogin = computed(() => Store.isLogin);
const uid = computed(() => Store.uid);
const localViewColor = computed(() => Store.localViewColor);

// Data
const hostProduct = ref([]);
const searchValue = ref('');
const focus = ref(true);
const bastList = ref([]);
const hotSearchList = ref([]);
const first = ref(0);
const limit = ref(8);
const page = ref(1);
const loading = ref(false);
const loadend = ref(false);
const loadTitle = ref('加载更多');
const hotPage = ref(1);
const isScroll = ref(true);
const historyList = ref([]);
const tempStorage = ref([]);
const historyBox = ref(false);
const hotSearchBox = ref(false);
const header_padding = ref(uni.getSystemInfoSync().statusBarHeight)
// Lifecycle Hooks
onLoad((options) => {
  searchValue.value = options.searchVal || '';
});

onShow(() => {
  try {
    historyList.value = [];
    tempStorage.value = [];
    let arr = uni.getStorageSync('historyList');
    if (arr.length > 0) {
      historyList.value = arr;
    } else {
      historyList.value = [];
    }

    tempStorage.value = historyList.value;
  } catch (e) {}
  getRoutineHotSearch();
});

// Methods
const remove = () => {
  uni.showModal({
    title: '提示',
    content: '确认删除全部历史搜索记录？',
    success: function(res) {
      if (res.confirm) {
        tempStorage.value = [];
        try {
          uni.setStorageSync('historyList', tempStorage.value);
          historyList.value = [];
        } catch (e) {}
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    }
  });
};

const getRoutineHotSearch = () => {
  getSearchKeyword().then(res => {
    hotSearchList.value = res.data;
  });
};

const setHotSearchValue = (event, key) => {
  focus.value = false;
  if (key) {
    searchValue.value = event.keyword;
  } else {
    searchValue.value = event;
  }
  
  setTimeout(() => {
    focus.value = true;
  });
  
  searchBut();
};

const setValue = (event) => {
  searchValue.value = event.detail.value;
};

const searchBut = () => {
  if(/^(\/@[1-9]{1}).*\*\//.test(searchValue.value)){
    uni.showLoading({
      title: '加载中',
      mask: true
    });
    copyPasswordSearch({key: searchValue.value}).then(res => {
      uni.hideLoading();
      let item = res.data;
      console.log(res.data.user.user_code,123);
      shareScence(res.data.user.uid, isLogin.value);
      uni.setStorageSync("ShareCode", res.data.user.user_code);
      //#ifdef H5
      isLogin.value && silenceBindingSpread();
      //#endif
      console.log(res,'进入搜索');
      goShopDetail(item, uid.value).then(res => {
        if (isLogin.value) {
          initiateAssistApi(item.activity_id)
            .then(res => {
              let id = res.data.product_assist_set_id;
              uni.hideLoading();
              uni.navigateTo({
                url: '/packages/mall/views/pages/activity/assist_detail/index?id=' + id
              });
            })
            .catch(err => {
              uni.showToast({
                title: err,
                icon: 'none'
              });
            });
        } else {
          toLogin();
        }
      });
    }).catch(err => {
      uni.showToast({
        title: err,
        icon: 'none'
      });
      searchValue.value = "";
    });
  } else {
    let status = false;
    tempStorage.value.forEach((el, index) => {
      if (el == searchValue.value) {
        status = true;
      }
    });
    
    if (!status && searchValue.value) {
      tempStorage.value.unshift(searchValue.value);
    }
    
    try {
      uni.setStorageSync('historyList', tempStorage.value);
    } catch (e) {}

    uni.navigateTo({
      url: '/pagesProduct/columnGoods/goods_search_con/index?searchValue=' + searchValue.value
    });
  }
};

const back = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss">
	.searchGood {
		background: #fff;
		position: relative;
		z-index: 2;
		padding-bottom: 48rpx;
	}
	.searchGood .search {
		padding: 20rpx 32rpx 0;
	}
	.searchGood .search {
		// margin-top: 20rpx;
		display: flex;
		// justify-content: space-between;
	}
	.searchGood .search .input {
		// width: 598rpx;
		width: 468rpx;
		background-color: #F5F6F6;
		border-radius: 33rpx;
		padding: 0 35rpx;
		box-sizing: border-box;
		height: 66rpx;
		margin-left: 20rpx;
	}
	.searchGood .search .input input {
		// width: 472rpx;
		// width: 392rpx;
		flex: 1;
		margin-left: 10rpx;
		font-size: 28rpx;
	}
	.searchGood .search .input .placeholder {
		font-size: 24rpx;
		color: #bbb;
	}
	.searchGood .search .input .iconfont {
		color: var(--view-noSelectColor);
		font-size: 35rpx;
	}
	.searchGood .search .icon-xiangzuo {
		color: var(--view-theme);
	}
	.searchGood .search .bnt {
		// width: 120rpx;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: var(--view-theme);
	}
	.searchGood .title {
		position: relative;
		font-size: 24rpx;
		color: var(--view-noSelectColor);
		margin: 50rpx 30rpx 25rpx 30rpx;
		.icon-shanchu {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			color: var(--view-noSelectColor);
			font-size: 28rpx;
		}
	}
	.searchGood .list {
		padding: 0 10rpx;
		overflow: hidden;
	}
	.searchGood .list .item {
		font-size: 24rpx;
		color: var(--view-theme);
		padding: 0 32rpx;
		height: 56rpx;
		line-height: 56rpx;
		// background: rgba(242, 242, 242, 1);
		border: 2rpx solid #DDD;
		border-radius: 28rpx;
		
		margin: 0 0 20rpx 20rpx;
		max-width: 184rpx;
	}
	.searchGood .line {
		border-bottom: 1rpx solid #eee;
		margin: 20rpx 30rpx 0 30rpx;
	}
	.more-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 0 20rpx 20rpx;
		height: 60rpx;
		font-size: 24rpx;
		color: #999;
		.iconfont {
			font-size: 22rpx;
			margin-left: 10rpx;
		}
	}
</style>
