<template>
  <c-main classs="bg-c9">
    <!-- 头部背景 -->
    <image mode="aspectFill" class="expert-mentor-bg" :src="$imgUrl('/images/save-money/expert-mentor-bg.png')"></image>
    <!-- 头部模块 -->
    <c-header title="达人勋章体系" bg_color="transparent" :extra_warp_styles="{ paddingTop: statusHeight + 50 + 'px'}">
        <template v-slot:right>
    		<view class="flex jc-sb">
                <uv-icon name="file-text" color="#000" size="26" @click="recordClick"></uv-icon>
            	<uni-icons class="help-icon" type="help"  color="#000" size="26" @click="explainClick"></uni-icons>
    		</view>
    	</template>
    </c-header>
    <!-- 内容模块 -->
    <view class="expert-mentor" :style="{ height: hei - 76 + 'px'}">
        <view class="user-box flex flex-column jc-sb">
            <image class="expert-mentor-head-mask" :src="$imgUrl('/images/save-money/expert-mentor-head-mask.png')"></image>
            <view class="user-info flex flex-ac jc-sb">
                <view class="info-box flex flex-ac jc-start">
                    <view class="user-avatar-wrap">
                        <image class="user-avatar" :src="mission_store.my_expert_mentor_info.avatar"></image>
                    </view>
                    <view class="user-name nowrap">{{ mission_store.my_expert_mentor_info.nickname }}</view>
                </view>
                <view class="user-identity" >
                    <!-- <view class="user-level flex flex-ac jc-end">
                        <text class="level-title">当前权重</text><text class="level-num">{{ mission_store.my_expert_mentor_info.expert_level }}</text>
                    </view> -->
                    <view v-if="mission_store.my_expert_mentor_info.expert_identity" class="user-identity-desc">{{ mission_store.my_expert_mentor_info.expert_identity }}</view>
                </view>
            </view>
            <view class="mentor-info">
                <!-- {{expert_mentor_tip_content}} -->
                <view class="metal-tip" v-if="medal_tip_data?.length">完成<text class="tip-color">{{ medal_tip_data[0] }}个</text>任务，升级为<text class="tip-color">{{ medal_tip_data[1] }}</text></view>
                <view v-else>恭喜你，完成所有任务！</view>
            </view>
        </view>
        <view class="team-wrap-box">
            <view class="vertical-line line-left"></view>
            <view class="vertical-line line-right"></view>
            <view class="team-box">
                <image class="list-mask" :src="$imgUrl('/images/save-money/video-matrix-mask1.png')"></image>
                <view class="expert-task medal-task" :style="{ margin: `0 32rpx 24rpx` }">
                    <view class="medal-title-box flex flex-ac jc-sb">
                        <view class="flex flex-column">
                            <image mode="aspectFill" class="medal-go-task-icon" :src="$imgUrl('/images/save-money/medal-go-task-icon1.png')"></image>
                            <!-- <view class="metal-tip" v-if="medal_tip_data?.length">完成<text class="tip-color">{{ medal_tip_data[0] }}个</text>任务，升级为<text class="tip-color">{{ medal_tip_data[1] }}</text></view> -->
                        </view>
                        <view class="claim-badge" @click="grantMedal">领取徽章</view>
                    </view>
                    <view class="medal-list flex">
                        
                        <view v-for="(medal, i) in medal_list" :key="medal.classify" class="medal-item flex-1" :class="{ 'no-get': medal.status == -1, 'no-margin': i == medal_list.length - 1 }" >
                            <view class="item-box flex flex-column flex-ac">
                                <image mode="aspectFill" class="medal-image" :src="$imgUrl(`/images/save-money/${medal.image}`)"></image>
                                <view class="flex flex-ac jc-ct">
                                    <view class="medal-name">{{medal.name}}</view>
                                    <view class="flex jc-ct flex-ac"><text class="medal-status" :class="{ 'no-get': medal.status == -1 }">{{medal.status > 0 ? '已获得' : '未获得'}}</text></view>
                                </view>
                            </view>
                            <view class="medal-lock flex flex-ac jc-ct" v-if="medal.status == -1">
                                <image mode="aspectFill" class="lock-icon" :src="$imgUrl(`/images/explore/lock.png`)"></image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- <view class="team-content" :style="{ height: hei - 76 - 220 + 'px'}">
                    <view class="tab-list flex flex-ac jc-start">
                        <view class="tab-item" :class="current_tab_index == i ? 'active' : ''" @click="tabChange(i)" v-for="(item, i) in tab_info" :key="item.title">{{item.title}}{{`(${statisticalQuantity(i)})`}}</view>
                    </view>
                    <view class="list-box">
                        <view class="list-title flex">
                            <view class="line-row" :class="field.class_name" v-for="(field, i) in tab_info[current_tab_index].list_fields" :key="field.name">{{field.name}}</view>
                        </view>
                        <scroll-view v-if="list?.length > 0" :scroll-y="true" :show-scrollbar="false" :style="{ height: hei - 76 - 336 + 'px'}" :lower-threshold="100" @scrolltolower="updateRankingList">
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
                </view> -->
            </view>
            
        </view>
        <!-- <view class="invite-box flex flex-ac jc-ct">
            <image class="invite-btn" @click="toShare" :src="$imgUrl('/images/save-money/expert-mentor-btns-invite.png')"></image>
        </view> -->
    </view>

  </c-main>

  <!-- 达人导师说明 -->
  <custom-popup ref="popup_expert_mentor" title="视频号达人导师任务说明" :show_button="false">
    <view class="expert-mentor-content">
        <view class="expert-mentor-description">
            <scroll-view
                :scroll-y="true"
                class="uv-content"
                :show-scrollbar="false"
                :style="{
                    height: 300 + 'px',
                }"
                >
                <uv-parse
                    :content="mentor_content"
                    :tagStyle="styles"
                ></uv-parse>
            </scroll-view>
        </view>
        <view class="expert-mentor-description platform-description">
            <view class="description-title">重要提示</view>
            <view class="platform-text">
                “导师与团长分红”频率均为每月1次;
            </view>
            <view class="platform-text">
                平台禁止任何形式的虚假交易，平台保留对此行为的冻结收益或封号处理的权利;
            </view>
        </view>
    </view>
