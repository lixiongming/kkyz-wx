<template>
  <view
    class="mine flex flex-ac flex-column"
    :style="{ height: window_height + 'px' }"
  >
    <view class="header">
      <image
        :src="$imgUrl('/images/mine/applet-mine-head-bg.png')"
        alt=""
        class="header_bg"
      ></image>
      <view class="back-icon" :style="{ top: backIconTop + 'px' }" >
         <uni-icons type="left"  @click="toHome" size="24"></uni-icons>
      </view>
      <view class="title-box">
        <view class="h-title">Hello!</view>
        <view class="title">
          <text class="text1">欢迎来到</text>
          <text class="text1">看看宇宙优选</text>
        </view>
      </view>
    </view>
    <view class="input-box">
      <input
        type="number"
        placeholder="请输入手机号"
        class="input"
        @input="inputmobile"
        placeholder-style="color:#ccc"
        :value="from_vle.mobile"
      />
      <input
        type="password"
        placeholder="请输入登录密码"
        class="input"
        @input="inputpassword"
        placeholder-style="color:#ccc"
        v-if="current_tabs == 0"
        :value="from_vle.password"
      />
      <view class="Verification-code" v-else>
        <input
          type="text"
          placeholder="请输入验证码"
          class="input"
          @input="inputcode"
          placeholder-style="color:#ccc"
        />
        <text class="get-code" @click="handleVerify" v-if="!codeFlag"
          >获取验证码</text
        >
        <text class="get-code" @click="handleVerify" v-else
          >{{ codeTime }}s</text
        >
      </view>
      <view class="register-text"><text @click="topage('sign')">账号注册</text></view>
    </view>
    <view
      class="login-btn flex flex-ac jc-ct"
      @click="login"
      :class="{
        'login-btn-active':
          (from_vle.password || from_vle.code) &&
          from_vle.mobile &&
          from_vle.isagreement,
      }"
    >
      <text class="text1">登录</text>
    </view>
    <view class="other-login-method flex flex-column flex-ac">
      <view class="method-title">——&nbsp;&nbsp;手机号快捷登录&nbsp;&nbsp;——</view>
      <view class="method-list">
        <button
          class="wx-btn-box"
          hover-class="none"
          @click="wxchatLogin"
          v-if="!from_vle.isagreement"
        >
          <image
            :src="$imgUrl('/images/mine/phone-wx-icon.png')"
            alt=""
            class="method-icon"
          ></image>
        </button>
        <button
          v-else
          class="wx-btn-box"
          open-type="getPhoneNumber"
          hover-class="none"
          @getphonenumber="wxLogin"
        >
          <image
            :src="$imgUrl('/images/mine/phone-wx-icon.png')"
            alt=""
            class="method-icon"
          ></image>
        </button>
      </view>
    </view>
    <view class="flex jc-ct">
      <checkbox-group
        class="checkbox-content flex flex-ac"
        @change="checkboxEvent"
      >
        <checkbox
          class="checkbox"
          style="transform: scale(0.7)"
          activeBackgroundColor="#111111"
          value="r1"
          color="#FF6A00"
          iconColor="#FF6A00"
          :checked="from_vle.isagreement"
        />
        <text class="text1" @click="checkLabelClick">我已阅读并同意</text>
        <text class="text1 text2" @click="lookagreement('user_agreement')"
          >《用户协议》</text
        >
        <text class="text1 text2">、</text>
        <text class="text1 text2" @click="lookagreement('privacy_agreement')"
          >《隐私政策》</text
        >
      </checkbox-group>
    </view>
    
    
  </view>
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
  <Verify
    @success="successVerify"
    :captchaType="'blockPuzzle'"
    :imgSize="{ width: '330px', height: '155px' }"
    ref="verify_el"
  ></Verify>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import uerStore from "@/business/store/modules/mine";
import uerStore2 from "@/business/store/index";
import { mineApi } from "@/business/api/index.ts";
import { encryptAES } from "@/infrastructure/utils/crypto-js";
import Verify from "@/views/components/verify/verify.vue";
import mission_use_store from '/views/pages/save-money/store/modules/mission.ts'
import Routine from "@/infrastructure/libs/routine";
import { jwtDecode } from '@/infrastructure/utils/jwt-decode.js'


