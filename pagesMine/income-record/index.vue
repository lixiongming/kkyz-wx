<template>
  	<view 
		class="income-record"
		:style="{
			height: window_height + 'px',
        }"
  	>
		<u-tabs class="head-tab" :list="down_menus" :activeStyle="{color: '#1B9AFF'}" lineColor="#1B9AFF" :inactiveStyle="{color: '#000000'}" :itemStyle="{ height: '42px' }" lineHeight="4" :current="current" @click="clickTab"></u-tabs>
        <view 
            class="content-box"
            :style="{
                height: (window_height - 42) + 'px',
                marginTop: '-10px',
                background: '#fff',
            }"    
        >
            <view v-if="current==3" style="padding-top: 20rpx;">
                <view class="head-box flex flex-ac jc-sb" style="height:44rpx;">
                    <view class="head-title">{{ tab_content_list[current].title + tab_content_list[current].priceSum + tab_content_list[current].unit }}</view>
                    <view class="date-select">
                        <picker mode="date" :end="init_month" fields="month" :value="tab_content_list[current].month" @change="bindDateChange($event)">
                            <text class="date-text">{{ tab_content_list[current].month }}</text>
                            <uni-icons color="#000000" type="down" size="12"></uni-icons>
                        </picker>
                    </view>
                </view>
                <view class="head-box flex flex-ac jc-sb" style="height:44rpx;margin-bottom: 24rpx;">
                  <view class="head-title">兑换券：{{ tab_content_list[current].ticketSum }}张</view>
                </view>
            </view>
            <view class="head-box flex flex-ac jc-sb" v-else>
                <view class="head-title">{{ tab_content_list[current].title + tab_content_list[current].num + tab_content_list[current].unit }}</view>
                <view class="date-select">
                    <picker mode="date" :end="init_month" fields="month" :value="tab_content_list[current].month" @change="bindDateChange($event)">
                        <text class="date-text">{{ tab_content_list[current].month }}</text>
                        <uni-icons color="#000000" type="down" size="12"></uni-icons>
                    </picker>
                </view>
            </view>
            <scroll-view 
                :scroll-y="true" 
                :style="{
                    height: (window_height - 42 - 43) + 'px',
                    background: '#fff',
                }"
                :lower-threshold="120" 
                @scrolltolower="tabPageUpdate(current)"
                :scroll-top="top_distance"
                @scroll="scorllEvent"
            >
                <template v-if="content_list[current]?.length">
                    <view v-if="current==3">
                        <view class="info-item" v-for="item in content_list[current]" :key="item.id + item.img" style="height: auto;">
                            <view class="flex flex-ac jc-sb" style="margin-bottom: 40rpx;">
                                <text class="info-name">{{ item.merchant?.mer_name }}</text>
                                <text class="info-nice">{{ item.order?.user?.nickname }}</text>
                            </view>
                            <view v-for="(item1,index1) in item.order?.orderProduct" :key="index1" class="info-store flex">
                                <image mode="aspectFill" class="info-img1" :src="item1.cart_info?.productAttr.product.image"></image>
                                <view class="store-box">
                                    <view class="flex flex-ac jc-sb">
                                        <view class="info-store-name nowrap">{{ item1.cart_info?.productAttr.product.store_name }}</view>
                                        <text class="info-store-price">¥{{ item1.cart_info?.productAttr.product.price }}</text>
                                    </view>
                                    <view class="flex flex-ac jc-sb" style="margin-top: 12rpx;">
                                        <view class="info-store-name nowrap">{{ item1.cart_info?.productAttr?.sku }}</view>
                                        <text class="info-store-price">x{{ item1.product_num }}</text>
                                    </view>
                                </view>
                            </view>
                            <view class="info-date flex flex-ac jc-sb">
                                <view class="info-time">{{ item.order?.create_time }}</view>
                                <view class="info-take">已结算：{{ item.type==1? item.brokerage+'米粒': item.ticket+'券' }}</view>
                            </view>
                            <view class="info-order">订单编号：{{ item.order?.order_sn }}</view>
                        </view>
                    </view>
                    <view v-else>
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
                    </view>
                </template>
                <c-null style="height: 500rpx" title="暂无数据" v-else></c-null>
            </scroll-view>
        </view>
        

  	</view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, nextTick } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { getInviteListTicketApi, getPromotionListTicketApi, getShoppingListTicketApi,getEarningsSellApi} from '@/business/api/modules/api-new';

const window_height = uni.getSystemInfoSync().windowHeight;
const down_menus = ref([
    { name: "购物佣金", value: 0},
    { name: "达人佣金", value: 1},
    { name: "新朋友", value: 2},
    { name: "带货佣金", value: 3},
]);
const current = ref(0)
const tab_content_list = ref([
    { key: 0, title: '累计佣金：', num: 0, unit: '券', month: ''},
    { key: 1, title: '累计佣金：', num: 0, unit: '券', month: ''},
    { key: 2, title: '总人数：', num: 0, unit: '', month: ''},
    { key: 3, title: '米粒：', num: 0, unit: '', month: '',priceSum: 0, ticketSum: 0},
])
const content_list = ref([])

// 参数
const params = ref({
    source_type: 'wx-applet',
    page: 1,
    pageSize: 20,
})
const loadend = ref(false);
const loading = ref(false);
const init_month = ref('')
const top_distance = ref(0);
const old_top_distance = ref(0);


function init() {
    // 获取当前年月
    getYearMonthLocal();
    tabPageUpdate(current.value)
}

// 列表滚动事件
function scorllEvent(e) {
    old_top_distance.value = e.detail.scrollTop;
}

