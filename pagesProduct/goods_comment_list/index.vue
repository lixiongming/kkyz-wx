<template>
	<view :style="localViewColor">
		<!-- 背景 -->
		<view class="add_page_bg"></view>
		<view class="page_bg_wrap">
			<view class='evaluate-list'>
				<view class='generalComment acea-row row-between-wrapper'>
					<view class='acea-row row-middle t-color'>
						<view class='evaluate'>评分</view>
						<!-- <view class="star-box">
							<view class="star">
								<view class="star-active" :class="'star'+keyColor" :style="'width:'+replyData.star+';background-image: url('+domain+'/static/diy/score1'+keyColor+'.png)'"></view>
							</view>
						</view> -->
						<view class="star">
							<view class="star_d_wrap">
								<svg t="1725334269328" class="star_d" viewBox="0 0 5529 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1282" width="90" height="14"><path fill="#eee" d="M493.8752 34.304a20.48 20.48 0 0 1 36.2496 0L663.7568 287.744a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008L52.1216 381.6448a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L493.8752 34.304zM1620.2752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L1620.2752 34.304zM2746.6752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L2746.6752 34.304zM3873.0752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L3873.0752 34.304zM4999.4752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L4999.4752 34.304z"  p-id="1283"></path></svg>
							</view>
							<view class="star_c_wrap" :style="{width: replyData.star }">
								<svg t="1725334346707" class="star_c" viewBox="0 0 5529 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1424" width="90" height="14"><path :fill="styleColor" d="M493.8752 34.304a20.48 20.48 0 0 1 36.2496 0L663.7568 287.744a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008L52.1216 381.6448a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L493.8752 34.304zM1620.2752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L1620.2752 34.304zM2746.6752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L2746.6752 34.304zM3873.0752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L3873.0752 34.304zM4999.4752 34.304a20.48 20.48 0 0 1 36.2496 0l133.632 253.44a20.48 20.48 0 0 0 14.6432 10.5472l282.3168 48.8448a20.48 20.48 0 0 1 11.264 34.5088l-199.68 205.4144a20.48 20.48 0 0 0-5.632 17.2032l40.7552 283.5456a20.48 20.48 0 0 1-29.2864 21.2992l-257.024-126.464a20.48 20.48 0 0 0-18.1248 0l-257.024 126.464a20.48 20.48 0 0 1-29.3888-21.2992l40.7552-283.648a20.48 20.48 0 0 0-5.5296-17.1008l-199.68-205.4144a20.48 20.48 0 0 1 11.264-34.5088l282.2144-48.8448a20.48 20.48 0 0 0 14.6432-10.5472L4999.4752 34.304z"  p-id="1425"></path></svg>
							</view>
						</view>
					</view>
					<view class='t-color'><text>{{replyData.rate}}</text>好评率</view>
				</view>
				<view class='nav acea-row row-middle' v-if="replyData.stat">
					<view class='item' :class='type=="count" ? "b-color":""' @click='changeType("count")'>全部({{replyData.stat.sales}})</view>
					<view class='item' :class='type=="best" ? "b-color":""' @click='changeType("best")'>好评{{replyData.rate}}</view>
					<view class='item' :class='type=="middle" ? "b-color":""' @click='changeType("middle")'>中评({{replyData.stat.middle}})</view>
					<view class='item' :class='type=="negative" ? "b-color":""' @click='changeType("negative")'>差评({{replyData.stat.negative}})</view>
				</view>
				<userEvaluation :reply="reply"></userEvaluation>
				<view class="evaluation" v-if="replyData.stat.is_end_page">
					<text class="text">已为您过滤了参考价值不大的评价</text>
				</view>
				<!-- <view class='loadingicon acea-row row-center-wrapper' v-if="reply.length > 0">
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>-->
			</view>
			<view class='noCommodity' v-if="reply.length == 0">
				<view class='pictrue'>
					<image :src="`${domain}/static/images/no_commen.png`"></image>
					<view>暂无评价</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide, onUnload, onReachBottom, onPageScroll } from "@dcloudio/uni-app";
	import { getReplyList, getReplyConfig } from '@/business/api/modules/store.ts';
	import userEvaluation from '@/components/userEvaluation/index.vue';
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
	import util from '@/infrastructure/utils/utils.js'
	import store_ from "@/business/store/modules/mall.ts";
	const Store = store_();

	const localViewColor = computed(() => Store.localViewColor)
	const keyColor = computed(() => Store.keyColor)
	const styleColor = computed(() => {
		let colors = localViewColor.value.split(';');
		let result = '';
		if (colors.length) {
			colors = colors.map((item) => item.split(':'));
			colors = new Map(colors);
			result = colors.get('--view-bgColor');
		}
		return result;
	})

	const domain = ref(HTTP_REQUEST_URL)
	const replyData = ref({})
	const product_id = ref(0)
	const reply = ref([])
	const type = ref("count")
	const loading = ref(false)
	const loadend = ref(false)
	const loadTitle = ref('加载更多')
	const page = ref(1)
	const limit = ref(20)

	/**
	 * 生命周期函数--监听页面加载
	 */

	onLoad((options)=>{
		if (!options.product_id) return util.Tips({
			title: '缺少参数'
		}, {
			tab: 3,
			url: 1
		});
		product_id.value = options.product_id;
	})

	onShow(()=>{
		// getProductReplyList();
	})

	onMounted(() => {
		getProductReplyList();
	})

	/**
	 * 分页获取评论
	 */
	function getProductReplyList() {
		if (loadend.value) return;
		if (loading.value) return;
		loading.value = true;
		loadTitle.value = '';
		getReplyList(product_id.value, {
			page: page.value,
			limit: limit.value,
			type: type.value,
		}).then(res => {
			let list = res.data.list
			let loadend_ = list.length < limit.value;
			reply.value = util.SplitArray(list, reply.value);
			replyData.value = res.data
			loading.value = false;
			loadend.value = loadend_;
			loadTitle.value = loadend_ ? "??人家是有底线的~~" : "加载更多";
			page.value = page.value + 1;
		}).catch(err => {
			loading.value = false,
			loadTitle.value = '加载更多'
		});
	}

	/*
	* 点击事件切换
	* */
	function changeType(e) {
		let type_ = e
		if (type_ == type.value) return;
		type.value = type_;
		page.value = 1;
		loadend.value = false;
		reply.value = []
		getProductReplyList();
	}

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom(() => {
		getProductReplyList();
	})
	// 滚动监听
	onPageScroll((e) => {
		// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
		uni.$emit('scroll');
	})
