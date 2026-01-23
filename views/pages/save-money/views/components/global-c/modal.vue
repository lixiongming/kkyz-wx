<template>
  <uni-popup
    ref="modal_dialog"
    background-color="transparent"
    borderRadius="16px 16px 16px 16px"
    mask-background-color="rgba(0,0,0,0.6)"
    @change="changeModal"
    :mask-click="props.mask_click"
  >
    
    <view class="popup-content flex flex-column flex-1">
      <!-- 头部 -->
      <view>
        <slot name="title">
          <view v-if="props.title" class="m_title">
            <text class="m_title_text">{{ props.title }}</text>
          </view>
        </slot>
      </view>
      <!-- 内容 -->
      <slot name="content">
          <view :class="`m_content ${props.contentClass}`">
            <text class="m_content_text" style="fontSize: 28rpx; color: #777777">{{ props.content }}</text>
          </view>
        </slot>
      <!-- 按钮 -->
      <slot name="btn">
        <view class="m_btns">
          <view
            class="flex flex-ac jc-sb"
            v-if="props.cancelText && props.confirmText"
          >
            <view
              class="m_btn cancel_btn flex flex-row flex-ac"
              @click="_cancel"
              :style="props.cancelBtnStyles"
            >
              <text class="cancel_btn_text">{{ props.cancelText }}</text>
            </view>
            <view class="m_btn flex flex-row flex-ac" :style="props.confirmBtnStyles" @click="_confirm">
              <text class="m_btn_text">{{ props.confirmText }}</text>
            </view>
          </view>
          <view
            class="flex flex-row flex-ac flex"
            v-else-if="props.cancelText || props.confirmText"
          >
            <view
              class="m_btn cancel_btn flex flex-row flex-ac"
              @click="_cancel"
              v-if="props.cancelText"
              :style="props.cancelBtnStyles"
            >
              <text class="cancel_btn_text">{{ props.cancelText }}</text>
            </view>
            <view
              class="m_btn flex flex-row flex-ac"
              @click="_confirm"
              v-if="props.confirmText"
              :style="props.confirmBtnStyles"
            >
              <text class="m_btn_text">{{ props.confirmText }}</text>
            </view>
          </view>
        </view>
      </slot>
    </view>
    <!-- x按钮 -->
    <image v-if="props.showXBtn" class="x_btn" :src="imgUrlEvent('/images/mine/closeImg.png')" @click="_close"></image>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
const emits = defineEmits(["close", "confirm", "change"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  confirmText: {
    type: String,
    default: "确定",
  },
  showXBtn: {
    type: Boolean,
    default: false,
  },
  // 内容class
  contentClass: {
    type: String,
    default: "",
  },
  // 取消按钮styles
  cancelBtnStyles: {
    type: String,
    default: "",
  },
  // 确认按钮styles
  confirmBtnStyles: {
    type: String,
    default: "",
  },
  // 点击遮罩是否自动关闭
  mask_click: {
    type: Boolean,
    default: true,
  }
});

const modal_dialog = ref();

// 弹窗change事件
function changeModal(e) {
  emits('change', e);
}

// 关闭
function _close() {
  modal_dialog.value.close();
}

// 打开
function _open() {
  modal_dialog.value.open();
}

// 确认按钮
function _confirm() {
  emits("confirm");
}

// 取消按钮
function _cancel() {
  emits("close");
}

// 暴露方法
defineExpose({
  open: _open,
  close: _close,
});
</script>

<style lang="less" scoped>
/deep/.uni-popup__wrapper {
  overflow: unset;
}
.popup-content {
  width: 504rpx;
  border-radius: 32rpx;
  background: #fff;
  padding: 32rpx;
  overflow: unset;
  margin-bottom: 40rpx;
}
.m_title {
  padding: 16rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.m_btns {
  margin-top: 32rpx;
}
.m_btn {
  width: 208rpx;
  height: 80rpx;
  justify-content: center;
  align-items: center;
  border-radius: 16rpx;
  background: #FF5B25;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.cancel_btn {
  background: #fff;
  color: #111111;
  border: 2rpx solid #ddd;
}
.m_title_text {
  text-align: center;
  font-size: 32rpx;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.m_content {
  .m_content_text {
    text-align: center;
    white-space: normal;
    word-wrap: break-word;
  }
  &.content-center {
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
  &.content-fs26{
    font-size: 26rpx;
    text-align: center;
  }
}
.cancel_btn_text {
  color: #111111;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
}
.m_btn_text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
}
.x_btn {
  position: relative;;
  width: 68rpx;
  height: 68rpx;
  // bottom: -100rpx;
  left: 218rpx;
  // z-index: 99;
}
</style>
