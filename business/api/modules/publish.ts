
import request from "/infrastructure/request/interceptor.js";
export default {
  // 发随记
  sendNotes(data: any) {
    return request.post(`post/submitNews`, data);
  },
  // 发文章
  sendArticle(data: any) {
      return request.post(`post/submitArticle`, data);
  },
  // 发视频
  sendVideo(data: any) {
      return request.post(`post/submitVideo`, data);
  },
  // 获取随记/文章/视频信息
  getPubInfo(id: Number) {
      return request.get(`post/detail?id=` + id);
  },
  // 编辑随记/文章/视频信息
  updatePubInfo(data: any) {
      return request.post(`post/edit`, data);
  },

  

};
