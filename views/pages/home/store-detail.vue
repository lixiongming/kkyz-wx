<template>
	<view :style="viewColor">
		<view :style="{ 'background-image': `linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 40%),url(${store.mer_banner})` }" class="store-detail">
			<view class="section head">
				<image :src="store.mer_avatar"></image>
				<view class="text-wrap">
					<view class="name line1">
						<text class="name_store">{{ store.mer_name }}</text>
						<image v-if="margin_ico_switch==1 && margin_ico && store.is_margin == 10" :src="margin_ico" class="store-margin"></image>
						<text v-if="store.type_name" class="font-bg-red ml8">{{ store.type_name }}</text>
						<text v-else-if="store.is_trader" class="font-bg-red ml8">自营</text>
					</view>
					<view class="fans">{{ store.care_count < 10000 ? store.care_count : (store.care_count / 10000).toFixed(2) + '万' }}人关注</view>
				</view>
				<button :class="{ followed: store.care }" hover-class="none" @click="followToggle">
					<text v-show="!store.care" class="iconfont icon-guanzhu"></text>
					{{ store.care ? '已关注' : '关注' }}
				</button>
			</view>
			<view class="section wrap">
				<view class="name">店铺评级</view>
				<view class="score-wrap">
			      <uni-rate
                  :readonly="true"
                  :value="
                    getScoring(
                      store.postage_score,
                      store.product_score,
                      store.service_score
                    )
                  "
                  size="12"
                />
                <text class="score-num">{{
                  getScoring(
                    store.postage_score,
                    store.product_score,
                    store.service_score
                  )
                }}</text>
				</view>
			</view>
			<view class="section wrap" @click="popup_show = true">
				<view class="name">店铺二维码</view>
				<view><text class="iconfont icon-erweima1"></text></view>
			</view>
			<navigator v-if="store.isset_certificate" :url="`/views/pages/home/qualifications?mer_id=${store.mer_id}&uid=${uid}&storeName=${store.mer_name}`" class="section wrap">
				<view class="name">店铺资质信息</view>
				<view><text class="iconfont">&#xe743;</text></view>
			</navigator>		
			<view v-if="store.services_type == 1" class="section wrap" @click="call(1)">
				<view class="name">联系客服</view>
				<view><text class="iconfont icon-kefu1"></text></view>					
			</view>
			<view v-else-if="store.services_type == 0" @click="goChat" class="section wrap">
				<view class="name">联系客服</view>
				<view><text class="iconfont icon-kefu1"></text></view>
			</view>	
			<view v-else class="section wrap" @click="call(0)">
				<view class="name">联系客服</view>
				<view><text class="iconfont icon-kefu1"></text></view>					
			</view>
			<view class="section info">
				<view class="item very">
					<view class="name">店铺简介</view>
					<view class="value">{{ store.mer_info }}</view>
				</view>
				<view class="item very">
					<view class="name">店铺地址</view>
					<view class="value">{{ store.mer_address }}</view>
					<view v-if="store.lat && store.long && mer_location == 1" class="iconfont icon-dingwei" @click="showMaoLocation(store.lat, store.long)"></view>
				</view>
				<view v-if="store.service_phone" class="item">
					<view class="name">联系电话</view>
					<view class="value">{{ store.service_phone }}</view>
				</view>
				<view class="item">
					<view class="name">开店时间</view>
					<view class="value">{{ dateFormat(store.create_time) }}</view>
				</view>
			</view>
			<view :class="{ 'mall-mask': popup_show }" @click="popup_show = false"></view>
			<view :class="{ 'popup-active': popup_show }" class="popup-qrcode">
				<view class="name">{{ store.mer_name }}</view>
				<view class="info">保存二维码可分享店铺给好友哦~</view>
				<!-- #ifndef MP -->
				<image :src="store_code"></image>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<image :src="store_code" @longpress="savePosterPath(store_code)"></image>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { onLoad, onShow, onReady, onInit, onHide, onUnload } from "@dcloudio/uni-app";
import { getMerchantDetail, followStore, unfollowStore, getMerchantQrcode } from '@/business/api/modules/store.ts';
import { HTTP_REQUEST_URL } from '/infrastructure/config/app.js';
import { toLogin } from '/infrastructure/libs/login.js';
import util from '/infrastructure/utils/utils.js'
import store_ from "/business/store/modules/mall.ts";
import { homeApi,teachingApi } from "@/business/api/index.ts";
import { mineApi } from "@/business/api/index.ts";
const Store = store_();

