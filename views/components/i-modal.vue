<template>
  <uni-popup
    ref="modalDialog"
    background-color="#fff"
    borderRadius="16px 16px 16px 16px"
  >
    
    <view class="popup-content flex flex-column flex-1">
      <!-- 内容 -->
      <view>
        <slot name="content">
          <view class="m_content">
            <text class="m_content_text">{{ props.content }}</text>
          </view>
        </slot>
      </view>
      <!-- 头部 -->
      <slot name="title">
        <view v-if="props.title">
          <text style="fontsize: 26rpx; color: #777777">{{ props.title }}</text>
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
            >
              <text class="cancel_btn_text">{{ props.cancelText }}</text>
            </view>
            <view class="m_btn flex flex-row flex-ac" @click="_confirm">
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
            >
              <text class="cancel_btn_text">{{ props.cancelText }}</text>
            </view>
            <view
              class="m_btn flex flex-row flex-ac"
              @click="_confirm"
              v-if="props.confirmText"
            >
              <text class="m_btn_text">{{ props.confirmText }}</text>
            </view>
          </view>
        </view>
      </slot>
      <!-- x按钮 -->
      <image v-if="showXBtn" class="x_btn" :src="imgUrlEvent('/images/mine/closeImg.png')" @click="_close"></image>
    </view>
    
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
const emits = defineEmits(["close", "confirm"]);
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
  }
});

const modalDialog = ref();

// 关闭
function _close() {
  modalDialog.value.close();
}

// 打开
function _open() {
  modalDialog.value.open();
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
}
.m_content {
  padding: 16rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.m_btns {
  margin-top: 98rpx;
}
.m_btn {
  width: 208rpx;
  height: 80rpx;
  justify-content: center;
  align-items: center;
  border-radius: 16rpx;
  // border: 2rpx solid #FF182E;
  // background: #1cdafe;
  background: linear-gradient(to left, #FF182E, #FF9D21);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.cancel_btn {
  background: #fff;
  color: #111111;
  border: 2rpx solid #ddd;
}
.m_content_text {
  text-align: center;
  font-size: 32rpx;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
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
  position: absolute;
  width: 68rpx;
  height: 68rpx;
  bottom: -100rpx;
  left: 218rpx;
  // z-index: 99;
}
</style>
