<template>
	<view class="CustomerList" :style="viewColor">
		<view>
			<template v-if="type == 0 && list.length>0">
				<view v-for="(item,index) in list" :key="index">
					<view v-if="item.merchant" class="item acea-row" @click="goPage(item)">
						<view class="logo">
							<image :src="item.merchant && item.merchant.mer_avatar" mode=""></image>
						</view>
						<view class="info">
							<view class="name">{{item.merchant ? item.merchant.mer_name : ''}}</view>
							<view class="con line1" v-if="item.last && item.last.msn_type == 1">{{item.last.msn}}</view>
							<view class="con line1" v-if="item.last && item.last.msn_type == 2">[表情]</view>
							<view class="con line1" v-if="item.last && item.last.msn_type == 3">[图片]</view>
							<view class="con line1" v-if="item.last && item.last.msn_type == 4">[商品]</view>
							<view class="con line1" v-if="item.last && (item.last.msn_type == 5 || item.last.msn_type == 6)">[订单]</view>
						</view>
						<view class="right-box">
							<view class="time">{{item.last && item.last.create_time.split(' ')[1] || ''}}</view>
							<view class="num" v-if="item.num>0">{{item.num}}</view>
						</view>
					</view>
				</view>
			</template>
			<template v-if="type == 1 && list.length>0">
				<view class="item acea-row" v-for="(item,index) in list" :key="index" @click="goPage(item)">
					<view class="logo">
						<image :src="(item.user && item.user.avatar) ? item.user.avatar : '/static/images/f.png'" mode=""></image>
					</view>
					<view class="info">
						<view class="name">{{item.user && item.user.nickname}}</view>
						<view class="con line1" v-if="item.last && item.last.msn_type == 1">{{item.last.msn}}</view>
						<view class="con line1" v-if="item.last && item.last.msn_type == 2">[表情]</view>
						<view class="con line1" v-if="item.last && item.last.msn_type == 3">[图片]</view>
						<view class="con line1" v-if="item.last && (item.last.msn_type == 4 || item.last.msn_type == 7)">[商品]</view>
						<view class="con line1" v-if="item.last &&  (item.last.msn_type == 5 || item.last.msn_type == 6)">[订单]</view>
					</view>
					<view class="right-box">
						<view class="time">{{item.last && item.last.create_time.split(' ')[1]}}</view>
						<view class="num" v-if="item.num>0">{{item.num}}</view>
					</view>
				</view>
			</template>
			<template v-if="list.length == 0">
				<emptyPage title="暂无数据~"></emptyPage>
			</template>
		</view>
	</view>
</template>
<script setup>
import { ref,computed } from 'vue'
import emptyPage from '@/components/emptyPage.vue'
import { serviceUserList } from "@/business/api/modules/user-old.ts";
import { serviceList } from "@/business/api/modules/user.ts";
import { toLogin } from '@/infrastructure/libs/login.js';
import useStore from '@/business/store/modules/mall.ts';
import useMine from '@/business/store/modules/mine.ts';
import { onLoad, onShow, onReady, onInit, onHide, onUnload,onReachBottom } from "@dcloudio/uni-app";
import util from '@/infrastructure/utils/utils.js'
const store = useStore()
const mine_store = useMine()
const isLogin = computed(() => mine_store.isLogin)
const viewColor = computed(() => store.viewColor)
const list = ref([])
const productId = ref(0)
const orderId = ref("")
const type = ref(0) // 0 用户 1客服
const timer = ref(null)
const page = ref(1)
const limit = ref(9999)
const mer_id = ref('')
const loading = ref(false)
const clear = ref(false)

const getList = (mer_id) => {
    loading.value = true
    if(type.value == 0){
        serviceList({
            page: page.value,
            limit: limit.value
        }).then(res => {
            list.value = res.data.list
            if(res.status == 400){
                clearInterval(timer.value)
                timer.value = null
                return util.Tips({
                    title: res.message
                })
            }	
        }).finally(v => {
            loading.value = false
            return util.Tips({
                title: v
            })
        }).catch(err => {
            return util.Tips({
                title: err
            })
        })
    } else {
        serviceUserList(mer_id, {
            page: page.value,
            limit: limit.value
        }).then(res => {
            list.value = res.data.list
            if(res.status == 400){
                clearInterval(timer.value)
                timer.value = null
                return util.Tips({
                    title: res.message
                })
            }
        }).finally(v => {
            loading.value = false
            clearInterval(timer.value)
            timer.value = null
            return util.Tips({
                title: v
            })
        }).catch(err => {
            clearInterval(timer.value)
            timer.value = null
            return util.Tips({
                title: err
            })
        })
    }				
}

const liveUpdate = () => {
    clear.value = false
    if(timer.value) {
        clearInterval(timer.value)
        timer.value = null	
    }  
    timer.value = setInterval(() => {
        if(clear.value){
            clearInterval(timer.value)
            return
        }
        // 用户
        (!loading.value) && getList(mer_id.value)
    }, 5000)	
}

const goPage = (item) => {
    item.num = 0
    if(type.value == 0){
        uni.navigateTo({
            url: `/pagesProduct/customer_list/chat?mer_id=${item.mer_id}`
        })
    } else {
        uni.navigateTo({
            url: `/pagesProduct/customer_list/chat?userId=${item.user.uid}&mer_id=${item.mer_id}`
        })
    }
}

const changeTitle = (e) => {
    mer_id.value = e.detail.value.toString()
}

onLoad((optios) => {
    type.value = optios.type
    mer_id.value = optios.mer_id
    if(isLogin.value){
        getList(mer_id.value)
    } else {
        toLogin()
    }
})

onShow(() => {
    if(isLogin.value){
        liveUpdate()
    } else {
        toLogin()
    }
})

onHide(() => {  
    if(timer.value) {  
        clearInterval(timer.value)
        timer.value = null
    }   
    clear.value = true
})

onUnload(() => {
    if(timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }  
    clear.value = true
})
</script>
<style lang="scss">
	.CustomerList {
		.spin {
			display: block;
			transform: rotate(180deg);
			font-size: 36rpx;
		}
		.popupn{
			position: fixed;
			width: 100%;
			text-align: center;
			top: 0;
			left: 0;
			background: #ffffff;
			height: 90rpx;
			line-height: 90rpx;
			z-index: 100;
			.title{
				max-width: 560rpx;
				margin: 0 auto;
				position: relative;
			}
			.iconfont{
				display: inline-block;
				position: relative;
				top: 4rpx;
				right: 0;
			}
			.mer_logo{
				width: 34rpx;
				height: 34rpx;
				position: relative;
				top: 6rpx;
				right: 10px;			
			}
			.mer_name{
				display: inline-block;
				max-width: 650rpx;
			}
			.invoice-content{
				background-color: #ffffff;
			}
		}
		.list_count{
			margin-top: 104rpx;
		}
		.item {
			align-items: center;
			border-bottom: 1px solid #eee;
			padding: 20rpx 30rpx;
			background-color: #fff;
			.logo image{
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
			}
			.info{
				width: 334rpx;
				margin-left: 20rpx;
				.con{
					margin-top: 10rpx;
					color: #999999;
					font-size: 24rpx;
				}
			}
			.right-box{
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				font-size: 20rpx;
				color: #BBBBBB;
				.time{
					margin-bottom: 10rpx;
				}
				.num{
					min-width: 6px;
					background-color: var(--view-theme);
					border-radius: 15px;
					font-size: 10px;
					padding: 0 4px;
					font-size: 20rpx;
					color: #fff;
				}
			}
		}
	}
</style>