const store = uerStore();
const store2 = uerStore2();
const mission_store = mission_use_store();
const current_tabs = ref(0);
// #ifdef APP-PLUS || MP-WEIXIN
const window_height = uni.getSystemInfoSync().windowHeight;
// #endif
// #ifdef H5
const window_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().safeAreaInsets.bottom;
// #endif
const popup = ref();
const verify_el = ref();
const captchaVerification = ref(""); //短信校验
const codeTime = ref(60);
const codeFlag = ref(false);
var zz = /^1\d{10}$/;
let is_go_home = false;
let is_go_publish = false;
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
const backIconTop =  statusBarHeight
console.log(statusBarHeight,menuButtonInfo)
const path = ref("");
onLoad((opt) => {
  is_go_home = opt.isHome ? true : false;
  is_go_publish = opt.isPublish ? true : false;
  if (opt.path) {
    path.value = decodeURIComponent(opt.path)
  }
   // 获取授权登录code
  Routine.getCode().then((code)=>{
      uni.setStorageSync("wx_login_code",code)
  })
});

const from_vle = ref({
  mobile: "",
  password: "",
  isagreement: false,
  code: "",
});

// 《用户协议》 《隐私政策》 内容
const agreement_info = ref(store.agreementInfo);

// 查看内容
const look_txt = ref("");

//切换视频地址
const changeTabs = (data: number) => {
  current_tabs.value = data;
  from_vle.value.password = "";
  from_vle.value.code = "";
};

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
  console.log( look_txt.value)
};

// 手机input输入
const inputmobile = (e) => {
  from_vle.value.mobile = e.detail.value;
};
const inputpassword = (e) => {
  from_vle.value.password = e.detail.value;
};
const inputcode = (e) => {
  from_vle.value.code = e.detail.value;
};

const checkboxEvent = (e) => {
  console.log(e);
  if (e.detail.value.length > 0) {
    from_vle.value.isagreement = true;
  } else {
    from_vle.value.isagreement = false;
  }
};
// 忘记密码
const forgotPassword = () => {
  var reg = /^1[3456789]\d{9}$/;
  if (!reg.test(from_vle.value.mobile.trim())) {
    uni.showToast({
      title: "请输入正确的手机号",
      duration: 2000,
      icon: "none",
    });
  } else {
    uni.navigateTo({
      url: `/views/pages/mine/pages/forget_password?mobile=${from_vle.value.mobile}`,
    });
  }
};

// 点击文字选中
const checkLabelClick = () => {
  formData.value.isagreement = !formData.value.isagreement;
};

// 手机号校验
function mobileCheck() {
  let flag = true;
  if (!zz.test(from_vle.value.mobile)) {
    let title = "请输入手机号";
    let mobile = from_vle.value.mobile && from_vle.value.mobile.trim();
    if (mobile) {
      title = "请输入正确的手机号";
    }
    uni.showToast({
      title,
      duration: 2000,
      icon: "none",
    });
    flag = false;
  }
  return flag;
}

// 获取验证码
const getCode = async () => {
  if (!mobileCheck()) return;
  const { password, mobile, code, invite_code } = from_vle.value;
  try {
    await store.sendSmsApi({
      mobile,
      event: "login",
      captchaVerification: captchaVerification.value,
    });
    uni.showToast({
      title: "验证码发送成功",
      duration: 2000,
    });
  } catch (e) {
    console.log(e);
    return;
  }
  codeFlag.value = true;
  let time = setInterval(() => {
    if (codeTime.value == 1) {
      clearInterval(time);
      codeFlag.value = false;
      codeTime.value = 60;
    }
    codeTime.value -= 1;
  }, 1000);
};

function wxchatLogin() {
  if (!from_vle.value.isagreement) {
    uni.showToast({
      title: "请先同意并勾选协议",
      duration: 2000,
      icon: "none",
    });
    return;
  }
}

