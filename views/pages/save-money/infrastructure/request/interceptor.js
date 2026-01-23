import { loginJumpCheck } from "@/infrastructure/utils/common.js";
import { mineApi, homeApi } from "@/business/api/index.ts";
import {fileRequest} from "./file_upload";
function toLogin() {
  uni.showToast({
    title: "请登录",
    icon: "none",
    duration: 1000,
  });
}

function base64ToUint8Array(base64String) {
  let padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  let base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  let rawData = atob(base64);
  let outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let is_to_login = true //是否跳转登录页，用于解决多次调用接口导致的反复跳转

function atob(input) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = input.replace(/=+$/, "");
  let output = "";
  if (str.length % 4 === 1) {
    throw new Error("InvalidLengthError");
  }
  for (let i = 0, len = str.length; i < len; i += 4) {
    const a = chars.indexOf(str.charAt(i));
    const b = chars.indexOf(str.charAt(i + 1));
    const c = chars.indexOf(str.charAt(i + 2));
    const d = chars.indexOf(str.charAt(i + 3));
    const sum = (a << 18) | (b << 12) | (c << 6) | d;
    output += String.fromCharCode(
      (sum >> 16) & 0xff,
      (sum >> 8) & 0xff,
      sum & 0xff
    );
  }

  return output;
}

/**
 * 清除登录相关信息
 */
export function clearLoginStorage() {
  uni.removeStorageSync("middle_token");
  uni.removeStorageSync("token");
  uni.removeStorageSync("isLogin");
  uni.removeStorageSync("userInfo");
}
/**
 * 清除登录相关信息(store)
 */
// export function clearLoginStore() {
//   minestore.isLogin = false;
//   minestore.userInfo = {};
//   minestore.myInfo = {};
// }

/**
 * 清除登录相关信息(主函数)
//  */
// export function clearLoginInfo() {
//   clearLoginStorage();
//   // clearLoginStore();
// }

// 是否是特殊状态码
function isSpecialCode(code) {
  return [
    // start 消息模块状态码
    301001, 
    301002, 
    301003, 
    301004, 
    301005,
    // end
    // start 发红包模块状态码
    600101,
    600102,
    // end
  ].includes(code);
}

/**
 * 检查响应报文是否正确，这里可针对指定异常进行统一处理
 * @param {Object} resp 请求响应体对象
 */
function checkResponseBody(resp, resolve, reject) {
  // console.log(resp,'res')
  //根据响应状态处理
  let data = resp.data;
  let routes = getCurrentPages();
  let curRoute = routes[routes.length - 1]?.route;
  switch (data.code) {
    case 200: //请求正常直接返回
      resolve(data);
      break;
    case 401: //未登录，执行登录
      if (uni.getStorageSync("token")) {
        // 该接口用于判断当前token是否有效
        // 1.过期则创建新token，实现登录持久化
        // 2.被其他设备登录挤掉则抛出406，走重新登录
        mineApi.refreshTokenApi().then((res) => {
          uni.setStorageSync("token", res.data.token);
        });
      } else {
        console.log("未登录");
        // 清空登录相关数据
        clearLoginStorage();
        uni.showToast({
          title: "登录已失效，请重新登录",
          icon: "none",
          duration: 2000,
        });

        if (!loginJumpCheck(data.path)) {
          setTimeout(() => {
            // 弹窗登录框
           if(is_to_login){
            is_to_login=false
            uni.navigateTo({
              url: "/views/pages/mine/login?path=" + curRoute,
            });
            setTimeout(() => {
            is_to_login=true
            }, 3000);
           }
          }, 2000);
        }
        // switchTab('/views/pages/mine/login')
        reject(data.message);
      }
      break;
    case 406:
      console.log("未登录");
      // 清空登录相关数据
      clearLoginStorage();
      uni.showToast({
        title: "登录已失效，请重新登录",
        icon: "none",
        duration: 2000,
      });

      if (!loginJumpCheck(data.path)) {
        setTimeout(() => {
          // 弹窗登录框
          if(is_to_login){
            is_to_login=false
            uni.navigateTo({
              url: "/views/pages/mine/login?path=" + curRoute,
            });
            setTimeout(() => {
              is_to_login=true
            }, 3000);
          }
        }, 2000);
      }
      // switchTab('/views/pages/mine/login')
      reject(data.message);
      break;
    default: //抛出异常
      // 单独处理其他状态码
      if (data.code === 1000) {
        reject(data);
      } else if (isSpecialCode(data.code)) {
        // 特殊状态码返回成功的promise处理
        resolve(data);
      } else {
        // 默认处理状态码
        if (data.message) {
          uni.showToast({
            title: data.message,
            icon: "none",
            duration: 2000,
          });
        } else {
          uni.showToast({
            title: "系统繁忙，请稍后重试",
            icon: "none",
            duration: 2000,
          });
        }
        reject(data.message || "系统错误");
      }
      break;
  }
}

/**
 * 发送请求
 */
function baseRequest(url, method, data) {
  let Url = uni.$config.baseURL,
    header = {};

  console.log("Url----->", Url)
  if (arguments[3]) {
    header = arguments[3];
  }

  if (uni.getStorageSync("token"))
    header.Authorization = "Bearer " + uni.getStorageSync("token");
  return new Promise((resolve, reject) => {
    uni.request({
      url: Url + "api/" + url,
      method: method || "GET",
      header: header,
      data: data || {},
      success: (res) => {
        if (res.data && res.data.encode) {
          try {
            res.data.data = JSON.parse(res.data.data);
          } catch (e) {
            res.data.data = res.data.data;
          }
        }
        // console.log(res.data.data,'响应拦截--》',url)

        checkResponseBody(res, resolve, reject);
      },
      fail: (message) => {
        reject("请求失败");
      },
    });
  });
}
const request = {};
["options", "get", "post", "put", "head", "delete", "trace", "connect"].forEach(
  (method) => {
    request[method] = (api, data, opt) =>
      baseRequest(api, method, data, opt || {});
  }
);

// 文件上传(图片\视频)
export function fileUpload(url, file_options) {
  return fileRequest(url, file_options, checkResponseBody);
} 

export const baseUrl = "";

export const imgUrl = "";
export default request;
