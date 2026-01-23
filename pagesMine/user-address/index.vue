<template>
	<view :style="local_view_color" class="address-main">
		<form @submit="formSubmit" report-submit='true'>
			<view class="warp">
				<view class='addAddress'>
					<view class='list'>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>姓名</view>
							<input type='text' placeholder='请输入姓名' name='real_name' :value="user_address.real_name" placeholder-class='placeholder'></input>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>联系电话</view>
							<input type='text' placeholder='请输入联系电话' name="phone" :value='user_address.phone' placeholder-class='placeholder'></input>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>所在地区</view>
							<view class="region"  @click="changeRegion">
									<input type='text' placeholder='请选择地址' :value='address_text' placeholder-class='placeholder' disabled style="pointer-events:none;padding-right: 84rpx;"></input>
									<text class="iconfont icon-xiangyou"></text>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>详细地址</view>
							<input type='text' class="location-input" placeholder='请填写具体地址' name='detail' placeholder-class='placeholder' v-model="user_address.detail" style="padding-right: 84rpx;"></input>
							<view class="location" @click="selfLocation">
								<text class="iconfont icon-chakanditu"></text>
								<br>
								定位
							</view>
						</view>
					</view>
					<view class='default acea-row row-middle'>
						<view class="checkbox" @click="ChangeIsDefault">
							<text v-if="user_address.is_default" class="iconfont icon-xuanzhong1"></text>
							<text v-else class="iconfont icon-weixuanzhong"></text>
							<text style="margin-left: 16rpx;">设置为默认地址</text>
						</view>
					</view>
				</view>
			</view>
			<button class='keepBnt' form-type="submit" :disabled="loading">立即保存</button>
		</form>
		<areaWindow :isShow="is_show" :address="address_info"
			 @submit="onChangeAddress" @changeClose="changeClose"></areaWindow>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad, onHide, onShow} from "@dcloudio/uni-app";
import { editAddressApi, getAddressDetailApi } from '@/business/api/modules/user';
import { getCityV2Api, getCityListApi } from '@/business/api/modules/api-new';
import areaWindow from '@/components/areaWindow';
import { getGeocoderApi } from '@/business/api/modules/store';
import { toLogin } from '@/infrastructure/libs/login.js';
import store from '@/business/store/modules/mall';
const mall_store = store()

const title = ref('');
const cart_id = ref(0);
const pink_id = ref(0);
const coupon_id = ref(0);
const address_id = ref(0);
const product_type = ref(0);
const user_address = ref({is_default: false});
const region = ref( ['省', '市', '区']);
const district = ref([]);
const is_show = ref(false);
const address_info = ref([]);
const latitude = ref('');
const longitude = ref('');
const loading = ref(false);


const local_view_color = computed(()=>{
	return mall_store.localViewColor
})

const address_text = computed(()=>{
		return address_info.value.map(v=>v.name).join('/');
})

onLoad((options)=>{
	let is_login = uni.getStorageSync('isLogin')
	if (is_login) {
		cart_id.value = options.cartId || '';
		pink_id.value = options.pinkId || 0;
		coupon_id.value = options.couponId || 0;
		address_id.value = options.id || 0;
		product_type.value = options.product_type || 0;
		title.value = options.id ? '修改地址' : '添加地址';
		getUserAddress();
		getCityLists();
	} else {
		toLogin()
	}
})

function onChangeAddress(address){
	address_info.value = address;
}

// 地址数据
function getCityLists() {
	getCityV2Api({ pid: 0 }).then(res => {
		district.value = res.data
	})
}

function changeRegion(){
	is_show.value = true;
}

// 关闭地址弹窗；
function changeClose() {
	is_show.value = false;
}

function onConfirm(val) {
	region.value = val.checkArr[0] + '-' + val.checkArr[1] + '-' + val.checkArr[2];
}

function getUserAddress() {
	if (!address_id.value) return false;
	getAddressDetailApi({ address_id: address_id.value }).then(res => {
		region.value = [res.data.province, res.data.city, res.data.district];
		console.log( res.data,' res.data');
		user_address.value = res.data
		const { province, province_id, city, city_id, district, district_id, street, street_id } = res.data;
		let area = [
			{ level: 1, id: province_id, name: province, type: 'province', parent_id: 0, path: '/' },
			{ level: 2, id: city_id, name: city, type: 'city', parent_id: province_id, path: `/${province_id}/` },
			{ level: 3, id: district_id, name: district, type: 'area', parent_id: city_id, path: `/${province_id}/${city_id}/` },
			{ level: 4, id: street_id, name: street, type: 'street', parent_id: district_id, path: `/${province_id}/${city_id}/${district_id}/` },
		]
		address_info.value = area

		console.log(address_info.value)
	});

}

function selfLocation() {
	uni.showLoading({
		title: '定位中',
		mask: true,
	});
	uni.getLocation({
		type: 'gcj02',
		success: (res) => {
			latitude.value = res.latitude
			longitude.value = res.longitude
			console.log(res.latitude,res.longitude)
			getGeocoderApi({
				location: res.latitude.toString() + ',' + res.longitude.toString()
			}).then(res => {
				const data = res.data;
				getCityListApi(data.address_component.province+'/'+data.address_component.city+'/'+data.address_component.district+'/'+(!data.address_reference.town ? '' : data.address_reference.town.title)).then(res=>{
					address_info.value = res.data;
					user_address.value['detail'] = data.formatted_addresses.recommend;
					uni.hideLoading();
				}).catch(e=>{
					uni.hideLoading();
					uni.showToast({
						title: '定位失败，请手动输入地址',
						icon: 'none',
						duration: 1000
					});
				})
			}).catch(e=>{
				uni.hideLoading();
				uni.showToast({
					title: '定位失败，请手动输入地址',
					icon: 'none',
					duration: 1000
				});
			})
		},
		fail: (res) => {
			console.log('fail',res);
			uni.hideLoading();
			uni.showToast({
				title: res.errMsg,
				icon: 'none',
				duration: 1000
			});
		},
	});
}

