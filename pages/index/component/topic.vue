<template>
	<view></view>
</template>

<script>
 
	import { HTTP_REQUEST_URL } from '@/config/app';
	import {merPath} from "@/utils/index"
	export default {
		name: 'topic',
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
				activityData: this.dataConfig.menuConfig.list,
				bgColor: this.dataConfig.colorShow.val ? this.dataConfig.bgColor.color[0].item : 'transparent',
				pointerColor: this.dataConfig.pointerColor&&this.dataConfig.pointerColor.color&&this.dataConfig.pointerColor.color[0].item || '#ffffff',
				mbConfig: this.dataConfig.mbConfig.val*2, //页面间距
				prConfig: this.dataConfig.prConfig.val*2, //背景间距
				txtStyle: this.dataConfig.txtStyle.type,
				bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
				colorShow: this.dataConfig.colorShow.val,
				pointerStyle: this.dataConfig.pointerStyle.type, //指示点样式
				conStyle: this.dataConfig.conStyle.type, //内容样式
				domain: HTTP_REQUEST_URL,
			};
		},
		created() {},
		mounted() {},
		methods: {
			goTopicDetail(url) {
				let urls = url
				urls = merPath(urls, this.merId)
				this.$util.JumpPath(urls);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../style/main.scss';
	.activity_count{
		margin-bottom: 20rpx;
		background: #ffffff;
		border-radius: 16rpx;
		position: relative;
		padding: 24rpx 20rpx 26rpx;
		/deep/swiper-item,uni-swiper-item,swiper{
			height: 278rpx;
		}
		/deep/uni-image,/deep/image,/deep/.easy-loadimage{
			width: 650rpx;
			height: 278rpx;
			border-radius: 16rpx;
		}
		/deep/.uni-swiper-wrapper{
			overflow: hidden;
		}
	}
	.topic_swiper{
		width: 650rpx;
		margin: 0 auto;
		line-height: 0;
		&.fillet {
			border-radius: 0;
			/deep/uni-image,/deep/image,/deep/.easy-loadimage{
				border-radius: 0;
			}
		}
		// 圆形指示点
		&.circular {
			/deep/.uni-swiper-dot {
				width: 10rpx;
				height: 10rpx;
				background: rgba(0, 0, 0, .4);
			}
			/deep/.uni-swiper-dot-active {
				background: rgba(233, 51, 35, 1);
			}
		}	
		// 方形指示点
		&.square {
			/deep/.uni-swiper-dot {
				width: 20rpx;
				height: 5rpx;
				border-radius: 3rpx;
				background: rgba(0, 0, 0, .4);
			}	
			/deep/.uni-swiper-dot-active {
				background: rgba(233, 51, 35, 1);
			}
		}		
		
	}
	.noPoint{
		/deep/.uni-swiper-dots,/deep/.uni-swiper-dot {
			display: none!important;
		}
	}
	/deep/.dot0 .uni-swiper-dots-horizontal{
		left: 10%;
	}
	/deep/.dot1 .uni-swiper-dots-horizontal{
		left: 50%;
	}
	/deep/.dot2 .uni-swiper-dots-horizontal{
		left: 90%;
	}
</style>
