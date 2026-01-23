<template>
	<view :style="view_color">
		<form @submit="formSubmit" report-submit="true">
			<view class="panel">
				<view v-if="receipt_title_type == 1" class="acea-row row-middle">
					<view>发票类型</view>
					<input name="receipt_type" :value="type_name" disabled="true" />
				</view>
				<view v-else class="acea-row row-middle" @click="callType">
					<view>发票类型</view>
					<input name="receipt_type" :value="type_name" disabled="true" />
					<text class="iconfont icon-xiangyou"></text>
				</view>
				<view class="acea-row row-middle">
					<view>抬头类型</view>
					<radio-group name="receipt_title_type" @change="changeHeader">
						<label>
							<radio value="1" :checked="receipt_title_type == 1 ? true : false" /><text>个人</text>
						</label>
						<label>
							<radio value="2" :checked="receipt_title_type == 2 ? true : false" /><text>企业</text>
						</label>
					</radio-group>
				</view>
				<view class="acea-row row-middle">
					<view>发票抬头</view>
					<input name="receipt_title" :value="receipt_title"  :placeholder="receipt_title_type == 1 ? '需要开具发票的姓名' : '需要开具发票的企业名称'" />
					<!-- <text class="iconfont icon-xiangyou"></text> -->
				</view>
				<view v-show="receipt_title_type === '2' && receipt_title_type === '2'" class="acea-row row-middle">
					<view>税号</view>
					<input name="duty_paragraph" :value="duty_paragraph" maxlength="20" placeholder="纳税人识别号" />
				</view>
				<view class="acea-row row-middle">
					<view>邮箱</view>
					<input name="email" :value="email" placeholder="您的联系邮箱" />
				</view>
			</view>
			<view v-show="receipt_title_type == '2' && receipt_type == '2'" class="panel">
				<view class="acea-row row-middle">
					<view class="name">开户银行</view>
					<input name="bank_name" :value="bank_name" maxlength="50" placeholder="您的开户银行" />
				</view>
				<view class="acea-row row-middle">
					<view class="name">银行账号</view>
					<input name="bank_code" :value="bank_code" placeholder="您的银行账号" />
				</view>
				<view class="acea-row row-middle">
					<view class="name">企业地址</view>
					<input name="address" :value="address" maxlength="30" placeholder="您所在的企业地址" />
				</view>
				<view class="acea-row row-middle">
					<view class="name">企业电话</view>
					<input name="tel" :value="tel" placeholder="您的企业电话" />
				</view>
			</view>
			<checkbox-group class="acea-row row-middle panel" name="is_default" @change="changeDefault">
				<label>
					<checkbox :checked="is_default ? true : false" /><text>设置为默认抬头</text>
				</label>
			</checkbox-group>
			<button form-type="submit" :disabled="loading" :class="loading ? 'disabled' : ''">保存</button>
		</form>
		<view :class="{ mask: popup_type || popup_title }"></view>
		<view class="popup" :class="{ on: popup_type }">
			<view class="title">发票类型选择<text class="iconfont icon-guanbi" @click="closeType"></text></view>
			<scroll-view scroll-y="true">
				<radio-group name="invoice-type" @change="changeType">
					<label v-for="item in invoice_type_list" :key="item.type" class="acea-row row-middle">
						<view class="text">
							<view>{{ item.name }}</view>
							<view class="info">{{ item.info }}</view>
						</view>
						<radio :value="item.type" :checked="receipt_type == item.type ? true : false" />
					</label>
				</radio-group>
			</scroll-view>
			<button @tap="closeType">确定</button>
		</view>
		<view class="popup" :class="{ on: popup_title }">
			<view class="title">抬头选择<text class="iconfont icon-guanbi" @click="closeTitle"></text></view>
			<scroll-view scroll-y="true">
				<radio-group name="invoice-title" @change="changeTitle">
					<label class="acea-row row-middle">
						<view class="text">
							<view class="acea-row row-middle">
								<view class="name">西安众邦网络科技有限公司</view>
								<view class="label">默认</view>
							</view>
							<view class="type">普通发票</view>
						</view>
						<radio value="西安众邦网络科技有限公司" :checked="receipt_title === '西安众邦网络科技有限公司' ? true : false" />
					</label>
				</radio-group>
			</scroll-view>
			<button>添加新的抬头</button>
		</view>
		<home></home>
	</view>
</template>

