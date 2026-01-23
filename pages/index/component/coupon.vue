<template>
	<view></view>
</template>

<script>
 
	import {setCouponReceive,getCouponData} from '@/api/api.js';
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	export default {
		name: 'coupon',
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
		computed: mapGetters(['isLogin']),
		components: {},
		watch:{
			isLogin:{
				handler:function(newV,oldV){
					if(newV){
						this.getCoupon();
					}
				},
				deep:true
			}
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				couponList: [],
				style: this.dataConfig.tabConfig&&this.dataConfig.tabConfig.tabVal || 0,
				themeColor: this.dataConfig.themeColor.color[0].item,
				mbConfig: this.dataConfig.mbConfig.val*2,
				prConfig: this.dataConfig.prConfig&&this.dataConfig.prConfig.val*2,
				bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
				diy_id: this.dataConfig.did,
				unique: this.dataConfig.timestamp,
			};
		},
		created() {},
		mounted() {
			this.getCoupon();
		},
		methods: {
			getCoupon: function() {
				let that = this;
				getCouponData({
					diy_id: that.diy_id,
					unique: that.unique,
					mer_id: that.merId,
					page: 1,
					limit: 10
				}).then(res => {
					that.$set(that, 'couponList', res.data.list);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			receiveCoupon: function(item) {
				let that = this;
				if (that.isLogin === false) {
					toLogin()
				} else {
					setCouponReceive(item.coupon_id).then(res => {
						item.issue = 1
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						})
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.coupon_main {
		.coupon_count{
			background: #ffffff;
			padding: 0 0 30rpx 20rpx;
		}
		.coupon-title {
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 20rpx 20rpx 10rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #282828;
			.more-box {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				font-weight: normal;
				image {
					width: 20rpx;
					height: 20rpx;
					margin-top: 10rpx;
					margin: 10rpx 0 0 5rpx;
				}
				.iconfont{
					font-size: 22rpx;
				}	
			}
		}
		.item {
			position: relative;
			&.item0{
				margin-right: 28rpx;
				width: 260rpx;
				height: 194rpx;
				position: relative;
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				.top{
					text-align: center;
					position: absolute;
					top: 0;
					left: 10rpx;
					width: 240rpx;
					height: 124rpx;
					background-size: 100% 100%;
					color: #E93323;
					.money{
						margin: 8rpx 0 2rpx;
						font-size: 52rpx;
						font-weight: bold;
						text{
							font-size: 28rpx;
							font-weight: normal;
						}
					}
					.info{
						font-size: 24rpx;
					}
				}
				.coupon-btn{
					width: 260rpx;
					height: 160rpx;
					text-align: center; 
					font-size: 28rpx;
					display: flex;
					align-items: end;
					justify-items: center;
					justify-content: flex-end;
					border-radius: 24rpx;
					background: #E93323;
					text{
						display: inline-block;
						color: #ffffff;
						width: 100%;
						position: absolute;
						bottom: 20rpx;
					}
				}
			}
			&.item1{
				width: 244rpx;
				height: 126rpx;
				background: #BBBBBB;
				border-radius: 14rpx;
				color: #fff;
				margin-right: 24rpx;
				&::before {
					position: absolute;
					content: ' ';
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					background-color: #fff;
					left: -8rpx;
					top: 54rpx;
				}
			}
			.itemCon {
				width: 244rpx;
				height: 128rpx;
				.text {
					width: 198rpx;
					height: 130rpx;
					padding: 18rpx 0;
					margin: -2rpx 0 0 -1rpx;
					background-color: #f7f7f7;
					border-radius: 14rpx;
					.money {
						font-size: 48rpx;
						text-align: center;
						font-weight: bold;
						text {
							font-size: 24rpx;
						}
					}
					.info {
						font-size: 24rpx;
						text-align: center;
					}
				}
				.bnt {
					float: right;
					position: relative;
					height: 100%;
					font-size: 20rpx;
					writing-mode: vertical-lr;
					line-height: 1.2;
					width: 46rpx;
					height: 128rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
		.wrapper {
			display: flex;
		}
	}
</style>
