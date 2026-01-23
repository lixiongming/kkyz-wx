
<template>
  <view class="home-box" :style="{ height: hei + 'px' }">
    <!-- 店铺标题 -->
    <!-- <view class="mer-info-mask" :style="{height:statusBarHeight + 40 + 'px'}" v-if="type != 'video-detail'"></view>
    <view class="mer-info" :style="{ top: statusBarHeight + 15 + 'px',left: 40 + 'rpx' }" v-if="type != 'video-detail'">
      <text class="text">{{ mer_info.mer_name }}</text>
    </view> -->
    <!-- 视频列表 -->
    <view class="list" :style="{ height: hei + 'px' }">
      <swiper
        class="swiper"
        @change="outEvent"
        v-if="arr.length > 0 || video_detail_list.length > 0"
        vertical
        :style="{ height: hei + 'px' }"
        :duration="200"
      >
        <swiper-item
          v-for="(item, index) in type == 'video-detail' ? video_detail_list : arr"
          :key="index"
          class="swiper-item flex flex-ac jc-ct"
          :class="{ 'swiper-item-active': is_pupop }"
          :style="{ height: hei + 'px' }"
        >
          <view class="video-up flex flex-as jc-ct" :style="{ height: hei + 'px' }">
            <view
              class="Video-box"
              :class="{ 'myVideo-ios': true }"
              :style="{ height: item.hei ? item.hei + 'px' : hei + 'px' }"
              v-if="index < video_index + 2 && index > video_index - 2"
              @click="stopVideo(item, index, $event)"
            >
              <video
                v-if="!isout"
                :id="'Video' + index"
                :enable-progress-gesture="false"
                :auto-pause-if-open-native="true"
                :page-gesture="false"
                :show-fullscreen-btn="false"
                :show-center-play-btn="item.isFullScrren || false"
                :object-fit="
                  !item.isFullScrren &&
                  Number(item.height) > Number(item.width) &&
                  !is_pupop
                    ? 'cover'
                    : 'contain'
                "
                :show-loading="true"
                :data-index="index"
                @timeupdate="timeupdateEvent"
                @play="videoplayEvent(index)"
                @fullscreenchange="fullscreenchangeEvent"
                class="myVideo"
                :class="{
                  'swiper-item-active': is_pupop,
                  'myVideo-ios': true,
                }"
                :controls="item.isFullScrren || false"
                :style="{ height: item.hei ? item.hei + 'px' : hei + 'px' }"
                :src="item.video_url"
                :loop="true"
              ></video>
            </view>
          </view>
          <!-- 底部遮罩 -->
          <view class="mask-box b-mask"></view>
          <!-- 推广赚钱 -->
          <view class="Promotion" v-if="type != 'video-detail'">
            <image
              @click="toPromotion"
              :src="imgUrlEvent('/images/wx-applet/home/tuiguang.png', 'aliyunImgUrl')"
              class="card-imgs"
              mode="aspectFill"
            />
            <image
              v-if="item.mount_product?.length"
              @click="openShare(item.mount_product)"
              :src="imgUrlEvent('/images/wx-applet/home/zhuanqian.png', 'aliyunImgUrl')"
              class="card-imgs"
              mode="aspectFill"
            />
          </view>
          <!-- 侧边功能键 -->
          <Feature
            :info="item"
            :mer_info="mer_info"
            :isopacity="!is_move && !is_pupop"
            v-if="index < video_index + 2 && index > video_index - 2"
            @FullScrren="FullScrren"
            @open_review="open_review"
            :infoindex="index"
            :video_type="type"
            @open="openLoginModal"
            @loginCallback="loginCallback"
          />
          <!-- 底部视频信息 -->
          <VideoInfo
            :info="item"
            :mer_info="mer_info"
            v-if="
              !is_move && !is_pupop && index < video_index + 2 && index > video_index - 2
            "
            @follow_user_Event="follow_user_Event"
            @loginCallback="loginCallback"
          />
          <!-- 侧边遮罩 -->
          <!-- <view class="mask-box r-mask"></view> -->
          <view class="time-box" v-if="is_move"
            ><text class="text"
              >{{ convert_current_time }} / {{ convert_duration_time }}</text
            ></view
          >
          <view
            class="slider-main"
            @touchstart="sliderdown"
            @touchend="sliderup"
            @touchmove="slidermove($event, item)"
          >
            <view
              class="slider-box"
              :class="{
                'slider-box-pause': !item.is_play,
                'slider-box-down': is_progress_down,
              }"
            >
              <view
                class="schedule-box"
                :style="{ width: item.current_time + 4 + 'rpx' }"
                :class="{
                  'schedule-box-pause': !item.is_play,
                  'schedule-box-down': is_progress_down,
                }"
              >
              </view>
            </view>
            <view
              class="block-box"
              :style="{ left: item.current_time + 'rpx' }"
              :class="{
                'block-box-pause': !item.is_play,
                'block-box-down': is_progress_down,
              }"
            >
            </view>
          </view>
          <image
            class="iconimg3"
            :src="imgUrlEvent('/images/wx-applet/home/paly-img.png', 'aliyunImgUrl')"
            mode=""
            @click="stopVideo(item, index, $event)"
            v-if="!item.is_play"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- 评论组件 -->
    <uni-popup
      ref="popup_comment"
      type="bottom"
      :animation="false"
      border-radius="20px 20px 0 0"
      :safe-area="false"
      background-color="#fff"
      @change="pupopChange"
      v-if="arr.length > 0 || video_detail_list.length > 0"
    >
      <review
        v-if="is_pupop"
        :info="type == 'video-detail' ? video_detail_list[video_index] : arr[video_index]"
      ></review>
    </uni-popup>
    <!-- 分享组件 -->
    <uni-popup
      ref="popup_share"
      type="center"
      :animation="true"
      border-radius="20px 20px 0 0"
      :safe-area="false"
    >
      <view class="popup-share-box">
        <view class="popup-share-header">
          <image class="avatar" :src="user_info.avatar" mode=""></image>
          <text class="title nowrap">{{ user_info.nickname }}</text>
          <text class="des">向你推荐这款好物</text>
        </view>
        <image
          class="Product"
          :src="arr[video_index]?.mount_product[0]?.image"
          mode=""
        ></image>
        <view class="hr"></view>
        <view class="footer-share">
          <view class="footer-left">
            <text class="text nowrap">{{
              arr[video_index]?.mount_product[0]?.store_name
            }}</text>
            <view class="price-box">
              <text class="text price"
                >￥{{ arr[video_index]?.mount_product[0]?.price }}</text
              >
              <text class="text ot_price"
                >￥{{ arr[video_index]?.mount_product[0]?.ot_price }}</text
              >
            </view>
          </view>
          <image class="Share_code-img" :src="Share_code" mode=""></image>
        </view>
        <button class="btn" @click="SaveEvent">保存海报</button>
      </view>
    </uni-popup>
    <!-- canvas分享卡片 -->
    <view
      id="canvas-container"
      class="canvas-container"
      style="width: 0rpx; height: 0rpx; overflow: hidden; z-index: -9999"
    >
      <canvas
        id="myCanvas"
        canvas-id="myCanvas"
        style="width: 600px; height: 1000px; background: #ffffff"
      ></canvas>
    </view>
  </view>
  <g-login-modal ref="login_modal" @loginCallback="loginCallback"></g-login-modal>
