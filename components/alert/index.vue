<template>
	<view class="alert-wrapper" :style="Store.viewColor">
		<view class="alert-box">
			<image :src="domain+'/static/diy/success'+Store.keyColor+'.png'" mode=""></image>
			<view class="txt">{{msg}}</view>
			<view class="btn" @click="close">我知道了</view>
		</view>
	</view>
</template>

<script lang="js" setup>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB���ܿ����ߣ�������ҵ��չ ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2023 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB����������������δ�����ɲ���ȥ��CRMEB��ذ�Ȩ
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	import { ref, onMounted, computed, watch } from 'vue'
	import { onLoad, onUnload,onReady,onShow,onReachBottom, onHide} from "@dcloudio/uni-app";
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app';
	import store from '@/business/store/modules/mall';
	const Store = store()
	
	const emits = defineEmits(['bindClose'])
	const props = defineProps({
		msg:{
			type:String,
			default:''
		},
	})
	
	const domain = ref(HTTP_REQUEST_URL);
	
	function close(){
		emits('bindClose');
	}
	

</script>

<style lang="scss">
.alert-wrapper{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,.5);
	z-index: 100;
	.alert-box{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 500rpx;
		height: 540rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 34rpx;
		image{
			width: 149rpx;
			height: 230rpx;
		}
		.txt{
			margin-bottom: 20rpx;
		}
		.btn{
			width:340rpx;
			height:90rpx;
			line-height: 90rpx;
			text-align: center;
			background-image:linear-gradient(-90deg,var(--view-bntColor21) 0%,var(--view-bntColor22) 100%);
			border-radius:45rpx;
			color: #fff;
		}
	}
}
</style>
