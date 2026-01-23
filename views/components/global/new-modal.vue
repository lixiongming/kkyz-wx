<template>
  <uni-popup
    ref="modalDialog"
    background-color="#fff"
    borderRadius="16px 16px 16px 16px"
    :mask-click="!props.isMaskClick"
    type="center"
  >
  <view class="content">
       <slot name="title">
          <view class="title">
            <text class="title-text">{{ props.title }}</text>
          </view>
        </slot>
        <slot name="content">
          <view class="content-box">
            <text class="content-text">{{ props.content }}</text>
          </view>
        </slot>
        <slot name="footer">
          <view class="footer-box">
            <view class="footer-type1" @click="_confirm" v-if="btn_type == 1">
              <text class="footer-text">{{ confirmText || '我知道了' }}</text>
            </view>
            <view class="footer-type2" v-else>
               <view class="footer-left"   @click="_cancel"><text class="text">{{cancelText}}</text></view>
               <view class="footer-right"  @click="_confirm"><text class="text">{{confirmText}}</text></view>
            </view>
          </view>
        </slot>
  </view>
  </uni-popup>
</template>

<script setup>
import {onLoad,onShow} from "@dcloudio/uni-app"
import { ref, defineProps, defineEmits, computed, defineExpose,watch} from "vue";
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
  },
  isMaskClick: {
    type: Boolean,
    default: false,
  },
  btnExtraCls: {
    type: String,
    default: "",
  },
  btn_type:{
    type:Number,
    default:1
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
.content{
  width: 590rpx;
  background: #FFFFFF;
  border-radius: 28rpx;
  padding-top: 40rpx;
  .footer-box{
    width: 590rpx;
    height: 119rpx;
    border-top: solid 2rpx #F7F7F7;
    .footer-type2{
      display: flex;
      .footer-left,.footer-right{
         width: 294rpx;
         height: 117rpx;
         display: flex;
         justify-content: center;
         align-items: center;
         .text{
          font-weight: 500;
          font-size: 30rpx;
         }
      }
      .footer-right{
        .text{
          color: #1B9AFF;
        }
      }
      .footer-left{
        border-right: solid 2rpx #F7F7F7;
        .text{
          color: #000000;
        }
      }
    }
    .footer-type1{
      height: 119rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .footer-text{
        color: #1B9AFF;
        font-weight: 500;
        font-size: 30rpx
      }
    }
  }
  .content-box{
    width: 590rpx;
    padding: 0rpx 54rpx;
    margin-bottom: 60rpx;
    text-align: center;
    .content-text{
      font-weight: 500;
      font-size: 30rpx;
      color: #000000;
    
    }
  }
  .title{
    display: flex;
    justify-content: center;
    margin-bottom: 44rpx;
    .title-text{
      font-size: 44rpx;
      color: #000000;
    }

  }
}
</style>