</template>

<script setup lang="ts">
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { ref, computed, watch, getCurrentInstance } from "vue";
import { istabbarStyle } from "/infrastructure/utils/tabbarStyle";
import uerStore from "@/business/store/modules/home.ts";
import {
  onLoad,
  onShow,
  onReady,
  onInit,
  onHide,
  onBackPress,
  onShareAppMessage,
} from "@dcloudio/uni-app";
import Feature from "./Feature.vue";
import VideoInfo from "./video-info.nvue";
import review from "./review.vue";
import { videoFramePath, toCoupon } from "/infrastructure/utils/util";
import mainStore from "@/business/store/index.ts";
import { homeApi } from "@/business/api/index.ts";
import mineStore from "@/business/store/modules/mine.ts";
import { checkTokenEventAst, translateMerType} from "/infrastructure/utils/util";
import { getSatisfyConditionApi } from '@/business/api/modules/intelligent';
const props = defineProps({
  currtenIndex: {
    type: Number,
    default: "",
  },
  hei: {
    type: Number,
    default: 0,
  },
  video_detail_list: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: "",
  },
  is_check_login: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["videoDetail", "getMerInfo"]);
const store = uerStore();
const mainstore = mainStore();
const mine_store = mineStore();
const video_index = ref(0);
const is_progress_down = ref(false);
const arr = ref([]);
const isout = ref(false);
const login_modal = ref();
// 获取系统信息
let systemInfo = uni.getSystemInfoSync();
// 计算TabBar高度 - 如果父组件传入了hei，则使用传入的值，否则使用系统高度
let hei = ref(props.hei || uni.getSystemInfoSync().windowHeight);
let flga = false;
const popup_comment = ref();
const video_height = ref(hei.value);
const is_pupop = ref(false);
let isdb = ref(0);
const is_ios = ref(false);
const popup_share = ref();
const qrcode = ref();
const mer_info = ref({});
const page_info = ref({ total: 0 });
const system_info = uni.getSystemInfoSync();
const statusBarHeight = system_info.statusBarHeight; // 状态栏高度
let token = uni.getStorageSync("token");
let user_info = uni.getStorageSync('userInfo')
const Share_code = ref('')
const comment_control = ref(false);
let post_id = ''
const params = ref({
  page: 1,
  pageSize: 10,
});
let share_url = ref(
  uni.$config.shareAppUrl+"/views/pages/mine/pages/appDownload/index?parent_code="
);
let parent_mer_id = "";

