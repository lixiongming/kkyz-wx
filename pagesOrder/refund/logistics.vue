<template>
	<view>
		<view class='logistics'>
			<view class='logisticsCon'>
				<view class='company acea-row row-between-wrapper'>
					<view class='picTxt acea-row row-between-wrapper'>
						<view class='iconfont icon-wuliu'></view>
						<view class='text'>
							<view><text class='name line1'>物流公司：</text> {{order_info.delivery_type}}</view>
							<view class='express line1'><text class='name'>快递单号：</text> {{order_info.delivery_id}}</view>
						</view>
					</view>
					<!-- #ifndef H5 -->
					<view class='copy' @tap='copyOrderId'>复制单号</view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class='copy copy-data' :data-clipboard-text="order_info.delivery_id">复制单号</view>
					<!-- #endif -->
				</view>
				<view class='item' v-for="(item,index) in express_list" :key="index">
					<view class='circular' :class='index === 0 ? "on":""'></view>
					<view class='text' :class='index===0 ? "on-font on":""'>
						<view>{{item.status}}</view>
						<view class='data' :class='index===0 ? "on-font on":""'>{{item.time}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	import { refundExpressApi } from '@/business/api/modules/order';
	import { toLogin } from '@/infrastructure/libs/login.js';

	const order_id = ref('')
	const order_info = ref({})
	const express_list = ref([])


	onLoad((options) => {
		if (!options.orderId) return util.Tips({title:'缺少订单号'});
			order_id.value = options.orderId;
			let is_login = uni.getStorageSync('isLogin')
			if (is_login) {
				getExpress();
			} else {
				toLogin()
			}
	})

	function copyOrderId(){
		uni.setClipboardData({ data: order_info.value.delivery_id });
	}

	function getExpress(){
		refundExpressApi({ refund_order_id: order_id.value }).then(function(res){
			express_list.value = res.data.express || [];
			order_info.value = res.data.refund;
		});
	}
</script>

<style scoped lang="scss">
	.logistics .header {
		padding: 23rpx 30rpx;
		background-color: #fff;
		height: 166rpx;
		box-sizing: border-box;
	}

	.logistics .header .pictrue {
		width: 120rpx;
		height: 120rpx;
	}

	.logistics .header .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.logistics .header .text {
		width: 540rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 6rpx;
	}

	.logistics .header .text .name {
		width: 365rpx;
		color: #282828;
	}

	.logistics .header .text .money {
		text-align: right;
	}

	.logistics .logisticsCon {
		background-color: #fff;
		margin: 12rpx 0;
	}

	.logistics .logisticsCon .company {
		height: 120rpx;
		margin: 0 0 45rpx 30rpx;
		padding-right: 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.logistics .logisticsCon .company .picTxt {
		width: 520rpx;
	}

	.logistics .logisticsCon .company .picTxt .iconfont {
		width: 50rpx;
		height: 50rpx;
		background-color: #666;
		text-align: center;
		line-height: 50rpx;
		color: #fff;
		font-size: 35rpx;
	}

	.logistics .logisticsCon .company .picTxt .text {
		width: 450rpx;
		font-size: 26rpx;
		color: #282828;
	}

	.logistics .logisticsCon .company .picTxt .text .name {
		color: #999;
	}

	.logistics .logisticsCon .company .picTxt .text .express {
		margin-top: 5rpx;
	}

	.logistics .logisticsCon .company .copy {
		font-size: 20rpx;
		width: 120rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 3rpx;
		border: 1px solid #999;
	}

	.logistics .logisticsCon .item {
		padding: 0 40rpx;
		position: relative;
	}

	.logistics .logisticsCon .item .circular {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		position: absolute;
		top: -1rpx;
		left: 31.5rpx;
		background-color: #ddd;
	}

	.logistics .logisticsCon .item .circular.on {
		background-color: #e93323;
	}

	.logistics .logisticsCon .item .text.on-font {
		color: #e93323;
	}

	.logistics .logisticsCon .item .text .data.on-font {
		color: #e93323;
	}

	.logistics .logisticsCon .item .text {
		font-size: 26rpx;
		color: #666;
		width: 615rpx;
		border-left: 1rpx solid #e6e6e6;
		padding: 0 0 60rpx 38rpx;
	}

	.logistics .logisticsCon .item .text.on {
		border-left-color: #f8c1bd;
	}

	.logistics .logisticsCon .item .text .data {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.logistics .logisticsCon .item .text .data .time {
		margin-left: 15rpx;
	}
</style>
