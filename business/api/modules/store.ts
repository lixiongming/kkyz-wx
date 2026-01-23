// import request from "/infrastructure/request/mall-interceptor.js";
import request from "/infrastructure/request/interceptor.js";

/**
 * 获取产品详情
 * @param int id
 *
 */
export function getProductDetail(id) {
  return request.get(
    "mall/product/detail/" + id,
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 获取产品详情参数
 * @param int id
 *
 */
export function getProductParmas(id,data = {}) {
  return request.get(
    "mall/product/show/" + id,
    data,
    {
      noAuth: true,
    }
  );
}
/**
 * 获取预览商品详情
 * @param int id
 *
 */
export function getPreviewProDetail(data) {
  return request.get("store/product/preview", data, {
    noAuth: true,
  });
}
/**
 * 产品分享二维码 推广员
 * @param int id
 */
export function getProductCode(id, data) {
  return request.post("mall/product/qrcode/" + id, data);
}
/**
 * 添加收藏
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
 */
export function collectAdd(data) {
  return request.post("user/relation/create", data);
}
/**
 * 删除收藏产品
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
 */
export function collectDel(data) {
  return request.post("user/relation/delete", data);
}
/**
 * 购物车添加
 *
 */
export function postCartAdd(data) {
  return request.post("mall/cart/create", data);
}
/**
 * 获取分类列表
 *
 */
export function getCategoryList() {
  return request.get(
    "store/product/category/lst",
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 获取产品列表
 * @param object data
 */
export function getProductslist(data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/lst", data, {
    noAuth: true,
  });
}
/**
 * 获取爆品专区列表
 * @param object data
 */
export function getExplosivelist(data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/explosive/zone", data, {
    noAuth: true,
  });
}
/**
 * 获取优选专区列表
 * @param object data
 */
export function getPrioritylist(data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/priority/zone", data, {
    noAuth: true,
  });
}
/**
 * 获取兑换专区列表
 * @param object data
 */
export function getExchangelist(data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/exchange/zone", data, {
    noAuth: true,
  });
}
/**
 * 获取优惠券商品列表
 * @param object data
 */
export function getCouponProductlist(data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/coupon_product", data, {
    noAuth: true,
  });
}
/**
 * 获取品牌列表
 * @param object data
 */
export function getBrandlist(data) {
  return request.get("store/product/brand/lst", data, {
    noAuth: true,
  });
}
/**
 * 获取推荐产品
 *
 */
export function getProductHot(page, limit) {
  return request.get(
    "product/spu/recommend",
    {
      page: page === undefined ? 1 : page,
      limit: limit === undefined ? 10 : limit,
    },
    {
      noAuth: true,
    }
  );
}
/**
 * 获取商户推荐产品
 *
 */
export function getMerProductHot(id, data) {
  return request.get(
    `product/spu/recommend`,
    {
      page: data.page === undefined ? 1 : data.page,
      limit: data.limit === undefined ? 10 : data.limit,
      mer_id: id || "",
    },
    {
      noAuth: true,
    }
  );
}
/**
 * 批量收藏
 *
 * @param object id
 * @param string category
 */
export function collectAll(data) {
  return request.post("mall/user/relation/batch/create", data);
}
/**
 * 首页产品的轮播图和产品信息
 * @param int type
 *
 */
export function getGroomList(type, data) {
  return request.get("product/spu/hot/" + type, data, {
    noAuth: true,
  });
}
/**
 * 获取商品收藏列表
 * @param object data
 */
export function getCollectUserList(data) {
  return request.get("user/relation/product/lst", data);
}
/**
 * 获取商品收藏列表 -- 删除
 * @param object data
 */
export function userCollectDel(data) {
  return request.post("user/relation/batch/delete", data);
}
/**
 * 获取产品评论
 * @param int id
 * @param object data
 *
 */
export function getReplyList(id, data) {
  return request.get("mall/product/replyList/" + id, data, {
    noAuth: true,
  });
}
/**
 * 产品评价数量和好评度
 * @param int id
 */
export function getReplyConfig(id) {
  return request.get("reply/config/" + id);
}
/**
 * 获取搜索关键字获取
 *
 */
