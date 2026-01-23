<template>	
	<view :style="local_view_color" class="feedback">
		<view class="tips" v-if="is_open_service == 1 && service">
			<view class="tipBox" @click="toChat">
				<view class="left">
					<image :src="`${domain}/static/images/kefu.png`" mode=""></image>
					<view class="font">如需尽快解决问题，可直接联系在线客服</view>
				</view>
				<view><i class='iconfont icon-xiangyou' style="fontSize: 24rpx;"></i></view>
			</view>
		</view>
		<view class="feedback-container">
			<view class="item-box">
				<view class="title-box" v-if="tab_list.length>0 || qs_array.length>0">
					<text>*</text>反馈类型
				</view>
				<view class="tab-box" v-if="tab_list.length>0">
					<view v-for="(item,index) in tab_list" :key="index">
						<view class="tab-item" :key="index" :class="{'active':index == tab_key}"
							@click="bindTab(item,index)">{{item.cate_name}}</view>
					</view>
				</view>
				<view class="picker" v-if="qs_array.length>0">
					<picker @change="bindPickerChange" :value="qs_index" :range="qs_array" range-key="cate_name">
						<view class="picker-box">
							{{qs_array[qs_index]['cate_name']}}
							<text class="iconfont icon-xiangxia"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="item-box">
				<view class="title-box">
					<text>*</text>反馈内容
				</view>
				<view class="textarea-box">
					<textarea maxlength="200" placeholder="请输入文字" v-model="con" />
					<view class="num">{{con.length > 200 ? 200 : con.length}}/200字</view>
				</view>
			</view>
			<view class="item-box">
				<view class="title-box">
					<text>*</text>图片上传 <text class="des">(上传聊天截图或与问题描述相关的图片)</text>
				</view>
				<view class="upload-img">
					<view class="img-wrapper" v-if="upload_img.length>0" v-for="(item,index) in upload_img">
						<image :src="item"></image>
						<view class="iconfont icon-guanbi1" @click="deleteImg(index)"></view>
					</view>
					<view class="add-img" @click="uploadpic" v-if="is_upload">
						<text class="iconfont icon-xiangji"></text>
					</view>
				</view>
			</view>
			<view class="item-box">
				<view class="title-box">
					<text>*</text>联系方式
				</view>
				<view class="input-box">
					<input type="text" placeholder="请填写您的姓名" v-model="name">
					<input type="text" placeholder="请填写您的电话或邮箱" v-model="phone">
				</view>
			</view>
			<view class="item-box">
				<view class="sub-btn" @click="bindSub">提交反馈</view>
				<navigator url="/pagesMine/feedback/list" class="link" hover-class="none">反馈记录 <text
						class="iconfont icon-xiangyou"></text></navigator>
			</view>
			<view class="success" v-if="is_showbox">
				<view class="bg"></view>
				<view class="con">
					<image :src="domain+'/static/diy/success'+key_color+'.png'" mode=""></image>
					<view class="text">反馈提交成功</view>
					<view class="btn" @click="close">我知道了</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed ,watch} from 'vue'
import { onLoad } from "@dcloudio/uni-app";
import { feedbackTypeApi, feedbackSaveApi, hasOnlineServiceApi} from '@/business/api/modules/user'
import { checkPhone,isEmailAvailable } from '@/infrastructure/utils/validate'
import { HTTP_REQUEST_URL } from "@/infrastructure/config/app";
import util from '@/infrastructure/utils/utils'
import store from '@/business/store/modules/mall';
const mall_store = store()
const domain = ref(HTTP_REQUEST_URL);
const tab_list = ref([]);
const tab_key = ref(0);
const qs_array = ref([]);
const qs_index = ref(0);
const con = ref('');
const upload_img = ref([]);
const name = ref('');
const phone = ref('');
const is_showbox = ref(false);
const is_upload = ref(true);
const service = ref(false);
const is_open_service = ref(mall_store.globalData['is_open_service']);

