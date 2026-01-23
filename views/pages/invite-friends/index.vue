<template>
  <view class="invite" :style="{ height: hei + 'px' }">
    <scroll-view
      :show-scrollbar="false"
      :scroll-y="true"
      :style="{ height: hei + 'px' }"
    >
      <view class="backIcon" @click="topage('login')">
        <u-icon name="arrow-leftward" color="#111111" size="24"></u-icon>
      </view>
      <view class="title"><text class="text">邀请好友</text></view>
      <view class="name"
        ><text class="text">加入看看星球 组建专属团队</text></view
      >
      <view class="content">
        <image
          :src="imgUrlEvent('/images/mine/invite_star.png')"
          alt=""
          class="star_img" 
        ></image> 
        <image  
          :src="imgUrlEvent('/images/mine/invite_chunk_header.png')"
          alt=""
          class="header_img"
        ></image>

        <image
          :src="imgUrlEvent('/images/mine/invite_chunk_fotter.png')"
          alt=""
          class="fotter_img"
        ></image>
        <image
          :src="imgUrlEvent('/images/mine/invite_chunk_midden.png')"
          alt=""
          class="midden_img"
        ></image>
        <view class="team_title"><text class="text">我的推荐人：</text></view>
        <view class="team_num" ><text class="text">{{ store.ShareInfo.parent_user?.nickname||'无' }}</text></view>
        <view class="set-btn" @click="setReferrer" v-if="!store.ShareInfo.parent_user?.nickname"><text class="set-btn-text">设置推荐人</text></view>
        <view class="vessel flex flex-ac jc-sb">
          <text class="vs_title">邀请码</text>
          <view class="vs_key flex"
            ><text
              v-for="item in store.ShareInfo.user.user_code"
              :key="index"
              class="text"
              >{{ item }}</text
            ></view
          >
          <view class="vs_nape flex jc-ct flex-ac" @click="copyEvent(false)">
            <text class="vs_copy">复制</text>
          </view>
        </view>
        <view class="share flex flex-ac jc-sb">
          <text class="sa_title">邀请链接</text>
          <view class="sa_warp flex flex-ac jc-sb">
            <text class="sa_url nowrap">{{ shareUrl }}</text>
            <view class="sa_nape flex jc-ct flex-ac" @click="copyEvent(true)">
              <text class="sa_copy">复制</text>
            </view>
          </view>
        </view>
      </view>
      <button class="create flex jc-ct flex-ac" @click="openPopup">
        <text class="text">生成邀请图片</text>
      </button>
      <view class="my-team" v-if="store.ShareInfo.list.length > 0">
        <view class="my-team-title"><text class="text">我的团队</text></view>
        <scroll-view
          class="team-scroll"
          :style="{ 'maxHeight': hei - 190 * 2 + 'rpx' }"
          :show-scrollbar="false"
          :scroll-y="true"
        >
          <view
            class="my-team-item flex jc-sb"
            v-for="(item,index) in store.ShareInfo.list"
            :key="index"
          >
            <view class="team-left flex flex-ac">
              <image :src="item?.avatar" alt="" class="team-avatar"></image>
              <view class="team-name"
                ><text class="text">{{ item?.nickname }}</text></view
              >
            </view>
            <view class="team-time"
              ><text class="text">{{ item?.created_at }}</text></view
            >
          </view>
        </scroll-view>
      </view>
      <uni-popup
        ref="popup"
        type="bottom"
        border-radius="10px 10px 0 0"
        :safe-area="false"
        background-color="#fff"
      >
        <view class="popup-box">
          <view class="popup-top">
            <swiper
              class="swiper"
              circular
              @change="swiperChange"
              :autoplay="false"
              next-margin="100rpx"
              previous-margin="100rpx"
              current="0"
            >
              <swiper-item v-for="(item, index) in bannerList" :key="index">
                <view class="swiper-item uni-bg-red">
                  <view :id="'merge' + index">
                    <image :src="item" alt="" class="swiper-img"></image>
                    <view class="swiper-bottom flex jc-sb flex-ac">
                      <view class="swiper-bottom-left flex flex-dc">
                        <image
                          :src="imgUrlEvent('/images/mine/kkyz_logo.png')"
                          alt=""
                          class="kkyz_logo"
                        ></image>
                      </view>
                      <view class="swiper-bottom-right">
                        <uv-qrcode
                          ref="qrcode"
                          :value="shareUrl"
                          size="100rpx"
                          :options="options"
                        ></uv-qrcode>
                      </view>
                    </view>
                  </view>
                </view>
              </swiper-item>
            </swiper>
          </view>
          <view class="popup-bottom flex jc-ct">
            <view
              class="share-list flex flex-column flex-ac"
              v-for="(item, index) in shareList"
              @click="shareEvent(item.id)"
              :key="index"
            >
              <image :src="item.url" alt="" class="share-img"></image>
              <text>{{ item.name }}</text>
            </view>
          </view>
          <view class="out-popup flex jc-ct">
            <u-icon
              name="close"
              @click="outPopup"
              color="#111111"
              size="24"
            ></u-icon>
          </view>
        </view>
      </uni-popup>
      <view 
        id="canvas-container"
        class="canvas-container"
        style="width: 0; height: 0; overflow: hidden; z-index: -9999"
      >
        <canvas
          id="myCanvas"
          canvas-id="myCanvas"
          style="width: 600px; height: 1000px; background: #ffffff"
        ></canvas>
      </view>
      <view style="height: 50rpx"></view>
    </scroll-view>
    <!-- 修改推荐人弹框 -->
    <Imodal ref="modal_el" @close="modalClose" @confirm="modalConfirm"  :content="'设置推荐人'">
       <template v-slot:title>    
        <view class="modal-title"><text>推荐人邀请码</text></view>
        <input v-model="inputValue" placeholder="请输入推荐人邀请码"  placeholder-style="font-size: 28rpx;color:#CCCCCC" class="inputel"/>
        <view class="modal-tips"><text class="modal-tips-text">提示：推荐人有且只有一次自主设置机会，请确认好后操作</text></view>
       </template>
    </Imodal>
  </view>
