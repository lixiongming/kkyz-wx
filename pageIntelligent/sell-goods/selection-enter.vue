<template>
  <view :style="{ height: hei + 'px', background: '#f9f9f9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }">
    <view class="h-search df-r ai-c">
        <image
            :src="imgUrlEvent('/images/kkyz/v3-d-search.png', 'aliyunImgUrl')"
            class="h-icon"
            mode="aspectFill"
        ></image>
        <input v-model="params.keyword" confirm-type="search" placeholder="搜索" class="input" @confirm="handleSearch" />
    </view>

    <view class="h-nav">
      <uv-tabs
        @change="navTabChange"
        :current="tab_current"
        :inactiveStyle="{
          color: '#000000',
          fontWeight: 600,
          fontSize: '28rpx',
        }"
        :activeStyle="{
          color: '#1B9AFF',
          fontWeight: 600,
          fontSize: '28rpx',
        }"
        :itemStyle="{ height: '70rpx', padding: '0rpx 44rpx' }"
        lineHeight="4"
        lineWidth="20"
        lineColor="#1B9AFF"
        :scrollable="true"
        :list="tab_list"
        keyName="cate_name"
      ></uv-tabs>
    </view>

    <view class="h-select df-r ai-c">
        <view class="select-item df-r ai-c jc-c" :class="select_current == index ? 'active' : ''" :key="index" v-for="(item,index) in select_list" @click="selectEvent(index,item.value)">
            <text class="text">{{ item.name }}</text>
            <view class="sort-box" v-if="index == 3">
                <view class="sort-item" :class="select_current == index ? params.sell_order == 'price_asc' ? 'active' : '' : ''"></view>
                <view class="sort-item2" :class="select_current == index ? params.sell_order == 'price_desc' ? 'active' : '' : ''"></view>
            </view>
        </view>
    </view>

    <scroll-view :scroll-y="true" class="l-wrap" :show-scrollbar="false" :lower-threshold="120" @scrolltolower="scrolltolowerHandle">
        <template v-if="!show_skeletons">
            <good-item :is_sell="true" :is_selection="true" :goods="item" @child="childEvent(index,$event)" v-for="(item,index) in good_list" :key="index"></good-item>
            <uni-load-more
                status="loading"
                iconType="circle"
                color="#007AFF"
                v-if="is_loading"
            ></uni-load-more>
            <view style="height: 40rpx;background: transparent;"></view>
        </template>
        <c-null v-if="!show_skeletons && !good_list.length"></c-null>
        <uv-skeletons :loading="show_skeletons" v-if="show_skeletons" :skeleton="list_skeleton"></uv-skeletons>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import GoodItem from "@/pageIntelligent/sell-goods/components/good-item.vue";
import { selectionProductListApi, addSellProductApi, getCategoryListApi } from "@/business/api/modules/intelligent.ts";

const tab_current = ref(-1);

let hei = uni.getSystemInfoSync().windowHeight;

const tab_list = ref([
  { name: "全部", disabled: false, id: 1 },
  { name: "食品", disabled: false, id: 2 },
  { name: "服饰", disabled: false, id: 3 },
  { name: "箱包", disabled: false, id: 4 },
  { name: "生鲜", disabled: false, id: 5 },
]);

const show_skeletons = ref(true);

const list_skeleton = ref([{
    type: 'line',
    num: 8,
    gap: '0rpx',
    style: {
        width: '710rpx',
        height: '212rpx',
        marginLeft: '20rpx',
        marginTop: '16rpx'
    }
}]);

// 列表参数
const params = ref({
    page: 1,
    page_size: 10,
    cate_id: '',
    keyword: '',
    sell_order: 'recommend'
})

const is_scroll = ref(true)
const good_list = ref([])

const select_list = ref([
    {
        name: '推荐',
        value: 'recommend'
    },
    {
        name: '高佣金',
        value: 'brokerage'
    },
    {
        name: '热销',
        value: 'sales'
    },
    {
        name: '价格',
        // price_asc 价格升序|price_desc 价格降序
        value: 'price_asc'
    },
])

const select_current = ref(0);

const is_loading = ref(false)

// 重置
function reset () { 
    good_list.value = []
    is_scroll.value = true
    params.value.page = 1
    params.value.page_size = 10
}

// 关键字搜索
function handleSearch () {
    show_skeletons.value = true
    reset()
    getList()
}

function navTabChange (data) {
    tab_list.value.forEach((item,index) => {
        if (index == data.index) {
            item.disabled = false;
        } else {
            item.disabled = true;
        }
    })
    show_skeletons.value = true
    tab_current.value = data.index;
    reset()
    params.value.cate_id = tab_list.value[data.index].store_category_id
    getList()
}

