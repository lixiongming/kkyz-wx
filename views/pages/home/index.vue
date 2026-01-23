<template>
  <view class="home-container">
    <!-- 顶部 Tabs - 始终显示，视频播放时背景透明 -->
    <view class="tabs-wrapper" :class="{ 'tabs-transparent': current_tab === 0 }" :style="tabs_wrapper_style">
      <!-- 黑色透明渐变蒙层 - 仅在视频播放页显示 -->
      <view class="tabs-mask" v-if="current_tab === 0"></view>
      <u-tabs 
        :list="tabs_list" 
        :current="current_tab" 
        @click="handleTabClick"
        :activeStyle="current_tab === 0 ? { color: '#ffffff' } : { color: '#1B9AFF' }"
        :lineColor="current_tab === 0 ? '#ffffff' : '#1B9AFF'"
        :inactiveStyle="current_tab === 0 ? { color: 'rgba(255, 255, 255, 0.6)' } : { color: '#666666' }"
        :itemStyle="{ height: '88rpx' }"
        lineHeight="4"
      ></u-tabs>
    </view>
    <view class="content-swiper" :style="{height: hei + 'px'}">
      <!-- Tab 1: 看看宇宙 (视频流) -->
      <view class="mian-box flex trans" :style="{  transform:`translateX(${current_tab * -750}rpx)`,height: hei + 'px'}">
          <view class="flex mian-box">
            <view class="content flex">
              <myVideo ref="my_video_ref" @getMerInfo="getMerInfo" @videoDetail="videoDetail" :is-check-login="is_check_login" :hei="video_height"></myVideo>
            </view>
          </view>
        </view>
      <!-- Tab 2: 崇高健康大舞台 (视频列表) -->
        <view class="swiper-item-content" :style="{  transform:`translateX(${current_tab * -750}rpx)`,paddingTop:status_bar_height + 'px'}">
          <video-list :current_tab="current_tab" ref="video_list_ref" @openCityPicker="handleOpenCityPicker"></video-list>
        </view>
    </view>
    <!-- 城市选择弹窗 -->
    <view class="city-picker-popup-wrapper" :class="{ 'popup-show': show_city_popup }">
      <city-picker-popup
      v-model:show="show_city_popup"
      :provinceList="province_list"
      :cityList="city_list"
      v-model:pickerValue="picker_value"
      :indicatorStyle="indicator_style"
      @provinceChange="handle_province_change"
      @confirm="handle_city_confirm"
      @close="handleCityPickerClose"
    ></city-picker-popup>
    </view>
    
    <view class="global-tips df-r ai-c jc-c" v-if="mainstore.is_wechat_moments_share">点击下方按钮前往小程序使用完整服务</view>
    <g-login-modal ref="login_modal" @loginCallback="loginCallback" ></g-login-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onInit,
  onHide,
  onUnload,
  onBackPress,
  onShareAppMessage,
  onShareTimeline
} from "@dcloudio/uni-app";
import myVideo from "./components/my-video.vue";
import videoList from "./components/video-list.vue";
import cityPickerPopup from "@/components/city-picker-popup/index.vue";
import { getconfigApi } from "@/infrastructure/utils/utils";
import mainStore from "@/business/store/index";
import {checkTokenEventAst } from "/infrastructure/utils/util";
import uerStore from "@/business/store/modules/mine";
import homeApi from "@/business/api/modules/home";

const store = uerStore();

const mainstore = mainStore();
let hei = uni.getSystemInfoSync().windowHeight;
const login_modal = ref()
const is_check_login = ref(false)
const my_video_ref = ref()
const video_list_ref = ref()

// 城市选择相关
const show_city_popup = ref(false)
const province_list = ref([])
const city_list = ref([])
const picker_value = ref([0, 0, 0])
const indicator_style = ref('height: 128rpx;')
const selected_province_index = ref(0)
const selected_city_index = ref(0)

// Tabs 相关
const current_tab = ref(0)
const tabs_list = ref([
  { name: '看看宇宙' },
  { name: '崇高健康大舞台' }
])

// 小程序胶囊按钮信息
const menu_button_info = ref({
  top: 0,
  height: 0,
  right: 0,
  width: 0
})

// 状态栏高度
const status_bar_height = ref(0)

