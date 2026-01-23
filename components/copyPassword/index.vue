<template>
	<view :style="localViewColor">
		<view class='copy-list-window' :class='isCopy==true?"on":""'>
			<button class="iconfont icon-guanbi" @click='close'></button>
			<view class="title">
				<text class="iconfont icon-xuanzhong11"></text>
				{{title}}
			</view>
			<view class="copy-url">
				<!-- #ifdef H5 -->
				<text class="copy copy-data" :data-clipboard-text="copyUrl">{{copyUrl}}</text>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<text>{{copyUrl}}</text>
				<!-- #endif -->
			</view>
			<button class="button" @click="copyText">点击复制口令</button>
		</view>
		<!-- <view class='mall-mask' catchtouchmove="true" :hidden='isCopy==false' @click='close'></view> -->
		<view class='mall-mask' catchtouchmove="true" v-if='isCopy' @click='close'></view>
	</view>
</template>

<script setup>
 
	
	import { ref, onMounted, defineProps, defineEmits, computed, watch, nextTick } from "vue";
	import store_ from "@/business/store/modules/mall.ts";
	const Store = store_();
	const props = defineProps({
		isCopy: {
			type: Boolean,
			default: false
		},
		copyUrl: {
			type: String,
			default: '',
		}
	})
	const emits = defineEmits(['close'])
	const localViewColor = computed(() => {
		return Store.localViewColor
	})
	const title = '复制以下口令'

	onMounted(()=>{
		// #ifdef H5
		nextTick(function() {
			// let clipboard = new ClipboardJS('.copy-data');
			// clipboard.on('success', function(e) {
			// 	util.Tips({
			// 		title:'复制成功'
			// 	})
			// 	setTimeout(()=>{
			// 		emits('close')
			// 	},500)
			// });
			// clipboard.on('error', function(e) {
			// 	util.Tips({
			// 		title:'复制失败'
			// 	})
			// });
		});
		// #endif
	})

	function copyText(){
		uni.setClipboardData({ 
			data: props.copyUrl,
			success: function () {
				uni.showToast({
					title: "复制成功",
					duration: 2000,
				});
    	}, });
		setTimeout(()=>{
			emits('close')
		},500)			 
	}

	function close(){
		emits('close')		 
	}
</script>

<style scoped lang="scss">
	.copy-list-window {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx 16rpx 0 0;
		z-index: 555;
		transform: translate3d(0, 100%, 0);
		transition: all .1s cubic-bezier(.25, .5, .5, .9);
		padding: 50rpx 30rpx 30rpx;
		.icon-guanbi{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			color: #8A8A8A;
		}
		.button{
			height: 76rpx;
			border-radius: 38rpx;
			margin: 30rpx 30rpx 0;
			background-color: var(--view-bgColor);
			font-size: 30rpx;
			line-height: 76rpx;
			color: #FFFFFF;
		}	
	}
	.copy-list-window.on {
		transform: translate3d(0, 0, 0);
	}
	.copy-list-window .title {
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		font-family: 'PingFang SC';
		.iconfont {
			font-size: 30rpx;
			color: #FBB324;
			margin-right: 12rpx;
		}
	}
	.copy-url{
		margin-top: 30rpx;
		background: #F5F5F5;
		padding: 20rpx 25rpx;
		color: #BBBBBB;
		font-size: 28rpx;
	}
</style>
