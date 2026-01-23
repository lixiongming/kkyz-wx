import CONSTANTS from "./constant-data";

export const myShowToast=(title='',icon='success',duration=2000)=>{
    uni.showToast({
        icon,
        title,
        duration
    });
}

// 跳转H5-browser/H5-webview
export async function toH5(url, type) {
  if (type == CONSTANTS.outer_chains[0].value) {
    uni.navigateTo({ url: `/views/pages/home/webView?url=${url}` });
  } else {
    // APP打开默认浏览器
    // #ifdef APP-PLUS
    plus.runtime.openURL(url, function (err) {
      uni.showToast({
        title: JSON.stringify(err),
        duration: 8000,
      });
    });
    // #endif
  }
}

function showAuthModal () {
  uni.showModal({
    title: '提示',
    content: '您拒绝了位置授权，无法获取位置信息。是否前往设置页面开启权限？',
    confirmText: '去设置',
    showCancel: true,
    success: (res) => {
      if (res.confirm) {
        // 用户点击“去设置”，跳转到小程序的设置页面
        uni.openSetting({
          success(res) {
            if (res.authSetting['scope.userLocation']) {
              uni.showToast({
                title: '授权成功！',
                icon: 'success'
              });
              // 用户已经开启了授权，再次尝试获取位置
              // getLocation_()
            }
          }
        });
      }
    }
  });
}

// 获取位置经纬度
export function getLocationXY(successCb, errorCb) {
  let location_xy = {};
  // if (location_xy) return successCb(location_xy);
  uni.getLocation({
    type: "gcj02",
    geocode: true,
    success: (res: any) => {
      location_xy = {
        longitude: res.longitude,
        latitude: res.latitude,
        address: res.address,
      };
      // uni.showToast({
      //   icon: "none",
      //   title: "定位成功",
      // });
      // uni.setStorageSync('locationXY', location_xy)
      successCb(location_xy);
    },
    fail: (err: any) => {
      if (err.errMsg.includes('auth deny')) {
          // 用户拒绝授权，显示提示模态框
          showAuthModal();
      } else {
          // 处理其他类型的错误，例如位置服务未开启
          uni.showToast({
              title: '获取位置失败，请检查手机定位是否开启',
              icon: 'none'
          });
      }
      errorCb && errorCb(err);
    },
  });
}


// 判断数量是否超过1w
export const isNumber = (num: any, isAdd: string) => {
	let myNum = num.toString()
	let t = myNum.slice(-1)
	if (t == 'w' || t == '+') {

	} else {
		myNum = Number(myNum)
		isAdd == '+' ? myNum += 1 : myNum -= 1

	}
	return myNum.toString()
}
/**
 * 数字格式化(超过一万用w)
 * @param num 输入的数字
 * @returns 
 */
export function formatToChineseTrillion(num) {
  let str_num = parseFloat(num);
  if (str_num < 10000) return num;
  const units = ['w'];
  if (str_num > 10000) {
    str_num = parseInt(str_num / 10000 * 100) / 100  + units[0];
  } 
  return str_num;
}
  

	// 获取vip图片
export	const getVipImg=(level:number)=>{
  let vip
  switch(level){
    case 3:
      vip = "/images/save-money/vip1.png";
      break;
    case 2:
      vip = "/images/save-money/vip3.png";
    break;
    case 1:
      vip = "/images/save-money/vip2.png";
    break;
    default:
      break;
  }
  return vip
}

/**
 * 数字格式化(中文万亿)
 * @param num 输入的数字
 * @returns 
 */
export function formatNumberToChineseTrillion(num) {
  let str_num = parseFloat(num);
  if (str_num < 10000) return num;
  const units = ['万', '亿'];
  if (str_num > 10000 && str_num < 100000000) {
    str_num = parseInt(str_num / 10000 * 100) / 100  + units[0];
    return str_num;
  } else {
    str_num = parseInt(str_num / 100000000 * 100) / 100  + units[1];
  }
  return str_num;
}