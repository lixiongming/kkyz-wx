<template>
	<view style="background-color: #FAFAFA;">
	<view class="autonym">
		<view class="content-wrap"  :style="{ height: hei + 'px' }">
		<view class="hometext">
			<view class="userText">用户名：{{nickname}}</view>
			<view class="userText">手机号：{{phone}}</view>
			<view class="text_through" v-if="certificateData.status == 1">实名信息通过</view>
			<view class="text_through" v-if="certificateData.status != -1 && certificateData.status != 0 && certificateData.status != 1">请输入认证信息</view>
			<!-- <view class="text_through" v-if="certificateData.status != -1 && certificateData.status != 0 && certificateData.status != 1">上传身份证正面照可自动识别身份信息</view> -->
			<view class="text_through" v-show="isShow" v-if="certificateData.status == -1">审核拒绝，请重新提交信息</view>
			<view class="userText" v-if="certificateData.refuse_msg">拒绝原因：{{ certificateData.refuse_msg }}</view>
			<!-- <view class="userText" v-if="certificateData.status == 1">真实姓名：{{certificateData.name}}</view> -->
		</view>
		<form @submit="formSubmit" report-submit='true'>
			<!-- 审核中 -->
			<view class="user_examine" v-if="certificateData.status == 0">
				<view class="user_card">亲爱的{{nickname}} , 您的身份</view>
				<view class="examine">认证审核中</view>
				<view class="line"></view>
				<view class="user_card">我们会尽快审核，请您耐心等待...</view>
			</view>
			<!-- 已认证 -->
			<view class='personal-data' v-if="certificateData.status == 1">
				<view class='list'>
					<view class='item acea-row row-between-wrapper'>
						<view>真实姓名</view>
						<view class='input'>{{certificateData.name}}</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>性别</view>
						<view class='input'>
						{{certificateData.sex==1?'男':'女'}}
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>民族</view>
						<view class='input'>{{certificateData.nation}}</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>手机号</view>
						<view class='input'>{{certificateData.phone}}</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>身份证号</view>
						<view class='input'>{{certificateData.id_number}}</view>
					</view>
				</view>
				<view class='noCart' v-if="certificateData.status != -1 && certificateData.status != 0 && certificateData.status != 1">
					<view class='pictrue'>
						<view class="pictrueText">身份证正面照</view>
						<view class="pictrue-box">
							<image :src="certificateData.identity_card_front"></image>
						</view>
					</view>
					<view class='pictrue'>
						<view class="pictrueText">身份证反面照</view>
						<view class="pictrue-box">
							<image :src="certificateData.identity_card_reverse"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 未认证-->
			<view class='personal-data' v-if="certificateData.status != -1 && certificateData.status != 0 && certificateData.status != 1">
				<view class='list'>
					<view class='item acea-row row-between-wrapper'>
						<view>真实姓名</view>
						<view class='input'><input type='text' name='name' auto-focus v-model.trim='userInfo.name'
								placeholder="请输入真实姓名"></input></view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>性别</view>
						<radio-group  @change="radioChange">
							<label class="radio"><radio value="1" :checked="certificateData.sex==1" />男</label>
							<label class="radio"><radio value="2" :checked="certificateData.sex==2" />女</label>
					<!-- {{certificateData.sex==1?'女':'男'}} -->
						</radio-group>
					</view>
					<!-- <picker @change="bindPickerChange" :range="array">
						<view class='item acea-row row-between-wrapper'>
							<view>性别</view>
							<view class='input'><label class="">{{array[index]}}</label></view>
						</view>
					</picker> -->
					<view class='item acea-row row-between-wrapper'>
						<view>民族</view>
						<view class='input'><input type='text' name='nation' v-model.trim='userInfo.nation'
								placeholder="请输入民族"></input></view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>手机号验证码</view>
						<view class='relative input flex flex-ac code'>
							<input type='text' class="code-input" name='phone' v-model.trim='userInfo.code' maxlength="11" placeholder="请输入验证码"></input>
							<text class="get-code" @click.stop="handleVerify" v-if="!codeFlag">验证码</text>
                            <text class="get-code" v-else>{{ codeTime }}s</text>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>身份证号</view>
						<view class='input'><input type='text' name='id_number' v-model.trim='userInfo.id_number' maxlength="18"
								placeholder="请输入身份证号"></input></view>
					</view>
					<view class='item'>
						<view class="itemText">身份证正面照</view>
						<view class="avatar-box acea-row row-center-wrapper row-column" @click.stop='uploadpic'>
							<image :src="userInfo.identity_card_front"></image>
							<view class="imgicon">
								<view><span class="iconfont icon-yunshangchuan_o" style="font-size: 96rpx;color: #00DCEE;"></span></view>
								<!-- <image src="https://mall-qiniu-accelerate.302010.com/mall/buUpload.png" mode=""></image> -->
								<view class="imgtext">上传正面</view>
							</view>
						</view>
					</view>
					<view class='item'>
						<view class="itemText">身份证反面照</view>
						<view class="avatar-box02 acea-row row-center-wrapper row-column" @click.stop='uploadpic01'>
							<image :src="userInfo.identity_card_reverse"></image>
							<view class="imgicon">
								<view><span class="iconfont icon-yunshangchuan_o" style="font-size: 96rpx;color: #00DCEE;"></span></view>
								<!-- <image src="https://mall-qiniu-accelerate.302010.com/mall/buUpload.png" mode=""></image> -->
								<view class="imgtext">上传反面</view>
							</view>
						</view>
					</view>
				</view>
				<view class="endtext">
					<view class="imgText">提示：上传的证件图片文件大小不要超过5M</view>
				</view>
				<view class="endtext">
					<view class="imgText"></view>
				</view>
				<view class="certification">
					<checkbox type="checkbox" value="同意" :class="inAnimation?'trembling':''"
						@animationend='inAnimation=false' :checked="isAgree" @tap="isAgree = !isAgree" />已阅读并同意
					<navigator class="main-color" hover-class="none"
						url="/pagesMine/privacy/index?type=certification">
						《用户实名协议》
					</navigator>
				</view>
				<button class='modifyBnt bg-color' formType="submit" >提交</button>
			</view>
			<!-- 重新上传切换页面 -->
			<!-- 已拒绝-->
			<!-- <view class="homeText" v-show="isShow" v-if="certificateData.status == -1">审核拒绝，请重新提交信息</view> -->
			<view class='personal-data' v-if="certificateData.status == -1">
				<view class='list'>
					<view class='item acea-row row-between-wrapper'>
						<view>真实姓名</view>
						<view class='input'><input type='text' name='name' v-model='userInfo.name'
								placeholder="请输入真实姓名"></input></view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>性别</view>
						<radio-group @change="radioChange">
							<label class="radio"><radio value="1" :checked="userInfo.sex==1" />男</label>
							<label class="radio"><radio value="2" :checked="userInfo.sex==2" />女</label>
					<!-- {{certificateData.sex==1?'女':'男'}} -->
						</radio-group>
					</view>
					<!-- <picker @change="bindPickerChange" :range="array">
						<view class='item acea-row row-between-wrapper'>
							<view>性别</view>
							<view class='input'><label class="">{{array[index]}}</label></view>
						</view>
					</picker> -->
					<view class='item acea-row row-between-wrapper'>
						<view>民族</view>
						<view class='input'><input type='text' name='nation' v-model='userInfo.nation'
								placeholder="请输入民族"></input></view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>手机号验证码</view>
						<view class='relative input flex flex-ac code'>
							<input type='text' class="code-input" name='phone' v-model.trim='userInfo.code' maxlength="11" placeholder="请输入验证码"></input>
							<text class="get-code" @click.stop="handleVerify" v-if="!codeFlag">验证码</text>
                            <text class="get-code" v-else>{{ codeTime }}s</text>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view>身份证号</view>
						<view class='input'><input type='text' name='id_number' v-model='userInfo.id_number' maxlength="18"
								placeholder="请输入身份证号"></input></view>
					</view>
					<view class='item'>
						<view class="itemText">身份证正面照</view>
						<view class="avatar-box acea-row row-center-wrapper row-column" @click.stop='uploadpic'>
							<image :src="userInfo.identity_card_front"></image>
							<view class="imgicon">
								<view><span class="iconfont icon-yunshangchuan_o" style="font-size: 96rpx;color: #00DCEE;"></span></view>
								<!-- <image src="https://mall-qiniu-accelerate.302010.com/mall/buUpload.png" mode=""></image> -->
								<view class="imgtext">上传正面</view>
							</view>
						</view>
					</view>
					<view class='item'>
						<view class="itemText">身份证反面照</view>
						<view class="avatar-box02 acea-row row-center-wrapper row-column" @click.stop='uploadpic01'>
							<image :src="userInfo.identity_card_reverse"></image>
							<view class="imgicon">
								<view><span class="iconfont icon-yunshangchuan_o" style="font-size: 96rpx;color: #00DCEE;"></span></view>
								<!-- <image src="https://mall-qiniu-accelerate.302010.com/mall/buUpload.png" mode=""></image> -->
								<view class="imgtext">上传反面</view>
							</view>
						</view>
					</view>
				</view>
				<view class="endtext">
					<view class="imgText">提示：上传的证件图片文件大小不要超过5M</view>
				</view>
				<view class="certification">
					<checkbox type="checkbox" value="同意" :class="inAnimation?'trembling':''"
						@animationend='inAnimation=false' :checked="isAgree" @tap="isAgree = !isAgree" />已阅读并同意
					<navigator class="main-color" hover-class="none"
						url="/pagesMine/privacy/index?type=certification">
						《用户实名协议》
					</navigator>
				</view>
				<button class='modifyBnt bg-color' formType="submit">提交</button>
			</view>
            <view style="width:100%;height:32rpx;"></view>
		</form>
		</view>
	</view>
	<Verify @success="success" :captchaType="'blockPuzzle'" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow} from "@dcloudio/uni-app";
