<template>
	<view :style="mall_store.localViewColor">
		<view class='order-details'>
			<!-- 给header上与data上加on为退款订单-->
			<!--预售-->
			<view v-if="order_info.activity_type == 2 && (order_info.status == 10 || order_info.status == 11)">
				<view class='header presell_header' :style="{ 'background-image': `url(${img_url}/static/diy/presell_bg${mall_store.keyColor}.jpg)`}"  :class="'header'+mall_store.keyColor">
					<view class="presell_payment">
						<text class="iconfont icon-shijian1"></text>
						{{ order_info.status == 11 ? '交易已关闭' : '待付尾款' }}
					</view>
					<view class='data' style="margin-left: 0;">
						<view class='state'>请在{{order_info.orderProduct[0].cart_info.productPresell.final_end_time}}前完成支付,超时订单将自动取消</view>
					</view>
				</view>
			</view>
			<view v-else>
				<view class='header acea-row row-middle' :class='is_goods_return ? "on":""'>
					<view class='pictrue' v-if="is_goods_return==false">
						<image v-if="order_info.status != 9" :src="img_url+'/static/order_'+(order_info.status+2)+'.gif'"></image>
						<image v-else :src="img_url+'/static/order_2.gif'"></image>
					</view>
					<view class='data' :class='is_goods_return ? "on":""'>
						<view class='state'>
							<block v-if="order_info.status == 0  && order_info.order_type != 1">待发货</block>
							<block v-if="order_info.status == 9">等待其他人参加拼团</block>
							<block v-if="order_info.status == 0 && order_info.order_type == 1">待核销</block>
							<block v-if="order_info.status == 1">{{order_info.is_virtual == 1 ? '服务商品已虚拟发货' : '待收货'}}</block>
							<block v-if="order_info.status == 2">待评价</block>
							<block v-if="order_info.status == 3">已完成</block>
							<block v-if="order_info.status == -1">已为您退款,感谢您的支持</block>
						</view>
						<view>{{order_info.pay_time}}</view>
					</view>
				</view>
				<block v-if="is_goods_return==false">
					<view class='nav'>
						<view class='navCon acea-row row-between-wrapper'>
							<view>待付款</view>
							<view :class="(order_info.status == 0 || order_info.status == 9) ? 'on':''" v-if="order_info.order_type != 1">待发货</view>
							<view :class="(order_info.status == 0 || order_info.status == 9) ? 'on':''" v-if="order_info.order_type == 1">待核销</view>
							<view :class="order_info.status == 1 ? 'on':''" v-if="order_info.order_type != 1">待收货</view>
							<view :class="order_info.status == 2 ? 'on':''">待评价</view>
							<view :class="order_info.status == 3 ? 'on':''">已完成</view>
						</view>
						<view class='progress acea-row row-between-wrapper'>
							<view class='iconfont icon-yuandianxiao t-color'></view>
							<view class='line b-color'></view>
							<view class='iconfont' :class='((order_info.status == 0 || order_info.status == 9) ? "icon-webicon318":"icon-yuandianxiao") + " " + (order_info.status >= 0 ? "t-color":"")'></view>
							<view class='line' :class='order_info.status > 0 && order_info.status != 9 ? "b-color":""'></view>
							<view class='iconfont' :class='(order_info.status == 1 ? "icon-webicon318":"icon-yuandianxiao") + " " +(order_info.status >= 1 && order_info.status != 9 ? "t-color":"")'  v-if="order_info.order_type == 0"></view>
							<view class='line' :class='order_info.status > 1 && order_info.status != 9 ? "b-color":""'  v-if="order_info.order_type == 0"></view>
							<view class='iconfont' :class='(order_info.status == 2 && order_info.status != 9 ? "icon-webicon318":"icon-yuandianxiao") + " " + (order_info.status >= 2 && order_info.status != 9 ? "t-color":"")'></view>
							<view class='line' :class='order_info.status > 2 && order_info.status != 9 ? "b-color":""'></view>
							<view class='iconfont' :class='(order_info.status == 3 ? "icon-webicon318":"icon-yuandianxiao") + " " + (order_info.status >= 3 && order_info.status != 9 ? "t-color":"")'></view>
						</view>
					</view>
					<view class='line'>
						<image :src="`${img_url}/static/images/line.jpg`"></image>
					</view>
				</block>
			</view>
			<view>
				<!-- 配送地址 -->
				<view class='address' v-if="order_info.order_type == 0 && order_info.is_virtual != 1">
					<view class='name'>{{order_info.real_name}}<view class='phone'>{{order_info.user_phone}}</view></view>
					<view>{{order_info.user_address}}</view>
				</view>
				<!-- 地图 -->
				<view class="map acea-row row-between-wrapper" v-if="order_info.order_type == 1">
					<view>自提地址信息</view>
					<view class="place t-color acea-row row-center-wrapper" @tap="showMaoLocation">
						<text class="iconfont icon-weizhi"></text>查看位置
					</view>
				</view>
				<view class='address' v-if="order_info.order_type == 1" style="margin-top: 0;">
					<view class='name'>
						{{order_info.take.mer_take_name}}
						<text class='phone' @click="makePhone">{{order_info.take.mer_take_phone}}</text>
						<text class="iconfont icon-tonghua t-color" @click="makePhone"></text>
					</view>
					<view class="line2">{{order_info.take.mer_take_address}}</view>
				</view>
				<view v-if="order_info.take" class="take-info">
					<view class="take-msg">
						<view class="left">
							<view class="title">
								营业时间
							</view>
							<view class="text">
								<text v-if="order_info.take.mer_take_day && order_info.take.mer_take_day.length == 7">周一至周日：</text>
								<block v-else>
									<text v-for="item in order_info.take.mer_take_day">{{'周'+ toChinese(item)}},</text>
								</block>
								<text class="time" v-if="order_info.take.mer_take_time">{{order_info.take.mer_take_time[0]}}-{{order_info.take.mer_take_time[1]}}</text>
							</view>
						</view>
						<view class="code" @click="showCode">
							<text class="iconfont icon-hexiaoma"></text>
							<view class="text">
								自提码
							</view>
						</view>
					</view>
				</view>
				<view class="merchant line1" v-if="order_info.welfare_post_id" @click="goStore(order_info)">
					{{order_info.welfarePost.name}}
					<text class="iconfont icon-xiangyou"></text>
				</view>
				<view class="merchant line1" v-else @click="goStore(order_info)">
					{{order_info.merchant?.mer_name}}
					<text class="iconfont icon-xiangyou"></text>
				</view>
				<block v-if="cart_info.length>0">
					<orderGoods :orderData='order_info' :evaluate='order_info.status' :activityType='order_info.activity_type' :orderId="order_id" :cartInfo="cart_info" :jump="true"></orderGoods>
					<block v-if="order_info.order_type == 1 && order_info.takeOrderList && order_info.takeOrderList.length > 0" v-for="(item,index) in order_info.takeOrderList" :key="index">
						<orderGoods :orderData='item' :evaluate='item.status' :activityType='item.activity_type' :orderId="item.order_id" :cartInfo="item.orderProduct" :jump="true"></orderGoods>
					</block>
				</block>
				<block v-if="order_info.merchant && order_info.welfare_post_id == 0">
					<view v-if="order_info.merchant.service && order_info.merchant.service.length" class="goodCall" @click="goGoodCall">
						<text class="iconfont icon-kefu"></text><text style="font-size: 28rpx;">联系客服</text>
					</view>
					<view v-else class="goodCall" @click="call">
						<text class="iconfont icon-kefu"></text><text style="font-size: 28rpx;">联系客服</text>
					</view>
				</block>
				<!-- 驿站商品 -->
				<block v-else-if="order_info.welfarePost && order_info.welfare_post_id > 0">
					<view  class="goodCall" @click="postStationPhone(order_info.welfarePost)">
						<text class="iconfont icon-kefu"></text><text style="font-size: 28rpx;">联系客服</text>
					</view>
				</block>
				<!--卡密商品发货-->
				<view v-if="order_info.delivery_type == 6 && order_info.delivery_id" class='wrapper'>
					<view class='item acea-row row-between'>
						<view>卡密发货：</view>
						<view class="item acea-row">
							<view class="conter">
								<!-- #ifndef H5 -->
								<text class='copy' @tap='copyKm'>复制</text>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<text class='copy copy-data' :data-clipboard-text="order_info.delivery_id">复制</text>
								<!-- #endif -->
							</view>
						</view>
					</view>
					<view class="item acea-row">
						<view style="color:#868686;">卡密已自动发放 <view>{{order_info.delivery_id}}</view></view>
					</view>
				</view>
				<!-- 送货 -->
				<view class="wrapper" v-if="order_info.delivery_type == 2">
					<view class='item acea-row row-between'>
						<view>配送方式：</view>
						<view class='conter'>送货</view>
					</view>
					<view class='item acea-row row-between'>
						<view>配送员：</view>
						<view class='conter'>{{order_info.delivery_name}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>联系电话：</view>
						<view class='conter'>{{order_info.delivery_id}}</view>
					</view>
				</view>
				<!-- 同城配送 -->
				<view v-if="order_info.delivery_type == 5" class="wrapper">
					<view class='item virtual_item'>
						<view class="acea-row virtual_row">
							<view>
								<image :src="`${img_url}/static/images/delivery_man.png`"></image>
							</view>
							<view v-if="order_info.delivery_id" class="virtual_delivery">
								<view>{{order_info.delivery_name}}</view>
								<view>{{order_info.delivery_id}}</view>
							</view>
							<view v-else class="virtual_delivery_not">配送员未接单</view>
						</view>
						<navigator class="virtual_detail" hover-class="none"
						:url="'/packages/mall/views/pages/order_details/delivery?orderId=' + order_info.order_id">查看详情</navigator>
					</view>
				</view>
				<view v-if="order_info.remark" class="wrapper">
					<view class="item acea-row row-between">
						<view class="">发货备注：</view>
						<view class="conter remark">{{ order_info.remark }}</view>
					</view>
				</view>
				<view class='wrapper'>
					<view class='item acea-row row-between'>
						<view>订单编号：</view>
						<view class='conter acea-row row-middle row-right'>{{order_info.order_sn}}
							<!-- #ifndef H5 -->
							<text class='copy' @tap='copy'>复制</text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text class='copy copy-data' :data-clipboard-text="order_info.order_sn">复制</text>
							<!-- #endif -->
						</view>
					</view>
					<view class='item acea-row row-between'>
						<view>下单时间：</view>
						<view class='conter'>{{order_info.create_time}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>支付状态：</view>
						<view class='conter'>已支付</view>
					</view>
					<view class='item acea-row row-between' v-if="order_info.pay_time">
						<view>支付时间：</view>
						<view class='conter'>{{order_info.pay_time}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>商品总额：</view>
						<view class='conter'>￥{{order_info.total_price}}</view>
					</view>
					<view class='item acea-row row-between'>
						<view>使用兑换积分：</view>
						<view ><text class="Exchange-text">{{order_info.super_integral}}</text></view>
					</view>
					<view class='item acea-row row-between'>
						<view>兑换积分抵扣：</view>
						<view ><text class="Exchange-text">￥{{order_info.super_integral_price}}</text></view>
					</view>
					<template v-if="order_info.status == 3">
						<view class='item acea-row row-between'>
							<view>赠送兑换券：</view>
							<view class='conter'>{{ order_info.ticketUser?.actual_bonus_price || 0 }}</view>
						</view>
						<view class='item acea-row row-between'>
							<view>发放状态：</view>
							<view class='conter'>已发放</view>
						</view>
						<view class='item acea-row row-between'>
							<view>发放时间：</view>
							<view class='conter'>{{ order_info.ticketUser?.create_time || '无' }}</view>
						</view>
					</template>
					<template v-else>
						<view class='item acea-row row-between'>
							<view>预计赠送兑换券：</view>
							<view class='conter'>{{ order_info.ticket || 0 }}</view>
						</view>
						<view class='item acea-row row-between'>
							<view>发放状态：</view>
							<view class='conter'>无</view>
						</view>
						<view class='item acea-row row-between'>
							<view>发放时间：</view>
							<view class='conter'>无</view>
						</view>
					</template>

					<view class='item acea-row row-between'>
						<view>支付方式：</view>
						<view class='conter'>微信</view>
					</view>
					<view class='item acea-row row-between' v-if="order_info.mark">
						<view>买家留言：</view>
						<view class='conter'>{{order_info.mark}}</view>
					</view>
				</view>
			</view>
			<view v-if="order_info.is_virtual == 1 && order_info.order_extend" class='wrapper'>
				<view v-for="(item,index) in order_info.order_extend" v-if="item" :key="index" class='item acea-row row-between'>
					<view>{{index}}：</view>
					<view v-if="!Array.isArray(item)" class='conter'>{{item}}</view>
					<view v-else class='conter virtual_image'>
						<image v-for="(pic,i) in item" :key="i" class="picture" :src="pic" @click="getPhotoClickIdx(item,i)"></image>
					</view>
				</view>
			</view>
			<view class='wrapper'>
				<view class='item acea-row row-between' v-if="order_info.pay_postage > 0 && order_info.order_type != 1">
					<view>运费：</view>
					<view class='conter'>+￥{{order_info.pay_postage}}</view>
				</view>
				<view class='item acea-row row-between' v-if='order_info.coupon_price > 0'>
					<view>优惠券抵扣：</view>
					<view class='conter'>-￥{{order_info.coupon_price}}</view>
				</view>
				<view class='item acea-row row-between' v-if='order_info.integral'>
					<view>积分抵扣：</view>
					<view class='conter'>-￥{{order_info.integral_price}}</view>
				</view>
				<view class='item acea-row row-between' v-if="order_info.activity_type == 2">
					<view>实付款：</view>
					<view class='conter'>￥{{order_info.presell_price}}</view>
				</view>
				<view class='item acea-row row-between' v-else>
					<view>实付款：</view>
					<view class='conter'>￥{{order_info.pay_price}}</view>
				</view>
			</view>
			<view class="content-clip" v-if="is_goods_return==false && (order_info.status != 0 || (order_info.status == 0 && refund_num.length != cart_info.length && order_info.refund_status && order_info.refund_switch))"></view>
			<view class='footer acea-row row-right row-middle' v-if="is_goods_return==false && order_info.status != 0">
				<view v-if="order_info.status == 3 && !order_info.receipt && !is_goods_return && order_info.openReceipt == 1" class='bnt cancel' @click="applyInvoice">申请开票</view>
				<view v-if="order_info.activity_type == 2 && (order_info.status == 10 || order_info.status == 11)" class=" acea-row row-right row-middle" style="margin-left: 17rpx;">
					<view v-if="order_info.presellOrder.activeStatus == 0" class='bnt b-color btn_auto'>{{ filterDay(order_info.presellOrder.final_start_time) }} 付尾款</view>
					<view v-if="order_info.presellOrder.activeStatus == 1" class='bnt b-color' @tap='pay_open'>立即付款</view>
					<view v-if="order_info.presellOrder.activeStatus == 2" class='bnt cancel' @click="cancelOrder">取消订单</view>
				</view>
				<block v-if="order_info.status == 9">
					<view class="bnt cancel" @click="getCombinationRemove">取消拼团</view>
				</block>
				<view class='bnt b-color' v-if="order_info.activity_type==4" @tap='goJoinPink'>查看拼团</view>
				<block v-if="order_info.status == 1">
					<view class="bnt cancel" @click="allRefund" v-if="show_batch_return && refund_num.length != cart_info.length && order_info.refund_status && order_info.refund_switch == 1">申请退款</view>
					<navigator v-if="order_info.delivery_type == 1 || order_info.delivery_type == 4" class='bnt cancel' hover-class='none' :url="'/pagesOrder/goods-logistics/index?orderId='+ order_info.order_id">查看物流</navigator>
					<view class='bnt b-color' @tap='confirmOrder' v-if="order_info.orderProduct[0].is_refund!=1">确认收货</view>
				</block>
				<block v-if="order_info.status == 2">
					<view class="bnt cancel" @click="allRefund" v-if="show_batch_return && refund_num.length != cart_info.length && order_info.refund_status && order_info.refund_switch == 1">申请退款</view>
					<navigator v-if="order_info.delivery_type == 1 || order_info.delivery_type == 4" class='bnt cancel' hover-class='none' :url="'/pagesOrder/goods-logistics/index?orderId='+ order_info.order_id">查看物流</navigator>
					<view class='bnt b-color' @click="goOrderConfirm" v-if="order_info.activity_type!=1 && order_info.activity_type!=2 && order_info.activity_type!=3 &&order_info.activity_type!=4 && order_info.activity_type!=10">再次购买</view>
				</block>
				<block v-if="order_info.status == 3">
					<view class='bnt cancel' @click="delTipClick">删除订单</view>
					<navigator v-if="order_info.delivery_type == 1 || order_info.delivery_type == 4" class='bnt cancel' hover-class='none' :url="'/pagesOrder/goods-logistics/index?orderId='+ order_info.order_id">查看物流</navigator>
					<view class='bnt b-color' @click="goOrderConfirm" v-if="order_info.activity_type!=1 && order_info.activity_type!=2 && order_info.activity_type!=3 && order_info.activity_type!=4 && order_info.activity_type!=10">再次购买</view>
				</block>
			</view>
			<view class='footer acea-row row-right row-middle' v-if="show_batch_return && is_goods_return==false && order_info.status == 0 && refund_num.length != cart_info.length && order_info.refund_status && order_info.refund_switch">
				<view class="bnt cancel" @click="allRefund">申请退款</view>
			</view>
		</view>
		<payment :payMode='pay_mode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='total_price' :order_type='1'></payment>
		<addInvoicing ref="add_invoicing_ref" @changeInvoiceClose="changeInvoiceClose" :invoice='invoice'></addInvoicing>
		<!--核销码弹窗-->
		<uni-popup ref="cancell_poupon" type="bottom" :safe-area="false">
			<view class="code-content">
				<text class="iconfont icon-guanbi5" @click="close"></text>
				<view class="title">核销码</view>
				<view class="trip">
					请将二维码展示给店员 或 提供数字核销码
				</view>
				<view class="grayBg">
					<view class="pictrue">
						<image :src="code_url"></image>
					</view>
				</view>
				<view class="num">{{order_info.verify_code}}</view>
			</view>
		</uni-popup>
		<!-- 提示删除订单 -->
		<uni-popup ref="del_popup" type="center" border-radius="10px 10px 0 0">
			<view class="del_popup">
				<view class="popup_model_box_title">
				<text>删除订单</text>
				</view>
				<view class="popup_model_box_content">
				<text>你确认要删除该订单吗？</text>
				</view>
				<view class="popup_foot">
					<view class="popup_model_box_btn cancel_btn" @click="delCloseClick">
					<text>取消</text>
					</view>
					<view class="popup_model_box_btn" @click="delOrder">
					<text>确认</text>
				</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script lang="js" setup>
	import { ref, computed, getCurrentInstance} from 'vue'
	import { onLoad, onUnload,onReady,onShow, onHide} from "@dcloudio/uni-app";
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app';
	import {
		getOrderDetailApi,
		orderAgainApi,
		orderTakeApi,
		orderDelApi,
		verifyCodeApi,
		applyInvoiceSumbitApi,
		refundBatch
	} from '@/business/api/modules/order';
	import { postCombinationRemove } from '@/business/api/modules/activity';
	import { openOrderRefundSubscribe } from '@/infrastructure/utils/SubscribeMessage';
	import payment from '@/components/payment';
	import orderGoods from "@/components/orderGoods";
	import { toLogin } from '@/infrastructure/libs/login.js';
	import addInvoicing from '@/components/addInvoicing';
	import util  from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store()
    const instance = getCurrentInstance();
    const $wechat =  ref({})
    if (instance) {
        console.log(instance)
        const global_properties = instance.appContext.config.globalProperties
        $wechat.value = global_properties.$wechat 
    }

	const order_id = ref('')
	//购物车产品
	const cart_info = ref([])
	//订单详情
	const order_info = ref({
		system_store: {},
		_status: {},
		take: {}
	})
	//是否为退款订单
	const is_goods_return = ref(false)
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
	//退款个数临时数据
	const refund_num = ref([]) 
	const img_url = ref(HTTP_REQUEST_URL)
	const code_url = ref('')
	const is_time_pay = ref(false)
	// 要生成的二维码值
	const val = ref('')
	const back_timer = ref(null)
	const invoice = ref({
		invoice: false,
		add: true,
	})
	const ids = ref([])
	const cancell_poupon = ref();
	const add_invoicing_ref = ref();
	const del_popup = ref();
	const on_change_fun_events = {
		payClose
	}
	
	
	// 使用 configMap 生成计算属性
	const hide_mer_status = computed(() => mall_store.globalData?.hide_mer_status || 0);
	
	const show_batch_return = computed(() => {
		if (order_info.value.order_type == 1 && order_info.value.takeOrderList && order_info.value.takeOrderList.length > 0) {
			// 包含自提订单
			return order_info.value.takeOrderList.every(pitem => {
				if (pitem.activity_type === 2) {
					// 预售
					return pitem.orderProduct.every(citem => citem.is_refund ==0 && (pitem.status != 10 && pitem.status != 11) && pitem.refund_status || citem.refund_num > 0)
				} else {
					return pitem.orderProduct.every(citem => citem.refund_switch == 1 && (citem.is_refund == 0 && pitem.status != 9 && pitem.refund_status || citem.refund_num > 0))
				}
			})
		} else {
			// 不包含自提订单
			if (order_info.value.activity_type === 2) {
				// 预售
				return order_info.value.orderProduct && order_info.value.orderProduct.every(item => item.is_refund ==0 && (order_info.value.status != 10 && order_info.value.status != 11) && order_info.value.refund_status || item.refund_num > 0)
		
			} else {
				return order_info.value.orderProduct && order_info.value.orderProduct.every(item => item.refund_switch == 1 && (item.is_refund == 0 && order_info.value.status != 9 && order_info.value.refund_status || item.refund_num > 0))
			}
		}
	})
	
	onLoad((options) => {
		if (options.order_id) {
			order_id.value = options.order_id
		}
	})
	onUnload(() => {
		back_timer.value && clearTimeout(back_timer.value)
	})
	onShow(() => {
		let is_login = uni.getStorageSync('isLogin')
		if (is_login) {
			getOrderInfo(true);
			isPayBalance();
		} else {
			toLogin()
		}
	})
	onHide(() => {
		is_close.value = true;
	})
	
	function filterDay(val) {
		if(val){
			var reg =/(\d{4})\-(\d{2})\-(\d{2})/;
			var date = val.replace(reg,"$2月$3日");
			return date
		}
	}
	// 图片预览
	function getPhotoClickIdx(list, idx) {
		uni.previewImage({
			current: list[idx], //  传 Number H5端出现不兼容
			urls: list
		});
	}
	// 判断是否到支付尾款时间
	function isPayBalance(){
		if(order_info.value.status === 10){
			if(new Date() < new Date(order_info.value.presellOrder.final_start_time)){
				is_time_pay.value = false; //未开始
			}else if((new Date() >= new Date(order_info.value.presellOrder.final_start_time)) && (new Date() <= new Date(order_info.value.presellOrder.final_start_time)) ){
				is_time_pay.value = true; //立即支付
			}
		}
	}
	// 数字转汉字
	function toChinese(num){
		let changeNum = ['零', '一', '二', '三', '四', '五', '六', '日', '八', '九'];
		let unit = ["", "十", "百", "千", "万"];
		num = parseInt(num);
		let getWan = (temp) => {
		　　let strArr = temp.toString().split("").reverse();
		　　let newNum = "";
		　　for (var i = 0; i < strArr.length; i++) {
			　　newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
		　　}
		 　 return newNum;
		}
		let overWan = Math.floor(num / 10000);
		let noWan = num % 10000;
		if (noWan.toString().length < 4) {　　　　　　noWan = "0" + noWan;　　　 }
		return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
	}
	// 去店铺
	function goStore(item){
		if(item.welfare_post_id){
		  // 跳转驿站
		  uni.navigateTo({
             url: `/packages/mall/views/pages/users/post-station/shop?id=${item.welfarePost.mer_id}&welfare_post_id=${item.welfarePost.id}`,
           });
		}else{
			if(hide_mer_status.value != 1){
				uni.navigateTo({
					url:`/views/pages/home/store?mer_id=${item.merchant.mer_id}`
				})
		  	}
		}
	}
	// 申请退款
	function allRefund() {
		// 判断商品是否存在已评价商品，如果存在，则无法申请退款，并弹窗提示
		const { status, orderProduct } = order_info.value;
		if (status == 2) {
			let is_has_rated = orderProduct.some(v => v.is_reply == 1)
			if (is_has_rated) {
				util.Tips({
					title: '已评价订单，不能退款，详情请咨询客服'
				});
				return;
			}
		}
		// #ifdef MP
		openOrderRefundSubscribe().then(() => {
			uni.hideLoading();
			if (order_info.value.status == 0 || order_info.value.is_virtual != 0) {
				uni.redirectTo({
					url:`/pagesOrder/refund/confirm?ids=${ids.value.join(',')}&refund_type=1&type=2&order_id=${order_id.value}`
				})
			} else {
				uni.navigateTo({
					url: '/pagesOrder/refund/select?order_id=' + order_id.value + '&type=2&order_type='+order_info.value.order_type
				})
			}
		}).catch(() => {
			uni.hideLoading();
		})
		// #endif
		// #ifdef H5 || APP-PLUS
		if (order_info.value.status == 0 || order_info.value.is_virtual != 0) {

			uni.redirectTo({
				url:`/pagesOrder/refund/confirm?ids=${ids.value.join(',')}&refund_type=1&type=2&order_id=${order_id.value}`
			})
		} else {
			uni.navigateTo({
				url: '/pagesOrder/refund/select?order_id=' + order_id.value + '&type=2&order_type='+order_info.value.order_type
			})
		}
		// #endif
	}
	//拼团取消
	function getCombinationRemove() {
		postCombinationRemove({
			group_buying_id: order_info.value.orderProduct[0].activity_id
			})
			.then(res => {
				util.Tips({
					title: res.message
				}, {
					tab: 3
				});
			})
			.catch(res => {
				util.Tips({
					title: res.message
				});
			});
	}
	// 联系客服
	function goGoodCall() {
		uni.navigateTo({
			url: `/pagesProduct/customer_list/chat?mer_id=${order_info.value.mer_id}&uid=${mall_store.uid}&order_id=${order_id.value}`
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
	}
	/**
	 * 拨打电话
	 */
	function makePhone() {
		uni.makePhoneCall({
			phoneNumber: order_info.value.take.mer_take_phone
		})
	}
	/**
	 * 拨打电话
	 */
	function call() {
		if(order_info.value.merchant.service_phone){
			uni.showModal({
				title: '提示',
				content: '暂无在线客服，确定拨打客服电话:'+order_info.value.merchant.service_phone+'吗？',
				success: function(res) {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: order_info.value.merchant.service_phone
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
	/**
	 * 打开地图
	 *
	 */
	function showMaoLocation() {
		if (!order_info.value.take.mer_take_location[0] || !order_info.value.take.mer_take_location[1]) return util.Tips({
			title: '请设置允许商城访问您的位置！'
		});
	
		let lat = parseFloat(order_info.value.take.mer_take_location[0]),
		    long = parseFloat(order_info.value.take.mer_take_location[1])
			console.log(lat,long)
			console.log(order_info.value.take)
		console.log("$wechat.value-->", $wechat.value)
		//#ifdef H5
		if ($wechat.value.isWeixin() === true) {
			$wechat.value.seeLocation({
				latitude: Number(lat),
				longitude: Number(long),
				address: order_info.value.take ? order_info.value.take.mer_take_name : ''
			}).then(res=>{
				console.log('success');
			})
		}else{
		  //#endif
			uni.openLocation({
				latitude: lat,
				longitude: long,
				name: order_info.value.take ? order_info.value.take.mer_take_name : '',
				scale: 8,
				address:  order_info.value.take ? order_info.value.take.mer_take_address : '',
				success: function(res) {
					console.log(res);
				}
			});
			// #ifdef H5
		}
		//#endif
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
		pay_order_id.value = order_info.value.order_id.toString();
		total_price.value = order_info.value.pay_price;
	}
	/**
	 * 支付成功回调
	 *
	 */
	function pay_complete() {
		pay_close.value = false;
		pay_order_id.value = '';
		getOrderInfo();
	}
	/**
	 * 支付失败回调
	 *
	 */
	function pay_fail() {
		pay_close.value = false;
		pay_order_id.value = '';
	}
	function getOrderCode(){
		verifyCodeApi({ order_id: order_id.value }).then(res=>{
			code_url.value = res.data.qrcode
			val.value = res.data.qrcode
		})
	}
	/**
	 * 获取订单详细信息
	 *
	 */
	function getOrderInfo(is_on_show) {
		uni.showLoading({
			title: "正在加载中"
		});
		getOrderDetailApi({ order_id: order_id.value}).then(res => {	
			uni.hideLoading();
			order_info.value = res.data
			order_info.value.take = res.data.take;
			cart_info.value = res.data.orderProduct
			if (order_info.value.status == '-1') {
				is_goods_return.value = true;
			}
			res.data.orderProduct.map(el => {
				if (el.refund_num == 0) {
					refund_num.value.push(el)
				}
			})
			if(res.data.order_type == 1){
				getOrderCode()
			}
			// 更新开票列表
			if(invoice.value.invoice && is_on_show && (!order_info.value.receipt && !is_goods_return.value && order_info.value.openReceipt == 1)) {
				add_invoicing_ref.value.getInvoiceList();
			}
		}).catch(err => {
			uni.hideLoading();
			util.Tips({
				title: err
			});
			back_timer.value = setTimeout(() => {
				uni.navigateBack({
					delta: 1
				});
			}, 2000);
		});
	}
	function showCode() {
		cancell_poupon.value.open();
	}
	function close(){
		cancell_poupon.value.close();
	}
	/**
	 *
	 * 剪切订单号
	 */
	// #ifndef H5
	function copy() {
		uni.setClipboardData({
			data: order_info.value.order_sn,
			success: function(res){
			}
	
		});
	}
	// #endif
	/**
	 *
	 * 剪切卡密内容
	 */
	// #ifndef H5
	function copyKm() {
		uni.setClipboardData({
			data: order_info.value.delivery_id,
			success: function(res){
			}
	
		});
	}
	// #endif
	/**
	 * 打电话
	 */
	function goTel() {
		uni.makePhoneCall({
			phoneNumber: order_info.value.delivery_id
		})
	}
	/**
	 * 去拼团详情
	 *
	 */
	function goJoinPink() {
		uni.navigateTo({
			url: '/packages/mall/views/pages/activity/combination_status/index?id=' + order_info.value.orderProduct[0].activity_id,
		});
	}
	/**
	 * 再此购买
	 *
	 */
	function goOrderConfirm() {
		let data = []
		cart_info.value.map((item, index) => {
			let obj = {}
			obj.product_id = item.product_id
			obj.product_attr_unique = item.product_sku
			obj.cart_num = item.product_num
			data.push(obj)
		})
		orderAgainApi({
			data: data
		}).then(res => {
			let cart_id = res.data.cart_id.join(',')
			return uni.navigateTo({
				url: '/pagesProduct/order_confirm/index?cartId=' + cart_id
			});
		}).catch(err => {
			util.Tips({
				title: err
			})
		});
	}
	function confirmOrder() {
		uni.showModal({
			title: '确认收货',
			content: '为保障权益，请收到货确认无误后，再确认收货',
			success: function(res) {
				if (res.confirm) {
					orderTakeApi({ order_id: order_id.value }).then(res => {
						return util.Tips({
							title: '操作成功',
							icon: 'success'
						}, function() {
							getOrderInfo();
						});
					}).catch(err => {
						return util.Tips({
							title: err
						});
					})
				}
			}
		})
	}
	/**
	 * 
	 * 删除订单提示(弹窗)
	 */
	function delTipClick() {
		del_popup.value.open();
	}
	/**
	 * 
	 * 删除订单提示(取消回调)
	 */
	function delCloseClick() {
		del_popup.value.close();
	}
	/**
	 *
	 * 删除订单
	 */
	function delOrder() {
		orderDelApi({ order_id: order_id.value }).then(res => {
			delCloseClick();
		    setTimeout(() => {
			  uni.navigateBack({
			  	date:1
			  })
			}, 1000);
			return util.Tips({
				title: '删除成功',
				icon: 'success'
			});
		}).catch(err => {
			delCloseClick();
			return util.Tips({
				title: err
			});
		});
	}
	function cancelOrder() {
		uni.showModal({
			title: '提示',
			content: '确认取消该订单?',
			success: function(res) {
				if (res.confirm) {
					orderDelApi({ order_id: order_info.value.order_id })
						.then((data) => {
							console.log(data)
							util.Tips({
								title: data.message
							}, {
								tab: 3,
								url: 1
							})
						})
						.catch((err) => {
							return util.Tips({
								title: err
							});
						});
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	/*申请开票*/
	function applyInvoice() {
		invoice.value.invoice = true;
		add_invoicing_ref.value.getInvoiceDefault();
		add_invoicing_ref.value.getInvoiceList();
	}
	// 关闭发票弹窗
	function changeInvoiceClose(data) {
		if(data)getInvoiceData(data);
		invoice.value.invoice = false;
	}
	// 开票回调
	function getInvoiceData(data) {
		applyInvoiceSumbitApi({ ...data, order_id: order_id.value }).then(res => {
			return util.Tips({
				title: res.message,
			}, function() {
				getOrderInfo();
			});
		}).catch(err => {
			return util.Tips({
				title: err
			});
		})
	}
	// 联系驿站
	function postStationPhone(data){
		console.log(data)
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
<style scoped lang="scss">
   .Exchange-text{
	color: #868686;
   }
	.remark {
		flex: 1;
	}
	.merchant {
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		margin-top: 15rpx;
		border-bottom: 2rpx solid #f0f0f0;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		box-sizing: border-box;
		background-color: #fff;
		.iconfont {
			margin-top: 6rpx;
			font-size: 22rpx;
		}
	}
	.presell_bg_header{
		background: linear-gradient(to right, var(--view-bgColor) 0%, var(--view-bgColor) 100%);
	}
	.b-color {
		background-color: var(--view-bgColor);
	}
	.t-color {
		color: var(--view-bgColor)!important;
	}
	.goodCall {
		text-align: center;
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		border-bottom: 1px solid #eee;
		font-size: 30rpx;
		line-height: 86rpx;
		background: #fff;
		color: #282828;
		.icon-kefu {
			font-size: 28rpx;
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
		background-image: linear-gradient(90deg, var(--view-bgColor) 0%,var(--view-bgColor) 100%);
		&.presell_header{
			background-repeat: no-repeat;
			background-size: cover;
			padding: 35rpx 50rpx;
			.data{
				margin: 8rpx 0 0 13rpx;
				.state{
					font-weight: normal;
					font-size: 24rpx;
				}
			}
		}
	}
	.take-info{
		padding: 0 30rpx 30rpx;
		background-color: #ffffff;
		margin-bottom: 14rpx;
	}
	.take-msg {
		display: flex;
		justify-content: space-between;
		background-color: #FAFAFA;
		padding: 24rpx;
		border-radius: 4rpx;
		.left {
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				font-size: 28rpx;
				font-weight: bold;
				color: #282828;
			}
			.text {
				color: #666666;
			}
		}
		.code {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.iconfont {
				font-size: 50rpx;
				color: #666666;
			}
			.text {
				font-size: 20rpx;
				color: #666666;
				margin-top: 12rpx;
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
		.iconfont{
			font-weight: normal;
			margin-right: 8rpx;
		}
	}
	.order-details .header .data .time {
		margin-left: 20rpx;
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
		color: var(--view-bgColor);
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
	.order-details .wrapper .virtual_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.order-details .virtual_item .virtual_row {
		width: 300rpx;
		align-items: center;
		justify-content: space-between;
		image,uni-image{
			width: 80rpx;
			height: 80rpx;
			border-radius: 100%;
		}
	}
	.order-details .virtual_item .virtual_detail {
		color: var(--view-bgColor);
	}
	.order-details .virtual_item .virtual_delivery {
		line-height: 40rpx;
	}
	.order-details .virtual_item .virtual_delivery_not {
		font-weight: bold;
	}
	.order-details .wrapper .item~.item {
		margin-top: 20rpx;
	}
	.order-details .wrapper .item .conter {
		color: #868686;
		max-width: 500rpx;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-end;
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
		width: 156rpx;
		text-align: center;
		height: 60rpx;
		border-radius: 50rpx;
		color: #fff;
		font-size: 27rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		&.btn_auto{
			width: auto;
			padding: 0 40rpx;
		}
		~.bnt {
			margin-left: 17rpx;
		}
	}
	.order-details .footer .bnt.cancel {
		color: #00dcee;
		border: 1px solid #00dcee;
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
	.grayBg .pictrue {
		width: 290rpx;
		height: 290rpx;
		margin: 0 auto;
	}
	.grayBg .pictrue image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.gear {
		width: 590rpx;
		height: 30rpx;
		margin: 0 auto;
	}
	.gear image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.num {
		color: #282828;
		font-size: 34rpx;
		font-weight: bold;
		margin: 0 auto;
		text-align: center;
		margin-top: 30rpx;
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
		border-radius: 25rpx;
		line-height: 50rpx;
		text-align: center;
		border: 1px solid var(--view-bgColor);
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
	.code-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 32rpx 0 60rpx 0;
		background: #ffffff;
		border-radius: 16rpx 16rpx 0 0;
		position: relative;
		.iconfont{
			font-size: 24rpx;
			color: #939393;
			position: absolute;
			top: 20rpx;
			right: 30rpx;
		}
		.title{
			color: #282828;
			font-size: 32rpx;
			font-weight: bold;
		}
		.trip {
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;
			margin: 40rpx 0;
		}
	}
	.del_popup{
		width: 500rpx;
		background: #fff;
		padding: 32rpx;
		border-radius: 24rpx;
		.popup_model_box_title{
			text-align: center;
			font-size: 32rpx;
			font-weight: 600;
		}
		.popup_model_box_content{
			font-size: 28rpx;
			margin-top: 32rpx;
			text-align: center;
		}
		.popup_foot {
			display: flex;
			justify-content: space-between;
		}
		.popup_model_box_btn{
			width: 45%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background:rgba(38, 146, 255, 1);
			color: #fff;
			border-radius: 24rpx;
			margin-top: 64rpx;
			&.cancel_btn {
                color: #111;
                border: none;
                margin-right: 24rpx;
				background:#fff;
				border: 1px solid #999;
			}
		}
	}
</style>

