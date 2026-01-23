<template>
	<view class="refund-detail" :style="mall_store.viewColor">
		<view class="head">
			<block v-if="type == -1">
				<view class="txt">退款失败</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 0">
				<view class="txt">审核中</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 1">
				<view class="txt">请退货并填写物流信息</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == 2">
				<view class="txt">请等待商家收货并退款</view>
				<view class="time">还剩：				
				<countDown :is-day="true" :tip-text="' '" :day-text="'天'" :hour-text="':'" :minute-text="':'" :second-text="' '"
				 :datatime="datatime"></countDown>
				</view>
			</block>
			<block v-if="type == 3">
				<view class="txt">退款成功，金额 ¥{{detail.refund_price}}</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
			<block v-if="type == -2">
				<view class="txt">已取消退货申请</view>
				<view class="time">申请时间：{{detail.status_time}}</view>
			</block>
		</view>
		<!-- 拒绝 -->
		<view class="box" v-if="type == -1">
			<view class="txt">拒绝退款原因</view>
			<view class="des">{{detail.fail_message}}</view>
		</view>
		<!-- 待退货 -->
		<view class="info-box" v-if="type == 1">
			<view class="title">商家已同意您的退货申请，请尽早退货</view>
			<view class="store-info">
				<view class="text">收货人姓名：<text class="info">{{detail.mer_delivery_user}}</text></view>
				<view class="text">收货人联系方式：<text class="info">{{detail.phone}}</text></view>
				<view class="text">收货人地址：<text class="des">{{detail.mer_delivery_address}}</text></view>
				<view class="red-txt">
					<text class="iconfont icon-zhuyi-copy"></text>请按以上收货信息将商品退回
				</view>
			</view>
		</view>
		<!-- 待收货 -->
		<view class="info-box" v-if="type == 2">
			<view class="title">商家收货并验货无误，将操作退款给您</view>
			<view class="store-info">
				<view class="text">收货人姓名：<text class="info">{{detail.mer_delivery_user}}</text></view>
				<view class="text">收货人联系方式：<text class="info">{{detail.phone}}</text></view>
				<view class="text">收货人地址：<text class="des">{{detail.mer_delivery_address}}</text></view>
			</view>
		</view>
		<view class="info-box">
			<view class="title">退款信息</view>
			<view class="product-box">
				<view class="product-item" v-for="(item,index) in detail.refundOrderProduct" :key="index">
					<image class="img-box" :src="item.orderProduct.cart_info.productAttr.image" mode="" v-if="item.orderProduct.cart_info && item.orderProduct.cart_info.productAttr && item.orderProduct.cart_info.productAttr.image"></image>
					<image class="img-box" :src="item.orderProduct.cart_info.product.image" mode="" v-else></image>
					<view class="msg">
						<view class="name line1"><text v-if="item.orderProduct.cart_info.product_type === 2" class="event_name event_bg">预售</text>{{item.orderProduct.cart_info.product.store_name}}</view>
						<view class="des">{{item.orderProduct.cart_info.productAttr.sku}}</view>
						<view class="price">￥{{item.orderProduct.product_type == 3 ? item.orderProduct.cart_info.productAssistAttr.assist_price : item.orderProduct.product_type == 4 ? item.orderProduct.cart_info.activeSku.active_price : item.orderProduct.cart_info.productAttr.price}}</view>
						<view class="num">x {{item.refund_num}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="item">
				<view class="label">订单编号：</view>
				<view class="txt flex">
					<text>{{detail.refund_order_sn}}</text>
					<!-- #ifdef H5 -->
						<text class='copy copy-data' :data-clipboard-text="detail.refund_order_sn">复制</text>
					<!-- #endif -->
					<!-- #ifdef MP -->
						<text class='copy' @tap='copy'>复制</text>
					<!-- #endif -->
				</view>
			</view>
			<view class="item">
				<view class="label">退款金额：</view>
				<view class="txt flex">
					<text>¥ {{detail.refund_price}}</text>
				</view>
			</view>
			<view class="item">
				<view class="label">申请件数：</view>
				<view class="txt flex">
					<text>{{detail.refund_num}}</text>
				</view>
			</view>
			<view class="item">
				<view class="label">申请时间：</view>
				<view class="txt flex">
					<text>{{detail.create_time}}</text>
				</view>
			</view>
			<view class="item">
				<view class="label">备注说明：</view>
				<view class="txt flex">
					<text>{{detail.mark ? detail.mark : ""}}</text>
				</view>
			</view>
			<view class="item" style="display: block;">
				<view class="label">退款凭证：</view>
				<view class="upload-img">
					<view class="img-item" v-for="(item,index) in detail.pics" :key="index">
						<image :src="item" mode="" @click="loookImg(item,index)"></image>
					</view>
				</view>
			</view>
			<view class="btn-wrapper">
				<block v-if="type==-1">	
					<view class="btn" @click="applyAgain(detail)">再次申请</view>
				</block>
				<block v-else-if="type==1">
					<view class="btn gray" @click="cancelSales">取消售后</view>
					<view class="btn" @click="goPage">退回商品</view>
				</block>
				<block v-else-if="type==2">
					<view class="btn" @click="go">查看物流</view>
				</block>
				<block v-else-if="type==0">
					<view class="btn gray" @click="cancelSales">取消售后</view>
				</block>
				<block v-if="detail.merchant && detail.welfare_post_id == 0">
					<view v-if="detail.merchant.service && detail.merchant.service.length" class="btn" @click="goService">联系商家</view>
					<view v-else class="btn" @click="call(detail.merchant.service_phone)">联系商家</view>
				</block>
				<block v-else-if="detail.welfarePost && detail.welfare_post_id > 0">
					<view class="btn" @click="postStationPhone(detail.welfarePost)">联系商家</view>
				</block>
			</view>
		</view>
	</view>
</template>
<script lang="js" setup>
	import { ref  } from 'vue'
	import { onLoad } from "@dcloudio/uni-app";
	import { refundDetailApi, refundCancelApi } from '@/business/api/modules/order'
	import countDown from '@/components/countDown'
	import util  from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store()
	const type = ref(0)
	const refund_order_id = ref(0)
	const detail = ref('')
	const datatime = ref(0)
	
	onLoad((options) => {
		refund_order_id.value = options.id
		getDetail()
	})
	// 小小溜坤学作赋，
	// 词不达意语更俗。
	// 妄想沽名学子建，
	// 摆的架势似德祖。
	//联系商家拨打电话
	function call(service){
		if(service){
			uni.showModal({
				title: '提示',
				content: '暂无在线客服，确定拨打客服电话:'+detail.value.merchant.service_phone+'吗？',
				success: function(res) {
					if (res.confirm) {
						uni.makePhoneCall({
						  phoneNumber: detail.value.merchant.service_phone,
						});
					}
				}
			})
		}else{
			return util.Tips({
				title: '暂无可用客服'
			})
		}
	}
	//查看大图
	function loookImg(item,index){
		uni.previewImage({
			urls: detail.value.pics,
			current: detail.value.pics[index]
		});
	}
	function getDetail(){
		refundDetailApi({ refund_order_id: refund_order_id.value }).then(res=>{
			// status 0审核中 1待发货 2待收货 3已退款 -1已拒绝 
			type.value = res.data.status
			detail.value = res.data
			datatime.value = res.data.auto_refund_time;
			
		})
	}
	function goPage(){
		uni.navigateTo({
			url:'/pagesOrder/refund/goods/index?id='+detail.value.refund_order_id
		})
	}
	function applyAgain(item){
		uni.navigateTo({
			url:`/pagesOrder/order-details/index?order_id=${item.refundOrderProduct[0].orderProduct.order_id}`
		})
	}
	function go(){
		uni.navigateTo({
			url:`/pagesOrder/refund/logistics?orderId=${detail.value.refund_order_id}`
		})
	}
	/**
	 * 
	 * 剪切订单号
	 */
	// #ifndef H5
	function copy() {
		uni.setClipboardData({
			data: detail.value.refund_order_sn
		});
	}
	// #endif
	// 客服
	function goService(){
		uni.navigateTo({
			url:`/pagesProduct/customer_list/chat?mer_id=${detail.value.mer_id}&uid=${detail.value.uid}&refund_order_id=${detail.value.refund_order_id}`
		})
	}
	// 取消售后
	function cancelSales(){
		uni.showModal({
		  content: '确定要取消售后？',
		  success: function(res) {
		    if(res.confirm) {
		      refundCancelApi({ refund_order_id: detail.value.refund_order_id }).then(res => {
		      	if (res.code === 200) {
		      		util.Tips({
		      			title: res.message
		      		});
					getDetail();
				}
		      })
		    } else if(res.cancel) {
		      console.log('用户点击取消');
		    }
		  }
		});
	}
	// 联系驿站
	function postStationPhone(data){
		 uni.showModal({
		  content: '确定拨打：' + data.mobile + ' 吗？',
		  success: function(res) {
		   if (res.confirm) {
			  uni.makePhoneCall({
			     phoneNumber: data.mobile,
			  });
		    } else if (res.cancel) {
			   console.log('用户点击取消');
		    }
		  }
		});
	}
</script>

<style lang="scss">
.refund-detail{
	.head{
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 150rpx;
		padding: 0 30rpx;
		color: #fff;
		background-color: #666666;
		font-size: 30rpx;
		.txt{
			font-weight: bold;
		}
		.time{
			margin-top: 10rpx;
			font-size: 24rpx;
			opacity: .8;
			.time{
				display: inline-block;
				width: 600rpx;
				::v-deep .red{
					color: #fff;
				}
			}
		}
	}

	.info-box{
		margin-top: 12rpx;
		background-color: #fff;
		.title{
			padding: 0 32rpx;
			line-height: 86rpx;
			border-bottom: 1px solid #F0F0F0;
			color: #282828;
		}
		.product-box{
			.product-item{
				display: flex;
				padding: 25rpx 30rpx;
				.img-box{
					width:130rpx;
					height:130rpx;
					border-radius:16rpx;
				}
				.msg{
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 440rpx;
					margin-left: 26rpx;
					.name{
						font-size: 28rpx;
						color: #282828;
					}
					.des{
						font-size: 20rpx;
						color: #868686;
					}
					.price{
						font-size: 26rpx;
						color: var(--view-priceColor);
					}
					.num{
						position: absolute;
						right: -80rpx;
						top: 4rpx;
						color: #868686;
						font-size: 26rpx;
					}
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
		}
		
		.event_bg{
			background: #FF7F00;
		}
		.store-info{
			padding: 30rpx;
			.des{
				margin-top: 10rpx;
				font-size: 26rpx;
				color: #868686;
			}
			.red-txt{
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				color: $theme-color;
				font-size: 24rpx;
				.iconfont{
					font-size: 30rpx;
					margin-right: 5rpx;
					margin-top: 6rpx;
				}
			}
		}
	}
	.content{
		margin-top: 12rpx;
		padding: 30rpx 30rpx 0;
		background-color: #FFFFFF;
		.item{
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			.txt{
				justify-content: flex-end;
				align-items: center;
				width: 450rpx;
				color: #868686;
				text-align: right;
				.copy{
					display: flex;
					align-items: center;
					justify-content: center;
					width:80rpx;
					height:34rpx;
					margin-left: 20rpx;
					border:1px solid #666666;
					border-radius:17rpx;
					font-size: 20rpx;
					color: #333;
				}
			}
			&:last-child{
				margin-bottom: 0;
			}
			.upload-img{
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;
				.img-item{
					position: relative;
					width: 156rpx;
					height: 156rpx;
					margin-right: 23rpx;
					margin-top: 20rpx;
					&:nth-child(4n){
						margin-right: 0;
					}
					image{
						width: 156rpx;
						height: 156rpx;
						border-radius: 8rpx;
					}
				}
			}
		}	
		.btn-wrapper{
			position: relative;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100rpx;
			button{
				font-size: 28rpx;
			}
			.btn{
				width:176rpx;
				height:60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 20rpx;
				background: var(--view-theme);
				border-radius:30rpx;
				color: #fff;
			}
			.gray{
				background: transparent;
				border: 1px solid #1db0fc;
				color: #1db0fc;
			}
			&:after{
				content:' ';
				position: absolute;
				top: 0;
				left: 50%;
				width: 690rpx;
				height:1px;
				margin-left: -345rpx;
				background-color: #f0f0f0;
			}
		}
	}
	.box{
		margin-top: 12rpx;
		padding:25rpx 30rpx;
		background-color: #fff;
		font-size: 30rpx;
		color: #282828;
		.des{
			margin-top: 5rpx;
			font-size: 26rpx;
			color: #868686;
		}
	}
}
::v-deep .styleAll{
	color: #fff;
}
</style>
