<template>
  <view :style="localViewColor" v-if="tempArr?.length">
    <view>
      <view class="index-product-wrapper">
        <!-- 顶部筛选栏 -->
        <view class="nav acea-row row-middle">
          <view
            class="item"
            @click="set_where(4)"
          >
            <text class="text" :class="{ 't-color': firstKey == 4 }">综合</text>
          </view>
          <view
            class="item"
            @click="set_where(3)"
          >
            <text class="text" :class="{ 't-color': firstKey == 3 }">销量</text>
            <image
              class="sort_img"
              :class="changeSortClass('sales', sales)"
              v-if="sales == 1 || sales == 2"
              :src="imgUrlEvent('/images/kkyz/v2-sort2.png', 'aliyunImgUrl')"
            ></image>
            <image
              class="sort_img"
              v-else
              :src="imgUrlEvent('/images/kkyz/v2-sort.png', 'aliyunImgUrl')"
            ></image>
          </view>
          <view
            class="item"
            @click="set_where(1)"
          >
            <text class="text" :class="{ 't-color': firstKey == 1 }">兑换券</text>
            <image
              class="sort_img"
              :class="changeSortClass('contribution', contribution)"
              v-if="contribution == 1 || contribution == 2"
              :src="imgUrlEvent('/images/kkyz/v2-sort2.png', 'aliyunImgUrl')"
            ></image>
            <image
              class="sort_img"
              v-else
              :src="imgUrlEvent('/images/kkyz/v2-sort.png', 'aliyunImgUrl')"
            ></image>
          </view>
          <view
            class="item"
            @click="set_where(2)"
          >
            <text class="text" :class="{ 't-color': firstKey == 2 }">价格</text>

            <image
              class="sort_img"
              :class="changeSortClass('price', price)"
              v-if="price == 1 || price == 2"
              :src="imgUrlEvent('/images/kkyz/v2-sort2.png', 'aliyunImgUrl')"
            ></image>
            <image
              class="sort_img"
              v-else
              :src="imgUrlEvent('/images/kkyz/v2-sort.png', 'aliyunImgUrl')"
            ></image>
          </view>
          <image
            @click="changswitch"
            :style="{
                    width: '44rpx !important',
                    height: '44rpx !important' 
              }"
            class="icon—imgs"
            :src="
              imgUrlEvent(
                itemStyle == 1
                  ? '/images/kkyz/mall-home-icon7.png'
                  : '/images/kkyz/mall-home-icon6.png',
                'aliyunImgUrl'
              )
            "
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, defineEmits } from "vue";
import { getProductListData } from "@/business/api/modules/api.ts";
import { homeApi } from "@/business/api/index.ts";
import { HTTP_REQUEST_URL } from "@/infrastructure/config/app.js";
import {
  onLoad,
  onShow,
  onReady,
  onInit,
  onHide,
  onUnload,
} from "@dcloudio/uni-app";
import store_ from "@/business/store/modules/mall.ts";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import { decimalExchangeCoupons } from "@/infrastructure/utils/filter.js";
const Store = store_();
const props = defineProps({
  dataConfig: {
    type: Object,
    default: () => ({}),
  },
  merId: {
    type: [String, Number],
    default: "",
  },
  type:{
    type:String,
    default: "",
  }
});

const emit = defineEmits(["detail", "changeList", "changeSwitch", "statusChange", "skeletonChange"]);

const localViewColor = computed(() => {
  return Store.localViewColor;
});

const domain = HTTP_REQUEST_URL;
const tempArr = ref([]);
const numConfig =
  props.dataConfig.numConfig.val || props.dataConfig.numConfig.val;
const itemStyle = ref(props.dataConfig.itemStyle.type);
const sortType = props.dataConfig.goodsSort.type;
const type = props.dataConfig.tabConfig.tabVal || 0;
const selectId = props.dataConfig.selectConfig.activeValue || 0;
const productIds = props.dataConfig.goodsList.ids || [];
const diy_id = props.dataConfig.did;
const unique = props.dataConfig.timestamp;

const downStatus = ref(false);
const downKey = ref(0);
const downMenu = [
  { title: "综合", key: 1 },
  { title: "评分", key: 2 },
  { title: "新品", key: 3 },
];

const where = ref({
  cate_id: "",
  order: "incubation_sort_desc",
  price_on: "",
  price_off: "",
  brand_id: "",
  keyword: "",
  is_trader: "",
  page: 1,
  limit: 30,
});

const sales = ref(0);
const contribution = ref(0);
const price = ref(0);
const firstKey = ref(4);
const tabIndex = ref(1);
const proLoading = ref(false);
const isScroll = ref(true);

onShow(() => {
  // console.log(222)
});

onMounted(() => {
  switch (props.dataConfig.goodsSort.type) {
    case 1:
      where.value.order = "sales";
      break;
    case 2:
      where.value.order = "incubation_sort_desc";
      break;
    case 3:
      where.value.order = "contribution_desc";
      break;
    default:
      where.value.order = "incubation_sort_desc";
      break;
  }

  productslist();

  if (type === 0) {
    uni.$on("product_load_more", productslist);
  }
});

const changswitch = () => {
  itemStyle.value = itemStyle.value === 0 ? 1 : itemStyle.value === 1 ? 0 : 1;
  emit("changeSwitch", itemStyle.value);
};