import util from '@/infrastructure/utils/utils'
import { getUserInfo } from '@/business/api/modules/user.ts';
import { getCertificationApi, certificationApi,sendCommonSmsApi } from '@/business/api/modules/mine.ts';
import Verify from "@/views/components/verify/verify.vue";

const hei = uni.getSystemInfoSync().windowHeight;
const title = ref('实名认证');
const array = ref(['女', '男']);
const index = ref(1);
const userInfo = ref({
	name: '',
	identity_card_front: '',
	identity_card_reverse: '',
	sex: 1,
	nation: '',
	phone: '',
	id_number: '',
	code: ''
});
const nickname = ref('');
const phone = ref('');
const certificateData = ref({sex:1});
const isShow = ref(true);
const inAnimation = ref(false);
const isAgree = ref(false);
const frontError = ref(false);
const reverseError = ref(false);
const codeFlag = ref(false);
const codeTime = ref(60);
const verify = ref();

onLoad((options)=>{
    getUserCertificates();
    getUserInfos()
})

// 返回按钮回调
function back(){
    uni.navigateBack({
        delta: 1
    });
}

function radioChange(e){
	userInfo.value.sex = e.detail.value;
}

//下拉框
function bindPickerChange(e) {
	index.value = e.target.value;
	userInfo.value.sex = array.value[index.value];
	// console.log("性别：",this.userInfo.sex)											
}