</script>

<style lang="scss">
.evaluation{
	padding:48rpx 24rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	.text{
		font-size: 24rpx;

	}
}
	page{background-color:#fff;}
	.evaluate-list .generalComment{height:94rpx;padding:0 30rpx;margin-top:1rpx;background-color:#fff;font-size:28rpx;color:#808080;}
	.evaluate-list .generalComment .evaluate{margin-right:7rpx;}
	.evaluate-list .nav{font-size:24rpx;color:#282828;padding:0 30rpx 24rpx 30rpx;background-color:#fff;border-bottom:1rpx solid #f5f5f5; margin-bottom: 16rpx;}
	.evaluate-list .nav .item{
		font-size:24rpx;color:var(--view-noSelectColor);border-radius:8rpx;height:54rpx;padding:0 20rpx;
		background-color:#F3F8FB;line-height:54rpx;margin-right:17rpx;
		&.b-color{
			background-color:var(--view-bgColor);
			color: #fff;
		}
	}
	.noCommodity {
	    margin-top: 100rpx;
		border: none;
	}
	.noCommodity .pictrue{margin: 0 auto;}
	.t-color{
		color:var(--view-assist);
	}
	.evaluate {
		font-size: 24rpx;
	}
	
	.star-box {
		display: flex;
		align-items: center;
		margin-left: 10rpx;
		.star {
			position: relative;
			width: 111rpx;
			height: 19rpx;
			background: url(~pages/columnGoods/images/star.png);
			background-size: 111rpx 19rpx;
		}
	
		.star-active {
			position: absolute;
			left: 0;
			top: 0;
			width: 111rpx;
			height: 19rpx;
			overflow: hidden;
			background-image: url(~pages/columnGoods/images/star_active.png);
			background-size: 111rpx 19rpx;
			&.star_purple{
				background-image: url(~pages/columnGoods/images/star_active_purple.png);
			}
		}
	
		.num {
			color: $theme-color;
			font-size: 24rpx;
			margin-left: 10rpx;
		}
	}
	.evaluateWtapper .easy-loadimage {
		width: 160rpx;
		height: 160rpx;
	}
	.star {
		position: relative;
		width: 78px;
		height: 14px;
		line-height: 14px;
		// margin: 0 10rpx;
		overflow: hidden;
		.star_img {
			height: 100%;
		}
		.star_d_wrap, .star_c_wrap {
			position: absolute;
			width: 90px;
			height: 14px;
			left: 0;
			top: 0;
			overflow: hidden;
		}
		.star_d_wrap {
			z-index: 3;
		}
		.star_c_wrap {
			z-index: 4;
		}
		.star_d, .star_c {
			transform: translateX(-6px);
		}
		.start_c {
			fill: red;

		}
	}
	
</style>