// 初始化小程序胶囊信息
function initMenuButton() {
  /* #ifdef MP-WEIXIN */
  try {
    const menuButton = uni.getMenuButtonBoundingClientRect()
    const systemInfo = uni.getSystemInfoSync()
    menu_button_info.value = {
      top: menuButton.top,
      height: menuButton.height,
      right: menuButton.right,
      width: menuButton.width
    }
    status_bar_height.value = systemInfo.statusBarHeight || 0
  } catch (e) {
    console.error('获取胶囊按钮信息失败', e)
  }
  /* #endif */
  
  /* #ifndef MP-WEIXIN */
  const systemInfo = uni.getSystemInfoSync()
  status_bar_height.value = systemInfo.statusBarHeight || 0
  // 非小程序环境，使用默认值
  menu_button_info.value = {
    top: status_bar_height.value + 4,
    height: 32,
    right: 375 - 87,
    width: 87
  }
  /* #endif */
}

// Tabs 容器样式 - 与H5环境一致
const tabs_wrapper_style = computed(() => {
  // 统一使用与H5环境一致的样式
  return {
    paddingTop: status_bar_height.value + 'px',
    paddingLeft: '0',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '100',
    width: '750rpx',
    boxSizing: 'border-box'
  }
})


// Swiper 高度计算 - 与H5环境一致
const swiper_style = computed(() => {
  if (current_tab.value === 0) {
    // 看看宇宙：全屏高度，tabs是绝对定位不影响布局
    return {
      height: hei + 'px'
    }
  } else {
    // 崇高健康大舞台：全屏高度减去tabs高度
    // 统一使用状态栏 + tabs高度
    const tabs_top = status_bar_height.value
    const tabs_height = 44 // tabs组件高度 88rpx = 44px
    const total_height = tabs_top + tabs_height
    
    return {
      height: (hei - total_height) + 'px',
      marginTop: total_height + 'px'
    }
  }
})

// 视频容器高度 - 恢复原来的全屏高度
const video_container_style = computed(() => {
  return {
    height: hei + 'px'
  }
})

// 视频组件高度 - 恢复原来的全屏高度
const video_height = computed(() => {
  return hei
})

// 处理 Tab 点击
function handleTabClick(item: any, index: number) {
  // 如果切换到视频列表页，先暂停视频播放
  if (index === 1 && my_video_ref.value && my_video_ref.value.pauseAllVideos) {
    my_video_ref.value.pauseAllVideos()
  }
  // 如果切换回视频播放页，恢复播放视频
  if (index === 0 && my_video_ref.value && my_video_ref.value.resumePlay) {
    // 延迟一下确保页面切换完成
    setTimeout(() => {
      my_video_ref.value.resumePlay()
    }, 100)
  }
  current_tab.value = index
}

/* #ifdef MP-WEIXIN */
uni.showShareMenu({});
/* #endif */
let mer_id = ''
let parent_mer_id = ''
let img = ''
let mer_name = ''
let image_url = ''
let post_id = ''
let merchant_type = ''
let mer_uid = ''

// 获取分享id
function getMerInfo(data:any,video_item:any) {
  console.log(video_item.cover_image)
   mer_id = data.mer_id
   img = data.mer_avatar
   mer_name = data.mer_name
   image_url = video_item.cover_image || '' 
   post_id = video_item.video_type == 'teach_post' ? '' : video_item.id
   merchant_type = data.merchant_type
   mer_uid = data.mer_uid

}
// 校验登录状态
async function checkLogin() {
  // 判断token是否过期
  if (!(await checkTokenEventAst())) {
    login_modal.value.open();
    return true;
  }
}
// 小程序分享
onShareAppMessage( async (res) => {
  if (await checkLogin()) return;
  let invite_code = uni.getStorageSync('userInfo').user_code || ''
  console.log("invite_code---->", invite_code);
  console.log('post_id:',post_id)
  // 如果存在分享mer_id，则分享mer_id优先
  let cur_mer_id = uni.getStorageSync('parent_mer_id') 
  parent_mer_id = mainstore.is_from_share && cur_mer_id ? cur_mer_id : ''
  // 当前商户id
  let current_mer_id = merchant_type == 'merchant' ? mer_id : mer_uid
  return {
    title:mer_name,
    imageUrl:image_url,
    path: `/views/pages/home/index?mer_id=${parent_mer_id || current_mer_id}&invite_code=${invite_code}&post_id=${post_id}&mer_type=${merchant_type}`,
  };
});

// 分享到朋友圈
onShareTimeline(async (res) => {
  if (await checkLogin()) return;
  let invite_code = uni.getStorageSync('userInfo').user_code || ''
  // 如果存在分享mer_id，则分享mer_id优先
  let cur_mer_id = uni.getStorageSync('parent_mer_id') 
  parent_mer_id = mainstore.is_from_share && cur_mer_id ? cur_mer_id : ''
  // 当前商户id
  let current_mer_id = merchant_type == 'merchant' ? mer_id : mer_uid
  return {
    title:mer_name,
    imageUrl:image_url,
    query: `mer_id=${parent_mer_id || current_mer_id}&invite_code=${invite_code}&post_id=${post_id}&mer_type=${merchant_type}`,
  };
})

