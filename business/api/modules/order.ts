import request from "/infrastructure/request/interceptor.js";

/**
 * 获取购物车列表
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
export function getCartCounts() {
  return request.get("user/cart/count");
}
/**
 * 获取购物车列表
 *
 */
export function getCartList() {
  return request.get("user/cart/lst");
}

/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(cartId, data) {
  return request.post("user/cart/change/" + cartId, data);
}
/**
 * 清除购物车
 * @param object ids
 */
export function cartDel(data) {
  return request.post("user/cart/delete", data);
}
/**
 * 订单列表
 * @param object data
 */
export function getOrderList(data) {
  return request.get("order/list", data);
}

/**
 * 小程序商城 - 订单列表
 * @param object data
 */
export function getOrderListApi(data) {
  return request.get("mall/order/list", data);
}

/**
 * 订单产品信息
 * @param string unique
 */
export function orderProduct(orderId) {
  return request.get("reply/product/" + orderId);
}

/**
 * 小程序商城 - 订单产品信息
 * @param string data
 */
export function orderProductApi(data) {
  return request.post("mall/order/replyDetails", data);
}

/**
 * 订单评价
 * @param object data
 *
 */
export function orderComment(id, data) {
  return request.post("reply/" + id, data);
}

/**
 * 小程序商城 - 订单评价
 * @param object data
 *
 */
export function orderCommentApi(data) {
  return request.post("mall/order/reply", data);
}

/**
 * 订单支付
 * @param object data
 */
export function orderPay(data) {
  return request.post("mall/order/pay", data);
}

/**
 * 积分商品订单支付
 * @param object data
 */
export function integralOrderPay(id, data) {
  return request.post("order/points/pay/" + id, data);
}
/**
 * 订单统计数据
 */
export function orderData() {
  return request.get("order/number");
}
/**
 * 小程序商城 - 订单统计数据
 */
export function orderDataApi() {
  return request.get("mall/order/orderStatistics");
}

/**
 * 订单取消
 * @param string id
 *
 */
// export function orderCancel(id){
//   return request.post('order/cancel',{id:id});
// }

/**
 * 未支付订单取消
 * @param string id
 *
 */
export function unOrderCancel(id) {
  return request.post("order/cancel/" + id);
}

/**
 * 小程序商城 - 未支付订单取消
 * @param string data
 *
 */
export function unOrderCancelApi(data) {
  return request.post("mall/order/cancel", data);
}

/**
 * 删除已完成订单
 * @param string uni
 *
 */
export function orderDel(id) {
  return request.post("order/del/" + id);
}

/**
 * 小程序商城 - 删除已完成订单
 * @param Object data
 *
 */
export function orderDelApi(data) {
  return request.delete("mall/order/del", data);
}

/**
 * 订单详情
 * @param string uni
 */
export function getOrderDetail(uni) {
  return request.get("order/detail/" + uni);
}

/**
 * 小程序商城 - 订单详情
 * @param string data
 */
export function getOrderDetailApi(data) {
  return request.get("mall/order/details", data);
}

/**
 * 订单详情
 * @param string uni
 */
export function groupOrderDetail(uni) {
  return request.get("order/group_order_detail/" + uni);
}

/**
 * 小程序商城 - 待付款订单详情
 * @param string data
 */
export function groupOrderDetailApi(data) {
  return request.get("mall/order/obligationDetails", data);
}

// 支付状态订单
export function getPayOrder(uni) {
  return request.get("order/status/" + uni);
}

/**
 * 再次下单
 * @param string uni
 *
 */
export function orderAgain(data) {
  return request.post("user/cart/again", data);
}

/**
 * 小程序商城 - 再次下单
 * @param string uni
 *
 */
export function orderAgainApi(data) {
  return request.post("mall/cart/again", data);
}

/**
 * 订单收货
 * @param string uni
 *
 */
export function orderTake(uni) {
  return request.post("order/take/" + uni);
}

/**
 * 小程序商城 - 订单收货
 * @param object data
 *
 */
