<template>
	<view class="header" :style="'background:  '+ bgColor +' ;margin-top:'+ mbConfig +'rpx;'">
		<view class="serch-wrapper acea-row row-between-wrapper" :style="{ padding: `0 ${prConfig}rpx` }">
			<view v-if="logoConfig" class="logo skeleton-rect">
				<image :src="logoConfig" mode=""></image>
			</view>
			<view class="hd_r_box" v-if="menus" >
				<view class="r_item"  @click="shareEvents">
					<image class="item_icon" :src="'https://mall-cdn.mdd3.cn/images/home/shareImgIcon.png'" mode=""></image>
					<text :style="{ color: '#111',fontSize:'20rpx' }">分享</text>
				 </view>
				<view v-for="(item, i) in menus" :key="item.img">
					<navigator class="hd_nav" :url="item.info[1].value"  hover-class="none" 
					:open-type="goPage(item.info[1].value)"
					:style="'border-radius:'+boxStyle+'rpx;'">
						<view class="r_item" :class="i == menus.length - 1 ? 'm0' : ''">
							<image class="item_icon" :src="item.img" mode=""></image>
							<text :style="{ color: txtColor }">{{item.info[0].value}}</text>
							<!-- 消息提醒红点 -->
							<text class="iconnum" v-if="showUnreadNum(item)">{{ userInfo.total_unread }}</text>
						</view>
					</navigator>
				</view>
				
			</view>
		</view>	
	</view>
</template>

<script>
    import {shareEvent } from "@/utils/util";
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight*2 + 'rpx';
	export default {
		name: 'headNavV1',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			userInfo: {
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
				statusBarHeight: statusBarHeight,
				marTop:0,
				searchH: 0,
				bgColor: this.dataConfig.bgColor && this.dataConfig.bgColor.color[0].item,
				iconColor: this.dataConfig.iconColor && this.dataConfig.iconColor.color[0].item,
				boxStyle: this.dataConfig.boxStyle.type ? '0' : '32',
				logoConfig: this.dataConfig.logoConfig.url,
				mbConfig: this.dataConfig.mbConfig.val*2,
				prConfig: this.dataConfig.prConfig.val*2,
				// txtStyle: this.dataConfig.txtStyle.type ? 'center' : 'xleft',
				menus: this.dataConfig.menuConfig && this.dataConfig.menuConfig.list,
				txtColor: this.dataConfig.themeColor && this.dataConfig.themeColor.color[0].item,
				app : getApp()
			};
		},
		mounted(){
			let that = this;
			// #ifdef H5
			// 获取H5 搜索框高度
			setTimeout(() => {
				let appSearchH = uni.createSelectorQuery().select('.serch-wrapper');
				appSearchH
					.boundingClientRect(function(data) {
						that.searchH = data.height;
					})
					.exec();
			}, 800);
			// #endif
			// #ifdef MP || APP-PLUS
			setTimeout(() => {
				// 获取小程序头部高度
				let info = uni.createSelectorQuery().in(this).select(".mp-header");
				info.boundingClientRect(function(data) {
					that.marTop = data.height
				}).exec()
			}, 300)
			// #endif
		},
		methods: {
			// // 分享事件
			shareEvents(){
               shareEvent()
			},
			// 消息提示红点
			showUnreadNum(item) {
                return this.userInfo.total_unread && item.info[1].value.indexOf('/pages/chat/customer_list/index') > -1;
            },
			// 跳转方式
			goPage(url) {
				let indexPat = [
					// "/pages/index/index",
					"/pages/index/index",
					// "/pages/order_addcart/order_addcart",
					"/pagesProduct/order_addcart/order_addcart",
					"/pages/goods_cate/goods_cate",
					"pages/user/index",
					"/pages/plant_grass/index",
				];
				let method = '';
				if (indexPat.includes(url)) {
					method = "switchTab";
				} else {
					method = "navigate";
				}
				return method;
            }
		},
		watch: {
			dataConfig: {
                handler(newVal, oldVal) {
                    // this.bgColor = newVal.bgColor && newVal.bgColor.color[0].item;
                    // this.iconColor = newVal.iconColor && newVal.iconColor.color[0].item;
                    // this.boxStyle = newVal.boxStyle.type ? '0' : '32';
                    // this.logoConfig = newVal.logoConfig.url;
                    // this.mbConfig = newVal.mbConfig.val*2;
                    // this.prConfig = newVal.prConfig.val*2;
                    // this.txtStyle = newVal.txtStyle.type ? 'center' : 'xleft';
					console.log("v1--data--->", newVal);
                },
                deep: true,
				immediate: true
            },
			userInfo: {
                handler(newVal, oldVal) {
                    // this.bgColor = newVal.bgColor && newVal.bgColor.color[0].item;
                    // this.iconColor = newVal.iconColor && newVal.iconColor.color[0].item;
                    // this.boxStyle = newVal.boxStyle.type ? '0' : '32';
                    // this.logoConfig = newVal.logoConfig.url;
                    // this.mbConfig = newVal.mbConfig.val*2;
                    // this.prConfig = newVal.prConfig.val*2;
                    // this.txtStyle = newVal.txtStyle.type ? 'center' : 'xleft';
					console.log("v1--userInfo--->", newVal);
                },
                deep: true,
				immediate: true
            },
		}
	}
</script>

<style lang="scss" scoped>
.undo{
	font-weight: 600 !important;
}
.header {
	width: 100%;
	background: #ffffff;
	.btn {
		position: relative;
		margin-left: 30rpx;
		.iconfont {
			font-size: 45rpx;
		}
	}
	.iconnum {
		min-width: 6px;
		color: #fff;
		background: #e93323;
		border-radius: 15rpx;
		position: absolute;
		right: -10rpx;
		top: -10rpx;
		font-size: 10px;
		padding: 0 4px;
	}
	.serch-wrapper {
		display: flex;
		align-items: center;
		// padding: 20rpx 30rpx 20rpx 30rpx;
		.box{
			flex: 1;
		}
		.logo {
			max-width: 208rpx;
			height: 48rpx;
			margin-right: 20rpx;
			image {
				max-width: 208rpx;
				height: 48rpx;
			}
		}
		
	}
	.hd_r_box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.r_item {
			position: relative;
			display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
			margin-right: 32rpx;
			text {
				text-align: center;
				font-size: 10px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
			.item_icon {
				width: 48rpx;
				height: 48rpx;
			}
			&.m0 {
				margin-right: 0;
			}
		}
	}
}
/* #ifdef MP || APP-PLUS */
	.mp-header {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		/* #ifdef H5 */
		padding-bottom: 20rpx;
		/* #endif */
		background-color: #fff;
		.serch-wrapper {
			height: 100%;
			align-items: center;
			padding: 0 50rpx 0 53rpx;
			image {
				width: 118rpx;
				height: 42rpx;
				margin-right: 30rpx;
			}
			.input,.uninput {
				display: flex;
				align-items: center;
				/* #ifndef APP-PLUS */
				width: 305rpx;
				/* #endif */
				/* #ifdef APP-PLUS */
				flex: 1;
				width: 500rpx;
				/* #endif */
				height: 58rpx;
				padding: 0 0 0 30rpx;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				border-radius: 29rpx;
				color: #bbbbbb;
				font-size: 28rpx;
				.iconfont {
					margin-right: 20rpx;
				}
			}
			.uninput {
				/* #ifdef MP */
				min-width: 450rpx;
				max-width: 480rpx;
				/* #endif*/
			}
		}
	}
/* #endif */
</style>
