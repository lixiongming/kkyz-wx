<template>
	<view class="flex tab-bar" :class="{'tab-bar_black': current === 'looking' || current === 'universe' || current === 'mine' || current === 'search'}" :style="{'padding-bottom': $systemInfo.safeAreaInsets.bottom + 'px'}">
		<view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('looking')" v-if="$id == 2">
			<view class="tab-bar_item--box flex">
				<w-svga ref="looking" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/looking.svga" :autoPlay="false" :loops="1" :begin="current === 'looking' ? 'end' : 'start'"></w-svga>
			</view>
		</view>
		<view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('universe')">
			<view class="tab-bar_item--box flex">
				<w-svga ref="universe" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/universe.svga" :autoPlay="false" :loops="1" :begin="current === 'universe' ? 'end' : 'start'"></w-svga>
			</view>
		</view>
		<view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('search')" v-if="$id == 1">
			<view class="tab-bar_item--box flex">
				<w-svga ref="search" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/search.svga" :autoPlay="false" :loops="1" :begin="current === 'search' ? 'end' : 'start'"></w-svga>
			</view>
		</view>
		<!-- <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('add')" v-if="$id == 1">
			<view class="tab-bar_item--add">
				<i-image class="tab-bar_item--icon" src="tab_add_02.png" mode="aspectFill" :class="{'show': current === 'add'}"></i-image>
				<i-image class="tab-bar_item--icon" src="tab_add_01.png" mode="aspectFill" :class="{'show': current !== 'add'}"></i-image>
			</view>
		</view> -->
		<!-- <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('ai')" v-if="$id == 2">
			<view class="tab-bar_item--box tab-bar_item--ai flex">
				<w-svga ref="ai" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/ai.svga" :autoPlay="false" :loops="1" :begin="current === 'ai' ? 'end' : 'start'"></w-svga>
			</view>
		</view> -->
	
		<view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('message')">
			<view class="tab-bar_item--box flex">
				<w-svga ref="message" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/message.svga" :autoPlay="false" :loops="1" :begin="current === 'message' ? 'end' : 'start'"></w-svga>
				<view class="tab-bar_item--dot" v-if="$messageBadgeSum > 0 && current !== 'message'">
					<text class="tab-bar_item--text">{{$messageBadgeSum}}</text>
				</view>
			</view>
		</view>
		<!-- <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('square')" v-if="$id == 2">
			<view class="tab-bar_item--box flex">
				<w-svga ref="square" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/square.svga" :autoPlay="false" :loops="1" :begin="current === 'square' ? 'end' : 'start'"></w-svga>
				<view class="tab-bar_item--dot" v-if="$messageBadgeSum > 0 && current !== 'square'"></view>
			</view>
		</view> -->
		<view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('mine')">
			<view class="tab-bar_item--box flex">
				<w-svga ref="mine" class="tab-bar_item--svga flex-1" url="/static/images/svga/home_tab/mine.svga" :autoPlay="false" :loops="1" :begin="current === 'mine' ? 'end' : 'start'"></w-svga>
			</view>
		</view>
	
		
	</view>
</template>

<script>
	import { navigateBack } from '@/utils/system';
	import { mapState } from 'vuex';
	
	export default {
		props: {
			current: {
				type: String,
				default: 'looking'
			}
		},
		data() {
			return {
				
			};
		},
		
		computed: {
			...mapState([
				'$statusBarHeight',
				'$systemInfo',
				'$px',
				'$id',
				'$messageBadgeSum'
			])
		},
		watch: {
			current(n, o) {
				console.log(n,o)
				if (n !== 'add') {
					this.$refs[n].play();
				}
				if (o !== 'ai' && o !== 'add') {
					this.$refs[o].playReverse({
						location: 0,
						length: 6
					});
				}
			}
		},
		methods: {
		    tapTabbar(current) {
				console.log("点到了",current)
				if (this.current == current && current !== 'square') return;
				if (current == 'square' && this.current == current) {
					this.$refs.square.play();
				}
				this.$emit("change", current);
		    },
		},
	}
</script>

<style scoped>
	.tab-bar {
		/* position: fixed;
		left: 0;
		bottom: 0; */
		border-radius: 32rpx 32rpx 0 0;
		background-color: #ffffff;
	}
	.tab-bar_black {
		background-color: #1e1f20;
	}
	.tab-bar_item {
		width: 187.5rpx;
		height: 98rpx;
	}
	.tab-bar_item--box {
		width: 136rpx;
		height: 64rpx;
		position: relative;
		/* background-color: #FF6770 !important;
		z-index: 9999; */
	}
	.tab-bar_item--svga {
		/* width: 134rpx;
		height: 64rpx;
		position: absolute;
		top: 0;
		left: 0; */
		/* opacity: 0; */
	}
	.tab-bar_item--dot {
		padding: 0 8rpx;
		height: 30rpx;
		background-color: #FF6770;
		border-radius: 26rpx;
		position: absolute;
		top: 0rpx;
		right: 6rpx;
	}
	.tab-bar_item--text {
		color: #fff;
		font-size: 24rpx;
		line-height: 30rpx;
	}
	.tab-bar_item--add {
		width: 96rpx;
		height: 96rpx;
		position: relative;
	}
	.tab-bar_item--ai {
		height: 80rpx;
	}
	.tab-bar_item--icon {
		width: 96rpx;
		height: 96rpx;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
	}
	.show {
		opacity: 1;
	}
</style>
