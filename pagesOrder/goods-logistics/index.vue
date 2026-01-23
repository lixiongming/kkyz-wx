<template>
	<view class="page-wrap" :style="{ height: (hei - 76) + 'px' }">
		<view class='logistics'>
			<!-- <view class='header acea-row row-between row-top' v-if="product.cart_info">
				<view class='pictrue' >
					<image :src='product.cart_info.product.image'></image>
				</view>
				<view class='text acea-row row-between'>
					<view>
						<view class='name line1'>{{product.cart_info.product.store_name}}</view>
						<view class="sku">{{product.cart_info.productAttr.sku}}</view>
						<view class='money'>
							<view v-if="order_info.activity_type == 20">{{product.cart_info.productAttr.ot_price}}个积分 <block v-if="product.cart_info.productAttr.price>0">+{{product.cart_info.productAttr.price}}元</block></view>
							<view v-else>￥{{product.product_price}}</view>
						</view>
					</view>	
					<view>x{{product.product_num}}</view>
				</view>
			</view> -->
			<view class="v-header-nav" v-if="expressPackageList.length>1">
				<uv-tabs
					@change="navTabChange"
					:current="tab_current"
					:inactiveStyle="{
						color: '#000000',
						fontWeight: 600,
						fontSize: '28rpx',
					}"
					:activeStyle="{
						color: '#3c9cff',
						fontWeight: 600,
						fontSize: '28rpx',
					}"
					:itemStyle="{ height: '84rpx', padding: '0rpx 60rpx' }"
					lineHeight="4"
					lineWidth="20"
					lineColor="#3c9cff"
					:list="tab_list"
				></uv-tabs>
			</view>
			<view class='logisticsCon'>
				<view class='company acea-row row-between-wrapper'>
					<view class='picTxt acea-row row-between-wrapper'>
						<view class='iconfont icon-wuliu'></view>
						<view class='text' v-if="order_id">
							<!-- <view><text class='name line1'>物流公司：</text> {{order_info.delivery_name ? order_info.delivery_name : ''}}</view>
							<view class='express line1'><text class='name'>快递单号：</text> {{order_info.delivery_id ? order_info.delivery_id : ''}}</view> -->
							<view><text class='name line1'>物流公司：</text> {{current_package_info && current_package_info.delivery_name ? current_package_info.delivery_name : '--'}}</view>
							<view class='express'><text class='name'>快递单号：</text> <text class="number line1">{{current_package_info && current_package_info.delivery_id ? current_package_info.delivery_id : '--'}}</text></view>
						</view>
						<view class='text' v-else>
							<view><text class='name line1'>物流公司：</text> {{order_info && order_info.delivery_name ? order_info.delivery_name : '--'}}</view>
							<view class='express'><text class='name'>快递单号：</text> <text class="number line1">{{order_info && order_info.delivery_id ? order_info.delivery_id : '--'}}</text></view>
						</view>
					</view>
					<template v-if="(order_id && current_package_info && current_package_info.delivery_id) || (!order_id && order_info && order_info.delivery_id)">
						<!-- #ifndef H5 -->
						<view class='copy' @tap='copyOrderId'>复制单号</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class='copy copy-data' :data-clipboard-text="order_info.delivery_id">复制单号</view>
						<!-- #endif -->
					</template>
				</view>
				<view v-show="express_list.length>0" class='item' v-for="(item,index) in express_list" :key="index">
					<view class='circular' :class='index === 0 ? "on":""'></view>
					<view class='text' :class='index===0 ? "on-font on":""'>
						<view>{{item.status}}</view>
						<view class='data' :class='index===0 ? "on-font on":""'>{{item.time}}</view>
					</view>
				</view>
			</view>
			<!-- <recommend v-if="recommend_switch == 1" :hostProduct='host_product' :isLogin="isLogin"></recommend> -->
		</view>
	</view>