// 微信登录
function wxLogin(e) {
  if (!from_vle.value.isagreement) {
    uni.showToast({
      title: "请先同意并勾选协议",
      duration: 2000,
      icon: "none",
    });
    return;
  }
  console.log("e--->", e.detail, e)
    uni.checkSession({
    success(e) {
      console.log('code校验成功',e)
      //session_key 未过期，并且在本生命周期一直有效（这里面可以不写代码）
    },
    fail(e) {
      console.log('code校验失败',e)
    // 获取授权登录code
     Routine.getCode().then((code)=>{
         uni.setStorageSync("wx_login_code",code)
     })
    },
    complete() {
     if (!e.detail.encryptedData || !e.detail.iv) return;
     mineApi.wxchatLoginApi({
       code:uni.getStorageSync("wx_login_code"),
       encryptedData: e.detail.encryptedData,
       iv: e.detail.iv,
       invite_code:uni.getStorageSync('invite_code')
     }).then(async (res) => {
        let data = res.data;
        uni.removeStorageSync('invite_code');
        if (res.code == 200) {
          console.log("data", data);
          const decoded = jwtDecode(data.token);
          uni.setStorageSync("token_time",decoded.exp)
          uni.setStorageSync('middle_token', data.middle_token);
          uni.setStorageSync('token', data.token);
          uni.setStorageSync('isLogin', true);
          await store.baseInfoApi();
          store.isLogin = true;
          store2.$patch((state) => {
              state.token = data.token;
              state.middle_token = data.middle_token;
          })
          uni.showToast({
            title: "登录成功",
            duration: 2000,
          });
          // 跳转
          JumpLogic()
      }
    }).catch((error) => {
      console.log('error--->', error)
      uni.showToast({
        title: error,
        icon: "none",
        duration: 2000,
      });
    })
    }
    })
}

const login = () => {
  if (current_tabs.value == 0) {
    passwordLogin();
  } else {
    codeLogin();
  }
};

const passwordLogin = async () => {
  if (!mobileCheck()) return;
  // 账号密码均填
  if (!from_vle.value.password) {
    uni.showToast({
      title: "请输入密码",
      duration: 2000,
      icon: "none",
    });
    return;
  }
  if (!from_vle.value.isagreement) {
    uni.showToast({
      title: "请先同意并勾选协议",
      duration: 2000,
      icon: "none",
    });
    return;
  }

  const { password, mobile } = from_vle.value;
  await store.loginApi({ mobile, password, type: "pwd" });
  await store.baseInfoApi();
  getPrivacySet();
  if (!mission_store.expert_parent_code) {
    uni.showToast({
      title: "登录成功",
      duration: 2000,
    });
  }
   // 跳转
   JumpLogic()
};

const codeLogin = async () => {
  if (!mobileCheck()) return;
  // 账号密码均填
  if (!from_vle.value.code) {
    uni.showToast({
      title: "请输入验证码",
      duration: 2000,
      icon: "none",
    });
    return;
  }
  if (!from_vle.value.isagreement) {
    uni.showToast({
      title: "请先同意并勾选协议",
      duration: 2000,
      icon: "none",
    });
    return;
  }

  const { code, mobile } = from_vle.value;
  await store.loginApi({ mobile, code, type: "code" });
  await store.baseInfoApi();
  getPrivacySet();
  uni.showToast({
    title: "登录成功",
    duration: 2000,
  });
  // 跳转
  JumpLogic()
};



const topage = (data) => {
  let url = "";
  let method = "navigateTo";
  switch (data) {
    case "sign":
      url = "/views/pages/mine/sign";
      from_vle.value = {
        mobile: "",
        password: "",
        isagreement: false,
        code: "",
      };
      break;
    case "mine": 
	 // #ifdef H5 || MP-WEIXIN
      url = uni.getStorageSync("jumpPath") || "/views/pages/home/index";
      method = "switchTab"; // 清除缓存
      uni.removeStorageSync("jumpPath"); 
	  // #endif
      break;
  }
  if (method == "navigateTo") {
    uni.navigateTo({
      url,
    });
  } else if (method == "switchTab") {
    uni.switchTab({
      url,
    });
    console.log("9999099"); // switchTab(url);
  } else if (method == "redirectTo"){
    uni.redirectTo({
      url
    });
  }
};

