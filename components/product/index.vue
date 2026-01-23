<template>
  <view class="vertical-product-item df-c" v-if="vertical" @click="godDetail(item)">
    <view class="item-img-wrap">
        <image :src='item.image' lazy-load class="item-img" mode="widthFix"></image>
        <view class="sell-out" v-if="item.stock == 0">已售罄</view>
        <image :src='item.border_pic' class="border-picture"></image>
    </view>
    <view class="item-desc df-c jc-sb">
        <view class="desc-top">
            <view class="item-desc-title">
                <text class="title-text line2">{{ item.store_name }}</text>
            </view>
            <view class="item-promotion df-r ai-c fw-w">
                <view class="promotion-tag solid-color df-r ai-c jc-c" v-if="item.merchant && item.merchant.type_name && item.product_type == 0">
                    <text class="text">{{ item.merchant.type_name }}</text>
                </view>
                <view class="promotion-tag solid-color df-r ai-c jc-c" v-else-if="item.merchant.is_trader && item.product_type == 0">
                    <text class="text">自营</text>
                </view>
                <view :class="'promotion-tag solid-color df-r ai-c jc-c type' + item.product_type" v-if="item.product_type != 0">
                    <text class="text">{{item.product_type == 1 ? "秒杀" : item.product_type == 2 ? "预售" : item.product_type == 3 ? "助力" : item.product_type == 4 ? "拼团" : ""}}</text>
                </view>
                <view class="promotion-tag df-r ai-c jc-c" v-if="item.issetCoupon">
                    <text class="text">领券</text>
                </view>
                <view class="promotion-tag df-r ai-c jc-c" v-if="item.delivery_free == 1 && item.sc_product_type != 1">
                    <text class="text">包邮</text>
                </view>
                <view class="promotion-tag df-r ai-c jc-c" v-for="(citem, index) in item.mer_labels_data" :key="index">
                    <text class="text">{{ citem }}</text>
                </view>
                <template v-if="item.zone_type == 'hot' || item.zone_type == 'premium' || item.zone_type == 'exchange'">
                    <text class="promotion-text" v-if="item.zone_type == 'exchange'">{{'兑换积分最多抵扣' + item.product.productAttrValue.super_integral}}</text>
                    <text class="promotion-text" v-if="item.product?.productAttrValue?.consume_points">赠{{ item.product.productAttrValue && item.product.productAttrValue.consume_points ? decimalExchangeCoupons(item.product.productAttrValue.consume_points) : 0 }}本店消费积分</text>
                </template>
                <template v-else>
                    <text class="promotion-text" v-if="item.product?.productAttrValue?.consume_points && (Number(item.ticket) > 0)">赠{{ decimalExchangeCoupons(item.ticket) }}兑换券</text>
                </template>
                <text class="promotion-text active" v-if="item.max_extension > 0 && (item.product_type == 0 || item.product_type == 2)">最高赚 ￥{{ item.max_extension }}</text>
                <text class="promotion-text" v-if="item.product.max_share_benefit_price">折扣总额{{ item.product.max_share_benefit_price }}</text>
            </view>
        </view>

        <view class="desc-bottom">
            <view class="item-store-info df-r ai-c jc-sb nowrap">
                <text class="item-price">￥{{ item.price }}</text>
                <view class="store-rating df-r ai-c nowrap">
                    <text class="store-rating-text nowrap">{{ item.rate }}评分</text>
                    <text class="store-rating-text nowrap">{{ item.reply_count }}条评论</text>
                </view>
            </view>
            <view class="store-details df-r ai-c jc-sb" v-if="item.merchant" @click.stop="goShop(item.mer_id)">
                <view class="store-details-child">
                   <view class="nowrap store-details-box df-r ai-c"><text class="store-details-text nowrap">{{ item.merchant.mer_name }}</text></view>
                   <view class="store-details-action df-r ai-c">
                       <text class="action-text">进店</text>
                       <image
                            class="arrow-icon"
                            :src="
                                imgUrlEvent(
                                '/images/wx-applet/mine/wx-right-arrow.png',
                                'aliyunImgUrl'
                                )
                            "
                        ></image>
                   </view>
                </view>
            </view>
        </view>
    </view>
  </view>

  <view class="product-item df-r ac-s" v-else @click="godDetail(item)">
    <view class="item-img-wrap">
        <image :src='item.image' lazy-load class="item-img" mode="aspectFill"></image>
        <view class="sell-out" v-if="item.stock == 0">已售罄</view>
        <image :src='item.border_pic' class="border-picture"></image>
    </view>
    <view class="item-desc df-c jc-sb">
        <view class="desc-top">
            <view class="item-desc-title">
                <text class="title-text line2">{{ item.store_name }}</text>
            </view>
            <view class="item-promotion df-r ai-c fw-w">
                <view class="promotion-tag solid-color df-r ai-c jc-c" v-if="item.merchant && item.merchant.type_name && item.product_type == 0">
                    <text class="text">{{ item.merchant.type_name }}</text>
                </view>
                <view class="promotion-tag solid-color df-r ai-c jc-c" v-else-if="item.merchant.is_trader && item.product_type == 0">
                    <text class="text">自营</text>
                </view>
                <view :class="'promotion-tag solid-color df-r ai-c jc-c type' + item.product_type" v-if="item.product_type != 0">
                    <text class="text">{{item.product_type == 1 ? "秒杀" : item.product_type == 2 ? "预售" : item.product_type == 3 ? "助力" : item.product_type == 4 ? "拼团" : ""}}</text>
                </view>
                <view class="promotion-tag df-r ai-c jc-c" v-if="item.issetCoupon">
                    <text class="text">领券</text>
                </view>
                <view class="promotion-tag df-r ai-c jc-c" v-if="item.delivery_free == 1 && item.sc_product_type != 1">
                    <text class="text">包邮</text>
                </view>
                <view class="promotion-tag df-r ai-c jc-c" v-for="(citem, index) in item.mer_labels_data" :key="index">
                    <text class="text">{{ citem }}</text>
                </view>
                <template v-if="item.zone_type == 'hot' || item.zone_type == 'premium' || item.zone_type == 'exchange'">
                    <text class="promotion-text" v-if="item.zone_type == 'exchange'">{{'兑换积分最多抵扣' + item.product.productAttrValue.super_integral}}</text>
                    <text class="promotion-text" v-if="item.product?.productAttrValue?.consume_points">赠{{ item.product.productAttrValue && item.product.productAttrValue.consume_points ? decimalExchangeCoupons(item.product.productAttrValue.consume_points) : 0 }}本店消费积分</text>
                </template>
                <template v-else>
                    <text class="promotion-text" v-if="item.product?.productAttrValue?.consume_points && (Number(item.ticket) > 0)">赠{{ decimalExchangeCoupons(item.ticket) }}兑换券</text>
                </template>
                <text class="promotion-text active" v-if="item.max_extension > 0 && (item.product_type == 0 || item.product_type == 2)">最高赚 ￥{{ item.max_extension }}</text>
                <text class="promotion-text" v-if="item.product.max_share_benefit_price">折扣总额{{ item.product.max_share_benefit_price }}</text>
            </view>
        </view>
        <view class="desc-bottom">
            <text class="item-price">￥{{ item.price }}</text>
            <view class="item-store-info df-r ai-c jc-sb">
                <view class="store-details df-r ai-c jc-sb" v-if="item.merchant" @click.stop="goShop(item.mer_id)">
                    <text class="store-details-text nowrap">{{ item.merchant.mer_name }}</text>
                    <view class="store-details-action df-r ai-c">
                        <text class="action-text">进店</text>
                        <image
                            class="arrow-icon"
                            :src="
                                imgUrlEvent(
                                '/images/wx-applet/mine/wx-right-arrow.png',
                                'aliyunImgUrl'
                                )
                            "
                        ></image>
                    </view>
                </view>
                <view class="store-rating df-r ai-c">
                    <text class="store-rating-text">{{ item.rate }}评分</text>
                    <text class="store-rating-text">{{ item.reply_count }}条评论</text>
                </view>
            </view>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from "vue";
