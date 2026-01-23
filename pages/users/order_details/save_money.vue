<template>
    <view>
		<view class='order-details'>
			<view class='wrapper'>
				<view class='item acea-row row-between'>
					<view>订单编号：</view>
					<view class='conter acea-row row-middle row-right'>{{ orderInfo.order_no || '--' }}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>订单说明：</view>
					<view class='conter acea-row row-middle row-right'>{{ orderInfo.remark || '--' }}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>下单时间：</view>
					<view class='conter'>{{orderInfo.created_at || '--'}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>支付状态：</view>
					<view class='conter'>{{ pay_status || '--' }}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>价格：</view>
					<view class='conter'>￥{{ orderInfo.pay_price || '--' }}</view>
				</view>
			</view>
			<view class='wrapper'>
				<view class='item acea-row row-between'>
					<view>实付款：</view>
					<view class='conter'>￥{{ orderInfo.total_price || '--' }}</view>
				</view>
			</view>
            <view class="content-clip"></view>
            <view class='footer acea-row row-right row-middle' v-if="showPay">
				<view class='bnt bgColor' @tap='goPay(orderInfo.id)'>立即付款</view>
			</view>
		</view>
	</view>
</template>

<script setup lang='ts'>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { mineApi } from "@/business/api/index.ts";
import uerStore from "@/business/store/modules/mine";
import uerStore2 from "@/business/store/index";
const store = uerStore();
const store2 = uerStore2();
const order_id = ref('');
const middle_token_ = ref('');
const orderInfo = ref({});
const is_loading = ref(false);

const showPay = computed(() => {
    return orderInfo.value.id == 0 || orderInfo.value.id
})

function hideLoading_ (time) {
	setTimeout(() => {
		uni.hideLoading()
		is_loading.value = false;
	},time ? time : 0)
}

const pay_status = computed(() => {
    if (orderInfo.value.status == 0) {
        return '待支付'
    } else if (orderInfo.value.status == 1) {
        return '已支付'
    } else if (orderInfo.value.status == -1) {
        return '已取消'
    }
})
function getOrderInfo() {
    uni.showLoading({
        title: '加载中',
        mask: true
    })
    mineApi.getSaveMoneyOrderDetail(order_id.value).then(res => {
        orderInfo.value = res.data.order_info;
        hideLoading_()
    }).catch(err => { 
        hideLoading_()
    });
}

// 自动登录
async function autoLogin(token_) {
    const { data } = await mineApi.wxchatAutoLoginApi({ middle_token: token_ })
    uni.setStorageSync('middle_token', data.middle_token);
    uni.setStorageSync('token', data.token);
    uni.setStorageSync('isLogin', true);
    store.isLogin = true;
    store2.$patch((state) => {
        state.token = data.token;
        state.middle_token = data.middle_token;
    })
}

async function login_kkyz (middle_token_,code) {
    await autoLogin(middle_token_)
    // 获取openid
    await mineApi.bindMiniProgram({ code, appid: 'wx29df62cbac3abc9a' })
    // 获取订单详情
    getOrderInfo()
}

function goPay (id_) {
    if (is_loading.value) return;
    is_loading.value = true;
    uni.showLoading({
        title: '加载中',
        mask: true
    })
    try {
        mineApi.genMiniprogramPayment(id_).then(res => {
			if (res.data.status == 'error') {
				hideLoading_()
				setTimeout(() => {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000,
					});
				},200)
				return;
			}
            let jsConfig = JSON.parse(res.data.payInfo)
            let { timeStamp,nonceStr,signType,paySign } = jsConfig
            hideLoading_()
            uni.requestPayment({
                provider: 'wxpay',
                timeStamp,
                nonceStr,
                signType,
                paySign,
                package: jsConfig.package,
                success: (e) => {
                    uni.redirectTo({
                        url: `/pages/users/order_pay_status/save_money?order_id=${order_id.value}`
                    });
                },
                fail: (e) => {
                },
                complete: () => {
                    hideLoading_(2000)
                }
            });
        }).catch(err => {
			hideLoading_(2000)
        });
    } catch (error) {
        hideLoading_(2000)
    }
}

