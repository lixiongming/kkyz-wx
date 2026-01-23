import { ref } from "vue";
import { messageApi } from "@/business/api/index";

export function useMessage() {
  const getUnreadNum = () => {
    const isLogin = uni.getStorageSync("isLogin");
    if (!isLogin) return
    messageApi.unread_num().then((result) => {
      if (result && result.code === 200) {
        if (result.data.unread_num > 0) {
          uni.setTabBarBadge({
            index: 2,
            text: result.data.unread_num,
          });
        } else {
          // 移除tabbar消息数角标
          uni.removeTabBarBadge({
            index: 2,
          });
        }
      }
    });
  };

  const startUnreadNumLoop = () => {
    // 开始轮询
    uni.$timer = setInterval(() => {
      getUnreadNum();
    }, 5000);
  };
  const stopUnreadNumLoop = () => {
    // 移除
    uni.$timer && clearInterval(uni.$timer)
  };

  return { getUnreadNum, startUnreadNumLoop, stopUnreadNumLoop };
}
