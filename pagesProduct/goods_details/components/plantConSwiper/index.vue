<template>
	<view class='product-bg'>
		<swiper :indicator-dots="indicatorDots" indicator-active-color="#e93323" :circular="circular"
		 :interval="interval" :duration="duration" @change="swiperChange">
			<block v-for="(item,index) in imgUrls" :key='index'>
				<swiper-item>
					<view class="image-wrap">
						<image :src="item" class="slide-image" @click='getpreviewImage(item, index)' mode="aspectFill" />
						<image v-if="videoline && index == 0" class="stop" src="https://qnyweb.302010.com/mdd_static/images/stop.png" @click='getpreviewImage(item, index)'></image>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view class="product-num" v-if="imgUrls && imgUrls.length">{{ current_img_index }}/{{ imgUrls.length }}</view>
	</view>
</template>

<script>
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
	export default {
		props: {
			imgUrls: {
				type: Array,
				default: function() {
					return [];
				}
			},
			videoline: {
				type: String,
				value: ""
			},
			isType: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				current_img_index: 1,
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				currents: "1",
				controls: true,
				isPlay: true,
				videoContext: ''
			};
		},
		created() {
		},
		watch: {

		},
		mounted() {
			// #ifndef APP-PLUS
			this.videoContext = uni.createVideoContext('myVideo', this);
			// #endif
		},
		methods: {
			getpreviewImage: function(item, index) {
				// 不刷新主页面
				this.$emit('noUpdate')
				if (this.videoline && index == 0) {
					let key = 'product_detail_video'
					let index = 0;
					uni.setStorageSync(key, { imgList: [{ url: this.videoline, cover_img: item, type: 'video' }]})
					uni.navigateTo({
						url: '/pagesProduct/goods_details/video-preview?key=' + key + '&index=' + index
					})
					
				} else {
					uni.previewImage({
						urls: this.imgUrls,
						current: item
					});
				}
				
			},

			swiperChange: function (e) {
				this.current_img_index = e.detail.current + 1
			},
			
			change: function(e) {
				this.$set(this, 'currents', e.detail.current + 1);
			}

		}
	}
</script>

<style scoped lang="scss">
	.product-bg {
		width: 750rpx;
		height: 710rpx;
		position: relative;
		.product-num {
			position: absolute;
			bottom: 40rpx;
			right: 20rpx;
			width: 84rpx;
			height: 40rpx;
			background: #11111180;
			border-radius: 28rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
		}
	}
	.product-bg swiper {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.product-bg .slide-image {
		width: 100%;
		height: 100%;
		// border-radius: 16rpx;
	}

	.product-bg .pages {
		position: absolute;
		background-color: #fff;
		height: 34rpx;
		padding: 0 10rpx;
		border-radius: 3rpx;
		right: 30rpx;
		bottom: 30rpx;
		line-height: 34rpx;
		font-size: 24rpx;
		color: #050505;
	}

	#myVideo {
		width: 100%;
		height: 100%
	}

	.product-bg .item {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.product-bg .item .poster {
		position: absolute;
		top: 0;
		left: 0;
		height: 750rpx;
		width: 100%;
		z-index: 9;
	}

	.product-bg .item .poster .image {
		width: 100%;
		height: 100%;
	}

	.product-bg .item .stop {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 136rpx;
		height: 136rpx;
		margin-top: -68rpx;
		margin-left: -68rpx;
		z-index: 9;
	}

	.product-bg .item .stop .image {
		width: 100%;
		height: 100%;
	}

	.product-bg .image-wrap {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.image-wrap .stop {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 136rpx;
		height: 136rpx;
		transform: translate(-50%, -50%);
		z-index: 9;
	}
</style>