const local_view_color = computed(()=>{
	return mall_store.localViewColor
})

const key_color = computed(()=>{
	return mall_store.keyColor
})

watch(upload_img,(nVal, oVal)=>{
	is_upload.value = nVal.length < 6 ? true : false
})

onLoad(()=>{
	hasService()
	// 获取反馈类型
	feedbackTypeApi().then(({
		data
	}) => {
		tab_list.value = data
		getFeedBack(data)
	})
})

function toChat(){
	uni.navigateTo({
		url: `/pagesProduct/customer_list/chat?mer_id=0`
	})
}

/*判断店铺是否有在线客服*/
function hasService(){
	hasOnlineServiceApi({ mer_id: 0 }).then(res => {
		service.value= res.data ? true : false;
	}).catch(err => {});
}

// 获取含有二级分类的反馈类型
function getFeedBack(data) {
	data.forEach(function(item, i) {
		if (item.children) {
			tab_key.value = i;
			qs_array.value = data[tab_key.value].children
			return;
		}
	});
}
// 下拉选中
function bindPickerChange(e) {
	qs_index.value = e.detail.value
}

// tab切换
function bindTab(item, index) {
	tab_key.value = index
	qs_index.value = 0
	qs_array.value = tab_list.value[tab_key.value].children ? tab_list.value[tab_key.value].children : []
}

/**
 * 上传文件
 * 
 */
function uploadpic() {
	util.uploadImageOne('post/uploadImage', function(res) {
		upload_img.value.push(res.data.image_url);
	});
}

// 弹窗关闭
function close() {
	con.value = ''
	upload_img.value = []
	name.value = ''
	phone.value = ''
	is_showbox.value = false
}

// 删除图片
function deleteImg(index) {
	upload_img.value.splice(index, 1)
}

// 提交反馈
function bindSub() {
	if (!con.value) {
		uni.showToast({
			title: '请输入反馈内容',
			icon: 'none'
		})
		return
	}
	if (upload_img.value.length == 0) {
		uni.showToast({
			title: '请上传图片',
			icon: 'none'
		})
		return
	}
	if (!name.value) {
		uni.showToast({
			title: '请输入姓名',
			icon: 'none'
		})
		return
	}
	if (!phone.value) {
		uni.showToast({
			title: '请输入电话或者邮箱',
			icon: 'none'
		})
		return
	}
	if (!isEmailAvailable(phone.value) && !checkPhone(phone.value)) {
		uni.showToast({
			title: '请输入有效的电话或者邮箱',
			icon: 'none'
		})
		return
	}
	let type_str = ((qs_array.value[qs_index.value] && qs_array.value[qs_index.value].feedback_category_id) || 0) + '';
	feedbackSaveApi({
		type: type_str,
		content: con.value,
		images: upload_img.value,
		realname: name.value,
		contact: phone.value
	}).then(res => {
		is_showbox.value = true
	}).catch(error => {
		uni.showToast({
            title: error || '提交失败',
            icon: 'none'
        })
	})
}
</script>

