<template>
  <c-main classs="bg-c9">
    <!-- 头部背景 -->
    <image mode="aspectFill" class="expert-mentor-bg" :src="$imgUrl('/images/save-money/expert-mentor-bg.png')"></image>
    <!-- 头部模块 -->
    <!-- <c-header title="分红记录" bg_color="transparent" :extra_warp_styles="{ paddingTop: 50 + 'px'}"></c-header> -->
    <Inav title="分红记录" bgcolor="transparent"></Inav>
    <!-- 内容模块 -->
    <view class="expert-mentor" :style="{ height: hei - 76 + 'px'}">
        <view class="team-wrap-box">
            <view class="team-box">
                <image class="list-mask" :src="$imgUrl('/images/save-money/video-matrix-mask1.png')"></image>
                <view class="team-content" :style="{ height: hei - 76 - 30 + 'px'}">
                    <view class="tab-list flex flex-ac jc-start">
                        <view class="tab-item" :class="current_tab_index == i ? 'active' : ''" @click="tabChange(i)" v-for="(item, i) in tab_info" :key="item.title">{{item.title}}</view>
                    </view>
                    <view class="list-box">
                        <view class="list-title flex">
                            <view class="line-row" :class="field.class_name" v-for="(field, i) in tab_info[current_tab_index].list_fields" :key="field.name">{{field.name}}</view>
                        </view>
                        <scroll-view v-if="list?.length > 0" :scroll-y="true" :show-scrollbar="false" :style="{ height: hei - 76 - 30 - 120 + 'px'}" :lower-threshold="100" @scrolltolower="updateRankingList">
                            <view class="list-content flex flex-column">
                                <view class="list-item flex flex-ac" v-for="item in list" :key="item.nickname">
                                    <template v-for="(v, j) in tab_info[current_tab_index].list_fields" :key="v.name">
                                        <view class="item-row flex flex-ac" :class="v.class_name" v-if="v.field_name?.length > 1">
                                            <image class="item-user-avatar" :src="item[v.field_name[0]]" @click="lookUser(item)"></image>
                                            <view class="item-user-name nowrap">{{item[v.field_name[1]]}}</view>
                                        </view>
                                        <view class="item-row" :class="v.class_name" v-else>{{item[v.field_name[0]]}}</view>
                                    </template>
                                    
                                </view>
                            </view>
                            <uni-load-more
                                v-if="list.length > 9"
                                :status="loadStatus"
                                :contentText="contentTextObj"
                            ></uni-load-more>
                        </scroll-view>
                        <c-null height="250" v-else></c-null>
                    </view>
                </view>
            </view>
            
        </view>
    </view>

  </c-main>

  <!-- 达人导师说明 -->
  <custom-popup ref="popup_expert_mentor" title="视频号达人导师任务说明" :show_button="false">
    <view class="expert-mentor-content">
        <view class="expert-mentor-description">
            <uv-parse
                :content="mentor_content"
                :tagStyle="styles"
            ></uv-parse>
        </view>
        <view class="expert-mentor-description platform-description">
            <view class="description-title">重要提示</view>
            <view class="platform-text">
                平台禁止任何形式的虚假交易，平台保留对此行为的冻结收益或封号处理的权利;
            </view>
        </view>
    </view>
</custom-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { onLoad, onShow, onReady, onInit, onHide, onUnload, onBackPress } from "@dcloudio/uni-app";
// 使用mission模块store
import mission_use_store from '/views/pages/save-money/store/modules/mission.ts'
// 使用mine模块store
import mine_use_store from '@/views/pages/save-money/store/modules/mine.ts'
// 使用老版mine模块store
import old_mine_use_store from "@/business/store/modules/mine";
// 使用自定义弹窗组件
import customPopup from '@/views/pages/save-money/views/components/custom-popup.vue'
// 引入老版mine模块api
import { mineApi } from '@/business/api/index.ts'
// 使用日期格式化函数
import { dateformat } from "@/infrastructure/utils/moment-format.js";
import Inav from "@/views/components/i-nav.nvue";

// 生成对应store模块实例
const mission_store = mission_use_store();
const mine_store = mine_use_store();
const old_mine_store = old_mine_use_store();
const hei = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().safeAreaInsets.bottom;
const statusHeight = uni.getSystemInfoSync().statusBarHeight;

