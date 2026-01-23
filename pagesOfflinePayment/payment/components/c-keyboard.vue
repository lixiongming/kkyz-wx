<template>
  <view class="keyboard-content">
    <view class="number-area">
      <view class="number-item" v-for="num in 9" @click="keyChange(num)">
        <text class="text">{{ num }}</text>
      </view>
      <view class="number-item zero" @click="keyChange(0)">
        <text class="text">0</text>
      </view>
      <view class="number-item" @click="keyChange('drop')">
        <text class="text">.</text>
      </view>
      <!-- <view class="number-item" @click="keyChange('cancel')">
        <text class="text">取消</text>
      </view> -->
    </view>
    <view class="utils-area">
      <view
        class="del-btn"
        @click="keyChange('delete')"
        @touchstart="startDeleting"
        @touchend="stopDeleting"
        @longpress="startDeleting"
      >
        <image
          mode="aspectFit"
          class="pay-close-icon"
          src="@/static/images/v-pay-close.png"
        ></image>
      </view>
      <view class="pay-btn" :class="is_down ? 'pay-btn-down' : ''" @click="createdHandle">
        <text class="text">付款</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
import { onLoad, onShow, onUnload, onHide } from "@dcloudio/uni-app";

const deleteTimer = ref(null);

const props = defineProps(["value_","is_down"]);

const input_value = ref(props.value_);

const emits = defineEmits(["submit_", "focus_", "change_"]);
// 校验输入金额是否正确
function isValidNumber(str) {
  const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  return regex.test(str);
}

// 按键触发事件
function keyChange(val) {
  switch (val) {
    case "cancel":
      // 取消
      emits("focus_");
      break;
    case "delete":
      // 删除
      if (!input_value.value) return;
      input_value.value = input_value.value.slice(0, -1);
      break;
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      if (input_value.value.length > 9) return
      input_value.value += val;
      break;
    case "drop":
      input_value.value += ".";
      break;
  }
  if (
    val != "cancel" &&
    val != "delete" &&
    val != "drop" &&
    !isValidNumber(input_value.value)
  ) {
    input_value.value = input_value.value.slice(0, -1);
  }
  emits("change_", input_value.value);
}

// 清除定时器
function stopDeleting() {
  if (deleteTimer.value) {
    clearInterval(deleteTimer.value);
    deleteTimer.value = null;
  }
}

// 长按删除
function startDeleting() {
  if (!input_value.value) return;
  if (deleteTimer.value) return;
  deleteTimer.value = setInterval(() => {
    if (input_value.value) {
      input_value.value = input_value.value.slice(0, -1);
      emits("change_", input_value.value);
    } else {
      // 停止删除
      stopDeleting();
    }
  }, 100);
}

// 提交
async function createdHandle() {
  if (!input_value.value) return;
  if (!isValidNumber(input_value.value)) {
    uni.showToast({
      icon: "none",
      title: "金额输入错误请重新输入!",
    });
    return;
  }
  emits("submit_");
}
</script>
<style scoped lang="less">
.keyboard-content {
  width: 750rpx;
  display: flex;
  flex-direction: row;
  background-color: #f8f8f8;
  padding: 10rpx;
  .number-area {
    flex: 1;
    min-height: 440rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .number-item {
      width: 156rpx;
      height: 100rpx;
      margin-bottom: 10rpx;
      border-radius: 8rpx;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      &:nth-of-type(n + 9) {
        margin-bottom: 0;
      }
      &.zero {
        flex: 1;
        margin-right: 12rpx;
      }
      &:active {
        background-color: #ccc;
      }
      .text {
        font-size: 44rpx;
        font-weight: 600;
        color: #000000;
        font-weight: 600;
      }
    }
  }
  .utils-area {
    width: 225rpx;
    min-height: 440rpx;
    display: flex;
    flex-direction: column;
    margin-left: 14rpx;
    .del-btn {
      width: 225rpx;
      height: 100rpx;
      border-radius: 8rpx;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10rpx;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      &:active {
        background-color: #ccc;
      }
      .pay-close-icon {
        width: 48rpx;
        height: 48rpx;
        display: block;
        pointer-events: none;
      }
    }
    .pay-btn {
      flex: 1;
      background: #1B9AFF;
      // background: linear-gradient(90deg, #ff8638 0%, #f34 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8rpx;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      &:active {
        background-color: #03b9fc;
      }
      .text {
        color: #fff;
        font-size: 40rpx;
        font-weight: 600;
      }
      &.pay-btn-down {
        opacity: .5;
      }
    }
  }
}
</style>