onLoad((opt) => {
  // 初始化胶囊按钮信息
  initMenuButton()
  
  if(opt.invite_code){
    // 缓存上级邀请码
    uni.setStorageSync('invite_code',opt.invite_code)

  }
  if (opt.id) {
    uni.showToast({
      title: opt.id,
      duration: 2000,
    });
  }

});

watch(() => store.isLogin, (nVal) => {
  if (!nVal) {
    uni.hideShareMenu({
      menus: ['shareTimeline']
    });
  } else {
    uni.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
})

onShow(() => {
  // 重新获取状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  status_bar_height.value = systemInfo.statusBarHeight || 0
  
  if (!store.isLogin) {
    uni.hideShareMenu({
      menus: ['shareTimeline']
    })
  } else {
    uni.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
  getconfigApi()
})

function loginCallback() {
is_check_login.value = !is_check_login.value
}

// 处理打开城市选择弹窗
function handleOpenCityPicker(data: any) {
  console.log('收到城市选择器数据:', data);
  province_list.value = data.province_list
  city_list.value = data.city_list
  picker_value.value = data.picker_value
  selected_province_index.value = data.selected_province_index
  selected_city_index.value = data.selected_city_index
  console.log('更新后的数据:', {
    province_list: province_list.value.length,
    city_list: city_list.value.length,
    picker_value: picker_value.value,
    selected_province_index: selected_province_index.value,
    selected_city_index: selected_city_index.value
  });
  show_city_popup.value = true
}

// 处理省份变化
async function handle_province_change(province: any) {
  // 从省份的children字段获取城市数据
  if (province.children) {
    // 将children对象转换为数组
    city_list.value = Object.values(province.children).map(item => ({
      name: item.name,
      code: item.code,
      id: item.code // 使用code作为id
    }));
  } else {
    console.error('该省份没有城市数据:', province.name);
    city_list.value = [
      { name: '市辖区', code: '000100' }
    ];
  }
  // 重置城市索引
  picker_value.value = [picker_value.value[0], 0, 0]
  selected_city_index.value = 0
}



// 处理城市确认
function handle_city_confirm(data: any) {
  // 通知子组件更新选中的城市
  if (video_list_ref.value && video_list_ref.value.updateSelectedCity) {
    video_list_ref.value.updateSelectedCity(
      data.city.name,
      data.province.name,
      data.provinceIndex,
      data.cityIndex,
      data.city.code // 传递城市 code
    )
  }
}

// 处理城市选择弹窗关闭
function handleCityPickerClose() {
  // 通知子组件城市选择弹窗已关闭
  if (video_list_ref.value && video_list_ref.value.updateArrowDirection) {
    video_list_ref.value.updateArrowDirection(false)
  }
}

</script>
<style lang="less" scoped>

.home-container {
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.tabs-wrapper {
  width: 750rpx;
  background: #ffffff;
  z-index: 100;
  box-sizing: border-box;
  position: relative;
  
  /* 确保tabs组件背景透明 */
  /deep/ .u-tabs {
    background: transparent;
  }
  
  /deep/ .u-tabs__wrapper {
    background: transparent;
  }
  
  /* 视频播放页面样式 */
  &.tabs-transparent {
    background: transparent;
  }
  
  /* 黑色透明渐变蒙层 */
  .tabs-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200rpx;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }
  
  /* 确保tabs在蒙层上方 */
  /deep/ .u-tabs {
    position: relative;
    z-index: 2;
  }
}

.content-swiper {
  width: 750rpx;
  position: relative;
  display: flex;
  flex-direction: row;
  // overflow: hidden;
}

.swiper-item-content {
  width: 750rpx;
  height: calc(100% - 88rpx);
  background: #ffffff;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  transition: 0.2s;
  margin-top: 88rpx;
}

.mian-box {
  width: 750rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.trans{
  transition: 0.2s;
}

.content {
  width: 2250rpx;
  transition-duration: 0.2s;
  transition-property: height, left;
  position: relative;
}

.mian-box::v-deep .footer {
  position: absolute;
  bottom: 20rpx;
  // margin-left: -32rpx !important;
}

.mian-box::v-deep .scroll-box {
  // height: 720rpx !important;
  padding-bottom: 50rpx;
}

.box-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  overflow: hidden;
}
.global-tips {
  z-index: 9999;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.8);
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  border-radius: 12rpx 12rpx 0 0;
}

/* 城市选择弹窗包装器 - 确保不影响页面布局 */
.city-picker-popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  pointer-events: none;
}

/* 弹窗显示时，允许接收点击事件 */
.city-picker-popup-wrapper.popup-show {
  pointer-events: auto;
}
</style>
