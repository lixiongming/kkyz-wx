<template>
  <g-new-modal ref="modal" :btn_type="2" @close="_close" title="">
    <template v-slot:content>
      <view class="constom-content">
        <image
          class="logo-icon"
          mode="aspectFill"
          :src="
            imgUrlEvent(
              '/images/wx-applet/mine/kankan-logo.png',
              'aliyunImgUrl'
            )
          "
        ></image>
        <text class="ctn-subtip">看看宇宙 申请使用</text>
        <text class="ctn-tip">您的手机号码</text>
        <view class="checkbox-group">
          <u-checkbox-group
            placement="column"
            @change="checkboxEvent"
          >
            <u-checkbox size="16" name="同意"  :checked="from_vle.isagreement"> </u-checkbox>
          </u-checkbox-group>
          <text class="text1" @click="checkLabelClick">我已阅读并同意</text>
          <text class="text1 text2" @click="lookagreement('user_agreement')"
            >《用户协议》</text
          >
          <text class="text1 text2">、</text>
          <text class="text1 text2" @click="lookagreement('privacy_agreement')"
            >《隐私政策》</text
          >
        </view>
      </view>
    </template>
    <template v-slot:footer>
      <view class="footer-box">
        <button
          open-type="getPhoneNumber"
          hover-class="none"
          class="footer-btn footer-top"
          @getphonenumber="confirmEvent"
          v-if="from_vle.isagreement"
        >
          <text class="text">{{ "确定" }}</text>
        </button>
        <view class="footer-btn footer-top" @click="confirmEvent" v-else>
            <text class="text">{{ "确定" }}</text>
        </view>
        <view class="footer-btn footer-bottom" @click="_close"
          ><text class="text">{{ "取消" }}</text></view
        >
      </view>
    </template>
  </g-new-modal>
  <uni-popup
    ref="popup"
    type="bottom"
    border-radius="10px 10px 0 0"
    :safe-area="false"
    background-color="#fff"
  >
    <view class="popup-wrap">
      <scroll-view :scroll-y="true" class="scroll-box" :show-scrollbar="false">
        <view class="popup-box" v-html="look_txt">
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, defineProps, defineEmits, computed, defineExpose, watch } from "vue";
import { mineApi } from "@/business/api/index.ts";
import { jwtDecode } from '@/infrastructure/utils/jwt-decode.js'
import uerStore from "@/business/store/modules/mine";
import uerStore2 from "@/business/store/index";
import Routine from "@/infrastructure/libs/routine";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
const store = uerStore();
const store2 = uerStore2();
const emits = defineEmits(["close", "confirm", "loginCallback"]);
const modal = ref();
const look_txt = ref("");
const popup = ref();
const props = defineProps({
  is_open: {
    type: Boolean,
    default: false,
  },
});
const from_vle = ref({
  mobile: "",
  password: "",
  isagreement: false,
  code: "",
});
// 《用户协议》 《隐私政策》 内容
const agreement_info = ref(store.agreementInfo);
watch(
  () => props.is_open,
  () => {
    console.log(props.is_open);
    if (props.is_open) {
      _open();
    } else {
      _close();
    }
  }
);
onShow(()=>{
 
})
// 打开弹框
function _open() {
  modal.value.open();
  console.log('uni.login执行')
   // 获取授权登录code
  Routine.getCode().then((code)=>{
      uni.setStorageSync("wx_login_code",code)
  })
}
// 关闭弹框
function _close() {
  modal.value.close();
}

function hideLoading_ () {
    uni.hideLoading()
}

// 检测session
function checkSessionPromise() {
  return new Promise((resolve, reject) => {
    uni.checkSession({
      success(e) {
        resolve(e);
      },
      fail(e) {
        Routine.getCode()
          .then((code) => {
            uni.setStorageSync("wx_login_code", code);
            resolve(code);
          })
          .catch((err) => reject(err));
      },
    });
  });
}