// 获取权限
const getPrivacySet = async () => {
  let res = await mineApi.getPrivacySet();
  if (res && res.code === 200) {
    uni.setStorageSync("_auth", res.data);
    // setListData(res.data);
  }
};

//快速登录
const quickLogin = async (p) => {
  let login_token = encryptAES(p);
  const userInfo = await store.loginApi({
    mobile: p,
    login_token,
    type: "one-key",
  });
  if (!userInfo) {
    uni.closeAuthView(); //关闭授权页面
    return;
  }
  await store.baseInfoApi();
  getPrivacySet();

  uni.showToast({
    title: "登录成功",
    duration: 2000,
  });

  uni.closeAuthView(); //成功关闭授权页面
   JumpLogic()

};

// 登录后跳转逻辑
  function JumpLogic (){
// tabbar页面路径
    let routes = [
      "views/pages/home/index",
      "pages/kkyz-shop/index",
      "views/pages/save-money/views/pages/mission/video-matrix",
      "views/pages/good/index",
      "views/pages/mine/index"
    ];
  if (is_go_home) {
    uni.switchTab({
      url: "/views/pages/home/index",
    });
  } else if (is_go_publish) {
    uni.redirectTo({
      url: "/views/pages/publish/index",
    });
  } else if (path.value) {
    if (path.value.indexOf("/") == -1) {
      path.value = decodeURIComponent(path.value);
    }
    console.log("path.value--->", path.value)
    if (path.value === "views/pages/mine/login") {
      uni.switchTab({
        url: "/views/pages/save-money/views/pages/mission/video-matrix",
      });
    } else {
      // if (routes.indexOf(path.value) > -1) {
      if (routes.some(r => path.value.includes(r))) {
        uni.switchTab({
          url: path.value.indexOf("/") == 0 ? path.value : "/" + path.value,
        });
      } else {
        uni.redirectTo({
          url: path.value.indexOf("/") == 0 ? path.value : "/" + path.value,
        });
      }
    }
  } else {
    topage("mine");
  }

 }


