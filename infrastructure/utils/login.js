import { middle_login } from "@/business/api/modules/user";
import store from '@/business/store/modules/mall';
import { homeApi } from "@/business/api/index";

export const login_mall = async ( middle_token) => {
  const Store = store()
  return new Promise(async (reslove, reject) => {
    try {
      const { data } = await middle_login({ middle_token });
      Store.LOGIN({ token: data.token, time: data.exp });
      Store.SETUID(data.user.uid);
      Store.UPDATE_USERINFO(data.user);
      uni.setStorageSync("USER_CODE",data.user.user_code)
      reslove()
    } catch (err) {
      console.log(err, "err");
      reject(err)
    }
  })
};
// 获取middle_token
export async function getMiddleToken() {
  const middle_token = uni.getStorageSync('middle_token');
  const res = await homeApi.checkMiddleToken({ 'middle_token': middle_token });
  const middleToken = res.data.middle_token;
  return [res.code, middleToken];
}

function toPage(url,jumpMethod) {
  if (jumpMethod) {
    uni[jumpMethod] && uni[jumpMethod]({ url })
    return;
   }
   if (url != '/packages/kkyz/views/pages/mall-home/index') {
     uni.navigateTo({
        url
    });
   } else {
    uni.switchTab({ url })
   }
}

// 打开商城
export async function toMall (url='/packages/kkyz/views/pages/mall-home/index', jumpMethod) {
  const is_login = uni.getStorageSync('isLogin');
  const mall_login = uni.getStorageSync('LOGIN_STATUS_TOKEN');
   if (!(is_login && mall_login)) {
    const [code, middleToken] = await getMiddleToken();
    uni.setStorageSync('middle_token', middleToken);
    console.log(middleToken,'middle_token')
    await login_mall(middleToken)
   }
   // 指定跳转方式
   toPage(url,jumpMethod)
}  

// 登录商城
export async function loginMall () {
  console.log('商城登录');
  const [code, middleToken] = await getMiddleToken();
   uni.setStorageSync('middle_token', middleToken);
   console.log(middleToken,'middle_token')
   await login_mall(middleToken)
}  



