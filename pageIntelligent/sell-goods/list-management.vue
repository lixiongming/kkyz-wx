<template>
  <view :style="{ height: hei + 'px', background: '#f9f9f9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }">
    <view class="l-header-wrap df-r ai-c jc-sb">
        <template v-if="!is_manage">
            <view class="h-search df-r ai-c">
                <image
                    :src="imgUrlEvent('/images/kkyz/v3-d-search.png', 'aliyunImgUrl')"
                    class="h-icon"
                    mode="aspectFill"
                ></image>
                <input v-model="keyword" confirm-type="search" placeholder="搜索" class="input" @confirm="handleSearch" />
            </view>
            <view class="h-tips df-r ai-c">
                <text class="text" @click.stop="toPage('/pagesMine/income-record/index?tab_current=3')">我的佣金</text>
                <image
                    @click.stop="toPage('/pageIntelligent/commission-rules/index')"
                    :src="imgUrlEvent('/images/kkyz/v3-d-question.png', 'aliyunImgUrl')"
                    class="t-icon"
                    mode="aspectFill"
                ></image>
            </view>
        </template>
        <view class="h-action" v-else>
            <text class="cancel" @click="manageHandle(true)">取消</text>
        </view>
        <view class="h-search df-r ai-c manage" v-if="is_manage">
            <image
                :src="imgUrlEvent('/images/kkyz/v3-d-search.png', 'aliyunImgUrl')"
                class="h-icon"
                mode="aspectFill"
            ></image>
            <input v-model="keyword" confirm-type="search" placeholder="搜索" class="input" @confirm="handleSearch" />
        </view>
        <view class="h-action">
            <text class="text" @click="manageHandle()">{{ is_manage ? '完成' : '管理' }}</text>
        </view>
    </view>
    <scroll-view :scroll-y="true" class="l-wrap" :show-scrollbar="false" :lower-threshold="120" @scrolltolower="scrolltolower">
        <template v-if="!show_skeletons">
            <good-item :is_manage="is_manage" :is_selection="false" :select_ids="select_ids" :goodKey="index" :goods="item" v-for="(item,index) in results" @change="checkEvent" @cancle="cancleSell" :key="item.product_id"></good-item>
            <uni-load-more
                status="loading"
                iconType="circle"
                color="#007AFF"
                v-if="is_loading"
            ></uni-load-more>
        </template>
        <c-null  title="暂无带货商品" v-if="!show_skeletons && !results.length"></c-null>
        <uv-skeletons :loading="show_skeletons" v-if="show_skeletons" :skeleton="list_skeleton"></uv-skeletons>
    </scroll-view>
    <view class="l-footer df-r ai-c jc-end">
        <view class="select-btn df-r ai-c jc-c" @click="toPage('/pageIntelligent/sell-goods/selection-enter')" v-if="!is_manage">
            <text class="text">去选品</text>
        </view>
        <view class="footer-actions df-r ai-c jc-sb" v-else>
            <text class="footer-select-text" >已选{{ select_ids.length }}件</text>
            <view class="df-r ai-c jc-end" style="flex: 1;">
                <view class="default-btn df-r ai-c jc-c" @click="handle('top')">
                    <text class="text">置顶</text>
                </view>
                <view class="default-btn df-r ai-c jc-c" @click="handle('show')">
                    <text class="text">显示</text>
                </view>
                <view class="default-btn df-r ai-c jc-c" @click="handle('hide')">
                    <text class="text">隐藏</text>
                </view>
                <view class="cancel-btn df-r ai-c jc-c" @click="handle('cancel')">
                    <text class="text">取消带货</text>
                </view>
            </view>
        </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow, onHide, onShareAppMessage } from "@dcloudio/uni-app";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import GoodItem from "@/pageIntelligent/sell-goods/components/good-item.vue";
import { getMySellProductApi, operateProductApi } from '@/business/api/modules/intelligent';

