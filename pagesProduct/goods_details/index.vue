<template>
  <view :style="localViewColor">
    <view class="product-con">
      <!-- #ifndef MP -->
      <view
        class="head-wrapper arrow"
        id="home"
        :style="{ top: header_padding + 'px' }"
      >
        <image
          class="arrow-icon"
          @click="returns"
          :src="
            imgUrlEvent(
              '/images/wx-applet/mine/wx-left-arrow.png',
              'aliyunImgUrl'
            )
          "
        ></image>
      </view>
      <!-- #endif -->
      <!-- #ifdef MP -->
      <view
        class="head-wrapper arrow"
        id="home"
        :style="{
          top: menu_button_info.top + 'px',
          height: menu_button_info.height + 'px',
        }"
      >
        <image
          class="arrow-icon"
          @click="returns"
          :src="
            imgUrlEvent(
              '/images/wx-applet/mine/wx-left-arrow.png',
              'aliyunImgUrl'
            )
          "
        ></image>
      </view>
      <!-- #endif -->

      <!-- #ifndef MP -->
      <view
        class="head-wrapper"
        :style="{ top: header_padding + 'px', right: '15px', left: 'inherit' }"
      >
        <view class="fenxiang_btn" @click="listenerActionSheet">
          <view
            class="head-menu"
            style="width: 32rpx; border: none; background: none"
          >
            <view class="iconfont icon-fenxiang"></view>
          </view>
        </view>
      </view>
      <!-- #endif -->
      <!-- 导航小图标 -->
      <view
        class="dialog_nav"
        v-show="currentPage"
        :style="{ top: navH + 10 + 'rpx' }"
      >
        <view
          class="dialog_nav_item"
          :class="item.after"
          v-for="(item, index) in selectNavList"
          :key="index"
          @click="linkPage(item.url)"
        >
          <text class="iconfont" :class="item.icon"></text>
          <text class="pl-20">{{ item.name }}</text>
        </view>
      </view>
      <view v-if="storeInfo && storeInfo.merchant">
        <scroll-view
          :scroll-top="scrollTop"
          scroll-y="true"
          scroll-with-animation="true"
          :style="'height:' + height + 'px;'"
          @scroll="scroll"
        >
          <view id="past0" class="flex flex-ac flex-column">
            <!-- #ifdef MP || APP-PLUS -->
            <view class="" :style="'width:100%;' + 'height:' + 0 + 'px'"></view>
            <!-- #endif -->
            <productConSwiper
              :imgUrls="storeInfo.slider_image"
              :videoCoverImg="videoCoverImg"
              :videoline="storeInfo.video_link"
              @noUpdate="imgtapHandle"
            ></productConSwiper>
            <!--有氛围图-->
            <view
              v-if="storeInfo.atmosphere_pic"
              :style="{ backgroundImage: `url(${storeInfo.atmosphere_pic})` }"
              class="nav acea-row row-between-wrapper"
            >
              <view class="money skeleton-rect"
                >￥<text class="num">{{ storeInfo.price }}</text>
                <text v-if="!svipData" class="y-money"
                  >￥{{ storeInfo.ot_price }}</text
                >
                <view
                  class="atmosphere"
                  v-if="
                    svipData && svipData.show_svip_price && svipData.show_svip
                  "
                  style="display: inline-block"
                >
                  <text class="vip-money">￥{{ storeInfo.svip_price }}</text>
                  <image
                    class="vip-image"
                    :src="
                      imgUrlEvent(
                        '/images/wx-applet/mine/svip.png',
                        'aliyunImgUrl'
                      )
                    "
                  ></image>
                </view>
              </view>
            </view>









            
            <view class="wrapper">
              <view class="wrapper-mask"></view>
              <view class="warp">
                <view
                  v-if="storeInfo.atmosphere_pic"
                  class="introduce skeleton-rect acea-row row-between row-bottom atmosphere"
                >
                  <view>
                    <text
                      v-if="storeInfo.merchant && storeInfo.merchant.type_name"
                      class="font-bg-red bt-color autotrophy"
                      >{{ storeInfo.merchant.type_name }}</text
                    >
                    <text
                      v-else-if="
                        storeInfo.merchant && storeInfo.merchant.is_trader
                      "
                      class="font-bg-red bt-color autotrophy"
                      >自营</text
                    >
                    {{ storeInfo.store_name }}
                  </view>
                </view>
                <view
                  v-if="storeInfo.atmosphere_pic"
                  class="integral_count skeleton-rect"
                >
                  <text
                    v-if="storeInfo.max_integral > 0 && !welfareTitle"
                    class="integral"
                    >积分最高可抵扣{{ storeInfo.max_integral }}元</text
                  >
                  <text
                    v-if="storeInfo.contribution > 0 && !welfareTitle"
                    class="integral"
                    >预计赠送{{ storeInfo.contribution || 0 }}个共献值</text
                  >
                  <text
                    v-if="
                      storeInfo.delivery_free == 1 &&
                      storeInfo.sc_product_type != 1
                    "
                    class="integral"
                    >包邮</text
                  >
                </view>
                <!--无氛围图-->
                <view v-else class="share acea-row row-between row-bottom">
                  <view
                    class="money p-color skeleton-rect"
                    style="min-width: 70rpx"
                  >
                    ￥
                    <text class="num">{{ storeInfo.price }}</text>
                    <text class="market-price">￥{{ storeInfo.ot_price || 0 }}</text>
                    <view
                      v-if="
                        svipData &&
                        svipData.show_svip_price &&
                        svipData.show_svip
                      "
                      class="money-box"
                    >
                      <text class="vip-money"
                        >￥{{ storeInfo.svip_price }}</text
                      >
                      <image
                        class="vip-image"
                        :src="
                          imgUrlEvent(
                            '/images/wx-applet/mine/svip.png',
                            'aliyunImgUrl'
                          )
                        "
                      ></image>
                    </view>
                  </view>

                  <view class="label-vessel">
                    <view class="skeleton-rect"
                      >库存:{{ storeInfo.stock ? storeInfo.stock : 0
                      }}{{
                        storeInfo.unit_name
                          ? "(" + storeInfo.unit_name + ")"
                          : ""
                      }}</view
                    >
                    <view class="skeleton-rect" style="margin-left: 32rpx"
                      >销量:{{ storeInfo.sales ? storeInfo.sales : 0
                      }}{{
                        storeInfo.unit_name
                          ? "(" + storeInfo.unit_name + ")"
                          : ""
                      }}</view
                    >
                  </view>
                </view>
                <!-- <view
                  v-if="svipData && !svipData.is_svip && svipData.show_svip"
                  class="svipCon acea-row row-between-wrapper skeleton-rect"
                  style="margin-top: 16rpx"
                >
                  <view class="acea-row row-between-wrapper">
                    <image
                      :src="
                        imgUrlEvent(
                          '/images/wx-applet/mine/svip_user.png',
                          'aliyunImgUrl'
                        )
                      "
                    ></image>
                    <view class=""
                      >开通 SVIP会员
                      <template v-if="svipData.show_svip_price"
                        >立省<text>{{ svipData.save_money }}元</text></template
                      >
                      <template v-else
                        ><text>省钱多多，权益多多</text></template
                      >
                    </view>
                  </view>
                  <navigator
                    class="svipBtn"
                    url="/packages/mall/views/pages/annex/vip_paid/index"
                  >
                    立即开通
                    <text class="iconfont icon-jiantou"></text>
                  </navigator>
                </view> -->
                <view
                  v-if="!storeInfo.atmosphere_pic"
                  class="integral_count skeleton-rect"
                >
                  <!-- 爆单商品 -->
                  <view
                    v-if="
                      storeInfo.zone_type == 'hot' ||
                      storeInfo.zone_type == 'premium' ||
                      storeInfo.zone_type == 'exchange'
                    "
                  >
                    <!-- <text v-if="storeInfo.max_integral > 0" class="integral">积分最高可抵扣{{ storeInfo.max_integral }}元</text> -->
                    <text
                      class="integral"
                      v-if="attr.productSelect?.consume_points"
                      >预计赠送{{
                        attr.productSelect?.consume_points
                      }}消费积分</text
                    >
                    <text
                      v-if="storeInfo.zone_type == 'exchange'"
                      class="integral"
                      >兑换积分最多抵扣{{
                        attr.productSelect?.super_integral
                      }}</text
                    >
                    <text
                      v-if="
                        storeInfo.delivery_free == 1 &&
                        storeInfo.sc_product_type != 1
                      "
                      class="integral"
                      >包邮</text
                    >
                  </view>
                  <!-- 其他商品 -->
                  <view v-else style="display: flex; align-items: center;flex-wrap: wrap;">
                    <text
                      v-if="storeInfo.max_integral > 0 && !welfareTitle"
                      class="integral"
                      >积分最高可抵扣{{ storeInfo.max_integral }}元</text
                    >
                    <text
                      v-if="
                        storeInfo.ticket > 0 &&
                        !welfareTitle &&
                        storeInfo.zone_type != 'welfare'
                      "
                      class="integral"
                      >预计赠送{{
                        decimalExchangeCoupons(storeInfo.ticket) || 0
                      }}兑换券</text
                    >
                    <text
                      v-if="
                        storeInfo.delivery_free == 1 &&
                        storeInfo.sc_product_type != 1
                      "
                      class="integral"
                      >包邮</text
                    >
                    <text
                      class="integral delivery"
                      v-for="(item, index) in storeInfo.mer_labels_data"
                      :key="index"
                      >{{ item }}</text
                    >
                    <text class="integral" v-if="storeInfo.max_share_benefit_price">折扣总额{{storeInfo.max_share_benefit_price  }}</text>
                  </view>
                </view>
                <view
                  v-if="!storeInfo.atmosphere_pic"
                  class="introduce skeleton-rect"
                >
                  <text
                    v-if="storeInfo.merchant.type_name"
                    class="font-bg-red bt-color autotrophy"
                    >{{ storeInfo.merchant.type_name }}</text
                  >
                  <text
                    v-else-if="storeInfo.merchant.is_trader"
                    class="font-bg-red bt-color autotrophy"
                    >自营</text
                  >
                  {{ storeInfo.store_name || "" }}
                </view>
                <view class="address-info acea-row row-between-wrapper" v-if="storeInfo.merchant.mer_address && storeInfo.merchant.distance">
                  <view class="address-info-text">
                    <text class="address">{{ storeInfo.merchant.mer_address }}</text>
                    <text class="dist">距离您：{{ storeInfo.merchant.distance }}km</text>
                  </view>
                  <image
                    class="address-icon"
                    @click="showLocation"
                    :src="
                      imgUrlEvent(
                        '/images/wx-applet/mine/wx-location.png',
                        'aliyunImgUrl'
                      )
                    "
                  ></image>
                  
                </view>
                <!-- <view
                  class="label label-vessel acea-row row-between-wrapper"
                  :style="{
                    'padding-bottom':
                      coupon.list.length || storeInfo.top_pid ? 0 : 10 + 'px',
                  }"
                >
                  <view class="skeleton-rect"
                    >市场价:￥{{ storeInfo.ot_price || 0 }}</view
                  >
                  <view class="label-vessel">
                    <view class="skeleton-rect"
                      >库存:{{ storeInfo.stock ? storeInfo.stock : 0
                      }}{{
                        storeInfo.unit_name
                          ? "(" + storeInfo.unit_name + ")"
                          : ""
                      }}</view
                    >
                    <view class="skeleton-rect" style="margin-left: 32rpx"
                      >销量:{{ storeInfo.sales ? storeInfo.sales : 0
                      }}{{
                        storeInfo.unit_name
                          ? "(" + storeInfo.unit_name + ")"
                          : ""
                      }}</view
                    >
                  </view>
                </view> -->
                <navigator
                  style="margin-top: 16rpx"
                  v-if="storeInfo.top_pid"
                  hover-class="none"
                  :url="`/packages/mall/views/pages/activity/rank/index?cate_id=${storeInfo.top_pid}`"
                  class="label"
                >
                  <view class="rank_list acea-row row-between-wrapper">
                    <view class="acea-row row-between-wrapper">
                      <text class="rank_title"></text>
                      <view
                        >{{ storeInfo.top_name }} · 第{{
                          storeInfo.top_num
                        }}名</view
                      >
                    </view>
                    <text class="iconfont icon-xiala1"></text>
                  </view>
                </navigator>
                <view
                  v-if="coupon.list.length > 0"
                  class="coupon acea-row row-between-wrapper skeleton-rect"
                  @click="couponTap"
                  style="margin-top: 20rpx"
                >
                  <view class="hide line1 acea-row">
                    优惠券：
                    <view
                      class="activity"
                      v-for="(item, index) in coupon.list"
                      :key="index"
                      >满{{ item.use_min_price }}减{{ item.coupon_price }}</view
                    >
                  </view>
                  <view class="iconfont icon-jiantou"></view>
                </view>
              </view>
            </view>





















            <view class="attribute-box">
              <view
                class="attribute acea-row row-between-wrapper skeleton-rect"
                @click="selecAttr"
              >
                <view class="acea-row row-between-wrapper"
                  >{{ attrTxt }}：
                  <text class="atterTxt">{{ attrValue }}</text>
                </view>
                <view class="acea-row row-middle">
                  <text class="atterTip" v-if="!attrValue">请选择</text>
                  <view class="iconfont icon-jiantou" style="color: #B5B5B5"></view>
                </view>
              </view>
            </view>
            <view class="attribute-box mt20" v-if="welfareTitle">
              <view class="attribute acea-row flex flex-ac">
                <view class="presenter">赠</view>
                <text class="equity">{{
                  "赠本店 “" + welfareTitle + "” 权益一份"
                }}</text>
              </view>
            </view>
            <view class="attribute-box">
              <view
                style="margin-top: 16rpx"
                v-if="specsInfo.params && specsInfo.params.length > 0"
                class="attribute acea-row row-between-wrapper"
                @click="seeSpecs"
              >
                <view class="acea-row row-middle">
                  参数：
                  <view class="list line1">
                    <text
                      class="item params"
                      v-for="(item, index) in specsInfo.params"
                      :key="index"
                      v-show="index < 2"
                      >{{ item.name }}</text
                    >
                    <text>...</text>
                  </view>
                </view>
                <view class="iconfont icon-jiantou"></view>
              </view>
            </view>
            <!--运费-->
            <view class="attribute-box">
              <view
                v-if="
                  (shipping || shippingValue) &&
                  delivery_way &&
                  delivery_way.indexOf('2') > -1
                "
                style="margin-top: 16rpx"
                class="attribute acea-row row-between-wrapper"
                @click="showShip"
              >
                <view class="acea-row row-between-wrapper"
                  >运费：
                  <text class="atterTxt">{{ shippingValue }}</text>
                </view>
                <view class="iconfont icon-jiantou" style="color: #B5B5B5"></view>
              </view>
            </view>
            <!--保障-->
            <view class="attribute-box">
              <view
                style="margin-top: 16rpx"
                v-if="guarantee && guarantee.length"
                class="attribute acea-row row-between-wrapper"
                @click="showGuaranee"
              >
                <view class="acea-row row-between-wrapper"
                  >保障：
                  <view class="guaranteeAttr">
                    <text
                      class="atterTxt1"
                      :class="item.guarantee_name ? 'hasAttr' : ''"
                      v-for="(item, index) in guarantee"
                      :key="index"
                    >
                      {{ item.guarantee_name ? item.guarantee_name : "" }}
                    </text>
                  </view>
                </view>
                <view class="iconfont icon-jiantou" style="color: #B5B5B5"></view>
              </view>
            </view>
          </view>
          <!--优惠套餐-->
          <view class="attribute-box">
            <view class="combo" v-if="comboList && comboList.length > 0">
              <view class="title acea-row row-between-wrapper">
                <view>优惠套餐({{ comboTotal }}) </view>
                <view class="praise" @click="openCombo">
                  查看全部
                  <text class="iconfont icon-jiantou"></text>
                </view>
              </view>
              <scroll-view
                scroll-x="true"
                style="white-space: nowrap; display: flex; height: 180rpx"
                show-scrollbar="false"
              >
                <view class="img-box">
                  <view
                    class="combo_item"
                    v-for="(item, index) in comboList"
                    :key="index"
                  >
                    <view
                      class="img-item"
                      v-for="(itemn, indexn) in item.discountsProduct"
                      :key="indexn"
                    >
                      <image
                        :src="itemn.image"
                        mode=""
                        @click="openCombo"
                      ></image>
                      <text
                        v-if="indexn != item.count - 1"
                        class="iconfont icon-jiahao2"
                      ></text>
                    </view>
                    <view class="list_total">
                      <view class="list_num">共{{ item.count }}件</view>
                      <view class="list_price p-color"
                        >省 ¥{{ item.max_price }}</view
                      >
                    </view>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
          <!-- 产品介绍、价格说明 -->
          <view class="attribute-box">
            <view class="product-intro" id="past3">
              <view class="title">产品介绍</view>
              <view
                class="conter"
                v-if="description && isEmptyString(description.content)"
              >
                <!-- // 改版(富文本改为图片展示) -->
                <view v-if="description.type == 0" class="product_content">
                  <view
                    v-if="description.detail_text"
                    class="title"
                    >{{ description.detail_text }}</view
                  >
                  <view
                    v-if="description.detail_images?.length"
                    class="pictures"
                  >
                    <image
                      v-for="(item, index) in description.detail_images"
                      :key="index"
                      :src="item"
                      @click="previewImage(description.detail_images, index)"
                      class="pic-img"
                      style="width: 100%; height: auto;"
                      mode="widthFix"
                    ></image>
                  </view>
                </view>
                <view v-else class="product_content">
                  <view
                    v-if="description.content && description.content.title"
                    class="title"
                    >{{ description.content.title }}</view
                  >
                  <view
                    v-if="description.content && description.content.image"
                    class="pictures"
                  >
                    <image
                      v-for="(item, index) in description.content.image"
                      :key="index"
                      :src="item"
                    ></image>
                  </view>
                </view>
              </view>
              <!-- 价格说明 -->
              <view
                v-if="priceRule.content"
                class="price-info"
                :style="{
                  'padding-top':
                    description && isEmptyString(description.content) ? '' : 0,
                }"
              >
                <view class="price-title">{{ priceRule.rule_name }}</view>
                <!-- #ifndef APP-PLUS -->
                <!-- <jyf-parser
                :domain="domain"
                :html="priceRule.content.replace(/<br\/>/gi, '')"
                ref="article"
                :tag-style="tagStyle"
              ></jyf-parser> -->
                <view v-html="priceRule.content.replace(/<br\/>/gi, '')"></view>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <!-- <view
                class="description"
                v-html="priceRule.content.replace(/<br\/>/gi, '')"
              ></view> -->
                <rich-text
                  class="description"
                  :nodes="priceRule.content.replace(/<br\/>/gi, '')"
                  @itemclick="handleItemClick"
                ></rich-text>
                <!-- #endif -->
              </view>
            </view>
          </view>
          <!-- 用户评价 -->
          <view class="attribute-box">
            <view
              class="userEvaluation"
              id="past1"
              v-if="replyCount"
            >
              <view class="title acea-row row-between-wrapper skeleton-rect o-title">
                <view class="title-text">用户评价（{{ replyCount }}）</view>
                <navigator
                  class="praise"
                  hover-class="none"
                  :url="
                    '/pagesProduct/goods_comment_list/index?product_id=' + id
                  "
                >
                  <!-- <text class="t-color">{{ replyChance }}</text
                  >好评率 -->
                  <text class="t-color" v-if="replyCount">查看全部</text
                  >
                  <text class="iconfont icon-jiantou" style="color: #B5B5B5"></text>
                </navigator>
              </view>
              <template v-if="replyCount">
                <userEvaluation :reply="reply"></userEvaluation>
              </template>
            </view>
          </view>
          <!-- 种草秀 -->
          <view class="attribute-box">
            <view
              class="userPlant"
              v-if="storeInfo.community && storeInfo.community.length > 0"
            >
              <view class="title acea-row row-between-wrapper">
                <view>种草秀 </view>
                <navigator
                  class="praise"
                  hover-class="none"
                  :url="
                    '/packages/mall/views/pages/plantGrass/plant_show/index?spu_id=' +
                    storeInfo.spu_id
                  "
                >
                  查看全部
                  <text class="iconfont icon-jiantou"></text>
                </navigator>
              </view>
              <view class="imgList acea-row">
                <view
                  class="pictrue"
                  v-for="(item, index) in storeInfo.community"
                  :key="index"
                  v-show="index <= 2"
                  @click="goPlant(item)"
                >
                  <image :src="item.image[0]" class="image"></image>
                  <image
                    v-if="item.is_type == 2"
                    class="video_img"
                    src="https://qnyweb.302010.com/mdd_static/images/stop.png"
                    mode=""
                  ></image>
                </view>
              </view>
            </view>
          </view>
          <!-- 商铺信息 -->
          <view class="attribute-box">
            <view
              class="store-wrapper"
              v-if="storeInfo.merchant && hide_mer_status != 1"
            >
              <view class="store-hd skeleton-rect">
                <view v-if="hide_mer_status != 1" class="store-info">
                  <navigator
                    :url="
                      storeInfo.zone_type == 'welfare' ||
                      storeInfo.zone_type == 'welfare_self'
                        ? '/packages/mall/views/pages/users/post-station/shop?id=' +
                          storeInfo.merchant.mer_id +
                          '&welfare_post_id=' +
                          storeInfo.merchant.welfare_post_id
                        : '/views/pages/home/store?mer_id=' +
                          storeInfo.merchant.mer_id
                    "
                    hover-class="none"
                    class="logo"
                  >
                    <image :src="storeInfo.merchant.mer_avatar" mode=""></image>
                  </navigator>
                  <navigator
                    :url="
                      storeInfo.zone_type == 'welfare' ||
                      storeInfo.zone_type == 'welfare_self'
                        ? '/packages/mall/views/pages/users/post-station/shop?id=' +
                          storeInfo.merchant.mer_id +
                          '&welfare_post_id=' +
                          storeInfo.merchant.welfare_post_id
                        : '/views/pages/home/store?mer_id=' +
                          storeInfo.merchant.mer_id
                    "
                    hover-class="none"
                    class="info"
                  >
                    <view class="nape">
                      <text class="name line1">{{
                        storeInfo.merchant.mer_name
                          ? storeInfo.merchant.mer_name
                          : ""
                      }}</text>
                      <image
                        v-if="
                          margin_ico_switch == 1 &&
                          margin_ico &&
                          storeInfo.merchant.is_margin == 10
                        "
                        :src="margin_ico"
                        class="store-margin"
                      ></image>
                    </view>
                    <view v-if="storeInfo.merchant.care_count" class="txt">
                      <text
                        v-if="storeInfo.merchant.type_name"
                        class="font-bg-red bt-color autotrophy"
                        >{{ storeInfo.merchant.type_name }}</text
                      >
                      <text
                        v-else-if="storeInfo.merchant.is_trader"
                        class="font-bg-red bt-color autotrophy"
                        >自营</text
                      >
                      {{
                        storeInfo.merchant.care_count < 10000
                          ? storeInfo.merchant.care_count
                          : (storeInfo.merchant.care_count / 10000).toFixed(2) +
                            "万"
                      }}人关注
                    </view>
                    <view v-else class="txt">0人关注</view>
                  </navigator>
                  <navigator
                    v-if="hide_mer_status != 1"
                    :url="
                      storeInfo.zone_type == 'welfare' ||
                      storeInfo.zone_type == 'welfare_self'
                        ? '/packages/mall/views/pages/users/post-station/shop?id=' +
                          storeInfo.merchant.mer_id +
                          '&welfare_post_id=' +
                          storeInfo.merchant.welfare_post_id
                        : '/views/pages/home/store?mer_id=' +
                          storeInfo.merchant.mer_id
                    "
                    class="link"
                    hover-class="none"
                    >进店</navigator
                  >
                </view>
                <view class="score-wrapper">
                  <view class="item">
                    商品描述<text>{{ storeInfo.merchant.product_score }}</text>
                  </view>
                  <view class="item">
                    卖家服务<text>{{ storeInfo.merchant.service_score }}</text>
                  </view>
                  <view class="item">
                    物流服务<text>{{ storeInfo.merchant.postage_score }}</text>
                  </view>
                </view>
              </view>
              <view
                v-if="
                  storeInfo.merchant.recommend &&
                  storeInfo.merchant.recommend.length > 0
                "
                class="con-box"
              >
                <view class="title">店铺推荐</view>
                <view class="good-list">
                  <view
                    class="good-item flex "
                    v-for="(item, index) in storeInfo.merchant.recommend"
                    :key="index"
                    @click="goProDetail(item)"
                  >
                    <easy-loadimage
                      mode="widthFix"
                      :image-src="item.image"
                    ></easy-loadimage>
                    <view class="good-info flex-1 flex flex-column jc-sb">
                      <view class="title line2">{{ item.store_name }}</view>
                      <view class="flex jc-sb flex-ae">
                        <view class="price">
                          <text>￥</text>{{ item.price }}
                        </view>
                        <view class="buy-btn">抢购</view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view style="height: 170rpx"></view>
        </scroll-view>
      </view>
      <view class="footer acea-row row-between-wrapper">
        <view v-if="is_commerce == 1 || is_selection == 1"></view>
        <view class="acea-row row-between-wrapper" v-else>
          <template v-if="storeInfo.merchant">
            <view
              v-if="storeInfo.merchant.services_type == 0"
              class="item skeleton-rect"
              @click="goCustomer"
            >
              <image
                mode="aspectFit"
                class="footer-icon"
                :src="
                  imgUrlEvent(
                    '/images/wx-applet/mine/wx-custom-service.png',
                    'aliyunImgUrl'
                  )
                "
              ></image>
              <view>客服</view>
            </view>
            <view v-else class="item skeleton-rect" @click="call">
              <image
                mode="aspectFit"
                class="footer-icon"
                :src="
                  imgUrlEvent(
                    '/images/wx-applet/mine/wx-custom-service.png',
                    'aliyunImgUrl'
                  )
                "
              ></image>
              <view>客服</view>
            </view>
          </template>
          <view @click="setCollect" class="item skeleton-rect">
            <image
              v-if="storeInfo.isRelation"
              mode="aspectFit"
              class="footer-icon"
              :src="
                imgUrlEvent(
                  '/images/wx-applet/mine/wx-collect-active.png',
                  'aliyunImgUrl'
                )
              "
            ></image>
            <image
              v-else
              mode="aspectFit"
              class="footer-icon"
              :src="
                imgUrlEvent(
                  '/images/wx-applet/mine/wx-collect-default.png',
                  'aliyunImgUrl'
                )
              "
            ></image>
            <view>收藏</view>
          </view>
          <navigator
            open-type="navigate"
            class="animated item skeleton-rect"
            :class="animated == true ? 'bounceIn' : ''"
            url="/pagesProduct/order_addcart/order_addcart"
            hover-class="none"
          >
            <view class="cart-wrap">
              <image
                mode="aspectFit"
                class="footer-icon"
                :src="
                  imgUrlEvent(
                    '/images/wx-applet/mine/wx-cart.png',
                    'aliyunImgUrl'
                  )
                "
              ></image>
              <text v-if="CartCount > 0" class="num">{{ CartCount || 0 }}</text>
            </view>
            <view>购物车</view>
          </navigator>
        </view>
        <view
          v-if="attr.productSelect.stock != 0"
          class="bnt acea-row skeleton-rect arrow"
          :class="is_commerce == 1 || is_selection == 1 ? 'c-bnt' : ''"
        >
          <template v-if="is_commerce == 1 || is_selection == 1">
            <!-- 带货 -->
            <form @submit="goBuy" report-submit="true" v-if="is_commerce == 1 || (!is_share_self && is_selection == 1)">
              <button
                class="buy bnts sold_out c-btn"
                form-type="submit"
              >
                立即购买
              </button>
            </form>
            <!-- 选品 -->
            <form @submit="commerceHandle" report-submit="true" v-if="is_selection == 1 && is_share_self">
              <button
                class="buy bnts sold_out c-btn"
                form-type="submit"
              >
                带货
              </button>
            </form>
          </template>
          <template v-else>
            <form @submit="joinCart" report-submit="true">
              <button
                v-if="storeInfo.type != 1 && storeInfo.type != 2"
                class="joinCart bnts"
                form-type="submit"
              >
                加入购物车
              </button>
            </form>
            <form @submit="goBuy" report-submit="true" v-if="attr.productSelect">
              <button
                class="buy bnts"
                :class="
                  storeInfo.type == 1 || storeInfo.type == 2 ? 'virtual_buy' : ''
                "
                form-type="submit"
                :disabled="attr.productSelect.stock == 0"
              >
                立即购买
              </button>
            </form>
          </template>
        </view>
        <view v-else class="bnt acea-row skeleton-rect">
          <form report-submit="true">
            <button
              v-if="procudt_increase_status"
              class="buy bnts sold_out"
              form-type="submit"
              @click="arrivalNotice"
            >
              到货通知
            </button>
            <button
              v-else
              class="buy bnts sold_out"
              form-type="submit"
              disabled
            >
              商品已售罄
            </button>
          </form>
        </view>
      </view>
      <!-- <block v-if="sharePacket.max&&sharePacket.max>0">
				<shareRedPackets :sharePacket="sharePacket" @listenerActionSheet="listenerActionSheet" @closeChange="closeChange"
				 :showAnimate="showAnimate" @boxStatus="boxStatus"></shareRedPackets>
			</block> -->
      <!-- 组件 -->
      <productWindow
        :attr="attr"
        :isShow="1"
        :iSplus="1"
        :zone_type="storeInfo.zone_type"
        @myevent="onMyEvent"
        @ChangeAttr="ChangeAttr"
        @ChangeCartNum="ChangeCartNum"
        @attrVal="attrVal"
        @iptCartNum="iptCartNum"
        id="product-window"
        :plusStep="plus_step"
        :payLimit="pay_limit"
        :maxCount="max_count"
        :minCount="min_count"
        :svipPrice="svipPrice"
        :image="storeInfo.image"
        :sku="sku"
        :welfareTitle="welfareTitle"
      ></productWindow>
      <template v-if="coupon.coupon">
        <couponListWindow
          :coupon="coupon"
          @ChangCouponsClone="ChangCouponsClone"
          @ChangCoupons="ChangCoupons"
          @ChangCouponsUseState="ChangCouponsUseState"
        ></couponListWindow>
      </template>
      <specs :specsInfo="specsInfo" @myevent="mySpecs"></specs>
      <!-- 分享按钮 -->
      <view
        class="generate-posters acea-row row-middle"
        :class="posters ? 'on' : ''"
      >
        <!-- #ifndef MP -->
        <button
          class="item"
          :class="weixinStatus ? 'item3' : ''"
          hover-class="none"
          v-if="weixinStatus === true"
          @click="H5ShareBox = true"
        >
          <view class="iconfont icon-weixin3"></view>
          <view class="">发送给朋友</view>
        </button>
        <!-- #endif -->
        <!-- #ifdef MP -->
        <!-- <button class="item" :class="weixinStatus ? 'item3' : ''" open-type="share" hover-class='none' @click="goFriend">
					<view class="iconfont icon-weixin3"></view>
					<view class="">发送给朋友</view>
				</button> -->
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <view class="item" @click="appShare('WXSceneSession')">
          <view class="iconfont icon-weixin3"></view>
          <view class="">分享给好友</view>
        </view>
        <!-- #endif -->
        <button
          class="item"
          :class="weixinStatus ? 'item3' : ''"
          hover-class="none"
          @click="goPoster"
        >
          <view class="iconfont icon-haibao"></view>
          <view class="">生成海报</view>
        </button>
        <button
          class="item"
          :class="weixinStatus ? 'item3' : ''"
          hover-class="none"
          @click="copyPwd"
        >
          <view class="iconfont icon-fuzhikouling1"></view>
          <view>生成口令</view>
        </button>
      </view>
      <view
        class="mall-mask"
        v-if="posters"
        @click="listenerActionClose"
      ></view>
      <view
        class="mask_transparent"
        v-if="currentPage"
        @touchmove="hideNav"
        @click="hideNav()"
      ></view>
      <!--口令复制结果-->
      <copyPassword
        :isCopy="isCopy"
        :copyUrl="copyUrl"
        @close="closeCopy"
      ></copyPassword>
      <!-- 海报展示 -->
      <view class="poster-pop" v-if="posterImageStatus">
        <image
          :src="
            imgUrlEvent(
              '/images/wx-applet/mine/poster-close.png',
              'aliyunImgUrl'
            )
          "
          class="close"
          @click="posterImageClose"
        ></image>
        <image :src="posterImage"></image>
        <view class="save-poster" @click="savePosterPath">保存到手机</view>
        <!-- #ifdef H5 -->
        <!-- <view class="keep">长按图片可以保存到手机</view> -->
        <!-- #endif -->
      </view>
      <view class="mask" v-if="posterImageStatus"></view>
      <canvas class="canvas" canvas-id="myCanvas" v-if="canvasStatus"></canvas>
      <!-- 发送给朋友图片 -->
      <view class="share-box" v-if="H5ShareBox">
        <image
          src="https://qnyweb.302010.com/mdd_static/images/share-info.png"
          @click="H5ShareBox = false"
        ></image>
      </view>
      <guaranteeTemplate
        ref="guartemplate"
        :guarantee="guarantee"
        :shipping="shipping"
      ></guaranteeTemplate>
      <!-- #ifndef H5 -->
      <passwordPopup></passwordPopup>
      <!-- #endif -->
      <!--套餐产品弹窗-->
      <discounts-goods ref="discounts" :id="id" :uid="uid"></discounts-goods>
    </view>
  </view>
  <view class="global-tips df-r ai-c jc-c" v-if="main_store.is_wechat_moments_share">点击下方按钮前往小程序使用完整服务</view>
  <g-login-modal ref="login_modal"  @loginCallback="loginStatusChange"></g-login-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted, markRaw, getCurrentInstance, defineAsyncComponent, nextTick } from "vue";
