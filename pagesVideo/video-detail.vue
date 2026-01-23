<template>
  <view class="video-detail-container">
    <!-- 顶部导航栏 - 白色背景，固定在顶部 -->
    <view class="nav-bar fixed-nav" :style="nav_bar_style">
      <view class="nav-back" @click="handleBack">
        <u-icon name="arrow-left" size="24" color="#000000"></u-icon>
      </view>
      <view class="nav-title">作品详情</view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <u-icon name="close-circle" size="64" color="#FF4D4F"></u-icon>
      <text class="error-text">{{ error }}</text>
      <view class="retry-btn" @click="onMounted">重试</view>
    </view>
    <view class="commodity-Card" v-if="item?.mount_product.length > 0">
      <commodityCard  :mer_info="mer_info" @loginCallback="loginCallback"  :list="item.mount_product" :width="540" :height="132" :type="1" ></commodityCard>
    </view>
    <!-- 视频播放区域 - 全屏 -->
    <view v-else class="video-container">
      <swiper
        class="swiper"
        @change="outEvent"
        vertical
        :duration="200"
        :initial-current="0"
        :style="{ visibility: swiperReady ? 'visible' : 'hidden', opacity: swiperReady ? 1 : 0 }"
      >
        <swiper-item
          v-for="(item, index) in all_videos"
          :key="index"
          class="swiper-item"
        >
          <view class="video-up" :class="{ 'video-up-vertical': item.isVerticalVideo, 'video-up-horizontal': !item.isVerticalVideo }">
            <view
                v-if="index < video_index + 2 && index > video_index - 2"
                class="Video-box"
                :class="{ 'Video-box-vertical': item.isVerticalVideo, 'Video-box-horizontal': !item.isVerticalVideo, 'myVideo-ios': true }"
                @click="stopVideo(item, index, $event)"
              >
              <video
                v-if="!isout"
                :id="'Video' + index"
                :enable-progress-gesture="false"
                :auto-pause-if-open-native="true"
                :page-gesture="false"
                :show-fullscreen-btn="true"
                :show-center-play-btn="false"
                :object-fit="item.isVerticalVideo ? 'cover' : 'contain'"
                :show-loading="true"
                :data-index="index"
                @timeupdate="timeupdateEvent"
                @play="videoplayEvent(index)"
                @pause="onPause"
                @loadedmetadata="onLoadedMetadata"
                @fullscreenchange="handleFullScreenChange"
                :class="{ 'myVideo-vertical': item.isVerticalVideo, 'myVideo-horizontal': !item.isVerticalVideo, 'myVideo-ios': true }"
                :controls="isFullScreen"
                :src="item.video_url || item.play_video_url"
                :poster="item.cover_image || posterUrl"
                :loop="true"
                :autoplay="index === video_index"
              ></video>
            </view>
          </view>

          <!-- 视频信息区域 -->
          <view v-if="index < video_index + 2 && index > video_index - 2" class="video-info">
          <view class="commodity-Card" v-if="item?.mount_product.length > 0"> 
            <commodityCard :mer_info="mer_info" @loginCallback="loginCallback"  :list="item.mount_product" :width="540" :height="132" :type="1" ></commodityCard>
          </view>
            <!-- 全屏按钮 - 只在宽屏时显示，位于表演者上方 -->
            <view v-if="!item.isVerticalVideo" class="fullscreen-btn-container">
              <view class="fullscreen-btn" @click="toggleFullScreen(item, index)">
                <image 
                  :src="imgUrlEvent('/images/wx-applet/home/fullIcon.png', 'aliyunImgUrl')"
                  mode="aspectFill"
                  style="width: 48rpx; height: 48rpx;"
                />
              </view>
            </view>
            
            <view class="info-item">
              <text class="info-label">表演者：</text>
              <text class="info-value">{{ item.performer || performer }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">赞助方：</text>
              <text class="info-value">{{ item.sponsor || sponsor }}</text>
            </view>
            <view class="info-item intro-item">
              <text class="info-value" style="font-size: 28rpx; word-break: break-word;">{{ item.intro || '' }}</text>
            </view>
            <view class="video-stats">
              <view class="stat-item">
                <u-icon name="eye" size="20" color="rgba(255, 255, 255, 0.8)"></u-icon>
                <text class="stat-value">{{ item.view_nums || viewCount }}次观看</text>
              </view>
              <view class="stat-divider"></view>
              <button open-type="share" class="stat-item" @click="handleShareClick(item)">
                <uni-icons type="redo" size="20" color="rgba(255, 255, 255, 0.8)"></uni-icons>
                <text class="stat-value">{{ item.share_nums || likeCount }}次转发</text>
              </button>
            </view>
          </view>
          <!-- 暂停图片 - 只在用户手动暂停时显示，切换视频时不显示 -->
          <image
            v-if="!item.is_play && index < video_index + 2 && index > video_index - 2"
            class="iconimg3"
            src="https://kankan-cdn.mdd3.cn/images/wx-applet/home/paly-img.png"
            mode=""
            @click="stopVideo(item, index, $event)"
          ></image>
        </swiper-item>
      </swiper>
    </view>
  </view>
  <g-login-modal ref="login_modal" @loginCallback="loginCallback" ></g-login-modal>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app';
import homeApi from '@/business/api/modules/home';
import {checkTokenEventAst } from "/infrastructure/utils/util";
import commodityCard from "/views/pages/home/components/commodity-card.vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";

// 页面参数
const videoId = ref('')
const title = ref('')
const performer = ref('')
const sponsor = ref('')
const thumbnail = ref('')

// 视频相关
const videoUrl = ref('') // 视频地址，暂时为空，后续替换为接口数据
const posterUrl = ref('') // 视频封面
const videoPlayer = ref(null) // 视频播放器引用
const isPlaying = ref(false) // 视频是否正在播放
const isPortrait = ref(false) // 是否为竖屏视频
const videoWidth = ref(0)
const videoHeight = ref(0)
const mer_info = ref()

// 获取当前实例
const instance = getCurrentInstance()
const login_modal = ref()

// 获取当前视频 - 参考 my-video.vue 的实现
const El = computed(() => {
  return uni.createVideoContext("Video" + video_index.value, instance);
});

// 视频信息
const viewCount = ref('123456')
const likeCount = ref('12345')

// 数据状态管理
const related_videos = ref([])
const all_videos = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')
const swiperReady = ref(false)
const isout = ref(false)
const user_code = ref('')
// 当前视频索引
const video_index = ref(0)

// 胶囊位置信息
const menu_button_info = ref({
  top: 0,
  height: 0,
  right: 0,
  width: 0
})

// 状态栏高度
const status_bar_height = ref(0)

// 校验登录状态
async function checkLogin() {
  // 判断token是否过期
  if (!(await checkTokenEventAst())) {
    login_modal.value.open();
    return true;
  }
}

function loginCallback() {


}

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

// 是否从分享卡片进入
const isFromShare = ref(false)

// 是否为iOS设备
const isIOS = ref(false)

// 处理返回
function handleBack() {
  console.log('处理返回', { isFromShare: isFromShare.value, pagesLength: getCurrentPages().length })
  if(getCurrentPages().length === 1){
    // 页面栈只有1个，说明是从分享卡片或外部链接进入
    console.log('页面栈长度为1，返回首页')
    uni.switchTab({
      url: "/views/pages/home/index",
      success: function(res) {
        console.log('返回首页成功:', res)
      },
      fail: function(res) {
        console.error('返回首页失败:', res)
        // 失败时的备用方案
        uni.navigateTo({
          url: "/views/pages/home/index"
        })
      }
    })
  } else {
    // 正常进入，返回上一页
    console.log('正常进入，返回上一页')
    uni.navigateBack()
  }
}

// 检测设备类型
function detectDeviceType() {
  try {
    const systemInfo = uni.getSystemInfoSync()
    isIOS.value = systemInfo.platform === 'ios'
    console.log('设备类型:', isIOS.value ? 'iOS' : 'Android/其他')
  } catch (e) {
    console.error('获取设备信息失败:', e)
  }
}

// 切换播放状态
function togglePlay() {
  const video = videoPlayer.value
  if (video) {
    if (isPlaying.value) {
      video.pause()
    } else {
      video.play()
    }
  }
}

// 全屏状态管理
const isFullScreen = ref(false)

// 处理全屏变化
function handleFullScreenChange(e) {
  isFullScreen.value = e.detail.fullScreen
  console.log('全屏状态变化:', isFullScreen.value)
}

// 切换全屏状态
function toggleFullScreen(item, index) {
  const videoContext = uni.createVideoContext('Video' + index)
  if (videoContext) {
    try {
      // 强制横屏，无论设备类型
      console.log('全屏请求，强制横屏')
      videoContext.requestFullScreen({
        direction: 180 // 强制横屏
      })
    } catch (e) {
      console.log('请求全屏失败', e)
      uni.showToast({
        title: '全屏功能暂时不可用',
        icon: 'none'
      })
    }
  }
}

// 视频播放
function onPlay() {
  console.log('视频开始播放')
  isPlaying.value = true
  // 更新当前视频的播放状态
  if (all_videos.value.length > 0 && all_videos.value[video_index.value]) {
    all_videos.value[video_index.value].is_play = true
  }
}

// 视频暂停
function onPause() {
  console.log('视频暂停')
  isPlaying.value = false
  // 更新当前视频的播放状态，显示暂停图标
  // if (all_videos.value.length > 0 && all_videos.value[video_index.value]) {
  //   all_videos.value[video_index.value].is_play = false
  // }
}

// 视频结束
function onEnded() {
  console.log('视频结束')
  // 视频设置了loop=true，会自动循环播放，不需要更新is_play状态
  // 这样就不会显示暂停按钮
}

// 视频加载完成获取元数据
function onLoadedMetadata(e) {
  console.log('视频元数据加载完成', e)
  const video = e.target
  videoWidth.value = video.videoWidth
  videoHeight.value = video.videoHeight
  
  // 检测视频比例，宽高比小于1为竖屏，大于等于1为横屏
  isPortrait.value = videoWidth.value / videoHeight.value < 1
  console.log('视频宽高比', videoWidth.value / videoHeight.value, '是否竖屏', isPortrait.value)
}

// 清理视频链接
function cleanVideoUrl(url) {
  if (typeof url === 'string') {
    // 移除反引号和空格
    const cleanedUrl = url.replace(/[`\s]/g, '').trim()
    console.log('清理后的视频链接:', cleanedUrl)
    return cleanedUrl
  }
  console.log('视频链接为空或无效:', url)
  return url
}



// 预加载视频 - 参考 my-video.vue 的实现
function preloadVideos(currentIndex) {
  // 预加载当前视频前后的视频
  const preloadIndexes = [currentIndex - 1, currentIndex + 1]
  
  preloadIndexes.forEach(index => {
    if (index >= 0 && index < all_videos.value.length) {
      try {
        const videoContext = uni.createVideoContext('Video' + index, instance)
        if (videoContext && videoContext.load) {
          videoContext.load()
          console.log('预加载视频:', index)
        }
      } catch (e) {
        console.error('预加载视频失败:', e)
      }
    }
  })
}

// 清理视频数据
function cleanVideoData(video) {
  if (!video) return video
  
  return {
    ...video,
    video_url: cleanVideoUrl(video.video_url),
    play_video_url: cleanVideoUrl(video.play_video_url),
    cover_image: cleanVideoUrl(video.cover_image),
    // 计算视频是否为竖屏
    isVerticalVideo: calculateIsVerticalVideo(video.width, video.height),
    // 初始化播放状态
    is_play: true,
    // 初始化切换状态
    isSwitching: false
  }
}

// 计算视频是否为竖屏
function calculateIsVerticalVideo(width, height) {
  if (!width || !height) return true // 默认按竖屏处理
  
  // 尝试转换为数字
  const videoWidth = parseFloat(width)
  const videoHeight = parseFloat(height)
  
  if (isNaN(videoWidth) || isNaN(videoHeight)) return true // 转换失败按竖屏处理
  
  // 宽高比小于1为竖屏
  return videoWidth / videoHeight < 1
}

// 获取随机视频列表
async function fetchRandomVideos(id, num = 10, user_code) {
  try {
    const res = await homeApi.getStageVideoDetailRandomApi({ id, num:1, user_code})
    if (res && Array.isArray(res.data.list)) {
      const cleanedVideos = res.data.list.map(cleanVideoData)
      related_videos.value = cleanedVideos
      mer_info.value = res.data.mer_info
      return cleanedVideos
    } else {
      throw new Error('获取随机视频列表失败')
    }
  } catch (err) {
    console.error('获取随机视频列表错误:', err)
    error.value = '获取相关视频失败'
    return []
  }
}

// 合并视频数据
function mergeVideoData(randomVideos) {
  if (Array.isArray(randomVideos)) {
    all_videos.value = randomVideos
  }
  return all_videos.value
}

// 追加视频数据
function appendVideoData(randomVideos) {
  if (Array.isArray(randomVideos)) {
    all_videos.value = all_videos.value.concat(randomVideos)
  }
  return all_videos.value
}

// 导航栏样式计算
const nav_bar_style = computed(() => {
  return {
    paddingTop: status_bar_height.value + 'px',
    height: (status_bar_height.value + 44) + 'px',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '9999',
    boxSizing: 'border-box'
  }
})

// 页面加载
onMounted(async () => {
  // 初始化胶囊按钮信息
  initMenuButton()
  
  // 检测设备类型
  detectDeviceType()
  
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  
  if (options) {
    videoId.value = options.id || ''
    title.value = decodeURIComponent(options.title || '')
    performer.value = decodeURIComponent(options.performer || '')
    sponsor.value = decodeURIComponent(options.sponsor || '')
    thumbnail.value = decodeURIComponent(options.thumbnail || '')
    user_code.value = options.invite_code || ''
    // 检查是否从分享卡片进入
    // 如果有id参数且页面栈只有1个，说明是从分享卡片进入
    // 或者检查是否有分享相关的参数
    if ((options.id && pages.length === 1) || options.mer_id || options.invite_code || options.post_id) {
      isFromShare.value = true
      console.log('从分享卡片进入', { pagesLength: pages.length, options: options })
    } else {
      // 非分享进入
      isFromShare.value = false
      console.log('非分享进入', { pagesLength: pages.length, options: options })
    }
    
    // 设置视频封面
    posterUrl.value = thumbnail.value
    
    // 后续替换为实际视频地址
    videoUrl.value = ''
    
    // 获取视频详情和相关视频
    if (videoId.value) {
      loading.value = true
      error.value = ''
      
      try {
        // 调用观看接口，增加观看次数
        await homeApi.getStageViewApi({ id: videoId.value })
        console.log('观看次数统计成功')
        
        // 获取随机视频列表
        const randomVideos = await fetchRandomVideos(videoId.value, 10, user_code.value)
        // 合并数据
        mergeVideoData(randomVideos)
        
        // 延迟设置swiperReady，确保DOM完全渲染
        setTimeout(() => {
          swiperReady.value = true
          // 初始化播放
          setTimeout(() => {
            initPlay()
          }, 100)
        }, 100)
      } catch (err) {
        console.error('加载视频数据错误:', err)
        // 观看接口调用失败不影响页面加载
        if (error.value === '') {
          error.value = '加载视频数据失败，请重试'
        }
      } finally {
        loading.value = false
      }
    }
  }
})

// 初始化播放 - 参考 my-video.vue 的实现
async function initPlay() {
  console.log('开始初始化播放', { videosLength: all_videos.value.length, currentIndex: video_index.value })
  
  if (all_videos.value.length > 0) {
    const currentVideo = all_videos.value[video_index.value]
    console.log('当前视频数据:', currentVideo)
    
    if (!currentVideo) {
      console.log('当前视频不存在')
      return
    }
    
    const videoUrl = currentVideo.video_url || currentVideo.play_video_url
    if (!videoUrl) {
      console.log('当前视频没有播放地址')
      return
    }
    
    try {
      // 直接创建视频上下文并播放
      uni.createVideoContext('Video' + video_index.value, instance).play()
      currentVideo.is_play = true
      console.log('视频播放命令已发送')
      
      // 初始加载后预加载前后的视频
      preloadVideos(video_index.value)
    } catch (e) {
      console.error('初始化播放失败:', e)
    }
  } else {
    console.log('视频列表为空')
  }
}

// 视频开始播放
function videoplayEvent(index) {
  if (all_videos.value.length > 0 && all_videos.value[video_index.value]) {
    all_videos.value[video_index.value].is_play = true
  }
  closeoutsideVideo(index)
}

// 视频播放中监听 - 限制触发频率
let lastTimeUpdate = 0
function timeupdateEvent(e) {
  const currentTime = Date.now()
  // 限制更新频率，每100ms更新一次
  if (currentTime - lastTimeUpdate > 100) {
    lastTimeUpdate = currentTime
    let { index } = e.currentTarget.dataset
    closeoutsideVideo(index)
  }
}

// 视频暂停/播放 - 参考 my-video.vue 的实现
function stopVideo(item, index, e) {
  setTimeout(() => {
    if (all_videos.value.length > 0) {
      let El = uni.createVideoContext('Video' + video_index.value, instance)
      if (item.is_play) {
        El.pause()
        console.log('暂停')
      } else {
        console.log('播放')
        El.play()
      }
      item.is_play = !item.is_play
    }
  }, 200)
}

// 关闭当前展示以外视频 - 参考 my-video.vue 的实现
function closeoutsideVideo(index) {
  if (index != video_index.value) {
    try {
      uni.createVideoContext(`Video${index}`, instance).pause()
    } catch (e) {
      console.log('暂停视频失败', e)
    }
  }
}

// 更换当前播放视频 - 参考 my-video.vue 的实现
function setVideoIndex(oldId, newId) {
  console.log('开始更换当前播放视频', { oldId, newId })
  
  // 暂停旧视频
  try {
    uni.createVideoContext('Video' + oldId, instance).pause()
    // 更新旧视频的播放状态
    if (all_videos.value[oldId]) {
      all_videos.value[oldId].is_play = false
      all_videos.value[oldId].isSwitching = false
    }
  } catch (e) {
    console.error('暂停视频失败:', e)
  }
  
  // 直接播放新视频，移除延时避免黑屏
  uni.createVideoContext('Video' + newId, instance).play()

  // 更新当前视频索引
  video_index.value = newId
  
  // 更新新视频的播放状态
  if (all_videos.value[newId]) {
    all_videos.value[newId].is_play = true
    all_videos.value[newId].isSwitching = false
  }
  
  // 预加载前后的视频
  preloadVideos(newId)
  
  // 调用观看接口，增加观看次数（异步，不阻塞视频播放）
  const newVideoData = all_videos.value[newId]
  if (newVideoData && newVideoData.id) {
    homeApi.getStageViewApi({ id: newVideoData.id }).catch(err => {
      console.error('观看次数统计失败:', err)
    })
  }
}

// 手指抬起——切换视频
function outEvent(e) {
  const newIndex = e.detail.current
  setVideoIndex(video_index.value, newIndex)
  
  // 滑动到最后一条时加载更多
  if (newIndex === all_videos.value.length - 1 && !loadingMore.value) {
    loadMoreVideos()
  }
}

// 加载更多视频
async function loadMoreVideos() {
  if (!videoId.value || loadingMore.value) return
  
  loadingMore.value = true
  try {
    const randomVideos = await fetchRandomVideos(videoId.value, 10, user_code.value)
    appendVideoData(randomVideos)
  } catch (err) {
    console.error('加载更多视频错误:', err)
  } finally {
    loadingMore.value = false
  }
}

// 小程序分享
onShareAppMessage(async () => {
  if (await checkLogin()) return;
  // 获取当前视频信息
  const currentVideo = all_videos.value[video_index.value]
  const shareTitle = currentVideo?.intro || currentVideo?.performer || '精彩视频分享'
  const shareImageUrl = currentVideo?.cover_image || posterUrl.value
  const shareId = currentVideo?.id || videoId.value
  
  console.log('分享给朋友参数:', {
    shareId,
    shareTitle,
    shareImageUrl
  })
  
  // 调用分享接口，增加分享次数
  if (shareId) {
    homeApi.getStageShareApi({ id: shareId }).then(() => {
      console.log('分享次数统计成功')
    }).catch(err => {
      console.error('分享次数统计失败:', err)
    })
  }
  let invite_code = uni.getStorageSync('userInfo').user_code || ''
  return {
    title: shareTitle,
    path: `/pagesVideo/video-detail?id=${shareId}&invite_code=${invite_code}`,
    imageUrl: shareImageUrl
  }
});

// 点击分享次数时的分享功能
async function handleShareClick(item) {
  console.log('点击分享功能:', item)
  
  // 调用分享接口，增加分享次数
  if (item.id) {
    try {
      const { data } = await homeApi.getStageShareApi({ id: item.id })
      console.log('分享次数统计成功', data)
      // 更新分享次数
      if (data && data.share_nums) {
        item.share_nums = data.share_nums
      }
    } catch (err) {
      console.error('分享次数统计失败:', err)
    }
  }
  
  // 触发小程序分享面板
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

const shareTimelineareOptions = ref({
  title: '',
  query: '',
  imageUrl: ''
})

const setShareTimelinePath = (title,query,imageUrl) => {
  shareTimelineareOptions.value.query = query
  shareTimelineareOptions.value.imageUrl = imageUrl
  shareTimelineareOptions.value.title = title
}

// 分享到朋友圈
onShareTimeline(() => {
  // if (await checkLogin()) return;
  // 获取当前视频信息
  const currentVideo = all_videos.value[video_index.value]
  const shareTitle = currentVideo?.intro || currentVideo?.performer || '精彩视频分享'
  const shareImageUrl = currentVideo?.cover_image || posterUrl.value
  const shareId = currentVideo?.id || videoId.value
  
  console.log('分享到朋友圈参数:', {
    shareId,
    shareTitle,
    shareImageUrl
  })
  
  // 调用分享接口，增加分享次数
  if (shareId) {
    homeApi.getStageShareApi({ id: shareId }).then(() => {
      console.log('分享次数统计成功')
    }).catch(err => {
      console.error('分享次数统计失败:', err)
    })
  }
  let invite_code = uni.getStorageSync('userInfo').user_code || ''
  
  // path: `/pagesVideo/video-detail?id=${shareId}&invite_code=${invite_code}`,
  let query = `id=${shareId}&invite_code=${invite_code}`
  setShareTimelinePath(shareTitle,query,shareImageUrl)
  return shareTimelineareOptions.value
});

onShow(async ()=>{
  if (!(await checkTokenEventAst())) {
    uni.hideShareMenu({
      menus: ['shareTimeline']
    })
  } else {
    uni.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
})
</script>

<style lang="less" scoped>
.video-detail-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000000;
}

/* 加载状态 */
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top: 4rpx solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24rpx;
}

.loading-text {
  color: #FFFFFF;
  font-size: 28rpx;
}

/* 错误状态 */
.error-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
  padding: 0 60rpx;
}

.error-text {
  color: #FFFFFF;
  font-size: 28rpx;
  margin: 32rpx 0;
  text-align: center;
  line-height: 1.5;
}

.retry-btn {
  width: 200rpx;
  height: 72rpx;
  background: #1890FF;
  border-radius: 36rpx;
  color: #FFFFFF;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16rpx;
  cursor: pointer;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 视频播放区域 - 全屏 */
.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: 0;
}

/* 视频上层容器 - 竖屏 */
.video-up-vertical {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  /* 适配苹果手机全屏 */
  -webkit-overflow-scrolling: touch;
}

/* 视频上层容器 - 横屏 */
.video-up-horizontal {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20rpx 0;
  width: 100%;
  overflow: hidden;
  /* 适配苹果手机全屏 */
  -webkit-overflow-scrolling: touch;
}

/* 视频容器 - 竖屏 */
.Video-box-vertical {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  will-change: transform;
  /* 适配苹果手机全屏 */
  -webkit-overflow-scrolling: touch;
  /* iOS全屏适配 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* 确保层级高于其他元素 */
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  /* 确保全屏覆盖 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 视频容器 - 横屏 */
.Video-box-horizontal {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  will-change: transform;
  /* 适配苹果手机全屏 */
  -webkit-overflow-scrolling: touch;
  /* iOS全屏适配 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* 确保层级高于其他元素 */
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  /* 确保全屏覆盖 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 视频播放器 - 竖屏 */
.myVideo-vertical {
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  object-fit: cover;
  background-color: #000000;
  /* 适配苹果手机全屏 */
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  /* iOS全屏适配 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* 确保视频层级高于容器 */
  position: absolute;
  z-index: 999;
  /* 确保全屏覆盖 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 移除安全区域影响 */
  margin: 0;
  padding: 0;
}

/* 视频播放器 - 横屏 */
.myVideo-horizontal {
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  object-fit: contain;
  background-color: #000000;
  /* 适配苹果手机全屏 */
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  /* iOS全屏适配 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* 确保视频层级高于容器 */
  position: absolute;
  z-index: 999;
  /* 确保全屏覆盖 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 移除安全区域影响 */
  margin: 0;
  padding: 0;
}

/* iOS设备特定优化 */
.myVideo-ios {
  transition-property: transform !important;
  transition-duration: 0s !important;
}

/* 滑动组件 */
.swiper {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  transition: opacity 0.3s ease;
  /* 适配苹果手机全屏 */
  -webkit-overflow-scrolling: touch;
}

.swiper-item {
  position: relative;
  height: 100vh;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  /* 适配苹果手机全屏 */
  -webkit-overflow-scrolling: touch;
}

/* 顶部导航栏 - 白色背景 */
.nav-bar {
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30rpx;
  box-sizing: border-box;
}

/* 固定在顶部的导航栏 */
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-back {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 16rpx;
  /* 确保箭头与胶囊垂直对齐 */
  transform: translateY(0);
}

.nav-title {
  font-size: 32rpx;
  color: #000000;
  font-weight: 500;
  /* 确保文字与胶囊垂直对齐 */
  line-height: 44px;
  transform: translateY(0);
}

.commodity-Card{
  padding-bottom: 24rpx;
}

/* 视频信息区域 */
.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  color: #FFFFFF;
  z-index: 20;
  box-sizing: border-box;
  /* 调整高度，确保蒙层与屏幕底层对齐 */
  min-height: 300rpx;
  /* 添加黑色渐变蒙层，确保白色视频时文字清晰可见 */
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0.8) 100%);
  /* 增加内边距，确保文字不紧贴边缘 */
  padding-top: 120rpx;
  padding-bottom: 60rpx;
}

/* 加载中图标 */
.loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
}

.loading-icon .loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top: 4rpx solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 暂停图片 */
.iconimg3 {
  width: 88rpx;
  height: 88rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* 全屏按钮容器 */
.fullscreen-btn-container {
  position: absolute;
  bottom: 360rpx;
  right: 24rpx;
  z-index: 30;
}

/* 全屏按钮 */
.fullscreen-btn {
}


/* 全屏按钮文字 */
.fullscreen-btn-text {
  font-size: 24rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.info-item {
  margin-bottom: 16rpx;
  display: flex;
  align-items: flex-start;
  word-break: break-word;
  font-size: 28rpx;
  line-height: 1.5;
}

.intro-item {
  margin-top: 8rpx;
  font-size: 26rpx;
  line-height: 1.6;
  width: 650rpx;
}

.info-label {
  color: rgba(255, 255, 255, 1);
  flex-shrink: 0;
  font-size: 34rpx;
}

.info-value {
  color: #FFFFFF;
  flex: 1;
  font-size: 34rpx;
}

/* 视频统计信息 */
.video-stats {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.3);
}

.stat-item {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
  background: transparent;
  border: none;
  padding: 0;
}

/* 分享按钮样式 */
.stat-item[open-type="share"] {
  background: transparent;
  border: none;
  padding: 0;
}

.stat-item[open-type="share"]::after {
  border: none;
}

.stat-item u-icon {
  margin-right: 10rpx;
}

.stat-value {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: 500;
  margin-left:  12rpx;
}

.stat-divider {
  width: 3rpx;
  height: 24rpx;
  background: rgba(255, 255, 255, 1);
  margin-right: 20rpx;
  border-radius: 2px;
}
</style>