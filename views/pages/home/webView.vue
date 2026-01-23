<template>
  <web-view
    :src="url"
    :webview-styles="{
      top: t + 'px',
      height: h ? h + 'px' : h,
      bottom: b == 'unset' ? b : b + 'px',
    }"
    @message="onMessageFromH5"
    class="web-view"
  ></web-view>
</template>

<script setup lang="ts">
import { onLoad,onShow, onReady,onInit,onHide,onUnload} from "@dcloudio/uni-app";
import { ref, computed, watch } from "vue";
import { mineApi } from "/business/api/index.ts";
const url = ref("");
const hei = uni.getSystemInfoSync().windowHeight;
const tophei = uni.getSystemInfoSync().statusBarHeight;
const t = ref(tophei);
const h = ref(hei - tophei);
const b = ref("unset");
const isIos = ref(false);
isIos.value = uni.getSystemInfoSync().platform == "ios";
let timeHandle = null;
// token失效状态
let isInvalid = ref(false);
onLoad((option) => {
  console.log(option);
  url.value = option.url;
  /* #ifdef APP-PLUS */
  uni.onKeyboardHeightChange(onKeyboardHeightChange);
  /* #endif */
});

onShow(() => {
  // 校验token是否失效
  pollToken();
});

// 监听token是否失效
function pollToken() {
  clearTokenTimer();
  // 第一次先执行
  checkToken();
  // 开始轮询
  timeHandle = setInterval(() => {
    // 防止第一次失效，没有清除定时器
    if (isInvalid.value) {
      clearTokenTimer();
    }
    checkToken();
  }, 5000);
}

// 清除定时器
function clearTokenTimer() {
  if (timeHandle) {
    clearInterval(timeHandle);
    timeHandle = null;
  }
}

function checkToken() {
  mineApi.checkToken().then((res) => {
    const loginType = res.data.valid;
    if (!loginType) {
      isInvalid.value = true;
      clearTokenTimer();
      uni.showToast({
        title: "登录已失效，请重新登录",
        icon: "none",
        duration: 2000,
      });
       let timer = setTimeout(() => {
        // 弹窗登录框
        uni.navigateTo({
          url: "/packages/kkyz/views/pages/mine/login",
        });
              clearTimeout(timer);
      }, 2000);
    }
  });
}

function onMessageFromH5 (event) {
	const { action, data } = event.detail;
	if (typeof data[0] == 'object') {
		uni.downloadFile({
		  url: data[0].url,
		  success: function (res) {
		    let filePath = res.tempFilePath;
		    uni.saveImageToPhotosAlbum({
				filePath: res.tempFilePath,
				success: () => {
					uni.showToast({
						title: '图片已保存',
						icon: 'success',
					});
				},
				fail: (err) => {
					uni.showToast({
						title: '保存失败',
						icon: 'none',
					});
				},
			});
		  }
		});
	} else {
		plus.runtime.openURL(data[0])
	}
}

onHide(() => {
  isInvalid.value = false;
  clearTokenTimer();
});

onUnload(() => {
  /* #ifdef APP-PLUS */
  uni.offKeyboardHeightChange(onKeyboardHeightChange);
  /* #endif */
  isInvalid.value = false;
  clearTokenTimer();
  // if (uni.getStorageSync('is_pay') == 1) {
  // }
});

// const webviewStyles = ref({
//   top:tophei+'px',
//   height:hei-tophei+'px'
// });

function onKeyboardHeightChange(res) {
  let height = null;
  if (res.height == 0) {
    height = hei - tophei;
    b.value = 0;
  } else {
    b.value = "unset";
    height = hei - tophei - res.height;
  }
  if (!isIos.value) {
    h.value = height;
  }
}
</script>

<style lang="less" scoped>
.web-view {
  background: #000;
}
</style>