onLoad((option) => {
    if (option.middle_token) {
        let middle_token = decodeURIComponent(option.middle_token);
        middle_token_.value = decodeURIComponent(option.middle_token);
        uni.setStorageSync('middle_token_',middle_token_.value)
        order_id.value = decodeURIComponent(option.order_id);
        uni.login({
            provider: 'weixin',
            success: async (res) => {
                const code = res.code;
                // 看看宇宙登入
                login_kkyz(middle_token,code)
            },
            fail: (err) => {}
        });
    }
});

</script>
<style scoped lang='scss'>
    .event_bg{
		background: #FF7F00;
	}
	.event_color{
		color: #FF7F00;
	}
	.presell_bg_header {
		background: linear-gradient(90deg, #F11B09 0%,#F67A38 100%);
	}
	.goodCall {
		text-align: center;
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		border-top: 1px solid #f0f0f0;
		font-size: 30rpx;
		line-height: 86rpx;
		background: #fff;
		color: #282828;
		.icon-kefu {
			font-size: 32rpx;
			margin-right: 15rpx;
		}
		/* #ifdef MP */
		button {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 86rpx;
			font-size: 30rpx;
			color: #e93323;
		}
		/* #endif */
	}

	.order-details .header {
		padding: 0 30rpx;
		height: 150rpx;
		background-image: linear-gradient(to right, #F11B09 0%, #F67A38 100%);
		&.presell_header{
			background-repeat: no-repeat;
			background-size: cover;
			padding: 35rpx 50rpx;
			.data{
				margin: 8rpx 0 0 26rpx;
				.state{
					font-weight: normal;
					font-size: 24rpx;
				}
			}
		}
	}
	.order-details .header.on {
		background-color: #666 !important;
	}
	.order-details .header .pictrue {
		width: 110rpx;
		height: 110rpx;
	}
	.order-details .header .pictrue image {
		width: 100%;
		height: 100%;
	}
	.order-details .header .data {
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;
		margin-left: 27rpx;
	}
	.order-details .header .data.on {
		margin-left: 0;
	}
	.order-details .header .data .state {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 7rpx;
	}
	.presell_header .presell_payment{
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		margin-left: 26rpx;
		.iconfont{
			font-weight: normal;
			margin-right: 8rpx;
		}
	}
	.order-details .nav {
		background-color: #fff;
		font-size: 26rpx;
		color: #282828;
		padding: 25rpx 0;
	}
	.order-details .nav .navCon {
		padding: 0 40rpx;
	}
	.order-details .nav .on {
		color: #111111;
	}
	.order-details .nav .progress {
		padding: 0 65rpx;
		margin-top: 10rpx;
	}
	.order-details .nav .progress .line {
		width: 100rpx;
		height: 2rpx;
		background-color: #939390;
	}
	.order-details .nav .progress .iconfont {
		font-size: 25rpx;
		color: #939390;
		margin-top: -2rpx;
		&.t-color{
			color: #111111;
		}
	}
	.order-details .address {
		font-size: 26rpx;
		color: #868686;
		background-color: #fff;
		margin-top: 13rpx;
		padding: 35rpx 30rpx;
	}
	.order-details .address .name {
		font-size: 30rpx;
		color: #282828;
		margin-bottom: 15rpx;
	}
	.order-details .address .name .phone {
		margin-left: 40rpx;
	}
	.order-details .line {
		width: 100%;
		height: 3rpx;
	}
	.order-details .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .wrapper {
		background-color: #fff;
		margin-top: 12rpx;
		padding: 30rpx;
	}
	.order-details .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .wrapper .item~.item {
		margin-top: 20rpx;
	}
	.order-details .wrapper .item .conter {
		color: #868686;
		width: 460rpx;
		text-align: right;
	}
	.order-details .wrapper .item .virtual_image {
		margin-left: 50rpx;
	}
	.order-details .wrapper .item .virtual_image .picture{
		width: 106rpx;
		height: 106rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
		&:last-child{
			margin-right: 0;
		}
	}
	.order-details .wrapper .item .conter .copy {
		font-size: 20rpx;
		color: #333;
		border-radius: 17rpx;
		border: 1px solid #666;
		padding: 3rpx 15rpx;
		margin-left: 24rpx;
	}
	.order-details .wrapper .actualPay {
		border-top: 1px solid #eee;
		margin-top: 30rpx;
		padding-top: 30rpx;
	}
	.order-details .wrapper .actualPay .money {
		font-weight: bold;
		font-size: 30rpx;
	}
	.order-details .footer {
		width: 100%;
		position: fixed;
		bottom: 50rpx;
		// top: 0;
		left: 0;
		background-color: #fff;
		padding: 0 30rpx;
		height: 100rpx;
		height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		box-sizing: border-box;
	}
	.content-clip{
		height: 120rpx;
		height: calc(120rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.order-details .footer .bnt {
		width: 100%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        &:active {
            background-color: #fff;
            color: #000;
            transform: scale(1.01);
        }
	}
	.bgColor{
		background-color: #111111;
	}
	.order-details .footer .bnt.cancel {
		color: #aaa;
		border: 1px solid #ddd;
	}
	.order-details .footer .bnt~.bnt {
		margin-left: 18rpx;
	}
	.order-details .writeOff {
		background-color: #fff;
		margin-top: 13rpx;
		padding-bottom: 30rpx;
	}
	.order-details .writeOff .title {
		font-size: 30rpx;
		color: #282828;
		height: 87rpx;
		border-bottom: 1px solid #f0f0f0;
		padding: 0 30rpx;
		line-height: 87rpx;
	}
	.order-details .writeOff .grayBg {
		background-color: #f2f5f7;
		width: 590rpx;
		height: 384rpx;
		border-radius: 20rpx 20rpx 0 0;
		margin: 50rpx auto 0 auto;
		padding-top: 55rpx;
	}
	.order-details .writeOff .grayBg .pictrue {
		width: 290rpx;
		height: 290rpx;
		margin: 0 auto;
	}
	.order-details .writeOff .grayBg .pictrue image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .writeOff .gear {
		width: 590rpx;
		height: 30rpx;
		margin: 0 auto;
	}
	.order-details .writeOff .gear image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-details .writeOff .num {
		background-color: #f0c34c;
		width: 590rpx;
		height: 84rpx;
		color: #282828;
		font-size: 48rpx;
		margin: 0 auto;
		border-radius: 0 0 20rpx 20rpx;
		text-align: center;
		padding-top: 4rpx;
	}
	.order-details .writeOff .rules {
		margin: 46rpx 30rpx 0 30rpx;
		border-top: 1px solid #f0f0f0;
		padding-top: 10rpx;
	}
	.order-details .writeOff .rules .item {
		margin-top: 20rpx;
	}
	.order-details .writeOff .rules .item .rulesTitle {
		font-size: 28rpx;
		color: #282828;
	}
	.order-details .writeOff .rules .item .rulesTitle .iconfont {
		font-size: 30rpx;
		color: #333;
		margin-right: 8rpx;
		margin-top: 5rpx;
	}
	.order-details .writeOff .rules .item .info {
		font-size: 28rpx;
		color: #999;
		margin-top: 7rpx;
	}
	.order-details .writeOff .rules .item .info .time {
		margin-left: 20rpx;
	}
	.order-details .map {
		height: 86rpx;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		border-bottom: 1px solid #f0f0f0;
		margin-top: 13rpx;
		background-color: #fff;
		padding: 0 30rpx;
	}
	.order-details .map .place {
		font-size: 26rpx;
		width: 176rpx;
		height: 50rpx;
		border-radius: 25rpx;
		line-height: 50rpx;
		text-align: center;
	}
	.order-details .map .place .iconfont {
		font-size: 27rpx;
		height: 27rpx;
		line-height: 27rpx;
		margin: 2rpx 3rpx 0 0;
	}
	.order-details .address .name .iconfont {
		font-size: 34rpx;
		margin-left: 10rpx;
	}
	.refund {
		padding: 0 30rpx 30rpx;
		margin-top: 24rpx;
		background-color: #fff;
		.title {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #333;
			height: 86rpx;
			border-bottom: 1px solid #f5f5f5;
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
		.con {
			padding-top: 25rpx;
			font-size: 28rpx;
			color: #868686;
		}
	}
	.order-wrapper{
		margin-top: 15rpx;
		.title{
			display: flex;
			align-items: center;
			height: 86rpx;
			padding:0 30rpx;
			border-bottom: 1px solid #f0f0f0;
			background-color: #fff;
			.iconfont{
				font-size: 24rpx;
				color: #666;
				margin-top: 6rpx;
				margin-left: 5rpx;
			}
		}
		.goods-box{
			.item{
				display: flex;
				padding: 25rpx 30rpx 25rpx 30rpx;
				background-color: #fff;
				image{
					width: 130rpx;
					height: 130rpx;
					border-radius: 16rpx;
				}
				.info-box{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 25rpx;
					width: 450rpx;
					.msg{
						color: #868686;
						font-size: 20rpx;
					}
					.price{
						font-size: 26rpx;
						color: #1DB0FC;
					}
					.svip-img{
						width: 65rpx;
						height: 28rpx;
						margin: 4rpx 0 0 4rpx;
					}
				}
				.num{
					flex: 1;
					text-align: right;
					font-size: 26rpx;
					color: #868686;
				}
			}
			
			 .event_name{
				display: inline-block;
				margin-right: 9rpx;
				color: #fff;
				font-size: 20rpx;
				padding: 0 8rpx;
				line-height: 30rpx;
				text-align: center;
				border-radius: 6rpx;
			}
			.event_ship{
				font-size: 20rpx;
				margin-top: 10rpx;
			}
		}
		.event_progress{
			margin-top: 20rpx;
			background: #fff;
			.progress_name {
				padding-left: 30rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 24rpx;
				font-weight: bold;
				position: relative;
				color:  #1DB0FC;
				&::before{
					content: "";
					display: inline-block;
					width: 5rpx;
					height: 34rpx;
					background:  #1DB0FC;
					position: absolute;
					top: 15rpx;
					left: 0;
				}
			}
			.align_right{
				float: right;
				font-weight: bold;
			}
			.gColor{
				color:  #1DB0FC;
			}
			.progress_price{
				padding: 20rpx 30rpx;
				color: #999999;
				font-size: 22rpx;
			}
			.progress_pay{
				padding: 25rpx 30rpx;
				background: rgba(233, 51, 35,.1);
				font-size: 26rpx;
				color: #282828;
			}
		}
	}
    .acea-row {
        display:flex;
        flex-wrap:wrap;
    }
    .acea-row.row-middle {
        align-items: center
    }
    .acea-row.row-top {
        align-items: flex-start;
    }
    .acea-row.row-bottom {
        align-items: flex-end
    }
    .acea-row.row-center {
        justify-content: center
    }
    .acea-row.row-right {
        justify-content: flex-end;
    }
    .acea-row.row-left {
        justify-content: flex-start
    }
    .acea-row.row-between {
        justify-content: space-between
    }
    .acea-row.row-around {
        justify-content: space-around;
    }
    .acea-row.row-column-around {
        flex-direction: column;
        justify-content: space-around;
    }
    .acea-row.row-column {
        flex-direction: column
    }
    .acea-row.row-column-between {
        flex-direction: column;
        justify-content: space-between
    }
    .acea-row.row-center-wrapper {
        align-items: center;
    }
    .acea-row.row-between-wrapper {
        align-items: center;
        justify-content: space-between
    }
</style>