const margin_ico_switch = computed(()=>{
	return Store.globalData.margin_ico_switch || 0
})
const margin_ico = computed(()=>{
	return Store.globalData.margin_ico || ''
})
const isLogin = computed(()=>{
	return Store.isLogin
})
const uid = computed(()=>{
	return Store.uid
})
const viewColor = computed(()=>{
	return Store.viewColor
})
const keyColor = computed(()=>{
	return Store.keyColor
})

function dateFormat (value) {
	if (!value) {
		return '';
	}
	return value.split(' ')[0];
}

const domain = ref(HTTP_REQUEST_URL);
const id = ref(0);
const store = ref({});
const score = ref(0);
const star = ref(0);
const popup_show = ref(false);
const store_code = ref('');
const mer_location = ref('');

onLoad((options) => {
	uni.getStorage({
		key: 'GLOBAL_DATA',
		success: res => {
			mer_location.value = res.data.mer_location;
		}
	});
	id.value = options.mer_id || options.id;
	getStore();
	getStoreCode();
})

function call () {
	if(store.value.service_phone){
		uni.showModal({
			title: '提示',
			content: '暂无在线客服，确定拨打客服电话:'+store.value.service_phone+'吗？',
			success: function(res) {
				if (res.confirm) {
					uni.makePhoneCall({
						phoneNumber: store.value.service_phone,
					});
				}
			}
		})
	}else{
		return util.Tips({
			title: '暂无可用客服'
		})
	}
}

function getStore() {
	getMerchantDetail({id:id.value}).then(res => {
		let store_ = res.data;
		store.value = store_;
		score.value = (parseFloat(store_.postage_score) + parseFloat(store_.product_score) + parseFloat(store_.service_score)) / 3;
		star.value = (score.value / 5) * 100;
	});
}

// 联系客服
function goChat(){
	if(uni.getStorageSync("isLogin")){
		uni.navigateTo({
			url: `/pagesProduct/customer_list/chat?mer_id=${store.value.mer_id}&uid=${uid.value}`
		})
	}else{
		toLogin()
	}
}

function follow() {
	homeApi.RelationCreateApi({type: "10",type_id:id.value}).then(res => {
		store.value.care = true;
		util.Tips({
			title: '关注成功'
		});
		uni.$emit('Cancel_store_subscription',id.value,true)
	});
}

//查看地图
function showMaoLocation(lat, long) {
	if (!lat || !long)
		return util.Tips({
			title: '请设置允许商城访问您的位置！'
		});
	//#ifdef H5
	if (util.isWeixin() === true) {
		Auth.seeLocation({
				latitude: Number(lat),
				longitude: Number(long),
				name: store.value.mer_name,
				address: store.value.mer_address ? store.value.mer_address : ''
			})
			.then(res => {
				console.log('success');
			});
	} else {
		//#endif
		uni.openLocation({
			latitude: parseFloat(lat),
			longitude: parseFloat(long),
			scale: 8,
			geocode: true,
			name: store.value.mer_name,
			address: store.value.mer_address ? store.value.mer_address : '',
			success: function(res) {
				console.log(res);
			}
		});
		// #ifdef H5
	}
	//#endif
}

function unfollow () {
	mineApi.relationCancelApi({type: "10",type_id:id.value}).then(res => {
     	store.value.care = false;
		uni.$emit('Cancel_store_subscription',id.value,false)
	});
}

function followToggle() {
  if (uni.getStorageSync("isLogin")) {
    store.value.care ? unfollow() : follow();
  } else {
    uni.navigateTo({
      url: "/views/pages/mine/login?isHome=true",
    });
  }
}

// 店铺二维码
function getStoreCode() {
	let params = {};
	getMerchantQrcode({id:id.value}, params).then(res => {
		store_code.value = res.data.url;
	}).catch(err => {});
}

// #ifdef MP
// 小程序保存图片
function savePosterPath(url) {
	uni.downloadFile({
		url,
		success: resFile => {
			if (resFile.statusCode === 200) {
				uni.getSetting({
					success: res => {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									uni.saveImageToPhotosAlbum({
										filePath: resFile.tempFilePath,
										success: res => {
											return uni.showToast({
												title: '保存成功！'
											});
										},
										fail: res => {
											return uni.showToast({
												title: res.errMsg
											});
										},
										complete: res => {}
									});
								},
								fail: () => {
									uni.showModal({
										title: '您已拒绝获取相册权限',
										content: '是否进入权限管理，调整授权？',
										success: res => {
											if (res.confirm) {
												uni.openSetting({
													success: res => {
														console.log(res.authSetting);
													}
												});
											} else if (res.cancel) {
												return uni.showToast({
													title: '已取消！'
												});
											}
										}
									});
								}
							});
						} else {
							uni.saveImageToPhotosAlbum({
								filePath: resFile.tempFilePath,
								success: res => {
									return uni.showToast({
										title: '保存成功！'
									});
								},
								fail: res => {
									return uni.showToast({
										title: res.errMsg
									});
								},
								complete: res => {}
							});
						}
					},
					fail: res => {}
				});
			} else {
				return uni.showToast({
					title: resFile.errMsg
				});
			}
		},
		fail: res => {
			return uni.showToast({
				title: res.errMsg
			});
		}
	});
}
// #endif
function getScoring(a, b, c) {
  const numbers = [Number(a), Number(b), Number(c)];
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;
  const rounded = Math.round(average * 2) / 2;
  return rounded;
}
</script>