// 团队最少有多少人成功达人导师
const min_num_team = 3;
const styles = {
    li: "font-size:24rpx;margin:0rpx;padding-bottom: 32rpx;line-height:1.5;word-wrap: break-word;overflow-wrap: break-word;",
    ul: "padding-left: 40rpx;"

};
// 达人导师说明
const mentor_content = ref('');
// 达人导师说明弹窗
const popup_expert_mentor = ref(false);
// 我的达人导师信息
// const my_expert_mentor_info = ref(null);
// tab切换信息
const tab_info = ref([
    // {   index: 0, 
    //     title: '导师分红记录', 
    //     list_fields: [
    //         { name: '序号', class_name: 'flex-2 left', field_name: ['index'] },
    //         { name: '头像/昵称', class_name: 'flex-5 left', field_name: ['avatar', 'nickname'] },
    //         { name: '米粒', class_name: 'flex-4 center', field_name: ['num'] },
    //         { name: '日期', class_name: 'flex-4 right', field_name: ['created_at'] },
    //     ]
    // },
    { 
        index: 1, 
        title: '团长分红记录', 
        list_fields: [
            { name: '序号', class_name: 'flex-2 left', field_name: ['index'] },
            { name: '头像/昵称', class_name: 'flex-5 left', field_name: ['avatar', 'nickname'] },
            { name: '兑换券', class_name: 'flex-4 center', field_name: ['num'] },
            { name: '日期', class_name: 'flex-4 right', field_name: ['created_at'] },
        ]
    },
])
// 当前选中的tab
const current_tab_index = ref(0);
// 列表数据
const list = ref([]);
// 我的达人团队列表
const my_team_list = ref({});
// 团队排行榜列表
const team_ranking_list = ref({});
// 列表下拉加载提示
const contentTextObj = ref({
  contentdown: "上拉显示更多",
  contentrefresh: " ",
  contentnomore: "没有更多数据了",
});
// 列表下拉加载状态
let loadStatus = ref("more");
// 排行榜请求参数
const pageInfo = ref({
    // 页码
    page: 1,
    // 每页条数
    pageSize: 20,
    // 是否还有剩余数据的状态
    status: true,
})
// 加载状态
const loading = ref(false);
// 分享url
const share_url = ref('');

onShow(() => {
    // 获取列表信息
    initPageList();
})

// 根据当前达人信息，获取当前达人导师提示信息
const expert_mentor_tip_content = computed(() => {
    return my_team_list.value?.pageInfo?.total >= min_num_team ? '恭喜您，晋级为达人导师!' : `还差 ${min_num_team - my_team_list.value?.pageInfo?.total} 位达人，晋级为达人导师!`;
})


// 列表统计
function statisticalQuantity(index) {
    return index == 1 ? team_ranking_list.value?.pageInfo?.total : my_team_list.value?.pageInfo?.total;
}

// 设置团队排行榜下拉加载状态的数据
function setRankingDownStatusInfo (res, is_clear) {
    if (is_clear) {
        pageInfo.value.status = true;
        pageInfo.value.page = 1;
        return;
    }
    pageInfo.value.status = pageInfo.value.page < res.pageInfo.totalPage;
    pageInfo.value.page++;
}

// 切换tab
async function tabChange(index) {
    if (current_tab_index.value == index)  return;
    let data = await getExpertShareProfitList({ page: 1, pageSize: 20, type: index + 1});
    console.log("data--->0", data)
    // 设置团队排行榜下拉加载状态的数据
    setRankingDownStatusInfo(data, index != 1);
    list.value = handleFilterData(data, index);
    current_tab_index.value = index;
}


// 描述按钮点击
function explainClick() {
    popup_expert_mentor.value.open();
}

// 格式化整数位
function formatToWan(num) {
    if (num >= 10000) {
        return Math.floor(num / 10000 * 100) / 100 + "万";
    } else {
        // return Math.floor(num * 1);
        return get_value_len(num);
    }
}

