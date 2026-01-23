import request from "/infrastructure/request/require.js";

export default {
  // 淘宝 - 获取商品列表
  getGoodsListApi(data: any) {
    return request.post(`taobao/get_goods_list`,data);
  },
  // 淘宝 - 将商品链接转换为淘口令
  changePasswordApi(data: any) {
    return request.post(`taobao/change_password`,data);
  },
  // 美团 - 获取优商惠品
  getCouponApi(data:any) {
    return request.post(`meituan/get_coupon`,data);
  },
  // 美团 -获取轮播图商品
  getBannerApi(data:any) {
    return request.post(`meituan/get_banner`,data);
  },
  // 美团 -获取分享链接
  getReferralLinkApi(data:any) {
    return request.post(`meituan/get_referral_link`,data);
  },
  // 美团 -获取广告位商品
  getRecommendApi(data:any) {
    return request.post(`meituan/get_recommend`,data);
  },
};