<template>
  <view :style="viewColor">
	<view
      class="mask"
      catchtouchmove="true"
      v-if="isShow"
      @tap="close"
    ></view>
    <view class="address-window" :class="isShow == true ? 'on' : ''">
      <view class="title"
        >请选择所在地区<text class="iconfont icon-guanbi" @tap="close"></text
      ></view>
      <view class="address-count">
        <view class="address-selected">
          <view
            v-for="(item, index) in selectedArr"
            :key="index"
            class="selected-list"
            :class="{ active: index === selectedIndex }"
            @click="change(item.parent_id, index)"
          >
            {{ item.name }}
            <text class="iconfont icon-xiangyou"></text>
          </view>
          <view
            class="selected-list"
            :class="{ active: -1 === selectedIndex }"
            v-if="showMore"
            @click="change(-1, -1)"
          >
            <text class="iconfont icon-xiangyou"></text>
            请选择
          </view>
        </view>
        <scroll-view
          scroll-y="true"
          :scroll-top="scrollTop"
          class="address-list"
          @touchmove.stop.prevent
          @scroll="scroll"
        >
          <view
            v-for="(item, index) in addressList"
            :key="index"
            class="list"
            :class="{ active: item.id === activeId }"
            @click="selected(item)"
          >
            <text class="item-name">{{ item.name }}</text>
            <text
              v-if="item.id === activeId"
              class="iconfont icon-duihao2"
            ></text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  watch,
  nextTick,
  computed,
  onMounted,
} from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getCityV2Api } from "@/business/api/modules/api-new";
import store from '@/business/store/modules/mall';
const Store = store();
const CACHE_ADDRESS = {};
const props = defineProps({
  isShow: {
    type: Boolean,
    default: true,
  },
  address: {
    type: Object,
    default: {},
  },
});

const active = ref(0);
const addressList = ref([]);
const selectedArr = ref([]);
const selectedIndex = ref(-1);
const is_loading = ref(false);
const old = ref({ scrollTop: 0 });
const scrollTop = ref(0);
const viewColor = computed(() => {
  return Store.viewColor;
});
const emits = defineEmits(["submit","changeClose"]);

const activeId = computed(()=>{
	return selectedIndex.value == -1 ? 0 : selectedArr.value[selectedIndex.value].id
})

const showMore = computed(()=>{
	return selectedArr.value.length ? selectedArr.value[selectedArr.value.length - 1].snum > 0 : true
})

watch(() => props.address, (n) => {
    selectedArr.value = n ? [...n] : []
})

onMounted(()=>{
	loadAddress(0)
})

function change(pid,index){
	if(selectedIndex.value == index) return;
	if(pid === -1){
		pid = selectedArr.value.length ? selectedArr.value[selectedArr.value.length -1].id : 0;
	}
	selectedIndex.value = index;
	loadAddress(pid);
}

function loadAddress(pid){
	if(CACHE_ADDRESS[pid]){
		addressList.value = CACHE_ADDRESS[pid];
		return ;
	}
	is_loading.value = true;
	getCityV2Api({ pid }).then(res=>{
		is_loading.value = false;
		CACHE_ADDRESS[pid] = res.data;
		addressList.value = res.data;
	})
	goTop()
}

function selected(item){
	if(is_loading.value) return;
	if(selectedIndex.value > -1){
		selectedArr.value.splice(selectedIndex.value + 1,999)
		selectedArr.value[selectedIndex.value] = item;
		selectedIndex.value = -1;
	}else if(!item.parent_id){
		selectedArr.value = [item];
	}else{
		selectedArr.value.push(item);
	}
	if(item.snum){
		loadAddress(item.id);
	} else {
		emits('submit', [...selectedArr.value]);
		emits('changeClose');
	}
	goTop()
}

//关闭
function close() {
	emits('changeClose');
}

//滚动
function scroll(e) {
	old.value.scrollTop = e.detail.scrollTop
}

//回到顶部
const goTop = () =>{
	scrollTop.value = old.value.scrollTop
	// await nextTick()
	scrollTop.value = 0
}
</script>

<style scoped lang="scss">
.address-window {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 101;
  border-radius: 30rpx 30rpx 0 0;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
}
.address-window.on {
  transform: translate3d(0, 0, 0);
}
.address-window .title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  height: 123rpx;
  line-height: 123rpx;
  position: relative;
}
.address-window .title .iconfont {
  position: absolute;
  right: 30rpx;
  color: #8a8a8a;
  font-size: 35rpx;
}
.address-count {
  .address-selected {
    padding: 0 30rpx;
    margin-top: 10rpx;
    position: relative;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f7f7f7;
  }
  .selected-list {
    font-size: 26rpx;
    color: #282828;
    line-height: 50rpx;
    padding-bottom: 10rpx;
    padding-left: 60rpx;
    position: relative;
    &.active {
      color: #e28d54;
    }
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
    }
    &:before {
      width: 4rpx;
      height: 100%;
      background-color: var(--view-theme);
      top: 0;
      left: 10rpx;
    }
    &:after {
      width: 12rpx;
      height: 12rpx;
      background: var(--view-theme);
      border-radius: 100%;
      left: 6rpx;
      top: 50%;
      margin-top: -8rpx;
    }
    &:first-child,
    &:last-child {
      &:before {
        height: 50%;
      }
    }
    &:first-child {
      &:before {
        top: auto;
        bottom: 0;
      }
    }
    .iconfont {
      font-size: 20rpx;
      float: right;
      color: #dddddd;
    }
  }
  scroll-view {
    height: 550rpx;
  }
  .address-list {
    padding: 0 30rpx;
    margin-top: 20rpx;
    box-sizing: border-box;
    .list {
      .iconfont {
        float: right;
        color: #ddd;
        font-size: 22rpx;
      }
      .item-name {
        display: inline-block;
        line-height: 50rpx;
        margin-bottom: 20rpx;
        font-size: 26rpx;
      }
      &.active {
        color: #e28d54;
        .iconfont {
          color: #e28d54;
        }
      }
    }
  }
}
.mask{
	z-index: 99;
}
</style>
