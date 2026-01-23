<template>
	<c-main classs="bg-f8">
		<!-- 头部模块 -->
		<c-header title="橱窗地址" bg_color="transparent" :extra_warp_styles="{ paddingTop: statusHeight + 50 + 'px'}">
			<template v-slot:right>
				<view>
					<uni-icons type="help" color="#000" size="26" @click="explainClick"></uni-icons>
				</view>
			</template>
		</c-header>
		<!-- 内容模块 -->
		<view class="warp">
			<view class="video flex jc-sb flex-ac">
				<view class="name">视频号ID <text class="example" @click="examplePreview(0)">(示例)</text></view>
				<!-- :disabled="!is_allow_submit" -->
				<input class="uni-input" v-model="inputValue" placeholder-style="fontSize:28rpx;color:#cccccc;"
					placeholder="请输入视频号ID" />
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<view class="video account">
				<view class="flex jc-sb flex-ac ">
					<view class="name">带货ID</view>
					<input class="uni-input" v-model="inputValue1" placeholder-style="fontSize:28rpx;color:#cccccc;"
						placeholder="请输入带货ID" />
				</view>
				<view class="example">(没有就填写视频号ID)</view>
			</view>

			<view class="content">
				<view>
					<view class="address">视频号橱窗地址 <text class="example" @click="examplePreview(1)">(示例)</text></view>
				</view>
				<view>
					<image :src="imgUrl" mode="aspectFill" class="up-img" v-if="imgUrl" @click="setWindowAddressImage"></image>
					<view class="upload flex flex-ac jc-ct" @click="setWindowAddressImage" v-else>
						<image class="up-add" :src="$imgUrl('/images/save-money/upload.png')"></image>
					</view>
				</view>
				<!-- <view class="look-img" v-if="imgUrl" @click="previewImage">查看大图</view> -->
			</view>
			<!-- #endif -->
		</view>

		<view class="box flex flex-ac jc-ct">
			<!-- v-if="is_allow_submit" -->
			<view class="save flex flex-ac jc-ct" :style="{ opacity: uploading ? '0.6' : '1'}" @click="save">
				<text class="txt">保存</text>
			</view>
			<!-- <view v-else class="already-set">
				<text class="txt">已设置</text>
			</view> -->
		</view>
	</c-main>

	<!-- 提交提醒 -->
	<c-modal 
		ref="submit_tip_modal" 
		title="提示" 
		content="确认提交？" 
		@confirm="submitTipConfirmClick"
		@close="submitTipCloseClick"
		contentClass="content-center"
		:confirmBtnStyles="confirm_btn_styles"
		:mask_click="false"
		>
	</c-modal>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from "vue";
    import mission_use_store from '/views/pages/save-money/store/modules/mission.ts'
	import { fileUpload } from "@/views/pages/save-money/infrastructure/request/interceptor.js";
	import { onLoad, onShow, onReady, onInit, onHide, onUnload, onBackPress } from "@dcloudio/uni-app";
	import { imgUrlEvent } from "@/views/pages/save-money/infrastructure/utils/imgUrls.ts";
	import main_store from "@/business/store/index";
	const hei = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().safeAreaInsets.bottom;
	const statusHeight = uni.getSystemInfoSync().statusBarHeight;

	const header = {
		// #ifdef MP
		"Content-Type": "multipart/form-data",
		// #endif
		"Authorization": "Bearer " + uni.getStorageSync("token"),
	}
	
    const mission_store = mission_use_store();
	const store = main_store();
	const inputValue = ref();
	const inputValue1 = ref();
	const imgUrl = ref();
	// 提交提示确认按钮样式
	const confirm_btn_styles = `background: linear-gradient(to right, #FF3221, #FFA32A);`
	// 提交弹窗
	const submit_tip_modal = ref();
	// 根据获取的橱窗状态，是否显示提交按钮，是否能编辑
	// const is_allow_submit = ref(false);
	// 是否上传图片而离开页面
	let is_back_upload_img = false;
	// 示例图列表
	const example_imgs = [
        imgUrlEvent('/images/save-money/window-address-example1.png'),
        [imgUrlEvent('/images/save-money/window-address-example2-1.png'), imgUrlEvent('/images/save-money/window-address-example2-2.png')],
    ];
	// 上传图片状态
	const uploading = ref(false);


	onShow(() => {
		// 如果是上传图片而离开，则不重新获取橱窗信息
		if (is_back_upload_img) {
			is_back_upload_img = false;
			if (store.cropper_data.result_src) {
				// imgUrl.value = imgUrlEvent(store.cropper_data.result_src);
				store.cropper_data.result_src = '';
			}
			return;
		};
		// 获取橱窗信息
		getWechatShop();
	})

	onHide(() => {
		// 标记离开页面状态
		is_back_upload_img = true;
	})
	
	// 描述按钮点击
	function explainClick() {
	    // 查看描述信息
	    uni.navigateTo({
	        url: '/views/pages/save-money/views/pages/mine/agreement?type=8',
	    });
	}

	// 跳转裁剪图片
	function setWindowAddressImage() {
		if (imgUrl.value) {
			store.cropper_data.result_src = imgUrlEvent(imgUrl.value);
		}
		//打开图片剪切组件
		uni.navigateTo({
			url:
			"/views/pages/image-cropper/index?type=" +
			"common" +
			"&url=" +
			imgUrlEvent(imgUrl.value) +
			"&title=设置视频号橱窗地址",
			
		});
	}

	//上传图片
	const chooseAndUploadImage = () => {
		// if (!is_allow_submit.value) return;
		if (uploading.value) return;
		// 选择图片
		const action = uni.$config.baseURL + "api/post/uploadImage";
		uni.chooseImage({
			count: 1, // 默认9，设置图片的数量
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				uni.showLoading({
					title: "图片上传中..."
				});
				uploading.value = true;
				uni.uploadFile({
					url: action, // 仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'image',
					header: header,
					form_data: {},
					success: (res) => {
						const data = JSON.parse(res.data);
						if (data.code == 200) {
							imgUrl.value = data.data.image_url;
						} else {
							uni.showToast({
								title: data.message,
								icon: "none",
								duration: 2000
							});
						}
						uni.hideLoading();
						uploading.value = false;
					},
					fail: (uploadFileErr) => {
						uni.hideLoading();
						uni.showToast({
							title: err,
							icon: "none",
							duration: 2000
						});
						uploading.value = false;
					}
				});
			},
			fail: (chooseImageErr) => {
				console.error('choose image fail:', chooseImageErr);
			}
		});
	}

	const save = async() => {
		if (!inputValue.value) {
			uni.showToast({
				title: '请输入视频号ID',
				icon: 'none',
			})
			return;
		};
		// if (!inputValue1.value) {
		// 	uni.showToast({
		// 		title: '请输入带货ID',
		// 		icon: 'none',
		// 	})
		// 	return;
		// };
		// if (!imgUrl.value) {
		// 	uni.showToast({
		// 		title: '请上传视频号橱窗地址',
		// 		icon: 'none',
		// 	})
		// 	return;
		// };
		if (uploading.value) return;
		// 提交弹窗提示
		submit_tip_modal.value.open();
	}

	// 提交数据
	async function sumbitData() {
		// account_id: inputValue1.value,showcase_url: imgUrl.value
		const data = await mission_store.wechatShopAdd({video_id:inputValue.value});
		if(data.is_success){
			uni.showToast({
				title: '保存成功',
				icon: 'none',
			})
			setTimeout(()=>{
				uni.navigateBack();
			},1000)
		}
		console.log(data)
	}

	// 提交提示取消
	function submitTipCloseClick() {
		submit_tip_modal.value.close();
	}

	// 提交提示确认
	function submitTipConfirmClick() {
		submit_tip_modal.value.close();
		// 提交数据
		sumbitData();
	}

	// 获取橱窗地址信息
	async function getWechatShop() {
		await mission_store.getUserWechatShop();
		// 设置信息
        inputValue.value = mission_store.wechat_shop_info?.video_id;
		// inputValue1.value = mission_store.wechat_shop_info?.account_id;
		// imgUrl.value = mission_store.wechat_shop_info?.showcase_url;
		// 是否可以编辑页面
		// is_allow_submit.value = mission_store.wechat_shop_info?.audit_status != 1;
	}

	// 示例预览
	function examplePreview(index) {
		let key = 'window-address';
		let imgList = example_imgs.map((item => ({ type: 'image', url: item }))).splice(index, 1);
		if (index == 1) {
			// 由于图片太长，则将图片分成多张
			imgList = imgList.map((v => ({ ...v, urls: v.url })));
		}
		// 存储图片
		uni.setStorageSync(key, { imgList });
        // 跳转到示例图片预览页面
		uni.navigateTo({
			url: '/views/pages/save-money/views/pages/mission/preview?key=' + key + '&index=0' + '&isHasDel=false'
		})
    }

	// 预览橱窗地址图片
	function previewImage() {
        let key = 'window-address-img';
		let imgList = [{ type: 'image', url: imgUrl.value }];
		// 存储图片
		uni.setStorageSync(key, { imgList });
        // 跳转到示例图片预览页面
		uni.navigateTo({
			url: '/views/pages/publish/preview?key=' + key + '&index=0' + '&isHasDel=false'
		})
    }

