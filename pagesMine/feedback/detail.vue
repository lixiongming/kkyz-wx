<template>
	<view class="feedback-detail" :style="view_color">
		<view class="hd">
			<view class="item">
				<view class="label">姓名</view>
				<view class="txt">{{detail.realname}}</view>
			</view>
			<view class="item">
				<view class="label">电话/邮箱</view>
				<view class="txt">{{detail.contact}}</view>
			</view>
			<view class="item" v-if="detail.reply">
				<view class="label">回复状态</view>
				<view class="txt color">已回复</view>
			</view>
		</view>
		<view class="content">
			<view class="con">{{detail.content}}</view>
			<view class="img-box" v-if="detail">
				<image class="img-list" v-for="(item,index) in detail.images" :key="index" :src="item" @click="clickImg(item)" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="content" v-if="detail.reply">
			<view class="reply">
				<view class="reply-left">
					<image :src="`${domain}/static/images/gly.png`" mode=""></image>
				</view>
				<view class="reply-right">
					<view class="clearfix reply-right-top">
						<view class="pull-left">管理员</view>
						<view class="pull-right">{{detail.update_time}}</view>
					</view>
					<view class="">{{detail.reply}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad} from "@dcloudio/uni-app";
import { feedbackDetailApi } from '@/business/api/modules/user'
import { HTTP_REQUEST_URL } from "@/infrastructure/config/app";
import store from '@/business/store/modules/mall';
const mall_store = store()

const id = ref('');
const detail = ref({});
const domain = ref(HTTP_REQUEST_URL);

const view_color = computed(()=>{
	return mall_store.viewColor
})

onLoad((options)=>{
	id.value = options.id
	feedbackDetailApi({ feedbackId: options.id }).then(res=>{
		detail.value = res.data
	})
})

//预览图片
function clickImg(item) {
	wx.previewImage({
		urls: detail.value.images, 
		current: item,
	})
}
</script>

<style lang="scss">
.feedback-detail{
	.hd{
		margin: 20rpx;
		padding: 30rpx;
		border-radius: 10rpx;
		background-color: #fff;
		.item{
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			font-size: 28rpx;
			color: #282828;
			&:last-child{
				margin-bottom: 0;
			}
			.txt{
				flex: 1;
				margin-left: 50rpx;
				text-align: right;
				color: #868686;
			}
			.color{
				color: var(--view-theme);
			}
		}
	}
	.content{
		position: relative;
		margin: 20rpx;
		padding: 30rpx;
		border-radius: 10rpx;
		line-height: 1.5;
		background-color: #fff;
	}
	.img-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.img-list{
			border-radius: 10rpx;
			margin-top: 20rpx;
			width: 210rpx;
			height: 210rpx;
		}
	}
	.reply{
		display: flex;
		.reply-left{
			width: 70rpx;
			uni-image, image{
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}
		}
		.reply-right{
			width: calc( 100% - 70rpx );
			color: #282828;
			.reply-right-top{
				color: #999999;
				margin-bottom: 14rpx;
			}
		}
	}
}	
</style>
