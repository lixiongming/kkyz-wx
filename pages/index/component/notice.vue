<template>
	<view v-if="itemNew.length" :style="'padding-top:'+mbConfig+'rpx;'" class="news-wrap" >
		<view class='news acea-row row-between-wrapper':style="'background:'+bgColor[0].item+';margin: 0 '+prConfig+'rpx;border-radius:'+bgStyle+'rpx'">
			<view class='pictrue'>
				<image :src='logoConfig' mode="heightFix"></image>
				<!-- 隔块 -->
				<view class="spacer-block" :style="'background:'+txtColor"></view>
			</view>
			<view class="swiperTxt singleBar" >
				<block v-for="(item,index) in itemNew" :key='index'>

						<view @click="goDetail(item.chiild[1].val)" >
							<!-- <view class='text'>
								<view class='newsTitle line1' :style="'text-align:'+ (txtStyle==1?'center':txtStyle==2?'right':'left') +';color:'+txtColor">{{item.chiild[0].val}}</view>
							</view> -->
							<u-notice-bar :text="item.chiild[0].val" :bgColor="bgColor[0].item" :color="txtColor" speed="40" fontSize="10"></u-notice-bar>
						</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
 
	
	import {merPath} from "@/utils/index"
	export default {
		name: 'notice',
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
				indicatorDots: false,
				autoplay: true,
				duration: 500,
				itemNew: this.dataConfig.listConfig.list,
				logoConfig: this.dataConfig.logoConfig.url,
				bgColor: this.dataConfig.bgColor.color,
				mbConfig: this.dataConfig.mbConfig.val*2,
				prConfig: this.dataConfig.prConfig.val*2,
				txtStyle: this.dataConfig.txtStyle.type,
				txtColor: this.dataConfig.txtColor.color[0].item,
				bgStyle: this.dataConfig.bgStyle.type ? 22 : 0,
			};
		},
		created() {},
		mounted() {},
		methods: {
			goDetail(url){
				let urls = merPath(url, this.merId)
				this.$util.JumpPath(urls);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.news-wrap {
		// border-radius: 22rpx;
		margin: 0 10rpx;
	}
	.news {
		height: 44rpx;
		border-top: 1px solid #f4f4f4;
		padding: 0 20rpx;
		box-shadow: 0 10rpx 30rpx #f5f5f5;
		justify-content: flex-start;
	}
	.news .pictrue {
		// width: 130rpx;
		height: 30rpx;
		// border-right: 1px solid #0AAEF8;
		padding-right: 23rpx;
		box-sizing: content-box;
		position: relative;
		.spacer-block {
			position: absolute;
            top: 50%;
			transform: translateY(-50%);
            right: 0;
            width: 1px;
            height: 70%;
		}
	}
	.news .pictrue image {
		// width: 100%;
		height: 100%;
	}
	.announcement {
		background: rgba(29, 176, 253, 1);
		transform: skewX(-10deg);
	}
	.news .swiperTxt {
		width: 510rpx;
		height: 100%;
		line-height: 44rpx;
		overflow: hidden;
	}
	.news .swiperTxt .text {
		// width: 480rpx;
	}
	.news .swiperTxt .text .label {
		font-size: 20rpx;
		color: #ff4c48;
		width: 64rpx;
		height: 30rpx;
		border-radius: 40rpx;
		text-align: center;
		line-height: 28rpx;
		border: 2rpx solid #ff4947;
	}
	.news .swiperTxt .text .newsTitle {
		// width: 397rpx;
		font-size: 20rpx;
		color: #666;
	}
	.news .swiperTxt .iconfont {
		font-size: 22rpx;
		color: #282828;
	}
	.news .swiperTxt swiper {
		height: 100%;
	}
	.swiperTxt {
		&.singleBar {
			flex: 1;
			font-size: 20rpx;
			/deep/.u-notice__left-icon {
				display: none;
			}
			/deep/.u-notice-bar {
                padding: 0;
            }
		}
	}
</style>