function getUserInfos() {
	getUserInfo().then(res => {
		phone.value = res.data.phone;
		nickname.value = res.data.nickname;
		userInfo.value.phone = res.data.phone;
	})
}

// 获取认证信息
function getUserCertificates() {
	getCertificationApi().then(res => {
		certificateData.value = !Array.isArray(res.data)?res.data:{
			sex:1,
			phone:phone.value
		};
		if (certificateData.value) {
			userInfo.value.name = certificateData.value.name
			userInfo.value.identity_card_front = certificateData.value.identity_card_front
			userInfo.value.identity_card_reverse = certificateData.value.identity_card_reverse
			userInfo.value.sex = certificateData.value.sex || 1
			userInfo.value.nation = certificateData.value.nation
			userInfo.value.phone = certificateData.value.phone
			userInfo.value.id_number = certificateData.value.id_number
		}
	})
}

// 上传正面
function uploadpic() {
	util.uploadImageOne({url:"post/uploadImage",maxSize: 10}, function(res) {
		userInfo.value.identity_card_front = res.data.image_url;
	});
}

function showToast(msg){
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 2000
	});
}

// 上传反面
function uploadpic01() {
	util.uploadImageOne({url:"post/uploadImage",maxSize: 10}, function(res) {
		userInfo.value.identity_card_reverse = res.data.image_url;
	});
}


