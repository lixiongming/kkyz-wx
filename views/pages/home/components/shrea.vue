<template>
  <view class="shear-box">
    <view class="flex jc-sb">
      <text style="width: 48rpx"> </text>
      <text>分享至</text>
      <u-icon name="close" @click="outPopup" color="#111111" size="18"></u-icon>
    </view>
    <view class="popup-bottom flex jc-sb flex-wrap">
      <view
        class="share-list flex flex-column flex-ac"
        v-for="(item, index) in isMyEnter ? shareList : shareList2"
        @click="shareEvent(item.id)"
        :key="index"
      >
        <image :src="item.url" alt="" class="share-img"></image>
        <text>{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { ref, computed, watch } from "vue";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import uerStore from "@/business/store/modules/mine.ts";
import { homeApi } from "/business/api/index.ts";
const store = uerStore();
const emit = defineEmits(["close_shear", "openModel"]);
const props = defineProps(["info"]);
const modalEl = ref();
const isMyEnter = ref(false);
const shareUrl = ref(uni.$config.shareAppUrl+'/views/pages/mine/pages/appDownload/index?parent_code='+ store.ShareInfo.user.user_code);
console.log(shareUrl.value)

onLoad((e) => {
  isMyEnter.value = e.isMyEnter;
});

const shareList = ref([
  { id: 2, url: imgUrlEvent("/images/mine/share2.png"), name: "微信" },
  { id: 3, url: imgUrlEvent("/images/mine/share3.png"), name: "朋友圈" },
  { id: 1, url: imgUrlEvent("/images/mine/share1.png"), name: "复制链接" },
  { id: 4, url: imgUrlEvent("/images/mine/bianji1.png"), name: "编辑" },
  { id: 5, url: imgUrlEvent("/images/mine/bianji2.png"), name: "删除" },
  { id: 6, url: imgUrlEvent("/images/mine/bianji3.png"), name: "置顶到主页" },
]);
const shareList2 = ref([
  { id: 2, url: imgUrlEvent("/images/mine/share2.png"), name: "微信" },
  { id: 3, url: imgUrlEvent("/images/mine/share3.png"), name: "朋友圈" },
  { id: 1, url: imgUrlEvent("/images/mine/share1.png"), name: "复制链接" },
]);

// 分享事件
const shareEvent = (id) => {
  switch (id) {
    case 1:
      copyEvent();
      //   initCanvas(bannerList.value[curSwiperIndex.value]);
      break;
    case 2:
      wxShareFn(true);
      break;
    case 3:
      wxShareFn(false);
      break;
    case 4:
      setContent();
      break;
    case 5:
      deleteContent();
      break;
    case 6:
      topEVent();
      break;
    default:
      break;
  }
};

const copyEvent = () => {
  uni.setClipboardData({
    data: shareUrl.value,
    success: function () {
      uni.showToast({
        title: "复制成功",
        duration: 2000,
      });
    },
  });
};

// 微信分享
function wxShareFn(data) {
  store.getShareInfoApi().then((res) => {
		openShare(res.info||'看见更好的未来',data)
	}).catch(() => {
		openShare('看见更好的未来',data)
	})
 
}

const openShare=(info,data)=>{
 uni.share({
    provider: "weixin",
    scene: data ? "WXSceneSession" : "WXSceneTimeline",
    type: 0,
    href: shareUrl.value,
    title: "看看宇宙",
    summary: info,
	  imageUrl: "http://cdn-v3.kankanyz.com/images/mine/kkyzLogo.jpg",
    success: function (res) {
      uni.showToast({
        title: "分享成功",
        duration: 2000,
      });
    },
    fail: function (err) {
      uni.showToast({
        title: "分享失败",
        icon: "none",
        duration: 2000,
      });
    },
  });
}


const outPopup = () => {
  emit("close_shear");
  uni.$emit('close_shear')
    emit("close_shear");
};

// 编辑动态内容
const setContent = () => {
  let url = "";
  switch (props.info.type) {
    case 1:
      url = `/views/pages/publish/s_notes?id=${props.info.id}`;
      break;
    case 2:
      url = `/views/pages/publish/s_article?id=${props.info.id}`;
      break;
    case 3:
      url = `/views/pages/publish/s_video?id=${props.info.id}`;
      break;
  }
  if (props.info.type == 1 && props.info.more_than_3_days)
    return uni.showToast({
      title: "发布超过3天无法修改",
      icon: "none",
      duration: 2000,
    });

  uni.navigateTo({
    url,
  });
};

// 删除
const deleteContent = () => {
  emit("openModel");
};
// 置顶
const topEVent = async () => {
  try {
    const { data } = await homeApi.topAPi({ id: props.info.id });
    uni.showToast({
      title: "置顶成功",
      icon: "none",
      duration: 2000,
    });
  } catch (e) {
    uni.showToast({
      title: "置顶失败",
      icon: "none",
      duration: 2000,
    });
  }
};
</script>

<style lang="less" scoped>
.share-img {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 12rpx;
}

.shear-box {
  padding: 60rpx 32rpx;
  padding-bottom: 80rpx;
  /* min-height: 326rpx; */
  background: #fff;
  border-radius: 40rpx 40rpx 0px 0px;
}
.popup-bottom {
  /* margin-left: 50rpx; */
}

.share-list {
  /* margin-right: 40rpx; */
  margin-top: 40rpx;
  width: 200rpx;
  .share-img {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 12rpx;
  }
}
</style>
