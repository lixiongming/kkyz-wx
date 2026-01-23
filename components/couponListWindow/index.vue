<template>
	<view :style="Store.localViewColor">
		<view class='coupon-list-window animated' :class='coupon.coupon==true?"slideInUp":""'>
			<view class='title'>
				<view class="item">优惠券<text class='iconfont icon-guanbi' @tap='close'></text></view>
			</view>
			<view class='coupon-list' v-if="coupon.list.length">
				<view class='item acea-row row-center-wrapper' :style="item.show?'margin-bottom:180rpx;':''" v-for="(item,index) in couponArr" @click="getCouponUser(index,item)"
				 :key='index'>
					<view class='money acea-row row-column row-center-wrapper coupon_num_box' :class="{'received-active':item.issue}" >
						<view>￥<text class='num'>{{item.coupon_price}}</text></view>
						<view class="pic-num">满{{item.use_min_price}}元可用</view>
						<view class="semicircle up"></view>
						<view class="semicircle down"></view>
					</view>
					<view class='text'>
						<view class='condition line1' style="height: 72rpx;line-height: 72rpx;">
							<span class='line-title' v-if='item.type===0' :class="{'title-received':item.issue}">店铺券</span>
							<span class='line-title' v-else-if='item.type===1'>商品券</span>
							<span>{{item.title}}</span>
						</view>
						<view class='data acea-row row-between-wrapper' style="height: 98rpx;">
							<view class="acea-row row-column-around" style="font-size: 24rpx;height: 100%;">
								<block v-if="item.coupon_type == 1">
									<view>{{ timeYMD(item.use_start_time) }}-{{ timeYMD(item.use_end_time) }}</view>
								</block>
								<block v-if="item.coupon_type == 0">
									<view>领取后{{ item.coupon_time}}天内可用</view>
								</block>
								<view class="acea-row row-center-wrapper" style="align-self: flex-start;font-size: 24rpx;color: #999;" @click.stop="clickShow(item)">
									<text class="iconfont" :class="item.show?'icon-xiangshang':'icon-xiangxia'"></text>
									<text >使用说明</text>
								</view>
							</view>
							<view class='gray iconfont icon-yilingqu2' v-if="item.issue"></view>
							<view class='bnt b-color' v-else>{{coupon.statusTile || '立即领取'}}</view>
						</view>
					</view>
					<view v-if="item.show" style="width: 100%;background-color: #FFF;padding: 24rpx;margin-bottom: 24rpx;color: #999;font-size: 24rpx;">
						<view>1.满{{ item.use_min_price }}元可用</view>
						<view v-if="item.mer_id==0">
							<text>2.</text>
							<text v-if="item.type === 1">适用于平台内指定商品</text>
							<text v-if="item.type === 11">适用于平台内指定品类下商品</text>
							<text v-if="item.type === 10">适用于平台内所有商品</text>
							<text v-if="item.type === 12">适用于参与跨店活动的店铺</text>
						</view>
						<view v-else>
							<text>2.</text>
							<text v-if="item.type === 1">店铺内指定商品</text>
							<text v-if="item.type === 11">店铺内指定品类下商品</text>
							<text v-if="item.type === 10">适用于店铺内所有商品</text>
							<text v-if="item.type === 0">适用于店铺内所有商品</text>
						</view>
						<view>3.店铺券与平台券混合使用，各自最多使用一张</view>
						<!-- <view>4.商品赠送共献值 {{ item.use_min_contribution || 0 }} 个以上可用</view> -->
						<view>4.优惠券使用条件之解释权完全归本平台所有</view>
					</view>
				</view>
			</view>
			<!-- 无优惠券 -->
			<view class='pictrue' v-else>
				<image :src="`${domain}/static/images/noCoupon.png`"></image>
			</view>
		</view>
		<!-- <view class='mask' catchtouchmove="true" :hidden='coupon.coupon==false' @click='close'></view> -->
		<view class='mask' catchtouchmove="true" v-if='coupon.coupon' @click='close'></view>
	</view>
</template>
<script lang="js" setup>
	import { ref, watch, computed, reactive } from "vue";
	import { setCouponReceive } from '@/business/api/modules/api-new.ts';
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
	import store from '@/business/store/modules/mall.ts';
	import util from '@/infrastructure/utils/utils.js'
    const Store = store()
	const emits = defineEmits(['ChangCouponsClone', 'ChangCouponsUseState', 'ChangCoupons'])
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
		showTitle: {
			type: Number,
			default: 1,
		},
		isShop: {
			type: Number,
			default: 0,
		},
	})
	
	const domain =  ref(HTTP_REQUEST_URL);
	let tabList = ref(['商品券','店铺券']);
	const tabIndex = ref(props.isShop);
	let couponArr = ref([]);
	
	watch(() => props.coupon, (newV,oldV) => {
		couponArr.value = JSON.parse(JSON.stringify(newV.list.map(item=>{
			item['show'] = false
			return item
			})))
	}, {
		deep:true,
		immediate:true
	})
	
	function timeYMD(value) {
		if(value){
			var newDate=/\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
			return newDate[0]
		}		
	}
	
	function clickShow(item){
		item.show = !item.show;
		console.log(item.show);
	}
	function close() {
		emits('ChangCouponsClone');
	}
	function getCouponUser(index, item) {
		if (item.issue) return true;
		switch (props.openType) {
			case 0:
				//领取优惠券
				setCouponReceive(item.coupon_id).then(res => {
					item.issue = true
					emits('ChangCouponsUseState', index);
					util.Tips({
						title: "领取成功"
					});
					emits('ChangCoupons', item);
				})
				break;
			case 1:
				emits('ChangCoupons', index)
				break;
		}
	}
	
	function bindTab(item,index){
		tabIndex.value = index
		// filterArray()
	}
	
</script>

<style scoped lang="scss">
	.animated{
		animation-duration:.3s
	}
	.title{
		display: flex;
		border-radius: 16rpx 16rpx 0 0;
		.item{
			position: relative;
			flex: 1;
			font-size: 28rpx;
			color: #999999;
			&::after{
				content: ' ';
				position: absolute;
				left: 50%;
				bottom: 18rpx;
				width:50rpx;
				height:5rpx;
				background:transparent;
				border-radius:3px;
				transform: translateX(-50%);
			}
			&.on{
				color: #282828;
				&::after{
					background: var(--view-bgColor);
				}
			}
		}
	}
	.b-color {
		background-color: var(--view-bgColor);
	}
	.coupon-list{
		padding: 30rpx;
		.item{
			box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.06);
			border-radius: 32rpx;
			.received-active{
			background: #DFDFDF;
			}
			.money {
				border-radius: 32rpx 0 0 32rpx;
				position: relative;
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
		animation: aminup ;
	}
	.coupon-list-window .title {
		height: 106rpx;
		width: 100%;
		text-align: center;
		line-height: 106rpx;
		font-size: 32rpx;
		font-weight: bold;
		position: relative;
		border: 1px solid #f5f5f5;
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
		margin: 0 0 50rpx 0;
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
		// background: var(--view-bgColor);
		border: 1px solid var(--view-bgColor);
		opacity: 1;
		border-radius: 20rpx;
		font-size: 20rpx;
		color: var(--view-bgColor);
		margin-right: 12rpx;
	}
	.title-received{
		color: #DFDFDF ;
			border-color: #DFDFDF;
	}
	.line-title.gray {
		border-color: #BBB;
		color: #bbb;
		background-color: #F5F5F5;
	}
	.coupon_num_box {
		background: var(--view-bgColor);
	}
</style>