const keyword = ref("");
const show_skeletons = ref(true);
const page = ref(1);
const page_size = ref(10);
const results = ref([]);
const hasNext = ref(true)
const list_skeleton = ref([{
    type: 'line',
    num: 8,
    gap: '0rpx',
    style: {
        width: '710rpx',
        height: '268rpx',
        marginLeft: '20rpx',
        marginTop: '16rpx'
    }
}]);

let hei = uni.getSystemInfoSync().windowHeight;

const shareOptions = ref({
  title: '',
  path: '',
  imageUrl: ''
})

// 动态设置当前页面路径
const setSharePath = (goods) => {
  let user_info = uni.getStorageSync('userInfo')
  //mall_uid:达人带货用户id
  shareOptions.value.path = `/pagesProduct/goods_details/index?mall_uid=${user_info.mall_uid}&share_mer_id=${goods.mer_id}&invite_code=${user_info.user_code}&id=${goods.product_id}&is_commerce=1`
  shareOptions.value.imageUrl = goods.image
  shareOptions.value.title = goods.store_name
}

// 分享给好友
onShareAppMessage((res) => {
    let goods = results.value.find(item => item.product_id == res.target.id)
    setSharePath(goods)
    return shareOptions.value
})

// 管理
const is_manage = ref(false);

const is_loading = ref(false)

const select_ids = ref([]);
const type = ref();

function manageHandle (val) {
    if(val){
        is_manage.value = false;
    }else{
        is_manage.value = !is_manage.value;
    }
    keyword.value = '';
    handleSearch()
    select_ids.value = [];
}

//搜索
function handleSearch(){
    page.value = 1;
    results.value = [];
    hasNext.value = true;
    select_ids.value = [];
    show_skeletons.value = true;
    getMySellProduct();
}

// 选中状态修改
function checkEvent (data) {
    let index = select_ids.value.indexOf(data.id);
    if(index>-1){
        select_ids.value.splice(index,1)
    }else{
        select_ids.value.push(data.id)
    }
}

//路由跳转
function toPage (url){
    uni.navigateTo({
        url
    })
}

//批量操作
function handle(data){
    type.value = data;
    operateProduct();
}


//取消带货
function cancleSell(key,data){
    type.value = key;
    select_ids.value = [data.id];
    operateProduct();
} 

//操作
function operateProduct(){
    if(select_ids.value.length==0){
        uni.showToast({
            icon: 'none',
            title: '请选择商品'
        })
        return;
    }
    operateProductApi({type: type.value,ids: select_ids.value}).then(res=>{
        if(res.code==200){
            uni.showToast({
                icon: 'none',
                title: res.message
            })
            if(type.value=='hide'||type.value=='show'){
				results.value.forEach((item,index)=>{
					if(select_ids.value.indexOf(item.id)>-1){
						// results.value[index].is_show = item.is_show==1? 2 : 1;
						results.value[index].is_show = type.value=='show' ? 1 : 2;
					}
				})
			}else if(type.value=='cancel'){
				// for (let i = results.value.length - 1; i >= 0; i--) {
				// 	let index = select_ids.value.indexOf(results.value[i].id);
				// 	if (index>-1) {
				// 		 results.value.splice(i,1);
				// 	}
				// }
				// if(!results.value.length){
					// page.value = 1;
					// hasNext.value = true;
                    // select_ids.value = [];
                    // results.value = [];
					// getMySellProduct();
				// }
                select_ids.value = [];
                if (page.value > 1) {
                    page_size.value = page.value * 10;
                    page.value = 1;
                } else {
                    if (page_size.value == 10) {
                        results.value = [];
                    }
                }
                show_skeletons.value = true;
                getMySellProduct();
			}else if(type.value=='top'){
				// select_ids.value.forEach((item,index)=> {
				// 	results.value.forEach((item1,index1)=> {
				// 		if(item==item1.id){
				// 			const data = results.value.splice(index1,1)[0];
				// 			results.value.unshift(data);
				// 		}
				// 	});
				// })
                const selectedItems = results.value.filter(item => 
                    select_ids.value.includes(item.id)
                );
                const otherItems = results.value.filter(item => 
                    !select_ids.value.includes(item.id)
                );
                results.value = [...selectedItems, ...otherItems];
			}
        }
    })
}

