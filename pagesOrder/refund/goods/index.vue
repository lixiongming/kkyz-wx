<template>
	<view class="refund-wrapper" :style="viewColor">
		<view class="item" v-for="(item,index) in productData" :key="index">
			<view class="img-box">
				<image :src="item.orderProduct.cart_info.product.image"></image>
			</view>
			<view class="info">
				<view class="name line1">{{item.orderProduct.cart_info.product.store_name}}</view>
				<view class="price" style="color: #868686;">{{item.orderProduct.cart_info.productAttr.sku}}</view>
			</view>
		</view>
		<view class="form-box">
			<view class="form-item item-txt">
				<text class="label">物流公司</text>
				<view class="picker" v-if="numArray.length>0">
					<picker @change="bindNumChange" :value="numIndex" :range="numArray" range-key="label">
						<view class="picker-box">
							{{numArray[numIndex]['label']}}
							<text class="iconfont icon-jiantou"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="form-item item-txt">
				<text class="label">物流单号</text>
				<input style="text-align: right;" type="text" placeholder="请输入物流单号" v-model="number">
			</view>
			<view class="form-item item-txt">
				<text class="label">联系电话</text>
				<input style="text-align: right;" type="text" placeholder="请输入电话" v-model="phone">
			</view>
		</view>
		<view class="btn-box" @click="bindComfirm">提交</view>
		<alertBox :msg="msg" v-if="is_show_box" @bindClose="bindClose"></alertBox>
	</view>
</template>

<script setup>
 	import { ref, computed } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	import {refundDetailApi,expressListApi,refundBackGoodsApi } from '@/business/api/modules/order'
	import { checkPhone } from '@/infrastructure/utils/validate.js'
	import alertBox from '@/components/alert/index.vue'
	import util from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store();

	const order_id = ref(0)
	const is_show_box = ref(false)
	// 图片上传
	const uploadImg = ref([])
	const numArray = ref([])
	const numIndex = ref(0)
	//订单id
	const id = ref('')
	const productData = ref([])
	const con = ref('')
	const refund_price = ref('')
	const msg = ref('')
	// 快递单号
	const number = ref('')
	const phone = ref('')
	const refund_type = ref('')
	const type = ref('')
    const ids = ref()
	const viewColor = computed(() => {
		return mall_store.viewColor
	})
	onLoad((optios) => {
		id.value = optios.id
		refund_type.value = optios.refund_type
		type.value = optios.type,
		order_id.value = optios.order_id
		Promise.all([refundProduct(),expressList_()])
	})

	// 物流列表
	function expressList_(){
		expressListApi().then(res=>{
			numArray.value = res.data
		})
	}

	// 退款商品
	function refundProduct(){
		refundDetailApi({ refund_order_id: id.value }).then(({data})=>{
			productData.value = data.refundOrderProduct
		})
	}

	// 下拉选中
	function bindPickerChange(e){
		qsIndex.value = e.target.value
	}

	function bindNumChange(e){
		numIndex.value = e.detail.value
		console.log("numIndex.value--->", e, numIndex.value, numArray.value[e.detail.value])
		// refund_price.value = unitPrice * numArray.value[e.detail.value]
	}

	// 删除图片
	function deleteImg(index){
		uploadImg.value.splice(index,1)
	}

	/**
	 * 上传文件
	*/
	function uploadpic () {
		if(uploadImg.value.length < 9){
			util.uploadImageOne('upload/image', function (res) {
				uploadImg.value.push(res.data.path);
				uploadImg.value = uploadImg.value;
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
		try {
			if(!number.value){
				uni.showToast({
					title:'请填写快递单号',
					icon:'none'
				})
				return
			}
			if(!checkPhone(phone.value)){
				uni.showToast({
					title:'请填写正确的手机号码',
					icon:'none'
				})
				return
			}
			let params = {
				refund_order_id: id.value,
				delivery_type:numArray.value[numIndex.value].label,
				delivery_id:number.value,
				delivery_phone:phone.value,
			}
			const data = await refundBackGoodsApi(params)
			msg.value = data.message
			is_show_box.value = true
		}catch(err){
			console.log(err)
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
			url:'/pagesOrder/refund/detail?id=' + id.value
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
				.price{
					margin-top: 15rpx;
					font-size: 26rpx;
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
					width: 156rpx;
					height: 156rpx;
					margin-right: 24rpx;
					margin-top: 20rpx;
					image{
						width: 156rpx;
						height: 156rpx;
						border-radius: 8rpx;
					}
					.iconfont{
						position: absolute;
						right: -15rpx;
						top: -20rpx;
						font-size: 40rpx;
						color: $theme-color;
					}
				}
				.add-img{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 156rpx;
					height: 156rpx;
					margin-top: 20rpx;
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
			background:var(--view-theme);
			border-radius:43rpx;
			font-size: 32rpx;
		}
	}
</style>
