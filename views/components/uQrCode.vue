<template>
  <view>
    <qr-code
      class="qrcode-code"
      level="H"
      :value="url"
      :size="size"
      id="canvasDom"
    ></qr-code>
  </view>
</template>

<script setup>
import qrCode from "qrcode.vue";
// import { copyFn } from "@/infrastructure/utils/index";

const props = defineProps(["url", "size", "fileName"]);
const { url, size, fileName } = props;
const copyLink = () => {
  copyFn(url);
};

const downloadQrCode = () => {
  const canvas = document.getElementById("canvasDom");
  const imgUrl = canvas.toDataURL(url); // 通过 toDataURL 返回一个包含图片展示的 data URI
  const aDom = document.createElement("a");
  aDom.download = fileName || "二维码"; // 设置下载的文件名
  aDom.href = imgUrl;
  document.body.appendChild(aDom);
  aDom.click();
  aDom.remove();
};
defineExpose({
  copyUrl: copyLink,
  downloadQrCode,
});
</script>

<style lang="less" scoped></style>
