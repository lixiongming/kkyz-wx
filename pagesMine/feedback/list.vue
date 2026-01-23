<template>
	<view class="feedback-list" :style="view_color">
		<block v-for="(item,index) in list" :key="index">
			<view class="item" @click="goDetail(item)">
				<view class="info">
					<text class="tips">{{item.type.cate_name}}</text>
					<view class="title line1">{{item.content}}</view>
				</view>
				<view class="time">{{item.create_time}}</view>
				<view class="iconfont icon-xiangyou"></view>
			</view>
		</block>
		<block v-if="list.length == 0">
			<emptyPage title="暂无数据"></emptyPage>
		</block>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onReachBottom} from "@dcloudio/uni-app";
import emptyPage from '@/components/emptyPage.vue'
import { feedbackListApi } from '@/business/api/modules/user'
import store from '@/business/store/modules/mall';
const mall_store = store()
const list = ref([]);
const page = ref(1);
const page_size = ref(10);
const is_scroll = ref(true);

const view_color = computed(()=>{
	return mall_store.viewColor
})

onLoad(()=>{
	getList()
})

//获取数据
function getList(){
	if(!is_scroll.value) return
	feedbackListApi({
		page:page.value,
		pageSize:page_size.value
	}).then(({data})=>{
		console.log("data--->", data)
		is_scroll.value = data.items.length>=page_size.value
		list.value = list.value.concat(data.items)
		page.value+=1
	})
}

// 详情
function goDetail(item){
	uni.navigateTo({
		url:'/pagesMine/feedback/detail?id='+item.feedback_id
	})
}

//滚动加载
onReachBottom(()=>{
	getList()
}) 
</script>

<style lang="scss">
.feedback-list{
	.item{
		position: relative;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
		.info{
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #666;
			.title{
				flex: 1;
				padding-right: 30rpx;
			}
			.tips{
				margin-right: 10rpx;
				color: var(--view-theme);
			}
		}
		.time{
			margin-top: 5rpx;
			color: #BBBBBB;
			font-size: 26rpx;
		}
		.iconfont{
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			font-size: 26rpx;
			color: #707070;
		}
	}
}
</style>
