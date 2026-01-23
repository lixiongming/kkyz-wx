import {
  getLocationXY,
  getCityAreaCode,
} from "@/views/pages/save-money/infrastructure/utils/utils.ts";
import useHome from "@/views/pages/save-money/store/modules/home.ts";
// 获取当前位置信息
export function useLocation(cb) {
  const home_store = useHome();
  getLocationXY(
    async (res) => {
      let address_info = getCityAreaCode(
        res.address.city,
        res.address.district
      );
      let params = {
        ...address_info,
        location: res.longitude + "," + res.latitude,
      };
      home_store.address_info = params;
      cb && cb()
    },
    (err) => {
      console.error("获取位置失败:", err);
    }
  );
}