</template>
<script setup>
	import { ref, computed } from "vue";
	import { onLoad, onReachBottom, onPageScroll } from "@dcloudio/uni-app";
	import { expressApi, refundOrderExpress } from '@/business/api/modules/order';
	import { getProductHot } from '@/business/api/modules/store';
	import { toLogin } from '@/infrastructure/libs/login';
	// import recommend from '@/components/recommend';
	import util from '@/infrastructure/utils/utils'

	const hei = uni.getSystemInfoSync().windowHeight;

	const order_id = ref('')
	const refund_id = ref('')
	const mer_id = ref('')
	const product = ref({})
	const order_info = ref({})
	const express_list = ref([])
	// 多包裹物流
	const expressPackageList = ref([])
	const current_package_index = ref(0)
	const current_package_info = ref({})
	const host_product = ref([])
	const scroll = ref(false)
	const page = ref(1)
	const limit = ref(10)
	// 是否返回上一个页面
	const is_back_pre = ref(true)


	const tab_list = ref([]);
	const tab_current = ref(0);



	onLoad((options) => {
		if (!options.orderId && !options.refundId) return util.Tips({title:'缺少订单号'});
			order_id.value = options.orderId;
			refund_id.value = options.refundId;
			mer_id.value = options.merId;
			is_back_pre.value = !options.backOrder
		let is_login = uni.getStorageSync('isLogin')
		if (is_login) {
			getExpress();
		} else {
			toLogin()
		}
	})

	function navTabChange(data) {
		tab_current.value = data.index;
		current_package_info.value = expressPackageList.value[data.index];
		express_list.value = current_package_info.value?.express || [];
	}

	function back() {
		if (!is_back_pre.value) {
			return uni.redirectTo({
				url: '/pagesOrder/order-list/index?status=-1'
			});
		}
		uni.navigateBack({
			delta: 1
		});
	}

	function copyOrderId(){
		uni.setClipboardData({ data: current_package_info.value.delivery_id });
	}

	function getExpress(){
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		if (order_id.value) {
			expressApi({ order_id: order_id.value }).then(function(res){
				uni.hideLoading()
				let result = res.data.express || {};
				product.value = res.data.orderInfo.orderProduct[0] || {};
				order_info.value = res.data.orderInfo;
				// express_list.value = result || [];
				expressPackageList.value = result || [];
				current_package_index.value = 0;
				current_package_info.value = expressPackageList.value[0];
				express_list.value = current_package_info.value?.express || [];
				if (expressPackageList.value && expressPackageList.value.length > 1) {
					expressPackageList.value.forEach(function(item, index) {
						tab_list.value.push({
							name: "包裹" + (index + 1),
							id: index + 1
						});
					});
				}
				// get_host_product();
			})
		} else {
			refundOrderExpress(mer_id.value,refund_id.value).then(function(res){
			uni.hideLoading()
			let result = res.data.express || {};
			product.value = res.data.refund.refundProduct[0].product || {};
			order_info.value = res.data.refund;
			express_list.value = result || [];
			// get_host_product();
		})
		}
	}

	/**
	* 获取我的推荐
	*/
	function get_host_product () {
		if(scroll.value) return
		scroll.value = true
		getProductHot(
			page.value,limit.value
		).then(res=>{
			page.value++
			scroll.value = res.data.list.length < limit.value
			host_product.value =host_product.value.concat(res.data.list)
		})
	}	

	onReachBottom(() => {
		// get_host_product()
	})

	// 滚动监听
	onPageScroll(() => {
		uni.$emit('scroll');
	})

</script>

<style scoped lang="scss">
	.page-wrap {
		overflow-y: auto;
	}
	.logistics .header {
		padding: 23rpx 30rpx;
		background-color: #fff;
		height: 166rpx;
		box-sizing: border-box;
	}

	.logistics .header .pictrue {
		width: 120rpx;
		height: 120rpx;
	}

	.logistics .header .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.logistics .header .text {
		width: 540rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 6rpx;
	}

	.logistics .header .text .name {
		width: 480rpx;
		color: #282828;
	}
	.logistics .header .text .sku {
		color: #999999;
		font-size: 22rpx;
		margin-top: 10rpx;
	}
	.logistics .header .text .money {
		font-size: 22rpx;
		margin-top: 10rpx;
	}

	.logistics .logisticsCon {
		background-color: #fff;
		margin: 12rpx 0;
	}

	.logistics .logisticsCon .company {
		height: 120rpx;
		margin: 0 0 45rpx 30rpx;
		padding-right: 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.logistics .logisticsCon .company .picTxt {
		width: 520rpx;
	}

	.logistics .logisticsCon .company .picTxt .iconfont {
		width: 50rpx;
		height: 50rpx;
		background-color: #666;
		text-align: center;
		line-height: 50rpx;
		color: #fff;
		font-size: 35rpx;
	}

	.logistics .logisticsCon .company .picTxt .text {
		width: 450rpx;
		font-size: 26rpx;
		color: #282828;
	}

	.logistics .logisticsCon .company .picTxt .text .name {
		color: #999;
	}

	.logistics .logisticsCon .company .picTxt .text .express {
		margin-top: 5rpx;
		display: flex;
		align-items: center;
		.number {
			display: inline-block;
			width: 300rpx;
		}
	}

	.logistics .logisticsCon .company .copy {
		font-size: 20rpx;
		width: 106rpx;
		height: 40rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3rpx;
		border: 1px solid #999;
	}

	.logistics .logisticsCon .item {
		padding: 0 40rpx;
		position: relative;
	}

	.logistics .logisticsCon .item .circular {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		position: absolute;
		top: -1rpx;
		left: 31.5rpx;
		background-color: #ddd;
	}

	.logistics .logisticsCon .item .circular.on {
		background-color: #e93323;
	}

	.logistics .logisticsCon .item .text.on-font {
		color: #e93323;
	}

	.logistics .logisticsCon .item .text .data.on-font {
		color: #e93323;
	}

	.logistics .logisticsCon .item .text {
		font-size: 26rpx;
		color: #666;
		width: 615rpx;
		border-left: 1px solid #e6e6e6;
		padding: 0 0 60rpx 38rpx;
	}

	.logistics .logisticsCon .item .text.on {
		border-left-color: #f8c1bd;
	}

	.logistics .logisticsCon .item .text .data {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.logistics .logisticsCon .item .text .data .time {
		margin-left: 15rpx;
	}
</style>