export function getSearchKeyword() {
  return request.get(
    "mall/common/hotKeyword",
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 门店列表
 * @returns {*}
 */
export function storeListApi(data) {
  return request.get("store_list", data, {
    noAuth: true,
  });
}
/**
 * 商户列表
 * @returns {*}
 */
export function storeMerchantList(data) {
  return request.get("store/merchant/lst", data, {
    noAuth: true,
  });
}
/**
 * 获取商铺详情
 * @param {Object} id 商铺id
 * @param {Object} data 商铺数据
 */
export function getStoreDetail(id, data) {
  return request.get("store/merchant/detail/" + id, data, {
    noAuth: true,
  });
}
/**
 * 获取商铺商品列表
 * @param {Object} id 商铺 id
 * @param {Object} data 商铺商品列表数据
 */
export function getStoreGoods(id, data) {
  return request.get("product/spu/merchant/" + id, data, {
    noAuth: true,
  });
}
/**
 * 获取商铺商品列表
 * @param {Object} id 商铺 id
 * @param {Object} data 商铺商品列表数据
 */
export function getLocalGoods(id, data) {
  return request.get("product/spu/local/merchant/" + id, data, {
    noAuth: true,
  });
}
/**
 * 获取商铺分类列表
 * @param {Object} id 商铺 id
 * @param {Object} data
 */
export function getStoreCategory(id, data) {
  return request.get("store/merchant/category/lst/" + id, data, {
    noAuth: true,
  });
}
/**
 * 关注商铺
 * @param {Object} type_id 商铺 id
 */
export function followStore(type_id) {
  return request.post("user/relation/create", {
    type: 10,
    type_id: type_id,
  });
}
/**
 * 取消商铺关注
 * @param {Object} type_id 商铺 id
 */
export function unfollowStore(type_id) {
  return request.post("user/relation/delete", {
    type: 10,
    type_id: type_id,
  });
}
/**
 * 获取商铺优惠券
 * @param {Object} id
 */
export function getStoreCoupon(id) {
  return request.get("coupon/store/" + id, {
    noAuth: true,
  });
}
/**
 * 获取商铺优惠券
 */
export function getMerchantLst(data) {
  return request.get("user/relation/merchant/lst", data, {
    noAuth: true,
  });
}
/**
 * 物流信息
 */
export function express(id) {
  return request.post("ordero/express/" + id, {
    noAuth: true,
  });
}
/**
 * 子集分类
 * @returns {*}
 */
export function storeCategory(pid) {
  return request.get("store/product/category", pid, {
    noAuth: true,
  });
}
/**
 * 分销说明
 * @returns {*}
 */
export function bagExplain() {
  return request.get("store/product/bag/explain");
}
/**
 * 分销礼包推荐列表
 * @returns {*}
 */
export function bagRecommend() {
  return request.get("product/spu/bag/recommend");
}
/**
 * 分销礼包列表
 * @returns {*}
 */
export function productBag(data) {
  return request.get("product/spu/bag", data, {
    noAuth: true,
  });
}
/**
 * 商铺二维码
 * @returns {*}
 */
export function merchantQrcode(id, data) {
  return request.get("store/merchant/qrcode/" + id, data, {
    noAuth: true,
  });
}
/**
 * 推荐商品
 * @returns {*}
 */
export function merchantProduct(id, data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/merchant/" + id, data, {
    noAuth: true,
  });
}
/**
 * 推荐商品(单个或多个商户的商品)
 * @returns {*}
 */
export function moreMerchantProduct(data) {
  if (data.brand_id && Array.isArray(data.brand_id)) {
    data = {
      ...data,
    };
    data.brand_id = data.brand_id.toString();
  }
  return request.get("product/spu/multi/merchant", data, {
    noAuth: true,
  });
}
/**
 * 推荐商品banner
 * @returns {*}
 */
