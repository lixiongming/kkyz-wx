<template>
	<view class="evaluateWtapper">
		<view class="evaluateItem" v-for="(item, indexw) in reply" :key="indexw">
			<view class="pic-text acea-row row-middle row-between">
				<view class="acea-row row-middle">
					<view class="pictrue">
						<image :src="item.avatar ? item.avatar : '/static/images/f.png'"></image>
					</view>
					<view class="acea-row row-middle">
						<view class="name line1">{{ item.nickname }}</view>
						<!-- <view class="start" :style="'width:'+(item.rate/5)*124+'rpx;background-image: url('+domain+'/static/diy/score2'+keyColor+'.png)'"></view> -->
						<!-- <view class="star">
							<view class="star_d_wrap">
								<svg t="1725334269328" class="star_d" viewBox="0 0 5529 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1282" width="60" height="10"><path fill="#eee" d="M493.8752 34.304a20.48 20.48 0 0 1 36.2496 0L663.7568 287.744a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008L52.1216 381.6448a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L493.8752 34.304zM1620.2752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L1620.2752 34.304zM2746.6752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L2746.6752 34.304zM3873.0752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L3873.0752 34.304zM4999.4752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L4999.4752 34.304z"  p-id="1283"></path></svg>
							</view>
							<view class="star_c_wrap" :style="{width: `${item.rate/5 * 100}%` }">
								<svg t="1725334346707" class="star_c" viewBox="0 0 5529 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1424" width="60" height="10"><path :fill="styleColor" d="M493.8752 34.304a20.48 20.48 0 0 1 36.2496 0L663.7568 287.744a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008L52.1216 381.6448a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L493.8752 34.304zM1620.2752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L1620.2752 34.304zM2746.6752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L2746.6752 34.304zM3873.0752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L3873.0752 34.304zM4999.4752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L4999.4752 34.304z"  p-id="1425"></path></svg>
							</view>
						</view> -->
					</view>
				</view>
				<view class="c_time">{{ item.create_time }}</view>
			</view>
			<view class="time">{{ item.sku ? item.sku : '' }}</view>
			<view class="evaluate-infor">{{ item.comment }}</view>
			<view class="imgList acea-row" v-if="item.pics && item.pics.length">
				<template v-for="(itemn, indexn) in item.pics" :key="indexn">
				<view class="pictrue" v-if="indexn<=3"  @click='getpreviewImage(indexw, indexn)'>
					<!-- <easy-loadimage class="image" :image-src="itemn"></easy-loadimage> -->
					<image class="image" :src="itemn"></image>
					<text v-if="item.pics.length>4 && indexn == 3" class="morePic">+{{item.pics.length-4}}</text>
					</view>
				</template>
			</view>
			<view class="reply" v-if="item.merchant_reply_content">
				<text>店小二</text>：{{item.merchant_reply_content}}
			</view>
		</view>
	</view>
</template>
<script setup>
	import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick, defineProps } from "vue";
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	import store_ from "@/business/store/modules/mall.ts";
	const Store = store_();
	const props = defineProps({
		reply: {
			type: Array,
			default: () => []
		}
	})

	const keyColor = computed(() => {
		return Store.keyColor;
	})
	const localViewColor = computed(() => {
		return Store.localViewColor;
	})
	const styleColor = computed(() => {
		let colors = localViewColor.value.split(';');
			let result = '';
			if (colors.length) {
				colors = colors.map((item) => item.split(':'));
				colors = new Map(colors);
				result = colors.get('--view-bgColor');
			}
			return result;
	})
	const domain = ref(HTTP_REQUEST_URL)
	function getpreviewImage(indexw, indexn) {
		uni.previewImage({
			urls: props.reply[indexw].pics,
			current: props.reply[indexw].pics[indexn]
		});
	}
</script>
<style lang="scss">
	.evaluateWtapper .evaluateItem {
		background-color: #fff;
		padding-bottom: 40rpx;
	}
	.evaluateWtapper .evaluateItem~.evaluateItem {
		border-top: 1px solid #f5f5f5;
	}
	.evaluateWtapper .evaluateItem .pic-text {
		font-size: 26rpx;
		color: #282828;
		height: 68rpx;
		padding: 0 30rpx;
		margin-top: 26rpx
	}
	.evaluateWtapper .evaluateItem .pic-text .pictrue {
		width: 68rpx;
		height: 68rpx;
		margin-right: 12rpx;
	}
	.evaluateWtapper .evaluateItem .pic-text .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.evaluateWtapper .evaluateItem .pic-text .name {
		max-width: 240rpx;
		margin-right: 15rpx;
		font-weight: 600;
		font-size: 28rpx;
		color: #000000;
	}
	.evaluateWtapper .evaluateItem .time {
		font-size: 24rpx;
		color: #82848f;
		padding: 0 30rpx;
	}
	.evaluateWtapper .c_time {
		// color: var(--view-noSelectColor);
		// font-size: 20rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #D3D3D3;
	}
	.evaluateWtapper .evaluateItem .evaluate-infor {
		margin-top: 20rpx;
		padding: 0 32rpx 0 112rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #000000;
	}
	.evaluateWtapper .evaluateItem .imgList {
		padding: 0 30rpx 0 15rpx;
		margin-top: 25rpx;
	}
	::v-deep .imgList .pictrue {
		width: 160rpx;
		height: 160rpx;
		margin: 0 0 15rpx 15rpx;
		position: relative;
		.image{
			width: 160rpx;
			height: 160rpx;
		}
		.easy-loadimage.image{
			width: 160rpx;
			height: 160rpx;
		}
	}

	.evaluateWtapper .evaluateItem .imgList .morePic{
		position: absolute;
		width: 160rpx;
		height: 160rpx;
		color: #ffffff;
		font-size: 40rpx;
		text-align: center;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.5);
		padding-top: 50rpx;
		box-sizing: border-box;
	}

	.evaluateWtapper .evaluateItem .reply {
		font-size: 26rpx;
		color: #454545;
		background-color: #f7f7f7;
		border-radius: 5rpx;
		margin: 20rpx 30rpx 0 30rpx;
		padding: 30rpx;
		position: relative;
		text{
			color: var(--view-theme);
		}
	}
	.evaluateWtapper .evaluateItem .reply::before {
		content: "";
		width: 0;
		height: 0;
		border-left: 20rpx solid transparent;
		border-right: 20rpx solid transparent;
		border-bottom: 30rpx solid #f7f7f7;
		position: absolute;
		top: -30rpx;
		left: 40rpx;
	}
	.start{
		position: relative;
		top: 4rpx;
	}
	.star_purple{
		background: url(../../pages/columnGoods/images/star_active_purple.png) left top/111rpx 19rpx no-repeat;
	}
	.star {
		position: relative;
		width: 54px;
		height: 14px;
		line-height: 14px;
		// margin: 0 10rpx;
		overflow: hidden;
		.star_img {
			height: 100%;
		}
		.star_d_wrap, .star_c_wrap {
			position: absolute;
			width: 54px;
			height: 14px;
			left: 0;
			top: 0;
			overflow: hidden;
		}
		.star_d_wrap {
			z-index: 3;
		}
		.star_c_wrap {
			z-index: 4;
		}
		.star_d, .star_c {
			transform: translateX(-3px);
		}
		.start_c {
			fill: red;

		}
	}
	
</style>
