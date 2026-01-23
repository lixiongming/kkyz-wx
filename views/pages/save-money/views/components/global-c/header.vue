<template>
	<view class="g-header" :style="{ background: `${bg_color}`, ...extra_warp_styles }">
		<!-- 头部-左边 -->
		<view class="left-box">
			<slot name="left">
			<uni-icons type="arrow-left" size="24" @click="back" :color="props.color"></uni-icons>
			</slot>
		</view>
		<!-- 头部-中间内容 -->
		<view class="flex-1 cneter-box nowrap">
			<text class="title" :style="{color:props.color}">{{props.title}}</text>
		</view>
		<!-- 头部-右边 -->
		<view class="right-box">
			<slot name="right"></slot>
			<image
				v-if="show_share"
				mode="aspectFit"
				class="share-icon"
				@click="shareEvent"
				:src="share_icon_white ? imgUrlEvent('/images/save-money/earn-province-share-white.png') : imgUrlEvent('/images/save-money/earn-province-share.png')"
			></image>
		</view>
		
	</view>
</template>

<script setup>
	// 引入图片拼接前缀方法
	import { imgUrlEvent } from "@/views/pages/save-money/infrastructure/utils/imgUrls.ts";
	// 接口组件外部传入的参数
	const props = defineProps({
		// 头部文案
		title: {
			type: String,
			default: "",
		},
		// 头部背景色
		bg_color: {
			type: String,
			default: "",
		},
	    // 头部title文字色
		color:{
			type: String,
			default: "#111",
		},
		// 是否显示分享按钮
		show_share:{
			type: Boolean,
			default: false,
		},
		// 分享图标是否是白色
		share_icon_white:{
			type: Boolean,
			default: false,
		},
		// 额外的warp样式
		extra_warp_styles: {
			type: Object,
			default: () => ({}),
		},
	});
	// 返回按钮回调
	const back=()=>{
		uni.navigateBack({
			delta: 1
		});
	}

	// 分享事件
	const shareEvent = () => {
		if (uni.getStorageSync("isLogin")) {
			// uni.$emit("open_shear");
			uni.navigateTo({
				url: "/views/pages/save-money/views/pages/mine/share"
			});
		} else {
			uni.navigateTo({
				url: "/views/pages/mine/login?isHome=true",
			});
		}
	};
</script>

<style lang="less">
	.g-header{
	    display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 32rpx 16rpx;
		width:750rpx;
		// #ifndef MP-WEIXIN
		padding-top: 44px;
		// #endif
		// #ifdef MP-WEIXIN
		padding-top: 20px;
		// #endif
		position: relative;
		.cneter-box {
			max-width: 500rpx;
			min-height: 18px;
			text-align: center;
		}
		.left-box, .right-box {
			position: relative;
			z-index: 2;
		}
		.right-box{
			min-width: 92rpx;
			height: 48rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
		.left-box{
			width: 92rpx;
			height: 48rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		.title{
			font-weight: 600;
			font-size: 32rpx;
			color: #111;
		}
		.share-icon {
			width: 48rpx;
			height: 48rpx;
			margin-left: 24rpx;
		}
	}
</style>