import { onLoad, onShow, onReady, onInit, onHide, onUnload, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
let sysHeight = uni.getSystemInfoSync().statusBarHeight;
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { copyPasswordApi } from '@/business/api/modules/store-old.ts';
import { getProductDetail, getProductParmas, priceRuleApi, postCartAdd, getDiscountsLst, arrivalNoticeApi } from '@/business/api/modules/store.ts';
import { homeApi } from "@/business/api/index.ts";
import { imgToBase } from '@/business/api/modules/user.ts';
import { getCoupons, getShopCoupons } from '@/business/api/modules/api-new.ts';
import { getCartCounts } from '@/business/api/modules/order-new.ts';
import productConSwiper from '@/pagesProduct/goods_details/components/plantConSwiper/index.vue';
import couponListWindow from '@/components/couponListWindow/index.vue';
import copyPassword from '@/components/copyPassword/index.vue';
import productWindow from '@/components/productWindow/index.vue';
import userEvaluation from '@/components/userEvaluation';
import specs from '@/components/specs/index.vue';
import { toLogin } from '@/infrastructure/libs/login.js';
// #ifndef H5
import passwordPopup from '@/components/passwordPopup';
// #endif
import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
import guaranteeTemplate from '@/components/freightGuarantee';
import discountsGoods from './discountsGoods';
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import { history } from '@/business/api/modules/public.ts';
import util from '@/infrastructure/utils/utils.js';
import store_ from "@/business/store/modules/mall.ts";
import useMine from "@/business/store/modules/mine.ts";
import { decimalExchangeCoupons } from "@/infrastructure/utils/filter.js";
import { shareH5 } from "@/infrastructure/utils/utils.js";
import { getLocationXY } from "@/views/pages/save-money/infrastructure/utils/utils"
import { checkTokenEventAst } from "@/infrastructure/utils/util";
import { addSellProductApi } from "@/business/api/modules/intelligent.ts";
import {translateMerType} from "/infrastructure/utils/util";
import useMain from "@/business/store/index";
const Store = store_();
const mine_store = useMine();
// let app = getApp();
const main_store = useMain();

// #ifdef MP
const menu_button_info = uni.getMenuButtonBoundingClientRect()
// #endif

const login_modal = ref()

const sku = ref([]); // 共献值
const isNodes = ref(0); // 控制什么时候开始抓取元素节点, 只要数值改变就重新抓取
const coupon = ref({
  coupon: false, // 属性是否打开
  list: [],
});
const styles = {
  img: 'width:100%;display:block;'
};
const attrTxt = ref('选择'); // 属性页面提示
const attrValue = ref(''); // 已选属性
const animated = ref(false); // 购物车动画
const id = ref(0); // 商品id
const replyCount = ref(0); // 总评论数量
const reply = ref([]); // 评论列表
const storeInfo = ref({
  merchant: {},
  ot_price:0
}); // 商品详情
const productValue = ref([]); // 系统属性
const couponList = ref([]); // 优惠券列表
const cart_num = ref(1); // 购买数量
const isOpen = ref(false); // 是否打开属性组件
const actionSheetHidden = ref(true); // Action Sheet 隐藏状态
const posterImageStatus = ref(false); // 海报产品图状态
const storeImage = ref(''); // 海报产品图路径
const PromotionCode = ref(''); // 二维码图片路径
const canvasStatus = ref(false); // 海报绘图标签
const posterImage = ref(''); // 海报路径
const posterbackgd = ref('https://qnyweb.302010.com/mdd_static/images/posterbackgd.png');
const source = ref('');
const sharePacket = ref({
  isState: true,
});
const circular = ref(false);
const autoplay = ref(false);
const interval = ref(3000);
const duration = ref(500);
const clientHeight = ref('');
const systemStore = ref({});
const replyChance = ref(0);
const CartCount = ref(0);
const isDown = ref(true);
const storeSelfMention = ref(true);
const posters = ref(false);
const weixinStatus = ref(false);
const attr = ref({
	cartAttr: false,
	productAttr: [],
	productSelect: {}
});
const description = ref('');
const navActive = ref(0);
const H5ShareBox = ref(false);
const activity = ref([]);
const retunTop = ref(true);
const navH = ref("");
const navList = ref([]);
const opacity = ref(0);
const scrollY = ref(0);
const topArr = ref([]);
const toView = ref('');
const height = ref(0);
const heightArr = ref([]);
const lock = ref(false);
const scrollTop = ref(0);
const tagStyle = ref({
	img: 'width:100%;display:block;'
});
const showAnimate = ref(true);
const domain = ref(HTTP_REQUEST_URL);
const currSpid = ref('');
const delivery_way = ref()
const codeImg = ref("");
const videoCoverImg = ref("");
const shipping = ref("");
const guarantee = ref([]);
const shippingValue = ref("");
const uniqueValue = ref("");
const priceRule = ref("");
const isCopy = ref(false);
const copyUrl = ref('');
const comboTotal = ref(0);
const comboList = ref([]);
const max_count = ref(0);
const min_count = ref(0);
const pay_limit = ref(1);
const plus_step = ref(1);
const svipData = ref({});
const svipPrice = ref(false);
const specsInfo = ref({
	show: false,
	params: []
});
const welfareTitle = ref();
const currentPage = ref(false);
const homeTop = ref(59);
const header_padding = ref(uni.getSystemInfoSync().statusBarHeight)
const selectNavList = ref([{
		name: '首页',
		icon: 'icon-shouye8',
		url: '/packages/kkyz/views/pages/mall-home/index',
		after: 'dialog_after'
	},
	{
		name: '搜索',
		icon: 'icon-sousuo6',
		url: '/pagesProduct/columnGoods/goods_search/index',
		after: 'dialog_after'
	},
	{
		name: '购物车',
		icon: 'icon-gouwuche7',
		url: '/pagesProduct/order_addcart/order_addcart',
		after: 'dialog_after'
	},
	{
		name: '我的收藏',
		icon: 'icon-shoucang3',
		url: '/packages/mall/views/pages/users/user-goods-collection/index',
		after: 'dialog_after'
	},
	{
		name: '个人中心',
		icon: 'icon-gerenzhongxin1',
		url: '/packages/kkyz/views/pages/mine/personal-center'
	},
]);

const location_info = ref({
  longitude: '',
  latitude: '',
})

const margin_ico_switch = computed(() => {
	return Store.globalData.margin_ico_switch
})
const margin_ico = computed(() => {
	return Store.globalData.margin_ico
})
const hide_mer_status = computed(() => {
	return Store.globalData.hide_mer_status
})
const procudt_increase_status = computed(() => {
	return Store.globalData.procudt_increase_status
})
const site_name = computed(() => {
	return Store.globalData.site_name
})
const share_pic = computed(() => {
	return Store.globalData.share_pic
})
const isLogin = computed(() => {
	return mine_store.isLogin
})
const is_login = ref(false);
const uid = computed(() => {
	return Store.uid
})
const localViewColor = computed(() => {
	return Store.localViewColor
})
const user_code = computed(() => {
	return Store.user_code
})
const is_share_self = ref(false)

// 带货、选品
const is_commerce = ref('')
const is_selection = ref('')
const mall_uid = ref('')

const shareOptions = ref({
  title: '',
  path: '',
  imageUrl: ''
})
const shareTimelineareOptions = ref({
  title: '',
  query: '',
  imageUrl: ''
})

// 动态设置当前页面路径
const setSharePath = () => {
  const pages = getCurrentPages()
  let invite_code = uni.getStorageSync('userInfo').user_code;
  const currentPage = pages[pages.length - 1]
  shareOptions.value.path = `/${currentPage.route}?invite_code=${invite_code}&id=${id.value}${is_commerce.value == 1 || is_selection.value == 1 ? (is_selection.value == 1 ? '&is_selection=1' : '&is_commerce=1') : ''}${mall_uid.value ? `&mall_uid=${mall_uid.value}` : ''}`
  // shareOptions.value.path = `/${currentPage.route}?invite_code=${invite_code}&id=${id.value}${is_commerce.value == 1 ? '&is_commerce=1' : ''}`
  shareOptions.value.imageUrl = storeInfo.value.slider_image[0]
  shareOptions.value.title = storeInfo.value.store_name
}

// 分享给好友
onShareAppMessage(() => {
  setSharePath()
  return shareOptions.value
})

const setShareTimelinePath = () => {
  let invite_code = uni.getStorageSync('userInfo').user_code;
  shareTimelineareOptions.value.query = `invite_code=${invite_code}&id=${id.value}${is_commerce.value == 1 || is_selection.value == 1 ? (is_selection.value == 1 ? '&is_selection=1' : '&is_commerce=1') : ''}${mall_uid.value ? `&mall_uid=${mall_uid.value}` : ''}`
  shareTimelineareOptions.value.imageUrl = storeInfo.value.slider_image[0]
  shareTimelineareOptions.value.title = storeInfo.value.store_name
}

// 分享到朋友圈
onShareTimeline((res) => {
  setShareTimelinePath()
  return shareTimelineareOptions.value
})

const img_tap = ref(false)

function imgtapHandle () {
  img_tap.value = true;
}

function loginStatusChange () {
  // 获取当前页面栈的实例数组
  const pages = getCurrentPages();
  // 获取当前页面实例（数组最后一项）
  const currentPage = pages[pages.length - 1];
  // 获取当前页面路由
  const currentRoute = currentPage.route;
  // 获取当前页面参数对象
  const currentParams = currentPage.options; // 即 url 参数:cite[1]:cite[4]

  // 假设你想跳转到同一个路由，但携带当前所有参数（或者你可以修改参数）
  // 注意：uni.redirectTo 的 url 参数支持相对路径和绝对路径，这里使用绝对路径更可靠
  let targetUrl = '/' + currentRoute; // 构造绝对路径

  // 将当前参数对象拼接成 query 字符串
  if (Object.keys(currentParams).length > 0) {
    const queryString = Object.keys(currentParams)
      .map(key => {
        // 对参数名称和值进行编码，避免特殊字符（如&、=）导致问题
        return key + '=' + currentParams[key];
      })
      .join('&');
    targetUrl += '?' + queryString;
  }
  uni.redirectTo({
		url: targetUrl
	})
}

onLoad(async (options)=>{
	if (options.spid) {
		Store.globalData.spid = options.spid;
		currSpid.value = options.spid
		uni.setStorageSync("ShareCode",  options.spid)
	}
	if (options.invite_code) {
		uni.setStorageSync('invite_code',options.invite_code)
	}
	var pages = getCurrentPages();
	let curPage = pages[pages.length - 1];
	if (pages.length <= 1) {
		retunTop.value = false
	}
  // 带货
  is_commerce.value = options.is_commerce
  // 选品
  is_selection.value = options.is_selection
  mall_uid.value = options.mall_uid
	let curParam = curPage.options || curPage.$page.options;
	source.value = curParam.source;
	navH.value = Store.globalData.navHeight + 10;
	//页面中需要计算的一些值
	// #ifdef APP-PLUS
	homeTop.value = (sysHeight.value + 8)*2;
	// #endif
	// #ifdef H5
	homeTop.value = 10;
	// #endif
	id.value = options.id;
  welfareTitle.value = options.title;
	uni.getSystemInfo({
		success: function(res) {
			height.value = res.windowHeight
			//res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
			navH.value = res.statusBarHeight * (750 / res.windowWidth) + 91;
		},
	});
	//扫码携带参数处理
	// #ifdef MP
	if (options.scene) {
 
		let value = util.getUrlParams(decodeURIComponent(options.scene));
    console.log('扫码进入:',value)
		if (value.id) options.id = value.id;
		//记录推广人uid
		if (value.spid) {
			Store.globalData.spid = value.spid;
			uni.setStorageSync("ShareCode", options.spid)
			currSpid.value = value.spid
		}
    // 带货
    is_commerce.value = translateMerType(value.t) == 'seller' ? 1 : 2
    // 达人带货id
    mall_uid.value = translateMerType(value.t) == 'seller' ? value.mid  : ''
	}
	if (!options.id && !options.scene) {
		return util.Tips({
			title: '缺少参数无法查看商品'
		}, {
			tab: 3,
			url: 1
		});
	} else {
		id.value = options.id
	}
	//记录推广人uid
	if (options.spid) Store.globalData.spid = options.spid;
	// #endif
	// shareScence(currSpid.value, isLogin.value)
	getDiscountsData();
  is_login.value = await checkTokenEventAst()
	if (is_login.value) {
		downloadFilePromotionCode();
		history({
			page:util.getNowUrl()
		}).then(res=>{})
    // 判断是否本人分享进入商详
    is_share_self.value = !options.invite_code || options.invite_code === uni.getStorageSync('userInfo').user_code;
	}
})

const instance = getCurrentInstance();

onMounted(()=>{
	isNodes.value++;
	nextTick(function() {
		// #ifdef MP
		const menuButton = uni.getMenuButtonBoundingClientRect();
		const query = uni.createSelectorQuery().in(instance);
		query
			.select('#home')
			.boundingClientRect(data => {
				homeTop.value = menuButton.top * 2 + menuButton.height - data.height;
			})
			.exec();
		// #endif
	});
})

onShow(()=>{
  if (img_tap.value) {
    img_tap.value = false;
    return
  } else {
  }
  getLocationXY((data) => {
    const { longitude, latitude } = data;
    location_info.value = { longitude, latitude }
    getProductParmasCommon()
  }, (err) => {
    location_info.value = { longitude: '', latitude: '' }
  })
	uni.hideLoading();
  setTimeout(() => {
  getGoodsDetails();
	getDiscountsData();
  }, 0);
})

function call () {
	if(storeInfo.value.merchant.service_phone){
		uni.showModal({
			title: '提示',
			content: '暂无在线客服，确定拨打客服电话:'+storeInfo.value.merchant.service_phone+'吗？',
			success: function(res) {
				if (res.confirm) {
					uni.makePhoneCall({
						// 手机号
						phoneNumber: storeInfo.value.merchant.service_phone,
						// 成功回调
						success: (res) => {},
						// 失败回调
						fail: (res) => {}
					});
				}
			}
		})
	}else{
		return util.Tips({
			title: '暂无可用客服'
		})
	}
}

// 打开地图
function showLocation () {
  if (!storeInfo.value.merchant.long || !storeInfo.value.merchant.lat) {
    return;
  }
  uni.openLocation({
    latitude: parseFloat(storeInfo.value.merchant.lat),
    longitude: parseFloat(storeInfo.value.merchant.long),
    scale: 8,
    geocode: true,
    name: "当前位置",
    address: storeInfo.value.merchant.mer_address,
    success: function (res) {},
  });
}

function getConfig() {
	// 获取配置
	getconfig().then(res => {

	}).catch(err => {})
}

// 到货通知
function arrivalNotice(){
	arrivalNoticeFun();
}

function arrivalNoticeFun(){
	let uniqueValue_ = uniqueValue.value;
	let typeValue = 0;
	// #ifdef MP
	typeValue = 3
	// #endif
	// #ifdef H5
	if(util.isWeixin() === true){
		typeValue = 2
	}else{
		typeValue = 1
	}
	// #endif
	arrivalNoticeApi({ unique: uniqueValue_,type:typeValue,productId: id.value }).then(res => {
		return util.Tips({
			title: res.message
		})
	}).catch(err => {
		//状态异常返回上级页面
		return util.Tips({
			title: err
		})
	})
}

function goProDetail(item) {
	uni.redirectTo({
		url: '/pagesProduct/goods_details/index?id=' + item.product_id
	})
}

//下拉导航页面跳转
function linkPage(url) {
	if (['/packages/kkyz/views/pages/mall-home/index','/packages/kkyz/views/pages/mine/personal-center'].indexOf(url) > -1) {
		uni.switchTab({
			url
		})
	} else {
		uni.navigateTo({
			url
		})
	}
	currentPage.value = false
}

function boxStatus(data) {
	showAnimate.value = data
}

function closeChange() {
	sharePacket.value.isState = true;
}

function showNav () {
	currentPage.value = !currentPage.value;
}

function hideNav() {
	currentPage.value = false;
}

let guartemplate = ref()
let discounts = ref()

/**查看运费说明*/
function showShip() {
	guartemplate.value.showShippingTel();
}
/**查看服务保障*/
function showGuaranee() {
	guartemplate.value.showGuaranteeTel();
}
/*查看套餐详情*/
function openCombo(){
	discounts.value.showPopup(id.value);
}

function seeSpecs() {
	specsInfo.value.show = true;
}

function mySpecs() {
	specsInfo.value.show = false;
}
/*获取套餐列表数据*/
function getDiscountsData(){
	getDiscountsLst({product_id: id.value}).then(res => {
		comboTotal.value = res.data.count;
		res.data.list.forEach((item, index) => {
			item.save_price = 0;
			item.discountsProduct.forEach((v, i) => {
				item.save_price += parseFloat(v.product.ot_price) - parseFloat(v.product.price)
			})
		})
		comboList.value = res.data.list;
	}).catch(err => {

	});
}
/*获取价格说明*/
function getPricrRule() {
	priceRuleApi(storeInfo.value.cate_id).then(res => {
		priceRule.value = res.data
	}).catch(err => {

	});
}
/**
 * 购物车手动填写
 *
 */
function goActivity(e) {
	let item = e;
	if (item.type === "1") {
		uni.navigateTo({
			url: `/packages/mall/views/pages/activity/goods_seckill_details/index?id=${item.id}&time=${item.time}&status=1`
		});
	} else if (item.type === "2") {
		uni.navigateTo({
			url: `/packages/mall/views/pages/activity/goods_bargain_details/index?id=${item.id}&bargain=${uid.value}`
		});
	} else {
		uni.navigateTo({
			url: `/packages/mall/views/pages/activity/goods_combination_details/index?id=${item.id}`
		});
	}
}
function iptCartNum(e) {
	attr.value.productSelect.cart_num = e
}
// 后退
function returns() {
	if(getCurrentPages().length==1){
		// uni.navigateTo({
		// 	url: 'packages/mall/views/pages/index/index'
		// })
    if (is_commerce.value == 1 || is_selection.value == 1) {
      // mer_type：seller（达人带货）merchant（普通商户）
      uni.redirectTo({
        url: `/views/pages/home/store?mer_id=${mall_uid.value}&mer_type=seller`
      });
    } else {
      uni.switchTab({
        url: "/views/pages/home/index",
      });
    }
	}else{
		uni.navigateBack();
	}
}
function isEmptyString(content) {
	return content!='\"\"';
}
// 首页
function goHome() {
	// uni.navigateTo({
	// 	url: '/packages/mall/views/pages/index/index'
	// });
  uni.switchTab({
    url: "/packages/kkyz/views/pages/mall-home/index",
	});
}
// 种草详情
function goPlant(item){
	if(item.is_type == 1){
		uni.navigateTo({
			url: '/packages/mall/views/pages/plantGrass/plant_detail/index?id='+item.community_id
		});
	}else{
		uni.navigateTo({
			//#ifdef APP
			url: '/packages/mall/views/pages/short_video/appSwiper/index?id='+item.community_id+'&tab=1'
			//#endif
			//#ifndef APP
			url: '/packages/mall/views/pages/short_video/nvueSwiper/index?id='+item.community_id+'&tab=1'
			//#endif
		});
	}
}
function tap(index) {
	var id = "past" + index;
	var index = index;
	toView.value = id;
	toView.navActive = index;
	toView.lock = true;
	scrollTop.value = index > 0 ? topArr.value[index] - (Store.globalData.navHeight / 2) : topArr.value[index]
}
function scroll(e) {
	let scrollY_ = e.detail.scrollTop;
	let opacity_ = scrollY_ / 200;
	opacity_ = opacity_ > 1 ? 1 : opacity_;
	showAnimate.value = false
	opacity.value = opacity_
	scrollY.value = scrollY_
	if (lock.value) {
		lock.value = false
		return;
	}
	for (var i = 0; i < topArr.value.length; i++) {
		if (scrollY_ < topArr.value[i] - (Store.globalData.navHeight / 2) + heightArr.value[i]) {
			navActive.value = i
			break
		}
	}
	uni.$emit('scroll');
}
function ChangCouponsClone() {
	coupon.value.coupon = false
}
/**
 * 购物车数量加和数量减
 * @description 增加最小递增量字段，修改时判断是否最小递增量
 *
 */
function ChangeCartNum(changeValue) {
	//changeValue:是否 加|减
	//获取当前变动属性
	let productSelect = productValue.value[attrValue.value];
	//如果没有属性,赋值给商品默认库存
	if (productSelect === undefined && !attr.value.productAttr.length)
		productSelect = attr.value.productSelect;
	//无属性值即库存为0；不存在加减；
	if (productSelect === undefined) return;
	let stock = productSelect.stock || 0;
	let num = attr.value.productSelect;
	if (changeValue) {
		num.cart_num=Number(num.cart_num)+plus_step.value;
		if (num.cart_num > stock) {
			attr.value.productSelect.cart_num = stock
			cart_num.value = stock
		}
		if(num.cart_num > storeInfo.value.once_max_count&&storeInfo.value.once_max_count!=0&&storeInfo.value.pay_limit!=0){
			attr.value.productSelect.cart_num = storeInfo.value.once_max_count
			cart_num.value = storeInfo.value.once_max_count
			return util.Tips({
				title: "单次购买件数不能超过"+storeInfo.value.once_max_count+"件！"
			});
		}
	} else {
		num.cart_num=Number(num.cart_num)-plus_step.value;
		if (num.cart_num < 1) {
			attr.value.productSelect.cart_num = 1
			cart_num.value = 1
		}
		if(num.cart_num < storeInfo.value.once_min_count&&storeInfo.value.once_min_count!=0){
			attr.value.productSelect.cart_num = storeInfo.value.once_min_count
			cart_num.value = storeInfo.value.once_min_count
			return util.Tips({
				title: "单次购买件数不能少于"+storeInfo.value.once_min_count+"件！"
			});
		}
	}
}
function attrVal(val) {
	attr.value.productAttr[val.indexw].index = attr.value.productAttr[val.indexw].attr_values[val.indexn]
	getProductDetail(id.value).then(res=>{
	})
}
/**
 * 属性变动赋值
 *
 */
function ChangeAttr(res) {

	let productSelect = productValue.value[res];
    console.log(productSelect)
	if(productSelect){
	uniqueValue.value = productSelect.unique
	attr.value.productSelect.contribution = productSelect.contribution
}
	if (productSelect && productSelect.stock > 0) {
		attr.value.productSelect.image = productSelect.image ? productSelect.image : storeInfo.value.image
		attr.value.productSelect.price = productSelect.price
		attr.value.productSelect.svip_price = productSelect.svip_price
		attr.value.productSelect.stock = productSelect.stock
    attr.value.productSelect.ticket = productSelect.ticket
		attr.value.productSelect.unique = productSelect.unique
		uniqueValue.value = productSelect.unique
    attr.value.productSelect.consume_points = productSelect?.consume_points
    attr.value.productSelect.super_integral = productSelect?.super_integral
		//设置购买递增量
		plus_step.value = productSelect.step_num && productSelect.step_num > 1 ? productSelect.step_num : 1
		if (productSelect.stock == 0) {
			attr.value.productSelect.cart_num = 0
		} else {
			attr.value.productSelect.cart_num = min_count.value || 1
		}
		attrValue.value = res
		attrTxt.value = "选择"
	}
		else {
		attr.value.productSelect.image = productSelect.image
		attr.value.productSelect.price = productSelect.price
		attr.value.productSelect.svip_price = productSelect.svip_price
		attr.value.productSelect.stock = 0
		attr.value.productSelect.unique = ""
		attr.value.productSelect.cart_num = 0

		//设置购买递增量
		plus_step.value = productSelect.step_num && productSelect.step_num > 1 ? productSelect.step_num : 1
		attrValue.value = res
		attrTxt.value = "选择"
	}
}
/**
 * 领取完毕移除当前页面领取过的优惠券展示
 */
function ChangCoupons(e) {
	let coupon = e;
	let couponList_ = util.ArrayRemove(couponList.value, 'id', coupon.id);
	couponList.value = couponList_
	getCouponList();
}

function setClientHeight() {
	let view = uni.createSelectorQuery().in(instance).select("#list0");
	view.fields({
		size: true,
	}, data => {
		clientHeight.value = data.height + 20
	}).exec();
}

function getProductParmasCommon () {
  getProductParmas(id.value,{ long: location_info.value.longitude || '', lat: location_info.value.latitude || '' }).then((res_) => {
			description.value = res_.data.content
			if (description.value && description.value.type == 0) {
				// 改版(富文本改为图片展示)
			}
			guarantee.value = res_.data.guarantee ? res_.data.guarantee : []
			shippingValue.value = res_.data.temp ? res_.data.temp.name : ''
			shipping.value = res_.data.temp ? res_.data.temp.info : ''
			specsInfo.value.params = res_.data.params
			storeInfo.value.merchant = res_.data.merchant
			storeInfo.value.spu_id = res_.data.spu_id
			storeInfo.value.community = res_.data.community
			storeInfo.value.atmosphere_pic = res_.data.atmosphere_pic
			storeInfo.value.top_pid = res_.data.top_pid
			storeInfo.value.top_num = res_.data.top_num
			storeInfo.value.top_name = res_.data.top_name
		})
}

/**
 * 获取产品详情
 *
 */
function getGoodsDetails() {
	uni.showLoading({
		title: '加载中',
		mask: true
	});
	getProductDetail(id.value).then(async (res) => {
    uni.hideLoading();
		let storeInfo_ = res.data;
    // 如果存在视频，第一张轮播图作为视频封面
		if (storeInfo_.video_link && storeInfo_.slider_image.length > 1) {
			videoCoverImg.value = storeInfo_.slider_image[0]
			// storeInfo_.slider_image.splice(0, 1)
		} else if (storeInfo_.video_link && storeInfo_.slider_image.length === 1) {
			videoCoverImg.value = storeInfo_.slider_image[0]
		}
		storeInfo.value = storeInfo_
    delivery_way.value = res.data.delivery_way;
		reply.value = res.data.topReply ? [res.data.topReply] : []
		replyCount.value = res.data.replayData && res.data.replayData.sales
		replyChance.value = res.data.replayData && res.data.replayData.rate
		attr.value.productAttr = res.data.attr
		productValue.value = res.data.sku
		sharePacket.value.priceName = res.data.priceName
		sharePacket.value.max = res.data.max_extension
		sharePacket.value.min = res.data.min_extension
		systemStore.value = res.data.system_store
		storeSelfMention.value = res.data.store_self_mention
		PromotionCode.value = storeInfo_.code_base
		activity.value = res.data.activity ? res.data.activity : []
		max_count.value = res.data.once_max_count
		pay_limit.value = res.data.pay_limit
		min_count.value = res.data.once_min_count
		svipData.value = res.data.show_svip_info || null
		svipPrice.value = res.data.show_svip_info && res.data.show_svip_info.show_svip_price || false
    uni.$emit('changeAutoPro',storeInfo.value)
		uni.setNavigationBarTitle({
			title: storeInfo_.store_name.substring(0, 7) + "..."
		})
		storeImage.value = storeInfo.value.image
		
    getProductParmasCommon()

    is_login.value = await checkTokenEventAst()

		if (is_login.value) {
			downloadFilePromotionCode();
			getCartCount();
		};
		setTimeout(function() {
			infoScroll();
		}, 500);
		DefaultSelect();
		getPricrRule(storeInfo.value.cate_id)
		nextTick(function() {
			getCouponList();
		})
	}).catch(err => {
		//状态异常返回上级页面
		return util.Tips({
			title: err
		}, {
			tab: 3,
			url: 1
		});
	})
}

function infoScroll() {
	let topArr_ = [],heightArr_ = [];
	for (let i = 0; i < navList.value.length; i++) {
		//获取元素所在位置
		let query = uni.createSelectorQuery().in(instance);
		let idView = "#past" + i;
		query.select(idView).boundingClientRect();
		query.exec(function(res) {
			let top = res[0].top;
			let height = res[0].height;
			topArr_.push(top);
			heightArr_.push(height);
			topArr.value = topArr_
			heightArr.value = heightArr_

		});
	};
}
/**
 * 默认选中属性
 *
 */
function DefaultSelect() {
	let productAttr = attr.value.productAttr;
	let value = [];
	let arr = []
	let unSortArr = []
	for (var key in productValue.value) {
		if (productValue.value[key].stock > 0) {
			value = attr.value.productAttr.length ? key.split(",") : [];
			break;
		}
	}
	for (let i = 0; i < productAttr.length; i++) {
		productAttr[i].index = value[i]
	}
	//sort();排序函数:数字-英文-汉字；
	let productSelect = productValue.value[value.join(",")];
	attr.value.productSelect.contribution = productSelect?.contribution
	attr.value.productSelect.ticket = productSelect?.ticket
  attr.value.productSelect.consume_points = productSelect?.consume_points
  attr.value.productSelect.super_integral = productSelect?.super_integral
	if (productSelect && productAttr.length) {
		attr.value.productSelect.store_name = storeInfo.value.store_name
		attr.value.productSelect.image = productSelect.image ? productSelect.image : storeInfo.value.image
		attr.value.productSelect.price = productSelect.price
		attr.value.productSelect.svip_price = productSelect.svip_price
		attr.value.productSelect.stock = productSelect.stock
		attr.value.productSelect.unique = productSelect.unique
		uniqueValue.value = productSelect.unique
		//设置购买递增量
		plus_step.value = productSelect.step_num&&productSelect.step_num>1?productSelect.step_num:1
		attrValue.value = value.join(",")
		attrTxt.value = "选择"
		if (productSelect.stock == 0) {
			attr.value.productSelect.cart_num = 0
		} else {
			attr.value.productSelect.cart_num = min_count.value || 1
		}
	} else if (!productSelect && productAttr.length) {
		attr.value.productSelect.store_name = storeInfo.value.store_name
		attr.value.productSelect.image = storeInfo.value.image
		attr.value.productSelect.price = storeInfo.value.price
		attr.value.productSelect.svip_price = storeInfo.value.svip_price
		attr.value.productSelect.stock = 0
		attr.value.productSelect.unique = ""
		uniqueValue.value = ""
		attr.value.productSelect.cart_num = 0
		attrValue.value = ""
		attrTxt.value = "选择"
	} else if (!productSelect && !productAttr.length) {

		attr.value.productSelect.store_name = storeInfo.value.store_name
		attr.value.productSelect.image = storeInfo.value.image
		attr.value.productSelect.price = storeInfo.value.price
		attr.value.productSelect.svip_price = storeInfo.value.svip_price
		attr.value.productSelect.stock = storeInfo.value.stock
		attr.value.productSelect.unique = storeInfo.value.unique || ""

		uniqueValue.value = storeInfo.value.unique || ""
		attr.value.productSelect.cart_num = 1
		attrValue.value = ""
		attrTxt.value = "选择"
	} else if (productSelect && !productAttr.length) {
		attr.value.productSelect.store_name = storeInfo.value.store_name
		attr.value.productSelect.image = productSelect.image
		attr.value.productSelect.price = productSelect.price
		attr.value.productSelect.svip_price = productSelect.svip_price
		attr.value.productSelect.stock = productSelect.stock
		attr.value.productSelect.unique = productSelect.unique
		uniqueValue.value = productSelect.unique
		attrValue.value = value.join(",")
		attrTxt.value = "选择"
		if (productSelect.stock == 0) {
			attr.value.productSelect.cart_num = 0
		} else {
			attr.value.productSelect.cart_num = min_count.value || 1
		}
	}
}
/**
 * 获取优惠券
 *
 */
function getCouponList() {
  console.log(12121212121212);
	let goodsArr = []
	let couponList = [];
	let activeList = []
	getCoupons({
		ids: id.value
	}).then(res => {
		goodsArr = res.data
		getShopCoupons(storeInfo.value.mer_id).then(({
			data
		}) => {
			couponList = goodsArr.concat(data)
			coupon.value.list = couponList
			for (let i = 0; i < couponList.length; i++) {
				if (!couponList[i].issue && activeList.length < 2) {
					activeList.push(couponList[i]);
				}
			}
			couponList.value = activeList
		})
	});
}
function ChangCouponsUseState(index) {
	coupon.value.coupon = false
}
/**
 *
 *
 * 收藏商品
 */
function setCollect() {
	if (!is_login.value) {
		// toLogin()
    login_modal.value.open()
	} else {
		if (storeInfo.value.isRelation) {
			homeApi.collectDel({
				type: 0,
				type_id: id.value
			}).then(res => {
				storeInfo.value.isRelation = !storeInfo.value.isRelation
			})
		} else {
			homeApi.collectAdd({
				type_id: id.value,
				type: 0
			}).then(res => {
				storeInfo.value.isRelation = !storeInfo.value.isRelation
			})
		}
	}
}
/**
 * 打开属性插件
 */
function selecAttr() {
	attr.value.cartAttr = true
	isOpen.value = true
}
/**
 * 打开优惠券插件
 */
function couponTap() {
	if (!is_login.value) {
		// toLogin()
    login_modal.value.open()
	} else {
		coupon.value.coupon = true
	}
}
function goCustomer() {

  if(storeInfo.value.zone_type == 'welfare' || storeInfo.value.zone_type == 'welfare_self'){
    console.log(storeInfo.value)
    call()
  } else if(!is_login.value) {
		// toLogin()
    login_modal.value.open()
	} else {
		uni.navigateTo({
			url: `/pagesProduct/customer_list/chat?mer_id=${storeInfo.value.mer_id}&uid=${uid.value}&productId=${id.value}`
		});
	}
}
function onMyEvent() {
	attr.value.cartAttr = false
	isOpen.value = false
}
/**
 * 打开属性加入购物车
 *
 */
function joinCart(e) {
	if(storeInfo.value.sc_product_id>0) return util.Tips({
		title:"该商品不支持加入购物车"
	})
	//是否登录
	if (!is_login.value) {
		// toLogin()
    login_modal.value.open()
	} else {
		goCat();
	}
}
/*
* 加入购物车
*/
function goCat(news) {
	let productSelect = productValue.value[attrValue.value];
	//打开属性
	if (attrValue.value) {
		//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
		attr.value.cartAttr = !isOpen.value ? true : false;
		// if(!that.isOpen)that.attr.cartAttr = true
	} else {
		if (isOpen.value) attr.value.cartAttr = true;
		else
			attr.value.cartAttr = !attr.value.cartAttr;
	}
	//只有关闭属性弹窗时进行加入购物车
	if (attr.value.cartAttr === true && isOpen.value === false)
		return (isOpen.value = true);
	isOpen.value = attr.value.cartAttr = true;
	//如果有属性,没有选择,提示用户选择
	if (
		attr.value.productAttr.length &&
		isOpen.value === true &&
		productSelect.stock == 0
	)
		return util.Tips({
			title: "产品库存不足，请选择其它"
		});
	if (attr.value.productSelect.cart_num == 0) {
		return util.Tips({
			title: '购买个数不能为0！'
		})
	}
	let q = {
		is_new: news === undefined ? 0 : 1,
		product_id: id.value,
		cart_num: attr.value.productSelect.cart_num,
		product_attr_unique: attr.value.productSelect !== undefined ? attr.value.productSelect.unique : "",
		source: source.value,
		product_type: 0,
		spread_id: currSpid.value,
		expert_sell_uid: mall_uid.value
	};
	postCartAdd(q)
		.then(function(res) {
			isOpen.value = attr.value.cartAttr = false;
			let cartId = res.data.cart_id
			if (news) {
				uni.navigateTo({
					url: '/pagesProduct/order_confirm/index?cartId=' + cartId
				});
			} else {
				util.Tips({
					title: "添加购物车成功",
					success: () => {
						getCartCount(true);
					}
				});
			}
		})
		.catch(res => {
			return util.Tips({
				title: res
			});
		});
}
/**
 * 获取购物车数量
 * @param boolean 是否展示购物车动画和重置属性
 */
function getCartCount(isAnima) {
	if (is_login.value) {
		getCartCounts().then(res => {
			CartCount.value = res.data[0].count;
			//加入购物车后重置属性
			if (isAnima) {
				animated.value = true;
				setTimeout(function() {
					animated.value = false;
				}, 500);
			}
		});
	}
}
// 带货达人带货
async function commerceHandle () {
  try {
        await addSellProductApi({ product_id: id.value });
        uni.showToast({
            icon: 'none',
            title: '带货成功'
        })
        setTimeout(() => {
          uni.redirectTo({
              url: `/pageIntelligent/sell-goods/list-management`
          });
        }, 500);
    } catch (error) {}
}
/**
 * 立即购买
 */
function goBuy(e) {
	if (!is_login.value) {
		// toLogin()
    login_modal.value.open()
	} else {
		goCat(true);
	}
}
/**
 * 分享打开
 *
 */
function listenerActionSheet() {
	if (!is_login.value) {
		// toLogin()
    login_modal.value.open()
	} else {
		// #ifdef H5
		if (util.isWeixin() === true) {
			weixinStatus.value = true;
		}
		// #endif
		// posters.value = true; //控制分享弹框开关，暂时关闭
    // #ifndef H5
      let routes = getCurrentPages();
    	let curRoute = routes[routes.length - 1].route
      let url = '/' + curRoute + `?spid=` + uid.value +'&id=' + id.value
      shareH5(url)
    // #endif

	}
}
// 分享关闭
function listenerActionClose() {
	posters.value = false;
	currentPage.value = false;
}
//隐藏海报
function posterImageClose() {
	posterImageStatus.value = false
}
//替换安全域名
function setDomain(url) {
	url = url ? url.toString() : '';
	//本地调试打开,生产请注销
	if (url.indexOf("https://") > -1) return url;
	else return url.replace('http://', 'https://');
}
/**
 * 获取产品分销二维码
 * @param function successFn 下载完成回调
 *
 */
function downloadFilePromotionCode(successFn) {
	let type;
	// #ifndef MP
	type = 'wechat'
	// #endif
	// #ifdef MP
	type = 'routine'
	// #endif
	// getProductCode(id.value, {
	// 	type: type,
	// 	product_type: 0
	// }).then(async res => {
	// 	console.log('res.data.url',res.data.url)
	// 	codeImg.value = res.data.url
	// 	isDown.value = false
	// }).catch(err => {
	// 	isDown.value = false
	// 	PromotionCode.value = ''
	// });
}
// 小程序关闭分享弹窗；
function goFriend() {
	posters.value = false;
	currentPage.value = false;
}
/**
 * 生成海报
 */
 async function goPoster() {
	if (posterImage.value) {
		posterImageStatus.value = true
		posters.value = false
		return
	}
	let arr2
	posters.value = false;
	canvasStatus.value = true
	uni.showLoading({
		title: '海报生成中',
		mask: true
	});
	// #ifdef MP || APP-PLUS
	arr2 = [posterbackgd.value, await fileStoreImage(storeImage.value), await fileStoreImage(
		codeImg.value), await fileStoreImage(share_pic.value)];
	// #endif
	// #ifdef H5
  console.log(codeImg.value)
	arr2 = [posterbackgd.value, await imgToBase_(storeImage.value), await imgToBase_(codeImg.value), await imgToBase_(share_pic.value)];
	// #endif
	//生成推广海报
	util.goodsPosterCanvas(arr2, storeInfo.value.store_name, storeInfo.value.price, site_name.value, storeInfo.value.ot_price, function(tempFilePath) {
		posterImage.value = tempFilePath
		posterImageStatus.value = true
		actionSheetHidden.value = !actionSheetHidden.value
		canvasStatus.value = false
	}, (err) => {
		canvasStatus.value = false
	});
}
//图片转符合安全域名路径
function fileStoreImage(url) {
	// #ifdef MP  || APP-PLUS
	let ishttps = url.split('//')[0] == 'https:'
	if (!ishttps) {
		url = 'https://'+url.split('//')[1]
	}
	// #endif
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: url,
			success: function(res) {
				resolve(res.tempFilePath);
			},
			fail: function() {
				return util.Tips({
					title: ''
				});
			}
		});
	})
}
/*
* 保存到手机相册
*/
function savePosterPath() {
	// #ifdef MP
	uni.getSetting({
		success(res) {
			if (!res.authSetting['scope.writePhotosAlbum']) {
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success() {
						uni.saveImageToPhotosAlbum({
							filePath: posterImage.value,
							success: function(res) {
								posterImageClose();
								util.Tips({
									title: '保存成功',
									icon: 'success'
								});
							},
							fail: function(res) {
								util.Tips({
									title: '保存失败'
								});
							}
						})
					}
				})
			} else {
				uni.saveImageToPhotosAlbum({
					filePath: posterImage.value,
					success: function(res) {
						posterImageClose();
						util.Tips({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: function(res) {
						util.Tips({
							title: '保存失败'
						});
					},
				})
			}
		}
	})
	// #endif
	// #ifdef APP-PLUS
	uni.saveImageToPhotosAlbum({
		filePath: posterImage.value,
		success: function(res) {
			posterImageClose();
			util.Tips({
				title: '保存成功',
				icon: 'success'
			});
		},
		fail: function(res) {
			util.Tips({
				title: '保存失败'
			});
		},
	})
	// #endif
	// #ifdef H5
	uni.previewImage({
		urls: [posterImage.value]
	});
	// #endif
}
async function imgToBase_(url) {
	let res = await imgToBase({
		image: url
	})
	return res.data.image
}
//复制口令
function copyPwd(){
	copyPasswordApi({
		id: id.value,
		product_type: 0
	}).then(async res => {
		copyUrl.value = res.data.str;
		posters.value = false
		isCopy.value = true;
	})
}
function closeCopy(){
	isCopy.value = false
}
// APP分享
function appShare(scene){
	uni.showLoading({
		title: '加载中',
		mask: true
	});
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
	uni.share({
		provider: "weixin",
		scene: scene,
		type: 0,
		href: `${HTTP_REQUEST_URL}${curRoute}&spid=${uid.value}`,
		title: storeInfo.value.store_name,
		summary: storeInfo.value.store_info,
		imageUrl: storeInfo.value.image,
		success: function(res) {
			uni.showToast({
				title: '分享成功',
				icon: 'success'
			})
			posters.value = false;
			uni.hideLoading();
		},
		fail: function(err) {
			uni.showToast({
				title: '分享失败',
				icon: 'none',
				duration: 2000
			})
			posters.value = false;
			uni.hideLoading();
		}
	});
}

function handleItemClick(e) {
  console.log("e---->", e)
  const nodeName = e.detail.node.name.toLowerCase();
  if (nodeName === "img") {
    const imgSrc = e.detail.node.attrs.src;
    previewImage([imgSrc]);
  }
}
function previewImage(list, index) {
  imgtapHandle();
  uni.previewImage({
    current: index || 0, // 当前预览的图片地址
    urls: list, // 预览的图片地址数组
  });
}
</script>
<style lang="scss" scoped>
.ml8 {
  top: 2rpx;
}
.activity_pin {
  width: auto;
  height: 44rpx;
  line-height: 44rpx;
  background: linear-gradient(
    90deg,
    rgba(233, 51, 35, 1) 0%,
    rgba(250, 101, 20, 1) 100%
  );
  opacity: 1;
  border-radius: 22rpx;
  padding: 0 15rpx;
  margin-left: 19rpx;
}
.activity_miao {
  width: auto;
  height: 44rpx;
  line-height: 44rpx;
  padding: 0 15rpx;
  background: linear-gradient(
    90deg,
    rgba(250, 102, 24, 1) 0%,
    rgba(254, 161, 15, 1) 100%
  );
  opacity: 1;
  border-radius: 22rpx;
  margin-left: 19rpx;
}
.iconfonts {
  color: #fff !important;
  font-size: 28rpx;
}
.activity_title {
  font-size: 24rpx;
  color: #fff;
}
.activity_kan {
  width: auto;
  height: 44rpx;
  line-height: 44rpx;
  padding: 0 15rpx;
  background: linear-gradient(
    90deg,
    rgba(254, 159, 15, 1) 0%,
    rgba(254, 178, 15, 1) 100%
  );
  opacity: 1;
  border-radius: 22rpx;
  margin-left: 19rpx;
}
.t-color {
  // color: #00DCEE;
  // color: var(--view-bgColor);
  font-weight: 400;
  font-size: 28rpx;
  color: #D3D3D3;
}
.p-color {
  color: var(--view-bgColor);
}
.bt-color {
  background-color: #ffffff;
  border: 1px solid var(--view-bgColor);
  color: var(--view-bgColor);
}
.head-bar {
  background: #fff;
}
.generate-posters {
  width: 100%;
  height: 170rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 388;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  border-top: 1px solid #eee;
}
.generate-posters.on {
  transform: translate3d(0, 0, 0);
}
.generate-posters .item {
  /* #ifdef H5 */
  flex: 50%;
  /* #endif */
  /* #ifndef H5 */
  flex: 33.33%;
  /* #endif */
  text-align: center;
  font-size: 30rpx;
  &.item3 {
    flex: 33.33%;
  }
}
.generate-posters .item .iconfont {
  font-size: 80rpx;
  color: #5eae72;
}
.generate-posters .item .iconfont.icon-haibao {
  color: #5391f1;
}
.generate-posters .item .iconfont.icon-fuzhikouling1 {
  color: #fbb324;
}
.product-con {
  background: #f3f8fb;
}
.product-con .footer {
  padding: 0 20rpx 0 30rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  height: 106rpx;
  height: calc(106rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
  height: calc(106rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
  background-color: #fff;
  z-index: 277;
  border-top: 1px solid #f0f0f0;
}
.product-con .footer .item {
  font-size: 18rpx;
  color: #666;
  text-align: center;
  margin-right: 34rpx;
  .footer-icon {
    width: 48rpx;
    height: 48rpx;
  }
}
.product-con .attribute .atterTxt {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  width: 400rpx;
}
.product-con .attribute .params {
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #282828;
  &:nth-child(2) {
    margin-right: 0;
    color: #282828;
  }
}
.product-con .attribute .atterTxt1 {
  color: #282828;
  &.hasAttr {
    &:after {
      content: "";
      display: inline-block;
      position: relative;
      top: -6rpx;
      margin: 0 6rpx;
      width: 5rpx;
      height: 5rpx;
      background-color: #282828;
      border-radius: 100%;
    }
    &:last-child {
      &:after {
        display: none;
      }
    }
  }
}
.product-con .wrapper .coupon .hide {
  width: 625rpx;
}
.product-con .wrapper .coupon .activity {
  border: 1px solid var(--view-bgColor);
  color: var(--view-bgColor);
  &::before,
  &::after {
    border: 1px solid var(--view-bgColor);
  }
  &::before {
    border-left-color: #ffffff;
  }
  &::after {
    border-right-color: #ffffff;
  }
}
.product-con .guaranteeAttr {
  display: inline-block;
  width: 560rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.product-con .footer .item .iconfont {
  text-align: center;
  font-size: 40rpx;
}
.product-con .wrapper .introduce {
  color: #111111;
  font-size: 32rpx;
  font-weight: 700;
  margin-top: 16rpx;
  padding-left: 0;
  margin-bottom: 16rpx;
  padding-right: 0;
  &.atmosphere {
    // padding: 20rpx 94rpx 0 30rpx;
    margin: 0;
    .fenxiang_btn {
      top: 8rpx;
      right: 30rpx;
    }
  }
  .font-bg-red {
    position: relative;
    /* #ifdef H5 */
    top: -2rpx;
    /* #endif */
    /* #ifndef H5 */
    top: -4rpx;
    /* #endif */
  }
}

.wrapper {
  // padding: 24rpx;
  // background: #f3f8fb;
  background: #F9F9F9;
  margin-bottom: 0;
  margin-top: 0rpx;
  width: 100%;
  position: relative;
  .wrapper-mask {
    background: #F9F9F9;
    width: 100%;
    height: 32rpx;
    position: absolute;
    left: 0;
    top: -32rpx;
    border-radius: 30rpx 30rpx 0 0;
  }
  .address-info {
    border-top: 2rpx solid #ECECEC;
    padding-top: 20rpx;
    .address-info-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      .address {
        font-weight: 400;
        font-size: 24rpx;
        color: #000000;
        margin-bottom: 8rpx
      }
      .dist {
        font-weight: 400;
        font-size: 24rpx;
        color: #A5A5A5;
      }
    }
    .address-icon {
      width: 52rpx;
      height: 52rpx;
      border-radius: 50%;
      margin-left: 8rpx;
    }
  }
}
.product-con .footer .item .iconfont.icon-shoucang1 {
  color: var(--view-bgColor);
}
.integral_count {
  // padding: 0 30rpx;
  margin-top: 12rpx;
}
.product-con .integral,
.product-con .integral1 {
  color: #FC5555;
  font-size: 20rpx;
  font-weight: 500;
  background-color: #FFEDED;
  // border: 1px solid #ff4d25;
  height: 32rpx;
  line-height: 32rpx;
  padding: 2rpx 9rpx;
  margin-right: 16rpx;
  border-radius: 22rpx;
  margin-top: 4rpx;
  margin-bottom: 4rpx;
  &:last-child {
    margin-right: 0;
  }
}
.product-con .integral1 {
  color: #ff4d25;
  background-color: #ffffff;
}
.product-con .footer .item .iconfont.icon-gouwuche1 {
  font-size: 40rpx;
  position: relative;
}
.product-con .footer .item .cart-wrap {
  font-size: 40rpx;
  position: relative;
  .footer-icon {
    width: 48rpx;
    height: 48rpx;
  }
}
.product-con .footer .item .iconfont.icon-gouwuche1 .num {
  color: #fff;
  position: absolute;
  font-size: 18rpx;
  height: 30rpx;
  border-radius: 200rpx;
  padding: 0 8rpx;
  box-sizing: border-box;
  top: -10rpx;
  right: -10rpx;
  background-color: var(--view-bgColor);
  // background-color: #00DCEE;
  min-width: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-con .footer .item .cart-wrap .num {
  color: #fff;
  position: absolute;
  font-size: 18rpx;
  height: 30rpx;
  border-radius: 200rpx;
  padding: 0 8rpx;
  box-sizing: border-box;
  top: -10rpx;
  right: -10rpx;
  background-color: #FC5555;
  // background-color: #00DCEE;
  min-width: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-con .footer .bnt {
  width: 368rpx;
  height: 90rpx;
  &.c-bnt {
    width: 700rpx;
  }
}
.product-con .footer .bnt .bnts {
  width: 184rpx;
  text-align: center;
  line-height: 90rpx;
  height: 90rpx;
  color: #fff;
  font-size: 28rpx;
  &.sold_out {
    width: 368rpx;
    border-radius: 50rpx;
  }
  &.virtual_buy {
    width: 368rpx;
    border-radius: 50rpx;
  }
  &.c-btn {
    width: 700rpx;
    border-radius: 50rpx;
  }
}
.product-con .footer .bnt .joinCart {
  //   border-radius: 50rpx 0 0 50rpx;
  //   background-image: linear-gradient(
  //     90deg,
  //     var(--view-bntColor11) 0%,
  //     var(--view-bntColor12) 100%
  //   );
  //   &.disabled {
  //     background: #bbb;
  //   }
  font-weight: 500;
  font-size: 30rpx;
  color: #FA6262;
  border: 2rpx solid #FA6262;
  border-radius: 8rpx 0 0 8rpx;
}
.product-con .footer .bnt .buy {
  font-weight: 500;
  font-size: 30rpx;
  color: #FFFFFF;
  background: #FA6262;
  border-radius: 0 8rpx 8rpx 0;
}
.product-con .footer .bnt .buy[disabled] {
  background: #bbb;
}
.product-con .superior {
  background-color: #fff;
  margin-top: 20rpx;
  padding-bottom: 10rpx;
}
.product-con .superior .title {
  height: 98rpx;
}
.product-con .superior .title image {
  width: 30rpx;
  height: 30rpx;
}
.product-con .superior .title .titleTxt {
  margin: 0 20rpx;
  font-size: 30rpx;
  background-image: linear-gradient(to right, #f57a37 0%, #f21b07 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.product-con .superior .slider-banner {
  width: 690rpx;
  margin: 0 auto;
  position: relative;
}
.product-con .superior .slider-banner swiper {
  height: 100%;
  width: 100%;
}
.product-con .superior .slider-banner swiper-item {
  height: 100%;
}
.product-con .superior .slider-banner .list {
  width: 100%;
}
.product-con .superior .slider-banner .list .item {
  width: 215rpx;
  margin: 0 22rpx 30rpx 0;
  font-size: 26rpx;
}
.product-con .superior .slider-banner .list .item:nth-of-type(3n) {
  margin-right: 0;
}
.product-con .superior .slider-banner .list .item .pictrue {
  position: relative;
  width: 100%;
  height: 215rpx;
}
.product-con .superior .slider-banner .list .item .pictrue image {
  width: 100%;
  height: 100%;
  border-radius: 6rpx;
}
.product-con .superior .slider-banner .list .item .name {
  color: #282828;
  margin-top: 12rpx;
}
.product-con .superior .slider-banner .swiper-pagination-bullet {
  background-color: #999;
}
.product-con .superior .slider-banner .swiper-pagination-bullet-active {
  background-color: #e93323;
}
.svipCon {
  height: 64rpx;
  padding: 0 20rpx;
  background: #fae3bb;
  font-size: 24rpx;
  color: #b37400;
  border-radius: 10rpx;
  image {
    width: 38rpx;
    height: 38rpx;
    margin-right: 20rpx;
  }
}
.svipCon .svipBtn {
  font-size: 22rpx;
  .iconfont {
    font-size: 18rpx;
    margin-left: 4rpx;
  }
}
button {
  padding: 0;
  margin: 0;
  line-height: normal;
  background-color: #fff;
}
button::after {
  border: 0;
}
action-sheet-item {
  padding: 0;
  height: 240rpx;
  align-items: center;
  display: flex;
}
.contact {
  font-size: 16px;
  width: 50%;
  background-color: #fff;
  padding: 8rpx 0;
  border-radius: 0;
  margin: 0;
  line-height: 2;
}
.contact::after {
  border: none;
}
.action-sheet {
  font-size: 17px;
  line-height: 1.8;
  width: 50%;
  position: absolute;
  top: 0;
  right: 0;
  padding: 25rpx 0;
}
.canvas {
  z-index: 300;
  width: 750px;
  height: 1190px;
}
.poster-pop {
  width: 600rpx;
  height: 897rpx;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 399;
  top: 50%;
  margin-top: -500rpx;
}
.poster-pop image {
  width: 100%;
  height: 100%;
  display: block;
}
.poster-pop .close {
  width: 46rpx;
  height: 75rpx;
  position: fixed;
  right: 0;
  top: -73rpx;
  display: block;
}
.poster-pop .save-poster {
  background-color: #00dcee;
  font-size: 22rpx;
  color: #fff;
  text-align: center;
  height: 76rpx;
  line-height: 76rpx;
  width: 100%;
  border-radius: 43rpx;
  margin-top: 20rpx;
}
.poster-pop .keep {
  color: #fff;
  text-align: center;
  font-size: 25rpx;
  margin-top: 10rpx;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
}
.pictrue_log {
  width: 80upx;
  height: 40upx;
  border-radius: 6upx 0 12upx 0;
  line-height: 40upx;
  font-size: 24upx;
}
.pictrue_log_class {
  z-index: 3;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(246, 122, 56, 1)),
    to(rgba(241, 27, 9, 1))
  );
  background: linear-gradient(
    90deg,
    rgba(246, 122, 56, 1) 0%,
    rgba(241, 27, 9, 1) 100%
  );
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  text-align: center;
}
.navbar .header {
  height: 96rpx;
  font-size: 30rpx;
  color: #050505;
  background-color: #fff;
  /* #ifdef MP */
  padding-right: 95rpx;
  /* #endif */
}
.navbar .header .item {
  position: relative;
  margin: 0 25rpx;
}
.navbar .header .item.on:before {
  position: absolute;
  width: 60rpx;
  height: 5rpx;
  background-repeat: no-repeat;
  content: "";
  background-image: linear-gradient(to right, #ff3366 0%, #ff6533 100%);
  bottom: -10rpx;
  left: 50%;
  margin-left: -28rpx;
}
.navbar {
  position: fixed;
  background-color: #fff;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
}
.navbar .navbarH {
  position: relative;
}
.navbar .navbarH .navbarCon {
  position: absolute;
  bottom: 0;
  height: 100rpx;
  width: 100%;
}
.share-box {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  image {
    width: 100%;
    height: 100%;
  }
}
::v-deep.store-wrapper {
  margin-top: 20rpx;
  background-color: #fff;
  .store-hd {
    padding: 24rpx 32rpx 20rpx;
    .store-info {
      position: relative;
      display: flex;
      .store-margin {
        width: 24rpx;
        height: 26rpx;
        margin-left: 10rpx;
      }
      .logo {
        width: 80rpx;
        height: 80rpx;
        image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 40rpx;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20rpx;
        .nape {
          display: flex;
          align-items: center;
          .name {
            font-size: 28rpx;
            max-width: 380rpx;
            font-weight: 600;
            color: #000000;
          }
        }
        .txt {
          margin-top: 8rpx;
          font-size: 22rpx;
          font-weight: 400;
          color: #A5A5A5;
        }
      }
      .link {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 114rpx;
        height: 50rpx;
        background: #1B9AFF;
        border-radius: 30rpx;
        border-radius: 25rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #FFFFFF;
        text-decoration: none;
      }
    }
    .score-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;
      background: #F9F9F9;
      border-radius: 16rpx;
      height: 66rpx;
      padding: 0 20rpx;
      .item {
        font-size: 24rpx;
        font-weight: 400;
        color: #A5A5A5;
        text {
          margin-left: 8rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #000000;
        }
      }
    }
  }
  .con-box {
    padding: 0rpx 20rpx 28rpx;
    .title {
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
      margin-bottom: 12rpx;
      padding: 0 12rpx;
    }
    .good-list {
      margin-top: 12rpx;
      .good-item {
        background: #FFFFFF;
        box-shadow: 0 0 20rpx 12rpx #eeeeee80;
        border-radius: 16rpx;
        margin: 0 0 16rpx;
        padding: 16rpx;
        image,
        uni-image,
        .easy-loadimage {
          width: 168rpx;
          height: 168rpx;
          border-radius: 16rpx;
          display: inline-block;
          margin-right: 16rpx;
        }
        .good-info {
          .title {
            font-size: 28rpx;
            font-weight: 600;
            color: #000000;
          }
          .price {
            font-weight: 600;
            font-size: 28rpx;
            color: #FA6262;
            text {
              font-size: 20rpx;
              margin-right: 4rpx;
            }
          }
          .buy-btn {
            background: #FA6262;
            border-radius: 16rpx;
            padding: 8rpx 40rpx 10rpx;
            font-weight: 600;
            font-size: 28rpx;
            color: #FFFFFF;
          }
        }
      }
    }
  }
}
.sys-head {
  background: transparent;
}
.head-wrapper {
  z-index: 999;
  display: flex;
  align-items: center;
  position: fixed;
  left: 30rpx;
  top: 0;
  .fenxiang_btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000000;
    font-size: 22rpx;
    .icon-fenxiang {
      font-weight: 600;
      color: #000000;
    }
  }

  .arrow-icon {
    width: 42rpx;
    height: 40rpx;
  }

  &.share {
    left: "inherit";
    .share-icon {
      width: 56rpx;
      height: 56rpx;
    }
  }
}
.head-menu {
  display: flex;
  align-items: center;
  height: 58rpx;
  width: 158rpx;
  background: rgba(255, 255, 255, 0.302);
  border: 2rpx solid rgba(0, 0, 0, 0.0588);
  border-radius: 29rpx;
  .menu-icon {
    flex: 1;
    border-right: 2rpx solid rgba(0, 0, 0, 0.0588);
    &:nth-of-type(2) {
      border-right: none;
    }
  }
  .iconfont {
    flex: 1;
    text-align: center;
    color: #000000;
    box-sizing: border-box;
    &.icon-fanhui2 {
      border-right: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
}

.wrapper .warp {
  padding: 0rpx 32rpx 40rpx;
  gap: 24rpx;
  align-self: stretch;
  border-radius: 8rpx;
  background: #F9F9F9;

  .share {
    padding: 0;
    margin: 0;
    align-items: center;
  }
  .money {
    display: flex;
    align-items: center;
    color: #FC5555;
    font-size: 24rpx;
    .num {
      margin-left: 8rpx;
      color: #FC5555;
      font-size: 40rpx;
      font-weight: 500;
    }
    .market-price {
      font-weight: 400;
      font-size: 24rpx;
      color: #A5A5A5;
      letter-spacing: 0;
      text-align: center;
      display: inline-block;
      text-decoration: line-through;
      margin-left: 12rpx;
    }
  }
  .money-box {
    display: flex;
    align-items: center;

    .vip-money {
      top: 0;
    }
  }
  .label {
    margin: 0;
  }
  .label-vessel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .skeleton-rect {
      font-weight: 400;
      font-size: 24rpx;
      color: #A5A5A5;
    }
  }
  .coupon {
    padding: 0;
    min-height: 80rpx;
    height: auto;
  }
}
.autotrophy {
  // background-color: #ffffff;
  // border: 1px solid #00DCEE;
  // color:#00DCEE;
}
.attribute-box {
  // padding: 0 24rpx;
  width: 100%;
  .attribute,
  .combo,
  .userEvaluation,
  .userPlant,
  .store-wrapper {
    border-radius: 12rpx;
    .atterTip {
      font-weight: 400;
      font-size: 28rpx;
      color: #D3D3D3;
      padding-right: 34rpx;
    }
    .o-title {
      padding: 0;
      margin-right: 30rpx;
      .title-text {
        font-weight: 400;
        font-size: 28rpx;
        color: #000000;
      }
    }
  }

  .product-intro {
    border-radius: 8rpx 8rpx 0 0;
    .title {
      text-align: left;
      padding-left: 32rpx;
      font-weight: 600;
      font-size: 28rpx;
      color: #000000;
    }
  }

  .presenter {
    padding: 4rpx 8rpx;
    border: 1px solid #ff4d25;
    color: #ff4d25;
    font-size: 22rpx;
    font-weight: 500;
    border-radius: 4rpx;
  }
  .equity {
    margin-left: 16rpx;
    font-size: 26rpx;
    color: #282828;
  }
}
.mt20 {
  margin-top: 20rpx;
}
.product-intro {
  .conter {
    padding: 0 32rpx;
    .title {
      padding: 0;
      height: auto;
      line-height: 1.4;
    }
  }
}
.global-tips {
  z-index: 9999;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.8);
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  border-radius: 12rpx 12rpx 0 0;
}
</style>
