<template>
	<view style="touch-action: none;" :style="localViewColor">
		<view class="home" style="position:fixed;" :style="{ top: top + 'px', bottom: bottom }" id="right-nav" @touchmove.stop.prevent="setTouchMove">
			<view class="homeCon" :class="homeActive === true ? 'on' : ''" v-if="homeActive">
				<!-- <navigator hover-class='none' url='/pages/index/index' open-type='switchTab' class='iconfont icon-shouye-xianxing'></navigator> -->
				<navigator hover-class='none' url='/views/pages/home/index' open-type='switchTab' class='iconfont icon-shouye-xianxing'></navigator>
				<!-- <navigator hover-class='none' url='/pages/order_addcart/order_addcart' open-type='switchTab' class='iconfont icon-caigou-xianxing'></navigator> -->
				<navigator hover-class='none' url='/pagesProduct/order_addcart/order_addcart' open-type='navigate' class='iconfont icon-caigou-xianxing'></navigator>
				<navigator hover-class='none' url='/views/pages/mine/index' open-type='switchTab' class='iconfont icon-yonghu1'></navigator>
			</view>
			<view @click="open" class="pictrueBox">
				<view class="pictrue">
					<image :src="homeActive === true ? 'https://qnyweb.302010.com/mdd_static/images/navbtn_open.gif' : 'https://qnyweb.302010.com/mdd_static/images/navbtn_close.gif'"
					 class="image pictruea" />
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
 	import { ref, computed, watch, onMounted } from "vue";
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app';
	import store from '@/business/store/modules/mall';
	const Store = store();
	const domain = ref(HTTP_REQUEST_URL)
	const top = ref("")
	const bottom = ref("50px")
	const homeActive = computed(()=>Store.homeActive)
	const localViewColor = computed(()=>Store.localViewColor)
	const keyColor = computed(()=>Store.keyColor)
	function setTouchMove(e) {
		if (e.touches[0].clientY < 545 && e.touches[0].clientY > 66) {
			top.value = e.touches[0].clientY
			bottom.value = "auto";
		}
	}
	function open() {
		homeActive.value ? Store.CLOSE_HOME() : Store.OPEN_HOME();
	}
</script>

<style scoped>
	.pictrueBox {
		width: 130rpx;
		height: 120rpx;
	}
	/*返回主页按钮*/
	.home {
		position: fixed;
		color: white;
		text-align: center;
		z-index: 9999;
		right: 15rpx;
		display: flex;
	}
	.home .homeCon {
		border-radius: 50rpx;
		opacity: 0;
		height: 0;
		color: #e93323;
		width: 0;
	}
	.home .homeCon.on {
		opacity: 1;
		animation: bounceInRight 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
		width: 300rpx;
		height: 86rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--view-bgColor);
	}
	.home .homeCon .iconfont {
		font-size: 48rpx;
		color: #fff;
		display: inline-block;
		margin: 0 auto;
	}
	.home .pictrue {
		width: 86rpx;
		height: 86rpx;
		border-radius: 50%;
		margin: 0 auto;
		background-color: var(--view-bgColor);
		box-shadow: 0 5rpx 12rpx rgba(0, 0, 0, 0.5);
	}
	.home .pictrue .image {
		width: 100%;
		height: 100%;
	}	
	.pictruea{
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		vertical-align: middle;	
	}
</style>