// 格式化小数位
function get_value_len(data) {
    // 转换价值(米粒)小数省略
    const parts = data.toString().split('.');
    const len = parts.length > 1 ? parts[1].length : 0;
    let num
    if (len > 4) {
        num = len - 4
        return parts[0] + '.' + parts[1].slice(0, 1) + '{' + num + '}' + parts[1].slice(parts[1].length - 3,
            parts[1].length)
    } else {
        return data
    }
}

// 返回数据处理
function handleFilterData(data, cur_index, list_array) {
    // let test_data = data.items.concat(data.items, data.items, data.items);
    // 初始化索引
    let init_index = 0;
    if (list_array) {
        init_index = list_array.length;
    }
    return data.items?.map((item, i) => {
        let user_info = item.user;
        // if (cur_index == 0) {
        //     user_info = item.sub_user;
        // }
        // 当前用户id
        // user_info.cur_user_id = user_info.id;
        // 日期格式化
        if (item.created_at) {
            item.created_at = dateformat(item.created_at, "yyyy-MM-DD");
        }
        // 米粒和兑换券
        if(item.num) {
            item.num = formatToWan(item.num);
        }
        return { ...user_info, ...item, index: init_index + i + 1 }
    })
}

// 初始化页面列表数据
async function initPageList() {
    if (current_tab_index.value == 0) {
        my_team_list.value = await getExpertShareProfitList({ page: 1, pageSize: 20, type: current_tab_index.value + 2});
    } else {
        team_ranking_list.value = await getExpertShareProfitList({ page: 1, pageSize: 20, type: current_tab_index.value + 1});
    }
    let data3 = current_tab_index.value == 0 ? my_team_list.value : team_ranking_list.value;
    // 设置团队排行榜下拉加载状态的数据
    setRankingDownStatusInfo(data3, current_tab_index.value == 0);
    list.value = handleFilterData(data3, current_tab_index.value);
}

// 获取分红记录
async function getExpertShareProfitList(params = { page: 1, pageSize: 20}) {
    return await mission_store.getExpertShareProfitList(params);
}

// 团队排行榜-下拉更新
async function updateRankingList() {
    const isLogin = uni.getStorageSync("isLogin");
    if (!isLogin) return;
    console.log("pageInfo.value.status--->", pageInfo.value.status);
    if (!pageInfo.value.status) return;
    if (loading.value) return
    loadStatus.value = "loading";
    loading.value = true
    try {
        const res = await getExpertShareProfitList({ 
            page: pageInfo.value.page,
            pageSize: pageInfo.value.pageSize,
            type: current_tab_index.value + 1,
        });
        loading.value = false
        let page_datas = handleFilterData(res, 1, list.value)
        console.log("page_datas-->", page_datas);
        list.value = list.value.concat(page_datas);
        setRankingDownStatusInfo(res);
        if (!pageInfo.value.status) {
            loadStatus.value = "noMore";
        } else {
            loadStatus.value = "more";
        }
    } catch(e) {
        loading.value = false
    }
    
}

// 跳转用户个人主页
function lookUser(user) {
    // #ifdef APP-PLUS
    if (current_tab_index.value == 0) {
        uni.navigateTo({
            url: "/views/pages/mine/user-page?user_id=" + user.cur_user_id,
        });
    }
    // #endif
}
</script>