const instance = getCurrentInstance();
// 监听用户返回手势
onReady(() => {
  console.log("onReady", uni.getSystemInfoSync().windowHeight);
  // 如果父组件没有传入hei，才使用系统高度
  if (!props.hei || props.hei === 0) {
    hei.value = uni.getSystemInfoSync().windowHeight;
  } else {
    hei.value = props.hei;
  }
});
onBackPress(() => {
  popup_comment.value.close();
});
const is_move = ref(false);
// 获取视频
function getList(time = 100) {
  // 如果存在分享mer_id，则使用分享mer_id
  let cur_mer_id = uni.getStorageSync("parent_mer_id");
  parent_mer_id = mainstore.is_from_share && cur_mer_id ? cur_mer_id : "";
  // 商户类型
  let mer_type = uni.getStorageSync("mer_type") || ''
  homeApi.getMinimerVideosApi({ ...params.value, mer_id: parent_mer_id,post_id,mer_type}).then((res) => {
    arr.value = arr.value.concat(res.data.video_list.items);
    mer_info.value = res.data.mer_info;
    page_info.value = res.data.video_list.pageInfo;
    emit("getMerInfo", mer_info.value, arr.value[video_index.value]);
    if(post_id && res.data.is_first_video == false){
       uni.showToast({
         icon: "none",
         title: "该视频已下架，已为您推荐其他精彩内容",
         duration: 2000,
       });
    }
    post_id = ''
    setTimeout(() => {
      initPlay();
    }, time);
  });
}
//解析扫码进入参数
function parseQuery(url) {
      const query = {};
      if (url) {
        url.split('&').forEach(item => {
          const [key, value] = item.split('=');
          query[key] = decodeURIComponent(value);
        });
      }
      return query;
 }

onLoad((opt) => {
  console.log('opt',opt)
  if(opt?.scene){
    // 扫码进入
    console.log('扫码进入解析',decodeURIComponent(opt?.scene))
    let opt_urls = decodeURIComponent(opt?.scene)
    opt_urls = parseQuery(opt_urls)
    post_id = opt_urls.pd
  }
  // 分享链接进入
  if(opt.post_id){
    post_id = opt.post_id
  }
  hei.value = uni.getSystemInfoSync().windowHeight;
  is_ios.value = uni.getSystemInfoSync().platform == "ios";
  // 检查网络状态
  uni.getNetworkType({
    success: function (res) {
      // 网络类型为none表示没有网络连接
      if (res.networkType === "none") {
        // 没有网络，给出提示或者进行本地缓存的数据加载
      } else {
        // 有网络，加载动态数据
        if (arr.value.length == 0) {
          getList();
        }
      }
    },
  });
  // 监听网络状态变化
  uni.onNetworkStatusChange(function (res) {
    if (res.isConnected) {
      // 网络已连接，重新加载数据
      if (arr.value.length == 0) {
        getList();
      }
    }
  });
  // 添加获取当前播放视频信息事件
  uni.$on("get-video-detail", getVideoDetailCb);
  setTimeout(() => {
    uni.getSystemInfo({
	    success: function (res) {
        console.log('视频页面屏幕高度',res.windowHeight)
        hei.value = res.windowHeight
	    }
    });
  }, 500);
});
onShow(() => {
  // 如果父组件没有传入hei，才使用系统高度
  if (!props.hei || props.hei === 0) {
    hei.value = uni.getSystemInfoSync().windowHeight;
  } else {
    hei.value = props.hei;
  }
  if (uni.getStorageSync("token") != token) {
    console.log("账号切换了");
    video_index.value = 0;
    token = uni.getStorageSync("token");
    params.value.page = 1;
    arr.value = [];
    getList(1000);
  }
  isout.value = false;
  //  setTimeout(() => {
  //        initPlay()
  //  }, 100);
});