function showToast(mes){
	uni.showToast({
        title: mes,
        icon: 'none',
    });

}

/**
 * 提交用户添加地址
 *
 */
 function formSubmit(e) {
	let value = e.detail.value;
	if (!value.real_name) return showToast('请填写收货人姓名')
	if (!value.phone) return showToast('请填写联系电话')
	if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone)) return showToast('请输入正确的手机号码')
	if (!address_info.value.length) return showToast('请选择所在地区')
	if (!value.detail) return showToast('请填写详细地址')
	value.address_id = address_id.value;
	value.is_default = user_address.value.is_default ? 1 : 0;
	value.area = address_info.value;
	uni.showLoading({
		title: '保存中',
		mask: true
	})
	loading.value = true;
	editAddressApi(value).then(res => {
		if (address_id.value)
		    showToast('修改成功')
		else
		    showToast('添加成功')
		setTimeout(function() {
			uni.hideLoading();
			if (cart_id.value) {
				uni.$emit('updataAddress')
				if(product_type.value == 20){
					uni.navigateTo({
						url: '/packages/mall/views/pages/points_mall/integral_order?cartId=' + cart_id.value + '&addressId=' + (res.data
							.address_id) + '&pinkId=' + pink_id.value + '&couponId=' + coupon_id.value
					});
				}else{
					uni.navigateBack({
						delta: 1,
					})
				}
				cart_id.value = '';
				pink_id.value = '';
				coupon_id.value = '';
			} else {
				// #ifdef H5
				return history.back();
				// #endif
				// #ifndef H5
				return uni.navigateBack({
					delta: 1,
				})
				// #endif
			}
			loading.value = false;
		}, 1000);
	}).catch(err => {
		loading.value = false;
		return showToast(err)
	})
}

function ChangeIsDefault() {
	user_address.value['is_default'] = !user_address.value.is_default
}
</script>

<style scoped lang="less">
	.address-main{
		background-color: #F3F8FB;
		height: 100vh;
	}
	/deep/checkbox .uni-checkbox-input.uni-checkbox-input-checked,
	/deep/checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	  border: 1px solid var(--view-theme)!important;
	  background-color: var(--view-theme)!important;
	  color: #fff!important;
	}
	.warp{
		padding: 32rpx;
	}
	.addAddress{
		padding: 48rpx 32rpx;
		gap: 80rpx;
		border-radius: 32rpx;
		background: #FFF;
	}
	.addAddress .list {
		background-color: #fff;
	}
	.addAddress .list .item {
		position: relative;
	}
	.addAddress .list .item .location{
		position: absolute;
		right: 30rpx;
		bottom: 38rpx;
		text-align: center;
		font-size: 20rpx;
		.iconfont{
			color: var(--view-theme);
		}
	}
	.addAddress .list .item .name {
		width: 195rpx;
		color: #111111;
		font-size: 24rpx;
	}
	.addAddress .list .item .address {
		flex: 1;
		margin-left: 20rpx;
	}
	.addAddress .list .item input,.region .region_count {
		margin-top: 15rpx;
		margin-bottom: 24rpx;
		width: 622rpx;
		height: 88rpx;
		padding: 0 32rpx;
		align-items: center;
		border-radius: 16rpx;
		background: #F5F6F6;
		box-sizing: border-box;
		color: #111111;
		font-size: 28rpx;
	}
	.region{
		position: relative;
	}
	.region_count{
		height: 88rpx;
		line-height: 88rpx;
	}
	.icon-xiangyou{
		position: absolute;
		right: 32rpx;
		color: #777777;
		font-size: 24rpx;
		top: 44rpx;
	}
	.addAddress .list .location-input{
		padding-right: 70rpx;
	}
	.addAddress .list .item .placeholder {
		color: #cccccc;
		font-size: 28rpx;
	}
	.addAddress .list .item picker {
		width: 475rpx;
	}
	.addAddress .list .item picker .picker {
		width: 410rpx;
		font-size: 30rpx;
	}
	.addAddress .list .item picker .iconfont {
		font-size: 43rpx;
	}
	.addAddress .default {
		background-color: #fff;
	}
	.addAddress .default checkbox {
		margin-right: 15rpx;
	}
	.keepBnt {
		width: 690rpx;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		margin: 32rpx auto;
		margin-top: 80rpx;
		font-size: 32rpx;
		color: #fff;
		border-radius: 16rpx;
		font-weight: 600;
		background: linear-gradient(0deg, #00DCEE 0%, #00DCEE 100%), #00DCEE;
	}
	 .keepBnt[disabled]{
		background: #bbb;
	}
	.wechatAddress {
		width: 690rpx;
		height: 88rpx;
		border-radius: 16rpx;
		text-align: center;
		line-height: 88rpx;
		margin: 0 auto;
		font-size: 32rpx;
		color: var(--view-theme);
		border: 1px solid var(--view-theme);
	}

	.checkbox {
		// width: 60rpx;
		display: flex;
		align-items: center;
		.iconfont {
			font-size: 32rpx;
			color: #CCCCCC;
		}
		.icon-xuanzhong1 {
			color: var(--view-assist);
		}
	}
</style>
