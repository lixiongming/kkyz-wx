<template>
	<view class="swiperBg" :style="'padding-top:' + marginTop +'rpx;'">
		<view 
		class="new-swiper-bg"
		:style="'background: linear-gradient(180deg, '+ bgColor0 +' 50%, '+ bgColor1 +' 100%);'"
		:class="{ ufillet: bgConfig}"
		></view>
		<!-- 单图模式 -->
		<block v-if="swiperType == 0">
			<view class="item-img" v-for="(item,index) in imgUrls" :key="index" :style="{padding:'0 '+'rpx',marginBottom:itemEdge+'rpx'}">
				<image @click="goDetail(item)" :src="item.img"></image></view>
		</block>
		<block v-else>
			<view class="swiper page_swiper" :class="[docConfig == 1 ? 'square' : docConfig == 0 ? 'circular' : 'nodoc',imgConfig ? '' : 'fillet','dot'+txtStyle, docSpacing]" 
			:style="'padding: 0 '"
			 v-if="imgUrls.length">
				<swiper
				 indicator-dots="true" 
				 :autoplay="true" 
				 :circular="circular"
				 :interval="interval" 
				 :duration="duration" 
				 indicator-color="rgba(255,255,255,0.6)" 
				 indicator-active-color="#fff"
				 :style="'height:'+(imageH+10)+'rpx;'"
				 :current="swiperCur"
				 @change="swiperChange"
				 :previous-margin="printConfig + 20 + 'rpx'"
				 :next-margin="printConfig + 20 + 'rpx'"
				 >
					<block v-for="(item,index) in imgUrls" :key="index">
						<swiper-item :class="{ active: index == swiperCur }">
							<view @click="goDetail(item)" class='slide-navigator acea-row row-between-wrapper'>
								<image :src="item.img" class="slide-image aa" :style="'height:'+ imageH +'rpx;'" mode="aspectFill"></image>
							</view>
						</swiper-item>
					</block>
				</swiper>
				<!-- <view class="dots" :class="'dot'+txtStyle">
					<block v-for="(item,index) in imgUrls" :key="index">  
						<view class="dot" :class="[docConfig == 1 ? 'square' : docConfig == 0 ? 'circular' : 'nodoc',index == swiperCur ? ' active' : '']"></view>  
					</block>  
				</view> -->
			</view>
		</block>
	</view>
</template>

<script>
 
	
	import {merPath} from "@/utils/index"
	export default {
		name: 'swiperBgNew',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			merId:{}
		},
		data() {
			return {
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				imgUrls: [], //图片轮播数据
				bgColor0: this.dataConfig.isShow.val ? this.dataConfig.bgColor.color[0].item : 'transparent', //轮播背景颜色
				bgColor1: this.dataConfig.isShow.val ? this.dataConfig.bgColor.color[1].item : 'transparent', //轮播背景颜色
				marginTop: this.dataConfig.mbConfig.val*2, //组件上边距
				// paddinglr: this.dataConfig.lrConfig.val*2, //轮播左右边距
				printConfig: this.dataConfig.printConfig ? this.dataConfig.printConfig.val*2 : 0, //左右图片露出距离
				docConfig: this.dataConfig.docConfig.type, //指示点样式
				imgConfig: this.dataConfig.imgConfig.type, //是否为圆角
				bgConfig: this.dataConfig.bgConfig ? this.dataConfig.bgConfig.type : 0, //背景是否为圆角
				txtStyle: this.dataConfig.txtStyle.type, //指示器位置
				docSpacing: this.dataConfig.tabConfig && this.dataConfig.tabConfig.tabVal == 1 ? 'doc_spacing' : '', // 指示器间距
				// imageH: 310,
				// imageH: 242,
				imageH: 272,
				swiperCur: 0,
				swiperType: 1,
			};
		},
		watch: {
			imageH(nVal, oVal) {
				let self = this
				this.imageH = nVal
			}
		},
		created() {
			this.imgUrls = this.dataConfig.swiperConfig.list
		},
		mounted() {
			let that = this;
			that.$nextTick(function() {
				uni.getImageInfo({
					src: that.setDomain(that.imgUrls[0].img),
					success: function(res) {
						if (res && res.height > 0) {	
							let height = res.height * ((750-20) / res.width)
							that.$set(that, 'imageH', 272);	
						} else {
							that.$set(that, 'imageH', 272);
						}
					},
					fail: function(error) {
						that.$set(that, 'imageH', 272);
					}
				})
			})
		},
		methods: {
			//替换安全域名
			setDomain: function(url) {
				url = url ? url.toString() : '';
				//本地调试打开,生产请注销
				if (url.indexOf("https://") > -1) return url;
				else return url.replace('http://', 'https://');
			},
			swiperChange(e) {
				let { current, source } = e.detail;
				if (source === 'autoplay' || source === 'touch') {
					this.swiperCur = e.detail.current;
				}
			},
			goDetail(url){
				let urls = url.info[1].value
				urls = merPath(urls, this.merId)
				this.$util.JumpPath(urls);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiperBg {
		position: relative;
		// background: #fff;
		z-index: 1;
		.new-swiper-bg {
			position: absolute;
			left: 0;
			top: 0;
			height: 130rpx;
			// background: rgba(28, 218, 254, 1);
			width: 100%;
			border-radius: 0 0 60rpx 60rpx;
			&.ufillet {
				border-radius: 0;
			}
		}
		.colorBg {
			position: absolute;
			left: 0;
			top: 0;
			height: 130rpx;
			width: 100%;
		}
		.page_swiper {
			position: relative;
			width: 100%;
			box-sizing: border-box;
			height: auto;
			margin: 0 auto;
			// border-radius: 10rpx;
			border-radius: 16rpx;
			overflow-x: hidden;
			/* #ifdef MP */
			z-index: 20;
			/* #endif */
			/* 设置圆角 */
			&.fillet {
				.swiper-item, image, .acea-row.row-between-wrapper{
					// border-radius: 10rpx;
					border-radius: 16rpx;
				}
			}
			.swiper-item, image, .acea-row.row-between-wrapper {
				width: 100%;
				height:100%;
				margin: 0 auto;
			}
			swiper{
				width: 100%;
				display: block;
				height: auto;
			}
			image {
				transform: scale(0.93);
				transition: all 0.6s ease;
			}
			swiper-item.active {
				image {
					transform: scale(1);
				}
			}
		}
	}
	.item-img image{
		display: block;
		width: 100%;
	}
	/deep/.swiper.dot0 .uni-swiper-dots,
	/deep/.swiper.dot0 .wx-swiper-dots {
		left: 10%;
		right: unset;
	}
	/deep/.swiper.dot1 .uni-swiper-dots,
	/deep/.swiper.dot1 .wx-swiper-dots {
		left: 50%;
	}
	/deep/.swiper.dot2 .uni-swiper-dots,
	/deep/.swiper.dot2 .wx-swiper-dots {
		left: 90%;
		right: unset;
	}
	/deep/.doc_spacing .uni-swiper-dot{
		margin-right: 4rpx;
	}
</style>