//滚动事件
function scrolltolower (){
    if (!hasNext.value) return;
    is_loading.value = true;
    // 处理分页数据Start
    if (page_size.value > 10) {
        page.value = (page.value * page_size.value) / 10 + 1;
        page_size.value = 10;
    } else {
        page.value += 1;
    }
    // 处理分页数据End
    getMySellProduct();
};

//数据请求
function getMySellProduct(){
    try {
        getMySellProductApi({page: page.value, page_size: page_size.value,keyword: keyword.value}).then(res=>{
            if(res.code==200){
                const data = res.data;
                if (page_size.value > 10) {
                    results.value = data.list;
                } else {
                    results.value = results.value.concat(data.list);
                }
                hasNext.value = results.value.length < data.count;
            }
            show_skeletons.value = false;
            is_loading.value = false;
        })
    } catch (error) {
        show_skeletons.value = false;
        is_loading.value = false;
    }
}

onShow(() => {
    keyword.value = "";
    if (page.value > 1) {
        page_size.value = page.value * 10;
        page.value = 1;
    } else {
        if (page_size.value == 10) {
            results.value = [];
        }
    }
    show_skeletons.value = true;
    getMySellProduct();
})

onHide(()=>{})

</script>

<style scoped lang="less">
.l-header-wrap {
    padding: 16rpx 20rpx 20rpx;
    background: #FFFFFF;
    border-radius: 30rpx 30rpx 0 0;
    min-height: 108rpx;
    .h-search {
        width: 300rpx;
        height: 72rpx;
        background: #F5F5F5;
        border-radius: 36rpx;
        padding: 0 20rpx;
        &.manage {
            width: 480rpx;
        }
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
            font-size: 24rpx;
			flex: 1;
		}
    }
    .h-tips {
        .text {
            font-weight: 600;
            font-size: 28rpx;
            color: #000000;
            display: inline-block;
            margin-right: 8rpx;
        }
        .t-icon {
            width: 32rpx;
            height: 32rpx;
        }
    }
    .h-action {
        .text {
            font-weight: 600;
            font-size: 28rpx;
            color: #000000;
        }
        .cancel {
            font-weight: 600;
            font-size: 28rpx;
            color: #FA6262;
        }
    }
}
/deep/.l-wrap {
    width: 750rpx;
    box-sizing: border-box;
    flex: 1;
    overflow-y: auto;
    background: #FFF;
    .uni-scroll-view-content {
        &:last-child {
            .good-item:last-child {
                .good-ctn {
                    margin-bottom: 16rpx;
                }
            }
        }
    }
}
.l-footer {
    width: 750rpx;
    padding: 8rpx 20rpx 40rpx;
    background: #FFFFFF;
    .select-btn {
        width: 710rpx;
        height: 90rpx;
        background: #1B9AFF;
        border-radius: 16rpx;
        .text {
            font-weight: 500;
            font-size: 30rpx;
            color: #FFFFFF;
        }
    }
    .footer-actions {
        width: 750rpx;
        padding-top: 12rpx;
        .footer-select-text {
            font-weight: 400;
            font-size: 24rpx;
            color: #A5A5A5;
        }
        .default-btn {
            width: 120rpx;
            height: 60rpx;
            background: #F5F5F5;
            border-radius: 8rpx;
            margin-left: 20rpx;
            .text {
                font-weight: 400;
                font-size: 24rpx;
                color: #000000;
            }
        }
        .cancel-btn {
            width: 140rpx;
            height: 60rpx;
            border: 2rpx solid #D3D3D3;
            border-radius: 8rpx;
            margin-left: 20rpx;
            .text {
                font-weight: 600;
                font-size: 24rpx;
                color: #000000;
            }
        }
    }
}
</style>