<style lang="scss">
	page {
		width: 100%;
		background-color: #fff;
	}

	.tips {
		background-color: #f1f1f1;
		padding: 20rpx;

		.tipBox {
			width: 100%;
			height: 100rpx;
			background: var(--view-bgColor);
			border-radius: 16rpx;
			line-height: 100rpx;
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			font-weight: 400;
			color: #FFFFFF;
			padding: 0rpx 30rpx;

			.left {
				display: flex;

				image {
					width: 70rpx;
					height: 70rpx;
					background: #FFFFFF;
					border-radius: 50%;
					display: inline-block;
					margin-top: 15rpx;
				}

				.font {
					padding-left: 20rpx;
				}
			}
		}
	}

	.feedback-container {
		padding: 46rpx 30rpx 30rpx 30rpx;
		.item-box {
			margin-bottom: 40rpx;

			.title-box {
				font-size: 28rpx;
				color: #222222;

				text {
					margin-right: 10rpx;
					color: var(--view-bgColor);
				}

				.des {
					margin-left: 10rpx;
					font-size: 22rpx;
					color: #999999;
				}
			}

			.tab-box {
				margin-top: 20rpx;
				display: flex;
				flex-wrap: wrap;

				.tab-item {
					// overflow: hidden;
					// display: -webkit-box;
					line-height: 66rpx;
					align-items: center;
					justify-content: center;
					width: 200rpx;
					// height: 66rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					border: 1px solid #BFBFBF;
					border-radius: 33px;
					font-size: 28rpx;
					text-align: center;

					&.active {
						background: var(--view-bgColor);
						color: #fff;
						border-color: var(--view-bgColor);
					}
				}
			}

			.picker {
				margin-top: 30rpx;

				.picker-box {
					position: relative;
					width: 100%;
					height: 90rpx;
					line-height: 90rpx;
					padding: 0 30rpx;
					background-color: #F5F5F5;
					border-radius: 10rpx;

					.iconfont {
						position: absolute;
						right: 30rpx;
						top: 50%;
						transform: translateY(-50%);
						font-size: 22rpx;
						color: var(--view-bgColor);
					}
				}
			}

			.textarea-box {
				background: #F5F5F5;
				border-radius: 10rpx;

				textarea {
					width: 100%;
					height: 300rpx;
					margin-top: 30rpx;
					padding: 20rpx 20rpx 0;
					font-size: 28rpx;
					line-height: 1.5;

				}

				.num {
					color: #999;
					text-align: right;
					padding: 20rpx;
				}
			}

			.upload-img {
				display: flex;
				flex-wrap: wrap;

				.img-wrapper {
					position: relative;
					display: flex;
					flex-wrap: wrap;
					margin: 30rpx 20rpx 20rpx 0;
					width: 158rpx;
					height: 158rpx;

					image {
						width: 158rpx;
						height: 158rpx;
					}

					.iconfont {
						position: absolute;
						right: -15rpx;
						top: -20rpx;
						font-size: 40rpx;
						color: var(--view-bgColor);
					}

					&:nth-child(4n) {
						margin-right: 0;
					}
				}

				.add-img {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 158rpx;
					height: 158rpx;
					background: #F5F5F5;
					border-radius: 10rpx;
					margin-top: 30rpx;
					margin-bottom: 20rpx;

					.iconfont {
						color: #B5B5B5;
						font-size: 55rpx;
					}
				}
			}

			.input-box {
				input {
					display: block;
					width: 100%;
					height: 90rpx;
					margin-top: 20rpx;
					padding-left: 20rpx;
					background: #f5f5f5;
					border-radius: 10rpx;
					font-size: 28rpx;
				}
			}

			.sub-btn {
				height: 90rpx;
				line-height: 90rpx;
				background: var(--view-bgColor);
				color: #fff;
				font-size: 32rpx;
				text-align: center;
				border-radius: 45rpx;
			}

			.link {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20rpx;

				.iconfont {
					margin-top: 6rpx;
					font-size: 22rpx;
				}
			}
		}

		.success {
			z-index: 10;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;

			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, .5);
			}

			.con {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 500rpx;
				height: 540rpx;
				background: #fff;
				border-radius: 10rpx;
				font-size: 34rpx;
				color: #282828;

				image {
					width: 149rpx;
					height: 230rpx;
				}

				.btn {
					width: 340rpx;
					height: 90rpx;
					line-height: 90rpx;
					margin-top: 38rpx;
					text-align: center;
					color: #fff;
					background-image: linear-gradient(-90deg, var(--view-bgColor) 0%, var(--view-bgColor) 100%);
					border-radius: 45rpx;
				}
			}
		}
	}
</style>