<style lang="less" scoped>
.expert-mentor-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 648rpx;
    width: 750rpx;
}
.expert-mentor-description {
    border-radius: 32rpx;
    background: #F8F8F8;
    padding: 32rpx;
    &.platform-description {
        margin-top: 32rpx;
        .description-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #333;
            margin-bottom: 32rpx;
        }
        .platform-text {
            color: rgb(149, 165, 166);
            font-size: 24rpx;
            padding-bottom: 32rpx;
        }
    }
}
.expert-mentor {
    padding: 16rpx 32rpx 32rpx;
    position: relative;
    .user-box {
        width: 686rpx;
        height: 224rpx;
        border-radius: 48rpx;
        padding: 32rpx;
        position: relative;
        z-index: 1;
        .expert-mentor-head-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 686rpx;
            height: 224rpx;
            z-index: 1;
        }
        .user-info {
            position: relative;
            z-index: 2;
            .info-box {
                .user-avatar-wrap {
                    width: 76rpx;
                    height: 76rpx;
                    border-radius: 50%;
                    border: 2rpx solid #FFF;
                    margin-right: 24rpx;
                    .user-avatar {
                        width: 72rpx;
                        height: 72rpx;
                        border-radius: 50%;
                        
                    }
                }
                
                .user-name {
                    color: #ffffff;
                    font-size: 28rpx;
                    font-weight: 600;
                    max-width: 340rpx;
                }
            }
            .user-identity {
                .user-level {
                    .level-title {
                        color: #ffffff;
                        font-size: 20rpx;
                        font-weight: 400;
                    }
                    .level-num {
                        color: #ffffff;
                        font-size: 48rpx;
                        font-weight: 600;
                        margin-left: 24rpx;
                    }
                    
                }
                .user-identity-desc {
                    color: #ffffff;
                    font-size: 28rpx;
                    font-weight: 600;
                    text-align: right;
                }
            }
        }
        .mentor-info {
            position: relative;
            z-index: 2;
            text-align: center;
            height: 56rpx;
            line-height: 56rpx;
            background: rgba(255, 255, 255, 0.3);
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            border-radius: 24rpx;
        }
    }
    .team-wrap-box {
        position: relative;
        z-index: 2;
        margin-top: -16rpx;
        padding-top: 32rpx;
        background: transparent;
        .vertical-line {
            position: absolute;
            top: 0;
            width: 12rpx;
            height: 48rpx;
            border-radius: 8rpx;
            background: #FFDFBB;
            z-index: 9;
            &.line-left {
                left: 96rpx;
            }
            &.line-right {
                right: 96rpx;
            }
        }
        .team-box {
            position: relative;
            border: 4rpx solid #FFF;
            background-color: #FFF;
            border-radius: 48rpx;
            width: 686rpx;
            .list-mask {
                position: absolute;
                height: 400rpx;
                width: 678rpx;
                top: 0;
                left: 0;
                z-index: 1;
            }
            .team-content {
                position: relative;
                z-index: 2;
                padding: 48rpx 32rpx;
                .tab-list {
                    .tab-item {
                        height: 64rpx;
                        line-height: 64rpx;
                        text-align: center;
                        padding: 0 24rpx;
                        background: #FFF;
                        border-radius: 16rpx;
                        color: #777777;
                        font-size: 24rpx;
                        font-weight: 400;
                        margin-right: 24rpx;
                        &.active {
                            color: #FFF;
                            background: linear-gradient(to right, #FF3221, #FFA32A);
                        }
                    }
                }
                .list-box {
                    .list-title {
                        margin-top: 64rpx;
                        .line-row {
                            color: #ce7f39;
                            font-size: 20rpx;
                            font-weight: 400;
                            &.flex-1 {
                                flex: 1;
                                flex-shrink: 0;
                            }
                            &.flex-2 {
                                flex: 2;
                                flex-shrink: 0;
                            }
                            &.flex-4 {
                                flex: 4;
                                flex-shrink: 0;
                            }
                            &.flex-5 {
                                flex: 5;
                                flex-shrink: 0;
                            }
                            &.left {
                                text-align: left;
                            }
                            &.right {
                                text-align: right;
                            }
                            &.center {
                                text-align: center;
                            }
                        }
                    }
                    .list-content {
                        .list-item {
                            height: 64rpx;
                            .item-row {
                                color: #571f01;
                                font-size: 24rpx;
                                font-weight: 400;
                                &.flex-1 {
                                    flex: 1;
                                    flex-shrink: 0;
                                }
                                &.flex-2 {
                                    flex: 2;
                                    flex-shrink: 0;
                                }
                                &.flex-4 {
                                    flex: 4;
                                    flex-shrink: 0;
                                }
                                &.flex-5 {
                                    flex: 5;
                                    flex-shrink: 0;
                                }
                                &.left {
                                    text-align: left;
                                }
                                &.right {
                                    text-align: right;
                                }
                                &.center {
                                    text-align: center;
                                }
                                .item-user-avatar {
                                    width: 40rpx;
                                    height: 40rpx;
                                    border-radius: 50%;
                                    margin-right: 8rpx;
                                }
                                .item-user-name {
                                    max-width: 160rpx;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .invite-box {
        position: absolute;
        bottom: 32rpx;
        .invite-btn {
            width: 686rpx;
            height: 104rpx;
        }
    }
}
</style>
