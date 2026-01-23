<template>
	<view class="refund-select" :style="mall_store.viewColor">
		<view class="select-item" @click="goPage(1)">
			<view class="left">
				<image :src="domain+'/static/diy/select01'+mall_store.keyColor+'.png'" mode=""></image>
			</view>
			<view class="right-wrapper">
				<view class="title">我要退款(无需退货)</view>
				<view class="txt">未收到货，或与卖家协商同意不退货只退款</view>
			</view>
			<view class="iconfont icon-xiangyou"></view>
		</view>
		<view class="select-item" @click="goPage(2)" v-if="!is_to_be_shipped">
			<view class="left">
				<image :src="domain+'/static/diy/select02'+mall_store.keyColor+'.png'" mode=""></image>
			</view>
			<view class="right-wrapper">
				<view class="title">{{order_type != 2 ? '我要退货退款' : '我要退款'}}</view>
				<view class="txt" v-if="order_type != 2">已收到货，需要退还收到的货物</view>
			</view>
			<view class="iconfont icon-xiangyou"></view>
		</view>
	</view>
</template>

<script lang="js" setup>
	import { ref } from 'vue'
	import { onLoad } from "@dcloudio/uni-app";
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app';
	import store from '@/business/store/modules/mall';
	const mall_store = store()
	
	const domain = ref(HTTP_REQUEST_URL)
	const order_id = ref('')
	const type = ref(0)
	const ids = ref('')
	const order_type = ref(0)
	// 是否是待发货状态(如果是待发货状态只有退款选项)
	const is_to_be_shipped = ref(false);
	
	onLoad((options) => {
		order_id.value = options.order_id
		type.value = options.type
		ids.value = options.ids || ''
		order_type.value = options.order_type
		is_to_be_shipped.value = options.is_to_be_shipped

	})
	
	function goPage(cur_type){
		uni.redirectTo({
			url:`/pagesOrder/refund/confirm?refund_type=${cur_type}&type=${2}&order_id=${order_id.value}`
		})
	}
	
	
</script>

<style lang="scss">
.refund-select{
	.select-item{
		position: relative;
		display: flex;
		align-items: center;
		padding: 25rpx 0;
		background-color: #fff;
		border-bottom: 1px solid #f0f0f0;
	}
	.left{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 105rpx;
		image{
			width:50rpx;
			height: 46rpx;
		}
	}
	.right-wrapper{
		position: relative;
		.title{
			font-size: 26rpx;
			color: #282828;
		}
		.txt{
			margin-top: 10rpx;
			color: #999999;
			font-size: 22rpx;
		}
	}
	.icon-xiangyou{
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		color: #AAAAAA;
		font-size: 30rpx;
	}
}
</style>