// 获取当前播放视频信息事件回调
function getVideoDetailCb() {
  let video_detail = arr.value[video_index.value];
  emit("videoDetail", video_detail);
}

// 获取当前视频
const El = computed(() => {
  return uni.createVideoContext("Video" + video_index.value, instance);
});

// 根据视频滑动动态获取视频
watch(
  () => video_index.value,
  () => {
    emit("getMerInfo", mer_info.value, arr.value[video_index.value]);
    if (arr.value.length < page_info.value.total) {
      params.value.page += 1;
      getList(1000);
    }
  }
);
// 监听外层页面授权登录
watch(
  () => props.is_check_login,
  () => {
    loginCallback(true);
  }
);

// 初始化播放
async function initPlay() {
  uni.createVideoContext("Video" + video_index.value, instance).play();
  arr.value[video_index.value].is_play = true;
}

// 视频开始播放
function videoplayEvent(index) {
  arr.value[video_index.value].is_play = true;
  closeoutsideVideo(index);
}

// 视频播放中监听
function timeupdateEvent(e) {
  let { index } = e.currentTarget.dataset;
  closeoutsideVideo(index);
  setSchedule(e);
}

// 视频暂停/播放
function stopVideo(item, index, e) {
  setTimeout(() => {
    if (isdb.value == 2) return;
    if (item.current_time == 0 || !item.video_url) return;
    let El = uni.createVideoContext("Video" + video_index.value, instance);
    if (item.is_play) {
      El.pause();
      console.log("暂停");
    } else {
      console.log("播放");
      El.play();
    }
    item.is_play = !item.is_play;
  }, 200);
}

// 关闭当前展示以外视频
function closeoutsideVideo(index) {
  if (index != video_index.value || isout.value) {
    uni.createVideoContext(`Video${index}`, instance).pause();
  }
}

// 动态更新进度条
function setSchedule(e) {
  let current = (e.detail.currentTime / e.detail.duration) * 100;
  if (props.type == "") {
    arr.value[video_index.value].current_time = current * 7.5;
    arr.value[video_index.value].duration = e.detail.duration;
  } else {
    props.video_detail_list[video_index.value].current_time = current * 7.5;
    props.video_detail_list[video_index.value].duration = e.detail.duration;
  }
}

// 更换当前播放视频
function setVideoIndex(oldId, newId) {
  uni.createVideoContext("Video" + oldId, instance).pause();
  let timeName = setTimeout(() => {
    uni.createVideoContext("Video" + newId, instance).play();
    clearTimeout(timeName);
  }, 100);

  video_index.value = newId;
}

// 手指抬起——切换视频
function outEvent(e) {
  console.log(e.detail.current);
  setVideoIndex(video_index.value, e.detail.current);
}

// 进度条按下事件
function sliderdown(e) {
  // emit("stopTouch", false);
  is_progress_down.value = true;
}

// 进度条抬起
function sliderup() {
  is_progress_down.value = false;
  is_move.value = false;
  let timeName = setTimeout(() => {
    // emit("stopTouch", true);
    clearTimeout(timeName);
  }, 100);
}

// 进度条拖拽
function slidermove(e, item) {
  is_move.value = true;
  item.current_time = e.changedTouches[0].pageX * 2;
  let seekTime = (e.changedTouches[0].pageX / 350) * item.duration;
  El.value.seek(seekTime);
  El.value.play();
  item.is_play = true;
}