function success(data) {
	verify.value.hide();
	getCode(data);
}
	
//校验
function handleVerify(){
	verify.value.show();
}

// 获取验证码
const getCode = async (data) => {
	await sendCommonSmsApi({
		phone: phone.value,
		type: 'autonym',
		captchaType: 'blockPuzzle',
		captchaVerification: data.captchaVerification
	}).then(res => {
		uni.showToast({
			title: "验证码发送成功",
			duration: 2000,
		});
	}).catch(err => {
		return util.Tips({
			title: err
		});
	});

	codeFlag.value = true;
	let time = setInterval(() => {
		if (codeTime.value == 1) {
		clearInterval(time);
		codeFlag.value = false;
		codeTime.value = 60;
		}
		codeTime.value -= 1;
	}, 1000);
}

//保存
function formSubmit(e) {
	uni.showLoading({title: '实名认证中...'});
	let value = e.detail.value;
	let userInfoData = {
		name: userInfo.value.name,
		sex: userInfo.value.sex,
		nation: userInfo.value.nation,
		code: userInfo.value.code,
		phone: userInfo.value.phone,
		identity_card_front: userInfo.value.identity_card_front,
		identity_card_reverse: userInfo.value.identity_card_reverse,
		id_number: userInfo.value.id_number,
	};
	if (!isAgree.value) return showToast('请先阅读并勾选实名协议')
	if (!userInfoData.name) return showToast('请输入姓名')
	if (!/^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(userInfoData.name)) return showToast('请输入真实姓名')
	if (!userInfoData.nation) return showToast('请输入民族')
	// if (!userInfoData.phone) return showToast('请输入手机号')
	if (!userInfoData.code) return showToast('请输入验证码')
	if (!/^1(3|4|5|6|7|8|9)\d{9}$/i.test(userInfoData.phone)) return showToast('请输入正确的手机号码')
	if (!userInfoData.id_number) return showToast('请输入身份证号')
	//基于中国大陆的身份证号码规则
	if (!/^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
			userInfoData.id_number)) return showToast('请输入正确的用户身份证号')
	if (!userInfoData.identity_card_front) return showToast('请上传身份证正面照片')
	if (!userInfoData.identity_card_reverse) return showToast('请上传身份证反面照片')
	if(frontError.value){
		return showToast('请上传正确的身份证正面照片');
	}
	if(reverseError.value){
		return showToast('请上传正确的身份证反面照片')
	}
	certificationApi(userInfoData).then(res => {
		getUserCertificates()
		showToast(res.message)
		uni.hideLoading();
	}).catch(err => {
		uni.hideLoading();
		showToast(err)
	});
}
</script>