async function tabPageUpdate(index) {
    try {
        if (loadend.value) return;
		if (loading.value) return;
        loading.value = true;
        let res;
        uni.showLoading({
            title: '加载中',
            mask: true,
        });
        if (params.value.page == 1) {
            top_distance.value = old_top_distance.value;
            nextTick(() => {
                top_distance.value = 0;
            });
        }
        if (index == 0) {
            res = await getShoppingListTicketApi({ ...params.value, month: tab_content_list.value[index].month });
        } else if (index == 1) {
            res = await getPromotionListTicketApi({ ...params.value, month: tab_content_list.value[index].month });
        } else if (index == 2){
            res = await getInviteListTicketApi({ ...params.value, month: tab_content_list.value[index].month });
        } else {
            res = await getEarningsSellApi({ ...params.value, month: tab_content_list.value[index].month });
            console.log(res)
            if(res.code==200){
                tab_content_list.value[index].priceSum = res.data.priceSum;
                tab_content_list.value[index].ticketSum = res.data.ticketSum;
                console.log( tab_content_list.value[index])
            }
        }
        uni.hideLoading();
        tab_content_list.value[index].num = res.data?.total || 0;
        let list = res.data.items || [];
        list = filterListData(index, list);
		let cur_loadend = list.length < params.value.pageSize;
        content_list.value[index] = params.value.page ? list : content_list.value[index].concat(list);
        loadend.value = cur_loadend;
        loading.value = false;
        params.value.page = params.value.page + 1;
    } catch(err) {
        loading.value = false;
        uni.hideLoading();
    }
}
// 数据过滤
function filterListData(index, list) {
    // 固定字段
    let fixed_fields = {}
    if (index == 0) {
        fixed_fields.img = imgUrlEvent('/images/wx-applet/customer-service/income-icon1.png', 'aliyunImgUrl');
        fixed_fields.title_label = '';
        fixed_fields.result_label = '订单金额：';
        fixed_fields.desc_label = '佣金：';
    } else if (index == 1) {
        fixed_fields.img = imgUrlEvent('/images/wx-applet/customer-service/income-icon2.png', 'aliyunImgUrl');
        fixed_fields.title_label = '来源：';
        fixed_fields.result_label = '订单金额：';
        fixed_fields.desc_label = '佣金：';
    } else {
        fixed_fields.title_label = '';
        fixed_fields.result_label = '手机号：';
        fixed_fields.desc_label = '';
        fixed_fields.desc_value = '';
    }
    return list.map(v => {
        let async_fields = {};
        if (index == 0) {
            async_fields.result_value = v.pay_price;
            async_fields.desc_value = v.actual_bonus_price + '券';
            async_fields.create_at = v.create_time;
            async_fields.title_value = v.title;
        } else if (index == 1) {
            async_fields.result_value = v.pay_price;
            async_fields.desc_value = v.actual_bonus_price + '券';
            async_fields.create_at = v.create_time;
            async_fields.title_value = v.title;
        } else {
            async_fields.result_value = v.mobile;
            async_fields.create_at = v.created_at;
            async_fields.img = v.avatar;
            async_fields.title_value = v.nickname;
        }
        return { ...v, ...fixed_fields, ...async_fields }
    })
}


function getYearMonthLocal() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let date_str = `${year}-${month}`;
    init_month.value = date_str;
    tab_content_list.value.forEach((v) => {
        v.month = date_str;
    })
    return date_str;
}

onLoad((options) => {
	options.tab_current && (current.value = options.tab_current);
})

onShow(() => {
    init()
})

// 点击tabs
function clickTab(val) {
    if (val.index == current.value) return;
    console.log('点击tabs', val);
    current.value = val.index;
    loadend.value = false;
    params.value.page = 1;
    // 切换对应tab页列表更新
    tabPageUpdate(val.index);
}

// 时间修改
function bindDateChange(e){
    const value = e.detail.value
    console.log("value-->", value)
    tab_content_list.value[current.value].month = value;
    loadend.value = false;
    params.value.page = 1;
    // 切换对应tab页列表更新
    tabPageUpdate(current.value);
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
            .date-text {
                padding-right: 8rpx;
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
        .info-img1{
            width: 120rpx;
            height: 120rpx;
            border-radius: 16rpx;
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
        .info-name{
            font-family: PingFangSC-Regular;
            font-size: 24rpx;
            color: #000000;
        }
        .info-nice{
            font-family: PingFangSC-Regular;
            font-size: 24rpx;
            color: #FA6262;
        }
        .info-store{
            margin-bottom: 12rpx;
        }
        .store-box{
            width: calc(100% - 136rpx);
        }
        .info-store-name{
            max-width: 370rpx;
            height: 40rpx;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #000000;
        }
        .info-store-price{
            font-family: PingFangSC-Regular;
            font-size: 28rpx;
            color: #000000;
            letter-spacing: 1.22rpx;
        }
        .info-order{
            width: 670rpx;
            height: 74rpx;
            background: #F9F9F9;
            border-radius: 16rpx;
            padding: 20rpx;
            font-family: PingFangSC-Regular;
            font-size: 24rpx;
            color: #000000;
        }
        .info-date{
            margin-top: 8rpx;
            margin-bottom: 18rpx;
        }
        .into-time{
            font-family: PingFangSC-Regular;
            font-size: 24rpx;
            color: #A5A5A5;
        }
        .info-take{
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            font-size: 28rpx;
            color: #000000;
        }
    }
}
/deep/ .u-tabs__wrapper__nav {
    justify-content: space-between;
    padding: 0 20rpx;
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
/deep/.u-tabs__wrapper__nav__item{
    flex: 1;
}


</style>