</template>

<script setup lang="ts">
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import uerStore from "@/business/store/modules/mine";
import uvQrcode from "@/uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.vue";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import { ref, onMounted, getCurrentInstance } from "vue";
import logoImg from "/static/images/home/kkyzLogo.png";
import html2canvas from "html2canvas";
import Imodal from "@/views/components/i-modal.vue";
import { switchTab } from '@/infrastructure/utils/system';
const store = uerStore();
const hei = uni.getSystemInfoSync().windowHeight;
const popup = ref();
const bannerList = ref([]);
const inputValue=ref('')
const modal_el=ref()
let shareUrl = ref(
  uni.$config.shareAppUrl+"/views/pages/mine/pages/appDownload/index?parent_code=" +
    store.ShareInfo.user.user_code
);
let isLogin = ref();
// 领取金币弹窗
const claim_coins_popup = ref();
onShow(() => {
  isLogin.value = uni.getStorageSync("isLogin"|| false);
});
onLoad((options) => {
  getPromotion()
  getShareImage()
});

const shareList = ref([
  { id: 1, url: imgUrlEvent("/images/mine/share1.png"), name: "保存图片" },
  { id: 2, url: imgUrlEvent("/images/mine/share2.png"), name: "微信" },
  { id: 3, url: imgUrlEvent("/images/mine/share3.png"), name: "朋友圈" },
]);
const qrcode = ref();
const options = {
  foregroundImageSrc: logoImg
};
// 当前分享图下标
const curSwiperIndex = ref(0);
const topage = (data) => {
  // if (isLogin.value) return
  let url = "";
  switch (data) {
    case "login":
      url = "/views/pages/mine/index";
      break;
  }

  uni.switchTab({
    url,
  });
  // switchTab(url);
};

