<template>
	<c-main class="flex" style="background: #fff;">
		<view class="v-header-wrap">
			<Inav title="我的订单" bgcolor="transparent" fontColor="#fff">
				<template #left>
					<image
						@click="back"
						:src="imgUrlEvent('/images/kkyz/v-arraw-white.png', 'aliyunImgUrl')"
						class="img-header"
						mode="aspectFill"
					></image>
				</template>
			</Inav>
			<view class="search acea-row row-middle">
				<text class="iconfont icon-sousuo"></text>
				<input v-model="keyword" confirm-type="search" placeholder="搜索我的订单" class="input" @confirm="handleSearch" />
			</view>
			<view class="v-header-statistics">
				<view class="statistics-item" v-for="(item,index) in statistics_list" :key="index">
					<text class="item-number">{{ order_data[item.key] ? formatNumber(order_data[item.key],item.key) : 0 }}</text>
					<text class="item-text">{{ item.lable }}</text>
				</view>
			</view>
		</view>
		<view class="v-header-nav">
			<uv-tabs
				@change="navTabChange"
				:current="tab_current"
				:inactiveStyle="{
					color: '#000000',
					fontWeight: 600,
					fontSize: '28rpx',
				}"
				:activeStyle="{
					color: '#1B9AFF',
					fontWeight: 600,
					fontSize: '28rpx',
				}"
				:itemStyle="{ height: '74rpx', padding: '0rpx 36rpx' }"
				lineHeight="4"
				lineWidth="20"
				:list="tab_list"
			></uv-tabs>
		</view>

		<scroll-view :style="{ height: (window_height - 248) + 'px'}" :scroll-y="true" class="v-order-wrap" :show-scrollbar="false" :lower-threshold="120" :scroll-top="top_distance" @scrolltolower="getOrderList" @scroll="scorllEvent">
			<view v-if="presell_proList.length > 0" class="event_container">
				<navigator class="acea-row row-between " url="/packages/mall/views/pages/users/presell_order_list/index" hover-class='none'>
					<view class="info">
						<view class="title">预售尾款订单转到这里了！</view>
						<view class="desc">有 <text class="t-color">{{ presell_order_count }}</text> 笔预售尾款订单待付款，请点击查看
						</view>
					</view>
					<view class="photo acea-row row-between">
						<view class='picture'>
							<image
								:src='(presell_proList[0]?.orderProduct[0]?.cart_info.productAttr && presell_proList[0]?.orderProduct[0]?.cart_info.productAttr.image) || presell_proList[0]?.orderProduct[0]?.cart_info.product.image'>
							</image>
						</view>
						<view class="more_btn"><text class="iconfont icon-gengduo3"></text></view>
					</view>
				</navigator>
			</view>

			<view class="v-order-list" v-if="order_list.length > 0">
				<!-- 待付款 -->
				<template v-if="order_status == 1">
					<view class="order-item" v-for="(item,index) in order_list" :key="index" v-show="order_list.length > 0 && order_list[0]?.group_order_sn">

						<view class="item-title df-r jc-sb">
							<text class="order-no">订单号：{{ item.group_order_sn }}</text>
							<text class="order-status">{{ item.order&&item.order[0].activity_type === 2 && item.order&&item.order[0].cart_info.productPresell.presell_type ==2 ? "待付定金" : "待付款" }}</text>
						</view>

						<view @click='goOrderDetails(item.group_order_id)' v-if="item.order">
							<view v-for="(order,j) in item.order" :key="order.order_id+j">

								<!-- 预售 -->
								<view v-if="item.activity_type === 2">
								
									<template v-for="(goods,g) in order.orderProduct" :key="g">
										<view class="item-info df-r ac-s">
											<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image' mode="aspectFill" class="item-img"></image>
											<view class="item-desc df-r jc-sb">
												<view class="item-desc-left df-c jc-sb">
													<view class="left-title line2">
														<text class="title-text">
															<text class="event_name event_bg">预售</text>{{goods.cart_info.product.store_name}}
														</text>
													</view>
													<view class="left-title tips line1" v-if="item.status == 0">
														<text class="title-text">发货时间：</text>
														<!--全款预售-->
														<text v-if="goods.cart_info.productPresell.presell_type === 1">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
														<!--定金预售-->
														<text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
													</view>
													<template v-if="goods.cart_info.productPresell.presell_type === 2">
														<view>
															<text class="subtitle">定金待支付<text class="t-color">￥{{ order.pay_price }}</text></text>
															<text class="subtitle">尾款待支付<text class="t-color">￥{{ order.presellOrder.pay_price }}</text></text>
														</view>
													</template>
												</view>
												<view class="item-desc-right df-c jc-sb ai-fe">
													<text class="right-price">￥{{goods.cart_info.productPresellAttr.presell_price}}</text>
													<text class="right-number">x{{goods.product_num}}</text>
												</view>
											</view>
										</view>
									</template>

								</view>
								<!-- 非预售 -->
								<view v-else>
									<template v-for="(goods,g) in order.orderProduct" :key="g">
										<view class="item-info df-r ac-s">
											<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image' mode="aspectFill" class="item-img"></image>
											<view class="item-desc df-r jc-sb">
												<view class="item-desc-left df-c jc-sb">
													<view class="left-title line2">
														<text class="title-type-text" v-if="goods.product_type != 0 && goods.product_type != 10">{{goods.product_type == 1 ? "秒杀" : goods.product_type == 2 ? "预售" : goods.product_type == 3 ? "助力" : goods.product_type == 4 ? "拼团" : ""}}</text>
														<text class="title-text">
															{{goods.cart_info.product.store_name}}
														</text>
													</view>
													<text class="subtitle"></text>
												</view>
												<view class="item-desc-right df-c jc-sb ai-fe" v-if="item.order&&item.order[0].activity_type == 4">
													<text class="right-price">￥{{goods.cart_info.activeSku.active_price}}</text>
													<text class="right-number">x{{goods.product_num}}</text>
												</view>
												<view class="item-desc-right df-c jc-sb ai-fe" v-else>
													<text class="right-price">￥{{goods.cart_info.productAttr.price}}</text>
													<text class="right-number">x{{goods.product_num}}</text>
												</view>
											</view>
										</view>
									</template>
								</view>
								

							</view>
						</view>

						<view class="item-footer df-r ai-c jc-sb">
							<view class="item-footer-left df-r ai-c" v-if="item.order&&item.order[0].activity_type !== 2">
								<text class="count">共{{item.total_num || 0}}件</text>
								<text class="price-text">小计</text>
								<text class="price-number">¥{{item.pay_price}}</text>
								<text class="countdown" v-if="(order_status==1&&item.countDownTime&&item.countDownTime!=undefined)">{{'('+item.countDownTime+')'}}</text>
							</view>
							<view v-else></view>
							<view class="item-footer-btns df-r ai-c jc-fe">
								<view class="item-footer-btn" @click.stop='goPay(item.pay_price,item.group_order_id)'>立即付款</view>
							</view>
						</view>

					</view>
				</template>

				<!-- 待发货 待收货 待评价 已完成 -->
				<template v-else> 

					<view class="order-item" v-for="(item,index) in order_list" :key="index" v-show="order_list.length > 0 && order_list[0]?.order_sn">

						<view class="item-title df-r jc-sb">
							<text class="order-no">订单号：{{ item.order_sn }}</text>
							<text class="order-status">{{ getStatus(item)}}</text>
						</view>

						<view @click='goOrderDetails(item.order_id)'>
							<!-- 预售 -->
							<view v-if="item.activity_type === 2">

								<template v-for="(goods,index) in item.orderProduct" :key="index">
									<view class="item-info df-r ac-s">
										<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image' mode="aspectFill" class="item-img"></image>
										<view class="item-desc df-r jc-sb">
											<view class="item-desc-left df-c jc-sb">
												<view class="left-title line2">
													<text class="title-text">
														<text class="event_name event_bg">预售</text>{{goods.cart_info.product.store_name}}
													</text>
												</view>
												<view class="left-title tips line1" v-if="item.status == 0">
													<text class="title-text">发货时间：</text>
													<!--全款预售-->
													<text v-if="goods.cart_info.productPresell.presell_type === 1">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付成功后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
													<!--定金预售-->
													<text v-if="goods.cart_info.productPresell.presell_type === 2">{{ goods.cart_info.productPresell.delivery_type === 1 ? '支付尾款后' : '预售结束后' }}{{ goods.cart_info.productPresell.delivery_day }}天内</text>
												</view>
												<view class="left-title tips">
													<text style="color: orange;font-size: 24rpx;">{{goods.is_refund==1?'退款中':goods.is_refund==2?'部分退款':goods.is_refund==3?'全部退款':''}}</text>
												</view>
												<text class="subtitle"></text>
											</view>
											<view class="item-desc-right df-c jc-sb ai-fe">
												<text class="right-price">￥{{goods.cart_info.productPresellAttr.presell_price}}</text>
												<text class="right-number">x{{goods.product_num}}</text>
											</view>
										</view>
									</view>
								</template>

							</view>
							<!-- 非预售 -->
							<view v-else>
								<template v-for="(goods,index) in item.orderProduct" :key="index">
									<view class="item-info df-r ac-s">
										<image :src='(goods.cart_info.productAttr && goods.cart_info.productAttr.image) || goods.cart_info.product.image' mode="aspectFill" class="item-img"></image>
										<view class="item-desc df-r jc-sb">
											<view class="item-desc-left df-c jc-sb">
												<view class="left-title line2">
													<text class="title-type-text" v-if="goods.product_type != 0 && goods.product_type != 10">{{goods.product_type == 1 ? "秒杀" : goods.product_type == 2 ? "预售" : goods.product_type == 3 ? "助力" : goods.product_type == 4 ? "拼团" : ""}}</text>
													<text class="title-text">
														{{goods.cart_info.product.store_name}}
													</text>
												</view>
												<text class="title-text" style="color: orange;font-size: 24rpx;">
													{{goods.is_refund==1?'退款中':goods.is_refund==2?'部分退款':goods.is_refund==3?'全部退款':''}}
												</text>
												<text class="subtitle"></text>
											</view>
											<view class="item-desc-right df-c jc-sb ai-fe" v-if="item.activity_type == 3">
												<text class="right-price" v-if="goods.cart_info.productAssistAttr">￥{{goods.cart_info.productAssistAttr.assist_price}}</text>
												<text class="right-number">x{{goods.product_num}}</text>
											</view>
											<view class="item-desc-right df-c jc-sb ai-fe" v-else-if="item.activity_type == 4">
												<text class="right-price" v-if="goods.cart_info.activeSku">￥{{goods.cart_info.activeSku.active_price}}</text>
												<text class="right-number">x{{goods.product_num}}</text>
											</view>
											<view class="item-desc-right df-c jc-sb ai-fe" v-else>
												<text class="right-price">￥{{goods.cart_info.productAttr.price}}</text>
												<text class="right-number">x{{goods.product_num}}</text>
											</view>
										</view>
									</view>
								</template>
							</view>
						</view>

						<view class="item-footer df-r ai-c jc-sb">
							<view class="item-footer-left df-r ai-c" v-if="item.activity_type == 2">
								<text class="count">共{{item.orderNum || 0}}件</text>
								<text class="price-text">小计</text>
								<text class="price-number">¥{{item.presell_price}}</text>
							</view>
							<view class="item-footer-left df-r ai-c" v-else>
								<text class="count">共{{item.orderNum || 0}}件</text>
								<text class="price-text">小计</text>
								<text class="price-number">¥{{item.pay_price}}</text>
							</view>
							<view class="item-footer-btns df-r ai-c jc-fe">
								<view class="item-footer-btn" v-if="!item.receipt && item.status != -1 && item.open_receipt == 1" @click.stop='applyInvoice(item.order_id)'>申请开票</view>
								<!-- status：订单状态（0：待发货；1：待收货；2：待评价；3：已完成； 9: 拼团中 10:  待付尾款 11:尾款超时未付 -1：已退款） -->
								<template v-if="(item.status == 0 || item.status == 9 || item.status == 1 || item.status == 2) && item?.orderProduct[0].is_refund == 0">
									<view class="item-footer-btn" v-if="item.refund_switch == 1" @click='refundEvent(item)'>申请退货</view>
								</template>
								<template v-if="item.status == 0 || item.status == 9 || item.status == -1">
									<view class="item-footer-btn" @click='goOrderDetails(item.order_id)'>查看详情</view>
								</template>
								<template v-if="item.status == 1">
									<view class="item-footer-btn" v-if="item.delivery_type == 1 || item.delivery_type == 2" @click='goOrderLogistics(item.order_id)'>查看物流</view>
									<view class="item-footer-btn" @click='confirmOrder(item,index)' v-if="item?.orderProduct[0].is_refund!=1">确认收货</view>
								</template>
								<template v-if="item.status == 2">
									<!-- 退款中不展示待评价 -->
									<template v-if="item.orderProduct[0]?.is_refund != 1">
										<view class="item-footer-btn" @click="autoEvaluation(item)">一键评价</view>
										<view class="item-footer-btn" @click='goOrderDetailsEvaluation(item.order_id)'>去评价</view>
									</template>
									<view v-else class="item-footer-btn" @click='goOrderDetails(item.order_id)'>查看详情</view>
								</template>
								<template v-if="item.status == 3">
									<view class="item-footer-btn no-bg flex flex-ac jc-ct" @click='openOnchain(item.order_sn)' v-if="item.antChainStatus">
										<image class="certificate-icon" :src="imgUrlEvent('/images/mall/certificate-logo.png', 'aliyunImgUrl')" mode="scaleToFill"/>
										<text>确权证书</text>
									</view>
									<view class="item-footer-btn" @click='goOrderDetails(item.order_id)' v-if="item.activity_type == 2 || item.activity_type == 3 || item.activity_type == 10">查看详情</view>
									<view class="item-footer-btn" @click='goOrderDetails(item.order_id)' v-else>再次购买</view>
								</template>
							</view>

						</view>

					</view>

				</template>

			</view>
			<template v-if="!order_list.length  && show_skeletons">
				<view class="order-skeleton" v-for="item in 4">
					<uv-skeletons
						:loading="!order_list.length && show_skeletons"
						:skeleton="store_skeleton"
					></uv-skeletons>
				</view>
			</template>

			<c-null style="height: 500rpx" title="暂无订单" v-if="!order_list.length && !show_skeletons"></c-null>
		</scroll-view>

		<home></home>
		<payment :payMode='pay_mode' :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id"
			:totalPrice='total_price'></payment>
		<addInvoicing ref="add_invoicing_ref" @changeInvoiceClose="changeInvoiceClose" :invoice='invoice'></addInvoicing>
		<!-- 一键评价确认框 -->
		 <!-- <Imodal ref="evaluation_dialog" content="温馨提示" title="确定一键评价吗？" @close="evaluationClose" @confirm="evaluationConfirm" ></Imodal> -->
		 <g-new-modal ref="evaluation_dialog" btn_type="2" title="一键评价" cancelText="取消" confirmText="确认评价"  @close="evaluationClose" @confirm="evaluationConfirm">
			<template #content>
				<scroll-view :scroll-y="true" class="evaluation-scroll-box" :show-scrollbar="false">
					<radio-group @change="evaluationRadioChange">
						<label class="uni-list-cell uni-list-cell-pd c-label df-r ai-c" v-for="(item, index) in dictRandomList" :key="index">
							<image class="c-label-icon" :src="imgUrlEvent('/images/mall/e-icon.png', 'aliyunImgUrl')" mode="aspectFit"/>
							<view class="c-label-text df-r ai-c">{{item.content}}</view>
							<view class="df-r ai-c">
								<radio :value="index + ''" color="#1B9AFF" style="transform:scale(0.9);display: flex;align-items: center;justify-content: center;" :checked="index == evaluation_current" />
							</view>
						</label>
					</radio-group>
				</scroll-view>
			</template>
		</g-new-modal>
		<!-- 上链弹窗 -->
    	<g-new-modal ref="onchain_modal"  :btn_type="1" @confirm="closeOnchain" title="恭喜你"  confirmText="查看证书">
			<template #content>
				<view class="onchain-content">本次购物获得蚂蚁区块链确权证书！</view>
			</template>
		</g-new-modal>

		<!-- 确认证书 -->
		<uni-popup
			ref="certificate_modal"
			borderRadius="16px 16px 16px 16px"
			:mask-click="false"
			type="center"
		>
			<view class="certificate-box">
				<view class="certificate-content">
					<view class="certificate-info">
						<view class="info-title">交易数据确权证书</view>
						<view class="col-item" style="height: 64rpx;">
							<view class="cal-label">品名：</view>
							<view class="cal-value nowrap-line2">{{ ant_chain_info.product_name }}</view>
						</view>
						<view class="col-item">
							<view class="cal-label">来源：</view>
							<view class="cal-value">{{ ant_chain_info.merchant_name }}</view>
						</view>
						<view class="col-item">
							<view class="cal-label">价值：</view>
							<view class="cal-value">{{ ant_chain_info.amount }}元</view>
						</view>
						<view class="col-item">
							<view class="cal-label">用户ID：</view>
							<view class="cal-value">{{ ant_chain_info.uid }}</view>
						</view>
						<view class="col-item">
							<view class="cal-label">完成交易上链时间：</view>
							<view class="cal-value">{{ ant_chain_info.create_time }}</view>
						</view>
						<view class="col-item">
							<view class="cal-label">哈希值：</view>
							<view class="cal-value nowrap-line2">{{ ant_chain_info.tx_hash }}</view>
						</view>
						<view class="qr-code-wrap">
							<view class="qr-code-box">
								<image class="qr-code-img" :src="ant_chain_info.image_url" mode="scaleToFill"/>
							</view>
							<view class="qr-code-tip">支付宝扫码查看该确权证书</view>
						</view>
						<view class="explain-box">
							<view class="explain-title">证书说明：</view>
							<view class="explain-text">1.本证书由看看宇宙基于蚂蚁区块链签发，以证明该文件自存证时间起即存在，且内容完整，无法被篡改。</view>
							<view class="explain-text">2.该身份和交易信息等，将保存在蚂蚁区块链上。(扫码了解以上信息)</view>
						</view>
					</view>
					<image class="certificate-bg" :src="imgUrlEvent('/images/mall/certificate-img1.png', 'aliyunImgUrl')" mode="scaleToFill"/>
					<image class="certificate-del" @click="closeCertificateModal" :src="imgUrlEvent('/images/mall/certificate-del1.png', 'aliyunImgUrl')" mode="scaleToFill"/>
				</view>
				<view class="download-btn" @click="initCanvas(imgUrlEvent('/images/mall/certificate-img1.png', 'aliyunImgUrl'))">下载证书</view>
			</view>
		</uni-popup>

		<!-- 画布 -->
		<view
			id="canvas-container"
			class="canvas-container"
			style="width: 0; height: 0; overflow: hidden; z-index: -9999"
		>
			<canvas
			id="myCanvas"
			canvas-id="myCanvas"
			style="width: 710px; height: 1152px; background: #ffffff;"
			></canvas>
		</view>
	</c-main>
