<template>
	<view>
		<view class="payment" :class="pay_close ? 'on' : ''">
			<view class="title acea-row row-center-wrapper">
				选择付款方式<text class="iconfont icon-guanbi" @click='close'></text>
			</view>
			<view class="item acea-row row-between-wrapper" @click='goPay(item.number || 0 , item.value)'
				v-for="(item,index) in payMode.filter(item=>item.payStatus == 1)" :key="index">
				<view class="left acea-row row-between-wrapper">
					<view class="iconfont" :class="item.icon"></view>
					<view class="text">
						<view class="name">{{item.name}}</view>
						<view class="info" v-if="item.number">
							{{item.title}} <span class="money">￥{{ item.number }}</span>
						</view>
						<view class="info" v-else>{{item.title}}</view>
					</view>
				</view>
				<view class="iconfont icon-xiangyou"></view>
			</view>
		</view>
		<view class="mall-mask" style="z-index: 100;" ref="close" @click='close' v-if="pay_close"></view>
	</view>
</template>

<script lang="js" setup>
	import { ref, onMounted, computed, defineProps, defineEmits } from 'vue'
	import {
		orderPay,
		integralOrderPay,
		presellOrderPay
	} from '@/business/api/modules/order';
	import util from '@/infrastructure/utils/utils'
	import { toCoupon } from '@/infrastructure/utils/util'
	import { getMiddleToken } from "@/infrastructure/utils/login.js";
	import { orderChannelInfoApi } from '@/business/api/modules/order';
	const props = defineProps({
		payMode: {
			type: Array,
			default: function() {
				return [];
			}
		},
		pay_close: {
			type: Boolean,
			default: false,
		},
		order_id: {
			type: String,
			default: ''
		},
		totalPrice: {
			type: String,
			default: '0'
		},
		order_type: {
			type: Number,
			default: 0,
		},
		isCall: {
			type: Boolean,
			default: false
		},
		returnUrl: {
			type: String,
			default: ''
		},
		origin: {
			type: String,
			default: ''
		},
		is_stage: {
			type: Boolean,
			default: false
		},
	})
	const emits = defineEmits(['onChangeFun'])

	function close() {
		emits('onChangeFun', {
			action: 'payClose'
		});
	}
	async function goPay(number, paytype) {
		if (props.isCall) {
			return emits('onChangeFun', {
				action: 'payCheck',
				value: paytype
			});
		}
		if (!props.order_id) return util.Tips({
			title: '请选择要支付的订单'
		});
		if (paytype == 'balance' && parseFloat(number) < parseFloat(props.totalPrice)) return util.Tips({
			title: '余额不足！'
		});
		// uni.showLoading({
		// 	title: '支付中'
		// });
		// let orderApi = props.order_type === 1 ? presellOrderPay : props.order_type === 2 ? integralOrderPay :
		// 	orderPay
		// let welfare_post_id = uni.getStorageSync('welfare_post_id')

		let result = await orderChannelInfoApi({
			id: props.order_id,
			type: paytype
		})
		let mini_appid = result.data.result && result.data.result.mini_appid ? result.data.result.mini_appid : 'wx29df62cbac3abc9a';
		const [code, middleToken] = await getMiddleToken();
		uni.setStorageSync('middle_token', middleToken);
		if (mini_appid != 'wx29df62cbac3abc9a') {
			// const middle_token = uni.getStorageSync("middle_token");
			uni.navigateToMiniProgram({
				appId: mini_appid,
				path: 'pages/users/order_details/index',
				extraData: {
					middle_token: middleToken,
					order_id: props.order_id
				},
				envVersion: 'trial',
				success(res) {},
				fail(err) {}
			})
		} else {
			// const middle_token_ = uni.getStorageSync("middle_token");
			uni.navigateTo({
				url: `/pages/users/order_details/index?middle_token=${middleToken}&order_id=${props.order_id}`
			})
		}
		close()
		// orderApi({
		// 	id: props.order_id,
		// 	type: type
		// }).then(async (res) => {
		// 	let status = res.data.status,
		// 		orderId = res.data.result.order_id,
		// 		jsConfig = res.data.result.config,
		// 		callback_key = res.data.result.pay_key,
		// 		goPages = props.returnUrl ? props.returnUrl : props.is_stage ? `/packages/mall/views/pages/users/post-station/purchase` : '/pagesOrder/order-list/index';

		// 		let order_pay_status_url = props.is_stage ? '/packages/mall/views/pages/order_pay_status/index_stage' : '/packages/mall/views/pages/order_pay_status/index';
		// 		let order_pay_back_url = props.is_stage ? '/packages/mall/views/pages/order_pay_back/adapay_back_stage' : '/packages/mall/views/pages/order_pay_back/adapay_back';

		// 	switch (status) {
		// 		case 'joinpayWxLite':
		// 			let jsConfig = JSON.parse(res.data.result.config.payInfo)
		// 			let { timeStamp,nonceStr,signType,paySign } = jsConfig
		// 			uni.hideLoading()
		// 			uni.requestPayment({
		// 			    provider: 'wxpay',
		// 			    timeStamp,
		// 			    nonceStr,
		// 			    signType,
		// 			    paySign,
		// 			    package: jsConfig.package,
		// 			    success: (e) => {
		// 			        uni.redirectTo({
		// 						url: `/pagesProduct/payResult/index?orderId=${orderId}`
		// 					})
		// 			    },
		// 			    fail: (e) => {
		// 					uni.redirectTo({
		// 						url: `/pagesProduct/payResult/index?orderId=${orderId}`
		// 					})
		// 			    },
		// 			    complete: () => {
		// 					uni.hideLoading()
		// 				}
		// 			});
					
		// 			break;
		// 		case 'ORDER_EXIST':
		// 		case 'EXTEND_ORDER':
		// 		case 'PAY_ERROR':
		// 		case 'error':
		// 			return util.Tips({
		// 				title: res.message
		// 			}, {
		// 				tab: 5,
		// 				url: '/pagesOrder/order-list/index?status=0'
		// 			});
		// 	}
		// }).catch(err => {
		// 	uni.hideLoading();
		// 	return util.Tips({
		// 		title: err
		// 	});
		// })
	}
	
