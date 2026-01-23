import request from "/infrastructure/request/interceptor.js";
export default {
  // 登录
  loginApi(data: any) {
    let params = data || {};
    return request.post(`login/login`, { ...params, device_type: 'wx-applet' });
  },
  // 退出登录
  logoutApi(data: any) {
    let params = data || {};
    return request.post(`login/logout`, { ...params, device_type: 'wx-applet' });
  },
  // 注册
  registerApi(data: any) {
    let params = data || {};
    return request.post(`login/register`, { ...params, device_type: 'wx-applet' });
  },
  // 发送手机验证码
  sendSmsApi(data: any) {
    return request.post(`login/sendSms`, data);
  },
  // 是否要显示邀请码
  is_new_mobileApi(data: any) {
    return request.post(`login/is_new_mobile`, data);
  },
  // 邀请码是否有效
  check_invite_codeApi(data: any) {
    return request.post(`login/check_invite_code`, data);
  },
  // 检查middle_token
  check_middle_tokenApi(data: any) {
    return request.post(`middle/check_middle_token`, data);
  },
  // 获取用户基础信息
  baseInfoApi(params: any) {
    return request.get(`user/baseInfo`, params);
  },
  // 获取用户个人中心基础信息
  getUserMyInfoApi() {
    return request.get(`my/index`, { is_wx_share: 1 });
  },
  // 获取用户协议和隐私协议
  getAgreementApi() {
    return request.get(`knowledge/agreement`);
  },
  // 分享信息
  promotionApi() {
    return request.get(`user/promotion`);
  },
  // 海报图
  shareImage() {
    return request.get(`config/shareImage`);
  },
  // 生成海报图二维码
  createQrcode(data: any) {
    return request.post(`config/createQrcode`, data);
  },
  // 我的个人主页资讯列表
  homeUserPostApi(data: any) {
    return request.get(`home/homeUserPost`, data);
  },
  // 访问他人主页资讯列表
  personalApi(data: any) {
    return request.get(`my/personal`, data);
  },
  // 编辑用户基础信息
  editBaseInfoApi(data: any) {
    return request.post(`user/editBaseInfo`, data);
  },
  // 验证token是否有效
  checkToken(data: any) {
    return request.post(`login/checkToken`, data);
  },
  // 拉黑事件
  addBlacklistApi(data: any) {
    return request.post(`user/addBlacklist`, data);
  },
  // 解除拉黑
  removeBlacklistApi(data: any) {
    return request.post(`user/removeBlacklist`, data);
  },
  // 获取用户协议等内容
  getUserAgreementInfosApi(key: string) {
    return request.get(`knowledge/detail?tag=` + key);
  },
  // 获取用户协议等内容
  securityApi(data: any) {
    return request.post(`user/destroyUser`, data);
  },
  // 提交反馈与建议
  saveFeedbackUggestionApi(data: any) {
    return request.post(`user/submitFeedback`, data);
  },
  // 修改密码
  editPassword(data: any) {
    return request.post(`user/editPassword`, data);
  },
  // 设置密码
  setPassword(data: any) {
    return request.post(`user/setPassword`, data);
  },
  // 当前用户是否设置密码
  whetherSetPassword(data: any) {
    return request.get(`user/whetherSetPassword`, data);
  },
  // 验证码修改密码
  editPasswordToCode(data: any) {
    return request.post(`user/editPasswordToCode`, data);
  },
  // 实名认证
  realName(data: any) {
    return request.post(`user/realName`, data);
  },
  // 校验实名
  isRealName(data: any) {
    return request.get(`user/isRealName`, data);
  },
  // 新增收货地址
  addAddr(data: any) {
    return request.post(`user/addAddr`, data);
  },
  // 编辑收货地址
  editAddr(data: any) {
    return request.post(`user/editAddr`, data);
  },
  // 收获地址详情
  addrDetail(data: any) {
    return request.get(`user/addrDetail`, data);
  },
  // 收获地址列表
  addrList(data: any) {
    return request.get(`user/addrList`, data);
  },
  // 设置为默认地址
  setDefaultAddr(data: any) {
    return request.post(`user/setDefaultAddr`, data);
  },
  // 删除地址
  delAddr(data: any) {
    return request.delete(`user/delAddr`, data);
  },
  // 获取默认配置
  getConfigDefaultApi() {
    return request.get(`config/default`);
  },
  // 刷新token
  refreshTokenApi() {
    return request.post(`login/refreshToken`);
  },
  // 强刷token
  forceRefreshTokenApi() {
    return request.post(`login/forceRefreshToken`);
  },
  // 黑名单列表
  blacklist() {
    return request.get(`user/blacklist`);
  },
  // 设置隐私设置
  privacySet(data: any) {
    return request.post(`user/privacySet`, data);
  },
  // 获取隐私设置
  getPrivacySet(data: any) {
    return request.get(`user/privacySet`, data);
  },
  // 我的反馈列表
  myFeedback(data: any) {
    return request.get(`user/myFeedback`, data);
  },
  // 反馈详情
  feedback(data: any) {
    return request.get(`user/feedback`, data);
  },
  // 判断用户是否被拉黑
  is_blacklistApi(data: any) {
    return request.get(`user/is_blacklist`, data);
  },
  // 判断用户是否被拉黑
  order_listApi(data: any) {
    return request.get(`middle/order_list`, data);
  },
  // 获取用户N值
  get_user_n({ area_name }: any) {
    return request.get(`middle/block_n?area_name=${area_name}`);
  },
  // N值明细
  block_n_detail({ area_name, pageSize, page }: any) {
    return request.get(
      `middle/n_change_log?area_name=${area_name}&pageSize=${pageSize}&page=${page}`
    );
  },
  // 获取分类列表
  get_category_list(id) {
    return request.get(`publicity/category/${id}`);
  },
  // 获取物料
  get_files_list(id) {
    return request.get(`publicity/files/${id}`);
  },
  // 获取物料详情
  get_detail_list(id) {
    return request.get(`publicity/detail/${id}`);
  },
  // 获取物料整合
  get_show_list(id) {
    return request.get(`publicity/show/${id}`);
  },
  // 分享标语
  getShareInfo(id) {
    return request.get(`config/share_info`);
  },
  // ai聊天token
  getCozeToken(id) {
    return request.get(`ai/cozeToken`);
  },
  // 举报数据列表
  reportTypeListApi() {
    return request.get(`report/type_list`);
  },
  // 举报数据列表
  reportSubmitApi(data: any) {
    return request.post(`report/submit`, data);
  },
  // 设置推荐人
  settingInviteCodeApi(data: any) {
    return request.post(`user/settingInviteCode`, data);
  },
  // 忘记密码找回
  retrievePasswordApi(data: any) {
    return request.post(`login/retrievePassword`, data);
  },
  // 校验验证码
  verifySmsCodeApi(data: any) {
    return request.post(`login/verifySmsCode`, data);
  },
  // 获取图形校验数据
  getAjcaptcha(data: any) {
    return request.get(`captcha/generate`, data);
  },
  // 图形滑块校验
  ajcaptchaCheck(data: any) {
    return request.post(`captcha/check`, data);
  },
  // 微信登录
  wxchatLoginApi(data: any) {
    let params = data || {};
    return request.post(`wechat/wechatAuthPhone`, { ...params, device_type: 'wx-applet' });
  },
  // 微信token自动登录
  wxchatAutoLoginApi(data: any) {
    let params = data || {};
    return request.post(`wechat/login`, { ...params, device_type: 'wx-applet' });
  },
  // 获取订单详细信息（赚省）
  getSaveMoneyOrderDetail(id:any){
    return request.get('order/detail',{ order_id: id });
  },
  /**
   * 订单支付(转省)
   * @param object data
  */
  genMiniprogramPayment(id:any){
    return request.post('pay/genMiniprogramPayment', { order_id: id });
  },
  /**
   * 用户绑定小程序账号(赚省)
   * @param object data
  */
  bindMiniProgram(data:any){
    return request.post('thirdParty/bindMiniProgram',data);
  },
  /**
   * 产品收藏列表
   * @param object data
  */
  getRelationListApi(data:any){
    return request.get('mall/user/relation/product/list',data);
  },
    /**
   * 关注店铺列表
   * @param object data
  */
  getMerchantListApi(data:any){
    return request.get('mall/user/relation/merchant/list',data);
  },
  /**
   * 取消关注
   * @param object data
   * 
  */
  relationCancelApi(data:any){
    return request.post('mall/user/relation/cancel',data);
  },
    /**
   * 关注
   * @param object data
   * 
  */
  relationCreateApi(data:any){
    return request.get('mall/user/relation/create',data);
  },
  /**
   * 视频收藏列表
   * @param object data
   * 
  */
  favoriteVideosApi(data:any){
    return request.get('post/favoriteVideos',data);
  },
    /**
   * 获取分享素材
   * @param object data
   * 
  */
  getShareInfoApi(data:any){
    return request.get(`mall/material/shareInfo?mer_id=${data.id}`);
  },
  /**
   * 获取分享商户信息
   * @param object data
   * 
  */
  getShareMerchantInfoApi(data:any){
    return request.get(`mall/material/shareMerchant`);
  },
  /**
     * 获取用户协议
     * @param object data
     * 
    */
  getUserAgreeApi(data:any){
    return request.get(`mall/common/getAgree/sys_user_agree`);
  },
};

// 获取实名认证信息
export function getCertificationApi(data: any) {
	return request.get('mall/user/getCertification', data,)
}

// 提交实名认证信息
export function certificationApi(data: any) {
	return request.post('mall/user/certification', data,)
}

// 实名认证发送短信
export function sendCommonSmsApi(data: any) {
	return request.post('mall/common/sendSms', data,)
}
