<template>
  <uni-popup
    ref="modal_dialog"
    background-color="transparent"
    borderRadius="16px 16px 16px 16px"
    mask-background-color="rgba(0,0,0,0)"
    :mask-click="false"
    @change="change"
  >
    
    <view class="popup-content flex flex-column flex-1 flex-ac" :style="props.popup_style">
        <!-- icon + 底部内容 适合场景1 -->
        <!-- 仅有内容 适合场景2-->
        <!-- icon + 中间内容 + 底部内容  适合场景3 -->
        <!-- icon -->
        <slot name="icon">
            <image v-if="props.modal_info.icon" class="popup-icon" :src="imgUrlEvent(`${props.modal_info.icon}`)"></image>
        </slot>
        <!-- 内容 -->
        <slot></slot>
        <!-- 底部内容 -->
        <slot name="text">
            <view v-if="props.modal_info.text" class="popup-text"><text class="info-text">{{props.modal_info.text}}</text></view>
        </slot>
        
    </view>
    
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import {imgUrlEvent} from '/views/pages/save-money/infrastructure/utils/imgUrls';
const modal_dialog = ref();
const props = defineProps({
    // 弹窗显示的icon + text
    modal_info: {
        type: Object,
        default: () => ({
            icon: '',
            text: ''
        })
    },
    // 弹窗持续时间
    duration: {
        type: Number,
        default: 2000,
    },
    // 弹窗元素style
    popup_style: {
        type: [Object, String],
        default: ''
    },
})

// 弹窗change事件
function change(e) {
    if (e.show) {
        setTimeout(() => {
            _close();
        }, props.duration);
    }
}

// 关闭
function _close() {
  modal_dialog.value.close();
}

// 打开
function _open() {
  modal_dialog.value.open();
}

// 暴露方法
defineExpose({
  open: _open,
  // 由于自动会设置时间会自动关闭，则不对外暴露关闭方法
//   close: _close,
});
</script>

<style lang="less" scoped>
/deep/.uni-popup__wrapper {
  overflow: unset;
}
.popup-content {
//   width: 504rpx;
//   border-radius: 32rpx;
//   background: #fff;
//   padding: 32rpx;
//   overflow: unset;
    // width: 440rpx;
    background-color: #000000;
    border-radius: 32rpx;
    padding: 36rpx 32rpx 36rpx;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    max-width: 500rpx;
    text-align: center;
    .popup-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 8rpx;
    }
    .gold-coin-num {
        color: #ffffff;
        text-align: center;
        font-size: 32rpx;
        font-weight: 600;
        
    }
    .popup-text {
        margin-top: 32rpx;
        color: #ffffff;
        text-align: center;
        font-size: 24rpx;
        font-weight: 400;
        .info-text {
            color: #ffffff;
            text-align: center;
            font-size: 24rpx;
            font-weight: 400;
        }
    }
}


</style>