const set_where = (e) => {
  downStatus.value = false;
  if (e === 4 && e === firstKey.value) {
    return;
  }

  switch (e) {
    case 1:
      firstKey.value = e;
      price.value = 0;
      sales.value = 0;
      if (contribution.value === 0) {
        contribution.value = 1;
        where.value.order = "contribution_asc";
      } else if (contribution.value === 1) {
        contribution.value = 2;
        where.value.order = "contribution_desc";
      } else if (contribution.value === 2) {
        contribution.value = 0;
        where.value.order = "";
      }
      where.value.page = 1;
      productslist();
      break;
    case 2:
      contribution.value = 0;
      sales.value = 0;
      firstKey.value = e;
      if (price.value === 0) {
        price.value = 1;
        where.value.order = "incubation_sort_desc";
      } else if (price.value === 1) {
        price.value = 2;
        where.value.order = "price_desc";
      } else if (price.value === 2) {
        price.value = 0;
        where.value.order = "";
      }
      where.value.page = 1;
      productslist();
      break;
    case 3:
      price.value = 0;
      contribution.value = 0;
      if (sales.value == 0) {
        sales.value = 1;
        where.value.order = "sales_desc";
      } else if (sales.value == 1) {
        sales.value = 2;
        where.value.order = "sales_asc";
      } else if (sales.value == 2) {
        sales.value = 0;
        where.value.order = "";
      }
      where.value.page = 1;
      productslist();
      firstKey.value = e;
      break;
    case 4:
      price.value = 0;
      contribution.value = 0;
      where.value.order = "incubation_sort_desc";
      where.value.page = 1;
      productslist();
      firstKey.value = e;
      break;
  }
};

const bindRight = () => {
  price.value = 0;
  firstKey.value = 4;
};

const computedPrice = (num) => {
  let price = String(num);
  if (Number(num) === 0 || Number(num) !== Number(num)) return [0];
  if (price === null) return [0];
  let arr = price.split(".");
  return arr;
};

const productslist = (isScrollLoad = false) => {
  if (!isScroll.value && isScrollLoad) return;
  if (proLoading.value) return;

  proLoading.value = true;
  let data = {};

  if (type === 1) {
    data = {
      diy_id: diy_id,
      unique: unique,
      mer_id: props.merId,
      product_ids: productIds.toString(),
      limit: productIds.length,
      page: where.value.page,
    };
  } else {
    data = {
      diy_id: diy_id,
      unique: unique,
      mer_id: props.merId,
      order: sortType === 2 ? "incubation_sort_desc" : sortType === 1 ? "sales" : "",
      limit: numConfig,
      page: where.value.page,
    };

    if (props.merId) {
      data.mer_cate_id = selectId.toString();
    } else {
      data.cate_pid = selectId.toString();
    }
  }

  data.order = where.value.order;

  if (isScrollLoad) {
    where.value.page += 1;
    data.page = where.value.page;
  } else {
    emit("skeletonChange",true)
    where.value.page = 1;
  }
  emit("statusChange",true)
  homeApi.getMallSpuLst(data).then((res) => {
    let productList = res.data.list;
    if (isScrollLoad) {
      let list = res.data.list;
      productList = tempArr.value.concat(list);
    } else {
      isScroll.value = true;
    }

    proLoading.value = false;
    emit("statusChange",false)
    !isScrollLoad && emit("skeletonChange",false)
    tempArr.value = productList;
    
    emit("changeList", tempArr.value, res.data.count);
  }).catch(err => {
      emit("statusChange",false)
      !isScrollLoad && emit("skeletonChange",false)
      proLoading.value = false;
		});;
};

uni.$on("loadmore_bottom", () => {
  productslist(true);
});
const changeSortClass = (name, type) => {
  switch (type) {
    case 1:
      return "up";
    case 2:
      return "down";
    default:
      return "";
  }
};
</script>
<style lang="scss" scoped>
.index-product-wrapper {
  margin-top: 24rpx;
  width: 710rpx;
}
.nav {
  flex-direction: row;
  padding: 0 20rpx;
  // height: 100rpx;
  height: 50rpx;
  margin-bottom: 16rpx;
  color: var(--view-noSelectColor);
  font-size: 28rpx;
  // background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav .item {
  display: flex;
  align-items: center;
  flex-direction: row;
  // justify-content: center;
  justify-content: space-between;
  // flex: 1;
  .text {
    font-size: 24rpx;
    color: #111111;
  }
  .spin {
    display: block;
    transform: rotate(180deg);
    font-size: 36rpx;
  }
}
.t-color {
  color: #1B9AFF;
}
.nav .item .t-color {
  color: #1B9AFF;
}
.nav .item image {
  width: 15rpx;
  height: 19rpx;
  margin-left: 10rpx;
}
.nav .item {
  font-size: 24rpx;
  flex-shrink: 0;
}
.nav .item {
  &.iconfont {
    font-size: 28rpx;
  }
}

.nav .item .sort_img {
  width: 28rpx;
  height: 28rpx;
  margin-left: 4rpx;
  &.up {
    transform: rotate(0deg);
  }
  &.down {
    transform: rotate(180deg);
  }
}
</style>
