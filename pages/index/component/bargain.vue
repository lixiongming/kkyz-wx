<template>
	<view></view>
</template>
<script>
 
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { mapGetters } from 'vuex';
	import { assistUserData, initiateAssistApi } from '@/api/activity.js';
	import { getAssistData } from '@/api/api.js';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	import { toLogin } from '@/libs/login.js';
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		name: 'bargain',
		components:{
			easyLoadimage,
		},
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			merId: {
				type: String || Number,
				default: ''
			}
		},
		data() {
			return {
				assistList: [], //助力
				assistUserList: [], //已助力数据
				assistUserCount: '',
				mbConfig: this.dataConfig.mbCongfig.val*2,
				styleType: this.dataConfig.tabConfig.tabVal, //单行，多行，板块
				bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
				conStyle: this.dataConfig.conStyle.type ? 16 : 0,
				conStyles: this.dataConfig.conStyle.type,
				bgColor: this.dataConfig.bgColor.color,
				bgsColor: this.dataConfig.themeColor && this.dataConfig.themeColor.color && this.dataConfig.themeColor.color[0].item,
				themeColor: this.dataConfig.priceColor && this.dataConfig.priceColor.color[0].item,
				priceShow: this.dataConfig.priceShow.val,
				bntShow: this.dataConfig.bntShow.val,
				titleShow: this.dataConfig.titleShow.val,
				barginShow: this.dataConfig.barginShow.val, //助力标签
				joinShow: this.dataConfig.joinShow.val, //参与标签
				domain: HTTP_REQUEST_URL,
				diy_id: this.dataConfig.did,
				unique: this.dataConfig.timestamp,
			};
		},
		created() {},
		mounted() {
			this.getAssistUserCount();
			this.getAssistProduct();
		},
		methods: {
			// 助力
			getAssistProduct() {
				let that = this;
				getAssistData({
					diy_id: that.diy_id,
					unique: that.unique,
					mer_id: that.merId,
					limit: that.styleType == 2 ? 3 : 12
				}).then(res => {
					that.assistList = res.data.list;
				}).catch(e => {});
			},
			// 获取已助力成功数据
			getAssistUserCount() {
				let that = this;
				assistUserData({mer_id: that.merId,})
					.then(res => {
						that.assistUserCount = res.data.count;
						that.assistUserList = res.data.list;
					})
					.catch(e => {});
			},
			handleAssist(id) {
				if (this.isLogin) {
					initiateAssistApi(id)
						.then(res => {
							let id = res.data.product_assist_set_id;
							uni.hideLoading();
						})
						.catch(err => {
							uni.showToast({
								title: err,
								icon: 'none'
							});
						});
				} else {
					toLogin()
				}
			},
		}
	}
</script>

<style lang="scss">
	@import '../style/main.scss';
	.assist-count {
		background-color: #fff;
		margin: 0 20rpx;
		border-radius: 16rpx;
		padding: 20rpx 0 0 20rpx;
		box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
		&.wrapper-count2{
			padding: 20rpx;
		}
	}
	.assist-item{
		background: #ffffff;
	}
	.activity_pic {
		padding-left: 20rpx;
		position: relative;
		&::before {
			content: '';
			display: inline-block;
			width: 2rpx;
			height: 40rpx;
			background: #dcdcdc;
			position: absolute;
			top: 0;
			left: 0;
		}
		.picture {
			display: inline-block;
		}
		.avatar {
			width: 42rpx;
			height: 42rpx;
			line-height: 20rem;
			display: inline-block;
			background-repeat: no-repeat;
			background-size: center/cover;
			position: relative;
			text-align: center;
			color: #fff;
			font-weight: 600;
			vertical-align: bottom;
			font-size: 0.875rem;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			border-radius: 50%;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: 0 0;
			margin-right: -10rpx;
			box-shadow: 0 0 0 1px #fff;
		}
		.pic_count {
			margin-left: 30rpx;
			color: #999999;
			font-size: 26rpx;
			position: relative;
			top: -4rpx;
		}
	}
	.price_num{
		display: inline-block;
		max-width: 100rpx;
		overflow: hidden;
		line-height: 32rpx;
	}
</style>