// 筛选
function selectEvent (index, value) {
    if (show_skeletons.value) return;
    show_skeletons.value = true;
    select_current.value = index;
    reset()
    if (index == 3) {
        params.value.sell_order == 'price_asc' ? params.value.sell_order = 'price_desc' : params.value.sell_order = 'price_asc'
    } else {
        params.value.sell_order = value;
    }
    getList()
}

async function getList () {
    try {
        let res = await selectionProductListApi(params.value);
        if (params.value.page_size > 10) {
            good_list.value = res.data.list;
        } else {
            good_list.value = good_list.value.concat(res.data.list);
        }

        is_scroll.value = (res.data.count > good_list.value.length)

        show_skeletons.value = false
        is_loading.value = false;
        tab_list.value.forEach(item => item.disabled = false)
    } catch (error) {
        show_skeletons.value = false;
        is_loading.value = false;
        tab_list.value.forEach(item => item.disabled = false)
    }
}

// 带货
async function childEvent (index) {
    try {
        let res = await addSellProductApi({ product_id: good_list.value[index].product_id });
        uni.showToast({
            icon: 'none',
            title: '带货成功'
        })
        // good_list.value.splice(index,1)
        // // 列表数据全部删除重新获取数据
        // if (!good_list.value.length) {
        //     params.value.page_size = params.value.page * 10;
        //     params.value.page = 1;
        //     getList();
        // }

        if (params.value.page > 1) {
            params.value.page_size = params.value.page * 10;
            params.value.page = 1;
        } else {
            if (params.value.page_size == 10) {
                good_list.value = [];
            }
        }
        getList();

    } catch (error) {}
}

function scrolltolowerHandle () {
    if (!is_scroll.value) return;
    is_loading.value = true;
    // 处理分页数据Start
    if (params.value.page_size > 10) {
        params.value.page = (params.value.page * params.value.page_size) / 10 + 1;
        params.value.page_size = 10;
    } else {
        params.value.page += 1;
    }
    // 处理分页数据End
    getList();
}

// 分类
async function getCategoryList () {
    let res = await getCategoryListApi({});
    tab_list.value = res.data.map(item => {
        return {
            ...item,
            disabled: false
        }
    })
    tab_list.value.unshift({
        cate_name: '全部',
        store_category_id: '',
        disabled: false
    })
}

onShow(() => {
    if (params.value.page > 1) {
        params.value.page_size = params.value.page * 10;
        params.value.page = 1;
    } else {
        if (params.value.page_size == 10) {
            good_list.value = [];
        }
    }
    show_skeletons.value = true;
    getList()
})
onLoad(() => {
    getCategoryList()
})

</script>
<style scoped lang="less">
.h-search {
    width: 710rpx;
    height: 72rpx;
    background: #F5F5F5;
    border-radius: 36rpx;
    padding: 0 20rpx;
    margin-left: 20rpx;
    .h-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 8rpx;
    }
    .input-placeholder {
        font-weight: 400;
        font-size: 24rpx;
        color: #D3D3D3;
    }
    
    .input {
        flex: 1;
        font-size: 24rpx;
    }
}

.h-nav {
  width: 750rpx;
  height: 70rpx;
  background: #F9F9F9;
  margin-bottom: 8rpx;
}

.h-select {
    padding: 24rpx 28rpx 8rpx;
    background: #FFFFFF;
    border-radius: 30rpx 30rpx 0 0;
    .select-item {
        width: 140rpx;
        height: 56rpx;
        background: #F5F5F5;
        border-radius: 30rpx;
        margin-right: 20rpx;
        .text {
            font-weight: 400;
            font-size: 24rpx;
            color: #000000;
        }
        .sort-box {
            margin-left: 12rpx;
            .sort-item {
                width: 10rpx;
                height: 10rpx;
                border: 2rpx solid #999;
                border-right: transparent;
                border-bottom: transparent;
                transform: rotate(45deg);
                &.active {
                    border-color: #fff;
                }
            }
            .sort-item2 {
                width: 10rpx;
                height: 10rpx;
                border: 2rpx solid #999;
                border-right: transparent;
                border-bottom: transparent;
                transform: rotate(-135deg);
                &.active {
                    border-color: #fff;
                }
            }
        }
        &.active {
            background: #1B9AFF;
            .text {
                color: #FFFFFF;
            }
        }
    }
}

/deep/.l-wrap {
    width: 750rpx;
    box-sizing: border-box;
    flex: 1;
    overflow-y: auto;
    background: #FFF;
}

/deep/.uv-tabs__wrapper__nav__item__text--disabled {
    color: #000000 !important;
}
</style>