export function orderTakeApi(data) {
  return request.post("mall/order/task", data);
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(id) {
  return request.post("order/express/" + id);
}
/**
 * 小程序商城 - 订单查询物流信息
 * @returns {*}
 */
export function expressApi(data) {
  return request.get("mall/order/express", data);
}
/**
 * 退款单查询物流信息
 * @returns {*}
 */
export function refundOrderExpress(merId, id) {
  return request.get(`server/${merId}/refund/express/${id}`);
}
/**
 * 获取退款理由
 *
 */
export function ordeRefundReason() {
  return request.get("order/refund/reason");
}

/**
 * 订单退款审核
 * @param object data
 */
export function orderRefundVerify(data) {
  return request.post("order/refund/verify", data);
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
 */
export function orderConfirm(data) {
  return request.post("order/check", data);
}
/**
 * 订单确认获取订单详细信息
 * @param string cartId
 */
export function getOrderConfirm(data) {
  return request.post("v2/order/check", data);
}
/**
 * 校验进货商品订单
 */
export function getStageOrderConfirm(data) {
  return request.post("welfare/order/purchase/check", data);
}
/**
 * 获取当前金额能使用的优惠卷
 * @param string price
 *
 */
export function getCouponsOrderPrice(price, data) {
  return request.get("coupons/order/" + price, data);
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
  return request.post("/order/computed/" + key, data);
}

// 生成订单
export function orderCreate(data) {
  return request.post("order/create", data, { noAuth: true });
}
// 新的生成订单
export function createOrder(data) {
  return request.post("v2/order/create", data, { noAuth: true });
}
// 提交进货商品订单
export function purchaseCreateOrder(data) {
  return request.post("welfare/order/purchase/create", data, { noAuth: true });
}

// 未支付订单
export function groupOrderList(data) {
  return request.get("order/group_order_list", data, { noAuth: true });
}

// 小程序商城 - 未支付订单
export function groupOrderListApi(data) {
  return request.get("mall/order/obligationList", data, { noAuth: true });
}

// 批量退款列表
export function refundBatch(id) {
  return request.get("refund/batch_product/" + id, { noAuth: true });
}

// 退款商品
export function refundProduct(id, data) {
  return request.get("refund/product/" + id, data, { noAuth: true });
}

// 小程序商城 - 获取退款商品
export function refundProductApi(data) {
  return request.get("mall/order/refundInfo", data, { noAuth: true });
}

// 申请退款
export function refundApply(id, data) {
  return request.post("refund/apply/" + id, data, { noAuth: true });
}

// 小程序商城 - 申请退款
export function refundApplyApi(data) {
  return request.post("mall/order/applyRefund", data, { noAuth: true });
}

// 退款理由
export function refundMessage() {
  return request.get("common/refund_message", { noAuth: true });
}
// 新版退款理由
export function newRefundMessage(data) {
  return request.post("refund/refund_message", data);
}

// 小程序商城 - 新版退款理由
export function newRefundMessageApi(data) {
  return request.get("mall/order/getRefundMessage", data);
}

// 退款列表
export function refundList(data) {
  return request.get("refund/list", data, { noAuth: true });
}

// 小程序商城 -  退款列表
export function refundListApi(data) {
  return request.get("mall/order/getAfterSaleOrderList", data, { noAuth: true });
}

// 退款详情
export function refundDetail(id) {
  return request.get("refund/detail/" + id, { noAuth: true });
}

// 小程序商城 - 退款详情
export function refundDetailApi(data) {
  return request.get("mall/order/getAfterSaleOrderDetails", data, { noAuth: true });
}

// 物流列表
export function expressList() {
  return request.get("common/express");
}

// 小程序商城 - 物流列表
export function expressListApi() {
  return request.get("mall/order/getExpress");
}

// 退回商品提交
export function refundBackGoods(id, data) {
  return request.post("refund/back_goods/" + id, data, { noAuth: true });
}

// 小程序商城 - 退回商品提交
export function refundBackGoodsApi(data) {
  return request.post("mall/order/backGoods", data, { noAuth: true });
}

// 退款记录删除
export function refundDel(id) {
  return request.post("refund/del/" + id, { noAuth: true });
}

// 小程序商城 - 退款记录删除
export function refundDelApi(data) {
  return request.delete("mall/order/delAfterSaleOrder", data, { noAuth: true });
}

// 退款记录删除
export function refundExpress(id) {
  return request.get("refund/express/" + id, { noAuth: true });
}

// 退款记录删除
export function refundExpressApi(data) {
  return request.get("mall/order/refundExpress",data ,{ noAuth: true });
}

// 核销二维码
export function verifyCode(id) {
  return request.get("order/verify_code/" + id);
}

// 小程序商城 - 核销二维码
export function verifyCodeApi(data) {
  return request.get("mall/order/verifyCode", data);
}
/**
 * 预售尾款支付
 * @param object data
 */
export function presellOrderPay(id, data) {
  return request.post("presell/pay/" + id, data);
}

/**
 * 发票订单
 * @param object data
 */
export function receiptOrder(data) {
  return request.get("user/receipt/order", data);
}
/**
 * 发票订单
 * @param object data
 */
export function getReceiptOrder(id) {
  return request.get("user/receipt/order/" + id);
}
/**
 * 发票订单
 * @param object data
 */
export function getCallBackUrlApi(key) {
  return request.get("common/pay_key/" + key, {}, { noAuth: true });
}
/**
 * 发票订单
 * @param object data
 */
export function develiveryDetail(id) {
  return request.get(`order/delivery/${id}`);
}
/**
 * 订单申请开票
 * @param object data
 */
export function applyInvoiceApi(id, data) {
  return request.post(`order/receipt/${id}`, data);
}
/**
 * 小程序商城 - 订单申请开票
 * @param object data
 */
export function applyInvoiceSumbitApi(data) {
  return request.post(`mall/receipt/createOrderReceipt`, data);
}
/**
 * 退款单取消申请
 * @param object data
 */
// export function refundCancelApi(id) {
//   return request.post(`refund/cancel/${id}`);
// }
/**
 * 小程序商城 - 退款单取消申请
 * @param object data
 */
export function refundCancelApi(data) {
  return request.post(`mall/order/cancelAfterSaleOrder`, data);
}
/**
 * @description 一键评价
 */
export function oneClickEvaluation(data) {
  return request.post(`product/oneClickEvaluation`, data);
}
/**
 * @description 小程序商城 - 一键评价
 */
export function oneClickEvaluationApi(data) {
  return request.post(`mall/order/oneClickReply`, data);
}
/**
 * @description 驿站 - 卖货订单列表
 */
export function getSellList(data) {
  return request.get(`welfare/order/sell/list`, data);
}
/**
 * @description 驿站 - 进货订单售后
 */
export function getPurchaseRefund(data) {
  return request.get(`welfare/order/purchase/refund`, data);
}
/**
 * @description 驿站 - 卖货订单售后列表
 */
export function getSellRefund(data) {
  return request.get(`welfare/order/sell/refund`, data);
}
/**
 * @description 进货订单列表
 */
export function purchaseListApi(data) {
  return request.get(`welfare/order/purchase/list`, data);
}
/**
 * @description 进货订单售后
 */
export function purchaseRefundApi(data) {
  return request.get(`welfare/order/purchase/refund`, data);
}
/**
 * @description 进货订单待付款列表
 */
export function purchaseWaitpayApi(data) {
  return request.get(`welfare/order/purchase/waitpay`, data);
}
/**
 * @description 进货订单详情
 */
export function purchaseDtailApi(id, data) {
  return request.get(`welfare/order/purchase/detail/${id}`, data);
}
/**
 * 驿站 -- 卖货订单查看物流
 */
export function getRefundExpressmApi(data) {
  return request.get(`welfare/order/refund/express`, data);
}

/**
 * 小程序商城 -- 订单未读消息统计
 */
export function getOrderNoReadApi(data) {
  return request.get(`mall/order/orderStats`, data);
}

/**
 * 小程序商城 -- 获取订单上链数据
 */
export function getAntChainDetailApi(data) {
  return request.get(`mall/order/antChainDetail`, data);
}

/**
 * 线下码 -- 创建商户线下支付订单
 */
export function merOfflineOrderCreate(data: any) {
  return request.post(`mall/offline/create`, data);
}

/**
 * 线下码 -- // 获取线下支付订单详情
 */
export function merOfflineOrderDetail(order_id: any) {
  return request.get(`mall/offline/detail?order_id=${order_id}`);
}
/**
 * 获取商品通用评论文案
 */
export function dictRandomListApi() {
  return request.get(`home/dictRandomList?code=product_general_reply&limit=10`);
}
/**
 * 获取订单支付渠道信息
 */
export function orderChannelInfoApi(data: any) {
  return request.post(`mall/order/channelInfo`,data);
}
