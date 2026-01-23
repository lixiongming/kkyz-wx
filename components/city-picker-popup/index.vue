<template>
  <u-popup 
    :show="show" 
    mode="bottom" 
    :round="28"
    @close="handleClose"
    :safeAreaInsetBottom="true"
    :zIndex="99999"
    :overlay="true"
  >
    <view class="city-popup-content">
      <view class="city-popup-header">
        <text class="city-popup-title">请选择</text>
        <view class="city-popup-close" @click="handleClose">
          <u-icon name="close" size="20" color="#333333"></u-icon>
        </view>
      </view>
      <view class="city-picker-wrapper">
        <picker-view
          class="city-picker-view"
          :value="localPickerValue"
          @change="handlePickerChange"
          @pickstart="handlePickStart"
          @pickend="handlePickEnd"
          :indicator-style="indicatorStyle"
          indicator-class="indicator-class"
          :disable-default-sound="true"
          :mask-style="'position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1; background: transparent; height: 100%;'"
        >
          <picker-view-column class="picker-column-wide">
            <view 
              class="picker-item" 
              v-for="(province, index) in provinceList" 
              :key="index"
              :style="{
                color: localPickerValue[0] === index ? '#000000' : '#CCCCCC',
                fontWeight: localPickerValue[0] === index ? '500' : '400'
              }"
            >
              {{ province.name }}
            </view>
          </picker-view-column>
          <!-- 中间空列 -->
          <picker-view-column class="picker-column-narrow">
            <view class="picker-item-empty">
            </view>
          </picker-view-column>
          <picker-view-column class="picker-column-wide">
            <view 
              class="picker-item" 
              v-for="(city, index) in cityList" 
              :key="index"
              :style="{
                color: localPickerValue[2] === index ? '#000000' : '#CCCCCC',
                fontWeight: localPickerValue[2] === index ? '500' : '400'
              }"
            >
              {{ city.name }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
      <view class="city-popup-footer">
        <view class="confirm-btn" @click="handleConfirm">确定</view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch, nextTick } from 'vue'

interface Props {
  show: boolean
  provinceList: any[]
  cityList: any[]
  pickerValue: number[]
  indicatorStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  indicatorStyle: 'height: 128rpx;'
})

const emit = defineEmits(['update:show', 'confirm', 'close', 'update:pickerValue', 'provinceChange'])

// 添加一个标志，用来标记是否是因为省份变化而导致的props.pickerValue变化
const isProvinceChanging = ref(false)

// 使用本地ref来存储pickerValue，避免直接绑定到props.pickerValue导致的时序问题
const localPickerValue = ref([0, 0, 0])

// 监听props.pickerValue变化，更新本地ref
watch(() => props.pickerValue, (newVal) => {
  if (newVal) {
    console.log('props.pickerValue变化:', newVal);
    // 重置标志
    isProvinceChanging.value = false
  }
}, { immediate: true })

// 监听show变化
watch(() => props.show, async (newVal) => {
  if (newVal && props.pickerValue) {
    console.log('show变化，props.pickerValue:', props.pickerValue);
    // 使用nextTick确保DOM更新后再设置值
    await nextTick();
    // 再次使用nextTick确保列表渲染完成
    await nextTick();
    // 更新本地pickerValue
    localPickerValue.value = [...props.pickerValue];
    console.log('DOM更新后，localPickerValue:', localPickerValue.value);
  }
})

// 监听provinceList变化，确保列表渲染完成后再设置值
watch(() => props.provinceList, async (newVal) => {
  if (newVal && newVal.length > 0) {
    console.log('provinceList变化，长度:', newVal.length);
    // 使用nextTick确保DOM更新后再设置值
    await nextTick();
    // 再次使用nextTick确保列表渲染完成
    await nextTick();
    // 更新本地pickerValue
    localPickerValue.value = [...props.pickerValue];
    console.log('provinceList渲染完成后，localPickerValue:', localPickerValue.value);
  }
})

// 监听cityList变化，确保城市索引正确
watch(() => props.cityList, async (newVal) => {
  if (newVal && newVal.length > 0) {
    console.log('cityList变化，长度:', newVal.length);
    // 使用nextTick确保DOM更新后再设置值
    await nextTick();
    // 再次使用nextTick确保列表渲染完成
    await nextTick();
    // 更新本地pickerValue
    localPickerValue.value = [...props.pickerValue];
    console.log('cityList渲染完成后，localPickerValue:', localPickerValue.value);
  }
})

