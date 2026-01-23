<template>
  <uv-input
    placeholder="请输入内容"
    input-align="left"
    :custom-style="attrs.style || iptStyle"
    :clearable="false"
    v-model="intText"
    v-bind="attrs"
    :type="attrs.type || type"
    :password="is_password"
    @input="handleInput"
    :focus="isFocus"
  >
    <template
      v-slot:suffix
      v-if="
        attrs.suffixConfig &&
        attrs.suffixConfig.showSuffix &&
        attrs.suffixConfig.suffixText
      "
    >
      <text
        :style="attrs.suffixConfig.suffixStyle"
        @click="attrs.suffixConfig.suffixHandle"
        >{{ attrs.suffixConfig.suffixText }}</text
      >
    </template>
    <template
      v-slot:suffix
      v-if="
        attrs.suffixConfig &&
        attrs.suffixConfig.showSuffix &&
        attrs.suffixConfig.suffixIcon
      "
    >
      <image
        :src="
          isPassword
            ? imgUrlEvent('/images/publish/preview-close.png')
            : imgUrlEvent('/images/publish/preview-open.png')
        "
        alt=""
        class="eye_img"
        @click="iconChange"
      ></image>
    </template>
  </uv-input>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
const isFocus = ref(false);
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "input",
  },
  attrs: {
    type: Object,
    default: () => {},
  },
  formData: {
    type: Object,
    default: () => {},
  },
});

let isPassword = ref(false);

let is_password = computed(() => {
  return isPassword.value;
});

const iconChange = () => {
  isPassword.value = !isPassword.value;
};

const { modelValue, attrs } = props;
const intText = ref(modelValue);
// 当前输入内容长度
const curLength = ref(modelValue?.length || 0);

watch(
  () => props.modelValue,
  (val) => {
    intText.value = val;
  }
);

const handleInput = (e) => {
  intText.value = e;
  emit("update:modelValue", e);
  curLength.value = e?.length || 0;
};

uni.$on("input_is_foucs", function (data) {
  isFocus.value = false;
  console.log('触发收回')
});

const iptStyle = {
  fontSize: "28rpx",
  borderRadius: "10rpx",
  padding: "0rpx 20rpx",
};
</script>
<style scoped lang="less">
.eye_img {
  width: 40rpx;
  height: 40rpx;
}
</style>
