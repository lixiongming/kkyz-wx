import { ref, onMounted } from "vue";
import config_ from "@/infrastructure/config/app.js";
import store_ from "@/business/store/modules/mall.ts";
import mainStore from "@/business/store/index.ts";

export function useChat() {
  const SocketTask = ref(null);
  const timer = ref(null);
  // #ifdef H5
  const wss = (wsSocketUrl) => {
    let ishttps = document.location.protocol == "https:";
    if (ishttps) {
      return wsSocketUrl.replace("ws:", "wss:");
    } else {
      return wsSocketUrl.replace("wss:", "ws:");
    }
  };
  // #endif

  const Socket = () => {
    const Store = store_();
    const main_store = mainStore()
    let wsUrl = `${config_.VUE_APP_WS_URL}&token=${main_store.middle_token}`;
    SocketTask.value = uni.connectSocket({
      // #ifdef H5
      url: wss(wsUrl),
      // #endif
      // #ifdef MP || APP-PLUS
      url: wsUrl,
      // #endif
      header: {
        "content-type": "application/json",
      },
      method: "GET",
      protocols: [],
      success: (res) => {
        console.log(res, "success");
      }
    });
    
    SocketTask.value.onOpen(() => {
        timer.value = setInterval(function() {
			SocketTask.value.send({
				data: JSON.stringify({
					type: "ping"
				})
			});
		}, 10000);
    });
    
    SocketTask.value.onError((e) => {
      console.log('------------>>>wsUrl',wsUrl);
      uni.$emit("socket_error", e);
    });
    SocketTask.value.onMessage((res) => {
      const { type, data = {} } = JSON.parse(res.data);
      uni.$emit(type, data);
    });
    SocketTask.value.onClose(() => {
      // uni.closeSocket();
      SocketTask.value.close();
      clearInterval(timer.value);
      uni.$emit("socket_close");
    });
    return SocketTask.value;
  };

  return { Socket };
}