</script>

<style scoped lang="scss">
	.payment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		max-height: 1200rpx;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 60rpx;
		z-index: 101;
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		transform: translate3d(0, 100%, 0);
	}

	.payment.on {
		transform: translate3d(0, 0, 0);
	}

	.payment .title {
		text-align: center;
		height: 123rpx;
		font-size: 32rpx;
		color: #282828;
		font-weight: bold;
		padding-right: 30rpx;
		margin-left: 30rpx;
		position: relative;
		border-bottom: 1px solid #eee;
	}

	.payment .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 43rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.payment .item {
		border-bottom: 1px solid #eee;
		height: 130rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
	}

	.payment .item .left {
		width: 610rpx;
	}

	.payment .item .left .text {
		width: 540rpx;
	}

	.payment .item .left .text .name {
		font-size: 32rpx;
		color: #282828;
	}

	.payment .item .left .text .info {
		font-size: 24rpx;
		color: #999;
	}

	.payment .item .left .text .info .money {
		color: #ff9900;
	}

	.payment .item .left .iconfont {
		font-size: 45rpx;
		color: #09bb07;
	}

	.icon-icon34 {
		color: #00aaea !important;
	}

	.payment .item .left .iconfont.icon-zhifubao {
		color: #00aaea;
	}

	.payment .item .left .iconfont.icon-yuezhifu {
		color: #ff9900;
	}

	.payment .item .left .iconfont.icon-yuezhifu1 {
		color: #eb6623;
	}

	.payment .item .iconfont {
		font-size: 0.3rpx;
		color: #999;
	}
</style>