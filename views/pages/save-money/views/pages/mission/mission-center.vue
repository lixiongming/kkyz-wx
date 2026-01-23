<template>
	<c-main class="bg-c9">
		<!-- 头部背景 -->
		<image mode="aspectFill" class="matrix-bg" :src="$imgUrl('/images/save-money/video-matrix-bg1.png')"></image>
		<!-- 头部模块 -->
		<!-- #ifdef APP-PLUS -->
		<c-header title="" bg_color="transparent" :show_share="true" :extra_warp_styles="{ zIndex: 3 }"></c-header>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<c-header title="" bg_color="transparent" :extra_warp_styles="{ zIndex: 3 }"></c-header>
		<!-- #endif -->
		<!-- 内容模块 -->
		<scroll-view :scroll-y="true" :show-scrollbar="false" :style="{height: hei - 76 + 'px'}">
			<view class="warp flex jc-ct flex-ac">
				<image mode="aspectFill" class="mission-center-bg" :src="$imgUrl('/images/save-money/mission-center-icon1.png')"></image>
				<view class="content" :style="{ background: `url(${$imgUrl('/images/save-money/mission-center-bg1.png')}) no-repeat center center / cover`}">
					<image mode="aspectFill" class="mission-center-title" :src="$imgUrl('/images/save-money/mission-center-title1.png')"></image>
					<view class="task-operate">
						<view class="task-item">
							<image mode="aspectFill" class="mission-center-no1" :src="$imgUrl('/images/save-money/mission-center-buy.png')"></image>
							<view class="task-info download-order flex flex-ac jc-sb">
								<view class="store_info">前往<text class="store_name nowrap">{{task_info.name}}</text>下单</view>
								<view class="execute-btn" @click="storeCreateOrder">进店下单</view>
							</view>
						</view>
						<view class="task-item">
							<image mode="aspectFill" class="mission-center-no2" :src="$imgUrl('/images/save-money/mission-center-order.png')"></image>
							<view class="task-info order-num">
								<view class="tip-head">购买商品的订单号</view>
								<input 
								class="order-input" 
								type="text" 
								placeholder-class="input-tip" 
								placeholder="请输入或粘贴订单号"
								v-model="order_id"
								@input="orderInputValue" />
								<view class="sumbit-btn" @click="sumbitClick">确认提交</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="tip-box">
				<view>温馨提示：</view>
				<view>1.进入橱窗仅需要购买一个商品；</view>
				<view>2.下单后，请立即复制该订单编号，粘贴到下方。</view>
				<view>【该订单编号复制到其他任务窗口无效】</view>
			</view>
		</scroll-view>
	</c-main>

	<!-- 保存店铺二维码 -->
	<!-- #ifdef APP-PLUS -->
	<custom-popup ref="popup_store_qrcode" title="店铺二维码" @onConfirm="storePopupConfirm" button_text="保存图片去微信打开" :click_confirm_close="false">
	<!-- #endif -->
	<!-- #ifdef H5 || MP-WEIXIN -->
	<custom-popup ref="popup_store_qrcode" title="店铺二维码" :show_button="false" :click_confirm_close="false">
	<!-- #endif -->
		<view class="store-content flex flex-column flex-ac">
			<image mode="aspectFill" class="store-qrcode" :src="task_info.image"></image>
			<!-- #ifdef APP-PLUS -->
			<view class="store-tip">微信扫码店铺二维码进店购物</view>
			<!-- #endif -->
			<!-- #ifdef H5 || MP-WEIXIN  -->
			<view class="store-tip">长按识别二维码</view>
			<!-- #endif -->
		</view>
	</custom-popup>

	<!-- 温馨提示 -->
	<c-modal 
		ref="order_tip_modal" 
		title="温馨提示" 
		content="确认提交该订单编号？" 
		@confirm="sumbitOrderConfirm"
		@close="sumbitOrderClose"
		contentClass="content-center"
		:confirmBtnStyles="confirm_btn_styles"
	>
	</c-modal>
</template>