</custom-popup>

<!-- 大转盘 -->
<turntable-modal ref="turntable_popup" @turntableResultCallback="turntableResultCallback" :type="turntable_type"></turntable-modal>
<!-- 转盘结果提示 -->
<turntable-tip-modal ref="turntable_tip_popup" :turntable_result="turntable_result" @confirm="turntableTipModalConfirm"></turntable-tip-modal>
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
import turntableModal from "@/views/pages/save-money/views/pages/sign-in/components/turntable-modal.vue"
import turntableTipModal from "@/views/pages/save-money/views/pages/sign-in/components/turntable-tip-modal.vue"

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
    {   index: 0, 
        title: '我的达人团队', 
        list_fields: [
            { name: '序号', class_name: 'flex-2 left', field_name: ['index'] },
            { name: '头像/昵称', class_name: 'flex-5 left', field_name: ['avatar', 'nickname'] },
            { name: '身份', class_name: 'flex-2 center', field_name: ['shop_expert'] },
            { name: '达成日期', class_name: 'flex-5 right', field_name: ['created_at'] },
        ]
    },
    { 
        index: 1, 
        title: '团队排行榜', 
        list_fields: [
            { name: '序号', class_name: 'flex-2 left', field_name: ['index'] },
            { name: '头像/昵称', class_name: 'flex-5 left', field_name: ['avatar', 'nickname'] },
            { name: '权重', class_name: 'flex-2 center', field_name: ['level'] },
            { name: '达人数', class_name: 'flex-2 right', field_name: ['sub_count'] },
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
    pageSize: 15,
    // 是否还有剩余数据的状态
    status: true,
})
// 加载状态
const loading = ref(false);
// 分享url
const share_url = ref('');
// 勋章列表信息
let medal_info_list = [
{ type: 'expert_teacher', text: '达人导师' }, 
{ type: 'assistant_colonel', text: '副团长' }, 
{ type: 'colonel', text: '团长' }, 
{ type: 'big_colonel', text: '大团长' }, 
{ type: 'sign_in', text: '签到达人' }, 
];
// 获得勋章
let get_medal_lists = {
'expert_teacher': 'mentor-medal-active.png',
'assistant_colonel': 'deputy-regimental-commander-active.png',
'colonel': 'regimental-commander-active.png',
'big_colonel': 'big-regimental-commander-active.png',
'sign_in': 'sign-in-medal-acitve.png'
};
// 未获得勋章
let medal_lists = {
'expert_teacher': 'mentor-medal.png',
'assistant_colonel': 'deputy-regimental-commander.png',
'colonel': 'regimental-commander.png',
'big_colonel': 'big-regimental-commander.png',
'sign_in': 'sign-in-medal.png'
};
const medal_list = ref([])
// 转盘弹窗
const turntable_popup = ref();
// 转盘结果提示弹窗
const turntable_tip_popup = ref();
// 转盘结果
const turntable_result = ref({});
// 抽奖类型
const turntable_type = ref('');
// 领取防重复点击
const is_uploading = ref(false);

