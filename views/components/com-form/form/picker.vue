<template>
  <uv-picker
    ref="Picker"
    :columns="list"
    keyName="name"
    title="城市"
    round="16"
    @change="change"
    @confirm="confirm"
    confirmColor="#1CDAFE"
    cancelColor="#777777"
  >
  </uv-picker>
  <view class="picker-box flex jc-sb flex-ac fc-111111" @click="openPicker">
    <text class="fs-28 fc-111111">{{ city_name ? city_name : "请选择省市区" }}</text>
    <uv-icon size="14" name="arrow-right" color="#777777"></uv-icon>
  </view>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import addressDataJson from "/static/json/regions.json";
import { onShow } from "@dcloudio/uni-app";
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
const Picker = ref();
// 省数据
const provinces = ref([]);
// 市数据
const citys = ref([]);
// 区数据
const area = ref([]);
// 选择后的数据
const city_name = ref("");
const pickerValue = ref([0, 0]);

let defaultIndex = ref([]);

// 收货地址回显
uni.$on("location_show", function ({ data }) {
  console.log("data", data);
  const { province, province_code, city_code, area_code, city, area } = data;
  city_name.value = "";
  city_name.value = province + city + area;
  emit("update:modelValue", [
    { name: province, code: province_code },
    { name: city, code: city_code },
    { name: area, code: area_code },
  ]);
});

// 默认选择省市
const defaultValue = ref([3442, 1]);
// console.lg(addressList)

const list = computed(() => {
  return [provinces.value, citys.value, area.value];
});
// 设置默认省市
function handlePickValueDefault() {
  console.log("handlePickValueDefault", addressDataJson);
  provinces.value = addressDataJson.sort((left, right) =>
    Number(left.code) > Number(right.code) ? 1 : -1
  );
  // 设置省
  const province = provinces.value.findIndex(
    (item) => Number(item.id) === defaultValue.value[0]
  );
  // 设置市
  let cityList = provinces.value[pickerValue.value[0]]?.children || [];
  citys.value = cityList;
  // 设置区
  let areaList = citys.value[pickerValue.value[0]]?.children || [];
  area.value = areaList;
  const city = cityList.findIndex(
    (item) => Number(item.id) === defaultValue.value[1]
  );
  console.log("city---->", province, city);
  // 设置省、市
  pickerValue.value = [0, 0, 0];
  // 重置下位置
  Picker.value.setIndexs([0, 0, 0], true);
}

// 城市数据排序
function pcDataSort() {
  provinces.value = addressDataJson.sort((left, right) =>
    Number(left.code) > Number(right.code) ? 1 : -1
  );
  return provinces.value;
}

const handleInput = (e) => {
  intText.value = e;
  emit("update:modelValue", e);
  curLength.value = e?.length || 0;
};

const iptStyle = {
  fontSize: "28rpx",
  borderRadius: "10rpx",
  padding: "0rpx 20rpx",
};

const change = (e) => {
  const { columnIndex, index, indexs } = e;
  // 改变了省
  if (columnIndex === 0) {
    citys.value = provinces.value[index]?.children || [];
    area.value = citys.value[0]?.children || [];
    picker.value.setIndexs([index, 0], true);
  } else if (columnIndex === 1) {
    // citys.value = provinces.value[index]?.children || [];
    area.value = citys.value[index]?.children || [];
  }
};
// 选择完成事件
const confirm = (e) => {
  console.log(e, 123);
  city_name.value = "";
  //   区分直辖市的内容展示
  if (e.indexs[0] < 5) {
    e.value.forEach((item, index) => {
      if (index != 1) {
        city_name.value += item.name;
      }
    });
  } else {
    e.value.forEach((item) => {
      city_name.value += item.name;
    });
  }
  emit("update:modelValue", e.value);
};

const openPicker = () => {
  uni.$emit("input_is_foucs", false);
  uni.hideKeyboard()
  console.log(132);
  // 设置省、市
  pickerValue.value = [0, 0, 0];
  // 重置下位置
  Picker.value.open();
  // Picker.value.setIndexs([0, 0, 0], true);
  handlePickValueDefault();
};
</script>
<style scoped lang="less">
.picker-box {
  height: 88rpx;
  border-radius: 16rpx;
  background: #f5f6f6;
  width: 622rpx;
  padding: 0px 32rpx;
}
</style>