<style scoped lang="less">
	.content-wrap {
    	overflow-y: auto;
		position: relative;
	}
	.hometext {
		width: 100%;
		background-color: #00DCEE;
		padding: 10px 20px 0;
		height: 150px;
		position: relative;
		color: #fff;

		.userText {
			font-size: 28rpx;
			margin-top: 5rpx;
		}

		.text_through {
			display: flex;
			align-items: center;
		}
	}

	.user_examine {
		font-size: 10rpx;
		position: absolute;
		top: 230rpx;
		left: 10rpx;
		right: 10rpx;
		background: #fff;
		color: red;
		padding: 40rpx;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
		.user_card {
			font-size: 24rpx;
		}
		.examine {
			font-size: 36rpx;
			font-weight: 800;
			margin-top: 10rpx;
		}

		.line {
			width: 100%;
			border-bottom: 1px solid red;
			margin: 16rpx 0;
		}
	}

	.endtext {
		width: 100%;
		background-color: #fff;
		margin: 10rpx 0;
		padding: 20rpx 30rpx;

		.imgText {
			font-size: 28rpx;
			font-weight: bold;
			color: #a2a2a2;
		}
	}

	.personal-data .list {
		margin-top: 15rpx;
		background-color: #fff;
	}

	.personal-data .list .item {
		padding: 20rpx 30rpx 30rpx 0;
		border-bottom: 1rpx solid #f2f2f2;
		font-size: 32rpx;
		color: #282828;
		padding: 20rpx;
	}

	.personal-data .list .item .itemText {
		font-size: 32rpx;
		padding: 0 0 5rpx;
		text-align: center;
	}

	.personal-data .list .item .phone {
		width: 160rpx;
		height: 56rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 56rpx;
		border-radius: 32rpx
	}

	.personal-data .list .item .pictrue {
		width: 88rpx;
		height: 88rpx;
	}

	.personal-data .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.personal-data .list .item .input {
		width: 415rpx;
		text-align: right;
		color: #868686;
	}

	.personal-data .list .item .input .id {
		width: 365rpx;
	}

	.personal-data .list .item .input .iconfont {
		font-size: 35rpx;
	}

	.personal-data .certification {
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}

	.homeText {
		background-color: #fff;
		margin-top: 10rpx;
		padding: 10rpx 0;
		font-size: 28rpx;
		text-align: center;
		color: #f00;
		font-weight: bold;
	}

	.homeText01 {
		background-color: #fff;
		margin-top: 10rpx;
		padding: 10rpx 0;
		font-size: 28rpx;
		text-align: center;
		font-weight: bold;
		position: absolute;
		top: 230rpx;
	}

	.noCart {
		background-color: #fff;
		margin-top: 10rpx;
		padding: 20rpx 0;
	}

	.noCart .pictrue {
		margin: 0 auto 60rpx;
		width: 90%;
		height: 385rpx;
	}

	.noCart .pictrue .pictrueText {
		font-size: 32rpx;
		text-align: center;
	}

	.noCart .pictrue .pictrue-box {
		margin: 5rpx auto;
		width: 100%;
		height: 355rpx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 5%;
		}
	}

	.noCart .modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 0 auto 20rpx;
	}

	.personal-data {
		padding: 20rpx;
		background-color: #fff;
		position: absolute;
		top: 230rpx;
		left: 10rpx;
		right: 10rpx;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
	}

	.personal-data .modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 48rpx auto 0 auto;
		background-color: #00DCEE !important;
	}

	.personal-data .logOut {
		font-size: 32rpx;
		text-align: center;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 30rpx auto 0 auto;
	}

	.avatar-box {
		border: 2rpx dashed #bbb;
		background-image: url(https://mall-qiniu-accelerate.302010.com/mall/idcardZ.png);
		background-size: 100% 100%;
		border-radius: 5%;
		margin: 5rpx auto;
		width: 90%;
		height: 335rpx;

		image {
			width: 97%;
			height: 97%;
			z-index: 500;
			border-radius: 5%;
		}
	}

	.imgicon {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		// top: 300rpx;
		z-index: 2;

		image {
			opacity: 0.8;
		}

		.imgtext {
			margin-top: 10rpx;
			font-size: 24rpx;
			font-weight: bold;
		}
	}

	.avatar-box02 {
		border: 2rpx dashed #bbb;
		background-image: url(https://mall-qiniu-accelerate.302010.com/mall/zdan.png);
		background-size: 100% 100%;
		border-radius: 5%;
		margin: 5rpx auto;
		width: 90%;
		height: 335rpx;

		image {
			width: 97%;
			height: 97%;
			z-index: 500;
			border-radius: 5%;
		}

		.imgicon {
			// top: 730rpx;
			z-index: 2;
		}

	}

	.avatar-box03 {
		border: 2rpx dashed #bbb;
		background-image: url(https://mall-qiniu-accelerate.302010.com/mall/kcard.png);
		background-size: 100% 100%;
		border-radius: 5%;
		margin: 5rpx auto;
		width: 90%;
		height: 335rpx;

		image {
			width: 97%;
			height: 97%;
			z-index: 500;
			border-radius: 5%;
		}

		.imgicon {
			// top: 730rpx;
			z-index: 2;
		}

	}

	.avatar-box04 {
		border: 2rpx dashed #bbb;
		background-image: url(https://mall-qiniu-accelerate.302010.com/mall/zdan.png);
		background-size: 100% 100%;
		border-radius: 5%;
		margin: 5rpx auto;
		width: 90%;
		height: 335rpx;

		image {
			width: 97%;
			height: 97%;
			z-index: 500;
			border-radius: 5%;
		}

		.imgicon {
			// top: 730rpx;
			z-index: 2;
		}

	}
	/deep/.uni-popup {
		z-index: 9999;
	}
	.custom-icon {
		width: 48rpx;
		height: 48rpx;
	}
	.code_wrap {
		margin-top: 60rpx;
	}
	.code_url {
		width: 240rpx;
	}
	.code-popup-content {
		background-color: #fff; 
		border-radius: 16px 16px 16px 16px;
		position: relative;
		margin-bottom: 40rpx;
		width: 500rpx;
		padding: 40rpx 0;
	}
	.m_content_text {
		text-align: center;
		font-size: 32rpx;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
	}
	.x_btn {
		position: relative;
		width: 68rpx;
		height: 68rpx;
		// bottom: -100rpx;
		left: 218rpx;
		z-index: 999;
	}

	@keyframes shake {

		0%,
		100% {
			-webkit-transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			-webkit-transform: translateX(-5rpx);
		}

		20%,
		40%,
		60%,
		80% {
			-webkit-transform: translateX(5rpx);
		}
	}

	@-o-keyframes shake {

		/* Opera */
		0%,
		100% {
			-webkit-transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			-webkit-transform: translateX(-5rpx);
		}

		20%,
		40%,
		60%,
		80% {
			-webkit-transform: translateX(5rpx);
		}
	}

	@-webkit-keyframes shake {

		/* Safari 和 Chrome */
		0%,
		100% {
			-webkit-transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			-webkit-transform: translateX(-5rpx);
		}

		20%,
		40%,
		60%,
		80% {
			-webkit-transform: translateX(5rpx);
		}
	}

	@-moz-keyframes shake {

		/* Firefox */
		0%,
		100% {
			-moz-transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			-moz-transform: translateX(-5rpx);
		}

		20%,
		40%,
		60%,
		80% {
			-moz-transform: translateX(5rpx);
		}
	}

	.main-color {
		color: #00DCEE;
		display: inline;
	}

	.code{
		width: 415rpx;
		border-radius: 18rpx;
		background: #F8F8F8;
		overflow: hidden;
		.code-input{
			width: 300rpx;
			position: relative;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 20rpx;
			border-radius: 16rpx;
			background: #F8F8F8;
			text-align: left;
			z-index: 9;
		}
		.get-code {
			position: absolute;
			right: 20rpx;
			top: 0rpx;
			color: #1cdafe;
			line-height: 32rpx;
			z-index: 99;
			height: 80rpx;
			line-height: 80rpx;
			display: inline-block;
		}
	}
</style>