<template>
  <view :style="localViewColor">
    <view class="guaranee_tel">
      <view class="popup" :class="{ on: isGuarantee }">
        <view class="title"
          >保障说明<text class="iconfont icon-guanbi" @click="close"></text
        ></view>
        <view v-if="guarantee.length" class="content">
          <view v-for="(item, index) in guarantee" class="item">
            <view class="name"
              ><image :src="item.image" class="image" v-if="item.image"></image
              >{{ item.guarantee_name }}</view
            >
            <view class="info" style="white-space: pre-line">{{
              item.guarantee_info
            }}</view>
          </view>
        </view>
        <button @tap="close">确定</button>
      </view>
      <view class="popup" :class="{ on: isShipping }">
        <view class="title"
          >运费说明<text class="iconfont icon-guanbi" @click="close"></text
        ></view>
        <view class="content" style="white-space: pre-line">
          {{ shipping }}
        </view>
        <button @tap="close">确定</button>
      </view>
    </view>
    <view
      class="mall-mask"
      catchtouchmove="true"
      v-if="showMask"
      @tap="close"
    ></view>
  </view>
</template>
<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  markRaw,
  getCurrentInstance,
  defineAsyncComponent,
  nextTick,
  defineProps,
  defineExpose,
} from "vue";
import store from "@/business/store/modules/mall.ts";
const Store = store();
const props = defineProps(["shipping", "guarantee"]);
const localViewColor = computed(() => {
  return Store.localViewColor;
});
const isShipping = ref(false);
const isGuarantee = ref(false);
const showMask = ref(false);

function showShippingTel() {
  isShipping.value = true;
  showMask.value = true;
}
function showGuaranteeTel() {
  isGuarantee.value = true;
  showMask.value = true;
}
function close() {
  isShipping.value = false;
  isGuarantee.value = false;
  showMask.value = false;
}

defineExpose({
  showShippingTel,
  showGuaranteeTel,
});
</script>

<style scoped lang="scss">
.guaranee_tel {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  background-color: #fff;
  z-index: 300;
  border-radius: 16rpx 16rpx 0 0;
  padding-bottom: 20rpx;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
}
.guaranee_tel.on {
  transform: translate3d(0, 0, 0);
}
.guaranee_tel .title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  height: 123rpx;
  line-height: 123rpx;
  position: relative;
}
.guaranee_tel .title .iconfont {
  position: absolute;
  right: 30rpx;
  color: #8a8a8a;
  font-size: 35rpx;
}

.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  padding-bottom: 40rpx;
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
  background-color: #f5f5f5;
  overflow: hidden;
  transform: translateY(100%);
  transition: 0.3s;
}
.popup.on {
  transform: translateY(0);
}
.popup .title {
  position: relative;
  height: 137rpx;
  font-size: 32rpx;
  line-height: 137rpx;
  text-align: center;
}
.popup scroll-view {
  height: 466rpx;
  padding-right: 30rpx;
  padding-left: 30rpx;
  box-sizing: border-box;
}
.popup .icon-guanbi {
  position: absolute;
  top: 50%;
  right: 30rpx;
  z-index: 2;
  transform: translateY(-50%);
  font-size: 30rpx;
  color: #707070;
  cursor: pointer;
}
.popup .content {
  padding: 0 50rpx;
  color: #999999;
  max-height: 800rpx;
  overflow-y: scroll;
  .item {
    margin-bottom: 70rpx;
  }
  .image {
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
    position: relative;
    top: 4rpx;
  }
  .name {
    color: #282828;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .info {
    margin-top: 15rpx;
  }
}
.popup button {
  height: 86rpx;
  border-radius: 43rpx;
  margin-right: 30rpx;
  margin-left: 30rpx;
  background: var(--view-bgColor);
  //background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);;
  font-size: 30rpx;
  line-height: 86rpx;
  color: #ffffff;
  margin-top: 80rpx;
}
.popup .text .acea-row {
  display: inline-flex;
  max-width: 100%;
}
.popup .label {
  width: 56rpx;
  height: 28rpx;
  border: 1px solid #e93323;
  margin-left: 18rpx;
  font-size: 20rpx;
  line-height: 26rpx;
  text-align: center;
  color: #e93323;
}
.popup .type {
  width: 124rpx;
  height: 42rpx;
  margin-top: 14rpx;
  background-color: #fcf0e0;
  font-size: 24rpx;
  line-height: 42rpx;
  text-align: center;
  color: #d67300;
}
.popup .type.special {
  background-color: #fde9e7;
  color: #e93323;
}
</style>
