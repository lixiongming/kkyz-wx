<script>
import { pushMessage_event} from "/infrastructure/utils/util";
import { mineApi } from "@/business/api/index";
import { getconfigApi } from "@/infrastructure/utils/utils.js";
import mainStore from "@/business/store/index";
import Routine from "@/infrastructure/libs/routine";
import {translateMerType, autoLoginEvent} from "/infrastructure/utils/util";
export default {
  onLaunch: function (option) {
    // 获取授权登录code
     Routine.getCode().then((code)=>{
         uni.setStorageSync("wx_login_code",code)
     })
  },

  onShow: function (option) {
    autoLoginEvent() // 校验是否刷新token
    console.log('onShow--->',option)
    const scene = option.scene;
    mainStore().is_wechat_moments_share = (scene === 1154);
    // 如果用户通过微信主入口重新打开，清除标记
    if (scene === 1001) {
      mainStore().is_from_share = false
      uni.removeStorageSync('is_from_share');
      uni.removeStorageSync('parent_mer_id');
      uni.removeStorageSync('share_good_id');
    } else {
      // 否则恢复状态
    const scene = option.scene;
    // 1.分享小程序scene值(卡片形式)
    const is_from_share1 = scene === 1007 || scene === 1008 || scene === 1155;
 
    console.log("app--->", option, scene, option.query)
    // 2.分享小程序(二维码形式)
   
    const is_from_share2 = option.query?.scene ? true : false;
    const is_from_share = is_from_share1 || is_from_share2
     // 设置全局状态
    mainStore().is_from_share = is_from_share

     // 持久化标记
      uni.setStorageSync('is_from_share', is_from_share);
      mainStore().is_from_share = uni.getStorageSync('is_from_share') || false;
      if(option.query.invite_code){
        // 缓存上级邀请码
        uni.setStorageSync('invite_code',option.query.invite_code)
      }
      if (option.query.mer_id) {
        // 缓存上级id
        uni.setStorageSync('parent_mer_id',option.query.mer_id)
      }
      if (option.query.id) {
        // 缓存上级id
        uni.setStorageSync('share_good_id',option.query.id)
      }
      if (option.query.mer_type) {
        // 缓存商户类型
        uni.setStorageSync('mer_type',option.query.mer_type)
      }
     //  扫码进入
     if (is_from_share2) {
      let opt_urls = decodeURIComponent(option.query?.scene)
      opt_urls = this.parseQuery(opt_urls);
      if(opt_urls.ic){
        // 缓存上级邀请码
        uni.setStorageSync('invite_code',opt_urls.ic)
      }
      if (opt_urls.mid) {
        // 缓存上级id
        uni.setStorageSync('parent_mer_id',opt_urls.mid)
      }
      if (opt_urls.id) {
        // 缓存分享商品id
        uni.setStorageSync('share_good_id',opt_urls.id)
      }
      if (opt_urls.t) {
        // 缓存商户类型
        uni.setStorageSync('mer_type',translateMerType(opt_urls.t))
      }
    }
    }
    // #ifdef APP-PLUS
    // 监听消息推送
    pushMessage_event()
    
    console.log("App Show");
    // getLocation(); //获取当前位置信息
    /* #ifdef APP-PLUS */
    // this.midBtnTap();
    // 检查更新
    // callCheckVersion().then(res => {
    // 	if (res.result.code > 0) {
    // 		// 有新版本
    // 		checkUpdate();
    // 	}
    // })
    /* #endif */
    /* #ifdef APP-PLUS */
    /* #endif */
    // this.midBtnTap();
    // 获取默认配置
    // this.getConfigDefaultApi();
    // #endif
    // #ifdef H5
    // 监听 popstate 事件
    window.addEventListener('popstate', this.handlePopState);
    // #endif

    const updateManager = uni.getUpdateManager();
    // 新版本下载完成时
    updateManager.onUpdateReady(function(res) {
      uni.showModal({
        title: '更新提示',
        content: '新版本已准备就绪，是否立即重启应用？',
        success(res) {
          if (res.confirm) {
            // 调用applyUpdate应用新版本并重启[citation:2][citation:3][citation:4]
            updateManager.applyUpdate();
          }
        }
      });
    });

  },
  onHide: function () {
 // 监听消息推送
  // pushMessage_event()
    console.log("App Hide");
    // #ifdef H5
    // 清除 popstate 事件
    window.removeEventListener('popstate', this.handlePopState);
    // #endif
  },
  methods: {
    // tabBar中间按钮回调
    midBtnTap() {
      uni.onTabBarMidButtonTap(() => {
        // uni.switchTab({
        //   url: "/views/pages/publish/index",
        // });
        uni.navigateTo({
          url: '/views/pages/publish/index',
        });
        console.log("onTabBarMidButtonTap");
      });
    },
    // 获取默认配置
    getConfigDefaultApi() {
      mineApi.getConfigDefaultApi().then((res) => {
        if (res.code == 200) {
          // console.log("onConfigDefaultApi--->", res.data);
          uni.setStorageSync('defaultConfig', res.data);
        }
      }).catch((err) => {});
    },
    getConfigData () {
      getconfigApi()
    },
    handlePopState(e) {
      let isLogin = uni.getStorageSync("isLogin");
      let redirect_urls = ['/views/pages/mine/login', '/views/pages/mine/sign']
      if (isLogin) {
        let flag = redirect_urls.some((v) => e.state.forward.startsWith(v));
        if (flag) {
          uni.redirectTo({
            url: "/views/pages/save-money/views/pages/tabbar/index"
          })
        }
      }
    },
    // url地址参数解析生成对象形式
    parseQuery(url) {
      const query = {};
      if (url) {
        url.split('&').forEach(item => {
          const [key, value] = item.split('=');
          query[key] = decodeURIComponent(value);
        });
      }
      return query;
    }
  },
};
</script>