</template>

<script lang="js" setup>
	import { ref, computed, onBeforeUnmount, watch, nextTick, getCurrentInstance } from 'vue'
	import { onLoad,onShow} from "@dcloudio/uni-app";
	import {getOrderListApi ,orderDataApi ,unOrderCancel,orderDel,groupOrderListApi,orderTakeApi,applyInvoiceSumbitApi,oneClickEvaluationApi,getAntChainDetailApi,dictRandomListApi} from '@/business/api/modules/order';
	import {openOrderSubscribe} from '@/infrastructure/utils/SubscribeMessage';
	import payment from '@/components/payment';
	import home from '@/pages/components/home/index.vue';
	import addInvoicing from '@/components/addInvoicing';
	import {toLogin} from '@/infrastructure/libs/login.js';
	import util  from '@/infrastructure/utils/utils.js';
	import store from '@/business/store/modules/mall';
	import Imodal from "@/views/components/i-modal.vue";
	import Inav from "@/views/components/i-nav.nvue";
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
	import { getLocationXY } from "@/views/pages/save-money/infrastructure/utils/utils"
	const show_skeletons = ref(true)
	const store_skeleton = ref([
		{
			type: "flex",
			num: 1,
			gap: "20rpx",
			children: [
			{
				type: "custom",
				num: 1,
				style: ["width: 160rpx;height: 160rpx;margin-right: 20rpx;"],
			},
			{
				type: "line",
				num: 3,
				gap: "20rpx",
				style: [
					"width: 530rpx;height: 100rpx",
					"width: 530rpx;height: 60rpx",
					"width: 530rpx;height: 30rpx",
				],
			},
			],
		},
	]);
	const statistics_list = ref([
		{
			key: 'total_num',
			lable: '消费订单'
		},
		{
			key: 'total_money',
			lable: '总消费'
		},
	])
	const tab_list = ref([
		{ name: "全部", id: 1 },
		{ name: "待付款", id: 2 },
		{ name: "待发货", id: 3 },
		{ name: "待收货", id: 4 },
		{ name: "待评价", id: 5 }
	]);
	const tab_current = ref(0)
	const keyword = ref('')

	function navTabChange (data) {
		tab_current.value = data.index;
		console.log(data.index);
		statusClick(data.index)
	}
	function formatNumber(num,key) {
       if(key == 'orderPrice'){
		 return num + '元';
	   }else{
		 return num.toString()
	   }
	}
	function getStatus (item) {
		let status_ = item.status
		switch(status_) {
			case 0:
				if (item.order_type==1) {
					return '待核销'
				} else {
					return '待发货'
				}
			case 1:
				return '待收货'
			case 2:
				return '待评价'
			case 3:
				return '已完成'
			case -1:
				return '已退款'
		}
	}
	const evaluation_dialog = ref()
	const mall_store = store()
	//是否加载中
	const loading = ref(false) 
	//是否加载完毕
	const loadend = ref(false)
	//提示语
	const load_title = ref('加载更多')
	//订单数组
	const order_list = ref([])
	//定金预售订单
	const presell_proList = ref([]) 
	const presell_order_count = ref(0)
	//订单详细统计
	const order_data = ref({})
	//订单状态
	const order_status = ref(0)
	const page = ref(1)
	const page_size = ref(10)
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
	const invoice_order_id = ref('')
	const total_price = ref('0')
	const is_ready = ref(true)
	const invoice = ref({
		invoice: false,
		add: true,
	})
	const add_invoicing_ref = ref();
	const on_change_fun_events = {
		payClose
	}
	const window_height = uni.getSystemInfoSync().windowHeight;
	const cuurent_order = ref({})
	const location_info = ref({
		longitude: '',
        latitude: '',
	})
	const top_distance = ref(0);
	const old_top_distance = ref(0);
	// 上链弹窗
	const onchain_modal = ref()
	// 上链订单id
	const onchain_order_sn = ref('')
	// 上链订单信息
	const ant_chain_info = ref({});
	// 获得当前组件实例
	const instance = getCurrentInstance();
	// 确权证书弹窗
	const certificate_modal = ref()
	// computed
	const hide_mer_status = computed(() => mall_store.globalData.hide_mer_status);
	const alipay_open = computed(() => mall_store.globalData.alipay_open);
	const yue_pay_status = computed(() => mall_store.globalData.yue_pay_status);
	const wxpay_open = computed(() => mall_store.globalData.wxpay_open);
	// watch
	watch(() => wxpay_open.value, (n) => {
		pay_mode.value[0].payStatus = n
	})
	watch(() => alipay_open.value, (n) => {
		pay_mode.value[1].payStatus = n
	})
	watch(() => yue_pay_status.value, (n) => {
		pay_mode.value[2].payStatus = n
	})
	onShow(() => {
		let is_login = uni.getStorageSync('isLogin')
		if (is_login) {
			page.value = 1;
			loadend.value = false;
			loading.value = false;
			getOrderData();
			getOrderList();
		} else {
			toLogin()
		}
		getLocation_()
	})
	onBeforeUnmount(() => {
		clearIntervalAll();
	})
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad((options) => {
		if (options.status) {
			order_status.value = options.status;
			tab_current.value = Number(order_status.value || 0);
		};
		// 获取商品通用评论文案
		getDictRandomList()
	})

	const dictRandomList = ref([])
	const evaluation_current = ref(0)

	// 获取商品通用评论文案
	async function getDictRandomList () {
		try {
			let res = await dictRandomListApi();
			dictRandomList.value = res.data
		} catch (error) {}
	}

	function evaluationRadioChange (evt) {
		evaluation_current.value = evt.detail.value - 0
	}

	function back () {
		uni.navigateBack({
			delta: 1
		})
	}

	function getLocation_ () {
		getLocationXY((data) => {
			console.log("111")
			const { longitude, latitude } = data;
			location_info.value = { longitude, latitude }
		}, (err) => {
			location_info.value = { longitude: '', latitude: '' }
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
	 * 关闭支付组件
	 *
	 */
	function payClose() {
		pay_close.value = false;
	}
	/**
	 * 获取订单统计数据
	 *
	 */
	function getOrderData() {
		orderDataApi().then(res => {
			order_data.value = res.data
		})
	}
	/**
	 * 打开支付组件
	 *
	 */
	function goPay(pay_price, order_id) {
		pay_close.value = true;
		pay_order_id.value = order_id.toString()
		total_price.value = pay_price
	}
	/**
	 * 支付成功回调
	 *
	 */
	function pay_complete() {
		loadend.value = false;
		page.value = 1;
		order_list.value = [];
		pay_close.value = false;
		pay_order_id.value = '';
		getOrderData();
		getOrderList();
	}
	/**
	 * 支付失败回调
	 *
	 */
	function pay_fail() {
		pay_close.value = false;
		pay_order_id.value = '';
	}
	// 查看物流
	function goOrderLogistics(order_id) {
		if (!order_id) return util.Tips({
			title: '缺少订单号无法查看订单详情'
		});
		uni.navigateTo({
			url: '/pagesOrder/goods-logistics/index?orderId=' + order_id
		})
	}
	/**
	 * 去订单详情
	 */
	function goOrderDetails(order_id) {
		if (!order_id) return util.Tips({
			title: '缺少订单号无法查看订单详情'
		});
		console.log("订单---》", order_status.value)
		// #ifdef MP
		uni.showLoading({
			title: '正在加载',
		})
		openOrderSubscribe().then(() => {
			uni.hideLoading();
			if (order_status.value == 1) {
				uni.navigateTo({
					url: '/pagesOrder/order-details/stay?order_id=' + order_id
				})
			} else {
				uni.navigateTo({
					url: '/pagesOrder/order-details/index?order_id=' + order_id
				})
			}
		}).catch(() => {
			uni.hideLoading();
		})
		// #endif
		// #ifndef MP
		if (order_status.value == 1) {
			uni.navigateTo({
				url: '/pagesOrder/order-details/stay?order_id=' + order_id
			})
		} else {
			uni.navigateTo({
				url: '/pagesOrder/order-details/index?order_id=' + order_id
			})
		}
		// #endif
	}
	/**
	 * 点击去评价
	 */
	function goOrderDetailsEvaluation(order_id) {
		if (!order_id) return util.Tips({
			title: '缺少订单号无法查看订单详情和评价'
		});
		// #ifdef MP
		if (order_status.value == 1) {
			uni.navigateTo({
				url: '/pagesOrder/order-details/stay?order_id=' + order_id
			})
		} else {
			uni.navigateTo({
				url: '/pagesOrder/order-details/index?order_id=' + order_id
			})
		}
		// #endif
		// #ifndef MP
		if (order_status.value == 1) {
			uni.navigateTo({
				url: '/pagesOrder/order-details/stay?order_id=' + order_id
			})
		} else {
			uni.navigateTo({
				url: '/pagesOrder/order-details/index?order_id=' + order_id
			})
		}
		// #endif
	}
	/**
	 * 切换类型
	 */
	function statusClick(status) {
		if (status == order_status.value) return;
		if(status==1){
			clearIntervalAll();
		}
		order_status.value = status;
		loadend.value = false;
		loading.value = false;
		page.value = 1;
		order_list.value = []
		getOrderList();
	}
	/**
	 * 获取订单列表
	 */
	function getOrderList() {
		console.log('获取数据')
		if (loadend.value) return;
		if (loading.value) return;
		loading.value = true;
		show_skeletons.value = true;
		load_title.value = "加载更多";
		if (is_ready.value) {
			uni.showLoading({
				title: '加载中',
				mask: true,
			});
			is_ready.value = false
			if (page.value == 1) {
				top_distance.value = old_top_distance.value;
				nextTick(() => {
					top_distance.value = 0;
				});
			}
			if (order_status.value == 1) {
				groupOrderListApi({
					page: page.value,
					page_size: page_size.value,
					keyword: keyword.value,
				}).then(res => {
					uni.hideLoading();
					is_ready.value = true;
					let list = res.data.items || [];
					let _loadend = list.length < page_size.value;
					order_list.value = page.value == 1 ? list : util.SplitArray(list, order_list.value);
					getProductCount();
					loadend.value = _loadend;
					loading.value = false;
					show_skeletons.value = false;
					load_title.value = _loadend ? "我也是有底线的" : '加载更多';
					page.value = page.value + 1
					if(list.length>0){
						console.log('触发--->',)
						list.forEach((item,i) => {
							countDown(i)
						})
					}
				}).catch(err => {
					uni.hideLoading();
					show_skeletons.value = false;
					loading.value = false;
				})
			} else {
				getOrderListApi({
					page: page.value,
					page_size: page_size.value,
					type: order_status.value,
					keyword: keyword.value,
				}).then(res => {
					uni.hideLoading();
					is_ready.value = true;
					let list = res.data.items || [];
					let _loadend = list.length < page_size.value;
					order_list.value = page.value == 1 ? list : util.SplitArray(list, order_list.value);
					getProductCount();
					loadend.value = _loadend;
					loading.value = false;
					show_skeletons.value = false;
					load_title.value = _loadend ? "我也是有底线的" : '加载更多';
					page.value = page.value + 1
				}).catch(err => {
					uni.hideLoading();
					show_skeletons.value = false;
					loading.value = false;
				})
			}

			
		}
		console.log('order_list.value--->',order_list.value)
	}
	// 列表滚动事件
	function scorllEvent(e) {
		old_top_distance.value = e.detail.scrollTop;
	}
	//倒计时
	function countDownFun(time) {
		// console.log(time)
		let startTime = new Date(); //当前时间
		// let end = new Date(time); //结束时间
		// console.log(end,"endendend")
		let result = parseInt(time - startTime/1000); //计算出豪秒
		let d = parseInt(result / (24 * 60 * 60)); //用总共的秒数除以1天的秒数
		let h = parseInt((result / (60 * 60)) % 24); //精确小时，用去余
		let m = parseInt((result / 60) % 60); //剩余分钟就是用1小时等于60分钟进行趣余
		let s = parseInt(result % 60);
		// console.log(result,'result')
		//当倒计时结束时，改变内容
		if (result <= 0) {
		   return "已过支付时间";
		}
		if (h < 10) {
		  h = "0" + h;
		}
		if (s < 10) {
		  s =  "0"  + s;
		}
		if (h == 0 && m == 0) {
		  return s + "秒";
		} else if (h == 0) {
		  return m + "分" + s + "秒"
		} else if(d == 0) {
		  return h + "时" + "分" + "秒";
		} else {
		  return d + "天" + h + "时" + m + "分" + s + "秒"
		}
	}
	// 页面多个倒计时 归零时清除
	function countDown(i) {
		let item = order_list.value[i];
		order_list.value[i].countDownFn = setInterval(() => {
			if (countDownFun(item.countDownTime) == "已过支付时间") {
				clearInterval(order_list.value[i].countDownFn); //清除定时器
				getOrderList();
			} else {
				item.countDownTime = countDownFun(Number(item.close_order_str));
				order_list.value[item.countDownTime] = countDownFun(Number(item.close_order_str))
			}
		}, 1000);
	}
	//清除倒计时
	function clearIntervalAll(){
		if(order_list.value.length>0){
			order_list.value.forEach((item,i) => {
				clearInterval(order_list.value[i].countDownFn);
			})
		}
	}
	/**
	 * 获取单个订单商品数量
	 */
	function getProductCount() {
		if (order_status.value !== 1) {
			order_list.value.forEach((item, i) => {
				let orderNum = 0
				if (item.orderProduct) {
					item.orderProduct.forEach((val) => {
						orderNum += val.product_num
					})
					order_list.value[i]['orderNum'] = orderNum;
				}
			})
		}
	}
	// 确认收货
	function confirmOrder(item, index) {
		uni.showModal({
			title: '确认收货',
			content: '为保障权益，请收到货确认无误后，再确认收货',
			success: function(res) {
				if (res.confirm) {
					orderTakeApi({ order_id: item.order_id }).then(res => {
						return util.Tips({
							title: '操作成功',
							icon: 'success'
						}, function() {
							order_list.value.splice(index, 1);
							getOrderData();
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
	/*申请开票*/
	function applyInvoice(order_id) {
		invoice_order_id.value = order_id
		invoice.value.invoice = true;
		add_invoicing_ref.value.closeTitle();
		add_invoicing_ref.value.getInvoiceDefault();
		add_invoicing_ref.value.getInvoiceList();
	}
	// 关闭发票弹窗
	function changeInvoiceClose(data) {
		if (data) getInvoiceData(data);
		invoice.value.invoice = false;
	}
	// 开票回调
	function getInvoiceData(data) {
		applyInvoiceSumbitApi({ ...data, order_id: invoice_order_id.value }).then(res => {
			return util.Tips({
				title: res.message,
			});
		}).catch(err => {
			return util.Tips({
				title: err
			});
		})
	}

	// 申请退款
	const refundEvent = (item) => {
		console.log(item)
		const { status, orderProduct } = item;
		let is_to_be_shipped = '';
		if (status == 2) {
			let is_has_rated = orderProduct.some(v => v.is_reply == 1)
			if (is_has_rated) {
				util.Tips({
					title: '已评价订单，不能退款，详情请咨询客服'
				});
				return;
			}
		}
		if (status == 0) {
			is_to_be_shipped = true
		}
		uni.navigateTo({
			url: '/pagesOrder/refund/select?order_id=' + item.order_id + '&is_to_be_shipped=' + is_to_be_shipped
		})
	}
    
	// 一键评价
	const autoEvaluation = (item) => {
	   console.log('item----->',item)
	   cuurent_order.value = item
       evaluation_dialog.value.open()
	}
	
	const evaluationClose = () => {
		evaluation_dialog.value.close()
	}
	const evaluationConfirm = async () => {
		let evaluation_content = '';
		evaluation_content = dictRandomList.value[evaluation_current.value].content;
		evaluation_dialog.value.close()
		let location = ''
		if (location_info.value.longitude && location_info.value.latitude) {
			location = location_info.value.longitude + ',' + location_info.value.latitude
		}
		if (!location) {
			getLocation_()
			return
		}
		await oneClickEvaluationApi({order_id:cuurent_order.value.order_id, location, content: evaluation_content })
		 util.Tips({
			icon:'sucsses',
			title: '评价成功'
		});
		order_list.value = []
		page.value = 1
		loadend.value = false;
		loading.value = false;
		setTimeout(() => {
			// 获取商品通用评论文案
			getDictRandomList()
			getOrderList();
		}, 1000)
	}

	// 搜索
	function handleSearch() {
		order_list.value = []
		page.value = 1
		loadend.value = false;
		loading.value = false;
		getOrderList();
	}

	// 打开上链弹窗提示
	function openOnchain(id) {
		onchain_order_sn.value = id;
		onchain_modal.value.open();
	}

	// 关闭上链弹窗提示
	function closeOnchain() {
		uni.showLoading({
			title: '正在加载中...',
		})
		onchain_modal.value.close();
		getAntChainDetail();
	}

	// 获取订单上链数据
	function getAntChainDetail() {
		if (!onchain_order_sn.value) return;
		getAntChainDetailApi({ order_sn: onchain_order_sn.value}).then((res) => {
			if (res.data) {
				ant_chain_info.value = res.data;
				ant_chain_info.value.image_url = ant_chain_info.value.image_url + '?x-oss-process=image/resize,m_fill,w_200,h_200'
				let timer = setTimeout(() => {
					uni.hideLoading()
					certificate_modal.value.open();
					clearTimeout(timer);
				}, 500)
			} else {
				uni.hideLoading()
			}
		}).catch(err => {
			uni.hideLoading()
		})
	}

	// 关闭确权证书弹窗
	function closeCertificateModal() {
		certificate_modal.value.close();
	}

	const initCanvas = (img) => { 
		uni.downloadFile({
			url: img,
			success(res1) {
			uni.downloadFile({
				url: ant_chain_info.value.image_url,
				success(res2) {
				uni.showLoading({
				title: "图片生成中...",
				mask: true,
				});
				createCanvas(
				res1.tempFilePath,
				res2.tempFilePath,
				ant_chain_info.value
				);
				},
			});
			},
		});
	};

	const createCanvas = (img_url1, img_url2, info_data) => {
	var ctx = uni.createCanvasContext("myCanvas", instance); //创建画布
	uni
		.createSelectorQuery()
		.select("#canvas-container")
		.boundingClientRect(function (rect) {
		ctx.setFillStyle("#FFFFFF");
		ctx.fillRect(0, 0, 710, 1152);
		ctx.save();
		if (img_url1) {
			ctx.drawImage(img_url1, 0, 0, 710, 1152);
			ctx.save();
		}
		if (img_url2) {
			ctx.restore();
			ctx.drawImage(img_url2, 255, 620, 200, 200);
			ctx.save();
		}
		// 标题
		ctx.setFillStyle('#000000')
		ctx.font = '44px sans-serif';
		ctx.fillText(`交易数据确权证书`, 180, 180)

		// 内容
		// 品名
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`品名：`, 88, 244)
		// 长度处理
		const arr_str1 = ctxStrSlice('char', info_data.product_name || '')
		ctx.setFillStyle('#999999')
		ctx.font = '24px sans-serif';
		ctx.fillText(`${arr_str1[0]}`, 160, 244)
		console.log("arr_str1---->", arr_str1)
		if (arr_str1.length > 1) {
			ctx.setFillStyle('#999999')
			ctx.font = '24px sans-serif';
			ctx.fillText(`${arr_str1[1]}`, 160, 276)
		}
		
		// 来源
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`来源：`, 88, 328)
		ctx.setFillStyle('#999999')
		ctx.font = '24px sans-serif';
		ctx.fillText(`${info_data.merchant_name}`, 160, 328)
		// 价值
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`价值：`, 88, 380)
		ctx.setFillStyle('#999999')
		ctx.font = '24px sans-serif';
		ctx.fillText(`${info_data.amount}元`, 160, 380)
		// 用户ID
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`用户ID：`, 88, 432)
		ctx.setFillStyle('#999999')
		ctx.font = '24px sans-serif';
		ctx.fillText(`${info_data.uid}`, 184, 432)
		// 完成交易上链时间
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`完成交易上链时间：`, 88, 484)
		ctx.setFillStyle('#999999')
		ctx.font = '24px sans-serif';
		ctx.fillText(`${info_data.create_time}`, 304, 484)
		// 哈希值
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`哈希值：`, 88, 536)
		// 长度处理
		const arr_str2 = ctxStrSlice('str', info_data.tx_hash || '')
		ctx.setFillStyle('#999999')
		ctx.font = '24px sans-serif';
		ctx.fillText(`${arr_str2[0]}`, 184, 536)
		if (arr_str2.length > 1) {
			ctx.setFillStyle('#999999')
			ctx.font = '24px sans-serif';
			ctx.fillText(`${arr_str2[1]}`, 184, 564)
		}
		// 支付宝扫码查看该确权证书
		ctx.setFillStyle('#999999')
		ctx.font = '22px sans-serif';
		ctx.fillText(`支付宝扫码查看该确权证书`, 223, 856)

		// 证书说明：
		ctx.setFillStyle('#000000')
		ctx.font = '24px sans-serif';
		ctx.fillText(`证书说明：`, 88, 898)

		// 证书说明：1.本证书由看看宇宙基于蚂蚁区块链签发，以证明该文件自存证时间起即存在，且内容完整，无法被篡改。
		ctx.setFillStyle('#999999')
		ctx.font = '22px sans-serif';
		ctx.fillText(`1.本证书由看看宇宙基于蚂蚁区块链签发，以证明该文`, 88, 940)
		ctx.setFillStyle('#999999')
		ctx.font = '22px sans-serif';
		ctx.fillText(`件自存证时间起即存在，且内容完整，无法被篡改。`, 88, 972)
		// 证书说明：2.该身份和交易信息等，将保存在蚂蚁区块链上。(扫码了解以上信息)
		ctx.setFillStyle('#999999')
		ctx.font = '22px sans-serif';
		ctx.fillText(`2.该身份和交易信息等，将保存在蚂蚁区块链上。(扫码`, 88, 1004)
		ctx.setFillStyle('#999999')
		ctx.font = '22px sans-serif';
		ctx.fillText(`了解以上信息)`, 88, 1036)

		})
		.exec(() => {
		let timer = setTimeout(function () {
			ctx.draw(false, () => {
			saveShareImg();
			});
			clearTimeout(timer);
		}, 1000);
		});
	};

	const saveShareImg = () => {
	setTimeout(function () {
		uni.canvasToTempFilePath(
		{
			x: 0,
			y: 0,
			width: 710,
			height: 1152,
			destWidth: 710,
			destHeight: 1152,
			canvasId: "myCanvas",
			success: function (res) {
			uni.hideLoading();
			var tempFilePath = res.tempFilePath;
			uni.saveImageToPhotosAlbum({
				filePath: tempFilePath,
				success(res) {
				uni.showToast({
					title: "图片已保存到相册",
					icon: "none",
					duration: 2000,
				});
				closeCertificateModal();
				},
				fail: function (res) {
				uni.showToast({
					title: "分享失败",
					icon: "none",
					duration: 2000,
				});
				},
			});
			},
		},
		instance
		);
	}, 3000);
	};

	// 绘画(对一行放不下的内容进行截取换行，最多两行)
	function ctxStrSlice(type, str) {
		// type: char：以汉字为主。 str: 字母组成
		let str_arr = []
		if (type == 'char') {
			// 19个汉字字为一行。(一个汉字算1，非汉字算0.5)
			let lengs = 0;
			let slice_index = 0;
			for(let i = 0; i < str.length; i++) {
				const leng = isChineseCharacter(str[i])
				lengs += leng;
				if (lengs >= 19) {
					let str_leng = str_arr.length;
					slice_index = i + 1;
					str_arr.push(str.slice((str_leng * 19), i + 1))
					lengs = 0;
					if (str_leng > 1) {
						if (i < str.length - 1) {
							// 改为以...结尾
							str_arr[1] = str_arr[1].slice(0, -1) + '...'
						}
						console.log("str_arr", str_arr)
						break;
					}
				}
				if (i == str.length - 1) {
					if (str_arr.length == 0) {
						str_arr.push(str)
					} else if (str_arr.length == 1 && lengs > 0 && slice_index) {
						str_arr.push(str.slice(slice_index))
					}
				}
			}
		} else if (type == 'str'){
			// 字符：32个为一行
			let lengs = str.length;
			if (lengs <= 32) {
				str_arr.push(str)
			} else if (lengs <= 64) {
				str_arr.push(str.slice(0, 33));
				str_arr.push(str.slice(33));
			} else {
				str_arr.push(str.slice(0, 33));
				str_arr.push(str.slice(33, 65));
				str_arr[1] = str_arr[1].slice(0, -2) + '...'
			}
		}
		return str_arr;
	}

	// 判断字符是否为汉字
	function isChineseCharacter(char) {
		const code = char.charCodeAt(0);
		if ((code >= 0x4e00 && code <= 0x9fa5) || // 基本汉字
			(code >= 0x3400 && code <= 0x4DBF) || // 扩展A区
			(code >= 0x20000 && code <= 0x2A6DF) || // 扩展B区
			(code >= 0x2A700 && code <= 0x2B73F) || // 扩展C区
			(code >= 0x2B740 && code <= 0x2B81F) || // 扩展D区
			(code >= 0x2B820 && code <= 0x2CEAF) || // 扩展E区
			(code >= 0x2CEB0 && code <= 0x2EBEF)) { // 扩展F区
			console.log("1111")
			return 1;
		}
		console.log("222")
		return 0.5;
	}
	
	
</script>

<style scoped lang="less">
	.head-title {
        position: relative;
        top: 0;
        left: 0;
        z-index: 10;
        padding-left: 40rpx;
        .title-txt {
            text-align: left;
            line-height: 88rpx;
            height: 88rpx;
            font-weight: 500;
            font-size: 30px;
            color: #000000;
        }
        .txt-cs {
            line-height: 88rpx;
            text-align: center;
            color: #111111;
            font-size: 32rpx;
            font-style: normal;
            font-weight: 600;
        }
    }
	.v-header-wrap {
		width: 750rpx;
		height: 412rpx;
		background-image: linear-gradient(180deg, #3ACAFF 0%, #1B9AFF 100%);
		.img-header {
			width: 42rpx;
			height: 40rpx;
		}
		.v-header-content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 24rpx;
			width: 750rpx;
			padding-top: 88rpx;
			position: relative;
			
			.text {
				font-family: PingFangSC-Medium;
				font-weight: 500;
				font-size: 30Rpx;
				color: #FFFFFF;
			}
			.img-header-search {
				width: 40rpx;
				height: 40rpx;
			}
		}
		.v-header-statistics {
			height: 130rpx;
			padding: 20rpx 60rpx;
			display: flex;
			flex-direction: row;
			// justify-content: space-between;
			align-items: center;	
			.statistics-item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				margin-right: 84rpx;
				.item-number {
					font-weight: 600;
					font-size: 32rpx;
					color: #FFFFFF;
					display: inline-block;
					margin-bottom: 20rpx;
				}
				.item-text {
					font-weight: 400;
					font-size: 20rpx;
					color: #FFFFFF;
				}
			}
		}
	}
	:deep(.v-header-nav) {
		width: 750rpx;
		height: 104rpx;
		padding: 24rpx 0rpx;
		overflow: hidden;
		border-radius: 28rpx 28rpx 0 0;
		margin-top: -24rpx;
		background: #f8f8f8;
		.uv-tabs__wrapper__nav {
			width: 750rpx;
			// padding-right: 18rpx;
		}
		.uv-tabs__wrapper__nav__item {
			// flex-basis: 20%;
		}
	}
	.v-order-wrap {
		flex: 1;
		overflow-y: auto;
		padding-bottom: 16rpx;
		background: #f8f8f8;
		.order-skeleton {
			width: 710rpx;
			background: #f8f8f8;
			margin: 0 20rpx 20rpx;
		}
		.v-order-list {
			.order-item {
				width: 710rpx;
				background: #FFFFFF;
				box-shadow: 0 0 20rpx 12rpx #eeeeee80;
				border-radius: 16rpx;
				margin: 0 20rpx 20rpx;
				padding: 20rpx;
				.item-title {
					margin-bottom: 40rpx;
					.order-no {
						font-weight: 400;
						font-size: 24rpx;
						color: #111111;
					}
					.order-status {
						font-weight: 400;
						font-size: 24rpx;
						color: #1B9AFF;
					}
				}
				.item-info {
					margin-bottom: 20rpx;
					.item-img {
						width: 120rpx;
						height: 120rpx;
						border-radius: 16rpx;
						margin-right: 16rpx;
					}
					.item-desc {
						flex: 1;
						.item-desc-left {
							.left-title {
								max-width: 390rpx;
								.title-type-text {
									display: inline-block;
									margin-right: 4rpx;
									color: #1B9AFF;
								}
								.title-text {
									font-weight: 600;
									font-size: 28rpx;
									color: #000000;
									.event_name {
										display: inline-block;
										margin-right: 9rpx;
										color: #fff;
										font-size: 20rpx;
										padding: 0 8rpx;
										line-height: 30rpx;
										text-align: center;
										border-radius: 6rpx;
										&.event_bg {
											background: #FF7F00;
										}
									}
									&.tips {
										font-size: 24rpx;
									}
								}
							}
							.subtitle {
								font-weight: 400;
								font-size: 20rpx;
								color: #A5A5A5;
								display: 'inline-block';
								margin-right: 8rpx;
								.t-color {
									color: '#1B9AFF';
								}
							}
						}
						.item-desc-right {
							.right-price {
								font-weight: 600;
								font-size: 24rpx;
								color: #111111;
								text-align: right;
							}
							.right-number {
								font-weight: 400;
								font-size: 24rpx;
								color: #111111;
								text-align: right;
							}
						}
					}
				}
				.item-other-info {
					margin-bottom: 20rpx;
					background: #F9F9F9;
					border-radius: 16rpx;
					padding: 24rpx 20rpx;
					.info {
						margin-bottom: 24rpx;
						&:last-child {
							margin-bottom: 0rpx;
						}
						.text {
							font-weight: 400;
							font-size: 24rpx;
							color: #111111;
						}
					}
				}
				.item-footer {
					flex-wrap: wrap;
					// height: 48rpx;
					.item-footer-left {
						flex-shrink: 0;
						margin-bottom: 12rpx;
						.count {
							display: inline-block;
							font-weight: 400;
							font-size: 24rpx;
							color: #A5A5A5;
							margin-right: 20rpx;
						}
						.price-text {
							font-weight: 400;
							font-size: 24rpx;
							color: #A5A5A5;
						}
						.price-number {
							display: inline-block;
							font-weight: 600;
							font-size: 24rpx;
							color: #111111;
							margin: 0 8rpx;
						}
						.countdown {
							font-size: 24rpx;
							color: red;
						}
					}
					.item-footer-btns {
						flex: 1;
						justify-content: flex-end;
						margin-bottom: 12rpx;
						.item-footer-btn {
							flex-shrink: 0;
							width: 136rpx;
							height: 48rpx;
							line-height: 48rpx;
							text-align: center;
							background: #1B9AFF;
							border-radius: 8rpx;
							color: #FFFFFF;
							font-size: 24rpx;
							margin-left: 10rpx;
							&.no-bg {
								width: auto;
								padding: 0 12rpx;
								background: #FFFFFF;
								border: 2rpx solid #000000;
								color: #000000;
								.certificate-icon {
									width: 32rpx;
									height: 32rpx;
									margin-right: 8rpx;
								}
							}
						}
					}
				}
			}
		}
	}


    :deep(.popup-content){
      align-items: center;
	}
	:deep(.m_content){
		margin-bottom: 20rpx;
	}
	:deep(.m_btns){
		width: 100%;
		margin-top: 50rpx;
	}
	.scroll-box {
		background-color: #F3F8FB;
	}

	.my-order .header {
		// height: 260rpx;
		// background-color: var(--view-theme);
		flex-shrink: 0;
		background: linear-gradient(180deg, #0AF 0%, #00DCEE 100%);
		/* #ifdef H5 */
		height: 436rpx;
		padding: 104rpx 24rpx 0 24rpx;
		/* #endif */
		/* #ifndef H5 */
		height: 348rpx;
		padding: 16rpx 24rpx 0 24rpx;
		/* #endif */
	}

	.t-color {
		color: var(--view-bgColor);
	}

	.p-color {
		// color: var(--view-priceColor);
	}

	.b-color {
		background-color: var(--view-bgColor);
	}
	.Refund{
		background: rgba(255, 255, 255, 0);
		border: #00DCEE solid 1rpx;
		color: #00DCEE !important;
	}

	.my-order .header .picTxt {
		display: flex;
		height: 196rpx;
		width: 702rpx;
		padding: 24rpx;
		flex-direction: column;
		align-items: flex-start;
		gap: 16rpx;
		border-radius: 16rpx;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.1);
	}

	.my-order .header .picTxt .text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 26rpx;
		width: 100%;
		// font-family: 'Guildford Pro';
	}

	.my-order .header .picTxt .text .name {
		font-size: 28rpx;
		font-weight: 500;
	}

	.my-order .header .picTxt .pictrue {
		width: 122rpx;
		height: 109rpx;
	}

	.my-order .header .picTxt .pictrue image {
		width: 100%;
		height: 100%;
	}

	.header .box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header .box .wd308 {
		width: 308rpx;
	}

	.header .box .order-name {
		color: rgba(255, 255, 255, 0.6);
		font-size: 28rpx;
		//  #ifdef H5
	      font-size: 26rpx;
        // #endif
	}

	.header .box .order-num {
		color: rgb(255, 255, 255);
		font-size: 28rpx;
		//  #ifdef H5
	     font-size: 26rpx;
        // #endif
	}


	.my-order .nav {
		margin-top: 32rpx;
		width: 100%;
		height: 56rpx;
		padding: 0 8rpx;
	}

	.my-order .nav .item {
		height: 56rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.my-order .nav .item.on {
		font-weight: 600;
		// border-bottom: 5rpx solid var(--view-theme);
		border-bottom: 2px solid #FFF;
	}

	.my-order .nav .item .num {
		margin-top: 18rpx;
	}

	.my-order .list {
		width: 702rpx;
		margin: 0 auto;
		margin-top: -44rpx;
	}

	.my-order .list .item {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
	}

	.my-order .list .item .title {
		height: 98rpx;
		padding: 0 32rpx;
		border-bottom: 1px solid #eee;
		font-size: 28rpx;
		color: #282828;

		.left-wrapper {
			.iconfont {
				margin-top: 5rpx;
			}

			.store-name {
				margin: 0 10rpx;
			}

			.icon-xiangyou {
				font-size: 20rpx;
			}
		}
	}

	.my-order .list .item .order-number {
		color: rgb(17, 17, 17);
		font-size: 24rpx;
	}

	.my-order .list .item .sub-title {
		height: 60rpx;
		padding: 0 30rpx;
		border-bottom: 1px solid #eee;
		font-size: 28rpx;
		color: #282828;

		.left-wrapper {
			.iconfont {
				margin-top: 5rpx;
			}

			.store-name {
				// margin: 0 10rpx;
			}

			.icon-xiangyou {
				font-size: 20rpx;
			}
		}
	}

	.my-order .list .item .title .sign {
		font-size: 24rpx;
		padding: 0 7rpx;
		height: 36rpx;
		margin-right: 15rpx;
	}

	.my-order .list .item .item-info {
		padding: 0 32rpx;
		margin-top: 24rpx;
	}

	.my-order .list .item .item-info .pictrue {
		width: 112rpx;
		height: 112rpx;
	}

	.my-order .list .item .item-info .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}

	.my-order .list .item .item-info .text {
		width: 502rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 6rpx;
	}

	.my-order .list .item .item-info .text .name {
		width: 355rpx;
		color: #111111;
		font-size: 24rpx;
	}

	.event_bg {
		background: #FF7F00;
	}

	.event_color {
		color: #FF7F00;
	}

	.my-order .list .item .event_name {
		display: inline-block;
		margin-right: 9rpx;
		color: #fff;
		font-size: 20rpx;
		padding: 0 8rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 6rpx;
	}

	.my-order .list .item .event_ship {
		font-size: 20rpx;
		margin-top: 10rpx;
	}

	.my-order .list .event_price {
		margin: 0 0 50rpx 120rpx;
	}

	.my-order .list .item .item-info .text .money {
		text-align: right;
		color: #777777;
		font-size: 24rpx;
	}

	.my-order .list .item .item-info .text .money .price {
		width: 145rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.my-order .list .item .item-info .text .money .product_num {
		margin-top: 44rpx;
	}

	.my-order .list .item .line {
		width: 638rpx;
		border-bottom: 1px solid #EEE;
		margin: 0 auto;
	}

	.my-order .list .item .totalPrice {
		color: #000000;
		font-size: 24rpx;
		text-align: right;
		margin: 24rpx 0;
		padding: 0 32rpx;
	}

	.my-order .list .item .totalPrice .money {
		// font-size: 28rpx;
		// font-weight: bold;
	}

	.my-order .list .item .bottom .bottom-box {
		margin-bottom: 8rpx;
		font-size: 24rpx;
	}

	.my-order .list .item .bottom .bottom-box .txt {
		font-size: 24rpx;
		color: #000000;
	}
	
	.my-order .list .item .totalPrice .times {
		font-size: 24rpx;
		color: #FF4D25;
	}

	.my-order .list .item .bottom {
		height: auto;
		padding: 24rpx 32rpx;
		// border-top: 1px solid #f0f0f0;
	}

	.my-order .list .item .bottom .bnt {
		width: 176rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		border-radius: 50rpx;
		font-size: 27rpx;
	}

	.my-order .list .item .bottom .bnt.cancelBnt {
		border: 1px solid #ddd;
		color: #777777;
	}

	.my-order .list .item .bottom .bnt.colorBnt {
		border: 1px solid var(--view-bgColor);
		color: var(--view-bgColor);
		font-size: 24rpx;
	}

	.my-order .list .item .bottom .bnt .icon-fabu {
		font-size: 26rpx;
		margin-right: 10rpx;
	}

	.my-order .list .item .bottom .bnt~.bnt {
		margin-left: 16rpx;
		// margin-left: 24rpx;
	}

	.noCart {
		margin-top: 171rpx;
		padding-top: 0.1rpx;
	}

	.noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 78rpx auto 56rpx auto;
	}

	.noCart .pictrue image {
		width: 100%;
		height: 100%;
	}

	.event_container {
		width: 690rpx;
		// background-image: url(/packages/mall/static/images/presell_orderBg.png);
		background-size: cover;
		background-repeat: no-repeat;
		margin: 20rpx auto;
		margin-bottom: 60rpx;
		padding: 26rpx 30rpx;
		border-radius: 16rpx;

		.info {
			width: 420rpx;

			.title {
				color: #282828;
				font-size: 26rpx;
			}

			.desc {
				color: #999;
				font-size: 24rpx;
				margin-top: 30rpx;
			}
		}

		.photo {
			width: 180rpx;

			.picture {
				width: 120rpx;
				height: 120rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
			}

			.more_btn {
				color: #fff;
				background: #F97E3B;
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				text-align: center;
				line-height: 40rpx;
				position: relative;
				top: 40rpx;

				text {
					font-size: 20rpx;
				}
			}
		}
	}

	// .search {
	// 	height: 70rpx;
	// 	padding: 0 30rpx;
	// 	border-radius: 35rpx;
	// 	margin: -35rpx 30rpx 0;
	// 	background-color: #FFFFFF;
	// 	font-size: 26rpx;
	// 	color: #999999;

	// 	.iconfont {
	// 		margin-right: 10rpx;
	// 		font-size: 23rpx;
	// 	}
	// }

	.search {
		height: 60rpx;
		padding: 0 30rpx;
		border-radius: 30rpx;
		background-color: #FFFFFF;
		font-size: 26rpx;
		margin: 0 20rpx;
		.iconfont {
			margin-right: 10rpx;
			font-size: 26rpx;
			color: #999999;
		}
		
		.input-placeholder {
			font-size: 26rpx;
			color: #999999;
		}
		
		.input {
			flex: 1;
		}
	}
	.certificate-box {
		width: 710rpx;
		.certificate-content {
			position: relative;
			width: 710rpx;
			height: 1152rpx;
			.certificate-info {
				position: relative;
				z-index: 2;
				padding: 140rpx 88rpx 0;
				.info-title {
					text-align: center;
					font-weight: 500;
					font-size: 44rpx;
					color: #000000;
					margin-bottom: 40rpx;
				}
				.col-item {
					display: flex;
					align-items: flex-start;
					margin-bottom: 20rpx;
					.cal-label {
						font-weight: 400;
						font-size: 24rpx;
						color: #000000;
						flex-shrink: 0;
					}
					.cal-value {
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						&.nowrap-line2 {
							overflow-wrap: break-word;
						}
					}
				}
				.qr-code-wrap {
					.qr-code-box {
						display: flex;
						justify-content: center;
						align-items: center;
						.qr-code-img {
							width: 200rpx;
							height: 200rpx;
						}
					}
					.qr-code-tip {
						text-align: center;
						font-weight: 400;
						font-size: 22rpx;
						color: #A5A5A5;
						margin-top: 16rpx;
					}
				}
				.explain-box {
					margin-top: 20rpx;
					.explain-title {
						font-weight: 400;
						font-size: 24rpx;
						color: #000000;
						margin-bottom: 10rpx;
					}
					.explain-text {
						font-weight: 400;
						font-size: 22rpx;
						color: #999999;
					}
				}
			}
			.certificate-bg {
				width: 710rpx;
				height: 1152rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
			.certificate-del {
				position: absolute;
				top: 40rpx;
				right: 40rpx;
				z-index: 3;
				width: 60rpx;
				height: 60rpx;
			}
		}
		.download-btn {
			line-height: 90rpx;
			height: 90rpx;
			background: #1B9AFF;
			border-radius: 16rpx;
			text-align: center;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			margin-top: 20rpx;
		}
	}
	.onchain-content {
		font-weight: 500;
		font-size: 30rpx;
		color: #000000;
		text-align: center;
		margin-bottom: 40rpx;
	}
	.ai-c {
		align-items: center;
	}
	.jc-c {
		align-items: center;
		justify-content: center
	}
	.evaluation-scroll-box {
		box-sizing: border-box;
		width: 590rpx;
		padding: 20rpx;
		background: #fff;
		height: 600rpx;
		overflow-y: auto;
		.c-label {
			margin-bottom: 20rpx;
			word-break: break-all;
			.c-label-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 12rpx;
			}
			.c-label-text {
				flex: 1;
				margin-right: 16rpx;
				font-size: 28rpx;
				color: #111;
			}
		}
	}
</style>