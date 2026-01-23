<template>
	<view class='recommend'>
		<view class="common-hd">
			<view class="title" :style="{ 'background-image': `url(${domain}/static/images/index-title.png)`}">为你推荐</view>
		</view>
		<view class='recommendList' :class="indexP?'on':''">
			<!-- <WaterfallsFlow :wfList='hostProduct' @itemTap="goDetail" :type="0" /> -->
		</view>
	</view>
</template>

<script lang="js" setup>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	// import {mapGetters} from "vuex";
	import { goShopDetail } from '@/infrastructure/libs/order.js'
	import {initiateAssistApi} from '@/business/api/modules/activity.ts';
	import {toLogin} from '@/infrastructure/libs/login.js';
	// import WaterfallsFlow from '@/packages/mall/views/components/WaterfallsFlow/WaterfallsFlow.vue'
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
	import { onPullDownRefresh } from "@dcloudio/uni-app";
	import store from '@/business/store/modules/mall.ts';
	const Store = store()
	
	const props = defineProps({
		hostProduct: {
			type: Array,
			default: function() {
				return [];
			}
		},
		indexP:{
			type: Boolean,
			default: false
		},
		isLogin:{
			type: Boolean,
			default: false
		}
	})
	const domain = ref(HTTP_REQUEST_URL);
	
	onPullDownRefresh(() => {
		// 模拟上拉刷新
		setTimeout(()=>{
			const newList = props.hostProduct.reverse();
			props.hostProduct = newList;
			uni.stopPullDownRefresh();
		},500)
	})
	
	function goDetail(item){
		goShopDetail(item, Store.uid).then(res => {
		if (props.isLogin) {
				initiateAssistApi(item.activity_id).then(res => {
					let id = res.data.product_assist_set_id;
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/activity/assist_detail/index?id=' + id
					});		
				}).catch((err) => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			} else {
				toLogin();	
			}
		})
	}
	
</script>

<style scoped lang="scss">
	.common-hd {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 118rpx;
		.title {
			padding: 0 80rpx;
			font-size: 34rpx;
			color: $theme-color;
			font-weight: bold;
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: left center;
		}
	}
	.recommend .recommendList {
		padding: 0 20rpx;
		min-height: 100rpx;
	}
	.recommend .recommendList.on{
		padding: 0;
	}
	// /deep/.looming-gray{
	// 	border-radius: 16rpx 16rpx 0 0;
	// }
</style>