<style lang="scss" scoped>
.score-num{
  margin-left: 16rpx;
 }
.font-bg-red {
	display: flex;
	align-items: center;
	background: var(--view-theme);
	border-color: var(--view-theme);
	color: #fff;
	font-size: 20rpx;
	text-align: center;
	line-height: 30rpx;
	height: 28rpx;
	border-radius: 5rpx;
	margin-right: 8rpx;
	&.ml8 {
		margin-left: 8rpx;
		margin-right: 0;
	}
}
.store-detail {
	padding-top: 80rpx;
	padding-right: 20rpx;
	padding-left: 20rpx;
	background: left top/750rpx 360rpx no-repeat fixed;
	.section {
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		background-color: #ffffff;
	}
	.head {
		display: flex;
		align-items: center;
		padding: 20rpx;
		image {
			width: 90rpx;
			height: 90rpx;
			border-radius: 6rpx;
		}
		.text-wrap {
			flex: 1;
			min-width: 0;
			margin-right: 20rpx;
			margin-left: 20rpx;
			line-height: 1;
			.store-margin{
				width: 28rpx;
				height: 30rpx;
				margin-left: 10rpx;
			}
			.name {
				display: flex;
				align-items: center;
				font-weight: bold;
				font-size: 28rpx;
				color: #282828;
				.name_store {
					display: inline-block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 140px;
				}
			}
			.fans {
				margin-top: 15rpx;
				font-weight: 500;
				font-size: 22rpx;
				color: #666666;
			}
		}
		button {
			display: flex;
			justify-content: center;
			align-items: center;
			min-width: 113rpx;
			height: 48rpx;
			border-radius: 24rpx;
			background-image: linear-gradient(-90deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
			font-weight: 500;
			font-size: 22rpx;
			color: #ffffff;
			.iconfont {
				margin-right: 6rpx;
				font-size: 22rpx;
			}
		}
		.followed {
			border: 1px solid #bfbfbf;
			background: none;
			color: #999999;
		}
	}
	.wrap {
		display: flex;
		align-items: center;
		padding: 32rpx 20rpx;
		.name {
			flex: 1;
			min-width: 0;
			font-weight: 400;
			font-size: 28rpx;
			color: #282828;
		}
		.score-wrap {
			display: flex;
			align-items: center;
			font-weight: 500;
			font-size: 28rpx;
			color: var(--view-theme);
			.star {
				position: relative;
				width: 111rpx;
				height: 19rpx;
				margin-right: 10rpx;
				background: url(../../columnGoods/images/star.png) left top/100% 100% no-repeat;
				overflow: hidden;
				view {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					background: url(../../columnGoods/images/star_active.png) left top/111rpx 19rpx no-repeat;
				}
			}
		}	
		.iconfont {
			font-size: 36rpx;
		}
		.icon-pingfen {
			margin-right: 6rpx;
			font-size: 23rpx;
			color: #666666;
		}
		.active {
			color: $theme-color;
		}
	}
	.info {
		.item {
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx;
			border: 1px solid #f5f5f5;
			font-weight: normal;
			font-size: 28rpx;
			line-height: 30rpx;
			color: #282828;
			.name {
				margin-right: 18rpx;
			}
			.value {
				flex: 1;
				min-width: 0;
			}
		}
		.very {
			.name {
				align-self: flex-start;
			}
		}
	}
	.popup-qrcode {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 99;
		width: 544rpx;
		padding-top: 48rpx;
		padding-bottom: 36rpx;
		border-radius: 24rpx;
		background-color: #ffffff;
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
		transition: 0.3s;
		line-height: 1;
		text-align: center;
		color: #282828;
		.name {
			max-width: 90%;
			margin-right: auto;
			margin-left: auto;
			font-weight: bold;
			font-size: 32rpx;
		}
		.info {
			margin-top: 24rpx;
			font-weight: 500;
			font-size: 24rpx;
		}
		image {
			width: 384rpx;
			height: 384rpx;
			margin-top: 18rpx;
		}
	}
	.popup-active {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
}
</style>
