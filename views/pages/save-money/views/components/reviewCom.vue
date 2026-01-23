<template>
	<view class="review-boxs">
		<view v-if="props.isMyEnter">
			<text class="fc-777777 fs-24">共{{ messageLength || 0 }}条评论 </text>
		</view>
		<view class="review-num" v-else>
			<text class="text">评论（{{ messageLength || 0 }}）</text>
		</view>
		<scroll-view :scroll-y="true" class="scroll-box" :class="{ 'scroll-maxHei': props.maxHei }"
			:show-scrollbar="false">
			<view class="popup-box">
				<view class="mian">
					<view class="review-list" v-if="store.reviewList.items?.length > 0">
						<view class="review-item" v-for="(item, index) in store.reviewList.items" :key="index">
							<view class="item-parent" :class="{'item-parent-recover': index == 0 && props.recover, 'color-show': isShowColor,}">
								<view class="item-left">
									<image style="width: 56rpx; height: 56rpx" :src="item.avatar" @click="toUser(item)" class="avatar avatar-border"></image>
								</view>
								<view class="item-right flex flex-column">
									<view class="flex flex-ac">
										<text class="item-right-top">{{ item.nickname }}</text>
										<image mode="aspectFill" class="sex-image" v-if="item.gender!=3" :src="imgUrlEvent(item.gender==1?'/images/save-money/man_img.png':'/images/save-money/women_img.png')"></image>
										<image mode="aspectFill" class="vip-image" v-if="item.member_level>0" :src="imgUrlEvent(getVipImg(item.member_level))" ></image>
									</view>
									<text class="item-right-center">{{ item.content }}</text>
									<image style="width: 192rpx; height: 192rpx" :src="item.image" v-if="item.image"
										class="item-right-img" @click="lookImg(item.image)" mode="aspectFill"></image>
									<view class="item-right-bottom">
										<view class="item-right-bottom-left">
											<text class="item-right-time">{{ item.created_at }}</text>
											<text class="item-right-recover" @click="recoverEvent(item.id, item)">回复</text>
										</view>
										<view class="item-right-bottom-right flex-ac">
											<image style="width: 32rpx; height: 32rpx" :src="item.is_like? imgUrlEvent('/images/save-money/review_zan_active.png')  : imgUrlEvent('/images/save-money/review_zan.png')" class="avatar" @click="likeComment_throttle(item.id, item)"></image>
											<text class="item-right-is_like">{{item.like_nums }}</text>
											<text class="item-right-recover"></text>
										</view>
									</view>
								</view>
							</view>
							<view class="item-child" v-if="item.level_comment?.length > 0">
								<view class="review-item-child" v-for="(itemChild, indexChild) in item.level_comment" :key="index">
									<view v-if="indexChild < (item.level_comment_Num ? item.level_comment_Num : 1)" class="review-item-child-box">
										<view class="item-left">
											<image style="width: 40rpx; height: 40rpx" :src="itemChild.avatar" class="avatar avatar-border"></image>
										</view>
										<view class="item-right flex flex-column">
											<view class="flex flex-ac">
												<text class="item-right-top">{{ itemChild.nickname }}</text>
												<image mode="aspectFill" class="sex-image" v-if="item.gender!=3" :src="imgUrlEvent(item.gender==1?'/images/save-money/man_img.png':'/images/save-money/women_img.png')"></image>
												<image mode="aspectFill" class="vip-image" v-if="item.member_level>0" :src="imgUrlEvent(getVipImg(item.member_level))" ></image>
											</view>
											<view class="item-right-center flex-wrap flex">
												<text style="margin-right: 10rpx" class="fs-26 inline-block">回复</text>
												<text class="parent-name fs-26 inline-block">{{itemChild.reply_user.nickname ||getParentName(itemChild.comment_pid) }}：</text>
												<text class="fs-26 fc-111111 inline-block">{{itemChild.content }}</text>
											</view>
											<view>
												<image style="width: 192rpx; height: 192rpx" :src="itemChild.image" v-if="itemChild.image" @click="lookImg(itemChild.image)" class="item-right-img" mode="aspectFill"></image>
											</view>
											<view class="item-right-bottom">
												<view class="item-right-bottom-left">
													<text class="item-right-time">{{ itemChild.created_at}}</text>
													<text class="item-right-recover" @click="recoverEvent(item.id, itemChild)">回复</text>
												</view>
												<view class="item-right-bottom-right flex-ac">
													<image @click="likeComment_throttle(itemChild.id, itemChild)" style="width: 32rpx; height: 32rpx" :src="itemChild.is_like? imgUrlEvent('/images/save-money/review_zan_active.png'): imgUrlEvent('/images/save-money/review_zan.png')" class="avatar"></image>
													<text class="item-right-is_like">{{itemChild.like_nums}}</text>
													<text class="item-right-recover"></text>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view v-if="item.count_level > 1 && !item.level_comment_Num" @click="unfold_message(item)" class="isunfold">
									<text class="text">展开{{ item.count_level - 1 }}条回复</text>
								</view>
							</view>
						</view>
					</view>
					<view class="flex jc-ct flex-ac" :style="{ height: hei - 100 + 'px' }" v-else>
						<image style="width: 256rpx; height: 256rpx" class="iconimg3" :src="imgUrlEvent('/images/home/nullImg.png')" mode=""></image>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
	<view class="footer">
		<view class="input flex flex-ac" @click="open_review_event">
			<text style="color: #cccccc" class="fs-24">说点什么...</text>
		</view>
		<view class="flex icon-item flex-ac flex-column" @click="favoriteEvent_throttle">
			<image style="width: 40rpx; height: 40rpx;marginLeft:4rpx;marginBottom:8rpx"  
			 :src="props.info?.is_like? imgUrlEvent('/images/save-money/review_zan_active.png'): imgUrlEvent('/images/save-money/review_zan.png')" class="avatar">
			</image>
			<text style="margin-left: 4rpx" :class="{'text-active':props.info?.is_like}" class="fc-111111 fs-22">{{ props.info?.like_nums || 0}}</text>
		</view>
		<view class="flex icon-item flex-ac flex-column" @click="praiseEvent_throttle">
			<image style="width: 40rpx; height: 40rpx;marginLeft:6rpx;marginBottom:8rpx" 
			 :src="props.info?.is_reward? imgUrlEvent('/images/save-money/dashangImg.png'): imgUrlEvent('/images/save-money/review_gifts.png')">
			</image>
			<text style="margin-left: 4rpx" :class="{'text-active':props.info?.is_reward}" class="fc-111111 fs-20">打赏</text>
		</view>
		<view class="flex icon-item flex-ac flex-column" @click="sendMessage">
			<image style="width: 40rpx; height: 40rpx;marginLeft:4rpx;marginBottom:8rpx" :src="imgUrlEvent('/images/save-money/review_message.png')"></image>
			<text style="margin-left: 4rpx" class="fc-111111 fs-20">私聊</text>
		</view>
		<view class="edit-pens">
			<image :src="imgUrlEvent('/images/mine/edit-icon.png','imgUrl')" class="user-edit-icon" mode="aspectFill"></image>
		</view>
	</view>

	<uni-popup ref="popupinput" type="bottom" border-radius="20px 20px 0 0" :safe-area="false" background-color="#fff"
		@maskClick="close_review_event" :animation="false" @change="popupinput_change">
		<view class="popupinput-box" :style="{ paddingBottom: keyWordH + 8 + 'px' }">
			<view class="fast-box flex flex-ac">
				<text class="fast-box-title">快捷发送：</text>
				<scroll-view :scroll-x="true" :show-scrollbar="false">
					<view class="fast-box-scroll flex-ac">
						<view class="fast-item" @click="fastSend(item.value)" v-for="(item,index) in store.quick_send" :key="index">
							<text class="fast-item-text">{{item.value}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="textarea-top flex flex-ac"> 
				<textarea type="text" ref="textareaEl" class="textareas"
				    v-model="params2.content" 
					style="font-size: 24rpx" 
				    :focus="textarea_is_focus" 
					:adjust-position="false"  
					:placeholder="placeholderVle" 
					:auto-height="true"
					 @focus="focusEvent"
					 @input="change_textarea" />
				<view class="send-btn flex flex-ac jc-ct" @click="pushMessage">
					<text class="fs-24 fc-ffffff">发送</text>
				</view>
			</view>
			<view class="img-bottom flex flex-ac" v-if="uploadImgList?.length > 0">
				<view class="image-item" v-for="(item, index) in uploadImgList" :key="index">
					<image style="width: 96rpx; height: 96rpx" :src="item.path" class="image-item-img" mode="aspectFill"></image>
					<view class="delete-img flex flex-ac jc-ct" @click="deletImgEvent(index)">
						<u-icon name="close" color="#fff" size="12"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup lang="ts">
	import { imgUrlEvent } from '@/views/pages/save-money/infrastructure/utils/imgUrls'
	import { ref, computed, watch, onMounted, onUnmounted } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
	import uerStore from "@/business/store/modules/home.ts";
	import packet_store from "@/views/pages/save-money/store/modules/packet";
	import _ from "lodash";
	import { messageApi } from "/business/api/index.ts";
	import {myShowToast,isNumber,getVipImg} from '/views/pages/save-money/infrastructure/utils/utils.ts'
	import {uploadImg} from '/views/pages/save-money/infrastructure/utils/upload.ts'
	import useHome from "@/views/pages/save-money/store/modules/home.ts";
    const home_store = useHome();
	const props = defineProps(["id", "isMyEnter", "info", "maxHei", "recover"]);
	const emit= defineEmits(['openTips']);
	
	// const store = uerStore();
	const store=packet_store()
	const isfocus = ref(false);
	const inputEl = ref();
	const input_is_focus = ref(false);
	const placeholderVle = ref("说点什么...");
	const cacheArr = ref([]);
	const inputVal = ref("");
	const keyWordH = ref(0);
	const popupinput = ref();
	const textareaEl = ref();
	const textarea_is_focus = ref(false);
	const uploadImgList = ref([]);
	const messageLength = ref();
	const isDetail = ref(false);
	const recoverId = ref(0);
	const isIos = ref(false);
	const isShowColor = ref(false);
	setTimeout(() => {
		isShowColor.value = true;
	}, 300);
	isIos.value = uni.getSystemInfoSync().platform == "ios";
	// 评论列表请求参数;
	const params = ref({
		rpk_id: props.id,
		page: 1,
		pageSize: 9999,
	});

	// 发送评论请求参数
	const params2 = ref({
		rpk_id: props.id,
		content: "",
		image: "",
		comment_pid: "",
	});

	// 发送评论请求参数
	const params3 = ref({
		page: 1,
		pageSize: 9999,
		comment_pid: 0,
	});

    // 计算评论条数
	const computeLength = () => {
		let num = 0;
		store.reviewList.items?.forEach((item) => {
			num += item.count_level;
		});
		num += store.reviewList.items?.length;
		messageLength.value = num;
	};

	onLoad((route) => {
		store.getQuickSend()
		isDetail.value = route.id;
		store.commentList({ ...params.value }).then(() => {
			computeLength();
			if (props.recover) {
				set_sort();
			}
		}); //请求评论列表
	});

	// 发送评论
	const pushMessage = async (e) => {
		// textareaEl.value.blur();
		textarea_is_focus.value = false;
		input_is_focus.value = false;
		popupinput.value.close();
		params2.value.image = "";
		if (uploadImgList.value.length > 0) {
			params2.value.image = uploadImgList.value[0].urlUp;
		}
		if (!uni.getStorageSync("isLogin")) {
			uni.navigateTo({
				url: "/views/pages/mine/login?isHome=true",
			});
			return;
		}
		if (params2.value.content.trim() === "" && !params2.value.image) return; //非空校验
		if (placeholderVle.value == "说点什么...") {
			//回复之后再次发送评论需要清除父级id
			params2.value.comment_pid = "";
		} else {
			params2.value.comment_rid = recoverId.value;
		}
		store.comment({ ...params2.value }).then(async () => {
			uploadImgList.value = [];
			// 发送评论
			if (placeholderVle.value == "说点什么...") {
				sendLevel1();
			} else {
				sendLevel2();
			}
		});
		uni.showToast({
			title: "已发送",
			duration: 2000,
		});
		// 同步评论数量
	};

    // 初始化输入框
	const initPlas = () => {
		params2.value.content = "";
		placeholderVle.value = "说点什么...";
	};

	// 发送一级评论
	const sendLevel1 = async () => {
		await store.commentList({ ...params.value });
		cacheArrEvent();
		computeLength();
		props.info.comment_nums = messageLength.value;
		initPlas();
	};

	// 发送二级评论
	const sendLevel2 = async () => {
		const data = await store.levelComment({ ...params3.value }); //评论回复列表
		await store.commentList({ ...params.value });
		cacheArrEvent();
		computeLength();
		props.info.comment_nums = messageLength.value;
		store.reviewList.items.forEach((item, index) => {
			//将二级评论插入列表
			if (item.id == params3.value.comment_pid) {
				item.level_comment = data.items;
				item.level_comment_Num = data.items.length;
			}
			initPlas();
		});
	};

	// 回复事件
	const recoverEvent = (id, item) => {
		placeholderVle.value = "回复:" + item.nickname;
		params3.value.comment_pid = id;
		params2.value.comment_pid = id;
		recoverId.value = item.id;
		open_review_event();
	};

	// 获取父级名称
	const getParentName = (id) => {
		let obj = store.reviewList.items.find((item) => item.id == id);
		return obj.nickname;
	};

	// 展开评论
	const unfold_message = async (item) => {
		if (isLoginEvent()) return;
		if (!item.level_comment_Num) {
			// 如当前没有展开则请求二级列表进行展开
			params3.value.comment_pid = item.id;
			const data = await store.levelComment({ ...params3.value });
			item.level_comment = data.items;
			cacheArr.value.push(item);
		}
		item.level_comment_Num = item.count_level;
	};

	// 点赞评论
	const praise_message_event = async (id, item) => {
		if (isLoginEvent()) return;
		const data = await store.like({ id,type:2 });
		praise_Event(item, data);
	};

	const praise_Event = (item, data) => {
		item.is_like = data.status == 1;
		item.like_nums = data.like_nums;
		item.is_tread = data.tread_status == 1;
		item.tread_nums = data.like_nums;
		console.log(data)
	};

	const likeComment_throttle = _.throttle(praise_message_event, 1000, {trailing: false});

	// 将本地缓存展开数量插入最新请求列表中
	const cacheArrEvent = () => {
		cacheArr.value.forEach((item) => {
			store.reviewList.items.forEach((items, index) => {
				if (item.id == items.id) {
					if ((placeholderVle.value = "说点什么...")) {
						//评论一级列表则将存储的数组完全替换
						store.reviewList.items[index] = item;
					} else {
						// 回复二级列表则只替换展开数量
						items.level_comment_Num = item.level_comment_Num;
					}
				}
			});
		});
	};

    // 开始输入
	const focusEvent = (value, height) => {
		keyWordH.value = value.detail.height;
		popupinput.value.open("bottom");
	};

    // 点赞
	const clickLike = () => {
		if (isLoginEvent()) return;
		store.like({ id: props.id ,type:1}).then((res) => {
			if (!res) return;
			if (props.info.is_like > 0) {
				props.info.is_like = 0;
				props.info.like_nums = isNumber(props.info.like_nums, "-");
			} else {
				props.info.is_like = 1;
				props.info.like_nums = isNumber(props.info.like_nums, "+");
			}
			if (isDetail.value) {
				store.currentInfo.is_like = props.info.is_like;
				store.currentInfo.like_nums = props.info.like_nums;
			}
		});
	};

	const praiseEvent = async() => {
		if(props.info?.is_reward) return myShowToast('已打赏过该红包','none')
		 await store.reward({rpk_id:props.info.rpk_id})
		 props.info.is_reward = true

		 myShowToast(`打赏成功，已扣除${store.packet_detail.reward_gold_num}金币`,'none')
		 await home_store.getGoldList({page: 1,  pageSize: 15});
        //  emit('openTips','账户金币不足，无法打赏')
	}; 
    // 点赞节流函数
	const favoriteEvent_throttle = _.throttle(clickLike, 1000, { trailing: false });
           
	const praiseEvent_throttle = _.throttle(praiseEvent, 1000, { trailing: false });

	let isUplodImg = ref(false);

	// 图片上传
	const updataImgs = async () => {
		uploadImgList.value = [];
		uploadImg(uploadImgList.value, 1, keywrod_up_event).then(() => { });
	};

    // 监听图片上传后弹起页面
	watch(
		() => uploadImgList.value[0],
		() => {
			keywrod_up_event();
		}
	);

	const keywrod_up_event = () => {
		uni.hideTabBar();
		popupinput.value.open("bottom");
		textarea_is_focus.value = true;
	};

	// 删除图片
	const deletImgEvent = (index : number) => {
		uploadImgList.value.splice(index, 1);
	};

	// 键盘弹窗监听
	const popupinput_change = (e) => { };

	// 动态手机文本框内容
	const change_textarea = (e) => {
		params2.value.content = e.detail.value;
	};

	const lookImg = (url) => {
		uni.previewImage({
			current: 0, // 当前显示图片的索引值
			urls: [url], // 需要预览的图片列表，photoList要求必须是数组
			loop: true, // 是否可循环预览
		});
	};

	// 打开评论键盘
	const open_review_event = () => {
		if (isLoginEvent()) return;
		popupinput.value.open("bottom");
		textarea_is_focus.value = true;
	};

	// 关闭键盘
	// 打开评论键盘
	const close_review_event = () => {
		textarea_is_focus.value = false;
	};

	// 跳转个人中心
	const toUser = (data) => {
		uni.navigateTo({
			url: "/views/pages/mine/user-page?user_id=" + data.user_id,
		});
	};

	// 是否登录
	const isLoginEvent = () => {
		if (!uni.getStorageSync("isLogin")) {
			uni.navigateTo({
				url: "/views/pages/mine/login?isHome=true",
			});
			return true;
		}
	};
    // 监听键盘高度变化
	const onKeyboardHeightChange = (res) => {
		if (!res.height) {
			setTimeout(() => {
				return hanndler();
			}, 0);
		}
	};

	onMounted(() => {
		uni.onKeyboardHeightChange(onKeyboardHeightChange);
	});

	onUnmounted(() => {
		uni.offKeyboardHeightChange(onKeyboardHeightChange);
	});

	const hanndler = () => {
		popupinput.value.close();
	};

	//将回复的消息置顶
	const set_sort = () => {
		let info = store.reviewList.items.find((item) => item.id == props.recover);
		let index = store.reviewList.items.findIndex(
			(item) => item.id == props.recover
		);
		store.reviewList.items.splice(index, 1);
		store.reviewList.items.unshift(info);
	};

	// 快捷发送
	const fastSend=(value:string)=>{
		params2.value.content=value
		pushMessage()
	}
 
    // 私聊
	const sendMessage = () => {
     messageApi.get_user_chat_info({ user_id: props.info.user.user_id}).then((res) => {
	if(uni.getStorageSync('userInfo').id==props.info.user.user_id) return myShowToast('不能和自己私聊','none')
    if (res.code == 200) {
      const { is_login_attention, is_user_attention, is_login_black, is_user_black, is_chat_me } = res.data;
      let title = '';
      if (!is_chat_me) {
        title = '对方已关闭私聊功能';
      } else if (is_user_black) {
        title = '已被对方拉黑';
      } else if (is_login_black) {
        title = '已把对方拉黑';
      }
      if (title) {
        uni.showToast({
          title: title,
          duration: 2000,
          icon: "none",
        });
        return;
      }
      uni.navigateTo({
        url: `/views/pages/message/chat?&user_id=${props.info.user.user_id}&user_avatar=${props.info.user.avatar}&user_name=${props.info.user.nickname || props.info.user.user_name}&is_login_attention=${is_login_attention}`,
      });
    } else {
      uni.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      })
    }
  }).catch((err) => {
      uni.showToast({
        title: err,
        icon: 'none',
        duration: 2000
      })
  })
};
</script>