import store from '@/business/store/modules/mall.ts';
import { goShopDetail } from '@/infrastructure/libs/order.js';
import { initiateAssistApi } from '@/business/api/modules/activity.ts';
import { toLogin } from '@/infrastructure/libs/login.js';
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  show_type: {
    type: Number,
    default: 1,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
});

const Store = store()
const hide_mer_status = computed(()=>{
	return Store.globalData.hide_mer_status
})
const uid = computed(()=>{
	return Store.uid
})
const isLogin = computed(()=>{
	return Store.isLogin
})

function decimalExchangeCoupons (num) {
    return Number(num).toFixed(2)
}

// 去店铺
function goShop(id){
	if(hide_mer_status.value != 1){
		uni.navigateTo({
			url:`/views/pages/home/store?mer_id=${id}`
		})
	}
}

// 去详情页
function godDetail(data) {
    console.log(data,'computed')
	goShopDetail(data, uid.value).then(res => {
		if (isLogin.value) {
			initiateAssistApi(data.activity_id).then(res => {
				let id = res.data.product_assist_set_id;
				uni.navigateTo({
					url: '/pages/activity/assist_detail/index?id=' + id
				});
			}).catch((err) => {
				uni.showToast({
					title: err,
					icon: 'none'
				})
			});
		} else {
			toLogin()
		}
	})
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