// 微信授权登录
function wxchatLoginHandle(e) {
  //将code,encryptedData,iv传给后台进行解密
  if (!e.detail.encryptedData || !e.detail.iv) return;
  uni.showLoading({
    title: "登录中...",
    mask: true,
  });
  mineApi
    .wxchatLoginApi({
      code: uni.getStorageSync("wx_login_code"),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      invite_code: uni.getStorageSync("invite_code"),
    })
    .then(async (res) => {
      let data = res.data;
      uni.removeStorageSync("invite_code");
      if (res.code == 200) {
        console.log("data", data);
        const decoded = jwtDecode(data.token);
        uni.setStorageSync("token_time",decoded.exp)
        uni.setStorageSync("middle_token", data.middle_token);
        uni.setStorageSync("token", data.token);
        uni.setStorageSync("isLogin", true);
        await store.baseInfoApi();
        store.isLogin = true;
        uni.setStorageSync("o_id", data.openid);
        store.openid = data.openid;
        store2.$patch((state) => {
          state.token = data.token;
          state.middle_token = data.middle_token;
        });
        uni.showToast({
          title: "登录成功",
          duration: 2000,
        });
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        console.log("当前页面的路由：", currentPage.route);
        hideLoading_();
        emits("loginCallback", true);
      }
    })
    .catch((error) => {
      console.log("error--->", error);
      hideLoading_();
      uni.showToast({
        title: error,
        icon: "none",
        duration: 2000,
      });
    })
    .catch((e) => {
      hideLoading_();
      uni.showToast({
        title: "登录失败",
        icon: "none",
        duration: 2000,
      });
    });
}

async function confirmEvent(e) {
  if (from_vle.value.isagreement) {
    _close();
   await checkSessionPromise()
   wxchatLoginHandle(e)
  } else {
    uni.showToast({
      title: "请勾选协议",
      icon: "none",
    });
  }
}

function checkboxEvent(e) {
  console.log(e);
  if (e.length > 0) {
    from_vle.value.isagreement = true;
  } else {
    from_vle.value.isagreement = false;
  }
}

const lookagreement = async (type) => {
  const { privacy_agreement, user_agreement } = agreement_info.value;
  if (!privacy_agreement || !user_agreement) {
    // 请求
    const { data } = await mineApi.getAgreementApi();
    agreement_info.value = data;
    console.log("data-->", data);
  }
  console.log("agreement_info.value", agreement_info.value);
  look_txt.value = agreement_info.value[type]
  popup.value.open("bottom");
};

const checkLabelClick = () => {
  from_vle.value.isagreement = !from_vle.value.isagreement;
};

// 暴露方法
defineExpose({
  open: _open,
  close: _close,
});
</script>

<style lang="less" scoped>
.popup-box{
  color:#000000 !important;
}
button {
  background: rgba(0, 0, 0, 0);
  // border: none;
  width: 300rpx;
}
button::after {
  border: none !important;
}
.scroll-box {
  height: 760rpx;
}
.popup-wrap {
  width: 750rpx;
  height: 800rpx;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0px 0px;
}
.constom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo-icon {
    width: 200rpx !important;
    height: 200rpx !important;
    margin-bottom: 24rpx;
    margin-top: 16rpx;
  }
  .ctn-subtip {
    font-weight: 400;
    font-size: 28rpx;
    color: #000000;
    display: inline-block;
    margin-bottom: 24rpx;
  }
  .ctn-tip {
    font-weight: 600;
    font-size: 34rpx;
    color: #111111;
    margin-bottom: 40rpx;
  }
}

.footer-box {
  padding: 0 80rpx 60rpx;
  .footer-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer-top {
    height: 80rpx;
    background: #1B9AFF;
    box-shadow: 0 10rpx 20rpx 0 #43acff80;
    border-radius: 38rpx;
    margin-bottom: 24rpx;
    .text {
      font-weight: 600;
      font-size: 28rpx;
      color: #FFFFFF;
      text-align: center;
      line-height: 40rpx;
    }
  }
  .footer-bottom {
    height: 40px;
    border: 2rpx solid #D3D3D3;
    border-radius: 38rpx;
    .text {
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
    }
  }
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin: 0rpx 0rpx 20rpx;
  // padding-left: 24rpx;
  .text1 {
    color: #a5a5a5;
    font-family: "PingFang SC";
    font-size: 24rpx;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
.title {
  display: flex;
  justify-content: center;
  .text {
    font-weight: 500;
    font-size: 30rpx;
    color: #000000;
  }
}

.text1 {
  font-size: 26rpx;
  color: #111111;
}

.text2 {
  color: #1b9aff !important;
}
</style>
