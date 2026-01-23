<template>
	<view>
		<view class='list' style="margin-top: 1rpx;">
			<view class='item acea-row row-between-wrapper' v-for="(item,index) in noticeList" :key='index' @click="goDetail(item)">
				<view class="title line1">{{item.title}}</view>
				<view class='input acea-row row-between-wrapper'>
					<uni-icons type="right" size="14"></uni-icons>
				</view>
			</view>
		</view>
		<view class='noCommodity' v-if="!noticeList.length && loading==true">
			<view class='pictrue'>
				<image :src="`${domain}/static/images/noCoupon.png`"></image>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted ,watch} from 'vue'
import { onShow,onUnload,onReachBottom } from "@dcloudio/uni-app";
import { getNoticeListApi } from "@/business/api/modules/user.ts";
import Cache from '@/infrastructure/utils/cache';
import { HTTP_REQUEST_URL } from '@/infrastructure/config/app';

const domain = HTTP_REQUEST_URL
const noticeList = ref([])
const isScroll = ref(true)
const loading = ref(false)
const page = ref(1)
const page_size = ref(20)
const updateVal = ref(1)

const getNoticeList = () => {
    if(!isScroll.value) return
    getNoticeListApi({
        page: page.value,
        page_size: page_size.value,
    }).then((res) => {
        loading.value = true
        noticeList.value = noticeList.value.concat(res.data.items)
        isScroll.value = noticeList.value.length < res.data.count
        page.value++
    }).catch(() => {
        isScroll.value = true
    })
}

const goDetail = (notice) => {
    let old_notice = Cache.get("notice")
    // 如果之前已有公告，且点击的公告和之前的公告id相同，则缓存
    if (!(old_notice && old_notice.id == notice.id)) {
        Cache.set("notice", notice)
    }
    setTimeout(() => {
		uni.navigateTo({
			url: "/pagesProduct/notice/detail/index",
		});
    }, 100)
}

// 触发列表刷新的回调
const updateListCb = () => {
    updateVal.value = updateVal.value + 1
}

onMounted(() => {
    getNoticeList()
    uni.$on('noticeUpdateList', updateListCb)
})

onShow(() => {})

onUnload(() => {
    uni.$off('noticeUpdateList', updateListCb)
})

// 监听 updateVal 变化
watch(updateVal, (val) => {
    isScroll.value = true
    page.value = 1
    noticeList.value = []
    getNoticeList()
})

// 触底加载更多
onReachBottom(()=>{
 getNoticeList()
})

</script>

<style scoped lang="less">
	.list {
		padding: 0 32rpx;
		.item {
			height: 104rpx;
			font-size: 28rpx;
			color: #111;
			font-weight: 600;
			.title {
				max-width: 80%;
				overflow: hidden;
				&.line1{
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap
				}
			}
			.iconfont {
				font-size: 20rpx;
                color: #777;
			}
		}
		.acea-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
	.noCommodity{
		width: 100%;
		.pictrue{
			margin: 0 auto;
		}
	}
</style>
