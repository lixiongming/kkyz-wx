<template>
	<view class="detail_box">
		<view class="title">{{noticeInfo.title}}</view>
		<view class="time">{{noticeInfo.send_time}}</view>
		<view class="txt">
            <uv-parse
            :content="noticeInfo.content.replace(/<br\/>/ig, '')"
            :tagStyle="tagStyle"
            ></uv-parse>
        </view>
	</view>
</template>
<script>
import Cache from '@/infrastructure/utils/cache';
	export default {
		components: {},
		data() {
			return {
                noticeInfo: {},
                tagStyle: {
					img: 'width:100%;display:block;'
				},
			};
		},
		created() {
            const noticeStr = Cache.get("notice")
            if (noticeStr) {
                this.noticeInfo = JSON.parse(noticeStr);
				console.log(this.noticeInfo)
            }
		},
		onBackPress() {
			uni.$emit('noticeUpdateList')
		},
		methods: {	
			
		}
	}
</script>

<style scoped lang="scss">
   ::v-deep img  {
	width: 686rpx;
    margin: 0px auto;
   } 
   ::v-deep p {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    text-indent: 0 !important;
   }
	.detail_box {
        padding: 32rpx;
        color: #111;
        .title {
            font-size: 32rpx;
            font-weight: 600;
        }
        .time {
            font-size: 24rpx;
            color: #777;
            margin: 32rpx 0;
        }
        // .txt {
        //     font-size: 28rpx;
        //     line-height: 32rpx;
        // }
    }
	  
</style>
