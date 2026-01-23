import { loginJumpCheck } from "@/infrastructure/utils/common.js";
import { mineApi, homeApi } from "@/business/api/index.ts";
import {uploadDingDing} from '@/infrastructure/utils/util.ts'
import code_arr from "./code";
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
  uni.removeStorageSync("middle_token_");
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

// 是否是消息模块状态码
 function isMessageModuleCode(code) {
  return [301001, 301002, 301003, 301004, 301005].includes(code);
}

function objectToQueryString(obj) {
  return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
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
  let curRoute_options = objectToQueryString(routes[routes.length - 1]?.options);
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
            console.log(curRoute)
            uni.redirectTo({
              url: curRoute_options ? "/views/pages/mine/login?path=" + `${encodeURIComponent(curRoute + '?' + curRoute_options)}` : "/views/pages/mine/login?path=" + curRoute
            });
          }, 2000);
        }
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
          uni.redirectTo({
            url: curRoute_options ? "/views/pages/mine/login?path=" + `${encodeURIComponent(curRoute + '?' + curRoute_options)}` : "/views/pages/mine/login?path=" + curRoute
          });
        }, 2000);
      }
      reject(data.message);
      break;
    default: //抛出异常
      // 单独处理其他状态码
      if (data.code === 1000) {
        reject(data);
      } else if (isMessageModuleCode(data.code)) {
        // 消息状态码处理
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

function baseRequest(url, method, data, opt) {
  let Url = uni.$config.baseURL,
    header = {};
  if (uni.getStorageSync("token"))
    header.Authorization = "Bearer " + uni.getStorageSync("token");
  if (opt.isMall) {
    Url = uni.$config.mddUrl + '/'
  }
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
        checkResponseBody(res, resolve, reject);
        // 错误上传钉钉机器人
        if(res.statusCode != 200 || !code_arr.includes(res.data.code)){
          console.log(res)
          uploadDingDing(2,res.data.message,data,url)
        }
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

export const baseUrl = "";
export const imgUrl = "";
export default request;