<script setup>
 	import { ref, computed } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	import home from '@/pages/components/home/index.vue';
	import { invoiceSaveApi, invoiceUpdate, invoiceDetailApi } from '@/business/api/modules/user';
	import { verifyBankCardNumber } from "@/infrastructure/utils/mall";
	import util from '@/infrastructure/utils/utils'
	import store from '@/business/store/modules/mall';
	const mall_store = store();
	const view_color = computed(() => {
		return mall_store.viewColor
	})

	const loading = ref(false)
	const id = ref('')
	const mer_id = ref('')
	const receipt_title_type = ref('1')
	const receipt_type = ref('1')
	const receipt_title = ref('')
	const duty_paragraph = ref('')
	const tel = ref('')
	const address = ref('')
	const bank_name = ref('')
	const bank_code = ref('')
	const is_default = ref(0)
	const email = ref('')
	const type_name = ref('增值税电子普通发票')
	const popup_type = ref(false)
	const popup_title = ref(false)
	const invoice_type_list = ref([{
			type: '1',
			name: '增值税电子普通发票',
			info: '默认发送至所提供的电子邮件'
		},
	])
	const add_invoice = ref([]) 

	onLoad((options) => {
		if (options.id) {
			id.value = options.id;
			getInvoiceDetail();
			if(id.value)
			uni.setNavigationBarTitle({
				title: '编辑发票'
			})
		}
		if(options.mer_id){
			mer_id.value = options.mer_id
		}
	})

	function getInvoiceDetail() {
		uni.showLoading({
			title: '加载中'
		});
		invoiceDetailApi({ user_receipt_id: id.value }).then(res => {
			uni.hideLoading();
			receipt_title_type.value = res.data.receipt_title_type;
			receipt_type.value = res.data.receipt_type;
			receipt_title.value = res.data.receipt_title;
			type_name.value = receipt_type.value == 1 ? '增值税电子普通发票' : '增值税专用发票' 
			email.value = res.data.email;
			duty_paragraph.value = res.data.duty_paragraph;
			bank_name.value = res.data.bank_name;
			bank_code.value = res.data.bank_code;
			address.value = res.data.address;
			tel.value = res.data.tel;
			is_default.value = res.data.is_default;
		}).catch(err => {
			uni.hideLoading();
			util.Tips({
				title: err
			});
		});
	}

	// 提交发票数据
	function formSubmit(e) {
		let form_data = e.detail.value;
		if (form_data.receipt_title_type === '2') {
			if (!form_data.receipt_title) {
				return util.Tips({
					title: '请输入需要开具发票的企业名称'
				});
			}
			if (!form_data.duty_paragraph) {
				return util.Tips({
					title: '请输入纳税人识别码'
				});
			}
			if(receipt_type.value == 2){
				if (!form_data.bank_name) return util.Tips({
					title: '请输入开户行'
				});
				
				if (!form_data.bank_code) return util.Tips({
					title: '请输入银行账号'
				});
				if(!verifyBankCardNumber(form_data.bank_code)){
					return util.Tips({
						title: '请输入正确的银行账号'
					});
				}						
				if(!/(^(\d{3,4})?\d{7,8})$|(^1(3|4|5|7|8|9|6)\d{9}$)/i.test(form_data.tel)){
					return util.Tips({
						title: '请输入正确的电话号码'
					});
				}	
			}				
		} else {
			if (!form_data.receipt_title) {
				return util.Tips({
					title: '请输入需要开具发票的姓名'
				});
			}
		}
		if (form_data.email) {
			if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(form_data.email)) {
				return util.Tips({
					title: '请输入正确的邮箱'
				});
			}
		}
		loading.value = true;
		form_data.receipt_type = receipt_type.value;
		form_data.is_default = is_default.value;
		uni.showLoading({
			title: '保存中',
			mask: true
		});
		invoiceSaveApi(form_data).then(res => {
			uni.hideLoading();
			util.Tips({
				title: '添加成功',
				icon: 'success'
			});
			if(mer_id.value){
				form_data.mer_id = mer_id.value
				uni.getStorage({
					key:"invoice_Data",
					success: function (res) {
						add_invoice.value = res.data;
					}
				})
				let arr = [form_data]
				console.log(add_invoice.value)
				if(add_invoice.value.length){
					add_invoice.value.forEach((item, i) => {
						if (item.mer_id == mer_id.value) {
							add_invoice.value.splice(i,1)
						}
					})
				}
				arr = (add_invoice.value.length && add_invoice.value[0]['mer_id']) ? arr.concat(add_invoice.value) : arr

				uni.setStorage({
					key:'invoice_Data',
					data: arr,
					success: function(){
					}
				})
				
			}
			setTimeout(() => {
				// #ifdef H5
				return history.back();
				// #endif
				// #ifndef H5
				return uni.navigateBack({
					delta: 1,
				})
				// #endif
			}, 1000);
		}).catch(err => {
			uni.hideLoading();
			util.Tips({
				title: err
			});
			loading.value = false;
		});
	}

	function callType() {
		popup_type.value = true;
	}

	function changeType(e) {
		receipt_type.value = e.detail.value;
		type_name.value = invoice_type_list.value.find(value => {
			return value.type === receipt_type.value;
		}).name;
	}

	function closeType() {
		popup_type.value = false;
	}

	function callTitle() {
		popup_title.value = true;
	}

	function changeTitle(e) {
		receipt_title.value = e.detail.value;
	}

	function closeTitle() {
		popup_title.value = false;
	}

	function changeHeader(e) {
		receipt_title_type.value = e.detail.value;
		if (e.detail.value == 1) {
			receipt_type.value = 1;
			type_name.value = '增值税电子普通发票';
		}
	}

	function changeDefault(e) {
		is_default.value = e.detail.value.length ? 1 : 0;
	}

