<template>
	<view :style="view_color" class="adress_list">
		<view class='address-management' :class='address_list.length < 1 && page > 1 ? "fff":""'>
			<radio-group class="radio-group box" v-if="address_list.length">
				<view class='item' v-for="(item,index) in address_list" :key="index">
					<view class='address' @click='goOrder(item.address_id)'>
						<!--收货人： 收货地址：-->
						<view class='consignee'>{{item.real_name}}<text class='phone'>{{item.phone}}</text></view>
						<view class="adress_info">
							{{item.province || ''}}{{item.city || ''}}{{item.district || ''}}{{item.street || ''}}{{item.detail || ''}}
						</view>
					</view>
					<view class='operation acea-row row-between-wrapper'>
						<view :class="item.is_default?'default-choice':'set-default'" @click="radioChange(index)">
							设为默认
						</view>
						<view class='acea-row row-middle'>
							<view @click='editAddress(item.address_id)' class="edit" style="margin-right: 32rpx;">编辑
							</view>
							<view @click='deleteAddress(index)' class="edit">删除</view>
						</view>
					</view>
				</view>
			</radio-group>
			<view class='loadingicon acea-row row-center-wrapper' v-if="address_list.length>10">
				<text class='loading iconfont icon-jiazai' v-if='loading'></text>{{load_title}}
			</view>
			<view class='noCommodity' v-if="address_list.length < 1 && page > 1">
				<view class='pictrue'>
					<image :src="`${domain}/../static/images/noAddress.png`"></image>
				</view>
				<view>暂无地址</view>
			</view>
			<view class='footer acea-row row-between-wrapper'>
				<view class='addressBnt b-color on' @click='addAddress'>添加新地址</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad, onHide, onShow, onReachBottom} from "@dcloudio/uni-app";
import {
	getAddressListApi,
	setAddressDefaultApi,
	delAddressApi,
} from '@/business/api/modules/user';
import { toLogin } from '@/infrastructure/libs/login.js';
import { HTTP_REQUEST_URL } from "@/infrastructure/config/app";
import store from '@/business/store/modules/mall';

const mall_store = store()
const title = ref('地址管理');
const address_list = ref();
const cart_id = ref('');
const pink_id = ref(0);
const coupon_id = ref(0);
const loading = ref(false);
const loadend = ref(false);
const load_title = ref('加载更多');
const page = ref(1);
const page_size = ref(20);
const domain = ref(HTTP_REQUEST_URL);
const has_next = ref(true);

const view_color = computed(()=>{
	return mall_store.viewColor
})

onLoad((options)=>{
	let is_login = uni.getStorageSync('isLogin')
	if (is_login) {
		cart_id.value = options.cartId || '';
		pink_id.value = options.pinkId || 0;
		coupon_id.value = options.couponId || 0;
		getAddressLists(true);
	} else {
		toLogin()
	}
})

onShow(()=>{
	getAddressLists(true)
})

/**
 * 获取地址列表
 *
 */
function getAddressLists(is_page) {
	if (is_page) {
		loadend.value = false;
		page.value = 1;
		address_list.value = []
	};
	if (loading.value) return;
	if (loadend.value) return;
	loading.value = true;
	load_title.value = '';
	getAddressListApi({
		page: page.value,
		page_size: page_size.value
	}).then(res => {
		
		console.log(res,'res')
		let list = res.data.items;
		address_list.value = address_list.value.concat(list);
		loadend.value = list.length < page_size.value;
		load_title.value = loadend.value ? '我也是有底线的' : '加载更多';
		has_next.value = page.value*page_size.value < res.data.count;
				console.log(page.value*page_size.value , res.data.count)
		page.value = page.value + 1;
		loading.value = false;
	}).catch(err => {
	    loading.value = false;
		load_title.value = '加载更多';
	});
}

/**
 * 设置默认地址
 */
function radioChange(index) {
	let address = address_list.value[index];
	if (address == undefined) return uni.showToast({
		title: '您设置的默认地址不存在!',
		icon: 'none'
	})
	setAddressDefaultApi({ address_id: address.address_id }).then(res => {
		for (let i = 0, len = address_list.value.length; i < len; i++) {
			if (i == index) address_list.value[i].is_default = true;
			else address_list.value[i].is_default = false;
		}
		uni.showToast({
			title: '设置成功',
			icon: 'success'
		})
	}).catch(err => {
		return uni.showToast({
			title: err,
			icon: 'none'
		})
	});
}

/**
 * 编辑地址
 */
function editAddress(id) {
		uni.navigateTo({
			url: '/pagesMine/user-address/index?id=' + id + '&cartId=' + cart_id.value + '&pinkId=' +
				pink_id.value + '&couponId=' + coupon_id.value
		})
		cart_id.value = '';
		pink_id.value = '';
		coupon_id.value = '';
}
/**
 * 删除地址
 */
