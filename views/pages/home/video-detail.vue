<template>
  <view>
    <view class="mian-box flex" :style="{ height: hei + 'px' }">
      <view class="flex mian-box">
        <view class="content flex">
          <myVideo  :video_detail_list="video_detail_list" :type="'video-detail'" @getMerInfo="getMerInfo"></myVideo>
          <view class="back-icon">
              <uni-icons type="arrow-left" color="#FFF" @click="backEvent" size="30"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view> </view>
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
} from "@dcloudio/uni-app";
import myVideo from "./components/my-video.vue";
import { homeApi } from "@/business/api/index.ts";
import mainStore from "@/business/store/index.ts";
let hei = uni.getSystemInfoSync().windowHeight;
let video_detail_list = ref([])
/* #ifdef MP-WEIXIN */
uni.showShareMenu({});
/* #endif */
const mainstore = mainStore();
let mer_id = ''
let parent_mer_id = ''
let img = ''
let imageUrl = ''
let post_ids = ''
const post_id = ref()
const user_id = ref()
// 获取分享id
function getMerInfo(data:any,video_item:any) {
   mer_id = data.mer_id
   img = data.mer_avatar
   imageUrl = video_item.cover_image || '' 
   post_ids = video_item.id
}

// 小程序分享
onShareAppMessage((res) => {
  let invite_code = uni.getStorageSync('userInfo').user_code || ''
  let cur_mer_id = uni.getStorageSync('parent_mer_id')
  parent_mer_id = mainstore.is_from_share && cur_mer_id ? cur_mer_id : ''
  return {
    title: "为您推荐精彩内容",
    imageUrl:'',
    path: `/views/pages/home/index?invite_code=${invite_code}&post_id=${post_ids}`,
  };
});

// 获取视频详情
async function getVideoDetail(){
  let req = {
    page:1,
    pageSize:1,
    post_id:post_id.value ,
    user_id:user_id.value
  }
  const {data} = await homeApi.personalPageVideoApi(req)
  video_detail_list.value = data.items
}
// 返回上一页
function backEvent(){
uni.navigateBack({
	delta: 1
});
}
onLoad((opt)=>{
  console.log(opt)
  user_id.value = opt.post_user_id
  post_id.value = opt.post_id
  getVideoDetail()
})
</script>

<style lang="less" scoped>
.uni-popup {
}

.mian-box {
  width: 750rpx;
  overflow: hidden;
}

.content {
  width: 2250rpx;
  transition-duration: 0.2s;
  transition-property: height, left;
  position: relative;
}
.back-icon{
  position: absolute;
  top: 100rpx;
  left: 32rpx;
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
</style>