// 转换总时长
const convert_duration_time = computed(() => {
  let time;
  if (props.type == "") {
    time = arr.value[video_index.value].duration;
  } else {
    time = props.video_detail_list[video_index.value].duration;
  }
  const min =
    parseInt((time % 3600) / 60) < 10
      ? "0" + parseInt((time % 3600) / 60)
      : parseInt((time % 3600) / 60);
  const sec =
    parseInt((time % 3600) % 60) < 10
      ? "0" + parseInt((time % 3600) % 60)
      : parseInt((time % 3600) % 60);
  return min + ":" + sec;
});

// 转换当前时长
const convert_current_time = computed(() => {
  let time;
  if (props.type == "") {
    time =
      (arr.value[video_index.value].current_time / 2 / 7.5 / 50) *
      arr.value[video_index.value].duration;
  } else {
    time =
      (props.video_detail_list[video_index.value].current_time / 2 / 7.5 / 50) *
      props.video_detail_list[video_index.value].duration;
  }
  const min =
    parseInt((time % 3600) / 60) < 10
      ? "0" + parseInt((time % 3600) / 60)
      : parseInt((time % 3600) / 60);
  const sec =
    parseInt((time % 3600) % 60) < 10
      ? "0" + parseInt((time % 3600) % 60)
      : parseInt((time % 3600) % 60);
  return min + ":" + sec;
});

// 进入全屏
function FullScrren() {
  console.log("触发全屏");
  // El.value.requestFullScreen();
  // arr.value[video_index.value].isFullScrren = true;
  // ResumePlay();
}

// 监听退出全屏
function fullscreenchangeEvent(e) {
  if (!e.detail.fullScreen) {
    arr.value[video_index.value].isFullScrren = false;
    plus.screen.lockOrientation("portrait-primary");
    ResumePlay();
  }
}

function toast() {
  uni.showToast({
    icon: "none",
    title: "暂未开放，敬请期待",
    duration: 2000,
  });
}

// 继续播放视频
function ResumePlay() {
  El.value.play();
  arr.value[video_index.value].is_play = true;
}

// 打开评论弹框
function open_review(flag = false) {
  console.log("触发评论", flag);
  if (flag == true) {
    if (!uni.getStorageSync("isLogin")) {
      uni.navigateTo({
        url: "/views/pages/mine/login?isHome=true",
      });
      return;
    }
    popup_comment.value.open("bottom");
    is_pupop.value = true;
    video_height.value = hei.value - 400;
    if (props.type == "") {
      arr.value[video_index.value].hei = hei.value - 400;
      let timeName = setTimeout(() => {
        uni.hideTabBar();
        clearTimeout(timeName);
      }, 0);
    } else {
      props.video_detail_list[video_index.value].hei = hei.value - 400;
    }
    uni.$emit("tabs_isShow", is_pupop.value);
  }
}

function pupopChange(e) {
  console.log(e.show);
  if (!e.show) {
    if (props.type == "") {
      uni.showTabBar();
      arr.value[video_index.value].hei = false;
    } else {
      props.video_detail_list[video_index.value].hei = false;
    }
    is_pupop.value = false;
    video_height.value = hei.value;
    uni.$emit("tabs_isShow", is_pupop.value);
  }
}

// 双击点赞
function Dblike_evnt(item: obj, index: number, e: any) {
  isdb.value++;
  let timeName = setTimeout(() => {
    isdb.value = 0;
    clearTimeout(timeName);
  }, 300);
  console.log(isdb.value, "isdb");
  if (isdb.value == 2) {
    if (item.is_like) return;
    uni.$emit("Dblike_evnt", { item, index: video_index.value });
    let timeName = setTimeout(() => {
      isdb.value = 0;
      clearTimeout(timeName);
    }, 300);
  }
}

// 关注当前视频用户下所有视频的状态isfollow
function follow_user_Event(userid) {}

uni.$on("isfollow_user", function (user_id, isfollow) {
  arr.value.forEach((item, index) => {
    if (item.user_id == user_id) {
      item.isAttention = isfollow;
    }
  });
});

// 跳转推广
function toPromotion() {
  if(uni.getStorageSync("isLogin")){
    getSatisfyConditionApi().then((res)=>{
    if(res.code==200){ 
	      if(res.data.code == 1 || res.data.code == 2){
          uni.switchTab({
            url: "/views/pages/good/index",
          });
        } else {
          uni.navigateTo({
            url:'/pageIntelligent/sell-goods/list-management'
          })
        }
		}
   })
  }else{
    uni.switchTab({
      url: "/views/pages/good/index",
    });
  }

}
// 校验登录状态
async function checkLogin() {
  // 判断token是否过期
  if (!(await checkTokenEventAst())) {
    login_modal.value.open();
    return true;
  }
}

