<template>
	<view class="intelligent">
		<view class='warp' :style="{ background: `url(${imgUrlEvent('/images/wx-applet/intelligent/intelligent2-bg.png','aliyunImgUrl')}) no-repeat`}">
			<image :src="imgUrlEvent('/images/wx-applet/intelligent/inteligent-logo.png','aliyunImgUrl')" class="logo"></image>
			<view class="step-box relative">
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/step-box.png','aliyunImgUrl')" class="step-img"></image>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/step1.png','aliyunImgUrl')" class="step-img1"></image>
				<text class="step-txt1">注册成为看看宇宙正式用户</text>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/step2.png','aliyunImgUrl')" class="step-img2"></image>
				<text class="step-txt2">完成实名认证</text>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/step3.png','aliyunImgUrl')" class="step-img3"></image>
				<text class="step-txt3">看看宇宙商城累积消费满{{amount}}元</text>
			</view>
			<view class="advantage-box relative">
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/advantage-box.png','aliyunImgUrl')" class="advantage-img"></image>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/advantage1.png','aliyunImgUrl')" class="advantage-img1"></image>
				<text class="advantage-txt1">无论是否已有店铺，均可参与带货</text>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/advantage2.png','aliyunImgUrl')" class="advantage-img2"></image>
				<text class="advantage-txt2">佣金规则透明，清晰可查</text>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/advantage3.png','aliyunImgUrl')" class="advantage-img3"></image>
				<text class="advantage-txt3">只需将商品或视频内容分享给好友</text>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/advantage4.png','aliyunImgUrl')" class="advantage-img4"></image>
				<text class="advantage-txt4">订单完成后，佣金自动结算</text>
				<image :src="imgUrlEvent('/images/wx-applet/intelligent/advantage5.png','aliyunImgUrl')" class="advantage-img5"></image>
				<text class="advantage-txt5">支持通过看看宇宙APP随时提现，操作便捷，安全可靠</text>
			</view>
			<view class="btn flex flex-ac jc-ct" @click="sellGoods">我要带货</view>
		</view>

		<!-- 温馨提示 -->
		<g-new-modal ref="popup"  :btn_type="2" @close="closeModel" @confirm="toPage('/pagesMine/user-certificate/index')" title="温馨提示" content="您还未实名认证，请先认证！" confirmText="去认证"></g-new-modal>

		<!-- 温馨提示 -->
		<g-new-modal ref="popup1"  :btn_type="2" @close="closeModel" @confirm="switchPage('/pages/kkyz-shop/index')" title="温馨提示" :content="'成为带货达人，需要先在看看宇宙商城消费满'+money+'元'" confirmText="去购物"></g-new-modal>
	</view>
</template>
<script setup>
	import { ref } from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { getSatisfyConditionApi, getSatisfyAmountApi } from '@/business/api/modules/intelligent';
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";

	const hei = uni.getSystemInfoSync().windowHeight;
	const popup = ref();
	const popup1 = ref();
	const code = ref();
	const money = ref();
	const amount = ref(0);

	onShow(() => {
		getSatisfyCondition();
		getSatisfyAmount();
	})

	//获取达人带货判定
	function getSatisfyCondition(){
		getSatisfyConditionApi().then(res=>{
			if(res.code==200){
				code.value = res.data.code;
				if(code.value==1){
					popup.value.open()
				}else if(code.value==2){
					money.value = res.data.msg;
					popup1.value.open()
				}
			}
		})
	}

	//获取达人带货判定
	function getSatisfyAmount(){
		getSatisfyAmountApi().then(res=>{
			if(res.code==200){
				amount.value = res.data.amount;
			}
		})
	}

	function back() {
		uni.navigateBack({
			delta: 1
		});
	}

	//路由跳转
	function toPage (url){
		uni.navigateTo({
			url
		})
		closeModel();
	}

	//路由跳转
	function switchPage (url){
		uni.switchTab({
			url
		})
	}

	//我要带货
	function sellGoods(){
		if(code.value==1){
			popup.value.open()
		}else if(code.value==2){
			popup1.value.open()
		}else{
			toPage('/pageIntelligent/sell-goods/list-management');
		}
	}
	
	//关闭弹框
	function closeModel(){
		popup.value.close();
		popup1.value.close();
	}

</script>

<style scoped lang="scss">
	.intelligent {
		height: 2040rpx;
		background: #FB3822;
		overflow: auto;
	}
	.warp{
		background-size: 100% 1350rpx!important;
	}
	.logo{
		width: 660rpx;
		height: 362rpx;
		margin-left: 46rpx;
	}
	.step-box{
		margin-top: 432rpx;
		width: 652rpx;
		height: 388rpx;
		margin-left: 49rpx;
	}
	.step-img{
		width: 652rpx;
		height: 388rpx;
	}
	.step-img1,.step-img2,.step-img3{
		position: absolute;
		top: 104rpx;
		left: 28rpx;
		width: 596rpx;
		height: 72rpx;
	}
	.step-img2{
		top: 196rpx;
	}
	.step-img3{
		top: 288rpx;
	}
	.step-txt1,.step-txt2,.step-txt3{
		font-family: PingFangSC-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #3C2304;
		position: absolute;
		left: 158rpx;
		top: 120rpx;
		height: 42rpx;
		line-height: 42rpx;
	}
	.step-txt2{
		top: 212rpx;
	}
	.step-txt3{
		top: 304rpx;
	}
	.advantage-box{
		margin-top: 20rpx;
		width: 652rpx;
		height: 616rpx;
		margin-left: 49rpx;
	}
	.advantage-img{
		width: 652rpx;
		height: 616rpx;
	}
	.advantage-img1,.advantage-img2,.advantage-img3,.advantage-img4,.advantage-img5{
		width: 596rpx;
		height: 72rpx;
		position: absolute;
		top: 104rpx;
		left: 28rpx;
	}
	.advantage-img2{
		top: 196rpx;
	}
	.advantage-img3{
		top: 288rpx;
	}
	.advantage-img4{
		top: 380rpx;
	}
	.advantage-img5{
		top: 472rpx;
		height: 116rpx;
	}
	.advantage-txt1,.advantage-txt2,.advantage-txt3,.advantage-txt4,.advantage-txt5{
		font-family: PingFangSC-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #3C2304;
		position: absolute;
		left: 158rpx;
		top: 120rpx;
		height: 42rpx;
		line-height: 42rpx;
	}
	.advantage-txt2{
		top: 212rpx;
	}
	.advantage-txt3{
		top: 304rpx;
	}
	.advantage-txt4{
		top: 396rpx;
	}
	.advantage-txt5{
		display: inline-block;
		top: 488rpx;
		width: 450rpx;
		height: 84rpx;
	}
	.btn{
		position: fixed;
		bottom: 60rpx;
		left: 0;
		margin-top: 28rpx;
		width: 670rpx;
		height: 90rpx;
		background: #FEEA63;
		box-shadow: 0 0 40rpx 6rpx rgba(254, 234, 99, 0.5);
		border-radius: 16rpx;
		font-weight: 600;
		font-size: 30rpx;
		color: #3C2304;
		margin-left: 40rpx;
		animation: heartbeat 1.5s ease-in-out infinite both;
	}
	@keyframes heartbeat {
		0% {
			transform: scale(1);
		}
		15% {
			transform: scale(1.1);
		}
		30% {
			transform: scale(1);
		}
		45% {
			transform: scale(1.1);
		}
		60% {
			transform: scale(1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
