<template>
  	<view 
		class="customer-service"
		:style="{
			height: window_height + 'px',
			overflow: 'hidden'
        }"
  	>
		<image mode="aspectFill" class="img-block customer-service-bg" :src="$imgUrl('/images/wx-applet/customer-service/customer-service-bg.png')"></image>
		<image mode="aspectFill" class="img-block customer-service-adorn" :src="$imgUrl('/images/wx-applet/customer-service/customer-service-adorn.png')"></image>
		<image mode="aspectFill" class="img-block customer-service-tip" :src="$imgUrl('/images/wx-applet/customer-service/customer-service-tip.png')"></image>
		<image mode="aspectFill" class="img-block customer-service-code" :show-menu-by-longpress="true" v-if="default_config.platform_customer_qrcode" :src="default_config.platform_customer_qrcode"></image>
		<view class="longpress-btn">长按识别二维码添加</view>
  	</view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { mineApi } from "@/business/api/index";

const window_height = uni.getSystemInfoSync().windowHeight;
const default_config = ref({})

onLoad(() => {
	getConfigDefaultApi();
})

// 获取默认配置
function getConfigDefaultApi() {
	mineApi.getConfigDefaultApi().then((res) => {
	if (res.code == 200) {
		uni.setStorageSync('defaultConfig', res.data);
		default_config.value = res.data;
		console.log("res.data-->", res.data)
	}
	}).catch((err) => {});
}
</script>

<style lang="less" scoped>
.customer-service {
	.img-block {
        display: block;
    }
    .customer-service-bg {
        width: 750rpx;
        height: 1448rpx;
    }
    .customer-service-adorn {
		position: absolute;
		top: 236rpx;
		left: 0;
        width: 228rpx;
        height: 236rpx;
		z-index: 1;
    }
    .customer-service-tip {
		position: absolute;
		right: 60rpx;
		top: 800rpx;
        width: 148rpx;
        height: 122rpx;
		z-index: 2;
    }
	.customer-service-code {
		position: absolute;
		right: 0;
		left: 0;
		top: 540rpx;
        width: 320rpx;
        height: 320rpx;
		margin: auto;
		z-index: 3;
	}
	.longpress-btn {
		position: absolute;
		top: 1028rpx;
		left: 0;
		right: 0;
		width: 480rpx;
		height: 96rpx;
		line-height: 96rpx;
		background-image: linear-gradient(270deg, #FF9D6F 1%, #FF7605 100%);
		box-shadow: 0 16rpx 32rpx 0 #ff9540cc;
		border-radius: 48rpx;
		margin: 0 auto;
		font-family: PingFangSC-Semibold;
		font-weight: 600;
		font-size: 36rpx;
		color: #FFFFFF;
		letter-spacing: 2.48rpx;
		text-align: center;
	}
}

</style>
