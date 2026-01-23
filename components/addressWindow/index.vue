<template>
	<view :style="localViewColor">
		<view class="address-window" :class="address.address==true?'on':''" @touchmove.stop.prevent>
			<view class='title'>选择地址<text class='iconfont icon-guanbi' @tap='close'></text></view>
			<scroll-view :scroll-y="true" class='list'>
				<view class='item acea-row row-between-wrapper' :class='active==index?"t-color":""' v-for="(item,index) in addressList"
				 @tap='tapAddress(index,item.address_id)' :key='index'>
					<text class='iconfont icon-ditu' :class='active==index?"t-color":""'></text>
					<view class='address'>
						<view class='name' :class='active==index?"t-color":""'>{{item.real_name}}<text class='phone'>{{item.phone}}</text></view>
						<view class='line1'>{{item.province}}{{item.city}}{{item.district}}{{item.street || ''}}{{item.detail}}</view>
					</view>
					<text class='iconfont icon-complete' :class='active==index?"t-color":""'></text>
				</view>
			</scroll-view>
			<!-- 无地址 -->
			<view class='pictrue' v-if="!is_loading && !addressList.length">
				<image :src="`${domain}/../static/images/noAddress.png`"></image>
				<view>暂无地址</view>
			</view>
			<view class='addressBnt' @tap='goAddressPages'>添加新地址</view>
		</view>
		<view class='mall-mask' catchtouchmove="true" v-if='address.address' @tap='close'></view>
	</view>
</template>

<script setup>
 	import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick, defineProps, defineEmits, defineExpose } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide, onUnload } from "@dcloudio/uni-app";
	import { getAddressList as getAddressList_ } from '@/business/api/modules/user.ts';
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';

	import store_ from "@/business/store/modules/mall.ts";
	const Store = store_();

	const emits = defineEmits(['OnChangeAddress'])
	const props = defineProps({
		pagesUrl: {
			type: String,
			default: '',
		},
		address: {
			type: Object,
			default: function() {
				return {
					address: true,
					addressId: 0,
				};
			}
		},
		isLog: {
			type: Boolean,
			default: false,
		}
	})

	const localViewColor = computed(()=>{
		return Store.localViewColor
	}) 

	const domain = ref(HTTP_REQUEST_URL)
	const active = ref(0)
	//地址列表
	const addressList = ref([])
	const is_loading = ref(true)

	function tapAddress(e, addressid) {
		active.value = e;
		emits('OnChangeAddress', addressid);
	}
	function close() {
		emits('changeClose');
		emits('changeTextareaStatus');
	}
	function goAddressPages() {
		emits('changeClose');
		emits('changeTextareaStatus');
		uni.navigateTo({
			url: props.pagesUrl
		});
	}
	function getAddressList() {
		getAddressList_({
			page: 1,
			page_size: 10
		}).then(res => {
			//处理默认选中项
			for (let i = 0; i < res.data.items.length; i++) {
				if (res.data.items[i].address_id == props.address.addressId) {
					active.value = i;
				}
			}
			addressList.value = res.data.items
			is_loading.value = false;
		})
	}

	defineExpose({
		getAddressList
	})
</script>
<style scoped lang="scss">
	.address-window {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 101;
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
	}
	.address-window.on {
		transform: translate3d(0, 0, 0);
	}
	.address-window .title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		height: 123rpx;
		line-height: 123rpx;
		position: relative;
	}
	.address-window .title .iconfont {
		position: absolute;
		right: 30rpx;
		color: #8a8a8a;
		font-size: 35rpx;
	}
	.address-window .list{
		max-height: 650rpx;
		overflow-y: auto;
	}
	.address-window .list .item {
		margin-left: 30rpx;
		padding-right: 30rpx;
		border-bottom: 1px solid #eee;
		height: 129rpx;
		font-size: 25rpx;
		color: #333;
	}
	.address-window .list .item .iconfont {
		font-size: 37rpx;
		color: #2c2c2c;
	}
	.address-window .list .item .iconfont.icon-complete {
		font-size: 30rpx;
		color: #fff;
	}
	.address-window .list .item .address {
		width: 560rpx;
	}
	.address-window .list .item .address .name {
		font-size: 28rpx;
		font-weight: bold;
		color: #282828;
		margin-bottom: 4rpx;
	}
	.address-window .list .item .address .name .phone {
		margin-left: 18rpx;
	}
	.address-window .addressBnt {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		width: 690rpx;
		height: 86rpx;
		border-radius: 43rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 85rpx auto;
		background-color: var(--view-bgColor);
	}
	.address-window .pictrue {
		text-align: center;
	}
	.address-window .pictrue image,.address-window .pictrue uni-image {
		width: 414rpx;
		height: 305rpx;
	}
	.address-window .pictrue view{	
		color: #999;
	}
	.t-color {
		color: var(--view-bgColor)!important;
	}
</style>
