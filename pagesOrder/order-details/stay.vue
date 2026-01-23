<template>
	<view :style="mall_store.viewColor">
		<view class='order-details'>
			<!-- 给header上与data上加on为退款订单-->
			<view v-if="order_info.order && order_info.order[0].activity_type != 2">
				<view class='header acea-row row-middle'>
					<view class='pictrue'>
						<image :src="img_url+'/static/order_1.gif'"></image>
					</view>
					<view class='data'>
						<view class='state'>请在{{order_info.close_order_date}}前完成支付!</view>
						<view>{{order_info.add_time_y}}<text class='time'>{{order_info.create_time}}</text></view>
					</view>
				</view>	
				<view class='nav'>
					<view class='navCon acea-row row-between-wrapper'>
						<view class="on">待付款</view>
						<view>待发货</view>
						<view>待收货</view>
						<view>待评价</view>
						<view>已完成</view>
					</view>
					<view class='progress acea-row row-between-wrapper'>
						<view class='iconfont icon-webicon318 t-color'></view>
						<view class='line'></view>
						<view class='iconfont icon-yuandianxiao'></view>
						<view class='line'></view>
						<view class='iconfont icon-yuandianxiao'></view>
						<view class='line'></view>
						<view class='iconfont icon-yuandianxiao'></view>
						<view class='line'></view>
						<view class='iconfont icon-yuandianxiao'></view>
					</view>
				</view>
			</view>
			<!--预售（代付款）-->
			<view v-else class="presell_bg_header">
				<view class='header presell_header' :style="{ 'background-image': `url(${domain}/static/diy/presell_header${mall_store.keyColor}.png)`}">
					<view class="presell_payment" v-if="order_info.order"><text class="iconfont icon-shijian1"></text>{{order_info.order[0].orderProduct[0].cart_info.productPresell.presell_type==1?'待支付':'待付定金'}}</view>
					<view class='data'>
						<view class='state'>请在{{order_info.cancel_time}}前完成支付,超时订单将自动取消</view>
					</view>
				</view>
			</view>
			<view>
				<view class='address' v-if="order_info.order && order_info.order[0].order_type != 2">
					<view class='name'>{{order_info.real_name}}<text class='phone'>{{order_info.user_phone}}</text></view>
					<view>{{order_info.user_address}}</view>
				</view>
				<view class='line'>
					<image :src="`${img_url}/static/images/line.jpg`"></image>
				</view>
			</view>
			<!-- 店铺商品列表 -->
			<view class="order-wrapper" v-for="(item,index) in order_info.order" :key="index">
				<view class="title" @click="goStore(item)">{{item.merchant.mer_name}}<text class="iconfont icon-xiangyou"></text>
				</view>
				<view class="goods-box">
					<view v-for="(goods,j) in item.orderProduct" :key="goods.order_product_id" @click="goProduct(goods)">
						<view v-if="item.activity_type === 2">
							<view class="item">
								<image :src="goods.cart_info.product.image"></image>
								<view class="info-box">
									<view class="name line1"><text class="event_name event_bg">预售</text>{{goods.cart_info.product.store_name}}</view>
									<view class="msg">{{goods.cart_info.productAttr.sku}}</view>
									<view  class="event_ship event_color">发货时间：
										<!--全款预售-->
										<text v-if="goods.cart_info.productPresell.presell_type === 1">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
										<!--定金预售-->
										<text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
									</view>
								</view>
								<view class="num"><text class="font-color">￥{{goods.cart_info.productPresellAttr.presell_price}}</text></br>x{{goods.product_num}}</view>
							</view>
							<view class="event_progress" v-if="goods.cart_info.productPresell.presell_type !=1">
								<view class="progress_list">
									<view class="progress_name">阶段一： 等待买家付款</view>
									<view class="progress_price">商品定金  <text class="align_right">￥{{ item.pay_price }}</text></view>
									<view class="progress_pay">定金需付款<text class="align_right gColor">￥{{ item.pay_price }}</text></view>
								</view>
								<view class="progress_list">
									<view class="progress_name">阶段二： 未开始</view>
									<view class="progress_price">商品尾款  <text class="align_right">￥{{ item.presellOrder.pay_price }}</text></view>
									<view class="progress_pay">尾款需付款<text class="align_right gColor">￥{{ item.presellOrder.pay_price }}</text></view>
								</view>
							</view>
						</view>
						<view v-else class="item">
							<image :src="goods.cart_info.product.image"></image>
							<view class="info-box">
								<view class="name line1">{{goods.cart_info.product.store_name}}</view>
								<view class="msg">{{goods.cart_info.productAttr.sku}}</view>
								<view class='price acea-row row-middle'>
									<text>￥{{goods.cart_info.productAttr.price}}</text>
									<image v-if="goods.cart_info.productAttr.show_svip_price" class="svip-img" src="/static/images/svip.png"></image>
								</view>
							</view>
							<view class="num">x{{goods.product_num}}</view>
						</view>
					</view>
				</view>
				<block v-if="item.merchant">
					<view v-if="item.merchant.service && item.merchant.service.length" class="goodCall" @click="goGoodCall(item)">
						<text class="iconfont icon-kefu"></text><text style="font-size: 28rpx;">联系客服</text>
					</view>
					<view v-else class="goodCall" @click="call(item)">
						<text class="iconfont icon-kefu"></text><text style="font-size: 28rpx;">联系客服</text>
					</view>
				</block>
			</view>
			<view class='wrapper'>
				<view class='item acea-row row-between'>
					<view>订单编号：</view>
					<view class='conter acea-row row-middle row-right'>{{order_info.group_order_sn}}
						<!-- #ifndef H5 -->
						<text class='copy' @tap='copy'>复制</text>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<text class='copy copy-data' :data-clipboard-text="order_info.group_order_sn">复制</text>
						<!-- #endif -->
					</view>
				</view>
				<view class='item acea-row row-between'>
					<view>下单时间：</view>
					<view class='conter'>{{order_info.create_time || 0}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>支付状态：</view>
					<view class='conter'>未支付</view>
				</view>
				<view class='item acea-row row-between'>
					<view>商品总额：</view>
					<view class='conter'>￥{{order_info.total_price}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>使用兑换积分：</view>
					<view class='conter'>{{order_info.super_integral}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>兑换积分抵扣：</view>
					<view class='conter'>￥{{order_info.super_integral_price}}</view>
				</view>
			</view>
			<view v-if="order_info.order && order_info.order[0].is_virtual == 1 && order_info.order[0].order_extend" class='wrapper'>
				<view v-for="(item,index) in order_info.order[0].order_extend" :key="index" v-show="item" class='item acea-row row-between'>
					<view>{{index}}：</view>
					<view v-if="!Array.isArray(item)" class='conter'>{{item}}</view>
					<view v-else class='conter virtual_image'>
						<image v-for="(pic,i) in item" :key="i" class="picture" :src="pic" @click="getPhotoClickIdx(item,i)"></image>
					</view>
				</view>
			</view>
			<view class='wrapper'>
				<view class='item acea-row row-between' v-if="order_info.pay_postage > 0">
					<view>运费：</view>
					<view class='conter'>+￥{{order_info.pay_postage}}</view>
				</view>
				<view class='item acea-row row-between' v-if='order_info.coupon_price>0'>
					<view>优惠券抵扣：</view>
					<view class='conter'>-￥{{order_info.coupon_price}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>实付款：</view>
					<view class='conter'>￥{{order_info.pay_price}}</view>
				</view>
			</view>
			<view class="content-clip"></view>
			<view class='footer acea-row row-right row-middle'>
				<view class="bnt cancel" @click.stop="cancelOrder">取消订单</view>
				<view class='bnt bgColor' @tap='pay_open(order_info.order_id)'>立即付款</view>
			</view>
		</view>
		<payment :payMode='pay_mode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='total_price'></payment>
	</view>
</template>


<script lang="js" setup>
	import { ref, computed } from 'vue'
	import { onLoad,onShow, onHide} from "@dcloudio/uni-app";
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app';
	import { goShopDetail } from '@/infrastructure/libs/order'
	import { groupOrderDetailApi, unOrderCancelApi} from '@/business/api/modules/order';
	import { getUserInfoApi as _getUserInfo } from '@/business/api/modules/user';
	import payment from '@/components/payment';
	import { toLogin } from '@/infrastructure/libs/login.js';
	import util  from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store()
	
	const domain = ref(HTTP_REQUEST_URL)
	const order_id = ref('')
	//订单详情
	const order_info = ref({
		system_store: {},
		_status: {}
	}) 
	const system_store = ref({})
	const is_close = ref(false)
	const pay_mode = ref([
		{
			name: "微信支付",
			icon: "icon-weixinzhifu",
			value: 'joinpayWxLite',
			title: '微信支付',
			payStatus: 1
		}
	])
	const pay_close = ref(false)
	const pay_order_id = ref('')
	const total_price = ref('0')
	const img_url = ref(HTTP_REQUEST_URL)
	const show_tips = ref(true)
	const on_change_fun_events = {
		payClose
	}
	
	// 使用 configMap 生成计算属性
	const hide_mer_status = computed(() => mall_store.globalData?.hide_mer_status || 0);

	
	onLoad((options) => {
		if (options.order_id) {
			order_id.value = options.order_id
		}
	})
	onShow(() => {
		let is_login = uni.getStorageSync('isLogin')
		if (is_login) {
			getOrderInfo();
		} else {
			toLogin()
		}
	})
	onHide(() => {
		is_close.value = true;
	})
		
	
	// 图片预览
	function getPhotoClickIdx(list, idx) {
		uni.previewImage({
			current: list[idx], //  传 Number H5端出现不兼容
			urls: list
		});
	}
	// 去店铺
	function goStore(item){
		if(hide_mer_status.value != 1){
			uni.navigateTo({
				url:`/views/pages/home/store?mer_id=${item.merchant.mer_id}`
			})
		}
	}
	// 商品详情
	function goProduct(goods){
		goods.activity_id = goods.cart_info && goods.cart_info.activeSku && goods.cart_info.activeSku.product_group_id
		goShopDetail(goods, '').then(res => {
			uni.navigateTo({
				url:`/pagesProduct/goods_details/index?id=${goods.product_id}`
			})
		})
	}
	/**
	 * 拨打电话
	 */
	function call(item) {
		if(item.merchant.service_phone){
			uni.showModal({
				title: '提示',
				content: '暂无在线客服，确定拨打客服电话:'+item.merchant.service_phone+'吗？',
				success: function(res) {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: item.merchant.service_phone
						})
					}
				}
			})
		}else{
			return util.Tips({
				title: '暂无可用客服'
			})
		}
	}
	function goGoodCall(item) {
		uni.navigateTo({
			url: `/pagesProduct/customer_list/chat?mer_id=${item.mer_id}&uid=${mall_store.uid}&order_id=${item.order_id}`
		})
	}
	/**
	 * 事件回调
	 *
	 */
	function onChangeFun(e) {
		let opt = e;
		let action = opt.action || null;
		let value = opt.value != undefined ? opt.value : null;
		(action && on_change_fun_events[action]) && on_change_fun_events[action](value);
		if (opt.type && opt.type == 'alipayApp') {
			show_tips.value = false;
		}
	}
	/**
	 * 关闭支付组件
	 *
	 */
	function payClose() {
		pay_close.value = false;
	}
	/**
	 * 打开支付组件
	 *
	 */
	function pay_open() {
		pay_close.value = true;
		pay_order_id.value = order_info.value.group_order_id.toString();
		total_price.value = order_info.value.pay_price;
	}
	/**
	 * 支付成功回调
	 *
	 */
	function pay_complete() {
		pay_close.value = false;
		pay_order_id.value = '';
		uni.redirectTo({
			url:'/pagesOrder/order-list/index?status=1'
		})
	}
	/**
	 * 支付失败回调
	 *
	 */
	function pay_fail() {
		pay_close.value = false;
		pay_order_id.value = '';
	}
	/**
	 * 获取订单详细信息
	 *
	 */
	function getOrderInfo() {
		uni.showLoading({
			title: "正在加载中"
		});
		groupOrderDetailApi({ group_order_id: order_id.value}).then(res => {
			uni.hideLoading();
			order_info.value = res.data;
		}).catch(err => {
			if (!show_tips.value) return
			console.log(err)
			uni.hideLoading();
			util.Tips({
				title: err
			}, '/pagesOrder/order-list/index');
		});
	}
	/**
	 *
	 * 剪切订单号
	 */
	// #ifndef H5
	function copy() {
		uni.setClipboardData({
			data: order_info.value.group_order_sn
		});
	}
	// #endif
	// 取消订单
	function cancelOrder() {
		uni.showModal({
			title: '提示',
			content: '确认取消该订单?',
			success: function(res) {
				if (res.confirm) {
					unOrderCancelApi({ group_order_id: order_id.value })
						.then((data) => {
							console.log(data)
							util.Tips({
								title: data.message
							}, {
								tab: 3,
							    url:1
							})
						})
						.catch(() => {
							getDetail();
						});
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
</script>

<style>
	.qs-btn {
		width: auto;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
		padding: 0 3%;
		color: #aaa;
		border: 1px solid #ddd;
		margin-right: 20rpx;
	}
</style>
<style scoped lang="scss">
	.event_bg{
		background: #FF7F00;
	}
	.event_color{
		color: #FF7F00;
	}
	.presell_bg_header {
		background: linear-gradient(90deg, var(--view-bntColor21) 0%,var(--view-bntColor22) 100%);
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
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
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
		color: var(--view-theme);
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
			color: var(--view-theme);
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
		bottom: 0;
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
		width: 176rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
	}
	.bgColor{
		background-color: var(--view-theme);
	}
	.order-details .footer .bnt.cancel {
		color: #1db0fc;
		border: 1px solid #1db0fc;
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
						color: var(--view-priceColor);
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
				color: var(--view-theme);
				&::before{
					content: "";
					display: inline-block;
					width: 5rpx;
					height: 34rpx;
					background: var(--view-theme);
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
				color: var(--view-theme);
			}
			.progress_price{
				padding: 20rpx 30rpx;
				color: #999999;
				font-size: 22rpx;
			}
			.progress_pay{
				padding: 25rpx 30rpx;
				background: var(--view-minorColor);
				font-size: 26rpx;
				color: #282828;
			}
		}
	}

</style>