function openLoginModal () {
  login_modal.value.open();
}
// 打开分享弹框
async function openShare(mount_product) {
  if (await checkLogin()) return;
  productQrcode(mount_product);
  popup_share.value.open();
}

function SaveEvent() {
  console.log("保存海报 ", Share_code.value);
  initCanvas(user_info.avatar);
}

function initCanvas(img) {
  let product_img = "";
  if (arr.value[video_index.value]?.mount_product.length > 0) {
    product_img = arr.value[video_index.value]?.mount_product[0]?.image;
  }
  console.log("product_img:", product_img, "img:", img);
  uni.downloadFile({
    url: img,
    success(res1) {
      uni.downloadFile({
        url: product_img,
        success(res2) {
          uni.downloadFile({
            url: Share_code.value,
            success(res3) {
              uni.showLoading({
                title: "图片生成中...",
                mask: true,
              });
              uni.downloadFile({
                url: "https://kankan-cdn.mdd3.cn/images/wx-applet/home/card-img1.png",
                success(res4) {
                  createCanvas(
                    res1.tempFilePath,
                    res2.tempFilePath,
                    res3.tempFilePath,
                    res4.tempFilePath
                  );
                },
              });
            },
            fail(err) {
              console.log(err);
            },
          });
        },
      });
    },
  });
}