<script setup lang="ts">
	import { ref, onMounted, getCurrentInstance, nextTick } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide, onUnload } from "@dcloudio/uni-app";
	// 使用主store模块
	import uerStore from "@/business/store/index";
	// 使用自定义pupop弹窗组件
	import customPopup from '@/views/pages/save-money/views/components/custom-popup.vue'
	// 引入图片保存等相关执行
	import { downloadImageSaveAlbum } from "/views/pages/save-money/infrastructure/utils/preload-image"
	// 使用mission模块store
	import mission_use_store from '/views/pages/save-money/store/modules/mission.ts'

	// 生成对应的store实例
	const store = uerStore();
	const mission_store = mission_use_store();
	const hei = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().safeAreaInsets.bottom;

	// 店铺二维码弹窗
	const popup_store_qrcode = ref();
	// 提交订单提示
	const order_tip_modal = ref();
	//提交订单提示确认按钮样式
	const confirm_btn_styles = `background: linear-gradient(90deg, #FF3221, #FFA32A);`
	// 防止重复点击提交状态
	const is_loading = ref(false);
	// 订单id
	const order_id = ref('');
	// 页面数据信息
	const task_info = ref({});
	// 旧的输入内容
	let old_input_content = ref('');

	onShow(() => {
		// 获取页面数据
		getTaskInfo();
		
	})

	onUnload(() => {
		// 离开页面，关闭弹窗
		storePopupClose();
	})

	onHide(() => {
		// 离开页面，关闭弹窗
		storePopupClose();
	})

	// 获取相关任务信息
	function getTaskInfo() {
		// 添加try...catch防止JSON格式转换报错
		try {
			// 获取缓存数据
			let cache_data = uni.getStorageSync('expert_task_info');
			// 存在缓存数据，则格式化
			cache_data && (cache_data = JSON.parse(cache_data))
			console.log("cache_data", cache_data)
			// 设置页面数据
			task_info.value = cache_data
		} catch (e) {
			console.log("e", e)
		}
	}

	// 订单输入监听事件
	function orderInputValue(e) {
		// 字符、数字正则
		let reg = /^[A-Za-z0-9]+$/;
		let value = e.detail?.value;
		if (!value) {
			// 内容为空赋值
			old_input_content.value = '';
			order_id.value = '';
		} else if (reg.test(value)) {
			// 通过正则校验赋值
			old_input_content.value = value;
			order_id.value = value;
		} else {
			// 页面更新后立即更新数据
			nextTick(() => {
				// 赋值旧值
				order_id.value = old_input_content.value;
			})
		}

	}

	// 进店下单
	function storeCreateOrder() {
		// 打开店铺二维码
		storePopupOpen();
	}

	// 店铺二维码弹窗打开
	function storePopupOpen() {
		popup_store_qrcode.value.open();
	}

	// 店铺二维码弹窗关闭
	function storePopupClose() {
		popup_store_qrcode.value.close();
	}

	// 店铺二维码弹窗确认回调
	async function storePopupConfirm() {
		try {
			if (is_loading.value) return;
			// 点击进行中
			is_loading.value = true;
			// #ifdef APP-PLUS
			// 二维码下载保存到相册
			await downloadImageSaveAlbum(task_info.value.image, storePopupClose)
			// #endif
			// #ifdef H5
			uni.showToast({
				title: "保存成功",
				icon: "success"
			})
			storePopupClose();
			// #endif
			// 点击完成
			is_loading.value = false;
		} catch (e) {
			// 点击完成
			is_loading.value = false;
		}
		
	}


	// 提交订单提示弹窗打开
	function sumbitOrderTipPopupOpen() {
		order_tip_modal.value.open();
	}

	// 提交订单提示弹窗确认回调
	async function sumbitOrderConfirm() {
		// 关闭弹窗
		sumbitOrderClose();
		// 提交数据
		await mission_store.expertSubmitOrder({ order_id: order_id.value, id: task_info.value.id });
		// 提示完成
		uni.showToast({
            title: '提交成功',
            icon:'success',
        })
		// 清除缓存数据
		uni.removeStorageSync('expert_task_info');
		let handle_time = setTimeout(() => {
			if (handle_time) {
				clearTimeout(handle_time);
                handle_time = null;
                // 返回上一页
                back();
			}
		}, 2000);
	}

	// 提交订单提示弹窗取消回调
	function sumbitOrderClose() {
		order_tip_modal.value.close();
	}

	// 提交按钮回调
	function sumbitClick() {
		// 数据校验
		let flag = checkSumbitData();
		if (!flag) return;
		sumbitOrderTipPopupOpen();
	}

	// 提交数据校验
	function checkSumbitData() {
		if (!order_id.value) {
			uni.showToast({
				title: '输入或粘贴订单号',
				icon: 'none',
			})
			return false;
		};
		return true;
	}

	// 返回上一页
	function back() {
		uni.navigateBack();
	}