export function getHotBanner(type) {
  return request.get(
    "common/hot_banner/" + type,
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 商户入驻表单
 * @returns {*}
 */
export function create(data) {
  return request.post("intention/create", data);
}
/**
 * 商户入驻表单(v2)
 * @returns {*}
 */
export function createV2Api(data) {
  return request.post("h5/merchant/applySubmit", data);
}
/**
 * 商户入驻短信验证码
 * @returns {*}
 */
export function verify(data) {
  return request.post("auth/verify", data);
}
/**
 * 获取秒杀商品详情
 * @param int id
 *
 */
export function getSeckillProductDetail(id) {
  return request.get(
    "store/product/seckill/detail/" + id,
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 获取秒杀商品详情参数
 * @param int id
 *
 */
// export function getSeckillProductParmas(id) {
// 	return request.get('store/product/seckill/show/' + id, {}, {
// 		noAuth: true
// 	});
// }
/**
 * 直播推荐列表
 * @returns {*}
 */
export function getLiveList(data) {
  return request.get(`broadcast/hot`, data, {
    noAuth: true,
  });
}
/**
 * 直播列表
 * @returns {*}
 */
export function getBroadcastListApi(data) {
  return request.get("broadcast/lst", data, {
    noAuth: true,
  });
}
/**
 * 商户分类
 * @returns {*}
 */
export function merClassifly() {
  return request.get(
    "intention/cate",
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 获取预售商品详情
 * @param int id
 *
 */
export function getPresellProductDetail(id) {
  return request.get(
    "store/product/presell/detail/" + id,
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 获取商户申请记录
 * @param int id
 *
 */
export function getApplicationRecordList(data) {
  return request.get("intention/lst", data);
}
/**
 * 获取商户申请详情
 * @param int id
 *
 */
export function getGoodsDetails(id) {
  return request.get("intention/detail/" + id, {});
}

/**
 * 修改入驻信息
 * @param int id
 *
 */
export function updateGoodsRecord(id, data) {
  return request.post("intention/update/" + id, data);
}
/**
 * 修改入驻信息(v2)
 * @param int id
 *
 */
export function updateGoodsRecordV2Api(data) {
  return request.post("h5/merchant/applyUpdate", data);
}
/**
 * 获取定位详细地址
 * @param int id
 *
 */
export function getGeocoder(data) {
  return request.get(
    `lbs/geocoder?location=${data.lat},${data.long}`,
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 小程序商城 - 获取定位详细地址
 * @param int id
 *
 */
export function getGeocoderApi(data) {
  return request.post(
    `mall/address/lbsGeocoder`,
    data,
    {
      noAuth: true,
    }
  );
}
/**
 * 获取店铺类型
 * @param int id
 *
 */
export function getStoreTypeApi() {
  return request.get(
    "intention/type",
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * 到货通知
 *
 */
export function arrivalNoticeApi(data) {
  return request.post("mall/product/setIncreaseTake", data);
}

/*
  获取图片验证码
*/
export function getCaptcha() {
  return request.get("captcha");
}

/*
	获取店铺资质
*/
export function storeCertificate(data) {
  return request.post(`store/certificate/${data.merId}`, data);
}
/**
 * 本地服务列表
 * @returns {*}
 */
export function storeServiceList(id, data) {
  return request.get(`product/spu/local/${id}`, data, {
    noAuth: true,
  });
}
/**
 * 复制口令
 * @returns {*}
 */
export function copyPasswordApi(data) {
  return request.get(`product/spu/copy`, data, {
    noAuth: true,
  });
}
/**
 * 口令搜索
 * @returns {*}
 */
export function copyPasswordSearch(data) {
  return request.get(`command/copy`, data, {
    noAuth: true,
  });
}
/**
 * 套餐列表
 * @returns {*}
 */
export function getDiscountsLst(data) {
  return request.get(`mall/discounts/lst`, data, {
    noAuth: true,
  });
}
/**
 * 套餐--立即购买
 * @returns {*}
 */
export function discountsCartAdd(data) {
  return request.post("user/cart/batchCreate", data);
}
/**
 * 商品--价格说明
 * @returns {*}
 */
export function priceRuleApi(id) {
  return request.get(
    `mall/product/priceRule/${id}`,
    {},
    {
      noAuth: true,
    }
  );
}
/**
 * @description :  获取商户信息
 * @createTime : 2024-01-31 10:56:42
 */
export function getMerchantInfo(data) {
  return request.post("h5/merchant/get_merchant_info", data);
}
/**
 * @description :  商户开通线下收款码校验
 * @createTime : 2025-07-29
 */
export function openOfflineVerify(data) {
  return request.post("h5/merchant/open_offline_verify", data);
}
/**
 * @description :  商户开通线下收款码校验
 * @createTime : 2025-07-29
 */
export function huijuCreateOrder(data) {
  return request.post("h5/merchant/huijuCreateOrder", data);
}
/**
 * @description :  获取店铺信息
 * @createTime : 2024-01-31 10:56:42
 */
export function getShopInfo(data) {
  return request.post("h5/merchant/get_shop_info", data);
}
/**
 * @description :  开关店铺
 * @createTime : 2024-01-31 10:56:42
 */
export function switchShop(data) {
  return request.post("h5/merchant/switch_shop", data);
}
/**
 * @description :  设置店铺信息
 * @createTime : 2024-01-31 10:56:42
 */
export function setShopInfo(data) {
  return request.post("h5/merchant/set_shop_info", data);
}

/*
	可否开始使用商户
*/
export function merchantIsBegin(data) {
  return request.post(`h5/merchant/is_begin`, data);
}

/**
 * @description :  获取三方登录token
 * @createTime : 2024-01-31 10:56:42
 */
export function get_middle_token() {
  return request.post("user/get_middle_token");
}

/**
 * @description :  获取银行卡列表
 * @createTime : 2024-01-31 10:56:42
 */
export function getBankList(data) {
  return request.post("h5/merchant/get_bank_list", data);
}

/**
 * @description :  获取地址列表
 * @createTime : 2024-01-31 10:56:42
 */
export function getAddress() {
  return request.post("h5/merchant/get_address");
}

/**
 * @description :  获取新地址列表
 * @createTime : 2025-06-25 17:56:42
 */
export function getAddressNewApi() {
  return request.get("h5/merchant/getAddressNew");
}

/**
 * @description :  申请分账信息（新）
 * @createTime : 2025-06-26 10:56:42
 */
export function openAnAccountNewApi(data) {
  return request.post("h5/merchant/openAnAccountNew", data);
}

/**
 * @description :  提交开户资料
 * @createTime : 2024-01-31 10:56:42
 */
export function openAccount(data) {
  return request.post("h5/merchant/open_an_account", data);
}

/**
 * @description :  获取开户资料
 * @createTime : 2024-01-31 10:56:42
 */
export function getOpenAaccount(data) {
  return request.post("h5/merchant/get_open_an_account", data);
}

/**
 * @description :  获取营业执照信息
 * @createTime : 2024-01-31 10:56:42
 */
export function getBusinessLicenseInfo(data) {
  return request.post("h5/merchant/getBusinessLicenseInfo", data);
}

/**
 * @description :  获取身份证信息
 * @createTime : 2024-01-31 10:56:42
 */
export function getIdentityCardInfo(data) {
  return request.post("h5/merchant/getIdentityCardInfo", data);
}

/**
 * @description :  获取用户自动入队设置详情
 */
export function getExplosiveAutoTeam(data) {
  return request.get("explosive/autoTeam/detail", data);
}

/**
 * @description :  设置自动入队
 */
export function autoTeamSetup(data) {
  return request.post("explosive/autoTeam/setup", data);
}

/**
 * @description :  开启或结束自动入队设置
 */
export function autoTeamUpdateStatus(data) {
  return request.post("explosive/autoTeam/updateStatus", data);
}
/**
 * @description :  驿站商品列表
 * @createTime :
 */
export function getWelfareProductList(data) {
  return request.get("product/getWelfareProductList", data);
}
/**
 * @description :  获取行业类别
 */
export function getIndustryCategoryApi(data) {
  return request.get("h5/merchant/getIndustryCategory", data);
}
/**
 * @description :  分账信息管理 - 获取进件记录
 */
export function getApplicationSubmissionRecordApi(data) {
  return request.get("h5/merchant/getApplicationSubmissionRecord", data);
}
/**
 * @description :  分账信息管理 - 申请（重申）汇聚进件
 */
export function applyForHuijuApi(data) {
  return request.post("h5/merchant/applyForHuiju", data);
}
/**
 * @description :  商户管理信息管理 - 获取手续费比例
 */
export function getRoutingRatio() {
  return request.get("getRoutingRatio");
}
/**
 * @description :  店铺详情
 */
export function getMerchantDetail(data:any) {
  return request.get("mall/minimer/detail",data);
}
/**
 * @description :  店铺二维码
 */
export function getMerchantQrcode(data:any) {
  return request.get("mall/minimer/qrcode",data);
}
/**
 * @description :  获取查看店铺资质图片验证
 */
export function getMerchantCaptcha() {
  return request.get("mall/minimer/captcha");
}
/**
 * @description :  获取店铺资质信息
 */
export function getMerchantMerCertificate(data:any) {
  return request.post("mall/minimer/merCertificate",data);
}