const getPromotion=()=>{
  store.promotionApi().then(() => {
    shareUrl.value = uni.$config.shareAppUrl+"/views/pages/mine/pages/appDownload/index?parent_code=" + store.ShareInfo.user.user_code;
  });
}

const getShareImage=()=>{
  store.shareImage().then((res) => {
    bannerList.value = res;
  });
}

const copyEvent = (num) => {
  uni.setClipboardData({
    data: num ? shareUrl.value : store.ShareInfo.user.user_code,
    success: function () {
      uni.showToast({
        title: "复制成功",
        duration: 2000,
      });
    },
  });
};

const openPopup = () => {
  popup.value.open("bottom");
};

const outPopup = () => {
  popup.value.close();
};

/**
 * 获取轮播下标
 */

function swiperChange(e) {
  curSwiperIndex.value = e.detail.current;
}

const initCanvas = (img) => { 
  uni.downloadFile({
    url: img,
    success(res1) {
      uni.downloadFile({
        url: "http://cdn-v3.kankanyz.com/images/mine/kkyz_logo.png",
        success(res2) {
          store.createQrcode({ url: shareUrl.value }).then((res) => {
            uni.downloadFile({
              url: res.qrcode_url,
              success(res3) {
                uni.showLoading({
                  title: "图片生成中...",
                  mask: true,
                });
                createCanvas(
                  res1.tempFilePath,
                  res2.tempFilePath,      
                  res3.tempFilePath
                );
              },
            });
          });
        },
      });
    },
  });
};

// 获得当前组件实例
const instance = getCurrentInstance();

const createCanvas = (imgUrl1, imgUrl2, imgUrl3) => {
  var ctx = uni.createCanvasContext("myCanvas", instance); //创建画布
  uni
    .createSelectorQuery()
    .select("#canvas-container")
    .boundingClientRect(function (rect) {
      ctx.setFillStyle("#FFFFFF");
      ctx.fillRect(0, 0, 600, 1000);
      ctx.save();
      if (imgUrl1) {
        ctx.drawImage(imgUrl1, 0, 0, 600, 845);
        ctx.save();
      }
      if (imgUrl2) {
        ctx.restore();
        ctx.drawImage(imgUrl2, 42, 888, 233.5, 69);
        ctx.save();
      }
      if (imgUrl3) {
        ctx.restore();
        ctx.drawImage(imgUrl3, 460, 872, 100, 100);
        ctx.save();
      }
    })
    .exec(() => {
      setTimeout(function () {
        ctx.draw(false, () => {
          saveShareImg();
        });
      }, 1000);
    });
};

const saveShareImg = () => {
  setTimeout(function () {
    uni.canvasToTempFilePath(
      {
        x: 0,
        y: 0,
        width: 600,
        height: 1000,
        destWidth: 600,
        destHeight: 1000,
        canvasId: "myCanvas",
        success: function (res) {
          uni.hideLoading();
          var tempFilePath = res.tempFilePath;
          uni.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              uni.showToast({
                title: "图片已保存到相册",
                icon: "none",
                duration: 2000,
              });
            },
            fail: function (res) {
              uni.showToast({
                title: "分享失败",
                icon: "none",
                duration: 2000,
              });
            },
          });
        },
      },
      instance
    );
  }, 3000);
};

// 微信分享
function wxShareFn(data) {
	store.getShareInfoApi().then((res) => {
		// console.log(res,'222222');
		openShare(res.info||'看见更好的未来',data)
	}).catch(() => {
		openShare('看见更好的未来',data)
	})
}

