<template>
  <view class="review-box">
    <view>
      <reviewCom :id="props.info.id" :info="props.info" :recover="recover" :maxHei="true"></reviewCom>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import uerStore from "@/business/store/modules/home";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import reviewCom from "./review-com.vue";
const props = defineProps(["info",'recover']);
const store = uerStore();

// 关注事件
const follow_Event = async () => {
  const data = await store.attentionAPI({
    type: props.info.isAttention ? "cancel" : "focus",
    focused_user_id: props.info.user_id,
  });

  props.info.isAttention = !props.info.isAttention;
   uni.$emit("isfollow_user", props.info.user_id, props.info.isAttention);
  if (props.info.isAttention) {
    toast("关注成功");
  }
};

const toUser = () => {
  uni.navigateTo({
    url: "/views/pages/mine/user-page?user_id=" + props.info.user_id,
  });
};

const toast = (data) => {
  uni.showToast({
    icon: "none",
    title: data,
    duration: 2000,
  });
};
</script>

<style lang="less" scoped>
.item-right-is_like {
  margin-left: 6rpx;
  margin-right: 24rpx;
  color: #777777;
  font-size: 22rpx;
}
.isunfold {
  .text {
    color: #006788;
    font-family: "PingFang SC";
    font-size: 24rpx;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
.item-right-center {
  color: #111111;
  font-family: "PingFang SC";
  font-size: 26rpx;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.parent-name {
  color: #777777;
}

.input-placeholde {
  font-size: 24rpx;
}

.item-right-bottom-right,
.review-item-child-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.review-item-child-box {
  margin-top: 40rpx;
}
.review-item-child {
  display: flex;
  flex-direction: row;

  .item-right-center {
    width: 550rpx;
  }
  .item-right-bottom {
    width: 530rpx;
  }
}
.review-item {
  display: flex;
  flex-direction: column;

  .item-parent {
    display: flex;
    flex-direction: row;
    margin-top: 40rpx;
  }

  .item-child {
    display: flex;
    flex-direction: column;
    padding-left: 75rpx;
    .avatar {
      border-radius: 40rpx;
    }
  }

  .item-left {
    margin-right: 24rpx;
    .avatar {
      border-radius: 56rpx;
    }
  }
  .item-right {
    width: 590rpx;

    .item-right-top {
      color: #777777;
      font-family: "PingFang SC";
      font-size: 24rpx;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 12rpx;
    }
  }
  .item-right-bottom {
    display: flex;
    flex-direction: row;
    margin-top: 14rpx;
    justify-content: space-between;
    .item-right-bottom-left {
      display: flex;
      flex-direction: row;
      .item-right-time {
        color: #777777;
        font-family: "PingFang SC";
        font-size: 22rpx;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .item-right-recover {
        font-size: 22rpx;
        margin-left: 32rpx;
      }
    }
  }
}
.footer {
  // position: absolute;
  background: red;
  // bottom: 200px;
  .input {
    width: 680rpx;
    // height: 72rpx;
    background: #f5f6f6;
    border-radius: 16rpx;
    padding-left: 82rpx;
    // position: absolute;
    // bottom: 200rpx
  }
}
.edit-pen {
  position: absolute;
  top: 13rpx;
  z-index: 122;
  left: 24rpx;
}

.header-bth {
  display: flex;
  width: 122rpx;
  height: 48rpx;
  padding: 20rpx;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 32rpx;
  background: #1cdafe;
  .text {
    color: #fff;
    font-size: 24rpx;
    font-weight: 600;
  }
}
.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  .text {
    color: #111111;
    font-size: 28rpx;
    font-weight: 600;
  }
  .avatar {
    margin-right: 24rpx;
    border-radius: 56rpx;
    border: solid 2rpx #eee;
  }
}

.avatar-border {
  border: solid 2rpx #eee;
}
.header-box {
  padding: 32rpx;
  padding-bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.review-box {
  width: 750rpx;
  height: 1000rpx;
  box-sizing: border-box;
  // padding: 32rpx;
  background-color: #fff;
  border-radius: 50rpx 50rpx 0px 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 100rpx;
  z-index: 9999999;
}
.header-bth-active {
  background: #f5f6f6;
}
.text-active {
  color: #777777 !important;
}

.review-box::v-deep .footer {
  position: absolute;
  bottom: 20rpx;
  // margin-left: -32rpx !important;
}
.review-box::v-deep .scroll-box {
  height: 220rpx !important;
  padding-bottom: 50rpx;
}

</style>