// 勋章提示内容数据
const medal_tip_data = computed(() => {
    let result = [];
    console.log("mission_store.expert_medal_list--->", mission_store.expert_medal_list)
    if (mission_store.expert_medal_list.list?.length) {
        let medal = mission_store.expert_medal_list.list.find(v => v.status == -1);
        if (medal) {
            let medal_info = medal_info_list.find(v => v.type == medal.classify);
            result = [medal.num, medal_info.text];
        }
    }
    return result;
})

onShow(() => {
    // 获取我的达人导师信息
    getMyExpertMentorInfo();
    // 获取达人导师说明
    getExpertMentorExplain();
    // 获取列表信息
    initPageList();
    // #ifdef H5 || MP-WEIXIN
    // 获取分享信息
    getPromotion();
    // #endif
    // 获取勋章列表信息
    getMedalList();
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
    let req = index == 1 ? getMyExpertMentorRankingList : getMyExpertTeamList;
    let data = await req();
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

// 分红记录按钮点击
function recordClick() {
    uni.navigateTo({
        url: '/views/pages/save-money/views/pages/mission/dividend-record'
    })
}

// 获取我的达人导师信息
async function getMyExpertMentorInfo() {
    await mission_store.getUserExpertMentorInfo();
    console.log("Expert mention-->", mission_store.my_expert_mentor_info);
}

// 获取达人导师说明
async function getExpertMentorExplain() {
    const data = await mineApi.getUserAgreementInfosApi("expert_mentor");
    mentor_content.value = data.data?.content;
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
        if (cur_index == 0) {
            user_info = item.sub_user;
        }
        // 当前用户id
        user_info.cur_user_id = user_info.id;
        // 日期格式化
        if (item.created_at) {
            item.created_at = dateformat(item.created_at, "yyyy-MM-DD");
        }
        // 身份
        item.shop_expert = '达人';
        return { ...user_info, ...item, index: init_index + i + 1 }
    })
}

// 初始化页面列表数据
async function initPageList() {
    my_team_list.value = await getMyExpertTeamList();
    team_ranking_list.value = await getMyExpertMentorRankingList();
    let data3 = current_tab_index.value == 0 ? my_team_list.value : team_ranking_list.value;
    // 设置团队排行榜下拉加载状态的数据
    setRankingDownStatusInfo(data3, current_tab_index.value == 0);
    list.value = handleFilterData(data3, current_tab_index.value);
}

// 获取我的达人团队/团队排行榜
async function getMyExpertTeamList() {
    return await mission_store.getMyExpertTeamList();
}