</script>

<style lang="less" scoped>
	/deep/radio .wx-radio-input.wx-radio-input-checked,
	/deep/uni-radio .uni-radio-input.uni-radio-input-checked {
	 border: 1px solid var(--view-theme)!important;
	 background-color: var(--view-theme)!important;
	}
	/deep/checkbox .uni-checkbox-input.uni-checkbox-input-checked,
	/deep/checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	  border: 1px solid var(--view-theme)!important;
	  background-color: var(--view-theme)!important;
	  color: #fff!important;
	}
	form {
		font-size: 28rpx;
		color: #282828;
	}

	form input,
	form radio-group {
		flex: 1;
		text-align: right;
	}

	form input {
		font-size: 26rpx;
	}

	form label {
		margin-right: 50rpx;
	}

	form radio {
		margin-right: 8rpx;
	}

	form checkbox-group {
		height: 90rpx;
	}

	form checkbox {
		margin-right: 20rpx;
	}
	form button {
		height: 86rpx;
		border-radius: 43rpx;
		margin: 66rpx 30rpx;
		background-color: var(--view-theme);
		font-size: 30rpx;
		line-height: 86rpx;
		color: #FFFFFF;
	}

	.panel {
		padding-right: 30rpx;
		padding-left: 30rpx;
		background-color: #FFFFFF;
	}

	.panel~.panel {
		margin-top: 14rpx;
	}

	.panel .acea-row {
		height: 90rpx;
	}

	.panel .acea-row~.acea-row {
		border-top: 1px solid #EEEEEE;
	}
	.panel .name{
		width: 150rpx;
	}
	.input-placeholder {
		font-size: 26rpx;
		color: #BBBBBB;
	}

	.icon-xiangyou {
		margin-left: 25rpx;
		font-size: 18rpx;
		color: #BFBFBF;
	}

	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		width: 100%;
		padding-bottom: 100rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		background-color: #F5F5F5;
		overflow: hidden;
		transform: translateY(100%);
		transition: 0.3s;
	}

	.popup.on {
		transform: translateY(0);
	}

	.popup .title {
		position: relative;
		height: 137rpx;
		font-size: 32rpx;
		line-height: 137rpx;
		text-align: center;
	}

	.popup scroll-view {
		height: 466rpx;
		padding-right: 30rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.popup label {
		padding: 35rpx 30rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
	}

	.popup .text {
		flex: 1;
		min-width: 0;
		font-size: 28rpx;
		color: #282828;
	}

	.popup .info {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: #909090;
	}

	.popup .icon-guanbi {
		position: absolute;
		top: 50%;
		right: 30rpx;
		z-index: 2;
		transform: translateY(-50%);
		font-size: 30rpx;
		color: #707070;
		cursor: pointer;
	}

	.popup button {
		height: 86rpx;
		border-radius: 43rpx;
		margin-right: 30rpx;
		margin-left: 30rpx;
		background-color: var(--view-theme);
		font-size: 30rpx;
		line-height: 86rpx;
		color: #FFFFFF;
	}
	uni-button[disabled]:not([type]), uni-button[disabled][type=default] {
		opacity: .5;
		background-color: var(--view-theme);
		color: #FFFFFF;
	}
	.popup .text .acea-row {
		display: inline-flex;
		max-width: 100%;
	}

	.popup .name {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 30rpx;
	}

	.popup .label {
		width: 56rpx;
		height: 28rpx;
		border: 1px solid #E93323;
		margin-left: 18rpx;
		font-size: 20rpx;
		line-height: 26rpx;
		text-align: center;
		color: #E93323;
	}

	.popup .type {
		width: 124rpx;
		height: 42rpx;
		margin-top: 14rpx;
		background-color: #FCF0E0;
		font-size: 24rpx;
		line-height: 42rpx;
		text-align: center;
		color: #D67300;
	}

	.popup .type.special {
		background-color: #FDE9E7;
		color: #E93323;
	}
	.mask {
		z-index: 30;
	}
</style>