function createCanvas(imgUrl1, imgUrl2, imgUrl3, imgUrl4) {
  var ctx = uni.createCanvasContext("myCanvas", instance); //创建画布
  uni
    .createSelectorQuery()
    .select("#canvas-container")
    .boundingClientRect(function (rect) {
      ctx.setFillStyle("#FFFFFF");
      ctx.drawImage(imgUrl4, 0, 0, 590, 968);
      ctx.save();

      ctx.drawImage(imgUrl2, 40, 100, 510, 510);
      ctx.save();

      ctx.arc(65, 55, 25, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(imgUrl1, 40, 30, 50, 50);

      ctx.restore();
      ctx.setFillStyle("#000");
      ctx.font = "bold 22px sans-serif";
      let str = user_info.nickname;
      if (str.length >= 12) {
        str = str.slice(0, 12) + "...";
      }
      ctx.fillText(str, 105, 60);

      ctx.setFillStyle("#A5A5A5");
      ctx.font = "18px sans-serif";
      ctx.fillText(`向你推荐这款好物`, 402, 61);
      let strs = arr.value[video_index.value]?.mount_product[0]?.store_name; 
      if (strs.length >= 18) {
        strs = strs.slice(0, 18) + "...";
      }
      ctx.setFillStyle("#000");
      ctx.font = "22px sans-serif";
      ctx.fillText(strs, 40, 751);

      ctx.setFillStyle("#fa6262");
      ctx.font = "22px sans-serif";
      ctx.fillText('￥' + arr.value[video_index.value]?.mount_product[0]?.price, 40, 801);
      
      ctx.restore();
      ctx.drawImage(imgUrl3, 455, 721, 100, 100);
      ctx.save();
    })
    .exec(() => {
      let timer = setTimeout(function () {
        ctx.draw(false, () => {
          saveShareImg();
        });
        clearTimeout(timer);
      }, 1000);
    });
}

function saveShareImg() {
  setTimeout(function () {
    uni.canvasToTempFilePath(
      {
        x: 0,
        y: 0,
        width: 590,
        height: 986,
        destWidth: 590,
        destHeight: 986,
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
}
// 生成小程序分享二维码
async function productQrcode(mount_product) {
  let invite_code = uni.getStorageSync("userInfo").user_code || "";
  let mer_id = mer_info.value.merchant_type == 'merchant' ? mer_info.value.mer_id : mer_info.value.mer_uid
  // mid：商户id，ic：用户邀请码，id：商品id，t：商户类型
  let req = {
    type: "store",
    link: `pagesProduct/goods_details/index`,
    data: `mid=${parent_mer_id || mer_id }&ic=${invite_code}&id=${mount_product[0].product_id}&t=${translateMerType(mer_info.value.merchant_type,true)}`,
  };
  const { data } = await homeApi.productQrcodeApi(req);
  Share_code.value = data.src;
}

// 监听取消视频收藏
uni.$on("Unfollow-video", function (id) {
  arr.value.forEach((item) => {
    if (item.id == id) {
      item.is_favorite = 0;
      item.favorite_nums -= 1;
    }
  });
});
// 监听取消关注店铺
uni.$on("Cancel_store_subscription", function (mer_id, is_follow = false) {
  if (mer_info.value.mer_id == mer_id) {
    mer_info.value.is_follow = is_follow;
  }
});

// 授权登录回调
function loginCallback(data) {
  if (data === true) {
    console.log("授权登录回调");
    video_index.value = 0;
    token = uni.getStorageSync("token");
    params.value.page = 1;
    arr.value = [];
    getList(1000);
  }
}

// 暂停所有视频 - 供父组件调用
function pauseAllVideos() {
  if (arr.value.length > 0) {
    // 暂停当前播放的视频
    const currentVideoContext = uni.createVideoContext("Video" + video_index.value, instance);
    currentVideoContext.pause();
    // 更新播放状态
    if (arr.value[video_index.value]) {
      arr.value[video_index.value].is_play = false;
    }
    // 暂停所有其他视频
    arr.value.forEach((item, index) => {
      if (index !== video_index.value) {
        try {
          const videoContext = uni.createVideoContext("Video" + index, instance);
          videoContext.pause();
          item.is_play = false;
        } catch (e) {
          console.log('暂停视频失败', e);
        }
      }
    });
  }
}

// 恢复播放视频 - 供父组件调用
function resumePlay() {
  if (arr.value.length > 0 && arr.value[video_index.value]) {
    try {
      const currentVideoContext = uni.createVideoContext("Video" + video_index.value, instance);
      currentVideoContext.play();
      arr.value[video_index.value].is_play = true;
    } catch (e) {
      console.log('恢复播放视频失败', e);
    }
  }
}

// 暴露方法给父组件
defineExpose({
  pauseAllVideos,
  resumePlay
})
</script>

<style lang="less" scoped>
.Share_code-img {
  width: 108rpx;
  height: 108rpx;
  flex-shrink: 0;
}
.canvas-container {
  position: fixed !important;
  top: -10000rpx !important;
  left: -10000rpx !important;
  overflow: hidden !important;
  width: 0rpx !important;
  height: 0rpx !important;
}
.popup-share-box {
  background-image: url("http://kankan-cdn.mdd3.cn/images/wx-applet/home/card-img.png");
  background-size: 100% 100%;
  width: 590rpx;
  min-height: 968rpx;
  padding: 32rpx !important;
  padding-left: 40rpx !important;
  padding-bottom: 50rpx !important;
  .btn {
    width: 510rpx;
    height: 80rpx;
    background: #1b9aff;
    box-shadow: 0 10rpx 20rpx 0 #43acff80;
    border-radius: 38rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-weight: 600;
    color: #ffffff;
    margin-top: 24rpx;
  }
  .footer-share {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 40rpx;
    .footer-left {
      display: flex;
      flex-direction: column;
      width: 400rpx;
      .price-box {
        display: flex;
        align-items: center;
        .price {
          color: #fa6262;
        }
        .ot_price {
          font-size: 22rpx !important;
          text-decoration: line-through;
          color: #a5a5a5 ;
        }
      }
      .text {
        font-size: 28rpx;
        color: #000000;
        letter-spacing: 4rpx;
        line-height: 54rpx;
        word-break: break-all; /* break-all(允许在单词内换行。) */
        text-overflow: ellipsis; /* 超出部分省略号 */
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1; /** 显示的行数 **/
        font-size: 24rpx;
        color: #111;
        font-weight: 600;
      }
    }
  }
  .hr {
    border: #a5a5a5 dashed 2rpx;
    margin-top: 44rpx;
    width: 512rpx;
  }
  .Product {
    width: 512rpx;
    height: 512rpx;
    margin-top: 24rpx;
    border-radius: 16rpx;
  }
  .popup-share-header {
    display: flex;
    align-items: center;
    .avatar {
      width: 50rpx;
      height: 50rpx;
      margin-right: 12rpx;
      flex-shrink: 0;
      border-radius: 50rpx;
    }
    .title {
      font-weight: 600;
      font-size: 28rpx;
      margin-right: 12rpx;
    }
    .des {
      font-size: 24rpx;
      color: #a5a5a5;
      flex-shrink: 0;
    }
  }
}
.tabbar-box {
  width: 750rpx;
  height: 50px;
  background: #000;
}

.video_index {
  position: absolute;
  z-index: 999;
  color: #fff;
  top: 100px;
}
.video-list {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.video-side_box {
  width: 750rpx;
  height: 1rpx;
  position: absolute;
  right: 0;
  z-index: 8;
}

.Video-box {
  position: relative;
  z-index: 0;
  transition-duration: 0.4s;
  transition-property: height, transform;
}
.iconimg3 {
  width: 88rpx;
  height: 88rpx;
  position: absolute;
}
.time-box {
  bottom: 84rpx;
  position: absolute;
  .text {
    color: #fff;
  }
}
.slider-main {
  width: 750rpx;
  height: 50rpx;
  position: absolute;
  bottom: -15rpx;
  // background: red;
  z-index: 2;
}
.slider-box {
  position: absolute;
  width: 750rpx;
  height: 2rpx;
  bottom: 20rpx;
  z-index: 1;
  background: rgba(255, 255, 255, 0.2);
  // margin-left:30rpx;
}
.slider-box-pause {
  height: 6rpx;
}
.slider-box-down {
  height: 10rpx;
}

.schedule-box {
  width: 0rpx;
  height: 2rpx;
  background: #ffffff;
}
.schedule-box-pause {
  height: 6rpx;
}
.schedule-box-down {
  height: 10rpx;
}
.block-box {
  bottom: 18rpx;
  width: 6rpx;
  height: 6rpx;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  left: 0rpx;
  // transform: translateX(350rpx);
}
.block-box-pause {
  width: 10rpx;
  height: 10rpx;
}
.block-box-down {
  width: 14rpx;
  height: 14rpx;
}
.header-search {
  padding-top: 10rpx;
  padding-bottom: 40rpx;
}

.home-box {
  width: 750rpx;
  background: black;
  flex-shrink: 0;
  position: relative;
}
.mer-info {
  background: rgba(0, 0, 0, 0);
  position: absolute;
  z-index: 999;
  .text {
    font-weight: 500;
    font-size: 30rpx;
    color: #ffffff;
  }
}
.mer-info-mask {
  position: absolute;
  z-index: 999;
  top: 0rpx;
  width: 750rpx;
  height: 100rpx;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
}

.myVideo {
  width: 750rpx;
  height: calc(100vh - var(--window-bottom));
  vertical-align: bottom;
  transition-property: height;
  height: 100px;
  transition-duration: 0.4s;
}
.myVideo::loading {
  /* 设置加载控件的背景颜色 */
  background-color: rgba(0, 0, 0, 1);
}

.myVideo-ios {
  transition-property: transform !important;
  transition-duration: 0s !important;
}

.swiper {
  width: 750rpx;
  height: calc(100vh - var(--window-bottom));
  overflow: hidden;
}
.swiper-item {
  position: relative;
  transition-duration: 0.2s;
  transition-property: height, transform;
  .Promotion {
    position: absolute;
    right: 20rpx;
    top: 206rpx;
    display: flex;
    flex-direction: column;
    .card-imgs {
      width: 100rpx;
      height: 100rpx;
      border-radius: 100rpx;
      margin-bottom: 42rpx;
    }
  }
}

.swiper-item-active {
  transition-duration: 0.4s;
}

.list {
  height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}

.mask-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.5;
  // z-index: 1;
  width: 100vw;
  height: 100vh;
}
.mask-box {
  position: absolute;
  z-index: 1;
}
.r-mask {
  right: 0;
  width: 112rpx;
  height: 740rpx;
  bottom: 100rpx;
  /* #ifdef APP-PLUS */
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  /* #endif */
  /* #ifndef APP-PLUS */
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  /* #endif */
}
.b-mask {
  bottom: 0;
  left: 0;
  right: 0;
  height: 340rpx;

  /* #ifdef APP-PLUS */
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  /* #endif */
  /* #ifndef APP-PLUS */
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  /* #endif */
}

// .home-box::v-deep .footer {
//   position: absolute;
//   bottom: 20rpx;
//   // margin-left: -32rpx !important;
// }
// .home-box::v-deep .scroll-box {
//   height: 220rpx !important;
//   padding-bottom: 50rpx;
// }
</style>
