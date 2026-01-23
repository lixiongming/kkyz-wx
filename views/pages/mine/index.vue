<template>
	<view class="mine" :style="{
		height: window_height + 'px',
		overflow: 'hidden'
	}">
		<view 
			class="head-title" 
			:style="{
			height: status_barHeight + 44 + 'px',
			paddingTop: status_barHeight + 'px',
			}"
		>
			<view class="title-txt">
				<text class="txt-cs">我的</text>
			</view>
		</view>
		<image :src="imgUrlEvent('/images/wx-applet/mine/mine-bg.png','aliyunImgUrl')" alt="" class="header_bg"></image>
		<scroll-view :scroll-y="true" :style="{
			height: (window_height - status_barHeight - 44) + 'px',
			background: '#FBFBFB',
		}">
			<view class="header">
				
				<view class="vessel flex flex-ac">
					<view class="picture" @click="goLogin">
						<image :src="my_info.avatar || imgUrlEvent('/images/mine/profile.png', 'aliyunImgUrl')" alt="" class="picture_img"></image>
					</view>
					<view class="info flex flex-column flex-1">
						<view class="flex flex-ac " v-if="is_login && my_info.nickname">
                           	<text class="name flex flex-ac  jc-sb" @click.stop="goLogin" >{{ my_info.nickname }}</text>
							<image mode="aspectFill" class="vip-image" v-if="my_info.member_level!=0"  :src="imgUrlEvent(getVipImg(my_info.member_level),'aliyunImgUrl')" ></image>
						</view>
						<text class="name flex flex-ac flex-1 jc-sb" v-else @click="goLogin">登录/注册</text>
						<text class="condition ellipsis" @click.stop="goLogin">ID: {{ my_info.mall_uid || "--"}}</text>
					</view>
					<!-- #ifdef MP -->
					<view class="logout-btn flex flex-ac jc-ct" v-if="is_login && my_info.nickname" @click="clickLogout"><text class="logout-text">退出登录</text></view>
					<!-- #endif -->
				</view>
			</view>

			<!-- 收益明细 -->
			<view class="ticket-info">
				<image mode="aspectFill" class="ticket-bg" :src="imgUrlEvent('/images/wx-applet/mine/ticket-bg.png', 'aliyunImgUrl')"></image>
				<view class="ticket-box">
					<view class="withdrawable-box flex flex-ac jc-sb">
						<view class="statistics-box">
							<view class="statistics-title">可提现兑换券(张)</view>
							<view class="statistics-num">{{ ticket_info.out_ticket_num }}</view>
						</view>
						<view class="download-btn">
							<button class="reset-btn" open-type="contact" :session-from="session_from.download" hover-class="none">下载APP</button>
						</view>
					</view>
					<view class="details-box flex flex-ac jc-sb" @click="toIncomeRecord">
						<text class="details-text">收益明细</text>
						<uni-icons color="#fff" type="right" size="12"></uni-icons>
					</view>
					<view class="statistics-wrap flex jc-sb">
						<view class="statistics-box">
							<view class="statistics-title">预期收益(张)</view>
							<view class="statistics-num">{{ ticket_info.sum_expect_ticket }}</view>
						</view>
						<view class="statistics-box">
							<view class="statistics-title">累计收益(张)</view>
							<view class="statistics-num">{{ ticket_info.total_ticket }}</view>
						</view>
						<view class="statistics-box">
							<view class="statistics-title">米粒收益</view>
							<view class="statistics-num">{{ ticket_info.brokerage_sum }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 订单状态 -->
			<view class="order" v-if="menus">
				<view class="order-box">
					<view class="flex flex-ac jc-sb">
						<text class="order-box-name">我的订单</text>
						<view class="flex flex-ac jc-ct" @click="topage('order',0)">
							<text class="order-box-all">全部订单</text>
							<!-- <image :src="imgUrlEvent('/images/mine/personal-arrows.png')" alt=""
								class="order-box-arrows"></image> -->
							<uni-icons color="#A5A5A5" type="right" size="12"></uni-icons>
						</view>
					</view>
					<view class="order-vessel flex flex-ac jc-sb">
						<view class="flex flex-ac flex-column" v-for="(item,index) in orders" :key="index"
							@click="topage('order',index + 1)">
							<view class="order-vessel-nape relative flex flex-ac jc-ct">
								<image :src="item.img" alt="" class="order-img"></image>
								<text class="order-status-num flex flex-ac jc-ct" v-if="item.num > 0">{{ item.num }}</text>
							</view>
							<text class="order-name">{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 带货达人 -->
			<view class="sell-goods">
				<image class="sell-goods-img" :src="imgUrlEvent('/images/wx-applet/intelligent/sell-goods.png', 'aliyunImgUrl')" @click="sellGoods"></image>
			</view>

			<!-- 我的服务 -->
			<view class="service" v-if="menus">
				<view class="service-box">
					<view>
						<text class="order-box-title">我的服务</text>
					</view>
					<view class="service-vessel flex flex-ac flex-wrap">
						<template  v-for="(item,index) in menus"
							:key="index">
							<template v-if="item.name == '分享小程序'">
								<view class="service-nape flex flex-ac flex-column" 
									@click="toAuth(item.url)" :class="(index + 1) % 5 == 0? 'last' : ''" v-if="!is_login">
									<image :src="item.img" alt="" class="service-img"></image>
									<text class="service-name">{{ item.name }}</text>
								</view>
								<button 
									v-else
									class="reset-btn service-nape flex flex-ac flex-column" 
									:class="(index + 1) % 5 == 0? 'last' : ''"
									open-type="share"
									hover-class="none"
									>
									<image :src="item.img" alt="" class="service-img"></image>
									<text class="service-name">{{ item.name }}</text>
								</button>
							</template>
							<template v-else-if="item.name == '分享素材'">
								<button 
									class="reset-btn service-nape flex flex-ac flex-column" 
									:class="(index + 1) % 5 == 0? 'last' : ''"
									open-type="contact"
									:session-from="session_from.share"
									hover-class="none"
									>
									<image :src="item.img" alt="" class="service-img"></image>
									<text class="service-name">{{ item.name }}</text>
								</button>
							</template>
							<view class="service-nape flex flex-ac flex-column" 
								 @click="toAuth(item.url)" :class="(index + 1) % 5 == 0? 'last' : ''" v-else>
								<image :src="item.img" alt="" class="service-img"></image>
								<text class="service-name">{{ item.name }}</text>
							</view>
						</template>
					</view>
				</view>
			</view>

			<image mode="aspectFill" class="advert-icon" :src="imgUrlEvent('/images/wx-applet/mine/advert-icon.png', 'aliyunImgUrl')" @click="toSpread"></image>
			<button class="reset-btn" open-type="contact" :session-from="session_from.download" hover-class="none">
				<image mode="aspectFill" class="download-app-icon" :src="imgUrlEvent('/images/wx-applet/spread/download-app-icon.png', 'aliyunImgUrl')"></image>
			</button>
		</scroll-view>
	</view>

	<!-- 退出提示框 -->
	<Imodal
		ref="logout_dialog"
		content="确认退出账号吗？"
		@close="logoutClose"
		@confirm="logoutConfirm"
	></Imodal>

	<g-login-modal ref="login_modal"  @loginCallback="_onShow"></g-login-modal>
</template>

<script setup lang="ts">
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
	import uerStore from "@/business/store/modules/mine";
	import { onShow, onShareAppMessage } from "@dcloudio/uni-app";
	import { ref } from "vue";
	import { mineApi } from "@/business/api/index.ts";
	import Imodal from "@/views/components/i-modal.vue";
	import { getOrderNoReadApi } from '@/business/api/modules/order';
	import { getTicketTotalApi, getExpectTicketApi } from '@/business/api/modules/api-new';
	import { getTabBarRoutes } from '@/infrastructure/utils/tabbar';
	import mainStore from "@/business/store/index.ts";
	import { checkTokenEventAst } from "/infrastructure/utils/util";
	import { getSatisfyConditionApi } from '@/business/api/modules/intelligent';
	const mainstore = mainStore();
	const store = uerStore();
	const window_height = uni.getSystemInfoSync().windowHeight;
	const status_barHeight = uni.getSystemInfoSync().statusBarHeight;
	const my_info = ref({});
	const is_ios = ref(false);
	is_ios.value = uni.getSystemInfoSync().platform == "ios";
	const loading = ref(false);
	const logout_dialog = ref();
	const orders = ref([{
			key: 'obligation_num',
			name: '待付款',
			img: imgUrlEvent('/images/wx-applet/mine/order-icon1.png', 'aliyunImgUrl'),
			num: 0
		},
		{
			key: 'to_be_shipped_num',
			name: '待发货',
			img: imgUrlEvent('/images/wx-applet/mine/order-icon2.png', 'aliyunImgUrl'),
			num: 0
		},
		{
			key: 'wait_for_receiving_num',
			name: '待收货',
			img: imgUrlEvent('/images/wx-applet/mine/order-icon3.png', 'aliyunImgUrl'),
			num: 0
		},
		{
			key: 'remain_to_be_evaluated_num',
			name: '待评价',
			img: imgUrlEvent('/images/wx-applet/mine/order-icon4.png', 'aliyunImgUrl'),
			num: 0
		},
		{
			key: 'after_sale_num',
			name: '售后/退款',
			img: imgUrlEvent('/images/wx-applet/mine/order-icon5.png', 'aliyunImgUrl'),
			num: 0
		}
	]);
	const menus= ref([
		{
			name: '官方客服',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu1.png', 'aliyunImgUrl'),
			url: '/pagesMine/customer-service/index'
		},
		{
			name: '关注店铺',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu2.png', 'aliyunImgUrl'),
			url: '/pagesMine/follow-store/index'
		},
		{
			name: '我的收藏',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu3.png', 'aliyunImgUrl'),
			url: '/pagesMine/user-goods-collection/index'
		},
		{
			name: '实名认证',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu9.png', 'aliyunImgUrl'),
			url: '/pagesMine/user-certificate/index'
		},
		{
			name: '地址管理',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu4.png', 'aliyunImgUrl'),
			url: '/pagesMine/user-address-list/index'
		},
		{
			name: '问题反馈',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu5.png', 'aliyunImgUrl'),
			url: '/pagesMine/feedback/index'
		},
		{
			name: '分享小程序',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu6.png', 'aliyunImgUrl'),
			url: ''
		},
		{
			name: '直播',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu7.png', 'aliyunImgUrl'),
			url: '/pages/index/index'
		},
		{
			name: '分享素材',
			img: imgUrlEvent('/images/wx-applet/mine/mine-menu8.png', 'aliyunImgUrl'),
			url: 'share-materials'
		},
		{
			name: '全民带货',
			img: imgUrlEvent('/images/wx-applet/mine/mine-commerce.png', 'aliyunImgUrl'),
			url: '/views/pages/good/index'
		}
	])

	const code = ref();

	const ticket_info = ref({
		out_ticket_num: '0.00',
		total_ticket: '0.00',
		user_extract: '0.00',
		sum_expect_ticket: '0.00',
		brokerage_sum: '0.00',
	})
	const session_from = ref({
		download: '',
		share: ''
	})
	const share_mer_info = ref({});
	const is_login = ref(false);
	let parent_mer_id = ''
	const login_modal = ref()

	onShareAppMessage((res) => {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log("触发分享", res.target)
		}
		let invite_code = uni.getStorageSync('userInfo').user_code || ''
		// 如果存在分享mer_id，则分享mer_id优先
		let cur_mer_id = uni.getStorageSync('parent_mer_id')
		parent_mer_id = mainstore.is_from_share && cur_mer_id ? cur_mer_id : ''
		return {
			title: '为您推荐店铺',
			imageUrl: share_mer_info.value.mer_avatar,
			path: `/views/pages/home/index?mer_id=${parent_mer_id || share_mer_info.value.mer_id}&invite_code=${invite_code}`,
		}
	})



	// onShow函数
	async function _onShow() {

		is_login.value = await checkTokenEventAst()
		if (is_login.value) {
			getUserMyInfoFn();
			getOrderNoRead();
			getTicketTotal();
			getExpectTicket();
		} else {
			// 清空数据
			orders.value.forEach(v => {
				v.num = 0
			})
			ticket_info.value = {
				out_ticket_num: '0.00',
				total_ticket: '0.00',
				user_extract: '0.00',
				brokerage_sum: '0.00',
				sum_expect_ticket: '0.00',
			}
		}
		getShareMerchantInfo();
		getSatisfyCondition();
	}

	onShow(_onShow);



	function getUserMyInfoFn() {
		mineApi
			.getUserMyInfoApi()
			.then(({ data }) => {
				my_info.value = data;
			})
			.catch(() => { });
	}

	const topage = (data, index) => {
		if (isLoginEvent()) return;
		let url = "";
		switch (data) {
			case "login":
				url = "/views/pages/mine/login";
				break;
			case "invite":
				url = "/views/pages/invite-friends/index";
				break;
			case "user":
				url = "/views/pages/mine/user-page";
				break;
			case "vermicelli":
				url = "/views/pages/mine/vermicelli-list";
				break;
			case "follow":
				url = "/views/pages/mine/follow-list";
				break;
			case "feedback_and_uggestions":
				url = "/views/pages/mine/pages/feedback_and_uggestions";
				break;
			case "user-follow":
				url = "/views/pages/mine/user-page?user_follow=true";
				break;
			case "order":
				if (index == 5) {
					url = "/pagesOrder/refund/list"
				} else {
					url = `/pagesOrder/order-list/index?status=${index}`;
				}
				break;
			case "my-purse":
				url = "/views/pages/mine/my-purse";
				break;
			case "N-detail":
				url = "/views/pages/mine/N-detail";
				break;
			case "material":
				url = "/views/pages/mine/material";
				break;
			case "center":
				url = "/views/pages/save-money/views/pages/member/index";
			break;
			default:
				return uni.showToast({
					icon: "none",
					title: "暂未开放，敬请期待",
					duration: 2000,
				});
		}
		if (!is_login.value) {
			url = "/views/pages/mine/login";
		}
		uni.navigateTo({
			url: url,
		});
	};

	// 是否登录
	const isLoginEvent = () => {
		if (!is_login.value) {
			login_modal.value.open()
			return true;
		}
	};

	
    // 获取会员图片
	const getVipImg=(level:number)=>{
      let vip
	  switch(level){
     case 3:
      vip = "/images/save-money/vip1.png";
      break;
     case 2:
      vip = "/images/save-money/vip3.png";
      break;
     case 1:
      vip = "/images/save-money/vip2.png";
      break;
	  }
	  return vip
	}


	async function logout() {
	if (loading.value) return;
	const middle_token = uni.getStorageSync("middle_token");
	loading.value = true;
	try {
		await store.logoutApi({ middle_token });
		// 提示修改成功
		uni.showToast({
		title: "退出成功",
		duration: 1000,
		});

		setTimeout(() => {
		loading.value = false;
		my_info.value = {}
		is_login.value = false;
		orders.value.forEach(v => {
			v.num = 0
		})
		ticket_info.value = {
			out_ticket_num: '0.00',
			total_ticket: '0.00',
			user_extract: '0.00',
			brokerage_sum: '0.00',
			sum_expect_ticket: '0.00',
		}
		}, 1000);
	} catch (e) {
		uni.showToast({
		title: "退出失败",
		icon: "error",
		duration: 1000,
		});
		loading.value = false;
	}
	}

	// 点击退出
	function clickLogout() {
		logout_dialog.value.open();
	}

	// 退出提示取消
	function logoutClose() {
		logout_dialog.value.close();
	}

	// 退出提示确认
	function logoutConfirm() {
		logoutClose();
		logout();
	}

	// 去推广
	function toSpread() {
		uni.navigateTo({ url: '/views/pages/spread/index' })
	}
	
	//带货
	function sellGoods(){
		// toAuth('/pageIntelligent/good/index')
		if(code.value==1 || code.value==2){
			toAuth('/views/pages/good/index')
		} else {
			toAuth('/pageIntelligent/sell-goods/list-management')
		}
	}

	//获取达人带货判定
	function getSatisfyCondition(){
		getSatisfyConditionApi().then(res=>{
			if(res.code==200){
				code.value = res.data.code;
			}
		})
	}


	// 菜单跳转
	function toAuth(url) {
		if (isLoginEvent()) return;
		let tabbar_routes = getTabBarRoutes()
		if (tabbar_routes.includes(url)) {
			uni.switchTab({ url })
			return;
		}
		if (url == '/views/pages/good/index' && code.value != 1 && code.value != 2) {
			// 全民带货已注册
			uni.navigateTo({ url: '/pageIntelligent/sell-goods/list-management' })
		} else if(url == '/views/pages/good/index' || code.value==1 || code.value==2){
			// 全民带货未注册
			uni.switchTab({ url })
		} else {
			uni.navigateTo({ url })
		}
	}

	// 收益明显
	function toIncomeRecord() {
		if (isLoginEvent()) return;
		uni.navigateTo({ url: '/pagesMine/income-record/index' })
	}

	// 获取订单未读消息统计
	function getOrderNoRead() {
		getOrderNoReadApi().then(res => {
			if (res.code == 200) {
				orders.value.forEach(v => {
					v.num = res.data[v.key]
				})
			}
		})
	}

	// 获取用户界面统计收益
	function getTicketTotal() {
		getTicketTotalApi().then(res => {
			if (res.code == 200) {
				ticket_info.value.out_ticket_num = res.data.out_ticket_num || '0.00';
				ticket_info.value.total_ticket = res.data.total_ticket || '0.00';
				ticket_info.value.user_extract = res.data.user_extract || '0.00';
				ticket_info.value.brokerage_sum = res.data.brokerage_sum || '0.00';
			}
		})
	}

	// 获取用户界面预期收益
	function getExpectTicket() {
		getExpectTicketApi().then(res => {
			if (res.code == 200) {
				ticket_info.value.sum_expect_ticket = res.data.sum_expect_ticket || '0.00';
			}
		})
	}

	// 获取分享商户信息
	function getShareMerchantInfo() {
		mineApi.getShareMerchantInfoApi().then(res => {
			if (res.code == 200) {
				console.log("info--->", res.data)
				share_mer_info.value = res.data;
				session_from.value.download = `{ "app_type": "${is_ios.value ? 'ios' : 'android'}", "source": "download" }`;
				session_from.value.share = `{ "app_type": "android", "source": "share", "id": "${share_mer_info.value.mer_id}" }`;
			}
		})
	}

	// 跳转登录页面
	function goLogin() {
		if (is_login.value) return;
		uni.navigateTo({ url: '/views/pages/mine/login' })
	}
</script>

<style lang="less" scoped>
   .vip-image{
	width: 24rpx;
	height: 24rpx;
	margin-left: 8rpx;
	flex-shrink: 0;
    }
   .member-box{
	position: relative;
	width: 686rpx;
	height: 112rpx;
    margin-left: 32rpx;
	margin-top: 24rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	.huiyuan_bck{
		position: absolute;
		top: 0rpx;
		width: 686rpx;
	    height: 112rpx;
	}
	.mine_text{
		width: 318rpx;
		margin-left: 112rpx;
	}
	.member-text{
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
		margin-left: 128rpx;
	}
	.member-btn{
		padding: 8rpx 16rpx;
		background: rgba(255, 106, 0, 0.8);
		border-radius: 12rpx;
		position: absolute;
		right: 32rpx;
       .member-btn-text{
		font-size: 24rpx;
		color: #fff;
	   }
	}
}
	.get-code {
		position: absolute;
		right: 40rpx;
		top: 26rpx;
		color: #1cdafe;
	}

	.Verification-code {
		position: relative;
	}

	.mine {
		position: relative;
		background: #fbfbfb;
		width: 750rpx;
	}

	/deep/ .uni-nav-bar-text.uni-ellipsis-1 {
		font-family: PingFangSC-Medium;
		font-weight: 500;
		font-size: 36rpx;
		color: #1e1f20;
		text-align: center;
		line-height: 48rpx;
	}

	.header {
		position: relative;
		width: 750rpx;
	}

	.header_bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 750rpx;
		height: 1798rpx;
	}

	.set_img {
		position: absolute;
		top: 108rpx;
		right: 32rpx;
		width: 48rpx;
		height: 48rpx;
		z-index: 99;
	}
	.vessel {
		padding: 40rpx 28rpx 20rpx;
		position: relative;
	}
	.logout-btn {
		// position: absolute;
		// right: 32rpx;
		// top: 160rpx;
		background: linear-gradient(to left, #FF182E, #FF9D21);
		border-radius: 12rpx;
		padding: 8rpx 16rpx;
		.logout-text {
			color: #fff;
			font-size: 24rpx;
		}
	}
	.picture {
		width: 124rpx;
		height: 124rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
		border: 2rpx solid #fff;
		flex-shrink: 0;
	}

	.picture_img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.info {
		width: 400rpx;
		margin-left: 20rpx;
	}

	.name {
		font-family: PingFangSC-Semibold;
		font-weight: 600;
		font-size: 28rpx;
		color: #000000;
		// width: 500rpx;
	}

	.condition {
		color: #888888;
		font-family: "PingFang SC";
		font-size: 20rpx;
		font-weight: 400;
		height: 28rpx;
		line-height: 28rpx;
		width: 500rpx;
		margin-top: 8rpx;
	}

	.record {
		padding: 40rpx 78rpx 0 78rpx;
	}

	.number {
		color: #111111;
		font-size: 32rpx;
		font-weight: 600;
		font-family: "D-DIN-PRO";
		height: 32rpx;
		line-height: 32rpx;
	}

	.praised {
		color: #888888;
		font-family: "PingFang SC";
		font-size: 22rpx;
		font-weight: 400;
		margin-top: 18rpx;
		height: 30rpx;
		line-height: 30rpx;
	}

	.order {
		width: 686rpx;
		height: 232rpx;
		border-radius: 16rpx;
		background: #ffffff;
		box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.02);
		margin-left: 32rpx;
		/* #ifdef H5 */
		margin: 0 auto;
		/* #endif */
		margin-top: 24rpx;
	}

	.order_hd {
		height: 88rpx;
		line-height: 88rpx;
		width: 686rpx;
		padding-left: 32rpx;
		padding-right: 24rpx;
	}

	.order_hd_title {
		color: #111111;
		font-family: "PingFang SC";
		color: #333333;
		font-size: 28rpx;
		font-weight: 600;
	}

	.order_hd_all {
		color: #888888;
		font-family: "PingFang SC";
		color: #969696;
		font-size: 22rpx;
		font-weight: 400;
	}

	.order_arrows {
		width: 24rpx;
		height: 24rpx;
	}

	.order_ft {
		padding: 12rpx 8rpx 0 8rpx;
	}

	.order_name {
		color: #888888;
		text-align: center;
		font-size: 22rpx;
		font-weight: 400;
		margin-top: 16rpx;
	}

	.order_img {
		width: 48rpx;
		height: 48rpx;
	}

	.order_vessel {
		padding: 0 32rpx 32rpx 32rpx;
	}

	.order_nape {
		width: 300rpx;
		height: 136rpx;
		flex-shrink: 0;
		border-radius: 16rpx;
		border: 1rpx solid #eee;
		padding-left: 16rpx;
		padding-right: 16rpx;
		position: relative;
	}

	.order_balance {
		color: #888888;
		font-family: "PingFang SC";
		font-size: 24rpx;
		font-weight: 400;
	}

	.order_balance_num {
		margin-top: 14rpx;
		color: #000000;
		font-family: "D-DIN-PRO";
		font-size: 32rpx;
		font-weight: 500;
		font-style: normal;
	}

	.order_balance_img {
		width: 80rpx;
		height: 80rpx;
	}

	.n_wrap {
		max-width: 268rpx;
		overflow: hidden;
	}

	.n_icon {
		position: absolute;
		right: 16rpx;
		top: 28rpx;
	}

	.operate {
		width: 686rpx;
		// height: 472rpx;
		flex-shrink: 0;
		border-radius: 16rpx;
		background: #fff;
		box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.02);
		margin-left: 32rpx;
		/* #ifdef H5 */
		margin: 0 auto;
		/* #endif */
		margin-top: 24rpx;
		padding:0rpx 20rpx;
		padding-top: 32rpx;
	}

	.operate_nape {
		width: 128rpx;

		// padding: 0 32rpx;
		margin-left: 32rpx;
		margin-bottom: 32rpx;

	}

	.operate_img {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 28rpx;
	}

	.operate_title {
		color: #111111;
		font-family: "PingFang SC";
		font-size: 26rpx;
		font-weight: 400;
		text-align: center;
	}

	.ai-entry {
		width: 150rpx;
		height: 150rpx;
		position: fixed;
		right: 0rpx;
		bottom: 80rpx;
		transition-property: left;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.ai-entry_item {
		width: 80%;
		height: 80%;
		// transform: scale(0.8);
	}

	.out_box {
		// margin: 0 32rpx;
		background: #fff;
		position: absolute;
		bottom: 180rpx;
		left: 32rpx;
		right: 32rpx;
		height: 104rpx;
		text-align: center;
		border-radius: 16rpx;
	}
	.out_btn {
		color: #ff4218;
		font-size: 28rpx;
		font-style: normal;
		font-weight: 500;
		line-height: 104rpx;
		text-align: center;
	}
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

.mine {
	.ticket-info {
		position: relative;
		margin: 20rpx auto;
		width: 694rpx;
		height: 316rpx;
		.ticket-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 694rpx;
			height: 316rpx;
		}
		.statistics-box {
			.statistics-title {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
			}
			.statistics-num {
				font-family: PingFangSC-Semibold;
				font-weight: 600;
				font-size: 26rpx;
				color: #FFFFFF;
			}
		}
		.ticket-box {
			position: relative;
			z-index: 2;
			width: 694rpx;
			height: 316rpx;
			padding: 24rpx 0;
			.withdrawable-box {
				.statistics-box {
					.statistics-num {
						font-size: 40rpx;
					}
				}
			}
			.download-btn {
				background: #FFFFFF;
				box-shadow: 0 12rpx 24rpx 0 #0f69d2e6;
				border-radius: 16rpx;
				padding: 16rpx 16rpx 14rpx;
				font-family: PingFangSC-Semibold;
				font-weight: 600;
				font-size: 24rpx;
				color: #1B9AFF;
			}
		}
		.withdrawable-box {
			padding: 0 40rpx;
		}
		.details-box {
			height: 60rpx;
			margin: 20rpx;
			padding: 0 16rpx 0 20rpx;
			background: #ffffff80;
			border-radius: 16rpx;
			.details-text {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
		.statistics-wrap {
			padding: 0 40rpx;
		}
		
	}

	.order {
		width: 694rpx;
		margin: 0 auto 16rpx;
		.order-box {
			width: 694rpx;
			height: 210rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			padding: 24rpx 20rpx 32rpx;

			.order-box-name {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 26rpx;
				color: #000000;
			}

			.order-box-all {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #A5A5A5;
			}

			.order-box-arrows {
				margin-left: 8rpx;
				width: 20rpx;
				height: 20rpx;
			}

			.order-img {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 12rpx;
			}
			
			.order-status-num{
				background-color: #64BAFF;
				color: #FFFFFF;
				border-radius: 200rpx;
				position: absolute;
				right: 16rpx;
				top: 20rpx;
				font-size: 24rpx;
				// min-width: 30rpx;
				height: 30rpx;
				line-height: 30rpx;
				padding: 0 8rpx;
				box-sizing: border-box;
				text-align: center;
				
			}

			.order-name {
				font-family: PingFangSC-Semibold;
				font-weight: 600;
				font-size: 24rpx;
				color: #000000;
				letter-spacing: 1.04rpx;
			}

			.order-vessel {
				padding: 0 8rpx;
				.order-vessel-nape{
					padding-top: 32rpx;
					width: 104rpx;
				}
			}
		}
	}

	.sell-goods{
		margin: 0 auto 16rpx;
		width: 694rpx;
		.sell-goods-img{
			width: 694rpx;
			height: 140rpx;
			border-radius: 20rpx;
		}
	}

	.service {
		// width: 750rpx;
		// padding: 0 28rpx;

		width: 694rpx;
		margin: 0 auto 16rpx;

		.service-box {
			width: 694rpx;
			// height: 596rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			padding: 24rpx 0 0;
			.order-box-title {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 26rpx;
				color: #000000;
				letter-spacing: 1.14rpx;
				margin-bottom: 16rpx;
				padding: 24rpx 0 0 24rpx;
			}

			.service-img {
				width: 48rpx;
				height: 48rpx;
			}

			.service-name {
				margin-top: 12rpx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #000000;
				line-height: 26rpx;
			}

			.service-vessel {
				padding: 32rpx 16rpx 0;
			}

			.service-nape {
				width: 132rpx;
				margin-bottom: 40rpx;
			}
			
			.last{
				margin-right: 0rpx;
			}
		}
	}

	.advert-icon {
		display: block;
		width: 694rpx;
		height: 140rpx;
		margin: 0 auto 20rpx;
	}

	.download-app-icon {
		display: block;
        width: 694rpx;
        height: 212rpx;
        margin: -4rpx auto;
        padding-bottom: 40rpx;
        box-sizing: content-box;
    }

	/* 1. 彻底重置默认外观 */
	.reset-btn {
		/* 去掉按钮默认外观 */
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		line-height: inherit;
		font-size: inherit;
		color: inherit;
		text-align: left;
		/* 保证点击区域继承父级大小 */
		width: 100%;
		display: flex;
	}
}
.code-popup-content {
	background-color: #fff;
	border-radius: 16px 16px 16px 16px;
	position: relative;
	margin-bottom: 40rpx;
	width: 640rpx;
	padding: 40rpx 0;
}
.m-content {
	text-align: center;
}
.m-content-text {
	text-align: center;
	font-size: 32rpx;
	font-style: normal;
	font-weight: 600;
	line-height: normal;
}
.code-wrap {
	margin-top: 60rpx;
}
.code_url {
	width: 240rpx;
}

.x_btn {
	position: relative;
	width: 68rpx;
	height: 68rpx;
	// bottom: -100rpx;
	left: 218rpx;
}
.share-url {
	color: #111;
}
.copy-btn {
	padding: 0 20rpx;
	line-height: 50rpx;
	text-align: center;
	color: #fff;
	background: #1cdafe;
	border-radius: 25rpx;
	font-size: 24rpx;
	margin-left: 20rpx;
}
</style>