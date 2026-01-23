<template>
	<view :style="localViewColor">
		<view class='coupon-list-window animated' :class='coupon.status==true?"slideInUp":""'>
			<view class='title'>
				<view class="item">{{couponTitle}}<text class='iconfont icon-guanbi' @tap='close'></text></view>
			</view>
			<block v-if="couponArr.length">
				<view class='coupon-list'>
					<block v-for="(item,index) in couponArr" :key='index'>
						<view class='item acea-row row-center-wrapper'  :class="item.disabled ? 'disabled' : ''" @click.stop="getCouponUser(index,item)"
							>
							<!-- v-if="item.coupon.send_type == 5" -->
							<view v-if="item.coupon.send_type == 5" class='money acea-row row-column row-center-wrapper vip-coupon'>
								<view>￥<text class='num'>{{item.coupon_price}}</text></view>
								<view class="pic-num">满{{item.use_min_price}}元可用</view>
								<view class="semicircle up"></view>
								<view class="semicircle down"></view>
							</view>
							<view v-else class='money acea-row row-column row-center-wrapper'>
								<view>￥<text class='num'>{{item.coupon_price}}</text></view>
								<view class="pic-num">满{{item.use_min_price}}元可用</view>
								<view class="semicircle up"></view>
								<view class="semicircle down"></view>
							</view>
							<view class='text'>
								<view class='condition line1' style="height: 72rpx;line-height: 72rpx;">
									<span class='line-title' v-if='item.coupon.type===0'>店铺券</span>
									<span class='line-title' v-else-if='item.coupon.type===1'>商品券</span>
									<span>{{item.coupon_title}}</span>
								</view>
								<view class='data acea-row row-between-wrapper' style="height: 98rpx;">
									<view class="acea-row row-column-around" style="font-size: 24rpx;height: 100%;">
										<view>{{ timeYMD(item.start_time) }} ~ {{ timeYMD(item.end_time)}}</view>
										<view class="acea-row row-center-wrapper"
											style="align-self: flex-start;font-size: 24rpx;color: #999;"
											@click.stop="item.show=!item.show">
											<text class="iconfont"
												:class="item.show?'icon-xiangshang':'icon-xiangxia'"></text>
											<text>使用说明</text>
										</view>
									</view>
									<view class="iconfont icon-weixuanzhong" v-if="!item.checked"></view>
									<view class='iconfont icon-xuanzhong1' v-else></view>
								</view>
							</view>
						</view>
						<view v-if="item.show"
							style="width: 100%;background-color: #FFF;padding: 24rpx;margin-bottom: 24rpx;color: #999;font-size: 24rpx;">
							<view>1.满{{ item.use_min_price }}元可用</view>
							<view v-if="item.mer_id==0">
								<text>2.</text>
								<text v-if="item.coupon.type === 1">适用于平台内指定商品</text>
								<text v-if="item.coupon.type === 11">适用于平台内指定品类下商品</text>
								<text v-if="item.coupon.type === 10">适用于平台内所有商品</text>
								<text v-if="item.coupon.type === 12">适用于参与跨店活动的店铺</text>
							</view>
							<view v-else>
								<text>2.</text>
								<text v-if="item.coupon.type === 1">店铺内指定商品且商品</text>
								<text v-if="item.coupon.type === 11">店铺内指定品类下商品</text>
								<text v-if="item.coupon.type === 10">适用于店铺内所有商品</text>
								<text v-if="item.coupon.type === 0">适用于店铺内所有商品</text>
							</view>
							<view>3.店铺券与平台券混合使用，各自最多使用一张</view>
							<!-- <view>4.商品赠送共献值 {{ item.use_min_contribution || 0 }} 个以上可用</view> -->
							<view>4.优惠券使用条件之解释权完全归本平台所有</view>
						</view>
					</block>
				</view>
				<view class="foot-box">
					<view class="left">
						<!-- 已选择{{coupon_number}}张，可优惠 -->
						已选择{{ couponArr.filter(item=>item.checked).length }}张，可优惠
						<text>￥{{ couponArr.filter(item=>item.checked).reduce((acc, coupon) => acc + coupon.coupon_price, 0) }}</text>
					</view>
				</view>
				<view class="acea-row row-center-wrapper">
					<view
						style="width: 550rpx;height: 72rpx;border-radius: 36rpx;line-height: 72rpx;background-color: var(--view-bgColor);text-align: center;color: #FFF;margin-bottom: 30rpx;"
						@click='close'>
						确定
					</view>
				</view>
			</block>
			<!-- 无优惠券 -->
			<view class='pictrue' v-else>
				<image :src="`${domain}/static/images/noCoupon.png`"></image>
			</view>
		</view>
		<!-- <view class='mask' catchtouchmove="true" :hidden='coupon.status==false' @click='close'></view> -->
		<view class='mask' catchtouchmove="true" v-if='coupon.status' @click='close'></view>
	</view>
