
import request from "/infrastructure/request/interceptor.js";
export default {
  // 获取探索用户列表
  getExploreUsers(num: number) {
    return request.get(`explore/users?num=${num}`);
  },
  // 获取探索接入应用列表
  getConfigList() {
    return request.get(`explore/config`);
  },
};
