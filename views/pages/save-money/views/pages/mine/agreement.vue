<template>
  <c-main classs="flex">
    <!-- <c-header :title="dynamicAgreementTitle" :extra_warp_styles="{ paddingTop: 50 + 'px'}"></c-header> -->
    <Inav :title="dynamicAgreementTitle" ></Inav>
    <view class="content-box" :style="{ padding: '16px 16px 0'}">
      <scroll-view
          :scroll-y="true"
          class="uv-content"
          :style="{
            height: windowHeight - statusBarHeight - 44 - 16 + 'px',
            width: windowWidth - 32 + 'px',
            overflow: 'hidden',
            paddingBottom: 10 + 'px',
          }"
        >
          <uv-parse
            :content="agreementVal"
            @load="load"
            :tagStyle="styles"
          ></uv-parse>
        </scroll-view>
    </view>
  </c-main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { mineApi } from '@/business/api/index.ts'
import Inav from "@/views/components/i-nav.nvue";
import uerStore from "@/business/store/index";
const store = uerStore();
const windowHeight = uni.getSystemInfoSync().windowHeight;
// const windowHeight = store.windowHeight;
const windowWidth = uni.getSystemInfoSync().windowWidth;
// const windowWidth = store.$windowWidth;
// const statusBarHeight = store.$statusBarHeight;
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
let dynamicAgreementTitle = ref("幸运大抽奖活动说明");
const load = () => {};

const styles = {
  img: "margin:32rpx 0px",
  text: "font-size:28rpx;text-align: justify;margin-top:0rpx;word-wrap: break-word;overflow-wrap: break-word;",
  span: "font-size:28rpx;margin-top:0rpx;word-wrap: break-word;overflow-wrap: break-word;",
  p: "font-size:28rpx;margin:0rpx;padding:0rpx;line-height:1.5;word-wrap: break-word;overflow-wrap: break-word;",
};

onLoad((options) => {
  let type = options.type;
  if (type == 1) {
    // 幸运大抽奖活动说明
    dynamicAgreementTitle.value = "幸运大抽奖活动说明";
    getAgreementContent("certification_notice");
  } else if (type == 2) {
    dynamicAgreementTitle.value = "领主协议";
    getAgreementContent("lord_agreement");
  }else if(type==3){
     dynamicAgreementTitle.value = "内容发布规范";
     getAgreementContent("content_publishing_standards");
  }else if(type==4){
     dynamicAgreementTitle.value = "体验官协议";
     getAgreementContent("experience_officer_agreement");
  }else if(type==5){
     dynamicAgreementTitle.value = "赚省星球";
    //  getAgreementContent("lord_agreement");
  }else if(type==6){
     dynamicAgreementTitle.value = "会员开通协议";
     getAgreementContent("membership_agreement");
  }else if(type==7){
     dynamicAgreementTitle.value = "赚省星球幸运大抽奖活动说明";
     getAgreementContent("lottery_activity_description");
  } else if(type==8){
     dynamicAgreementTitle.value = "视频号达人矩阵任务说明";
     getAgreementContent("video_matrix_task");
  }
});

const agreementVal = ref(``);

const getAgreementContent = (type) => {
    mineApi.getUserAgreementInfosApi(type).then((res) => {
        if (res.code == 200) {
            agreementVal.value = res.data?.content;
            console.log("Agreement--->", res.data?.content)
        }
        
    }).catch(() => {})
};
</script>
<style scoped lang="less">
.container-box {
  background: #fbfbfb;
  position: relative;
}
.content-box {
  // padding: 32rpx 32rpx 0;
  background: #fbfbfb;
}
/deep/._root {
  padding-bottom: 50rpx;
}
</style>