function deleteAddress(index) {
	let address = address_list.value[index];
	if (address == undefined) return  uni.showToast({
		title: '您删除的地址不存在!',
		icon: 'none'
	})
	delAddressApi({ address_id: address.address_id }).then(res => {
		uni.showToast({
			title: '删除成功',
			icon: 'success'
		})
		address_list.value.splice(index, 1);
	}).catch(err => {
		return uni.showToast({
			title: err,
			icon: 'none'
		})
	});
}

/**
 * 新增地址
 */
function addAddress() {
	uni.navigateTo({
		url: '/pagesMine/user-address/index?cartId=' + cart_id.value
	})
	cart_id.value = '';
}

function goOrder(id) {
	console.log("触发---》", id)
	if (cart_id.value && id) {
		uni.redirectTo({
			url: '/pagesProduct/order_confirm/index?is_address=1&cartId=' + cart_id.value + '&addressId=' +
				id + '&pinkId=' +
				pink_id.value + '&couponId=' + coupon_id.value
		})
		cart_id.value = '';
		pink_id.value = '';
		coupon_id.value ='';
	}
}

onReachBottom(()=>{
	getAddressLists()
})
</script>

<style lang="less" scoped>
	/deep/radio .wx-radio-input.wx-radio-input-checked,
	/deep/uni-radio .uni-radio-input.uni-radio-input-checked {
		border: 1px solid var(--view-theme) !important;
		background-color: var(--view-theme) !important;
	}

	.address-management {
		background-color: #F3F8FB;
		height: 100vh;
		padding: 32rpx;
	}

	.address-management .line {
		width: 100%;
		height: 3rpx;
	}

	.address-management .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.address-management .item {
		background-color: #fff;
		padding: 24rpx 32rpx;
		margin-bottom: 24rpx;
		gap: 24rpx;
		border-radius: 32rpx;
		background: #FFF;
	}

	.address-management .item .address {
		// padding: 30rpx 0;
		border-bottom: 1px solid #eee;
		font-size: 28rpx;
		color: #282828;
		padding-bottom: 24rpx;
	}

	.address-management .item .address .consignee {
		display: flex;
		align-items: center;
		color: #111111;
		font-size: 28rpx;
		font-weight: 500;
		margin-bottom: 12rpx;
	}

	.address-management .item .adress_info {
		color: #777777;
		font-size: 24rpx;
	}

	.address-management .item .address .consignee .phone {
		margin-left: 24rpx;
	}

	.address-management .item .operation {
		margin-top: 24rpx;
		/* height: 83rpx; */
		font-size: 28rpx;
		color: #282828;
	}

	.b-color {
		background: linear-gradient(0deg, #00DCEE 0%, #00DCEE 100%), #00DCEE;
	}

	.address-management .item .operation .radio text {
		margin-left: 13rpx;
	}

	.address-management .item .operation .iconfont {
		color: #2c2c2c;
		font-size: 35rpx;
		vertical-align: -2rpx;
		margin-right: 10rpx;
	}

	.address-management .item .operation .iconfont.icon-shanchu {
		margin-left: 40rpx;
		font-size: 38rpx;
	}

	.address-management .footer {
		position: fixed;
		width: 100%;
		background-color: #fff;
		bottom: 0;
		left: 0;
		height: 112rpx;
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.address-management .footer .addressBnt {
		width: 330rpx;
		height: 88rpx;
		border-radius: 16rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}

	.address-management .footer .addressBnt.on {
		width: 690rpx;
		margin: 0 auto;
	}

	.address-management .footer .addressBnt .iconfont {
		font-size: 35rpx;
		margin-right: 8rpx;
		vertical-align: -1rpx;
	}

	.address-management .footer .addressBnt.wxbnt {
		background-color: #fe960f;
	}

	.noCommodity {
		text-align: center;
		border-top: none;
		margin-top: 15vh;
	}

	.noCommodity .pictrue {
		height: 305rpx;
	}

	.noCommodity view {
		color: #999;
	}

	.set-default,
	.default-choice {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 8rpx;
		border: 1px solid #DDD;
		width: 128rpx;
		height: 42rpx;
		color: #111111;
		font-size: 24rpx;
	}

	.default-choice {
		color: #00DCEE;
		background: rgba(0, 220, 238, 0.1);
		border: 1px solid rgba(0, 220, 238, 0.1);
	}

	.edit {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 8rpx;
		border: 1px solid #DDD;
		width: 80rpx;
		height: 42rpx;
		color: rgb(17, 17, 17);
		font-size: 24rpx;
		font-weight: 400;
	}
</style>