// 手机号一键登录
const loginPhone = async (isShowMsg = false) => {
  let that = this;
  uni.showLoading({ title: "手机号获取中..." });
  uni.preLogin({
    provider: "univerify",
    success(res) {
      //预登录成功
      uni.hideLoading();
      // 显示一键登录选项
      console.log(res);
      console.log("预登录成功");
      uni.login({
        provider: "univerify",
        univerifyStyle: {
          //参考`univerifyStyle 数据结构`
          fullScreen: false, // 是否全屏显示，默认值： false
          title: "快速登录",
          backgroundColor: "#ffffff", // 授权页面背景颜色，默认值：#ffffff
          icon: {
            path: "/static/images/home/kkyzLogo.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
          },
          phoneNum: {
            color: "#000000", // 手机号文字颜色 默认值：#000000
            fontSize: "18", // 手机号字体大小 默认值：18
          },
          slogan: {
            color: "#8a8b90", //  slogan 字体颜色 默认值：#8a8b90
            fontSize: "12", // slogan 字体大小 默认值：12
          },
          // 一键登录
          authButton: {
            normalColor: "#00C2FF", // 授权按钮正常状态背景颜色 默认值：#3479f5
            highlightColor: "#00C2FF", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
            disabledColor: "rgba(0, 194, 255, 0.5)", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
            textColor: "#ffffff", // 授权按钮文字颜色 默认值：#ffffff
            title: "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”
          },
          // 其他登录方式
          otherLoginButton: {
            visible: "false", // 是否显示其他登录按钮，默认值：true
            normalColor: "#f8f8f8", // 其他登录按钮正常状态背景颜色 默认值：#f8f8f8
            highlightColor: "#dedede", // 其他登录按钮按下状态背景颜色 默认值：#dedede
            textColor: "#000000", // 其他登录按钮文字颜色 默认值：#000000
            title: "密码登录", // 其他登录方式按钮文字 默认值：“其他登录方式”
            borderWidth: "1px", // 边框宽度 默认值：1px（仅ios支持）
            borderColor: "#c5c5c5", //边框颜色 默认值： #c5c5c5（仅ios支持）
          },
          // 自定义按钮登录方式
          buttons: {
            // 仅全屏模式生效，配置页面下方按钮  （3.1.14+ 版本支持）
            iconWidth: "45px", // 图标宽度（高度等比例缩放） 默认值：45px
            list: [
              {
                provider: "apple",
                iconPath: "/static/test.jpg", // 图标路径仅支持本地图片
              },
              {
                provider: "weixin",
                iconPath: "/static/test.jpg",
              },
            ],
          },
          privacyTerms: {
            defaultCheckBoxState: true,
            textColor: "#8a8b90", // 文字颜色 默认值：#8a8b90
            termsColor: "#1d4788", //  协议文字颜色 默认值： #1d4788
            prefix: "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
            suffix: "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
            fontSize: "12", // 字体大小 默认值：12,
            uncheckedImage: "/static/images/home/unchecked.png", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
            checkedImage: "/static/images/home/checked.png", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
            checkBoxSize: "16",
            privacyItems: [
              // { url: "http://kankan-admin.mdd3.cn/agreement/user_agreement.html" ,title:"隐私协议"},
              {
                url: "http://kankan-admin.mdd3.cn/agreement/user_agreement.html",
                title: "用户协议",
              },
            ],
          },
        },
        // 登录成功
        success(res) {
          console.log(res);
          const openid = res.authResult.openid;
          const access_token = res.authResult.access_token;

          // 客户端(调用云函数)  调用云函数来实现整个业务逻辑
          // 在得到access_token后，通过callfunction调用云函数
          uniCloud
            .callFunction({
              name: "getPhoneNumber",
              data: {
                openid: openid,
                access_token: access_token,
              },
            })
            .then((res) => {
              // 获取用户的手机号
              console.log("获取成功");
              console.log(res); // res 内容则包含手机号码
              const phoneNumber = res.result.phoneNumber;
              quickLogin(phoneNumber);
            })
            .catch((err) => {
              console.log(err, "errerr");
              uni.showToast({
                title: "获取失败",
                duration: 2000,
                icon: "none",
              });
              // 执行失败
              uni.closeAuthView(); //成功关闭授权页面
            });
        },
      });
    },
    // 当用户点击自定义按钮时，会触发uni.login的fail回调[点击其他登录方式，可以跳转页面]
    // 判断返回数据执行任意逻辑
    fail(err) {
      // 登录失败
      uni.hideLoading();
      if (isShowMsg && err.errMsg != "login:ok") {
        console.log(err, "errerr");
        // 不同运营商 返回的报错字段不同
        uni.showModal({
          title: "当前设备环境不支持一键登录",
          content:
            // err.errMsg ||
            // err.metastate.resultMsg ||
            // err.metastate.error_data ||
            // err.metastate.resultDesc ||
            "请检查是否插入有效sim卡及开启蜂窝数据网络",
          showCancel: false,
        });
      }
    },
  });
};

// 图形校验成功
const successVerify = (data: any) => {
  captchaVerification.value = data.captchaVerification;
  verify_el.value.hide();
  getCode();
};

// 开始图形滑块校验
const handleVerify = () => {
  if (!mobileCheck()) return;
  if (codeFlag.value) return;
  verify_el.value.show();
};

// 跳转至首页
function toHome(){
  uni.switchTab({
    url: "/views/pages/home/index",
  });
}
</script>

<style lang="less" scoped>
.forgot-password {
  margin-top: 24rpx;
  .forgot-password-text {
    color: #FF6A00;
  }
}
.popup-wrap {
  width: 750rpx;
  height: 800rpx;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0px 0px;
}

.scroll-box {
  height: 760rpx;
}

.agreement-text {
  font-size: 28rpx;
}

.popup-box {
}

.get-code {
  position: absolute;
  right: 40rpx;
  top: 26rpx;
  color: #FF6A00;
}

.Verification-code {
  position: relative;
}

