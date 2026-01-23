<template>
  <view
    class="feature-box flex flex-column flex-ac"
    :class="{ isopacity: !props.isopacity }"
  >
    <view class="user-img">
      <image
        class="img"
        :src="video_type == 'video-detail' ? info.avatar : props.mer_info.mer_avatar"
        mode="aspectFill"
        @click="toUser"
      ></image>
      <image
        class="iconimg1"
        :src="imgUrlEvent('/images/wx-applet/home/jiahaoyou.png', 'aliyunImgUrl')"
        mode=""
        @click.stop="followEvent"
        v-if="!props.mer_info.is_follow && video_type != 'video-detail'"
      ></image>
    </view>
    <view class="feature-item" @click.stop="praiseEvent_throttle">
      <image
        style="width: 60rpx; height: 60rpx"
        :src="
          props.info.is_like
            ? imgUrlEvent('/images/kkyz/home-video-img2.png', 'aliyunImgUrl')
            : imgUrlEvent('/images/kkyz/home-video-img1.png', 'aliyunImgUrl')
        "
      ></image>
      <view class="number-text"
        ><text class="text1">{{ props.info.like_nums || 0 }}</text></view
      >
    </view>
    <!-- <view
      class="feature-item"
      @click.stop="commentEvent"
      v-if="props.info.video_type == 'user_post' || video_type == 'video-detail'"
    >
      <image
        style="width: 60rpx; height: 60rpx"
        :src="imgUrlEvent('/images/kkyz/home-video-img5.png', 'aliyunImgUrl')"
      ></image>
      <view class="number-text"
        ><text class="text1">{{ props.info.comment_nums }}</text></view
      >
    </view> -->
    <view
      class="feature-item"
      @click.stop="favoriteEvent_throttle"
      v-if="props.info.video_type == 'user_post' || video_type == 'video-detail'"
    >
      <image
        style="width: 60rpx; height: 60rpx"
        :src="
          props.info.is_favorite
            ? imgUrlEvent('/images/kkyz/home-video-img4.png', 'aliyunImgUrl')
            : imgUrlEvent('/images/kkyz/home-video-img3.png', 'aliyunImgUrl')
        "
      ></image>
      <view class="number-text"
        ><text class="text1">{{ props.info?.favorite_nums || 0 }}</text></view
      >
    </view>
    <button open-type="share" class="feature-item" @click="shareVideo">
      <image
        style="width: 60rpx; height: 60rpx"
        :src="imgUrlEvent('/images/kkyz/home-video-img6.png', 'aliyunImgUrl')"
      ></image>
      <view class="number-text"
        ><text class="text1">{{ props.info.share_nums }}</text></view
      >
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { imgUrlEvent } from "/infrastructure/utils/imgUrls";
import { isNumber, checkTokenEventAst } from "/infrastructure/utils/util";
import _ from "lodash";
import uerStore from "/business/store/modules/home.ts";
import { homeApi, teachingApi, mineApi } from "@/business/api/index.ts";
const emit = defineEmits([
  "FullScrren",
  "open_review",
  "open_shear_event",
  "loginCallback",
  "open",
]);
const store = uerStore();
const props = defineProps([
  "info",
  "infoindex",
  "isopacity",
  "type",
  "mer_info",
  "video_type",
]);
const is_ios = ref(false);
const login_modal = ref();
const is_show_modal = ref(false);
const is_login = ref(uni.getStorageSync("isLogin"))
is_ios.value = uni.getSystemInfoSync().platform == "ios";

// 校验登录状态
async function checkLogin() {
  // 判断token是否过期
  if (!(await checkTokenEventAst())) {
    emit('open')
    return true;
  }
}
// 点赞
async function praiseEvent() {
  if (await checkLogin()) return;
  const res =
    props.info.video_type == "teach_post"
      ? await teachingApi.postlikeApi({ id: props.info.id })
      : await store.likeApi({ id: props.info.id });
  console.log(res, props.info, "props.info");
  if (props.info.is_like > 0) {
    props.info.is_like = 0;
    props.info.like_nums = isNumber(props.info.like_nums, "-");
  } else {
    props.info.is_like = 1;
    props.info.like_nums = isNumber(props.info.like_nums, "+");
  }
}

async function commentEvent() {
  if (await checkLogin()) return;
  emit("open_review", true);
}

// 收藏事件
async function favoriteEvent() {
  // 判断token是否过期
  if (await checkLogin()) return;
  store.favoriteApi({ id: props.info.id }).then((res) => {
    if (!res) return;
    if (props.info.is_favorite > 0) {
      props.info.is_favorite = 0;
      props.info.favorite_nums = isNumber(props.info.favorite_nums, "-");
    } else {
      props.info.is_favorite = 1;
      props.info.favorite_nums = isNumber(props.info.favorite_nums, "+");
    }
  });
}

const favoriteEvent_throttle = _.throttle(favoriteEvent, 1000, {
  trailing: false,
});
const praiseEvent_throttle = _.throttle(praiseEvent, 1000, { trailing: false });
async function shareEvent() {
  if (await checkLogin()) return;
  // emit("open_shear_event");
}

function toast(title = "暂未开放，敬请期待") {
  uni.showToast({
    icon: "none",
    title,
    duration: 2000,
  });
};
// 双击点赞
uni.$on("Dblike_evnt", function (data) {
  console.log(data.index, props.infoindex);
  if (data.index == props.infoindex) {
    console.log(data.item);
    if (!props.info.islike) {
      console.log("成功点赞");
      praiseEvent_throttle();
    }
  }
});

async function followEvent() {
  if (await checkLogin()) return;
  if (props.mer_info.is_follow) return;
  await homeApi.RelationCreateApi({
    type: "10",
    type_id: props.mer_info.mer_id,
  });
  props.mer_info.is_follow = true;
  toast("关注成功");
  // uni.$emit("isfollow_user", props.info.user_id, true);
};

function loginCallback() {
  emit("loginCallback",true);
  is_login.value = uni.getStorageSync("isLogin")
}

const toUser = () => {
  let id = props.mer_info.merchant_type == 'seller' ? props.mer_info.mer_uid : props.mer_info.mer_id
  uni.navigateTo({
    url: `/views/pages/home/store?mer_id=${id}&mer_type=${props.mer_info.merchant_type}`,
  });
};
//分享事件
async function shareVideo() {
  if(!is_login.value) return
  const {data} = props.info.video_type == 'teach_post' ? await homeApi.shareTeachVideoApi({id:props.info.id}) : await homeApi.shareVideoApi({id:props.info.id})
  props.info.share_nums = data.share_nums
}
</script>

<style lang="less" scoped>
.feature-box {
  position: absolute;
  right: 20rpx;
  bottom: 100rpx !important;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feature-item {
  margin-bottom: 40rpx;
  background: rgba(0, 0, 0, 0);
}

.number-text {
  // margin-top: 12rpx;
  text-align: center;
  .text1 {
    font-size: 24rpx;
    color: #ffffff;
    text-align: center;
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
  }
}

.isopacity {
  display: none !important;
  opacity: 0 !important;
}
.user-img {
  width: 97rpx;
  height: 97rpx;
  border-radius: 50%;
  position: reactive;
  margin-bottom: 50rpx;
  position: relative;

  .img {
    width: 97rpx;
    height: 97rpx;
    border-radius: 50%;
    border: 3rpx solid #ffffff;
  }
  .iconimg1 {
    width: 36rpx;
    height: 36rpx;
    bottom: -20rpx;
    right: 30rpx;
    position: absolute;
    z-index: 1;
  }
}
</style>
