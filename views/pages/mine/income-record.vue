<template>
  	<view 
		class="income-record"
		:style="{
			height: window_height + 'px',
        }"
  	>
		<u-tabs class="head-tab" :list="downMenus" :activeStyle="{color: '#1B9AFF'}" lineColor="#1B9AFF" :inactiveStyle="{color: '#000000'}" :itemStyle="{ height: '42px' }" lineHeight="4" :current="current" @click="clickTab"></u-tabs>
        <view 
            class="content-box"
            :style="{
                height: (window_height - 42) + 'px',
                marginTop: '-10px',
                background: '#fff',
            }"    
        >
            <view class="head-box flex flex-ac jc-sb">
                <view class="head-title">{{ tab_content_list[current].title + tab_content_list[current].num + tab_content_list[current].unit }}</view>
                <view class="date-select">
                    <text class="date-text">2025-08</text>
                    <uni-icons color="#000000" type="down" size="12"></uni-icons>
                </view>
            </view>
            <scroll-view :scroll-y="true" :style="{
                height: (window_height - 42 - 43) + 'px',
                background: '#fff',
            }">
                <view class="info-item flex flex-ac jc-sb" v-for="item in content_list[current]" :key="item.id + item.img">
                    
                    <view class="info-left flex flex-ac">
                        <image mode="aspectFill" class="info-img" :src="item.img"></image>
                        <view class="info-title flex flex-column jc-sb">
                            <view class="title-text">{{ item.title_label + item.title_value }}</view>
                            <view class="result-text">{{ item.result_label + item.result_value }}</view>
                        </view>
                    </view>
                    <view class="info-right flex flex-column jc-sb">
                        <view class="desc-date">{{ item.create_at }}</view>
                        <view class="desc-text">{{  item.desc_label + item.desc_value }}</view>
                    </view>
                </view>
            </scroll-view>
        </view>
        

  	</view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { mineApi } from "@/business/api/index";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";

const window_height = uni.getSystemInfoSync().windowHeight;
const downMenus = ref([
    { name: "购物佣金", value: 0},
    { name: "推广达人佣金", value: 1},
    { name: "邀请新朋友明细", value: 2},
]);
const current = ref(0)
const tab_content_list = ref([
    { key: 0, title: '累计佣金：', num: 0, unit: '券' },
    { key: 1, title: '累计佣金：', num: 0, unit: '券' },
    { key: 2, title: '总人数：', num: 0, unit: '' },
])
const content_list = ref([
    [
        { 
            id: 1,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon1.png', 'aliyunImgUrl'),
            title_label: '',
            title_value: '商城购物',
            result_label: '金额：',
            result_value: '¥888.98',
            create_at: '2025-08-07  09:22',
            desc_label: '佣金：',
            desc_value: '2202222.236555券',
        },
        { 
            id: 2,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon1.png', 'aliyunImgUrl'),
            title_label: '',
            title_value: '商城购物',
            result_label: '金额：',
            result_value: '¥888.98',
            create_at: '2025-08-07  09:22',
            desc_label: '佣金：',
            desc_value: '2202222.236555券',
        },
        { 
            id: 3,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon1.png', 'aliyunImgUrl'),
            title_label: '',
            title_value: '商城购物',
            result_label: '金额：',
            result_value: '¥888.98',
            create_at: '2025-08-07  09:22',
            desc_label: '佣金：',
            desc_value: '2202222.236555券',
        },
    ],
    [
        { 
            id: 1,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon2.png', 'aliyunImgUrl'),
            title_label: '来源：',
            title_value: '推广用户下单',
            result_label: '金额：',
            result_value: '¥888.98',
            create_at: '2025-08-07  09:22',
            desc_label: '佣金：',
            desc_value: '2202222.236555券',
        },
        { 
            id: 2,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon2.png', 'aliyunImgUrl'),
            title_label: '来源：',
            title_value: '推广用户下单',
            result_label: '金额：',
            result_value: '¥888.98',
            create_at: '2025-08-07  09:22',
            desc_label: '佣金：',
            desc_value: '2202222.236555券',
        },
        { 
            id: 3,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon2.png', 'aliyunImgUrl'),
            title_label: '来源：',
            title_value: '推广用户下单',
            result_label: '金额：',
            result_value: '¥888.98',
            create_at: '2025-08-07  09:22',
            desc_label: '佣金：',
            desc_value: '2202222.236555券',
        },
    ],
    [
        { 
            id: 1,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon3.png', 'aliyunImgUrl'),
            title_label: '',
            title_value: '昵称15226665',
            result_label: '手机号：',
            result_value: '188****1234',
            create_at: '2025-08-07  09:22',
            desc_label: '',
            desc_value: '',
        },
        { 
            id: 2,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon3.png', 'aliyunImgUrl'),
            title_label: '',
            title_value: '昵称15226665',
            result_label: '手机号：',
            result_value: '188****1234',
            create_at: '2025-08-07  09:22',
            desc_label: '',
            desc_value: '',
        },
        { 
            id: 3,
            img: imgUrlEvent('/images/wx-applet/customer-service/income-icon3.png', 'aliyunImgUrl'),
            title_label: '',
            title_value: '昵称15226665',
            result_label: '手机号：',
            result_value: '188****1234',
            create_at: '2025-08-07  09:22',
            desc_label: '',
            desc_value: '',
        },
    ],
])

onLoad(() => {
	
})

// 点击tabs
function clickTab(val) {
    console.log('点击tabs', val);
    current.value = val.index;
    // 切换对应tab页列表更新
    // tabPageUpdate(val.index);
}


</script>

<style lang="less" scoped>
.income-record {
	.head-tab {
        background: #F9F9F9;
        font-size: 28rpx;
        
    }
    .content-box {
        background: #fff;
        border-radius: 30rpx 30rpx 0 0;
        .head-box {
            padding: 0 40rpx;
            height: 86rpx;
            .head-title {
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                font-size: 24rpx;
                color: #000000;
            }
            .date-select {
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                font-size: 24rpx;
                color: #000000;
            }
        }
    }
    .info-item {
        background: #FFFFFF;
        box-shadow: 0 0 20rpx 12rpx #eeeeee80;
        border-radius: 16rpx;
        padding: 28rpx 20rpx;
        margin: 0 20rpx 16rpx;
        height: 136rpx;
        &:first-child {
            margin: 16rpx 20rpx 16rpx;
        }
        .info-img{
            width: 80rpx;
            height: 80rpx;
            margin-right: 16rpx;
        }
        .info-left {
            height: 88rpx;
            .info-title {
                height: 88rpx;
            }
            .title-text {
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                font-size: 28rpx;
                color: #000000;
            }
            .result-text {
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 24rpx;
                color: #A5A5A5;
            }
        }
        .info-right {
            height: 88rpx;
            .desc-date {
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 24rpx;
                color: #A5A5A5;
                text-align: right;
            }
            .desc-text {
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                font-size: 24rpx;
                color: #1B9AFF;
                text-align: right;
            }
        }
    }
}
/deep/ .u-tabs__wrapper__nav {
    justify-content: space-between;
    padding: 0 38rpx;
    background: #F9F9F9;
}
/deep/ .u-tabs__wrapper__nav__item__text{
    font-weight: 600;
    font-size: 28rpx;
}
/deep/ .u-tabs__wrapper__nav__line {
    bottom: 10rpx;
}
/deep/ .u-tabs {
    padding-bottom: 20rpx;
}

</style>