<style lang="scss">
@import "@/static/css/animate/animate.min.css";
// @import "./uni_modules/uview-plus/inssssdex.scss";
@import "./views/styles/common.scss";
@import "./views/styles/animation.css";
@import "@/static/css/base.css";
@import "@/static/css/iconfont.css";
@import "@/static/css/style.scss";
/*每个页面公共css */
/*
		*公共样式
		*/
/* #ifndef APP-NVUE */
page {
  font-family: -apple-system-font, "PingFang SC", "Arial", "Helvetica Neue",
    "Microsoft Yahei", sans-serif;
  font-size: 28rpx;
  font-weight: 400;
  color: #333;
  /* #ifdef H5 */
  // width: 375px;
  /* #endif */
}

:deep( .uni-popup) {
   z-index: 999 !important;
}
view,
button,
input,
text,
textarea {
  box-sizing: border-box;
}

button::after {
  border: 0;
  margin: 0;
}

.default-btn,
.primary-btn {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0;
  background: none;
  /* #ifdef MP-WEIXIN */
  background: transparent;
  /* #endif */
}

/* #endif */
/* #ifdef APP-NVUE */
.default-btn,
.primary-btn {
  border-width: 0;
  border-radius: 0;
}

/* #endif */
.primary-btn,
.primary-btn:active {
  /* #ifdef APP-NVUE */
  background-image: linear-gradient(to bottom, #ffec5e, #ffd530);
  /* #endif */
  /* #ifndef APP-NVUE */
  background-image: linear-gradient(180deg, #ffec5e, #ffd530);
  /* #endif */
}

.info-btn,
.primary-btn {
  width: 670rpx;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  color: #333300;
  line-height: 88rpx;
  font-weight: 500;
}

.default-btn:active,
.primary-btn:active {
  opacity: 0.7;
}

.default-btn[disabled],
.primary-btn[disabled] {
  background: #f7f7f7;
}

.info-btn {
  background-color: #f5f5f5;
}

.button-hover {
  opacity: 0.7;
}

.relative {
  position: relative;
}

.bold {
  font-weight: 500;
}

.link {
  text-decoration: underline;
  color: #4ebaff;
}

.flex {
  display: flex;
  flex-direction: row;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  /* #ifndef H5 */
  flex-direction: column;
  /* #endif */
  /* #ifdef H5 */
  flex-direction: column !important;
  /* #endif */
}

.flex-1 {
  /* #ifndef H5 */
  flex: 1;
  /* #endif */
  /* #ifdef H5 */
  flex: 1 !important;
  /* #endif */
  /* #ifndef APP-NVUE */
  min-height: 0;
  min-width: 0;
  /* #endif */
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-ac {
  /* #ifndef H5 */
  align-items: center;
  /* #endif */
  /* #ifdef H5 */
  align-items: center !important;
  /* #endif */
}

.flex-as {
  align-items: flex-start;
}

.flex-ae {
  align-items: flex-end;
}

.flex-dc {
  /* #ifndef H5 */
  flex-direction: column;
  /* #endif */
  /* #ifdef H5 */
  flex-direction: column !important;
  /* #endif */
}

.jc-sb {
  justify-content: space-between;
}

.ai-c {
  align-items: center;
}

.jc-c {
  justify-content: center;
}

.jc-sa {
  justify-content: space-around;
}

.jc-start {
  justify-content: flex-start;
}

.jc-ct {
  justify-content: center;
}

.jc-end {
  justify-content: flex-end;
}

.flex-ac-start {
  align-content: flex-start;
}

.as-start {
  align-self: flex-start;
}

/* #ifdef H5 */
[nvue] {
  .flex {
    display: flex;
    flex-direction: row;
  }

  .flex-row {
    flex-direction: row;
  }
}

/* #endif */

/* #ifndef APP-PLUS */
.line-1 {
  line-height: 1;
}

/* #endif */
/*溢出显示省略号*/
.nowrap {
  text-overflow: ellipsis;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  white-space: nowrap;
  /* #endif */
  /* #ifdef APP-NVUE */
  lines: 1;
  /* #endif */
}

.nowrap-line2 {
  text-overflow: ellipsis;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* #endif */
  /* #ifdef APP-NVUE */
  lines: 2;
  /* #endif */
}

.nowrap-line3 {
  text-overflow: ellipsis;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  /* #endif */
  /* #ifdef APP-NVUE */
  lines: 3;
  /* #endif */
}

.nowrap-line4 {
  text-overflow: ellipsis;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  /* #endif */
  /* #ifdef APP-NVUE */
  lines: 4;
  /* #endif */
}

.border-t {
  border-top: 1rpx solid #ebebeb;
}

.border-b {
  border-bottom: 1rpx solid #ebebeb;
}

.mr-t4 {
  margin-top: 40rpx;
}

.mr-r4 {
  margin-right: 40rpx;
}

.mr-t2 {
  margin-top: 20rpx;
}

.mr-b4 {
  margin-bottom: 40rpx;
}

.mr-r2 {
  margin-right: 20rpx;
}

.mr-b2 {
  margin-bottom: 20rpx;
}

.mr-l4 {
  margin-left: 40rpx;
}

.pt-4 {
  padding-top: 40rpx;
}

/* #ifndef APP-NVUE */
.ipx-b {
  padding-bottom: constant(safe-area-inset-bottom) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
}

.ipx-t {
  padding-top: constant(safe-area-inset-top) !important;
  padding-top: env(safe-area-inset-top) !important;
}

/* #endif */

.mask{
  position:fixed;
  top: 0;
  left:0;
  right:0;
  bottom:0;
  background-color:#000;
  opacity:.5;z-index:30
}
.mall-mask{
  position:fixed;
  top: 0;
  left:0;
  right:0;
  bottom:0;
  background-color:#000;
  opacity:.5;z-index:30
}

.color-red {
  color: #ff4141;
}

.color-yellow {
  color: #ffc500;
}

.color-blue {
  color: #4ebaff;
}

.color-grey {
  color: #cccccc;
}

.ts-24 {
  font-size: 24rpx;
  line-height: 40rpx;
}
.ts-32 {
  font-size: 24rpx;
}

.tc-111111 {
  color: #111111;
}
.tc-777777 {
  color: #777777;
}

.df-c {
    display: flex;
    flex-direction: column;
}
.df-r {
    display: flex !important;
    flex-direction: row !important;
}

// 放大动画
@keyframes scaleAnimation {
  0%, 100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  20% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.1);
  }
}
</style>
