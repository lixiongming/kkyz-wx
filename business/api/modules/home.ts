
import request from "/infrastructure/request/interceptor.js";
export default {
  // ------------------------------------------------------小程序 看看宇宙-商城-首页 开始
  // 获取首页DIY
  getMallCommonDiy(data: any) {
    return request.get("mall/common/diy", data);
  },
  // 首页商品列表
  getMallSpuLst(data: any) {
    return request.get("mall/spu/lst", data);
  },
  // 添加收藏
  collectAdd(data: any) {
    return request.post("mall/user/relation/create", data);
  },
  // 删除收藏产品
  collectDel(data: any) {
    return request.post("mall/user/relation/cancelProduct", data);
  },
  // ------------------------------------------------------小程序 看看宇宙-商城-首页 结束
  // 根据条件获取app更新信息
  upgrade_lastInfo(data: any) {
    return request.get(`upgrade/lastInfo`,data);
  },	
  // 获取app更新信息列表
  upgrade_list(data: any) {
    return request.get(`upgrade/list`,data);
  },	
  // 获取视频列表
  home_video(num: number) {
    return request.get(`home/video`, { num });
  },
  // 检查middle_token
  checkMiddleToken(data: any) {
    return request.post(`middle/check_middle_token`, data);
  },
  // 点赞
  likeApi(data: any) {
    return request.post(`post/like`, data);
  },
  // 收藏
  favoriteApi(data: any) {
    return request.post(`post/favorite`, data);
  },
  // 分享
  shareVideoApi(data: any) {
    return request.post(`post/share`, data);
  },
  // 分享教学
  shareTeachVideoApi(data: any) {
    return request.post(`teach/post/share`, data);
  },
  // 评论列表
  commentListApi(data: any) {
    return request.get(`home/commentList`, data);
  },
  // 评论
  commentApi(data: any) {
    return request.post(`post/comment`, data);
  },
  // 评论回复列表
  levelCommentApi(data: any) {
    return request.get(`post/levelComment`, data);
  },
  // 点赞评论
  likeCommentApi(data: any) {
    return request.post(`post/likeComment`, data);
  },
  // 踩评论
  treadCommentApi(data: any) {
    return request.post(`post/treadComment`, data);
  },
  // 我的关注
  myAttentionAPi(data: any) {
    return request.get(`user/myAttention`, data);
  },
  // 我的粉丝
  myFansAPI(data: any) {
    return request.get(`user/myFans`, data);
  },
  // 关注他人或者取消关注接口
  attentionAPI(data: any) {
    return request.post(`user/attention`, data);
  },
  // 获取资讯列表
  postList(data: any) {
    return request.get(`home/postList`, data);
  },
  // 获取资讯详情
  postDetail(data: any) {
    return request.get(`home/postDetail`, data);
  },
  // 是否关注他人
  attentionStatus(data: any) {
    return request.get(`user/attentionStatus`, data);
  },
  // 是否关注他人
  area_listApi(data: any) {
    return request.get(`area/list`, data);
  },
  // 获取赞和收藏明细记录
  likeFavoriteListApi(data: any) {
    return request.get(`post/likeFavoriteList`, data);
  },
  // 获取赞和收藏明细记录
  statisticsDataAPi(data: any) {
    return request.get(`post/statisticsData`, data);
  },
  // 获取赞和收藏明细记录
  deleteAPi(data: any) {
    return request.delete(`post/delete`, data);
  },
  // 置顶资讯
  topAPi(data: any) {
    return request.post(`post/top`, data);
  },
  // 获取资讯总数
  totalPostNums(data: any) {
    return request.get(`home/totalPostNums`, data);
  },
  // 分享
  shareApi(data: any) {
    return request.get(`post/share`, data);
  },
  // 随机视频列表
  videoDetailRandomApi(data: any) {
    return request.get(`home/videoDetailRandom`, data);
  }, 
// 搜索接口
searchApi(data: any) {
  return request.get(`home/search`, data);
},
// 搜索历史记录
searchRecordApi(data: any) {
  return request.get(`home/searchRecord`, data);
},
// 清除搜索历史记录
clearSearchRecordApi(data: any) {
  return request.delete(`home/clearSearchRecord`, data);
},
// 个人Ta人视频详情视频分页列表
personalPageVideoApi(data: any) {
  return request.get(`home/personalPageVideo`, data);
},
// 获取数据字典
dictDataApi(data: any) {
  return request.get(`home/dictData`, data);
},
// 获取是否弹窗系统公告
getSystemNoticeApi(page_tag: any) {
  return request.get(`notification/prompt?page_tag=${page_tag}`);
},
// 店铺视频列表
getMinimerVideosApi(data:any) {
  return request.get(`mall/minimer/videos`,data);
},
// 店铺新增关注
RelationCreateApi(data:any) {
  return request.post(`mall/user/relation/create`,data);
},
// 店铺取消关注
RelationCancelApi(data:any) {
  return request.post(`mall/user/relation/cancel`);
},
// 店铺信息
geiMinimerApi(data:any) {
  return request.get(`mall/minimer/info`,data);
},
// 店铺推荐商品
geiMinimerProductsApi(data:any) {
  return request.get(`mall/minimer/recommend/products`,data);
},
// 生成小程序分享二维码
productQrcodeApi(data:any) {
  return request.post(`mall/product/qrcode`,data);
},
// 达人店铺主页
sellHomeApi(data:any) {
  return request.get(`mall/minimer/sellHome`,data);
},
// 达人店铺产品列表
sellProductsApi(data:any) {
  return request.get(`mall/minimer/sellProducts`,data);
},
// 获取店铺主带货商品
merSellProductsApi(data:any) {
  return request.get(`mall/minimer/merSellProducts`,data);
},
// 崇高大舞台-获取分类列表
getStageCategoryApi(data:any) {
  return request.get(`stage/post/category`,data);
},
// 崇高大舞台-获取视频列表
getStageListApi(data:any) {
  return request.get(`stage/post/list`,data);
},
// 崇高大舞台-分享
getStageShareApi(data:any) {
  return request.post(`stage/post/share`,data);
},
// 崇高大舞台-观看
getStageViewApi(data:any) {
  return request.post(`stage/post/view`,data);
},
// 崇高大舞台-获取视频详情
getStageDetailApi(data:any) {
  return request.get(`stage/post/detail`,data);
},
// 崇高大舞台-获取视频详情随机视频列表
getStageVideoDetailRandomApi(data:any) {
  return request.get(`stage/post/videoDetailRandom`,data);
},
// 获取地理位置信息
getlbsGeocoder(data:any) {
  return request.get(`common/gd/lbsGeocoder`,data);
},
// 获取省市两级联动数据
getprovinceCityApi() {
  return request.get(`common/area/provinceCity`);
},
};