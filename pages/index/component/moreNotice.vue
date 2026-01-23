<template>
	<view v-if="noticeList.length" :style="'padding-top:'+mbConfig+'rpx;'" class="news-wrap" >
		<view class='news acea-row row-between-wrapper':style="'background:'+bgColor[0].item+';margin: 0 '+prConfig+'rpx;border-radius:'+bgStyle+'rpx'">
			<view class='pictrue'>
				<image :src='logoConfig' mode="heightFix"></image>
			</view>
			<view class="swiperTxt singleBar" >
				<block v-for="(item,index) in noticeList" :key='index'>
						<view class="item_txt" @click="goDetail(item)" >
							<u-notice-bar :text="item.title" :bgColor="bgColor[0].item" :color="txtColor" speed="40" fontSize="12"></u-notice-bar>
						</view>
				</block>
			</view>
			<view class='more' @click="toNoticeList">
                <text class="more-text" :style="'color:' + moreColor + ';'">更多</text>
				<image class="r_icon" :src='rImgConfig' mode="heightFix"></image>
            </view>
		</view>
	</view>
</template>

<script>
 
	
	import {merPath} from "@/utils/index"
	import { getNoticeListApi } from '@/api/user.js';
	export default {
		name: 'moreNotice',
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
				// itemNew: this.dataConfig.listConfig.list,
				logoConfig: this.dataConfig.logoConfig.url,
				rImgConfig: this.dataConfig.rImgConfig.url,
				bgColor: this.dataConfig.bgColor.color,
				mbConfig: this.dataConfig.mbConfig.val*2,
				prConfig: this.dataConfig.prConfig.val*2,
				// txtStyle: this.dataConfig.txtStyle.type,
				txtColor: this.dataConfig.txtColor.color[0].item,
				moreColor: this.dataConfig.moreColor.color[0].item,
				bgStyle: this.dataConfig.bgStyle.type ? 16 : 0,

				// 获取公告列表
				noticeList: []
			};
		},
		created() {
			this.getNoticeList();
		},
		mounted() {},
		methods: {
			goDetail(notice){
				let old_notice = this.$Cache.get("notice");
				// 如果之前已有公告，且点击的公告和之前的公告id相同，则缓存
				if (!(old_notice && old_notice.id == notice.id)) {
					this.$Cache.set("notice", notice);
				}
				setTimeout(() => {
					this.$util.JumpPath('/pages/notice/detail/index');
				}, 100)
				
			},
			getNoticeList() {
				getNoticeListApi({
                    page: 1,
                    page_size: 1,
                }).then((res) => {
					if (res.data && res.data.list && res.data.list.length > 0) {
						this.noticeList = res.data.list;
					}
				}).catch(() => {})
			},
			// 去公告列表
			toNoticeList() {
                this.$util.JumpPath('/pages/notice/index');
            }
		}
	}
</script>

<style lang="scss" scoped>
	.news-wrap {
		// border-radius: 22rpx;
		// margin: 0 10rpx;
	}
	.news {
		height: 64rpx;
		// border-top: 1px solid #f4f4f4;
		padding: 0 20rpx;
		box-shadow: 0 10rpx 30rpx #f5f5f5;
		justify-content: flex-start;
	}
	.news .pictrue {
		// width: 130rpx;
		width: 64rpx;
		height: 32rpx;
		// border-right: 1px solid #0AAEF8;
		padding-right: 23rpx;
		box-sizing: content-box;
		position: relative;
		// .spacer-block {
		// 	position: absolute;
        //     top: 50%;
		// 	transform: translateY(-50%);
        //     right: 0;
        //     width: 1px;
        //     height: 70%;
		// }
	}
	.news .more {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.r_icon {
			width: 24rpx;
			height: 24rpx;
		}
		.more-text {
			font-size: 24rpx;
            margin-right: 8rpx;
            margin-left: 8rpx;
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
	.item_txt {
		height: 100%;
		line-height: 64rpx;
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