function handlePickerChange(e: any) {
  const val = e.detail.value
  console.log('handlePickerChange:', val)
  
  // 确保值在有效范围内
  const validProvinceIndex = Math.max(0, Math.min(val[0], props.provinceList.length - 1))
  const validCityIndex = Math.max(0, Math.min(val[2], props.cityList.length - 1))
  
  // 保存当前的省份索引，用于比较
  const currentProvinceIndex = localPickerValue.value[0]
  
  // 更新本地pickerValue
  localPickerValue.value = [validProvinceIndex, 0, validCityIndex]
  console.log('更新本地pickerValue:', localPickerValue.value)
  
  // 省份改变时，更新城市列表
  if (validProvinceIndex !== currentProvinceIndex) {
    // 设置标志，标记是因为省份变化而导致的props.pickerValue变化
    isProvinceChanging.value = true
    // 通知父组件省份改变，需要更新城市列表
    emit('provinceChange', props.provinceList[validProvinceIndex])
  }
  
  // 通知父组件pickerValue变化
  emit('update:pickerValue', [validProvinceIndex, 0, validCityIndex])
}

function handleConfirm() {
  const selectedCity = props.cityList[localPickerValue.value[2]]
  const selectedProvince = props.provinceList[localPickerValue.value[0]]
  
  emit('confirm', {
    city: selectedCity,
    province: selectedProvince,
    provinceIndex: localPickerValue.value[0],
    cityIndex: localPickerValue.value[2],
    pickerValue: localPickerValue.value
  })
  emit('update:show', false)
}

function handleClose() {
  emit('close')
  emit('update:show', false)
}

// 处理开始选择事件
function handlePickStart(e: any) {
  console.log('开始选择:', e);
}

// 处理结束选择事件
function handlePickEnd(e: any) {
  console.log('结束选择:', e);
  // 在结束选择时，确保localPickerValue与实际选中的值一致
  // 这可以解决滚动到最后一项时无法触发handlePickerChange的问题
  if (e.detail && e.detail.value) {
    const val = e.detail.value;
    // 确保值在有效范围内
    const validProvinceIndex = Math.max(0, Math.min(val[0], props.provinceList.length - 1))
    const validCityIndex = Math.max(0, Math.min(val[2], props.cityList.length - 1))
    
    console.log('handlePickEnd有效索引:', validProvinceIndex, validCityIndex);
    console.log('当前localPickerValue:', localPickerValue.value);
    
    // 检查是否有变化，避免不必要的更新
    if (localPickerValue.value[0] !== validProvinceIndex || localPickerValue.value[2] !== validCityIndex) {
      // 保存当前的省份索引，用于比较
      const currentProvinceIndex = localPickerValue.value[0];
      
      // 更新本地pickerValue
      localPickerValue.value = [validProvinceIndex, 0, validCityIndex]
      console.log('更新后的localPickerValue:', localPickerValue.value);
      
      // 通知父组件pickerValue变化
      emit('update:pickerValue', [validProvinceIndex, 0, validCityIndex]);
      
      // 省份改变时，更新城市列表
      if (currentProvinceIndex !== validProvinceIndex) {
        console.log('省份变化，通知父组件更新城市列表');
        isProvinceChanging.value = true;
        emit('provinceChange', props.provinceList[validProvinceIndex]);
      }
    }
  }
}
</script>

<style lang="less">
.city-popup-content {
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  border-radius: 28rpx 28rpx 0 0;
  overflow: hidden;
  height: 600rpx;
}

.city-popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx 30rpx 24rpx;
  position: relative;
  flex-shrink: 0;
  border-bottom:2rpx solid #f1f1f1 ;
  
  .city-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
  }
  
  .city-popup-close {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.city-picker-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  min-height: 0;
  padding: 0 60rpx;
}

.city-picker-view {
  width: 100%;
  height: 100%;
}

.indicator-class{
  height: 128rpx !important;
}

.picker-column-wide {
  flex: 1.8;
  overflow: hidden;
  position: relative;
}

.picker-column-narrow {
  flex: 1;
  overflow: hidden;
  position: relative;
  opacity: 0;
  /* 小程序兼容的深度选择器语法 */
  ::v-deep .uni-picker-view-indicator {
    opacity: 0;
    pointer-events: none ;
    display: none !important
  }
  
  ::v-deep .picker-item {
    visibility: hidden;
  }
}

.picker-item {
  padding: 0 20rpx;
  text-align: center;
  font-size: 32rpx;
  color: #CCCCCC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  line-height: 1.3;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  box-sizing: border-box;
  overflow: hidden;
  height: 128rpx !important;
  transition: all 0.2s ease;
}

.picker-item-active {
  color: #000000 !important;
  font-weight: 500 !important;
  font-size: 34rpx !important;
}

.picker-item-empty {
  height: 128rpx;
  min-height: 128rpx;
  max-height: 128rpx;
  box-sizing: border-box;
  /* 确保内容完全隐藏 */
  opacity: 0;
  pointer-events: none;
}

.city-popup-footer {
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #FFFFFF;
  flex-shrink: 0;
  
  .confirm-btn {
    width: 100%;
    height: 88rpx;
    background: #1890FF;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #FFFFFF;
  }
}
</style>
