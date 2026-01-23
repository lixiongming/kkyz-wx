<template>
  <!-- <uv-picker
    ref="Picker"
    :columns="list"
    keyName="name"
    title="选择银行卡"
    round="16"
    @confirm="confirm"
    confirmColor="#1CDAFE"
    cancelColor="#777777"
  >
  </uv-picker> -->
  <uni-popup ref="popup" type="bottom" background-color="#fff" borderRadius="20rpx 20rpx 0px 0px">
    <view class="popup-box">
      <view class="popup-title"><text class="popup-title-text">请选择你的开户行</text></view>
      <view class="search-box">
          <input placeholder="请输入开户行名称" :value="params.bank_name" @input="changeInput" @blur="searchEvent" class="search-input"/>
          <view class="search-btn" @click="searchEvent"><text class="search-text">搜索</text></view>
          <view class="close-btn" v-if="params.bank_name" @click="clearEvent">
            <uni-icons type="closeempty" size="12" ></uni-icons>
          </view>
      </view>
      <scroll-view :scroll-y="true"  :show-scrollbar="false" @scrolltolower="scrolltolower" class="scroll-box">
        <view class="scroll-list" v-if="store.bank_list.items.length>0">
            <view class="scroll-item"  @click="selectCard(item)" :class="{'scroll-item-active':current_id==item.id}" v-for="(item,index) in store.bank_list.items" :key="index"><text :class="{'scroll-item-text-active':current_id==item.id}" >{{item.bank_name}}</text></view>
        </view>
             <c-null style="height: 500rpx" v-else></c-null>
      </scroll-view>
    </view>
  </uni-popup>
  <view class="picker-box flex jc-sb flex-ac fc-111111" @click="openPicker">
    <text class="fs-28 fc-111111">{{
      card_name ? card_name : "请选择开户行"
    }}</text>
    <uv-icon size="14" name="arrow-right" color="#777777"></uv-icon>
  </view>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import addressDataJson from "/static/json/regions.json";
import { onShow } from "@dcloudio/uni-app";
import packet_store from "@/views/pages/save-money/store/modules/packet";
const store = packet_store();
const popup=ref()
const current_id=ref()
const emit = defineEmits(["update:modelValue"]);
const list = [
  [
    "中国农业银行",
    "中国交通银行",
    "中国工商银行",
    "中国平安银行",
    "中国光大银行",
    "中国建设银行",
  ],
];

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
const card_name = ref("");
const pickerValue = ref([0, 0]);

let defaultIndex = ref([]);

// // 收货地址回显
// uni.$on("location_show", function ({ data }) {
//   console.log("data", data);
//   const { province, province_code, city_code, area_code, city, area } = data;
//   city_name.value = "";
//   city_name.value = province + city + area;
//   emit("update:modelValue", [
//     { name: province, code: province_code },
//     { name: city, code: city_code },
//     { name: area, code: area_code },
//   ]);
// });



const handleInput = (e) => {
  intText.value = e;
  emit("update:modelValue", e);
  curLength.value = e?.length || 0;
};

const openPicker = () => {
  uni.$emit("input_is_foucs", false);
  popup.value.open()
};
const params=ref({
page:1,
pageSize:50,
bank_name:''
})

// 滚动到底部
const scrolltolower= async(e)=>{
  if(store.bank_list.items.length>=store.bank_list.pageInfo.total) return 
  params.value.page+=1
  await store.getBankList(params.value)
  console.log(store.bank_list.items)
}


// 表单输入
const changeInput=(e:any)=>{
params.value.bank_name=e.detail.value
}

const initData=()=>{
  store.bank_list.items=[] 
  params.value.page=1
}

// 搜索
const searchEvent=async ()=>{
  initData()
  await store.getBankList(params.value)
}
// 选择银行卡
const selectCard=(data:any)=>{
  current_id.value=data.id
  emit("update:modelValue",data.id);
  card_name.value=data.bank_name
  popup.value.close()
}
// 清除搜索内容
const clearEvent=async()=>{
   initData()
   params.value.bank_name=''
   await store.getBankList(params.value)
}
</script>
<style scoped lang="less">
.popup-box{
  padding: 32rpx;
  padding-bottom: 0px;
  .search-btn{
    width: 100rpx;
    height: 50rpx;
    background: #FF6625;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 12px;
     .search-text{
      color: #fff;
     }
  }
  .search-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 24rpx;
    .close-btn{
      position: absolute;
      width: 32rpx;
      height:32rpx;
       border: solid 2rpx #eee;
      border-radius: 32rpx;
      right: 140rpx;
    }
    .search-input{
      border: solid 2rpx #eee;
      height: 80rpx;
      padding-left: 26rpx;
      border-radius: 48rpx;
      flex-shrink: 0;
      width: 686rpx;
      padding-right: 150rpx;

    }
  }

  .scroll-box{
    margin-top: 48rpx;
    height: 300px;
    .scroll-item{
      padding: 24rpx 0px;
      background: #eee;
      margin-bottom: 24rpx;
      border-radius: 24rpx;
      text-align: center;
    }
    .scroll-item-active{
        background: #FF6625;
    }
    .scroll-item-text-active{
      color: #fff;
    }
  }
 .popup-title{
  display: flex;
  flex-direction: row;
  justify-content: center;
.popup-title-text{
  font-size: 32rpx;
  font-weight: 500;
  color: #111;
}
 }
}
.picker-box {
  height: 88rpx;
  border-radius: 16rpx;
  background: #f5f6f6;
  width: 622rpx;
  padding: 0px 32rpx;
}
</style>