</template>
<script setup>
	import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick, defineEmits, defineProps } from "vue";
	import {
		HTTP_REQUEST_URL
	} from '@/infrastructure/config/app.js';

	import store_ from "@/business/store/modules/mall.ts";
	const Store = store_();

	const emits = defineEmits(['ChangCouponsClone', 'getCoupon'])

	const props = defineProps({
		//打开状态 0=领取优惠券,1=使用优惠券
		openType: {
			type: Number,
			default: 0,
		},
		coupon: {
			type: Object,
			default: function() {
				return {};
			}
		},
		coupon_amount: {
			type: Number
		},
		coupon_number: {
			type: Number
		},
		couponTitle: {
			type: String,
			default: '优惠券',
		}
	})

	function timeYMD(value) {
		if (value) {
			var newDate = /\d{4}-(\d{1,2}\d{1,2}-\d{1,2}\d{1,2})/g.exec(value)
			return newDate?.[0] || ''
		}
	}

	const localViewColor = computed(() => {
		return Store.localViewColor
	})

	const keyColor = computed(() => {
		return Store.keyColor
	})

	const domain = ref(HTTP_REQUEST_URL)
	const couponArr = ref([])
	const couponData = ref({})
	// 选中的数据存放
	const active = ref({})
	const allNum = ref(0)
	const allCouponNum = ref(0)
	// 选中店铺优惠券id
	const use_store_coupon = ref(0)
	// 单个店铺总价
	const pay_price = ref(0)
	// 商品有优惠订单
	const goodsOrder = ref('')

	watch(() => props.coupon, (nVal, oVal) => {
		couponArr.value = JSON.parse(JSON.stringify(nVal.coupon)).map(item => {
			item['show'] = false
			return item
		})
	},{
		immediate: true,
		deep: true
	})

	onMounted(() => {
		couponData.value = props.coupon
		// 深拷贝数据 不影响原来数据使用
		couponArr.value = JSON.parse(JSON.stringify(props.coupon.coupon)).map(item => {
			item['show'] = false
			return item
		})
		// 深拷贝数据 不影响原来数据使用
		// goodsOrder.value = JSON.parse(JSON.stringify(coupon.value.order))
		let tempObj = active.value[this.couponData.mer_id] = {}
		tempObj.product = []
		tempObj.store = ''
	})

	function close() {
		emits('ChangCouponsClone');
	}

	// 使用优惠券
	function getCouponUser(index, item) {
		emits('getCoupon', item);
	}
</script>

<style scoped lang="scss">
	.animated {
		animation-duration: .3s
	}

	.title {
		display: flex;

		.item {
			position: relative;
			flex: 1;
			font-size: 28rpx;
			color: #999999;

			&::after {
				content: ' ';
				position: absolute;
				left: 50%;
				bottom: 18rpx;
				width: 50rpx;
				height: 5rpx;
				background: transparent;
				border-radius: 3px;
				transform: translateX(-50%);
			}

			&.on {
				color: #282828;

				&::after {
					background: var(--view-theme);
				}
			}

		}
	}

	.coupon-list {
		padding: 30rpx;

		.item {
			// box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
			box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.06);
			border-radius: 32rpx;
			.money {
				background-color: var(--view-bgColor);
				border-radius: 32rpx 0 0 32rpx;
				position: relative;
				&.vip-coupon {
					background-image: unset;
					background-color: #e1bb71;
				}
				.semicircle {
					position: absolute;
					width: 40rpx;
					height: 20rpx;
					border-radius: 0 0 20rpx 20rpx;
					background-color: #F3F8FB;
					z-index: 2;
					&.up {
						border-radius: 0 0 20rpx 20rpx;
						right: -20rpx;
						top: 0;
					}
					&.down {
						border-radius: 20rpx 20rpx 0 0;
						right: -20rpx;
						bottom: 0;
					}
				}
			}
			.text {
				border-radius: 0 32rpx 32rpx 0;
			}
			&.disabled {
				pointer-events: none;
				opacity: .6;

				.iconfont {
					background-color: #eee;
					border-radius: 100%;
				}
			}
		}
	}

	.coupon-list-window {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx 16rpx 0 0;
		z-index: 555;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
	}

	.coupon-list-window.on {
		animation: aminup;
	}

	.coupon-list-window .title {
		height: 106rpx;
		width: 100%;
		text-align: center;
		line-height: 106rpx;
		font-size: 32rpx;
		font-weight: bold;
		position: relative;
	}

	.coupon-list-window .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 35rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.coupon-list-window .coupon-list {
		margin: 0 0 0rpx 0;
		height: 550rpx;
		overflow: auto;
	}

	.coupon-list-window .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 0 auto 50rpx auto;
	}

	.coupon-list-window .pictrue image {
		width: 100%;
		height: 100%;
	}

	.pic-num {
		color: #fff;
		font-size: 24rpx;
	}

	.line-title {
		width: 90rpx;
		padding: 0 10rpx;
		box-sizing: border-box;
		background: rgba(255, 247, 247, 1);
		border: 1px solid var(--view-theme);
		opacity: 1;
		border-radius: 20rpx;
		font-size: 20rpx;
		color: var(--view-theme);
		margin-right: 12rpx;
	}

	.line-title.gray {
		border-color: #BBB;
		color: #bbb;
		background-color: #F5F5F5;
	}

	.foot-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		padding: 0 30rpx;
		border-top: 1px solid #F5F5F5;

		.btn {
			width: 240rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			background: var(--view-theme);
			border-radius: 35rpx;
			color: #fff;
			font-size: 30rpx;
		}

		.left {
			text {
				color: var(--view-priceColor);
			}
		}
	}

	.coupon-list .item .text .data .iconfont {
		font-size: 36rpx;

		&.icon-weixuanzhong {
			color: #BFBFBF;
		}

		&.icon-xuanzhong1 {
			color: var(--view-theme);
			;
		}
	}
</style>