const openShare = (info,data)=>{
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

// 朋友圈分享
function friendShareFn() {}

// 分享事件
const shareEvent = (id) => {
  switch (id) {
    case 1:
      initCanvas(bannerList.value[curSwiperIndex.value]);
      break;
    case 2:
      wxShareFn(true);
      break;
    case 3:
      wxShareFn(false);
      break;
    default:
      break;
  }
};

// 打开修改推荐人弹框
const setReferrer=()=>{
 modal_el.value.open()
}
// 关闭修改推荐人弹框
const modalClose=()=>{
   modal_el.value.close()
}
// 修改推荐人
const modalConfirm=async()=>{
  if(inputValue.value.trim()==''){
	    uni.showToast({
	      title: "请输入推荐人邀请码",
	      icon: "none",
	      duration: 2000,
	    });
    return 
  } 
    await store.settingInviteCode({invite_code:inputValue.value})
    modal_el.value.close()
      getPromotion()
    uni.showToast({
	      title: "设置成功",
	      duration: 2000,
	    });
}
</script>

<style lang="less" scoped>
.modal-tips{
  margin-top: 16rpx;
  .modal-tips-text{
    font-size:22rpx ;
    color: #FF3156;
  }
}
:deep(.m_btns){
  margin-top: 56rpx;
}
.inputel{
  // width: 394rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background:#F5F6F6;
  margin-top: 16rpx;
  padding-left: 32rpx;
}
.modal-title{
  font-size:28rpx ;
  color: #111;
  margin-top: 24rpx;
}
.scroll-view {
}
.my-team-item {
  margin-bottom: 12rpx;
}
.out-popup {
  margin-top: 76rpx;
}

.popup-bottom {
  margin-left: 48rpx;
}

.share-list {
  margin-right: 80rpx;
  margin-top: 74rpx;

  .share-img {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 12rpx;
  }
}

.kkyz_logo {
  width: 176rpx;
  height: 52rpx;
}

.swiper-bottom {
  width: 480rpx;
  height: 124rpx;
  background: #fff;
  padding: 0px 24rpx;
}

.swiper-item-box {
  width: 480rpx;
  display: flex;
  justify-content: center;
}

.swiper {
  height: 806rpx;
}

.swiper-item {
  height: 806rpx;
  // background: #1cdafe;
  display: flex;
  flex-direction: column;
  align-items: center;

  .swiper-img {
    width: 480rpx;
    height: 676rpx;
    border-radius: 20rpx 20rpx 0px 0px;
  }
}

.popup-box {
  width: 750rpx;
  height: 1280rpx;
  background-color: #fbfbfb;
  border-radius: 20rpx 20rpx 0px 0px;
  padding-top: 112rpx;
}

.team-name,
.team-time {
  .text {
    font-size: 22rpx;
    color: #053951;
  }
}

.team-time {
  .text {
    color: #4c788c;
  }
}

.team-avatar {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
  vertical-align: bottom;
}

.my-team-title {
  margin-bottom: 16rpx;

  .text {
    color: #053951;
    font-size: 28rpx;
    font-weight: 600;
  }
}

.my-team {
  padding: 32rpx;
  background: #cee7f3;
  border: 2rpx solid #a6cfe2;
  border-radius: 32rpx;
  margin-top: 48rpx;
}

.sa_copy {
  color: #fff;
  font-size: 22rpx;
}

.backIcon {
  position: absolute;
  top: 118rpx;
}

.invite {
  width: 750rpx;
  background: #d9eff9;
  padding: 0 48rpx;
  padding-bottom: 100rpx;
  // position: relative;
  /* #ifdef H5 */
  width: 100%;
  /* #endif */
}

.title {
  color: #053951;
  width: 654rpx;

  // height: 68rpx;
  .text {
    font-size: 48rpx;
    font-weight: 600;
    line-height: 68rpx;
    font-family: "PingFang SC";
  }

  /* #ifdef H5 */
  margin: 0 auto;
  /* #endif */
  padding-top: 220rpx;
}

.name {
  color: #4c788c;
  font-family: "PingFang SC";

  width: 654rpx;

  .text {
    font-size: 24rpx;
    font-weight: 400;
  }

  /* #ifdef H5 */
  margin: 0 auto;
  /* #endif */
  margin-top: 8rpx;
}

.content {
  position: relative;
  width: 654rpx;
  height: 426rpx;
  /* #ifdef H5 */
  margin: 0 auto;
  /* #endif */
  margin-top: 38rpx;
}

.star_img {
  position: absolute;
  right: -39rpx;
  top: -210rpx;
  width: 352rpx;
  height: 352rpx;
  z-index: 10;
}

.header_img {
  position: absolute;
  top: 0;
  left: 0;
  width: 654rpx;
  height: 112rpx;
}

.midden_img {
  position: absolute;
  top: 114rpx;
  left: 0;
  width: 654rpx;
  height: 128rpx;
  z-index: 2;
}

.fotter_img {
  position: absolute;
  top: 210rpx;
  left: 0;
  width: 654rpx;
  height: 144rpx;
  z-index: 1;
}

.team_title {
  width: 654rpx;
  height: 34rpx;
  margin-top: 32rpx;
  margin-left: 32rpx;
  position: absolute;

  .text {
    font-family: "PingFang SC";
    font-size: 24rpx;
    font-weight: 600;
    color: #000000;
    line-height: 34rpx;
  }
}

.team_num {
  margin-top: 22rpx;
  margin-left: 172rpx;
  width: 654rpx;
  height: 56rpx;
  position: absolute;
  // top: 70rpx;

  .text {
    font-size: 24rpx;
    line-height: 56rpx;
    color: #000000;
    font-family: "D-DIN-PRO";
  }
}

.set-btn{
    position: absolute;
    height: 40rpx;
    width: 128rpx;
    border-radius: 16rpx;
    background: linear-gradient(to right, #1CDAFE, #00C2FF);
    display: flex;
    justify-content: center;
    align-items: center;
    left: 230rpx;
    top:30rpx;
    .set-btn-text{
      font-size: 20rpx;
      color: #fff;
    }
}

.vessel {
  position: absolute;
  left: 0;
    top: 114rpx;
  width: 654rpx;
  height: 128rpx;
  padding: 0 32rpx 0 32rpx;
  z-index: 11;
}

.vs_title {
  color: #ffffff;
  font-family: "PingFang SC";
  font-size: 24rpx;
  font-weight: 600;
}

.vs_key {
  color: #1cdafe;
  text-align: center;
  font-family: "PingFang SC";
  margin-left: 10rpx;
  text-transform: uppercase;

  .text {
    color: #1cdafe;
    font-size: 48rpx;
    font-weight: 600;
    margin-right: 10rpx;
  }
}

.vs_nape {
  width: 88rpx;
  height: 48rpx;
  border-radius: 16rpx;
  border: 2rpx solid #fff;
}

.vs_copy {
  color: #ffffff;
  font-family: "PingFang SC";
  font-size: 22rpx;
  font-weight: 600;
}

.share {
  position: absolute;
  left: 0;
  top: 236rpx;
  width: 654rpx;
  height: 114rpx;
  padding: 0 32rpx 0 32rpx;
  z-index: 11;
}

.sa_title {
  color: #111111;
  font-family: "PingFang SC";
  font-size: 24rpx;
  font-weight: 600;
}

.sa_warp {
  width: 458rpx;
  height: 48rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background: #e7eff2;
  padding-left: 24rpx;
}

.sa_url {
  color: #4c788c;
  font-family: "PingFang SC";
  font-size: 24rpx;
  font-weight: 400;
  height: 48rpx;
  width: 330rpx;
  line-height: 48rpx;
}

.sa_nape {
  width: 92rpx;
  height: 48rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background: #111111;
  color: #ffffff;
  font-family: "PingFang SC";
  font-size: 22rpx;
  font-weight: 600;
}

.create {
  /* #ifdef H5 */
  margin: 0 auto;
  /* #endif */
  margin-top: 0rpx;
  width: 654rpx;
  height: 88rpx;
  flex-shrink: 0;
  border-radius: 48rpx;
  //   background: linear-gradient(90deg, #1cdafe 0%, #00c2ff 100%);
  background: #1cdafe;

  font-family: "PingFang SC";
  font-size: 32rpx;
  font-weight: 600;
  text-transform: uppercase;

  .text {
    color: #ffffff;
  }
}
</style>
