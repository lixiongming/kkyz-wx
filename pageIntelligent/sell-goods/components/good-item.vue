<template>
<view class="good-item df-r ai-c" @click="toDtl(goods)">
    <view v-if="is_manage" class="good-check-content df-r ai-c" @click.stop="checkEvent(goods)">
        <view class="good-check df-r ai-c jc-c" :class="select_ids.indexOf(goods.id)>-1 ? 'active' : ''">
            <view class="check-icon"></view>
        </view>
    </view>
    <view class="good-ctn" :class="is_manage ? 'ml0' : ''">
        <view class="g-t df-r">
            <view class="good-icon-ctn">
                <image
                    v-if="is_sell"
                    :src="imgUrlEvent(goods.image, 'aliyunImgUrl')"
                    class="good-icon"
                    mode="aspectFill"
                ></image>
                <template v-if="!is_sell">
                    <image
                        :src="imgUrlEvent(goods.image, 'aliyunImgUrl')"
                        class="good-icon"
                        mode="aspectFill"
                    ></image>
                    <image
                        @click.stop="cancle(goods.is_show==1 ?'hide':'show',goods)"
                        :src="imgUrlEvent(goods.is_show==1 ? '/images/kkyz/eye-show.png' : '/images/kkyz/eye-hide.png', 'aliyunImgUrl')"
                        class="good-mark"
                        mode="aspectFill"
                    ></image>
                </template>
            </view>
            <view class="good-desc df-c jc-sb">
                <view class="g-t">
                    <view class="g-title nowrap">
                        <text class="text nowrap">{{ goods.store_name }}</text>
                    </view>
                    <view class="g-subtitle nowrap">
                        <text class="text nowrap">{{ goods.mer_name }}</text>
                    </view>
                </view>
                <view class="g-b df-r ai-c jc-sb">
                    <view class="df-r ai-c b-desc" :class="is_selection ? '' : 'manage'">
                        <view class="b-price">
                            <text class="price-icon">￥</text>
                            <text class="price-text">{{ goods.price }}</text>
                        </view>
                        <view class="b-coupon df-r ai-c jc-c nowrap">
                            <text class="text nowrap">赚{{  goods.sell_commission - 0 }}元{{ goods.sell_type == 1 ? '米粒' : '价值券' }}</text>
                        </view>
                    </view>
                    <view v-if="is_sell" class="btn df-r ai-c jc-c" @click.stop="commerce">
                        <text class="text">带货</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="g-b df-r jc-end" v-if="!is_manage && !is_sell">
            <!-- <view class="btn share-btn df-r ai-c jc-c">
                <text class="text">分享</text>
            </view> -->
            <button open-type="share" :id="goods.product_id" class="btn share-btn df-r ai-c jc-c" @tap.stop>
                <text class="text">分享</text>
            </button>
            <view class="btn cancel-btn df-r ai-c jc-c" @click.stop="cancle('cancel',goods)">
                <text class="text">取消带货</text>
            </view>
        </view>
    </view>
</view>
</template>

<script setup>
import { ref, defineProps, defineEmits} from "vue";
import { onLoad, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";

const emits = defineEmits(['change','child']);

const props = defineProps({
    goodKey:{
        type: Number,
        default: 0,
    },
    is_manage: {
        type: Boolean,
        default: false,
    },
    is_selection: {
        type: Boolean,
        default: false,
    },
    goods: {
        type: Object,
        default: {},
    },
    is_sell:{
        type: Boolean,
        default: false,
    },
    select_ids:{
        type: Array,
        default: [],
    },
});

function checkEvent (data) {
    emits('change', data);
}

function toDtl (good) {
    let mall_uid = uni.getStorageSync('userInfo').mall_uid
    uni.navigateTo({
        url: `/pagesProduct/goods_details/index?mall_uid=${mall_uid}&share_mer_id=${good.mer_id}&id=${good.product_id}${props.is_selection ? '&is_selection=1' : '&is_commerce=1'}`
    });
}

// 带货
function commerce () {
    emits('child')
}

//取消带货
function cancle(type,data) {
    emits('cancle',type,data)
}

</script>
<style scoped lang='less'>
.good-item {
    flex-wrap: nowrap;
    align-items: stretch;
    .good-check {
        // margin-left: 20rpx;
        width: 40rpx;
        height: 40rpx;
        background: #fff;
        border-radius: 40rpx;
        flex-shrink: 0;
        border: 3rpx solid #000000;
        .check-icon {
            display: none;
            width: 20rpx;
            height: 12rpx;
            border: 2px solid #FFFFFF;
            border-top: none;
            border-right: none;
            transform: translateY(-2rpx) rotate(-45deg);
        }
        &.active {
            background: #1B9AFF;
            border: none;
            .check-icon {
                display: block;
            }
        }
    }
    .good-check-content {
        width: 80rpx;
        padding-right: 20rpx;
        padding-left: 20rpx;
    }
}
.good-ctn {
    width: 710rpx;
    min-height: 196rpx;
    background: #FFFFFF;
    box-shadow: 0 0 20rpx 12rpx #eeeeee80;
    border-radius: 16rpx;
    margin-left: 20rpx;
    margin-top: 16rpx;
    padding: 16rpx 16rpx 12rpx;
    &.ml0 {
        margin-left: 0rpx;
    }
    .good-icon-ctn {
        width: 168rpx;
        height: 168rpx;
        border-radius: 16rpx;
        margin-right: 16rpx;
        position: relative;
        .good-icon {
            width: 168rpx;
            height: 168rpx;
            border-radius: 16rpx;
        }
        .good-mark {
            position: absolute;
            width: 32rpx;
            height: 32rpx;
            top: 10rpx;
            left: 10rpx;
        }
    }
    .good-desc {
        flex: 1;
        max-width: 486rpx;
        .g-t {
            .g-title {
                margin-bottom: 12rpx;
                .text {
                    max-width: 486rpx;
                    font-weight: 500;
                    font-size: 30rpx;
                    color: #000000;
                }
            }
            .g-subtitle {
                .text {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #A5A5A5;
                }
            }
        }
        .g-b {
            .b-desc {
                max-width: 320rpx;
                flex: 1;
                &.manage {
                    max-width: 480rpx;
                }
            }
            .b-price {
                margin-right: 12rpx;
                .price-icon {
                    font-weight: 500;
                    font-size: 20rpx;
                    color: #FC5555;
                }
                .price-text {
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #FC5555;
                }
            }
            .b-coupon {
                max-width: 172rpx;
                flex: 1;
                width: 272rpx;
                padding: 4rpx 10rpx;
                background: #FFEDED;
                border-radius: 20rpx;
                height: 36rpx;
                .text {
                    font-weight: 400;
                    font-size: 20rpx;
                    color: #FA6262;
                }
            }
            .btn {
                width: 140rpx;
                height: 60rpx;
                background: #FA6262;
                border-radius: 16rpx;
                .text {
                    font-weight: 600;
                    font-size: 28rpx;
                    color: #FFFFFF;
                }
            }
        }
    }

    .g-b {
        margin-top: 12rpx;
        width: 100%;
        .btn {
            width: 140rpx;
            height: 60rpx;
            border-radius: 16rpx;
            margin-left: 20rpx;
            .text {
                text-align: center;
            }
        }
        .share-btn {
            border: 2rpx solid #D3D3D3;
            .text {
                font-weight: 400;
                font-size: 28rpx;
                color: #000000;
            }
        }
        .cancel-btn {
            border: 2rpx solid #FA6262;
            .text {
                font-weight: 400;
                font-size: 28rpx;
                color: #FA6262;
            }
        }
    }
}
</style>