<template>
    <view class="rule relative" :style="{ height: hei + 'px' ,background: `url(${imgUrlEvent('/images/wx-applet/intelligent/rule-bg.png','aliyunImgUrl')}) no-repeat`}">
        <Inav title="佣金规则" bgcolor="transparent" fontColor="#000000">
        </Inav>
        <view class="warp">
            <view class="content">
                <view class="title">规则说明</view>
                <view class="line"></view>
                <view v-html="content" class="txt"></view>
            </view>
        </view>
    </view>
</template>

<script setup>
	import { ref } from "vue";
	import {onShow} from "@dcloudio/uni-app";
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
    import Inav from "@/views/components/i-nav.nvue";
    import { getExplainApi } from '@/business/api/modules/intelligent';

	const hei = uni.getSystemInfoSync().windowHeight;
    const title = ref();
    const content = ref();

	function getExplain () {
		getExplainApi({tag: 'sell_commission_rules'}).then(res=>{
            if(res.code==200){
                title.value = res.data.title;
                content.value = res.data.content
            }
            
            console.log(res);
		})
	}	

    onShow(()=>{
        getExplain()
    })
</script>

<style scoped lang="scss">
	.rule {
        background: #F9F9F9;
        background-size: 100% 600rpx!important; 
	}
    .header {
        position: relative;
        width: 750rpx;
        height: 176rpx;
        margin-bottom: 20rpx;
    }

    .title{
        font-weight: 500;
        font-size: 36rpx;
        color: #000000;
    }
    .line{
        width: 100%;
        margin-top: 24rpx;
        margin-bottom: 32rpx;
        border-bottom: 1px solid rgba(241, 241, 241, 1);
    }
    .content{
        margin-top: 20rpx;
        width: 710rpx;
        // height: 700rpx;
        background: #FFFFFF;
        border-radius: 16rpx;
        padding: 40rpx 32rpx;
        margin-left: 20rpx;
    }
    .txt{
        color: #000000;
        letter-spacing: 1.22rpx;
    }
</style>
