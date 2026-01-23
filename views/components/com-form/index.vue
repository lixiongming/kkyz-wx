<template>
  <view class="form-container">
    <view class="form-content">
      <uv-form
        labelPosition="top"
        :label-style="labelStyle"
        :model="_formData"
        label-width="140"
        ref="form"
      >
        <view v-for="(item, index) in FormDesc" :key="index">
          <uv-form-item
            :label="item.label"
            :label-style="item.labelStyle"
            :label-position="item.labelPosition || 'top'"
            :prop="item.name"
          >
            <component
              :is="renderField(item)"
              :type="item.type"
              :FormData_="_formData"
              @emitRules="(params) => emitRules(params, index)"
              v-model="_formData[item.name]"
              v-bind:attrs="item.attr"
              :style="item.formItemStyle || formItemStyle"
            ></component>
          </uv-form-item>
        </view>
      </uv-form>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import Input from "./form/input.vue";
import Picker from "./form/picker.vue";
import Picker1 from "./form/picker1.vue";
let props = defineProps([
  "formDesc",
  "formData",
  "formRules",
  "labelColor",
  "formItemStyle",
  "fontSize",
]);

const { formDesc, formData, formRules, labelColor, fontSize, formItemStyle } = props;

const labelStyle = {
  color: labelColor || "#fff",
  fontSize: fontSize ? `${fontSize}rpx` : "28rpx",
};

const FormDesc = ref(formDesc);

watch(
  () => props.formDesc,
  (n, o) => {
    FormDesc.value = n;
  }
);

const form = ref(null);
const formItemRef = ref(null);
let _formData = ref(formData);

watch(
  () => props.formData,
  (n) => {
    _formData.value = n;
  }
);

const renderField = (item) => {
  switch (item.type) {
    case "input":
    case "textarea":
      return Input;
    case "picker":
      return Picker;
    case "picker1":
      return Picker1;
    default:
      return Input;
  }
};

onMounted(() => {
  form.value.setRules(formRules);
});

// 校验规则变更
watch(
  () => props.formRules,
  (newVal) => {
    form.value.setRules(newVal);
  }
);

const emitRules = (params, index) => {
  setTimeout(() => {
    formItemRef.value[index]["onFieldChange"](params);
  }, 50);
};

const getFormData = () => {
  return _formData.value;
};

defineExpose({
  form,
  validate: form.validate,
  getFormData,
});
</script>
<style scoped lang="less"></style>