// 获取团队排行榜
async function getMyExpertMentorRankingList(params = { page: 1, pageSize: 15}) {
    return await mission_store.getMyExpertMentorRankingList(params);
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
        const res = await getMyExpertMentorRankingList({ 
            page: pageInfo.value.page,
            pageSize: pageInfo.value.pageSize
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

// 获取分享信息
function getPromotion() {
    old_mine_store.promotionApi().then(() => {
        share_url.value = uni.$config.shareAppUrl + "/views/pages/mine/pages/appDownload/index?parent_code=" + old_mine_store.ShareInfo.user.user_code;
    });
}

// 去分享
function toShare() {
    // #ifdef APP-PLUS
    if (uni.getStorageSync("isLogin")) {
        uni.navigateTo({
            url: "/views/pages/save-money/views/pages/mine/share"
        });
    } else {
        uni.navigateTo({
            url: "/views/pages/mine/login?path=/views/pages/save-money/views/pages/tabbar/index",
        });
    }
    // #endif
    // #ifdef H5 || MP-WEIXIN
    // 复制链接
    copyUrl(share_url.value)
    // #endif
};

// 复制链接
function copyUrl(url) {
    uni.setClipboardData({
        data: url,
        success: function () {
            uni.showToast({
                title: '复制下载链接成功',
                icon: "none",
                duration: 2000,
            });
        },
        fail: function () {
            uni.showToast({
                title: '复制失败',
                icon: "none",
                duration: 2000,
            });
        }
    });
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


// 获取勋章列表
async function getMedalList() {
    let data = await mission_store.getMedalList();
    if (data.list?.length) {
        // data.list = data.list.map((item, i) => i == 0 ? ({ ...item, status: 0 }) : item);
        medal_list.value = data.list.map(v => ({ ...v, image: v.status > -1 ? get_medal_lists[v.classify] : medal_lists[v.classify], name: medal_info_list.find(k => k.type == v.classify).text }));
    }
}

// 领取勋章
async function grantMedal() {
    // 防止重复点击
    if (is_uploading.value) return;
    is_uploading.value = true;
    let m_list = JSON.parse(JSON.stringify(medal_list.value));
    // let item = m_list.reverse().find((item) => item.status > -1);
    let item = m_list.find((item) => ((item.status > -1 && item.status <= 0) || item.status > 0) && item.is_lucky_draw == 0);
    console.log("item--->", item)
    if (!item) {
        let all_complete_receive = m_list.every((item) => item.status > 0 && item.is_lucky_draw > 0);
         if (all_complete_receive) {
            uni.showToast({
                title: '已领取',
                icon: 'none',
            });
            is_uploading.value = false;
            return;
        }
        item = {
            status: -1
        }
    }
    if (item.status == -1) {
        uni.showToast({
            title: '请先完成任务',
            icon: 'none',
        });
        is_uploading.value = false;
        return;
    }
    let params = {
        classify: item.classify
    }
    if (item.status == 1 && item.is_lucky_draw == 0) {
        try {
            await checkAndShowTurntablePopup(params.classify);
            is_uploading.value = false;
        } catch (e) {
            is_uploading.value = false;
        }
        return;
    } else if (item.status == 1 && item.is_lucky_draw == 1) {
        uni.showToast({
            title: '已领取',
            icon: 'none',
        });
        is_uploading.value = false;
        return;
    }
    
    // 调用领取��章接口
    try {
        await mission_store.grantMedal(params);
        uni.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 1000,
        });
        is_uploading.value = false;
        let timer = setTimeout(async () => {
            clearTimeout(timer);
            await checkAndShowTurntablePopup(params.classify);
            // 重新获取勋章列表
            await getMedalList();
        }, 1000);
    } catch (e) {
        is_uploading.value = false;
    }
}

// 校验是否弹窗抽奖弹窗
async function checkAndShowTurntablePopup(type) {
    const data = await mine_store.checkDrawLotteryV1({ classify: type});
    console.log("checkAndShowTurntablePopup", data)
    if (data?.is_draw_lottery) {
        turntable_type.value = type;
        // 抽奖弹窗
        turntable_popup.value.open();
    }
}

// 转盘结果回调
function turntableResultCallback(result) {
    turntable_result.value = result;
    // 重新获取勋章列表
    getMedalList();
    setTimeout(() => {
        turntable_tip_popup.value.open();
    }, 100);
}

// 结果提示确认回调
function turntableTipModalConfirm() {
    turntable_tip_popup.value.close();
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
        // position: absolute;
        // bottom: 32rpx;
        margin-top: 12rpx;
        .invite-btn {
            width: 686rpx;
            height: 104rpx;
        }
    }
}

.help-icon {
    margin-left: 12rpx;
}
.metal-tip {
    color: #fff;
    font-size: 24rpx;
    font-weight: 400;
    .tip-color {
        color: #FF3221;
    }
}
.medal-task {
    position: relative;
    z-index: 2;
    overflow: hidden;
    border-radius: 48rpx;
    position: relative;
    // background-color: #FFF;
    padding: 0 0 32rpx;
    // border: 2rpx solid #FFF;
    .medal-title {
        position: relative;
        height: 112rpx;
        top: 0rpx;
        left: -40rpx;
        .title-box {
            position: absolute;
            height: 112rpx;
            z-index: 2;
            padding: 0 36rpx;
            .medal-go-task-icon {
                width: 192rpx;
                height: 40rpx;
            }
            .medal-level {
                padding: 0 8rpx;
                border-radius: 8rpx;
                background: linear-gradient(to left, #9FE000, #C5FE39, #FEF439);
                color: #111111;
                font-size: 24rpx;
                font-weight: 400;
                margin-left: 16rpx;
            }
        }
        
    }
    .medal-progress {
        margin-bottom: 32rpx;
        .progress-start, .progress-end {
            width: 24rpx;
            height: 24rpx;
            border-radius: 50%;
            background: #FF3221;
            &.no-complete {
                background: #D9D9D9;
            }
            .medal-origin-icon {
                width: 12rpx;
                height: 12rpx;
            }
        }
        .complete-progress-total {
            // margin: 16rpx 0 32rpx;
            margin: 0 8rpx;
            border-radius: 4rpx;
            background: #D9D9D9;
            height: 4rpx;
            .complete-progress-num {
                height: 4rpx;
                border-radius: 4rpx;
                background: linear-gradient(to right, #FF3221, #FFC800);
            }
        }
        .progress-text {
            width: 140rpx;
            color: #777777;
            font-size: 20rpx;
            font-weight: 400;
            text-align: right;
        }
    }
    .metal-tip {
        color: #111111;
        font-size: 24rpx;
        font-weight: 400;
        .tip-color {
            color: #FF3221;
        }
    }
    .medal-list {
        margin-top: 30rpx;
        .medal-btn {
            width: 164rpx;
            font-size: 24rpx;
            font-weight: 400;
            border-radius: 16rpx;
            color: #777777;
            background: #EDEDED;
            text-align: center;
            line-height: 48rpx;
            height: 48rpx;
            margin-top: 24rpx;
            &.wait-receive {
                color: #fff;
                background: linear-gradient(to right, #FF7B14, #FF4200);
            }
            &.already-receive {
                color: #FF6A00;
                background: rgba(255, 106, 0, 0.2);
            }
        }

        .medal-item {
            margin: 0 24rpx 0 0;
            padding: 14rpx 16rpx;
            border-radius: 16rpx;
            background: rgba(255, 106, 0, 0.1);
            position: relative;
            &.no-margin {
                margin-right: 0;
            }
            &.no-get {
                background: #F6F6F6;
            }
            .item-box {
                .medal-image {
                    width: 72rpx;
                    height: 72rpx;
                    margin-bottom: 8rpx;
                }
                .medal-name {
                    text-align: center;
                    color: #111111;
                    font-size: 24rpx;
                    font-weight: 500;
                    // margin: 8rpx 0;
                }
                .medal-status {
                    text-align: center;
                    color: #FF6A00;
                    font-size: 20rpx;
                    font-weight: 400;
                    padding: 0 4rpx;
                    border-radius: 8rpx;
                    border: 2rpx solid #FF6A00;
                    margin-left: 2rpx;
                    &.no-get {
                        color: rgb(119, 119, 119);
                        border: 2rpx solid rgb(119, 119, 119);
                    }
                }
            }
            .medal-lock {
                position: absolute;
                top: 0;
                right: 0;
                width: 36rpx;
                height: 28rpx;
                border-radius: 0 16rpx 0 16rpx;
                background: rgba(0, 0, 0, 0.2);
                .lock-icon {
                    width: 16rpx;
                    height: 16rpx;
                }
            }
            .propress-arrow {
                position: absolute;
                top: 50%;
                right: -38rpx;
                transform: translateY(-50%);
                .medal-arrow-right {
                    width: 16rpx;
                    height: 24rpx;
                }
                
            }
        }
    }
    .medal-title-box {
        padding-top: 32rpx;
        .medal-go-task-icon {
            width: 192rpx;
            height: 40rpx;
            margin-bottom: 8rpx;
        }
        .claim-badge {
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            padding: 14rpx 20rpx;
            border-radius: 16rpx;
            background: linear-gradient(270deg, #FF182E 0%, #FF9D21 100%);
        }
    }
}
</style>
