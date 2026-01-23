<template>
	<view class="share flex flex-ac flex-column" 
	:style="
	'background: url('+imgUrlEvent('/images/wx-applet/mine/share-wechat-bg.png', 'aliyunImgUrl')+') left top / cover no-repeat;'
	 // #ifdef MP
	 + 'padding-top:'+ (menu_button_info.top + menu_button_info.height) + 'px'
	 // #endif
	 "
	>
	  <!-- #ifndef MP -->
		  <view
			class="head-wrapper flex flex-ac jc-ct"
			id="home"
			:style="{ top: '0px',background: '#FFFFFF' }"
		  >
			<image
			  class="arrow-icon"
			  @click="toHome"
			  :src="
				imgUrlEvent(
				  '/images/wx-applet/mine/home.png',
				  'aliyunImgUrl'
				)
			  "
			></image>
			<text class="title">加微信/群</text>
		  </view>
		  <!-- #endif -->
		  <!-- #ifdef MP -->
		  <view
			class="head-wrapper flex flex-ac jc-ct"
			id="home"
			:style="{
			  top: menu_button_info.top + 'px',
			  height: menu_button_info.height + 'px',
			}"
		  >
			<image
			  class="arrow-icon"
			  @click="toHome"
			  :src="
				imgUrlEvent(
				  '/images/wx-applet/mine/home.png',
				  'aliyunImgUrl'
				)
			  "
			></image>
			<text class="title">加微信/群</text>
		  </view>
		  <!-- #endif -->
		<view class="header">
			<image :src="imgUrlEvent('/images/wx-applet/mine/logo.png', 'aliyunImgUrl')" class="logo"></image>
		</view>
		<view class="content">
			<view class="flex flex-ac">
				<image :src="infos?.wechat?.avatar || imgUrlEvent('/images/mine/profile.png', 'aliyunImgUrl')" class="profile"></image>
				<view>
					<view>
						<text class="name nowrap">{{ infos?.wechat?.nickname }}</text>
					</view>
					<view>
						<text class="scan">扫二维码，添加我为微信好友</text>
					</view>
				</view>
			</view>
			<view class="box flex flex-ac flex-column">
				<text class="discern">长按识别二维码添加微信</text>
				<text class="cannot">如无法识别请截图保存二维码</text>
				<image :show-menu-by-longpress="true" :src="infos?.wechat?.wx_qrcode_url" v-if="infos?.wechat?.wx_qrcode_url" mode="widthFix" class="qrcode"></image>
				<view class="empty flex flex-ac jc-ct" v-else>
					<text class="tips">暂无二维码</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { mineApi } from "@/business/api/index";

const mer_id = ref();
const infos = ref({});
// #ifdef MP
const menu_button_info = uni.getMenuButtonBoundingClientRect()
// #endif

onLoad((options)=>{
	mer_id.value = options.id;
	getShareInfos()
})

function toHome() {
	uni.switchTab({
	  url: "/views/pages/home/index",
	});
}	
// 获取分享素材
function getShareInfos() {
	mineApi.getShareInfoApi({id: mer_id.value}).then((res) => {
	if (res.code == 200) {
		console.log(res.data)
		infos.value = res.data
	}
	}).catch((err) => {});
	}
</script>

<style lang="less" scoped>
.share{
	width: 100%;
	min-height: 100vh;
	// #ifdef H5
	padding-top: 44px!important;
	//#endif
}
.head-wrapper{
	z-index: 999;
	display: flex;
	align-items: center;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 44px;
	.arrow-icon{
		position: absolute;
		left: 24rpx;
		width: 48rpx;
		height: 48rpx;
	}
	.title{
		font-weight: 600;
		font-size: 30rpx;
		color: #000000;
	}
}

.header{
	width: 750rpx;
	.logo{
		width: 160rpx;
		height: 48rpx;
		padding: 40rpx 0 52rpx 40rpx;
	}
}
.content{
	width: 630rpx;
	background-image: linear-gradient(180deg, #DCF0FF 0%, #FFFFFF 37%);
	box-shadow: 0 10rpx 20rpx 0 rgba(238, 238, 238, 0.5);
	border-radius: 32rpx;
	padding: 36rpx 28rpx 28rpx 28rpx;
	.profile{
		width: 140rpx;
		height: 140rpx;
		border-radius: 140rpx;
		border: 1px solid #FFFFFF;
		margin-right: 20rpx;
	}
	.name{
		font-family: PingFangSC-Medium;
		font-weight: 500;
		font-size: 40rpx;
		color: #000000;
		width: 410rpx;
		display: inline-block;
	}
	.scan{
		margin-top: 12rpx;
		font-family: PingFangSC-Semibold;
		font-weight: 600;
		font-size: 28rpx;
		color: #000000;
	}
	.box{
		margin-top: 40rpx;
		width: 574rpx;
		background: #D6EDFF;
		border-radius: 32rpx;
		padding-top: 48rpx;
		.discern{
			font-family: PingFangSC-Medium;
			font-weight: 500;
			font-size: 44rpx;
			color: #1B9AFF;
		}
		.cannot{
			margin-top: 12rpx;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #1B9AFF;
		}
		.qrcode{
			margin-top: 28rpx;
			width: 454rpx;
			border-radius: 16rpx;
			margin-bottom: 60rpx;
		}
	}
	.empty{
		width: 454rpx;
		height: 454rpx;
		border-radius: 16rpx;
		margin-top: 28rpx;
		margin-bottom: 60rpx;
		border: 1px dashed #aaa;
		.tips{
			color:#111;
			font-size: 26rpx;
		}
	}
}
</style>