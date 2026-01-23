
import request from "/infrastructure/request/interceptor.js";
export default {
  // 获取资讯分类
  postCategoryApi() {
    return request.get(`teach/post/category`);
  },
   // 获取资讯列表
   postlistApi(data:any) {
    return request.get(`teach/post/list`,data);
  },
   // 点赞
   postlikeApi(data:any) {
      return request.post(`teach/post/like`,data);
   },
   // 点赞
   postDetailApi(data:any) {
    return request.get(`teach/post/detail`,data);
   },
  // 点赞
  videoDetailRandomApi(data:any) {
      return request.get(`teach/post/videoDetailRandom`,data);
  },
};