</script>


<style lang="less" scoped>
	.matrix-bg {
	    position: absolute;
	    top: 0;
	    left: 0;
	    height: 648rpx;
	    width: 750rpx;
	}
	
	.warp{
		width: 750rpx;
		padding: 72rpx 32rpx 0;
		position: relative;
		.mission-center-bg {
			position: absolute;
			top: -24rpx;
			right: 32rpx;
			width: 288rpx;
			height: 288rpx;
			z-index: 2;
		}
		.content{
			width: 686rpx;
			height: 980rpx;
			position: relative;
			padding: 40rpx;
			z-index: 1;
			.mission-center-title {
				position: absolute;
				top: 80rpx;
				left: 40rpx;
				width: 184rpx;
				height: 56rpx;
			}
			.task-operate {
				margin-top: 200rpx;
				.task-item {
					margin-bottom: 48rpx;
					.mission-center-no1, .mission-center-no2 {
						height: 36rpx;
						margin-bottom: 24rpx;
					}
					.mission-center-no1 {
						width: 200rpx;
					}
					.mission-center-no2 {
						width: 228rpx;
					}
					.task-info {
						background: linear-gradient(90deg, #ff2c2c0a 0%, #ff2c2c1a 100%);
						border-radius: 24rpx;
						&.download-order {
							height: 128rpx;
							padding: 0 32rpx;
							.store_info {
								color: #571f01;
								font-size: 28rpx;
								font-weight: 600;
								.store_name {
									color: #ff545a;
									font-size: 28rpx;
									font-weight: 600;
									padding: 0 8rpx;
									display: inline-block;
									max-width: 220rpx;
									vertical-align: bottom;
								}
							}
							.execute-btn {
								width: 136rpx;
								height: 64rpx;
								line-height: 64rpx;
								text-align: center;
								color: #FFF;
								font-size: 24rpx;
								font-weight: 500;
								border-radius: 24rpx;
								background: linear-gradient(103deg, #FF3221 9.59%, #FFA32A 90.7%);
							}
						}
						&.order-num {
							padding: 36rpx 32rpx;
							.tip-head {
								color: #571f01;
								font-size: 24rpx;
								font-weight: 400;
								margin-bottom: 26rpx;
							}
							.order-input {
								margin-bottom: 26rpx;
								background: #FFF;
								height: 80rpx;
								border-radius: 24rpx;
								padding: 0 24rpx;
								
							}
							/deep/.input-tip {
								color: #aaaaaa;
								font-size: 28rpx;
								font-weight: 400;
							}
							.sumbit-btn {
								line-height: 80rpx;
								text-align: center;
								color: #ffffff;
								font-size: 28rpx;
								font-weight: 600;
								border-radius: 24rpx;
								background: linear-gradient(103deg, #FF3221 9.59%, #FFA32A 90.7%);
							}
						}
					}
				}
			}
		}
	}
	.store-content {
		.store-qrcode {
			width: 332rpx;
			height: 332rpx;
		}
		.store-tip {
			margin-top: 32rpx;
			color: #111111;
			font-size: 24rpx;
			font-weight: 400;
		}
	}
	.tip-box {
		margin: 32rpx 32rpx 0;
		color: #FF3221;
		font-size: 24rpx;
		padding-bottom: 20rpx;
	}
</style>