<style lang="less" scoped>
	// @import "@/views/styles/common.scss";
  
     .text-active{
		color:#FF3322 ;
	 }
	.fast-box {
		margin-bottom: 31rpx;
		margin-top: 23rpx;

		.fast-box-title {
			font-size: 24rpx !important;
			color: #777;
			flex-shrink: 0;
		}

		.fast-box-scroll {
			display: flex;
			flex-direction: row;

			.fast-item {
				flex-shrink: 0;
				margin-top: 4rpx;
			}
		}

		.fast-item {
			padding: 0 12rpx;
			border-radius: 8rpx;
			background: #F5F5F5;
			margin-right: 16rpx;
		}

		.fast-item-text {
			font-size: 24rpx;
			color: #777;
		}
	}



	.item-right-img {
		margin-top: 12rpx;
	}

	.delete-img {
		width: 32rpx;
		height: 32rpx;
		background: #777777;
		border-radius: 32rpx;
		position: absolute;
		top: 0rpx;
		right: 0rpx;
	}

	.img-bottom {
		margin-top: 20rpx;
	}

	.image-item {
		padding: 10rpx;
		margin-right: 14rpx;
		position: relative;
	}

	.image-item-img {
		border-radius: 8rpx;
	}

	.send-btn {
		width: 96rpx;
		height: 56rpx;
		margin-left: 32rpx;
		border-radius: 16rpx;
		background: linear-gradient(to right, #FF3221, #FFA32A);
	}

	.textareas {
		width: 550rpx;
		background: #f5f6f6;
		min-height: 88rpx !important;
		border-radius: 16rpx;
		padding-top: 20rpx;
		padding-left: 24rpx;
		padding-bottom: 20rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
		box-sizing: content-box;
		// min-height: 40rpx;
	}

	.icon-item {
		margin-left: 36rpx;
		// width: 62rpx;
	}

	.popupinput-box {
		width: 750rpx;
		// height: 500rpx;
		background: #fff;
		padding: 16rpx 32rpx;
		padding-right: 0rpx;
		// padding-bottom: 400rpx;
	}

	.review-num {
		margin-top: 48rpx;

		.text {
			font-size: 32rpx;
			color: #111111;
			font-weight: 600;
		}
	}

	.item-right-is_like {
		margin-left: 6rpx;
		margin-right: 24rpx;
		color: #777777;
		font-size: 22rpx;
	}

	.isunfold {
		.text {
			color: #006788;
			font-family: "PingFang SC";
			font-size: 26rpx;
			font-style: normal;
			font-weight: 400;
			// line-height: normal;
		}
	}

	.item-right-center {
		color: #111111;
		font-family: "PingFang SC";
		font-size: 26rpx;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	.parent-name {
		color: #777777;
	}

	.input-placeholde {
		font-size: 24rpx;
	}

	.scroll-box {
		// height: 650rpx;
		padding-bottom: 250rpx;
		// padding-right: 32rpx;
	}

	.scroll-maxHei {
		height: 720rpx;
		padding-bottom: 50rpx;
	}

	.item-right-bottom-right,
	.review-item-child-box {
		display: flex;
		flex-direction: row;

		// align-items: center;
		.avatar {
			margin-bottom: 4rpx !important;
		}
	}

	.review-item-child-box {
		margin-top: 40rpx;
	}

	.review-item-child {
		display: flex;
		flex-direction: row;

		.item-right-center {
			width: 550rpx;
		}

		.item-right-bottom {
			width: 530rpx;
		}
	}

	.review-item {
		display: flex;
		flex-direction: column;

		.item-parent {
			display: flex;
			flex-direction: row;
			margin-top: 40rpx;
		}

		.item-child {
			display: flex;
			flex-direction: column;
			padding-left: 75rpx;

			.avatar {
				border-radius: 40rpx;
				margin-bottom: 4rpx;
			}
		}

		.item-left {
			margin-right: 24rpx;

			.avatar {

				border-radius: 56rpx;
			}
		}

		.item-right {
			width: 590rpx;

			.item-right-top {
				color: #777777;
				font-family: "PingFang SC";
				font-size: 24rpx;
				font-style: normal;
				font-weight: 400;
				margin-bottom: 12rpx;
                flex-shrink: 0;
			}

			.sex-image {
				width: 24rpx;
				height: 24rpx;
				margin-bottom: 12rpx;
				margin-left: 16rpx;
			}
		}	.vip-image{
						width: 24rpx;
						height: 24rpx;
						margin-left: 8rpx;
						margin-top: -14rpx;
			}

		.item-right-bottom {
			display: flex;
			flex-direction: row;
			margin-top: 14rpx;
			justify-content: space-between;

			.item-right-bottom-left {
				display: flex;
				flex-direction: row;

				.item-right-time {
					color: #777777;
					font-family: "PingFang SC";
					font-size: 22rpx;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
				}

				.item-right-recover {
					font-size: 22rpx;
					margin-left: 32rpx;
				}
			}
		}
	}

	.footer {
		width: 750rpx;
		background: #fff;
		// position: absolute;
		min-height: 120rpx;
		border-top: solid 2rpx #eee;
		// //   background: red;
		position: fixed;
		// position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		bottom: 0rpx;
		// left: -32rpx;
		padding-left: 32rpx;

		// bottom: 50px;
		.input {
			// padding-top: 20rpx;
			width: 438rpx;
			height: 72rpx;
			background: #f5f6f6;
			border-radius: 16rpx;
			padding-left: 82rpx;
			// position: absolute;
			// bottom: 200rpx
		}
	}

	.edit-pens {
		position: absolute;
		top: 42rpx;
		z-index: 122;
		left: 62rpx;

		.user-edit-icon {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.header-bth {
		display: flex;
		width: 112rpx;
		height: 48rpx;
		padding: 20rpx;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		border-radius: 32rpx;
		background: #1cdafe;

		.text {
			color: #fff;
			font-size: 24rpx;
			font-weight: 600;
		}
	}

	.header-left {
		display: flex;
		flex-direction: row;
		align-items: center;

		.text {
			color: #111111;
			font-size: 28rpx;
			font-weight: 600;
		}

		.avatar {
			margin-right: 24rpx;
			border-radius: 56rpx;
			border: solid 2rpx #eee;

		}
	}

	.avatar-border {
		border: solid 2rpx #eee;
	}

	.header-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.review-boxs {
		width: 750rpx;
		// height: 1000rpx;
		box-sizing: border-box;
		padding: 32rpx;
		background-color: #fff;
		border-radius: 50rpx 50rpx 0px 0px;
		// position: relative;
		display: flex;
		flex-direction: column;
		// justify-content: space-between;
		// padding: 32rpx;
		padding-bottom: 100rpx;
	}

	.header-bth-active {
		background: #f5f6f6;

		.text {
			color: #777777;
		}
	}

	@keyframes identifier {
		0% {
			background-color: rgba(119, 119, 119, 0.5);
		}

		100% {
			background-color: rgba(0, 0, 0, 0);
		}
	}

	.item-parent {}

	.item-parent-recover {
		background: rgba(0, 0, 0, 0.2);
		transition-property: background-color;
		transition-duration: 2s;
	}

	.color-show {
		background: rgba(0, 0, 0, 0);
	}
</style>