</script>

<style lang="less" scoped>
	.warp {
		width: 750rpx;
		padding: 32rpx;

		.video {
			width: 686rpx;
			height: 104rpx;
			padding: 0 32rpx;
			flex-shrink: 0;
			border-radius: 16rpx;
			background: #FFFFFF;

			.name {
				color: #111111;
				font-size: 28rpx;
				font-weight: 500;
				.example {
					font-weight: 600;
					color: #FF545A;
					margin-left: 20rpx;
				}
			}

			.uni-input {
				text-align: right;
				width: 400rpx;
			}
		}
		.account{
			margin-top: 32rpx;
			padding: 24rpx 32rpx;
		    height: 140rpx;
			.example {
				font-weight: 600;
				color: #FF545A;
				margin-top: 8rpx;
			}
		}
	}

	.content {
		margin-top: 32rpx;
		width: 686rpx;
		// height: 424rpx;
		padding: 40rpx 32rpx;
		border-radius: 24rpx;
		background: #FFF;

		.address {
			color: #111111;
			font-size: 28rpx;
			font-weight: 500;
			.example {
				font-weight: 600;
				color: #FF545A;
				margin-left: 20rpx;
			}
		}

		.upload {
			margin-top: 48rpx;
			width: 256rpx;
			height: 256rpx;
			border-radius: 8rpx;
			border: 1px dashed #EEE;
			background: #FBFBFB;
		}

		.up-add {
			width: 48rpx;
			height: 48rpx;
		}

		.up-img {
			margin-top: 48rpx;
			width: 256rpx;
			height: 256rpx;
			border-radius: 8rpx;
		}
		.look-img {
			color: #979696;
			font-size: 24rpx;
			margin-top: 24rpx;
			text-align: center;
			width: 256rpx;
		}
	}

	.box {
		width: 750rpx;
		// #ifdef MP-WEIXIN
		margin-top: 200rpx;
		// #endif
		.save {
			width: 446rpx;
			height: 88rpx;
			border-radius: 24rpx;
			background: linear-gradient(to right, #FF3221, #FFA32A);

			.txt {
				color: #ffffff;
				font-size: 32rpx;
				font-weight: 600;
			}
		}
	}
</style>