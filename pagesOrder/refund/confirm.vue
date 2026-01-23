<template>
	<view class="refund-wrapper" :style="mall_store.viewColor">
		<view class="item" v-for="(item,index) in product_data.orderProduct" :key="index">
			<view class="img-box">
				<image :src="item.cart_info.productAttr.image || item.cart_info.product.image"></image>
			</view>
			<view class="info">
				<view class="name line1"><text v-if="order_status == 2" class="event_name event_bg">预售</text>{{item.cart_info.product.store_name}}</view>
				<view class='attr line1' v-if="item.cart_info.productAttr.sku">{{item.cart_info.productAttr.sku}}</view>
				<view class="money acea-row row-middle">
					<view class="price">￥{{ order_status == 3 ? item.cart_info.productAssistAttr.assist_price : order_status == 4 ? item.cart_info.activeSku.active_price : item.cart_info.productAttr.price}} ×{{item.refund_num}}</view>
					<image v-if="item.cart_info.productAttr.show_svip_price" class="svip-img" src="/static/images/svip.png"></image>
				</view>	
			</view>
		</view>
		<view class="form-box">
			<view class="form-item item-txt" v-if="type==1">
				<text class="label">商品件数</text>
				<view class="picker">
					<picker @change="bindNumChange" :value="num_index" :range="num_array" :disabled="order_status == 2">
						<view class="picker-box">
							{{num_array[num_index] || 0}}
							<text v-if="order_status != 2" class="iconfont icon-jiantou"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="form-item item-txt">
				<text class="label">{{ status == 0 ? '退款金(含运费)' : '退款金(不含运费)' }}</text>
				<input style="text-align: right;" :class="{disabled:type == 2}" :disabled="type == 2" class="p-color" type="text" placeholder="请输入金额" v-model="rerund_price" @blur="checkMaxPrice" />
			</view>
			<view class="form-item item-txt">
				<text class="label">退款原因</text>
				<view class="picker">
					<picker @change="bindPickerChange" :value="qs_index" :range="qs_array">
						<view class="picker-box">
							{{qs_array[qs_index]}}
							<text class="iconfont icon-jiantou"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="form-item item-txtarea">
				<text class="label">备注说明</text>
				<view class="txtarea"><textarea v-model="con" value="" placeholder="填写备注信息，100字以内" /></view>
			</view>
		</view>
		<view class="upload-box">
			<view class="title">
				<view class="txt">上传凭证</view>
				<view class="des">( 最多可上传9张 )</view>
			</view>
			<view class="upload-img">
				<view class="img-item" v-for="(item,index) in upload_img" :key="index">
					<image :src="item" mode=""></image>
					<view class="iconfont icon-guanbi1" @click="deleteImg(index)"></view>
				</view>
				<view v-if="upload_img.length < 9" class="add-img" @click="uploadpic">
					<text class="iconfont icon-icon25201"></text>
					<text class="txt">上传凭证</text>
				</view>
			</view>
		</view>
		<view class="btn-box" @click="bindComfirm">申请退款</view>
		<alertBox :msg="msg" v-if="is_show_box" @bindClose="bindClose"></alertBox>
	</view>
</template>

<script lang="js" setup>
	import { ref } from 'vue'
	import { onLoad } from "@dcloudio/uni-app";
	import { refundProductApi ,refundApplyApi,newRefundMessageApi } from '@/business/api/modules/order'
	import alertBox from '@/components/alert/index.vue'
	import util from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store()
	
	const order_id = ref(0)
	const is_show_box = ref(false)
	// 图片上传
	const upload_img = ref([])
	// 选择问题
	const qs_array = ref([])
	// 问题index
	const qs_index = ref(0)
	// 选择个数
	const num_array = ref([])
	//个数index
	const num_index = ref(0)
	//商品id
	const ids = ref('')
	// 退款方式:1:退款 2:退款退货
	const refund_type = ref('')
	//退款类型 1:单个 2:批量
	const type = ref('')
	const product_data = ref({})
	const con = ref('')
	const refund_price = ref('')
	const postage_price = ref('')
	const max_refund_price = ref('')
	const rerund_price = ref('')
	// 单价
	const unit_price = ref(0)
	const msg = ref('')
	//退款id
	const refund_order_id = ref('')
	const status = ref('')
	const order_status = ref(false)
	let unit_postage;
	
	onLoad((optios) => {
		ids.value = optios.ids
		refund_type.value = optios.refund_type
		type.value = optios.type
		order_id.value = optios.order_id
		Promise.all([refundProduct(),refundMessage()])
	})
	
	function checkMaxPrice(){
		if(rerund_price.value > max_refund_price.value){
			rerund_price.value = max_refund_price.value.toFixed(2)
		}
	}
	// 退款理由
	function refundMessage(){
		newRefundMessageApi({
			order_id: order_id.value
		}).then(res=>{
			qs_array.value = res.data
		})
	}
	// 退款商品
	function refundProduct(){
		refundProductApi({ order_id: order_id.value }).then(({data})=>{
			product_data.value = data
			refund_price.value = data.pay_price
			status.value = data.status;
			order_status.value = data.activity_type;
			rerund_price.value = data.pay_price;

		}).catch((err) => {
			console.log("err---->", err)
			return util.Tips({
				title: err
			}, {
				tab: 3,
				url: 1
			});	
		});
	}
	// 下拉选中
	function bindPickerChange(e){
		console.log(e,'eee')
		qs_index.value = e.detail.value
	}
	function bindNumChange(e){
		num_index.value = e.target.value
		refund_price.value = num_array.value[e.target.value] === product_data.value.product[0].refund_num ? product_data.value.pay_price : util.$h.Mul(unit_price.value, num_array.value[e.target.value])
		max_refund_price.value = refund_price.value + (postage_price.value > 0 ? (num_array.value[e.target.value] === product_data.value.product[0].refund_num 
		? postage_price.value 
		: util.$h.Mul(num_array.value[e.target.value], unit_postage)):0);
		rerund_price.value = max_refund_price.value.toFixed(2);	
	}
	// 删除图片
	function deleteImg(index){
		upload_img.value.splice(index,1)
	}
	/**
	 * 上传文件
	*/
	function uploadpic() {
		if(upload_img.value.length <9){
			util.uploadImageOne('post/uploadImage', function (res) {
				upload_img.value.push(res.data.image_url);
			});
		}else{
			uni.showToast({
				title:'最多可上传9张',
				icon:'none'
			})
		}
	}
	// 提交
	async function bindComfirm(){
		if (!upload_img.value || !upload_img.value.length) {
			uni.showToast({
				title:'请上传凭证',
				icon:'none'
			})
			return
		}
		try {
			const data = await refundApplyApi({
				order_id: order_id.value,
				refund_type:refund_type.value,
				refund_message:qs_array.value[qs_index.value],
				mark:con.value,
				pics:upload_img.value
			})
			msg.value = data.message
			refund_order_id.value = data.data.refund_order_id
			is_show_box.value = true
		}catch(err){
			uni.showToast({
				title:err,
				icon:'none'
			})
		}
	}
	// 弹窗关闭
	function bindClose(){
		is_show_box.value = false
		uni.redirectTo({
			url:'/pagesOrder/refund/detail?id='+refund_order_id.value
		})
	}
	
	
	
