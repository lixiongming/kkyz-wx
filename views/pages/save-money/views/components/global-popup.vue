<template>
  <view class="popup" v-if="visible">
    <!-- 弹窗内容 -->
    <view>这是一个全局弹窗</view>
    <button @click="closePopup">关闭</button>
  </view>
</template>
 
<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    openPopup() {
      this.visible = true;
    },
    closePopup() {
      this.visible = false;
    }
  }
};
</script>
 
<style>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>