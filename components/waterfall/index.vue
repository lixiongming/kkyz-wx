<template>
  <view class="waterfall">
    <uv-waterfall
      ref="waterfall"
      v-model="data"
      :column-count="is_switch ? 1 : 2"
      :add-time="10"
      :column-gap="7"
      left-gap="20rpx"
      right-gap="20rpx"
      @changeList="changeList2"
    >
      <!-- 第一列数据 -->
      <template v-slot:list1>
        <!-- 为了磨平部分平台的BUG，必须套一层view -->
        <view>
          <view
            v-for="(item, index) in list1"
            :key="item.id"
            class="waterfall-item"
          >
            <product-item
              :vertical="is_switch ? false : true"
              :item="item"
            ></product-item>
          </view>
        </view>
      </template>
      <!-- 第二列数据 -->
      <template v-slot:list2>
        <!-- 为了磨平部分平台的BUG，必须套一层view -->
        <view>
          <view
            v-for="(item, index) in list2"
            :key="item.id"
            class="waterfall-item"
          >
            <product-item
              :vertical="is_switch ? false : true"
              :item="item"
            ></product-item>
          </view>
        </view>
      </template>
    </uv-waterfall>
  </view>
</template>

<script setup>
import { ref, defineProps, watch, defineExpose } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import ProductItem from "@/components/product/index.vue";
const props = defineProps(['productList','is_switch']);

const list1 = ref([])
const list2 = ref([])
const waterfall = ref(null)
const data = ref([])

function changeList2(e) {
  if (e.name == 'list1') {
    list1.value.push(e.value);
  } else if (e.name == 'list2') {
    list2.value.push(e.value);
  }
}

watch(() => props.productList, (val) => {
  data.value = val;
})

function change () {
    waterfall.value.clear();
    list1.value = [];
    list2.value = [];
}

defineExpose({
    change
})

</script>
<style scoped lang="less"></style>
