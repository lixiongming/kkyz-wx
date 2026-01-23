<template>
	<view class="container">
		<!-- 图片展示部分 -->
		<view class="container_qualifications" v-if="url_list.length">
			<view class="container_qualifications_title">
				<span class="margin_r">{{store_data.storeName}}</span>
				<span>网店经营者资质信息</span>
			</view>
			<view class="image_list">
				<!-- <view v-for="(item, index) in url_list" :key="index"><image :src="item" mode="widthFix"></image></view> -->
				<!-- <jyf-parser :domain='domain' :html="content" ref="article" :tag-style="tag_style"></jyf-parser> -->
				<!-- 替代jyf-parser组件 -->
				<view v-html="content"></view>
				<!-- <uv-parse
					:content="content"
					:tag_style="tag_style"
				></uv-parse> -->
			</view>
			<view class="bottom_tip">
				注：以上信息，由商家依据《电子商务法》规定发布公示。如需进一步核实，可联系商家客服咨询。
			</view>
		</view>
		<!-- 输入验证码部分 -->
		<view class="container_vercode" v-else>
			<view class="container_vercode_title"><text>输入验证码查看证件信息</text></view>
			<view class="container_vercode_content" >
				<view class="container_vercode_content_heightfix" >
					<view class="container_vercode_content_input">
						<input type="text" v-model="ver_code_value" placeholder="请输入验证码">
					</view>
					<!-- <view class="container_vercode_content_vercode" @click="getVerCodeImage" :style="{'background-image': `url(${captcha_data.captcha})`}"> -->
					<view class="container_vercode_content_vercode" @click="getVerCodeImage">
						<image :src="captcha_data.captcha" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="container_vercode_button"><view class="button" @click="submitCaptChaData">确定</view></view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { onLoad, onShow, onReady, onInit, onHide, onUnload } from "@dcloudio/uni-app";
import { getMerchantCaptcha, getMerchantMerCertificate } from '@/business/api/modules/store.ts';
import { navigateTo, Toast, setStorage } from '/infrastructure/libs/uniApi.js';
// import parser from "@/components/jyf-parser/jyf-parser";
import { HTTP_REQUEST_URL } from '/infrastructure/config/app';
const store_data = ref({})
const captcha_data = ref({})
const ver_code_value = ref('')
const url_list = ref([])
const tag_style = ref({
     img: 'width:676rpx;display:block;'
})
const content = ref('')
const domain = ref(HTTP_REQUEST_URL)

onLoad((opt) => {
	store_data.value = opt;
	getVerCodeImage();
})

// 发送图片验证码，并请求资质图片列表
function submitCaptChaData() {
	if(ver_code_value.value) {
		getMerchantMerCertificate({mer_id: store_data.value.mer_id, key: captcha_data.value.key, code: ver_code_value.value}).then(res => {
		    url_list.value = res.data;
		    let img_tap = '';
		    url_list.value.forEach(item => {
		    	img_tap+=set_img_tap(item);
		    })
		    content.value = `<div>${img_tap}</div>`;
		    console.log(content.value);
		}).catch(rej => {
			Toast(rej);
			getVerCodeImage();
			ver_code_value.value = '';
		})
	} else {
		Toast('请输入验证码');
	}
}
// 
function set_img_tap(url) {
	return `<img style="width:auto;height:auto;max-width:100%;margin-bottom:15px" src="${url}"></img>`
}
// 获取图片验证码
function getVerCodeImage() {
	getMerchantCaptcha().then(res => {
    	captcha_data.value = res.data;
	});
}
</script>

<style lang="scss" scoped>
.container_vercode {
	&_title {
		text-align: center;
		padding: 30px 0;
	}
	&_content {
		width: 70%;
		height: 40px;
		margin: auto;
		margin-bottom: 20px;
		&_heightfix {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 4px;
			overflow: hidden;
			border: 1px solid rgba(0, 0, 0, 0.1);
			max-height: 34px;
		}
		
		&_input {
			flex: 1;
			box-sizing: border-box;
			input {
				font-size: 12px;
				padding: 0 20px;
			}
		}
		&_vercode {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				display: block;
				width: 100%;
			}
		}
	}
	&_button {
		.button {
			margin: auto;
			width: 70%;
			background: #e93323 !important;
			border-radius: 4px;
			padding: 12px;
			text-align: center;
			color: #fff;
			font-size: 12px;
		}
	}
}
.container_qualifications {
	&_title {
		padding: 10px;
		text-align: center;
		span:nth-child(1) {
			font-weight: bold;
		}
	}
	.image_list {
		view {
			width: 90%;
			margin: auto;
			image {
				width: 100%;
			}
		}
	}
	.bottom_tip {
		padding: 10px 0;
		width: 90%;
		margin: auto;
		line-height: 20px;
	}
}
.margin_r {
	margin-right: 8px;
}
</style>