.Sign {
  position: absolute;
  bottom: 110rpx;
  // margin-top: 456rpx;
  // margin-bottom: 110rpx;
}

.login-btn,
.login-btn1 {
  width: 622rpx;
  height: 88rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  // background: rgba(0, 194, 255, 0.5);
  background: linear-gradient(283deg, #FF3221, #FFA32A);
  opacity: 0.5;
  margin-top: 64rpx;

  .text1 {
    font-size: 32rpx;
    color: #fff;
  }
}

.login-btn1 {
  background: #ffffff !important;
  color: rgba(0, 194, 255, 0.5);
  border: 1px solid rgba(0, 194, 255, 0.5);
  margin-top: 30rpx;
}

.login-btn-active {
  opacity: 1;
}

.text1 {
  font-size: 26rpx;
  color: #111111;
}

.text2 {
  color: #FF6A00 !important;
}

.checkbox-content {
  margin-top: 16rpx;

  .text1 {
    color: #111111;
    font-family: "PingFang SC";
    font-size: 24rpx;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}

.input {
  width: 622rpx;
  height: 88rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background: #f5f6f6;
  margin-bottom: 32rpx;
  padding-left: 32rpx;
}
.title-box {
  position: absolute;
  top: 288rpx;
  left: 64rpx;
  z-index: 2;
}
.h-title {
  font-size: 64rpx;
  color: #111111;
  font-weight: 600;
}
.title {
  .text1 {
    color: #111111;
    font-family: "PingFang SC";
    font-size: 40rpx;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    // margin-top: 240rpx;
    // margin-left: 64rpx;
    &:last-child {
      color: #FF6A00;
    }
  }
}

.mine {
  position: relative;
  background: #fff;
  width: 750rpx;
}

/deep/ .uni-nav-bar-text.uni-ellipsis-1 {
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 36rpx;
  color: #1e1f20;
  text-align: center;
  line-height: 48rpx;
}

.header {
  position: relative;
  width: 750rpx;
  height: 560rpx;
  z-index: 1;
  // background-image: url("../../../static/images/mine/bg.png");
  // background-size: 100% 100%;
}
.back-icon{
  position: absolute;
  left: 40rpx;
  width: 48rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  z-index: 99;
}

.header_bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 750rpx;
  height: 720rpx;
  z-index: 1;
}

.set_img {
  position: absolute;
  top: 108rpx;
  left: 42rpx;
  width: 48rpx;
  height: 48rpx;
  z-index: 99;
}

.Sliding {
  position: absolute;
  width: 48rpx;
  height: 6rpx;
  border-radius: 8rpx;
  background: #1cdafe;
  // box-shadow: 0 2px 4px 0 #00000040;
  top: 50rpx;
  left: 14rpx;
  transition-property: left;
  transition-duration: 0.2s;
}

.header-tab {
  position: relative;
  padding-bottom: 88rpx;
  width: 622rpx;
}

.tab-item {
  margin-right: 48rpx;
  height: 54rpx;

  .text {
    color: #cccccc;
    font-size: 28rpx;
    font-weight: 600;
  }
}

.tab-item-active {
  .text {
    color: #111111;
    font-size: 32rpx;
  }
}

.currentTabs0 {
  left: 40rpx;
}

.currentTabs1 {
  // transform: translateX(65rpx);
  left: 230rpx;
}

.register-text {
  color: #ff6a00;
  text-align: right;
  font-family: "PingFang SC";
  font-size: 28rpx;
  font-style: normal;
  font-weight: 400;
}

.other-login-method {
  margin-bottom: 120rpx;
  .method-title {
    margin: 128rpx 0 32rpx;
    color: #aaaaaa;
    font-family: "PingFang SC";
    font-size: 24rpx;
    font-style: normal;
    font-weight: 400;
  }
  .method-list {
    .wx-btn-box {
      background-color: #fff;
      padding: 0;
      line-height: 1;
      border: none;
    }
    .method-icon {
      width: 96rpx;
      height: 96rpx;
    }
  }
}

.input-box {
  position: relative;
  z-index: 2;
}
</style>