</script>

<style lang="scss">
	.refund-wrapper{		
		.item{
			position: relative;
			display: flex;
			padding: 25rpx 30rpx;
			background-color: #fff;
			&:after{
				content: ' ';
				position: absolute;
				right: 0;
				bottom: 0;
				width: 657rpx;
				height: 1px;
				background: #F0F0F0;
			}
			.img-box{
				width: 130rpx;
				height: 130rpx;
				image{
					width: 130rpx;
					height: 130rpx;
					border-radius:16rpx;
				}
			}
			.info{
				display: flex;
				flex-direction: column;
				width: 440rpx;
				margin-left: 26rpx;
				.tips{
					color: #868686;
					font-size: 20rpx;
				}
				.money{
					margin-top: 10rpx;
				}
				.price{
					font-size: 26rpx;
				}
				.attr{
					font-size: 20rpx;
					color: #868686;
					margin-top: 3px;
				}
				.svip-img{
					width: 65rpx;
					height: 28rpx;
					margin: 4rpx 0 0 4rpx;
				}
			}
			.check-box{
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				.iconfont{
					font-size: 40rpx;
					color: #CCCCCC;
				}
				.icon-xuanzhong1{
					color: $theme-color;
				}
			}
		}
		.form-box{
			padding-left: 30rpx;
			margin-top: 18rpx;
			background-color: #fff;
			.form-item{
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #f0f0f0;
				font-size: 30rpx;
			}
			.item-txt{
				align-items: center;
				width: 100%;
				padding:30rpx 30rpx 30rpx 0;
				
			}
			.item-txtarea{
				padding:30rpx 30rpx 30rpx 0;
				textarea{
					display: block;
					width: 400rpx;
					height: 100rpx;
					font-size: 30rpx;
					text-align: right;
				}
			}
			.icon-jiantou{
				margin-left: 10rpx;
				font-size: 28rpx;
				color: #BBBBBB;
			}
		}
		.upload-box{
			padding: 30rpx;
			background-color: #fff;
			.title{
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30rpx;
				.des{
					color: #BBBBBB;
				}
			}
			.upload-img{
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;
				.img-item{
					position: relative;
					width: 160rpx;
					height: 160rpx;
					margin-right: 30rpx;
					margin-top: 30rpx;
					image{
						width: 160rpx;
						height: 160rpx;
						border-radius: 8rpx;
					}
					.iconfont{
						position: absolute;
						right: -15rpx;
						top: -20rpx;
						font-size: 40rpx;
						color: #1DB0FC;
					}
				}
				.add-img{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 160rpx;
					height: 160rpx;
					margin-top: 30rpx;
					border: 1px solid #DDDDDD;
					border-radius: 3rpx;
					color: #BBBBBB;
					font-size: 24rpx;
					.iconfont{
						margin-bottom: 10rpx;
						font-size: 50rpx;
					}
				}
			}
		}
		.btn-box{
			width:690rpx;
			height:86rpx;
			margin: 70rpx auto;
			line-height: 86rpx;
			text-align: center;
			color: #fff;
			background: var(--view-theme);
			border-radius:43rpx;
			font-size: 32rpx;
		}
	}
	.p-color {
		color: var(--view-priceColor);
	}
	.p-color.disabled{
		color:#999;
	}
	.event_bg{
		background: #FF7F00;
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
</style>
