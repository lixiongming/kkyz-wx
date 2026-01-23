<template>
	<view :style="localViewColor">
		<!-- 背景 -->
		<view class="add_page_bg"></view>
		<view class="page_bg_wrap">
			<view class='order-submission'>
				<view class="v-allAddress df-r ai-c jc-sb" v-if="allow_address && order_model == 0 && shippingType == 0" @click="onAddress">
					<view class="address-dtl df-r" v-if="addressInfo.real_name">
						<image
							mode="aspectFill"
							class="address-location-icon"
							:src="imgUrlEvent('/images/mall/v-location.png', 'aliyunImgUrl')"
						></image>
						<view class="info">
							<view class="base-info df-r df-r">
								<text class='default' v-if="addressInfo.is_default">默认</text>
								<text class="text">{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.street || ''}}{{addressInfo.detail}}</text>
							</view>
							<view class="other-info">
								<text class="text">{{addressInfo.real_name}}</text>
								<text class="text">{{addressInfo.phone}}</text>
							</view>
						</view>
					</view>
					<navigator v-else :url="'/pagesMine/user-address/index?cartId='+cartId" hover-class="none" class='addressCon'>
						<view class='setaddress'>设置收货地址</view>
					</navigator>
					<image
						mode="aspectFill"
						class="address-arrow-icon"
						:src="imgUrlEvent('/images/mall/v-arrow-active.png', 'aliyunImgUrl')"
					></image>
				</view>

				<!-- 商品信息 -->
				<view class="storeinfo-wrapper">
					<view class="store-item br16" v-for="(item,index) in cartInfo" :key="index">
						<view class="store-title">
							<view class="st_left" @click="goStore(item.mer_id,item)">
								<image
									mode="aspectFill"
									class="store-logo"
									:src="imgUrlEvent('/images/mall/v-store.png', 'aliyunImgUrl')"
								></image>
								<view class="txt">{{item.mer_name}}</view>
							</view>
						</view>
						<view v-for="(goods,j) in item.list" :key="j">
							<view v-if="goods.product_type == 2">
								<view class="product-item">
									<view class="img-box">
										<image :src="goods.productPresellAttr.image || goods.product.image"></image>
									</view>
									<view class="content event_content">

										<view class="content-desc">
											<view class="product-name line1"><text class="event_name event_bg">预售</text>{{goods.productPresell.store_name}}</view>
											<view class="product-sku line1">{{goods.productAttr.sku}}</view>
											<view class="product-tips">发货时间：
												<!--全款预售-->
												<text v-if="goods.productPresell.presell_type === 1">{{goods.productPresell.delivery_type === 1 ? '支付后' : '预售结束后'}}{{ goods.productPresell.delivery_day }}天内</text>
												<!--定金预售-->
												<text v-if="goods.productPresell.presell_type === 2">{{ goods.productPresell.delivery_type === 1 ? '付尾款后' : '预售结束后' }}{{ goods.productPresell.delivery_day }}天内</text>
											</view>
											<view v-if="goods.undelivered && addressInfo.real_name" class="product-err-tips" >
												<text class="iconfont icon-zhuyi-copy"></text>
												<view class="txt">此商品不支持该区域配送</view>
											</view>
										</view>
										<view class="content-statistics">
											<view class="price-wrap df-r ai-c">
												<text class="statistics-money">￥{{goods.productPresellAttr.presell_price}}</text>
											</view>
											<text class="statistics-num">x{{goods.cart_num}}</text>
										</view>

									</view>
								</view>
								<view v-if="goods.productPresell.presell_type === 2" class="event_payTime">
									<view class="event_progress">
										<view class="progress_step">
											<text class="name color_red">定金</text>
											<text
												class="price color_red">￥{{ (goods.productPresellAttr.down_price * goods.cart_num).toFixed(2) }}</text>
										</view>
										<view class="progress_step">
											<text class="name">尾款</text>
											<text
												class="price">￥{{ (goods.productPresellAttr.final_price * goods.cart_num).toFixed(2) }}</text>
										</view>
										<view class="progress_pay">
											{{ filterDay(goods.productPresell.final_start_time)}}开始支付尾款</view>
									</view>
								</view>
							</view>
							<view v-else>
								<view class="product-item">
									<view class="img-box">
										<image :src="goods.productAttr.image || goods.product.image"></image>
									</view>
									<view class="content df-r jc-sb">

										<view class="content-desc">
											<view class="product-name line1">{{goods.product.store_name}}</view>
											<view class="product-sku line1">{{goods.productAttr.sku}}</view>
											<view class="product-tips">
												<text class="text" v-if="!goods.allow_delivery">不支持快递</text>
												<text class="text" v-if="!goods.allow_take">不支持到店核销</text> 
											</view>
											<view v-if="goods.undelivered && addressInfo.real_name" class="product-err-tips" >
												<text class="iconfont icon-zhuyi-copy"></text>
												<view class="txt">此商品不支持该区域配送</view>
											</view>
										</view>
										<view class="content-statistics">
											<view class="price-wrap df-r ai-c">
												<text class="statistics-money" v-if="order_type == 3">￥{{goods.productAssistAttr.assist_price}}</text>
												<text class="statistics-money" v-if="order_type == 4">￥{{goods.activeSku.active_price}}</text>
												<text class="statistics-money" v-else>￥{{goods.productAttr.price}}</text>
												<image v-if="goods.productAttr.show_svip_price" mode="aspectFill" class="svip-img" :src="imgUrlEvent('/images/wx-applet/mine/svip.png','aliyunImgUrl')"></image>
											</view>
											<text class="statistics-num">x{{goods.cart_num}}</text>
										</view>

									</view>
								</view>
							</view>
						</view>
						<view class="v-wrapper">
							<view class="wrapper">
								<view class="boxs">
									<view class='item acea-row row-between-wrapper'>
										<view>配送方式</view>
										<view v-if="item.delivery_way.length == 2 && (item.order.allow_delivery && item.order.allow_take)" class='discount df-r ai-c' @tap="openShowBox(item,index)">
											{{item.order.isTake==0 ? deliveryName :'到店核销'}}
											<image
												v-if="order_model != 2"
												mode="aspectFill"
												class="item-arrow-icon"
												:src="imgUrlEvent('/images/mall/v-arrow-default.png', 'aliyunImgUrl')"
											></image>
										</view>
										<view v-else class='discount'>
											{{item.order.isTake==0 ? deliveryName :'到店核销'}}
										</view>
									</view>
									<view class="store-address" v-if="item.order.isTake">
										<view class="name line2">{{item.take.mer_take_name}}</view>
										<view class="info line2">{{item.take.mer_take_address}}</view>
										<view class="map" @click="goMap(item)">
											<text class="iconfont icon-chakanditu"></text>
											<view class="map_text">查看地图</view>
										</view>
									</view>
								</view>
								<view class='item acea-row row-between-wrapper' v-if='shippingType==0 && item.isTake == 0 && order_model == 0&&item.delivery_way.indexOf("2")>-1'>
									<view>快递费用 <text
											v-if="item.list[0].productPresell && item.list[0].productPresell.presell_type == 2">(尾款阶段）</text>
									</view>
									
									<view class='discount' v-if='item.order.postage_price > 0'>+￥{{item.order.postage_price}}
									</view>
									<view class='discount' v-else>免运费</view>
								</view>
								<view class='item acea-row row-between-wrapper' v-if='check_data.openSuperIntegral' @click="openExchangePopup">
									<view><text>兑换积分</text></view>
									<view class="Exchange-box df-r ai-c"><text class="Exchange-num">{{`（剩余：${userInfo.super_integral}兑换积分）`}}</text><text class="Exchange-num">{{use_super_integral ? '-'+use_super_integral : 0  }}</text>
										<image
											mode="aspectFill"
											class="item-arrow-icon"
											:src="imgUrlEvent('/images/mall/v-arrow-default.png', 'aliyunImgUrl')"
										></image>
									</view>
								</view>
								<view class='item acea-row row-between-wrapper'
									v-if="!seckillId && order_type != 3 && order_type != 4 && item.order.enabledCoupon">
									<view>
										<text>店铺优惠券</text>
									</view>
									<block v-if="item.coupon.length>0 && storeCouponCount>0">
										<view class='discount df-r ai-c' @tap='couponTap(item,index)'>
											<text v-if="item.order.coupon_price>0" style="color:red;">-￥{{item.order.coupon_price}}</text>
											<text v-else style="color: red;">
												{{ storeCouponCount?`${storeCouponCount}张可用`:'' }}
											</text>
											<image
												mode="aspectFill"
												class="item-arrow-icon"
												:src="imgUrlEvent('/images/mall/v-arrow-default.png', 'aliyunImgUrl')"
											></image>
										</view>
									</block>
									<block v-else>
										<view class='discount'>暂无可用优惠券</view>
									</block>
								</view>
								<!-- 平台优惠券 -->
								<view class='item acea-row row-between-wrapper'
									v-if="!seckillId && order_type != 3 && order_type != 4 && enabledPlatformCoupon">
									<view>平台优惠券<text @tap="showCoupon" class="iconfont icon-wenhao1"></text></view>
									<block v-if="platformCoupon.length > 0 && platformCouponCount > 0">
										<view class='discount money df-r ai-c' @tap='couponTap2(platformCoupon,0)'>
											<text v-if="total_platform_coupon_price>0" style="color:red;">-￥{{total_platform_coupon_price}}</text>
											<text v-else style="color: red;">暂未选择优惠券</text>
											<image
												mode="aspectFill"
												class="item-arrow-icon"
												:src="imgUrlEvent('/images/mall/v-arrow-default.png', 'aliyunImgUrl')"
											></image>
										</view>
									</block>
									<block v-else>
										<view class='discount'>暂无可用优惠券</view>
									</block>
								</view>	
								<!-- 需已完成订单才可开具发票 -->
								<!-- <view v-if="item.openReceipt == 1" class='item acea-row row-between-wrapper'>
									<view>开具发票 <text @tap="showInvoice" class="iconfont icon-wenhao1"></text></view>
									<view class='discount discount_voice df-r ai-c' @tap="goInvoice(item.mer_id)">
										{{(item.invoiceData && item.invoiceData.receipt_title) ? item.invoiceData.receipt_title : '不开发票'}}
										<image
											mode="aspectFill"
											class="item-arrow-icon"
											:src="imgUrlEvent('/images/mall/v-arrow-default.png', 'aliyunImgUrl')"
										></image>
									</view>
								</view> -->
								<view v-if="order_type === 2 && item.list[0].productPresell.presell_type ==2"
									class="item acea-row row-between-wrapper"
									style="border-top: 1px solid #f5f5f5; border-bottom: 1px solid #f5f5f5;">
									<checkbox-group class="checkgroup" @change='changeIsAgree'>
										<text class="iconfont icon-wenhao1"></text>
										<text @click="getPresellAgree">我已同意定金不退等预售协议</text>
										<checkbox class="checkbox" :checked="isAgree ? true : false" />
									</checkbox-group>
								</view>
								<view class='item acea-row row-between-wrapper' v-if="textareaStatus">
									<view style="width: 100px;">备注信息</view>
									<input v-if="coupon.status===false" placeholder-class='placeholder'
										@input='bindHideKeyboard' value="" name="mark" placeholder='选填备注信息'
										v-model="msgObj[item.mer_id]"></input>
								</view>
							</view>
							<view class="total">
								共{{item.order.total_num}}件
								<text class="text">小计</text>
								<view class="price" v-if="item.isTake == 0">￥{{ item.order.pay_price }}</view>
								<view class="price" v-if="item.isTake == 1">￥{{ item.order.org_price}}</view>
							</view>
						</view>
					</view>
				</view>
				<!--虚拟商品-->
				<view class="wrapper virtual_form br16">
					<form report-submit='true'>
						<view v-for="(item,index) in order_extend" :key="item.title">
							<view v-if="item.key == 'mobile'" class='item acea-row row-between-wrapper'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class='discount'>
									<input type="text" v-model="item.value" placeholder="请填写手机号" placeholder-class='placeholder' />
								</view>
							</view>
							<view v-if="item.key == 'email'" class='item acea-row row-between-wrapper'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class='discount'>
									<input type="text" v-model="item.value" placeholder="请填写邮箱" placeholder-class='placeholder' />
								</view>
							</view>
							<view v-if="item.key == 'idCard'" class='item acea-row row-between-wrapper'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class='discount'>
									<input type="text" v-model="item.value" placeholder="请填写身份证号" placeholder-class='placeholder' />
								</view>
							</view>
							<view v-if="item.key == 'text' || item.key == 'number'" class='item acea-row row-between-wrapper'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class='discount'>
									<input v-if="item.key == 'text'" type="text" v-model="item.value" :placeholder="'请填写'+item.title" placeholder-class='placeholder' />
									<input v-if="item.key == 'number'" type="number" v-model="item.value" :placeholder="'请填写'+item.title" placeholder-class='placeholder' />
								</view>
							</view>
							<view v-if="item.key == 'date'" class='item acea-row row-between-wrapper'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class='discount'>
									<picker @change="bindDateChange" :value="item.value" start="1970-01-01" mode="date">
										<input type="text" @click="getTime(index)" disabled v-model="item.value" placeholder="请选择日期" placeholder-class='placeholder' />
									</picker>
								</view>
							</view>
							<view v-if="item.key == 'time'" class='item acea-row row-between-wrapper'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class='discount'>
									<!-- <picker :value="item.value" start="1970-01-01" @change="bindDateChange" mode="time">
										<input type="text" @click="getTime(index)" disabled v-model="item.value" placeholder="请选择时间" placeholder-class='placeholder' />
									</picker> -->
									<picker @change="bindDateChange" :value="item.value" :range="array" start="1970-01-01" mode="time">
										<view class="uni-input">{{item.value ? item.value : '请选择时间'}}</view>
									</picker>
								</view>
							</view>
							<view v-if="item.key == 'image'" class='item'>
								<view><text class="item-require" v-if="item.require">*</text>{{item.title}}</view>
								<view class="upload">
									<view class='pictrue' v-for="(itemn,indexn) in item.value" :key="indexn" :data-index="indexn" @click="getPhotoClickIdx">
										<image :src="itemn"></image>
										<text class="iconfont icon-guanbi4" @click.stop="DelPic(item,indexn)"></text>
									</view>
									<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic(item)' v-if="pics.length < 5">
										<text class='iconfont icon-icon25201'></text>
										<view>上传图片</view>
									</view>
								</view>
							</view>
						</view>
					</form>
				</view>
				<view class="settlementAgreement" v-if="showProtocol">
					<view class="setAgCount">
						<i class="icon iconfont icon-cha" @click="showProtocol = false"></i>
						<div class="title">{{agrementTtile}}</div>
						<view class="content">
							<!-- <jyf-parser :html="protocol" ref="article" :tag-style="tagStyle"></jyf-parser> -->
							<!-- <view v-html="protocol"></view> -->
							<uv-parse
							:content="protocol"
							:tagStyle="tagStyle"
							></uv-parse>
						</view>
					</view>
				</view>
				<!--收货人信息-->
				<view v-if="is_take" class="wrapper virtual_form br16">
					<form report-submit='true'>
						<view  class='item acea-row row-between-wrapper'>
							<view><text class="item-require">*</text>收货人姓名</view>
							<view class='discount'>
								<input type="text" v-model="post.real_name" placeholder="请填写收货人姓名" placeholder-class='placeholder' />
							</view>
						</view>					
						<view class='item acea-row row-between-wrapper'>
							<view><text class="item-require">*</text>收货人电话</view>
							<view class='discount'>
								<input type="number" v-model="post.phone" placeholder="请填写收货人电话" placeholder-class='placeholder' />
							</view>
						</view>
					</form>
				</view>
				<view class='wrapper br16'>
					<view class='item'>
						<view @click="getPay" class="pay-title">支付方式</view>
						<view class='list'>
							<template v-for="(item,index) in cartArr">
								<view class='payItem acea-row row-middle' :class='active==index ?"on":""' @tap='payItem(index)' v-if="item.payStatus==1">
									<view class='name acea-row row-center-wrapper ai-c'>
											<image
												mode="aspectFill"
												class="pay-logo"
												:src="imgUrlEvent('/images/mall/v-icon-wxpay.png', 'aliyunImgUrl')"
											></image>
											<text class="pay-text">{{item.name}}</text>
									</view>
									<view class='tip' style="display: flex;flex-direction: column;">
										<!-- <view>
											{{item.title}}
											<block v-if="item.value == 'balance'">
												{{userInfo.now_money}}
											</block>
										</view>
										<view  v-if="['quick_weixin','quick_alipay','quick_bank_pay'].includes(item.value)">
											<view style="color: red;font-size: 24rpx;">(立减0.1元)</view>
										</view> -->
									</view>
									<view class="check_box">
										<view class="iconfont icon-weixuanzhong" v-if="active != index"></view>
										<view class='iconfont icon-xuanzhong1' v-else></view>
									</view>
								</view>
							</template>
				
						</view>
					</view>
				</view>
				<view class='moneyList br16'>
					<view class='item acea-row row-between-wrapper'>
						<view>商品总价</view>
						<view class='money'>￥{{proPrice}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="couponData.order_total_postage > 0">
						<view>运费</view>
						<view class='money'>￥{{couponData.order_total_postage}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="coupon_price > 0">
						<view>店铺优惠金额</view>
						<view class='money'>-￥{{coupon_price}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="open_integral && userInfo.integral>0 && order_type == 0">
						<view>积分抵扣</view>
						<view class='money'>
							<text v-if="!use_integral">当前积分<text class="pColor">{{userInfo.integral}}</text></text>
							<text v-else>使用了{{integral_count}}个积分，抵扣<text
									class="pColor">{{integral_price}}元</text></text>
							<view class="checkbox integral_checked" @click="changeIntegral">
								<view class="iconfont icon-weixuanzhong" v-if="!use_integral"></view>
								<view class='iconfont icon-xuanzhong1' v-else></view>
							</view>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="priceGroup.storePostage > 0">
						<view>运费</view>
						<view class='money'>+￥{{priceGroup.storePostage}}</view>
					</view>
				</view>
				<view class="zw-footer"></view>
				<view class='footer acea-row row-between-wrapper'>
					<view class="footer_count">
						<view>
							合计：
							<text class='pColor footer-total'>￥{{totalPrice || 0}}</text>
						</view>
						<view class="coupon_price" v-if="couponData.total_coupon > 0">
							优惠：¥ {{couponData.total_coupon}}
							<text @click="openDiscount">优惠明细</text>
						</view>
					</view>
					<view class='settlement' :class='couponData.status != "noAddress" ? "" : "disabled"' style='z-index:100'
						@tap="SubOrder">{{couponData.status != "noAddress" ? '提交订单':'选择地址'}}</view>
				</view>
			</view>
			<block v-if="coupon.status">
				<couponListWindow :coupon='coupon' :couponTitle="plantCoupon ? '平台优惠券' : '优惠券'" @ChangCouponsClone="ChangCouponsClone" @getCoupon="getCoupon"
					:openType='openType' @ChangCoupons="ChangCoupons" :coupon_amount='coupon_amount'
					:coupon_number='coupon_number'></couponListWindow>
			</block>
			<addressWindow ref="addressWindowRef" @changeTextareaStatus="changeTextareaStatus" :address='address'
				:pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"></addressWindow>
			<addInvoicing ref="addInvoicingRef" @changeInvoiceClose="changeInvoiceClose" :invoice='invoice'></addInvoicing>
			<block v-if="isShowBox">
				<checkDelivery :deliveryName="deliveryName" :isShowBox="isShowBox" :activeObj="activeObj" :radioList="radioList" @close="boxClose" @confirmBtn="getData">
				</checkDelivery>
			</block>
			<!--优惠明细弹窗-->
			<discountDetails :isShowDiscount="isShowDiscount" @close="closeDiscount" :couponData="couponData"></discountDetails>
			<!-- 兑换积分使用弹框 -->
			<uni-popup ref="popup_Exchange" type="bottom" @maskClick="maskClick" :safe-area="false" border-radius="32rpx 32rpx 0 0">
				<view class="popup-Exchange-box">
					<view class="Exchange-title"><text class="Exchange-title-text">兑换积分积分余额</text></view>
					<view class="Exchange-number"><text class="Exchange-number-text">{{userInfo.super_integral}}</text></view>
					<view class="Exchange-At-most"><text class="Exchange-At-most-text">本单最多可使用{{check_data.order_can_use_super_integral}}兑换积分</text></view>
					<input type="number" class="Exchange-input" v-model="use_super_integral_input"   placeholder="请输入本单使用兑换积分数" placeholder-class='Exchange-placeholder' />
					<button class="Exchange-verify" @click="ExchangeVerify">确定</button>
					<uni-icons type="closeempty" class="closeempty-icon" size="30" @click="ExchangeClose"></uni-icons>
				</view>
			</uni-popup>
			<!-- 自提信息提示 -->
			<g-new-modal ref="take_modal" btn_type="2"  btn_color="#6236FC" content="您选购的商品需要到店自提，请确认无误！" cancelText="取消下单" confirmText="确认自提" @close="closeTake"  @confirm="confirmTake" :title="'温馨提示'" >
			   <!-- <template v-slot:content>
			     <view class="take-content">
				   <view>
					   <text class="take-title">本商品需要自提</text>
				   </view>
				   <view class="mt24 flex flex-ac">
					   <image
					   	mode="aspectFill"
					   	class="take-store"
					   	:src="imgUrlEvent('/images/mall/v-store.png', 'aliyunImgUrl')"
					   ></image>
					   <text class="take-title">自提点：<text class="take-txt">{{cartInfo[0].take?.mer_take_name}}</text></text>
				   </view>
				   <view class="mt16 flex flex-ac">
					   <text class="take-title"><text class="iconfont icon-chakanditu"></text>地址：<text class="take-txt">{{cartInfo[0].take?.mer_take_address}}</text></text>
				   </view>
			     </view>
			   </template> -->
			</g-new-modal>
		</view>
	</view>
</template>
<script setup>
	import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide, onUnload } from "@dcloudio/uni-app";
	import { getOrderConfirm, createOrder} from '@/business/api/modules/order-new.ts';
	import { getAgreementApi} from '@/business/api/modules/user-old.ts';
	import { getAddressList, getUserInfo, getAddressDetail, bindUserRouteId } from '@/business/api/modules/user.ts';
	import { presellAgreement } from '@/business/api/modules/activity.ts';
	import { storeListApi } from '@/business/api/modules/store.ts';
	import couponListWindow from '@/components/orderCoupon/index.vue';
	import addressWindow from '@/components/addressWindow/index.vue';
	import checkDelivery from '@/components/checkDelivery/index.vue';
	import discountDetails from '@/components/discountDetails/index.vue';
	import addInvoicing from '@/components/addInvoicing/index.vue';
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
	import { toLogin } from '@/infrastructure/libs/login.js';
	import useMine from '@/business/store/modules/mine.ts';
	import util from '@/infrastructure/utils/utils.js'
	import store_ from "@/business/store/modules/mall.ts";
	import { getconfigApi } from "@/infrastructure/utils/utils.js";
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
	import { getMiddleToken } from "@/infrastructure/utils/login.js";
	const Store = store_();
	const mine_store = useMine()
	function filterDay(val) {
		if (val) {
			var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
			var date = val.replace(reg, "$2月$3日");
			return date
		}
	}
	// 备注
	const msgObj = ref({})
	const textareaStatus = ref(true)
	const deliveryName = ref('快递配送')
	//支付方式
	const cartArr = ref([
		{
			name: "微信支付",
			icon: "icon-wxpay",
			value: 'joinpayWxLite',
			title: '微信支付',
			payStatus: 1
		}
	]) 
	function getPay () {
		console.log('------------------>>>Store',Store);
	}
	const tagStyle = ref({
		img: 'width:100%;display:block;',
		video: 'width:100%;'
	})
	const radioList = ref([
		{
			title:deliveryName.value,
			check:true
		},
		{
			title:'到店核销',
			check:false
		}
	])
	//支付方式
	const payType = ref(defaultPayMethodString(cartArr.value))
	//优惠券打开方式 1=使用
	const openType = ref(1)
	//支付方式切换
	const active = ref(0)
	//优惠券组件
	const coupon = ref({
		status: false,
		list: [],
		statusTile: '立即使用'
	})
	//地址组件
	const address = ref({
		address: false
	})
	//地址信息
	const addressInfo = ref({})
	//发票组件
	const invoice = ref({
		invoice: false,
		mer_id: 0,
		add: true
	})
	// 发票数据
	const invoiceData = ref({}) 
	//拼团id
	const pinkId = ref(0)
	//地址id
	const addressId = ref(0)
	//优惠券id
	const couponId = ref(0)
	//购物车id
	const cartId = ref('')
	const BargainId = ref(0)
	const combinationId = ref(0)
	const seckillId = ref(0)
	//用户信息
	const userInfo = ref({})
	const post = ref({})
	//备注信息
	const mark = ref('') 
	//优惠券
	const couponTitle = ref('请选择')
	//优惠券抵扣金额
	const coupon_price = ref(0)
	//是否使用积分
	const useIntegral = ref(false)
	//积分抵扣金额
	const integral_price = ref(0)
	const integral = ref(0)
	//使用积分抵扣变动后的金额
	const ChangePrice = ref(0)
	//收集formid
	const formIds = ref([])
	const status = ref(0)
	const is_address = ref(false)
	//修复进入支付时页面隐藏从新刷新页面
	const toPay = ref(false)
	const shippingType = ref(0)
	const system_store = ref({})
	const storePostage = ref(0)
	const contacts = ref('')
	const contactsTel = ref('')
	const mydata = ref({})
	const storeList = ref([])
	const store_self_mention = ref(0)
	const cartInfo = ref([])
	const priceGroup = ref({})
	const animated = ref(false)
	const totalPrice = ref(0)
	const use_integral = ref(false)
	const pagesUrl = ref("")
	const orderKey = ref("")
	const offlinePostage = ref("")
	const from = ref("")
	//是否有地址
	const orderStatus = ref("")
	//选择商铺优惠券索引
	const couponIndex = ref(0)
	//提交订单使用的优惠券
	const subCoupon = ref({})
	//商品总价
	const proPrice = ref(0) 
	const isShowBox = ref(false)
	//选中店铺信息
	const activeObj = ref({}) 
	// 选中店铺索引
	const activeIndex = ref('') 
	const invoiceName = ref('不开发票')
	const invoice_func = ref(false)
	const special_invoice = ref(false)
	const isAgree = ref(false)
	const showProtocol = ref(false)
	const isCoupon = ref(false)
	const protocol = ref('')
	const order_type = ref(0)
	const addInvoice = ref({})
	const couponData = ref({})
	const go_map = ref(false)
	const orderPay = ref(false)
	const take = ref([])
	const open_integral = ref(0)
	const coupon_number = ref(0)
	const store_coupon_number = ref(0)
	const coupon_amount = ref(0)
	const store_coupon_amount = ref(0)
	const plant_coupon_amount = ref(0)
	const integral_count = ref('')
	const agrementTtile = ref('发票说明')
	const pics = ref([])
	const order_model = ref(2)
	const allow_address = ref(true)
	const order_extend = ref([])
	const extend = ref([])
	const virtualIndex = ref(0)
	const platformCoupon = ref([])
	const total_platform_coupon_price = ref(0)
	const enabledPlatformCoupon = ref(false)
	const plantCoupon = ref(false)
	const isShowDiscount = ref(false)
	const order_key = ref('')
	const is_take = ref('')
	//自提提示
	const take_modal = ref();
	const result = ref()
	const domain = ref(HTTP_REQUEST_URL)
	//可用平台优惠券数量
	const platformCouponCount = ref(0)
	//可用店铺优惠券数量
	const storeCouponCount = ref(0)
	//是否进行微信支付--测试专用变量
	const is_wx_pay = ref(false)
	// 兑换积分商品使用check对象
	const check_data = ref({})
    // 兑换积分使用的数量
	const use_super_integral_input = ref('')
	const use_super_integral = ref('')
	// 控制是否调用自动填充兑换积分
	const is_auto_Integral = ref(false)
	const hide_mer_status = computed(() => {
		return Store.globalData.hide_mer_status
	})
	const alipay_open = computed(() => {
		return Store.globalData.alipay_open
	})
	const yue_pay_status = computed(() => {
		return Store.globalData.yue_pay_status
	})
	const isLogin = computed(() => {
		return mine_store.isLogin
	})
	const localViewColor = computed(() => {
		return Store.localViewColor
	})
    const popup_Exchange = ref()
	watch(() => alipay_open.value, (n) => {
		payMode.value[1].payStatus = n
	})
	watch(() => yue_pay_status.value, (n) => {
		payMode.value[2].payStatus = n
	})

	let addressWindowRef = ref()

	onLoad( async (options) => {

		uni.login({
            provider: 'weixin',
            success: async (res) => {
                const code = res.code;
                // 绑定openid
				bindUserRouteId({ code, appid: 'wx29df62cbac3abc9a' })
            },
            fail: (err) => {}
        });

		seckillId.value = options.seckillId
		// #ifdef H5
		from.value = util.isWeixin() ? 'weixin' : 'h5'
		// #endif
		// #ifdef MP
		from.value = 'routine'
		// #endif
		// #ifdef APP-PLUS
		from.value = 'weixin'
		// #endif
		if (!options.cartId) return util.Tips({
			title: '请选择要购买的商品'
		}, {
			tab: 3,
			url: 1
		});
		couponId.value = options.couponId || 0;
		pinkId.value = options.pinkid ? parseInt(options.pinkid) : 0;
		addressId.value = options.addressId || 0;
		cartId.value = options.cartId;
		is_address.value = options.is_address ? true : false;
		if (options.invoice_type == 1) {
			invoiceName.value = '增值税电子普通发票';
		} else if (options.invoice_type == 2) {
			invoiceName.value = '增值税专用发票';
		}
		if (!isLogin.value) {
			toLogin()
		}
		if (payType.value == 'weixin') {
			payType.value = from.value
		}
		textareaStatus.value = true;
		uni.setStorage({
			key:'invoice_Data',
			data:{},
			success: function(){}
		})
	})
	/**
	 * 生命周期函数--监听页面显示
	 */
	 onShow(async () => {
		getconfigApi()
		uni.$on("handClick", res => {
			if (res) {
				system_store.value = res.address
			}
			// 清除监听
			uni.$off('handClick');
		})
		invoice.value.invoice = false;
		if (isLogin.value && toPay.value == false && !orderPay.value) {
			await getaddressInfo();
			nextTick(async function() {
				addressWindowRef.value.getAddressList();
				  await getUserInfo_()
				
				  let flag = setTimeout(() => {
					if(is_auto_Integral.value) return clearTimeout(flag)
					initIntegralEvent()
				}, 500);
			})
		}
	 })

	 // 设置默认支付方式
	 function defaultPayMethod(arr) {
	 	if (Store.globalData.sandpay_status == "1") {
	 		return 7
	 	} else if (Store.globalData.yue_pay_status == '1') {
	 		return 2
	 	} else {
	 		return arr.findIndex((v) => v.payStatus == '1') || 0;
	 	}
	 }

	 // 设置默认支付方式(字符串标识)
	 function defaultPayMethodString(arr) {
	 	if (Store.globalData.sandpay_status == "1") {
	 		return 'sand'
	 	} else if (Store.globalData.yue_pay_status == '1') {
	 		return 'balance'
	 	} else {
	 		let pay = arr.find((v) => v.payStatus == '1');
	 		if (pay) {
	 			return pay.value;
	 		}
	 		return 'balance';
	 	}
	 }

	 /*预售协议*/
	 function getPresellAgree() {
		showProtocol.value = true
		agrementTtile.value = '预售协议'
		presellAgreement().then(res => {
			protocol.value = res.data.sys_product_presell_agree;
		})
	}

	function changeIsAgree(e) {
		isAgree.value = !isAgree.value;
	}

	function changeIntegral(e) {
		use_integral.value = !use_integral.value;
		getConfirm(addressId.value);
	}

	function showPresellAgree(){
		getPresellAgree()
	}

	function showInvoice(){
		getAgreement();
	}

	function showCoupon(){
		getCouponAgreement();
	}

	// 打开配送方式弹窗
	function openDiscount(item, index) {
		isShowDiscount.value = !isShowDiscount.value;
	}
	
	function closeDiscount() {
		isShowDiscount.value = false
	}
	// 图片预览
	// 获得相册 idx
	function getPhotoClickIdx(e) {
		let idx = e.currentTarget.dataset.index;
		imgPreview(pics.value, idx);
	}
	// 图片预览
	function imgPreview(list, idx) {
		// list：图片 url 数组
		if (list && list.length > 0) {
			uni.previewImage({
				current: list[idx], //  传 Number H5端出现不兼容
				urls: list
			});
		}
	}
	/**上传文件*/
	function uploadpic(item) {
		util.uploadImageOne('upload/image', function(res) {
			let pics = item.value || []
			pics.push(res.data.path);
			item.value = pics
		});
	}
	/** 删除图片*/
	function DelPic(item,index) {
		pic = pics.value[index];
		item.value.splice(index, 1);
	}
	// 获取个人信息
	async function getUserInfo_() {
	  return getUserInfo().then(res => {
			userInfo.value = res.data
			console.log('userInfo--->',userInfo.value)
		}).catch(err=>{
	
		})
	}
	/*获取发票说明*/
	function getAgreement() {
		showProtocol.value = true;
		agrementTtile.value = '发票说明'
		getAgreementApi('sys_receipt_agree').then(res => {
			protocol.value = res.data.sys_receipt_agree
		})
	}
	/*获取发票说明*/
	function getCouponAgreement() {
		showProtocol.value = true;
		agrementTtile.value = '优惠券说明'
		getAgreementApi('sys_coupon_agree').then(res => {
			protocol.value = res.data.sys_coupon_agree
		})
	}
	/**
	 * 获取门店列表数据
	 */
	function getList() {
		let longitude = uni.getStorageSync("CACHE_LONGITUDE"); //经度
		let latitude = uni.getStorageSync("CACHE_LATITUDE"); //纬度
		let data = {
			latitude: latitude, //纬度
			longitude: longitude, //经度
			page: 1,
			limit: 10
		}
		storeListApi(data).then(res => {
			let list = res.data.list.list || [];
			storeList.value = list
			system_store.value = list[0]
		}).catch(err => {})
	}
	// 关闭地址弹窗；
	function changeClose() {
		address.value.address = false
	}
	// 关闭发票弹窗
	function changeInvoiceClose(data) {
		getInvoiceData(data);
		invoice.value.invoice = false
	}
	function getInvoiceData(selectedData) {
		invoiceData.value = {}
		if (selectedData) {
			cartInfo.value.forEach((item, i) => {
				if (item.mer_id == selectedData.mer_id) {
					if (cartInfo.value[i]['invoiceData']) {
						cartInfo.value[i]['invoiceData'] = selectedData
					} else {
						cartInfo.value[i].invoiceData = selectedData
					}
				}
				let mer_id = selectedData.mer_id
				invoiceData.value[mer_id] = selectedData;
			});
		} else {
			cartInfo.value.forEach((item, i) => {
				cartInfo.value[i].invoiceData = {}
			});
		}
	}
	function getInvoiceDatas(selectedData) {
		invoiceData.value = {}
		if (selectedData.length) {
			cartInfo.value.forEach((item, i) => {
				selectedData.forEach((val, j) => {
					if (item.mer_id == val.mer_id) {
						if (cartInfo.value[i]['invoiceData']) {
							cartInfo.value[i]['invoiceData'] = val
						} else {
							cartInfo.value[i].invoiceData = val
						}
					}
					let mer_id = val.mer_id
					invoiceData.value[mer_id] = val;
				})
			});
		} else {
			cartInfo.value.forEach((item, i) => {
				cartInfo.value[i].invoiceData = {}
			});
		}
	}
	/*
	* 跳转门店列表
	*/
	function showStoreList() {
		if (storeList.value.length > 0) {
			uni.navigateTo({
				url: '/packages/mall/views/pages/users/goods_details_store/index'
			})
		}
	}
	// 进店
	function goStore(id,item) {
         console.log(item)
		if (hide_mer_status.value != 1) {
			uni.navigateTo({
			   url:item.welfare_post_id > 0 ? '/packages/mall/views/pages/users/post-station/shop?id=' + id + '&welfare_post_id=' + item.welfare_post_id: `/views/pages/home/store?mer_id=${id}`
			})
		}
	}
	function ChangCouponsClone() {
		coupon.value.status = false;
	}
	function changeTextareaStatus() {
		for (let i = 0, len = coupon.value.list.length; i < len; i++) {
			coupon.value.list[i].use_title = '';
			coupon.value.list[i].is_use = 0;
		}
		textareaStatus.value = true;
		status.value = 0;
		coupon.value.list = coupon.value.list;
	}
	/**
	 * 处理点击优惠券后的事件
	 *
	 */
	function ChangCoupons(data) {
		cartInfo.value.forEach((item, index) => {
			if (item.mer_id == data.mer_id) {
				cartInfo.value.index = data
			}
		})
		coupon.value.status = false
		couponNum()
	}
	// 计算优惠券抵扣
	function couponNum() {
		let tempTotal = 0,
		tempCouponNum = 0
		cartInfo.value.forEach((item, index) => {
			tempCouponNum = util.$h.Add(tempCouponNum, item.order.coupon_price)
			tempTotal = util.$h.Add(tempTotal, item.order.pay_price)
		})
		coupon_price.value = tempCouponNum
		if (order_type.value == 2 && coupon.value.list[0].productPresell.presell_type == 2) {
			return
		}
		totalPrice.value = tempTotal
	}
	/**
	 * 选择地址后改变事件
	 * @param object e
	 */
	function OnChangeAddress(e) {
		textareaStatus.value = true;
		addressId.value = e;
		address.value.address = false;
		getaddressInfo();
	}
	function bindHideKeyboard(e) {
		mark.value = e.detail.value;
	}
	/**
	* @description: 此处在不断选择优惠券时，会重复叠加已选择数量（不准确），需要调整为在执行getConfirm时重新处理已选择数量
	* @param {*} coupon
	* @author: HOOK
	*/
	function getCoupon(coupon) {
		if (coupon.checked) {
			subCoupon.value[coupon.mer_id].forEach((item, i) => {
				if (coupon.coupon_user_id == item) {
					subCoupon.value[coupon.mer_id].splice(i, 1)
				}
			})
		} else {
			subCoupon.value[coupon.mer_id].push(coupon.coupon_user_id)
		}
		getConfirm(addressId.value)
	}
	/**
	 * 获取当前订单详细信息
	 *
	 */
	function getConfirm(address_id) {
		uni.showLoading({
			title: '',
			mask: true
		});
		// 判断是否使用兑换积分
		let req = use_super_integral.value > 0 ? {use_super_integral:use_super_integral.value} : {}
		getOrderConfirm({
			cart_id: cartId.value.split(","),
			address_id: address_id,
			takes: take.value,
			use_coupon: subCoupon.value,
			use_integral: use_integral.value,
			...req
		}).then(res => {
			// 默认选中
			console.log(res.data)
			check_data.value = res.data
			is_take.value = false
			res.data.order.forEach(el => {
				if(el.order.isTake == 1)is_take.value = true
				el.isTake = 0
				subCoupon.value[el.mer_id] = []
				el.coupon.forEach(coupon => {
					if (coupon.checked) {
						subCoupon.value[el.mer_id].push(coupon.coupon_user_id)
					}
				})
			})	
			subCoupon.value['0'] = []
			if(res.data.platformCoupon.length > 0){
				res.data.platformCoupon.forEach(el => {
					if (el.checked) {
						subCoupon.value[el.mer_id] = []
						subCoupon.value[el.mer_id].push(el.coupon_user_id)
					}
				})
			};
			coupon.value.coupon = plantCoupon.value ? res.data.platformCoupon : res.data.order[couponIndex.value].coupon
			
			store_coupon_number.value = res.data.order[couponIndex.value].order.useCouponIds.length;
			coupon_amount.value = parseFloat(res.data.order[couponIndex.value].order.coupon_price) + parseFloat(res.data.total_platform_coupon_price);
			store_coupon_amount.value = parseFloat(res.data.order[couponIndex.value].order.coupon_price);
			plant_coupon_amount.value = parseFloat(res.data.total_platform_coupon_price);
			couponData.value = res.data;
			cartInfo.value = res.data.order;
			// 计算可用平台优惠券数量与可用店铺优惠券
			let platformCouponArr = JSON.parse(JSON.stringify(res.data.platformCoupon));
			let storeCouponArr = JSON.parse(JSON.stringify(res.data.order[couponIndex.value].coupon));
			platformCouponCount.value = platformCouponArr.filter(item=>!item.disabled).length;
			storeCouponCount.value = storeCouponArr.filter(item=>!item.disabled).length;
			total_platform_coupon_price.value = res.data.total_platform_coupon_price;
			enabledPlatformCoupon.value = res.data.enabledPlatformCoupon;
			platformCoupon.value = res.data.platformCoupon;
			order_type.value = res.data.order_type;
			coupon_price.value = res.data.order_coupon_price;
			integral_count.value = res.data.order_total_integral;
			integral_price.value = res.data.order_total_integral_price;
			open_integral.value = res.data.openIntegral;
			use_integral.value = res.data.useIntegral;
			order_extend.value = (order_extend.value && order_extend.value.length>0) ? order_extend.value : res.data.order_extend;
			totalPrice.value = res.data.order_price
			orderStatus.value = res.data.status
			proPrice.value = res.data.total_price
			order_type.value = res.data.order_type
			order_model.value = res.data.order_model
			allow_address.value = res.data.allow_address
			deliveryName.value = res.data.order_model == 0 ?  '快递配送' : '虚拟发货'
			order_key.value = res.data.key
			uni.getStorage({
				key: "invoice_Data",
				success: function(res) {
					addInvoice.value = res.data;
					if (res.data) {
						getInvoiceDatas(res.data)
					}
				}
			})
			uni.hideLoading();
		}).catch(err => {
			console.log(err)
           is_auto_Integral.value = true
			return util.Tips({
				title: err
			}, {
				tab: 3,
				url: 1
			});

		});
	}

	/*
	* 获取默认收货地址或者获取某条地址信息
	*/

	async function getaddressInfo() {
		if (addressId.value) {
			getAddressDetail({ address_id: addressId.value }).then(res => {
				res.data.is_default = parseInt(res.data.is_default);
				addressInfo.value = res.data || {};
				addressId.value = res.data.address_id || 0;
				address.value.addressId = res.data.address_id || 0;
				post.value = {real_name: res.data.real_name, phone: res.data.phone}
				return getConfirm(addressId.value);
			})
		} else {
			getAddressList({
				page: 1,
				page_size: 10
			}).then(res => {
				addressInfo.value = res.data.items.length > 0 ? res.data.items[0] : {};
				addressId.value = res.data.items.length > 0 ? res.data.items[0].address_id : 0;
				address.value.addressId = res.data.items.length > 0 ? res.data.items[0].address_id : 0;
				post.value = res.data.items.length > 0 ? {real_name: res.data.items[0].real_name,phone:res.data.items[0].phone } : {real_name: '', phone: ''}
				return getConfirm(addressId.value);
			})
		}
	}
	function payItem(e) {
	    let active_ = e;
	    active.value = active_;
	    animated.value = true;
	    payType.value = cartArr.value[active_].value;
	    if (payType.value == 'weixin') {
	    	payType.value = from.value
	    }
	}
	function couponTap(item, index) {
		coupon.value = item
		coupon.value.status = true
		couponIndex.value = index
		plantCoupon.value = false
		coupon_number.value = store_coupon_number.value
		coupon_amount.value = store_coupon_amount.value
	}
	function couponTap2(item, index) {
		coupon.value = {
			coupon: item,
			mer_id: 0,
			status: true
		}
		plantCoupon.value = true
		coupon_number.value = subCoupon.value['0'].length;
		coupon_amount.value = plant_coupon_amount.value;
	}
	function car() {
		animated.value = false;
	}
	function onAddress() {
		if(addressInfo.value.real_name){
			textareaStatus.value = false;
			address.value.address = true;
			pagesUrl.value = '/pagesMine/user-address/index?cartId=' + cartId.value + '&pinkId=' + pinkId.value + '&couponId=' + couponId.value;
		}else{
			uni.navigateTo({
				url: `/pagesMine/user-address/index?cartId=${cartId.value}`,
			});
		}
	}

	let addInvoicingRef = ref()

	/**
	 * 开发票
	 */
	function goInvoice(id) {
		invoice.value.invoice = true;
		invoice.value.mer_id = id;
		addInvoicingRef.value.getInvoiceDefault();
		addInvoicingRef.value.getInvoiceList();
	}
	function payment(data) {
		createOrder(data).then(async (res) => {
			let status = res.data.status,
			orderId = res.data.result.order_id,
			callback_key = res.data.result.pay_key,
			jsConfig = res.data.result.config;
			orderPay.value = true;
			try { 
				const [code, middleToken] = await getMiddleToken();
				uni.setStorageSync('middle_token', middleToken);
				uni.hideLoading();
				switch (status) {
					case 'shengWxLite':
						try {
							uni.hideLoading()
							let mini_appid = res.data.result && res.data.result.mini_appid ? res.data.result.mini_appid : 'wx29df62cbac3abc9a';
							switch (mini_appid) {
								case 'wx29df62cbac3abc9a':
									// const middle_token_ = uni.getStorageSync("middle_token");
									uni.redirectTo({
										url: `/pages/users/order_details/index?middle_token=${middleToken}&order_id=${orderId}`
									})
									break;
								default:
									// const middle_token = uni.getStorageSync("middle_token");
									uni.navigateToMiniProgram({
										appId: mini_appid,
										path: 'pages/users/order_details/index',
										extraData: {
											middle_token: middleToken,
											order_id: orderId
										},
										envVersion: 'trial',
										success(res) {
											uni.navigateBack({
												delta: 1
											})
										},
										fail(err) {
											uni.redirectTo({
												url: '/pagesOrder/order-list/index?status=1'
											});
										}
									})
									break;
							}
						} catch (error) {}
						break;
					case 'ORDER_EXIST':
					case 'EXTEND_ORDER':
					case 'PAY_ERROR':
					case 'error':
						return util.Tips({
							title: res.message
						}, {
							tab: 5,
							url: '/pagesOrder/order-list/index?status=0'
						});
					default:
						return
				}
			} catch (error) {
				uni.hideLoading();
			}
		}).catch(err => {
			uni.hideLoading();
			if(err == '税号只能是字母和数字' || err =='发票抬头不能为空'){
				return util.Tips({
					title: err
				})
			}else{
				return util.Tips({
					title: err
				},{
					tab:5,
					url:'/pagesOrder/order-list/index?status=0'
				});
			}
		});
	}
	function isEmojiCharacter(substring) {
		if (substring) {
			for (var i = 0; i < substring.length; i++) {
				var hs = substring.charCodeAt(i);
				if (0xd800 <= hs && hs <= 0xdbff) {
					if (substring.length > 1) {
						var ls = substring.charCodeAt(i + 1);
						var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
						if (0x1d000 <= uc && uc <= 0x1f77f) {
							return true;
						}
					}
				} else if (substring.length > 1) {
					var ls = substring.charCodeAt(i + 1);
					if (ls == 0x20e3) {
						return true;
					}
				} else {
					if (0x2100 <= hs && hs <= 0x27ff) {
						return true;
					} else if (0x2B05 <= hs && hs <= 0x2b07) {
						return true;
					} else if (0x2934 <= hs && hs <= 0x2935) {
						return true;
					} else if (0x3297 <= hs && hs <= 0x3299) {
						return true;
					} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
						hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
						hs == 0x2b50) {
						return true;
					}
				}
			}
		}
	}
	function bindDateChange(e){
		order_extend.value[virtualIndex.value].value = e.detail.value;
	}
	function getTime(index){
		virtualIndex.value = index;
	}

	//关闭自提信息提示
	function closeTake(){
		take_modal.value.close()
	}
	
	//自提弹框提交
	function confirmTake(){
		closeTake()
		uni.showLoading({
			title: '订单创建中',
			mask: true
		})
		payment(result.value);
	}
	
	function SubOrder(e) {
		let data = {};
		if (!payType.value) return util.Tips({
			title: '请选择支付方式'
		});
		if (orderStatus.value == 'noAddress') return util.Tips({
			title: '请选择收货地址'
		});
		if (orderStatus.value != 'finish' && order_model.value == 0) {
			return util.Tips({
				title: '收货地址不在配送区域'
			});
		}
		if (orderStatus.value == 'noDeliver') {
			return util.Tips({
				title: '暂不发货'
			});
		}
		if (order_type.value == 2 && !isAgree.value && cartInfo.value[0].list[0].productPresell.presell_type ==
			2) {
			return util.Tips({
				title: '请阅读并勾选协议，否则无法进行操作'
			});
		}
		if(order_model.value == 1 && order_extend.value.length > 0){
			for(var i=0; i<order_extend.value.length; i++){
				let el = order_extend.value[i]
				if (el.require) {
					if(!el.value || el.value.length == 0){
						return util.Tips({
							title: '请填写'+el.title
						});
					}else if(el.key == 'mobile' && !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(el.value)){
						return util.Tips({
							title: '请输入正确的'+el.title
						});
					}else if(el.key == 'email' && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(el.value)){
						return util.Tips({
							title: '请输入正确的'+el.title
						});
					}else if(el.key == 'idCard' && !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(el.value)){
						return util.Tips({
							title: '请输入正确的'+el.title
						});
					}
				}else if(el.value){
					if(el.key == 'mobile' && !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(el.value)){
						return util.Tips({
							title: '请输入正确的'+el.title
						});
					}if(el.key == 'email' && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(el.value)){
						return util.Tips({
							title: '请输入正确的'+el.title
						});
					}if(el.key == 'idCard' && !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(el.value)){
						return util.Tips({
							title: '请输入正确的'+el.title
						});
					}
				}
				extend.value[i] = {title: el.title,value: el.value}
			}
		}
		if (is_take.value) {
			if(!post.value.real_name){
				return util.Tips({
					title: '请填写收货人姓名'
				});
			}
			if(!post.value.phone){
				return util.Tips({
					title: '请填写收货人电话'
				});
			}
			if(post.value.phone && !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(post.value.phone)){
				return util.Tips({
					title: '收货人电话格式不正确'
				});
			}
		}
		data = {
			cart_id: cartId.value.split(","),
			address_id: addressId.value,
			use_coupon: subCoupon.value,
			pay_type: 'joinpayWxLite' || payType.value,
			mark: msgObj.value,
			order_type: order_type.value,
			key: order_key.value,
			takes: take.value,
			use_integral: use_integral.value,
			receipt_data: invoiceData.value,
			extend: extend.value,
			post: post.value,
		   // #ifndef MP
			return_url: uni.$config.mdd_Url + '/pagesOrder/order-list/index?status=1',
			// #endif
		};
		console.log(uni.$config.mdd_Url)
		if (data.mark && isEmojiCharacter(data.mark[Object.keys(data.mark)[0]])) {
			util.Tips({title: '备注不允许输入表情！'});
			return;
		}
		data.takes=[]
		cartInfo.value.map(el => {
			if (el.isTake == 1 || el.order.isTake) {
				console.log(el.isTake ,el.order.isTake)
				data.takes.push(el.mer_id)
			}
		})
		if(data.takes.length>0){
			result.value = data;
			take_modal.value.open()
		}else{
			uni.showLoading({
				title: '订单创建中',
				mask: true
			})
			payment(data);
		}
	}

	// 打开配送方式弹窗
	function openShowBox(item, index) {
		if(item.delivery_way.length == 2 && order_model.value != 2){
			activeObj.value = item
			activeIndex.value = index
			isShowBox.value = true
			getDeliveryType(item.order)
		}
	}
	// 获取快递方式
	function getDeliveryType(item) {
		if(item.allow_delivery && item.allow_take){
			radioList.value = [
				{
					title:deliveryName.value,
					check:true
				},
				{
					title:'到店核销',
					check:false
				}
			]
		}else if(item.allow_delivery && !item.allow_take){
			radioList.value = [
				{
					title:deliveryName.value,
					check:true
				}
			]
		}else if(!item.allow_delivery && item.allow_take){
			radioList.value = [
				{
					title:'到店核销',
					check:false
				}
			]
		}
	}
	function boxClose() {
		isShowBox.value = false
	}
	function getData(data) {
		cartInfo.value[activeIndex.value] = data
		if (data.order.isTake) {
			take.value.push(data.mer_id)
		} else {
			take.value.forEach((item, i) => {
				if (data.mer_id == item) {
					take.value.splice(i, 1)
				}
			})
		}
		isShowBox.value = false
		getConfirm(addressId.value);
	}
	//查看内置地图
	function goMap(item) {
		let lat = Number(item.take.mer_take_location[0]),long = Number(item.take.mer_take_location[1])
		uni.openLocation({
			latitude: parseFloat(lat),
			longitude: parseFloat(long),
			scale: 8,
			name: item.mer_name,
			address: item.take ? item.take.mer_take_address : '',
			success: function(res) {
				go_map.value = true
			},
		});
}
	// 自动填充用户兑换积分
	const initIntegralEvent = () => {
		if(Number(userInfo.value.super_integral)>Number(check_data.value.order_can_use_super_integral)){
             console.log('剩余积分大于可使用积分')
			 use_super_integral.value = check_data.value.order_can_use_super_integral

		}else if(Number(userInfo.value.super_integral) <= Number(check_data.value.order_can_use_super_integral)){
			console.log('剩余积分不足可用积分')
			 use_super_integral.value = userInfo.value.super_integral
		}else{
			 use_super_integral.value = 0
		}
        console.log('自动使用兑换积分',Number(use_super_integral.value))
		if(Number(use_super_integral.value) > 0){
            getConfirm(addressId.value)
		}
	}
	// 打开兑换积分使用弹框
	const openExchangePopup = () => {
      popup_Exchange.value.open()
	}
	// 确定使用兑换积分
	const ExchangeVerify = () => {
	  if(Number(use_super_integral_input.value) > Number(userInfo.value.super_integral)){
         uni.showToast({
	       title: '兑换积分余额不足',
	       duration: 2000,
		   icon:'none'
          });
		}else if(Number(use_super_integral_input.value) > Number(check_data.value.order_can_use_super_integral)){
           uni.showToast({
	       title: '最多可使用' + check_data.value.order_can_use_super_integral + '兑换积分',
	       duration: 2000,
		   icon:'none'
          });
		} else{
		  popup_Exchange.value.close()
		  use_super_integral.value = Number(use_super_integral_input.value)
		  getConfirm(addressId.value)
		}
	}
	// 点击兑换积分弹框蒙层事件
	const maskClick = () =>{

	}
	// 关闭兑换积分弹框
	const ExchangeClose = () => {
      popup_Exchange.value.close()
	}
</script>

<style lang="scss" scoped>
.popup-Exchange-box{
	position: relative;
	width: 750rpx;
	border-radius:32rpx 32rpx 0px 0px ;
	background: #fff;
	padding: 60rpx 32rpx;
	.closeempty-icon{
		position: absolute;
		right:48rpx;
		top: 48rpx;
	}
	.Exchange-verify{
	  background: #00DCEE;
	  border: none;
	  border-radius: 24rpx;
	  color: #fff;
	  margin-top: 80rpx;
	  font-size: 28rpx;
	  height: 96rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.Exchange-title{
		margin-bottom: 8rpx;
		.Exchange-title-text{
			font-size: 28rpx;
			font-weight: 500;
			color: #111;
		}
	}
	.Exchange-number{
		margin-bottom: 48rpx;
		.Exchange-number-text{
			 color: #111111;
             font-family: "PingFang SC";
             font-size: 48rpx;
             font-style: normal;
             font-weight: 500;
		}
	}
	.Exchange-At-most{
		.Exchange-At-most-text{
			color: #FF4D25;
			font-size: 24rpx;
		}
	}
	.Exchange-input{
		width: 686rpx;
        height: 88rpx;
		background: #F5F6F6;
		padding: 0px 32rpx;
		border-radius: 24rpx;
		margin-top: 19rpx;
	}
	.Exchange-placeholder{
		font-size: 28rpx;
		color: #ccc;
	}
}
.Exchange-box{
	.icon-jiantou{
		font-size: 24rpx !important;
		color:#515151 ;
	}
	.Exchange-num{
		color: #FF4D25;
		font-size: 24rpx;
	}
}
	.page_bg_wrap {
		padding: 24rpx 24rpx 0 24rpx;
	}
	::v-deep.checkbox .uni-checkbox-input.uni-checkbox-input-checked,
	::v-deep.checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	  border: 1px solid var(--view-theme)!important;
	  background-color: var(--view-theme)!important;
	  color: #fff!important;
	}
	.order-submission .line {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 3rpx;
	}
	.order-submission .line image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.order-submission .address {
		padding: 28rpx 30rpx;
		background-color: #fff;
		box-sizing: border-box;
	}
	.order-submission .address .addressCon {
		width: 562rpx;
		font-size: 26rpx;
		color: #666;
	}
	.order-submission .address .addressCon .name {
		font-size: 30rpx;
		color: #282828;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.order-submission .address .addressCon .name .phone {
		margin-left: 50rpx;
	}
	.order-submission .address .addressCon .ad_box {
		// height: 40rpx;
		line-height: 40rpx;
		color: var(--view-noSelectColor);
		word-break: break-all;
		// display: flex;
		// align-items: center;
		word-break: break-all;
	    flex-direction: row;
	}
	.order-submission .address .addressCon .default {
		font-size: 20rpx;
		margin-right: 12rpx;
		border-radius: 8rpx;
		border: 2rpx solid var(--view-noSelectColor);
		padding: 0 8rpx;
		vertical-align: top;
		flex-shrink: 0 !important;
		// display: block;
		width: 68rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		float: left;
		// height: ;

	}
	// .t-color{
	// 	color: var(--view-theme);
	// }
	.order-submission .address .addressCon .setaddress {
		color: #333;
		font-size: 28rpx;
	}
	.addressCon .line1 {
		width:17.5625rem ;
	}
	.order-submission .address .iconfont {
		font-size: 24rpx;
		color: #707070;
	}


	.v-allAddress {
		width: 100%;
		padding: 20rpx;
		background: #FFFFFF;
		box-shadow: 0 0 20rpx 12rpx #eeeeee80;
		border-radius: 20rpx;
		.address-dtl {
			.address-location-icon {
				width: 34rpx;
				height: 36rpx;
				display: block;
				margin-right: 10rpx;
			}
			.info {
				.base-info {
					max-width: 520rpx;
					word-break: break-all;
					margin-bottom: 8rpx;
					.text {
						font-weight: 600;
						font-size: 24rpx;
						color: #111111;
					}
					.default {
						font-size: 20rpx;
						margin-right: 8rpx;
						border-radius: 8rpx;
						border: 2rpx solid var(--view-noSelectColor);
						padding: 0 8rpx;
						vertical-align: top;
						flex-shrink: 0 !important;
						width: 68rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
				.other-info {
					.text {
						font-weight: 400;
						font-size: 24rpx;
						color: #111111;
						display: inline-block;
						margin-right: 8rpx;
					}
				}
			}
			.setaddress {
				font-weight: 600;
				font-size: 24rpx;
				color: #111111;
			}
		}
		.address-arrow-icon {
			width: 24rpx;
			height: 24rpx;
		}
	}

	.order-submission .allAddress {
		width: 100%;
	}
	.order-submission .allAddress .nav {
		width: 710rpx;
		margin: 0 auto;
	}
	.order-submission .allAddress .nav .item {
		width: 355rpx;
	}
	.order-submission .allAddress .nav .item.on {
		position: relative;
		width: 250rpx;
	}
	.order-submission .allAddress .nav .item.on::before {
		position: absolute;
		bottom: 0;
		content: "快递配送";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 336rpx;
		border-width: 0 20rpx 80rpx 0;
		border-style: none solid solid;
		border-color: transparent transparent #fff;
		z-index: 2;
		border-radius: 7rpx 30rpx 0 0;
		text-align: center;
		line-height: 80rpx;
	}
	.order-submission .allAddress .nav .item:nth-of-type(2).on::before {
		content: "到店核销";
		border-width: 0 0 80rpx 20rpx;
		border-radius: 30rpx 7rpx 0 0;
	}
	.order-submission .allAddress .nav .item.on2 {
		position: relative;
	}
	.order-submission .allAddress .nav .item.on2::before {
		position: absolute;
		bottom: 0;
		content: "到店核销";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 400rpx;
		border-width: 0 0 60rpx 60rpx;
		border-style: none solid solid;
		border-color: transparent transparent #f7c1bd;
		border-radius: 40rpx 6rpx 0 0;
		text-align: center;
		line-height: 60rpx;
	}
	.order-submission .allAddress .nav .item:nth-of-type(1).on2::before {
		content: "快递配送";
		border-width: 0 60rpx 60rpx 0;
		border-radius: 6rpx 40rpx 0 0;
	}
	.order-submission .allAddress .address {
		min-height: 150rpx;
		margin: 0 auto;
	}
	.order-submission .allAddress .line {
		margin: 0 auto;
	}
	.order-submission .wrapper .item .discount .placeholder {
		color: #ccc;
		text-align: right;
	}
	.order-submission .wrapper {
		margin-bottom: 16rpx;
		background-color: #fff;
	}
	.order-submission .wrapper .item {
		padding: 20rpx;
		font-size: 28rpx;
		color: var(--view-theme);
		.pay-title {
			font-weight: 400;
			font-size: 24rpx;
			color: #111111;
		}
		.item-arrow-icon {
			width: 26rpx;
			height: 24rpx;
		}
	}
	.order-submission .virtual_form{
		padding: 0 30rpx;
	}
	::v-deep.order-submission .virtual_form .uni-input-wrapper {
		text-align: right;
		font-size: 28rpx;
	}
	
	.order-submission .virtual_form .item-require{
		color: red;
		margin-right: 4rpx;
	}
	.order-submission .virtual_form .item{
		border-bottom: 1rpx solid #EEEEEE;
		padding: 27rpx 0;
	}
	.upload {
		display: -webkit-box;
		display: -moz-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-lines: multiple;
		-moz-box-lines: multiple;
		-o-box-lines: multiple;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}
	.order-submission .virtual_form .pictrue {
		width: 156rpx;
		height: 156rpx;
		margin: 24rpx 20rpx 0 0;
		position: relative;
		font-size: 11px;
		color: #bbb;
		border-radius: 3rpx;
		&:nth-child(4n) {
			margin-right: 0;
		}
		&:nth-last-child(1) {
			border: 0.5px solid #ddd;
			box-sizing: border-box;
		}
		uni-image,
		image {
			width: 100%;
			height: 100%;
			border-radius: 1px;
			img {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				width: 100%;
				height: 100%;
			}
		}
		.icon-guanbi4 {
			color: #fff;
			font-size: 14rpx;
			position: absolute;
			top: 0;
			right: 0;
			width: 30rpx;
			height: 30rpx;
			text-align: center;
			line-height: 30rpx;
			border-radius: 0 8rpx 0 8rpx;
			background: rgba(0,0,0,.6);
		}
	}
	.vipImg {
		width: 65rpx;
		height: 28rpx;
		margin-left: 4rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.order-submission .wrapper .item .discount {
		font-size: 28rpx;
		color: var(--view-noSelectColor);
		&.discount_voice {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 402rpx;
			text-align: right;
			justify-content: flex-end;
		}
	}
	.order-submission .wrapper .item .discount .iconfont {
		color: #515151;
		font-size: 24rpx;
		margin-left: 15rpx;
	}
	.order-submission .wrapper .item .discount .num {
		font-size: 32rpx;
		margin-right: 20rpx;
	}
	.order-submission .wrapper .item .shipping {
		font-size: 30rpx;
		color: #999;
		position: relative;
		padding-right: 58rpx;
	}
	.order-submission .wrapper .item .shipping .iconfont {
		font-size: 35rpx;
		color: #707070;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 30rpx;
	}
	.order-submission .wrapper .item input {
		flex: 1;
		height: 100%;
		margin-left: 20rpx;
		text-align: right;
	}
	::v-deep.order-submission .wrapper .item .placeholder {
		color: #ccc;
		font-size: 24rpx !important;
	}
	.order-submission .wrapper .item .list {
		margin-top: 16rpx;
	}
	.order-submission .wrapper .item .list .payItem {
		// border: 1px solid #eee;
		border-radius: 6rpx;
		height: 40rpx;
		width: 100%;
		box-sizing: border-box;
		margin-top: 24rpx;
		font-size: 28rpx;
		color: var(--view-theme);
	}
	.order-submission .wrapper .item .list .payItem.on {
		border-color: var(--view-theme);
		color: var(--view-theme);
	}
	.order-submission .wrapper .item .list .payItem .name {
		width: 35%;
		text-align: center;
		// border-right: 1px solid #eee;
		justify-content: left;
		// padding-left: 80rpx;
		font-weight: 500;
		font-size: 24rpx;
		.pay-logo {
			width: 40rpx;
			height: 40rpx;
			display: block;
			margin-right: 14rpx;
		}
	}
	.order-submission .wrapper .item .list .payItem .name .iconfont {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 44rpx;
		background-color: #fe960f;
		color: #fff;
		font-size: 30rpx;
		margin-right: 15rpx;
	}
	.order-submission .wrapper .item .list .payItem .name .icon-weixinzhifu {
		background-color: #41b035;
	}
	.order-submission .wrapper .item .list .payItem .name .iconfont.icon-icon34 {
		background-color: #4295D5;
	}
	.order-submission .wrapper .item .list .payItem .tip {
		width: calc(65% - 64rpx);
		text-align: right;
		font-size: 24rpx;
		color: var(--view-noSelectColor);
	}
	.order-submission .wrapper .item .list .payItem .check_box {
		width: 64rpx;
		.iconfont {
			font-size: 32rpx;
			padding-left: 32rpx;
		}
	}
	.order-submission .moneyList {
		margin-top: 16rpx;
		background-color: #fff;
		padding: 24rpx 20rpx;
	}
	.order-submission .moneyList .item {
		font-size: 28rpx;
		color: #111;
		font-weight: 400;
	}
	.order-submission .moneyList .item~.item {
		margin-top: 20rpx;
	}
	.order-submission .moneyList .item .money {
		color: #111;
		display: flex;
		align-items: center;
	}
	.zw-footer {
		height: 120rpx;
		height: calc(120rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(120rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.order-submission .footer {
		width: 100%;
		height: 100rpx;
		height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 30;
		.footer_count{
			font-size: 28rpx;
		}
		.coupon_price{
			color: #999999;
			font-size: 20rpx;
			margin-top: 10rpx;
			text{
				color: #282828;
				padding: 2rpx 10rpx;
				background: #F5F5F5;
				border-radius: 26rpx;
				margin-left: 20rpx;
				line-height: 30rpx;
				height: 30rpx;
				display: inline-block;
			}
		}
	}
	.pColor{
		color: var(--view-priceColor);
		font-size: 28rpx;
		font-weight: 600;
		padding-left: 24rpx;
	}
	.footer-total {
		font-size: 36rpx;
		padding-left: 0rpx;
	}
	.order-submission .footer .settlement {
		font-size: 30rpx;
		color: #fff;
		width: 240rpx;
		height: 90rpx;
		background: #FA6262;
		border-radius: 8rpx;
		text-align: center;
		line-height: 90rpx;
		opacity: 1;
		&.disabled {
			opacity: 0.2;
		}
	}
	.footer .transparent {
		opacity: 0
	}
	.event_bg {
		background: #FF7F00;
	}
	.event_color {
		color: #FF7F00;
	}
	.color_red {
		color: var(--view-theme);
	}
	.storeinfo-wrapper {
		.store-item {
			margin-top: 16rpx;
			background-color: #fff;
			.store-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 20rpx 16rpx;
				.st_left {
					display: flex;
					align-items: center;
					flex: 1;
					.store-logo {
						width: 32rpx;
						height: 32rpx;
						display: block;
						margin-right: 20rpx;
					}
					.txt {
						font-weight: 600;
						font-size: 24rpx;
						color: #111111;
					}
				}
				.icon-shangjiadingdan {
					font-size: 32rpx;
				}
				.icon-xiangyou {
					font-size: 24rpx;
					color: #999;
				}
				.txt {
					margin: 0 8rpx;
				}
			}
			.product-item {
				display: flex;
				padding: 25rpx 20rpx;
				// border-top: 1px solid #F0F0F0;

				.img-box {
					width: 140rpx;
					height: 140rpx;

					image {
						width: 140rpx;
						height: 140rpx;
						border-radius: 8rpx;
					}
				}
				.content {
					position: relative;
					width: 550rpx;
					margin-left: 16rpx;
					font-size: 28rpx;
					color: #282828;
					overflow: hidden;
					.content-desc {
						.product-name {
							max-width: 370rpx;
							margin-bottom: 8rpx;
							font-weight: 400;
							font-size: 28rpx;
							color: #111111;
							.event_name {
								display: inline-block;
								margin-right: 9rpx;
								color: #fff;
								font-size: 20rpx;
								padding: 0 8rpx;
								line-height: 30rpx;
								text-align: center;
								border-radius: 6rpx;
							}
							.event_bg {
								background: #FF7F00;
							}
						}
						.product-sku {
							max-width: 370rpx;
							margin-bottom: 8rpx;
							font-weight: 400;
							font-size: 24rpx;
							color: #A5A5A5;
						}
						.product-tips {
							margin-bottom: 8rpx;
							.text {
								font-size: 20rpx;
								font-weight: 400;
								color: #777;
							}
						}
						.product-err-tips {
							display: flex;
							align-items: center;
							color: $theme-color;
							.iconfont {
								margin-right: 10rpx;
							}
							.txt {
								font-size: 20rpx;
							}
						}
					}
					.content-statistics {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						.price-wrap {
							justify-content: flex-end;
							.svip-img {
								display: block;
								margin-left: 8rpx;
								width: 65rpx;
								height: 28rpx;
							}
						}
						.statistics-money {
							text-align: right;
							font-weight: 600;
							font-size: 24rpx;
							margin-bottom: 14rpx;
							color: #FC5555;
						}
						.statistics-num {
							text-align: right;
							font-weight: 400;
							font-size: 24rpx;
							color: #111111;
						}
					}
					&.event_content {
						.line1 {
							width: 360rpx;
						}
						.price {
							position: absolute;
							top: 0;
							right: 0;
							margin-top: 0;
							text {
								display: block;
								text-align: right;
							}

						}
					}
					.event_name {
						display: inline-block;
						margin-right: 9rpx;
						color: #fff;
						font-size: 20rpx;
						padding: 0 8rpx;
						line-height: 30rpx;
						text-align: center;
						border-radius: 6rpx;
					}
					.event_ship {
						font-size: 20rpx;
						margin-top: 10rpx;
					}
					.label {
						margin-top: 10rpx;
						color: #868686;
						font-size: 20rpx;
					}
					.price {
						margin-top: 20rpx;
						color: var(--view-theme);
						position: relative;
						font-size: 12px;
						font-weight: 600;
						.row-middle {
							align-items: baseline;
						}
						text {
							margin-left: 10rpx;
							color: #999;
						}
						.delivery_type{
							float: right;
							text{
								color: var(--view-noSelectColor);
								font-size: 20rpx;
								font-weight: 400;
							}
							
						}
						.show_money {
							color: var(--view-theme);
							font-size: 36rpx;
							font-weight: 600;
						}
						.goods_num_box {
							color: var(--view-theme);
							font-size: 20rpx;
							margin-left: 32rpx;
							font-weight: 400;
							.goods_num {
								color: var(--view-theme);
								font-size: 28rpx;
								font-weight: 400;
								margin-left: 0;
							}
						}
					}
					.err-txt {
						display: flex;
						align-items: center;
						margin-top: 18rpx;
						color: $theme-color;
						.iconfont {
							margin-right: 10rpx;
						}
					}
					.step {
						position: absolute;
						right: 0;
						top: 100rpx;
						display: flex;
						align-items: center;
						// .min {
						// 	width: 50rpx;
						// 	height: 40rpx;
						// 	background-image: url('~@/packages/mall/static/images/min.png');
						// 	background-size: 17rpx 17rpx;
						// 	background-position: center;
						// 	background-repeat: no-repeat;
						// }
						.num-box {
							width: 68rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background: #F2F2F2;
							font-size: 23rpx;
						}
						// .add {
						// 	width: 50rpx;
						// 	height: 40rpx;
						// 	background-image: url('~@/packages/mall/static/images/add.png');
						// 	background-size: 17rpx 17rpx;
						// 	background-position: center;
						// 	background-repeat: no-repeat;
						// }
					}
				}
			}
			.wrapper {
				border-radius: 16rpx;
				background: #F9F9F9;
				margin-bottom: 20rpx;
				padding: 12rpx 0;
				.item {
					padding: 12rpx 20rpx;
					font-size: 24rpx;
					color: #111111;
					font-weight: 400;
					.discount {
						font-size: 24rpx;
						color: #A5A5A5;
					}
				}
			}
			.v-wrapper {
				padding: 0 20rpx;
				border-radius: 0 0 16rpx 16rpx;
				.total {
					display: flex;
					justify-content: flex-end;
					align-items: baseline;
					padding-right: 0;
					padding-bottom: 30rpx;
					font-size: 24rpx;
					color: #A5A5A5;
					.text {
						display: inline-block;
						margin-left: 20rpx;
					}
					.price {
						margin-left: 0rpx;
						color: #111111;
						font-size: 24rpx;
						font-weight: 600;
					}
				}
			}
		}
		.event_payTime {
			padding: 0 30rpx 24rpx;
			.event_progress {
				margin-top: 50rpx;
				position: relative;
			}
			.progress_step {
				height: 80rpx;
				position: relative;
				padding-left: 60rpx;
				&::before {
					content: '';
					display: block;
					width: 2rpx;
					height: 40rpx;
					background: var(--view-theme);
					position: absolute;
					left: 35rpx;
					top: 18rpx;
				}
				&:nth-child(2) {
					&::before {
						bottom: 64rpx;
						top: auto;
						background: #EFEFEF;
					}
					&::after {

						background: #EFEFEF;
					}
				}
				&::after {
					content: '';
					display: block;
					width: 14rpx;
					height: 14rpx;
					background: var(--view-theme);
					border-radius: 50%;
					position: absolute;
					top: 10rpx;
					left: 29rpx;
				}
				.name {
					float: left;
					color: #282828;

					&.color_red {
						color: var(--view-theme);
					}
				}
				.price {
					float: right;
					color: #282828;

					&.color_red {
						color: var(--view-priceColor);
					}
				}
			}
			.progress_pay {
				padding-left: 60rpx;
				font-size: 24rpx;
				color: #868686;
				margin-top: -34rpx;
			}
		}
	}
	.integral_checked {
		margin-left: 10rpx;
		display: inline;
		.iconfont{
			font-size: 32rpx;
		}
		.icon-weixuanzhong {
			color: #BFBFBF;
		}
		.icon-xuanzhong1 {
			color: var(--view-theme);
		}
	}
	uni-checkbox-group,
	.checkgroup {
		width: 100%;
		.checkbox {
			float: right;
		}
	}
	.icon-wenhao1 {
		color: #868686;
		margin-right: 6rpx;
	}
	.total {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		padding-right: 30rpx;
		padding-bottom: 30rpx;
		font-size: 24rpx;
		color: var(--view-noSelectColor);
		.price {
			margin-left: 10rpx;
			color: var(--view-theme);
			font-size: 28rpx;
			font-weight: 600;
			text {
				font-size: 20rpx;
			}
		}
	}
	.store-address {
		padding: 30rpx 23rpx;
		margin: 0 30rpx;
		background: #F6F6F6;
		border-radius: 8rpx;
		font-size: 24rpx;
		display: -webkit-box;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		/*垂直居中*/
		-webkit-box-align: center;
		/*旧版本*/
		-moz-box-align: center;
		/*旧版本*/
		-ms-flex-align: center;
		/*混合版本*/
		-webkit-align-items: center;
		/*新版本*/
		align-items: center;
		/*新版本*/
		.name {
			width: 148rpx;
			margin-right: 20rpx;
		}
		.info {
			flex: 1;
		}
		.map {
			text-align: center;
			padding-left: 40rpx;
			position: relative;
			&::before {
				content: '';
				display: inline-block;
				width: 2rpx;
				height: 42rpx;
				background-color: #DDDDDD;
				position: absolute;
				left: 0;
				top: 18rpx;
			}
			.iconfont {
				color: var(--view-theme);
			}
			.map_text {
				color: var(--view-theme);
			}
		}
	}
	.settlementAgreement {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 40;
	}
	::v-deep.settlementAgreement .setAgCount {
		background: #fff;
		width: 656rpx;
		height: 458px;
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 12rpx;
		-webkit-border-radius: 12rpx;
		padding: 52rpx;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		overflow: hidden;
		.content {
			height: 900rpx;
			overflow-y: scroll;
			p {
				font-size: 13px;
				line-height: 22px;
			}
			img {
				max-width: 100%;
			}
		}
	}
	.settlementAgreement .setAgCount .icon {
		font-size: 42rpx;
		color: #b4b1b4;
		position: absolute;
		top: 15rpx;
		right: 15rpx;
	}
	.settlementAgreement .setAgCount .title {
		color: #333;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
	}
	.settlementAgreement .setAgCount .content {
		margin-top: 32rpx;
		color: #333;
		font-size: 26rpx;
		line-height: 22px;
		text-align: justify;
		text-justify: distribute-all-lines;
		height: 756rpx;
		overflow-y: scroll;
	}
	.br16 {
		border-radius: 16rpx;
	}
	.take-content{
		padding: 0 32rpx 44rpx 32rpx;
		.take-title{
			font-size: 28rpx;
			color: #111111;
			line-height: 40rpx;
		}
		.take-store{
			width: 32rpx;
			height: 32rpx;
			margin-right: 6rpx;
		}
		.take-txt{
			font-size: 28rpx;
			color: #A5A5A5;
		}
		.icon-chakanditu{
			font-size: 36rpx;
			margin-right: 4rpx;
		}
	}
	.mt16{
		margin-top: 16rpx;
	}
	.mt24{
		margin-top: 24rpx;
	}
</style>
