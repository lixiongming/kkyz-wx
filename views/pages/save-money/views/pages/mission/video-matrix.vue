<template>
<view classs="vm-wrap" :style="{ height: hei + 'px', background: `url(${$imgUrl('/images/wx-applet/expert/vm-bg.png')}) no-repeat center center / cover` }">
    
    <scroll-view class="scroll-wrap" :style="{height: hei + 'px'}" :scroll-y="true" :show-scrollbar="false">
    <view 
        class="head-title" 
        :style="{
        height: status_barHeight + 44 + 'px',
        paddingTop: status_barHeight + 'px',
        }"
    >
        <view class="title-txt">
            <text class="txt-cs">达人带货</text>
        </view>
    </view>
    <view class="head-help" :style="{ paddingTop: status_barHeight + 'px'}">
        <uni-icons type="help"  color="#000" size="26" @click="explainClick"></uni-icons>
    </view>
    <!-- 头部背景 -->
    <image mode="aspectFill" class="video-matrix-bg" :src="$imgUrl('/images/wx-applet/expert/vm-head-bg.png')"></image>
    <!-- 内容模块 -->
    <view class="video-matrix">
        <view class="fans-version2-wrap">
            <image mode="aspectFill" class="fans-bg" :src="$imgUrl('/images/wx-applet/expert/vm-other-bg1-1.png')"></image>
            <view class="fans-version2-box flex jc-sb flex-ac">
                <view class="fans-left flex-1 flex flex-column jc-end">
                    <view class="today-order-num">{{fans_data.today_order_num || 0}}</view>
                    <view class="today-total-text">今日粉丝下单总数</view>
                </view>
                <view class="fans-line"></view>
                <veiw class="fans-right flex-1">
                    <view class="fans-box flex flex-ac jc-end">
                        <view class="fans-item flex-1 flex flex-column  jc-end">
                            <view class="fans-num">{{fans_data.total_fans_num || 0}}</view>
                            <view>铁粉</view>
                        </view>
                        <view class="fans-item flex-1 flex flex-column  jc-end">
                            <view class="fans-num">{{fans_data.rice_fans_num || 0}}</view>
                            <view>米粉</view>
                        </view>
                    </view>
                </veiw>
            </view>
        </view>
        <view class="jump-box">
            <image mode="aspectFill" class="jump-bg" :src="$imgUrl('/images/wx-applet/expert/vm-other-bg2-1.png')"></image>
            <view class="jump-btns flex flex-ac jc-sb">
                <view class="btn-item flex-1 flex flex-ac" @click="jumpToPage(jump_list[0])">
                    <image mode="aspectFill" class="btn-icon" :src="$imgUrl(jump_list[0].icon)"></image>
                    <view class="btn-text">{{jump_list[0].text}}</view>
                </view>
                <view class="jump-line"></view>
                <view class="btn-item flex-1 flex flex-ac"  @click="jumpToPage(jump_list[1])">
                    <image mode="aspectFill" class="btn-icon" :src="$imgUrl(jump_list[1].icon)"></image>
                    <view class="btn-text">{{jump_list[1].text}}</view>
                </view>
            </view>
        </view>
        <view class="expert-task" >
            <image mode="aspectFill" class="task-bg" :src="$imgUrl('/images/wx-applet/expert/vm-other-bg3-1.png')"></image>
            <view class="task-buy-wrap">
                <view class="task-box">
                    <view class="task-head">达人任务升级</view>
                </view>
                <view class="buy-task" >
                    <view class="complete-buy-num" v-if="list?.length">已完成<text class="buy-num">{{other_info.finish_num || 0}}</text>个任务, 还剩<text class="buy-num">{{task_surplus_num || 0}}</text>个任务</view>
                    <view class="task-operate" v-if="list?.length">
                        <view class="task-item">
                            <view class="step-box flex flex-ac">
                                <view class="step-head-box">
                                    <image mode="aspectFill" class="step-bg" :src="$imgUrl('/images/wx-applet/expert/vm-tag.png')"></image>
                                    <view class="step-num">NO.1</view>
                                </view>
                                <view class="step-name">购买任务</view>
                            </view>
                            <view class="task-info download-order flex flex-ac jc-sb" v-for="(item, i) in list" :key="item.id">
                                <view class="store_info">前往<text class="store_name nowrap">{{item.name}}</text>下单</view>
                                <view class="execute-btn" @click="storeCreateOrder">进店下单</view>
                            </view>
                        </view>
                        <view class="task-item task-order">
                            <view class="step-box flex flex-ac">
                                <view class="step-head-box">
                                    <image mode="aspectFill" class="step-bg" :src="$imgUrl('/images/wx-applet/expert/vm-tag.png')"></image>
                                    <view class="step-num">NO.2</view>
                                </view>
                                <view class="step-name">填写订单号</view>
                            </view>
                            <view class="task-info order-num flex flex-ac jc-sb">
                                <input 
                                class="order-input" 
                                type="text" 
                                placeholder-class="input-tip" 
                                placeholder="请输入或粘贴订单号"
                                v-model="order_id"
                                @input="orderInputValue" />
                                <view class="sumbit-btn" @click="sumbitClick">确认提交</view>
                            </view>
                        </view>
                    </view>
                    <view class="complete-all" v-else>已完成全部任务！</view>
                </view>
            </view>
        </view>
        <view class="tip-box">
            <view class="tip-title">温馨提示：</view>
            <view>1.进入橱窗仅需要购买一个商品；</view>
            <view>2.下单后，请立即复制该订单编号，粘贴到下方。</view>
            <view>【该订单编号复制到其他任务窗口无效】</view>
        </view>
    </view>
    </scroll-view>

    <view
        id="canvas-container"
        class="canvas-container"
        style="width: 0; height: 0; overflow: hidden; z-index: -9999"
    >
        <canvas
        id="myCanvas"
        canvas-id="myCanvas"
        style="width: 600px; height: 1000px; background: #ffffff"
        ></canvas>
    </view>

</view>

    <!-- 大转盘 -->
    <!-- <turntable-modal ref="turntable_popup" @turntableResultCallback="turntableResultCallback" :type="turntable_type"></turntable-modal> -->
    <!-- 转盘结果提示 -->
    <!-- <turntable-tip-modal ref="turntable_tip_popup" :turntable_result="turntable_result" @confirm="turntableTipModalConfirm"></turntable-tip-modal> -->

    <!-- 达人分销码 -->
    <custom-popup ref="popup" title="达人分销码" :show_button="true" @onClose="outPopup">
        <template v-slot:default>
        <view class="popup-content-box">
            <view class="popup-top">
                <view class="swiper-item uni-bg-red">
                    <view id="pagePoster">
                        <image :src="bannerList[0]" alt="" class="swiper-img"></image>
                        <view class="swiper-bottom flex jc-sb flex-ac">
                            <view class="swiper-bottom-left flex flex-dc">
                            <!-- #ifdef H5 -->
                            <view class="invite-tip">邀请您，加入视频号达人带货</view>
                            <view class="mobile">分享员：{{ mobile }}</view>
                            <!-- #endif -->
                            <!-- #ifdef APP-PLUS -->
                        <!--   <image
                            :src="imgUrlEvent('/images/mine/invite-text2.png')"
                            alt=""
                            class="kkyz_logo"
                            ></image> -->
                            <view class="invite-tip">邀请您，加入视频号达人带货</view>
                            <view class="mobile">分享员：{{ mobile }}</view>
                            <!-- #endif -->
                            </view>
                            <view class="swiper-bottom-right">
                            <uv-qrcode
                                ref="qrcode"
                                :value="shareUrl"
                                size="50px"
                                :options="options"
                            ></uv-qrcode>
                            </view>
                        </view>
                        <!-- 生产海报 -->
                        <!-- #ifdef H5 -->
                        <!-- <image v-if="create_poster" mode="widthFix" :src="create_poster" alt="" class="create-poster"></image> -->
                        <!-- #endif -->
                    </view>

                </view>
            </view>
            
        </view>
        </template>
        
        <template v-slot:button>
            <!-- #ifdef APP-PLUS -->
            <view class="popup-bottom flex jc-ct">
            <view
                class="share-list flex flex-column flex-ac"
                v-for="(item, index) in shareList"
                @click="shareEvent(item.id)"
                :key="index"
            >
                <image :src="item.url" alt="" class="share-img"></image>
                <text>{{ item.name }}</text>
            </view>
            </view>
            
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <!-- <view class="longpress-tip" @click="shareEvent(1)">保存海报</view> -->
            <view>
                <view class="btn-tip">点击“保存图片”后，长按图片保存</view>
                <view
                    class="share-list share-save flex flex-column flex-ac"
                    v-for="(item, index) in shareList1"
                    @click="shareEvent(item.id)"
                    :key="index"
                >
                    <image :src="item.url" alt="" class="share-img"></image>
                    <text>{{ item.name }}</text>
                </view>
            </view>
            
            <!-- #endif -->
        </template>

    </custom-popup>

    <!-- 保存店铺二维码 -->
    <custom-popup ref="popup_store_qrcode" title="店铺二维码" @onClose="storePopupClose" @onConfirm="storePopupConfirm" button_text="保存图片去微信打开" :click_confirm_close="false">
        <view class="store-content flex flex-column flex-ac">
            <image mode="aspectFill" class="store-qrcode" :src="task_info.image"></image>
            <view class="store-tip">微信扫码店铺二维码进店购物</view>
        </view>
    </custom-popup>

    <!-- 温馨提示 -->
    <c-modal 
        ref="order_tip_modal" 
        title="温馨提示" 
        content="确认提交该订单编号？" 
        @confirm="sumbitOrderConfirm"
        @close="sumbitOrderClose"
        contentClass="content-center"
        :confirmBtnStyles="confirm_btn_styles"
    >
    </c-modal>

</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, onMounted ,nextTick} from "vue";
import { onLoad, onShow, onReady, onInit, onHide, onUnload, onBackPress ,onTabItemTap} from "@dcloudio/uni-app";
// 使用mission模块store
import mission_use_store from '/views/pages/save-money/store/modules/mission.ts'
// 引入图片保存等相关执行
import { downloadImageSaveAlbum } from "/views/pages/save-money/infrastructure/utils/preload-image"
// 使用mine模块store
import mine_use_store from '@/views/pages/save-money/store/modules/mine.ts'
import turntableModal from "@/views/pages/save-money/views/pages/sign-in/components/turntable-modal.vue"
import turntableTipModal from "@/views/pages/save-money/views/pages/sign-in/components/turntable-tip-modal.vue"
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import uerStore from "@/business/store/modules/mine";
import uvQrcode from "@/uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.vue";
import logoImg from "/static/images/home/kkyzLogo.png";
import customPopup from '@/views/pages/save-money/views/components/custom-popup.vue'
import html2canvas from "html2canvas";
import { checkIosNoShow } from '@/infrastructure/utils/util'
import { getKsContent } from '@/infrastructure/utils/util'
import { mineApi } from "@/business/api/index.ts";
import uerStore2 from "@/business/store/index";

// 生成对应store模块实例
const mission_store = mission_use_store();
const mine_store = mine_use_store();
const store = uerStore();
const store2 = uerStore2();
const hei = uni.getSystemInfoSync().windowHeight;
const status_barHeight = uni.getSystemInfoSync().statusBarHeight;
// #ifndef MP-WEIXIN
const safe_botton = uni.getSystemInfoSync().safeAreaInsets.bottom;
// #endif
// #ifdef MP-WEIXIN
const safe_botton = 0;
// #endif
// 提交防重复点击
const is_uploading = ref(false);
// 请求参数
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
// 任务列表
const list = ref([]);
// 标记最上面数组的长度
const top_length = ref(0);
// 其他信息
const other_info = ref({});
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
// 分享图片
const bannerList = ref([]);
const user_info = ref(uni.getStorageSync('userInfo') || {})
const shareList = ref([
{ id: 1, url: imgUrlEvent("/images/mine/share1.png"), name: "保存图片" },
{ id: 2, url: imgUrlEvent("/images/mine/share2.png"), name: "微信" },
{ id: 3, url: imgUrlEvent("/images/mine/share3.png"), name: "朋友圈" },
]);
const shareList1 = ref([{ id: 1, url: imgUrlEvent("/images/mine/share1.png"), name: "保存图片" }])
const shareUrl = ref('');
const popup = ref();
const qrcode = ref();
const options = {
foregroundImageSrc: logoImg
};
const create_poster = ref('');

// 获得当前组件实例
const instance = getCurrentInstance();
// 用户手机号
const mobile = ref();
// 店铺二维码弹窗
const popup_store_qrcode = ref();
// 提交订单提示
const order_tip_modal = ref();
//提交订单提示确认按钮样式
const confirm_btn_styles = `background: linear-gradient(90deg, #FF3221, #FFA32A);`
// 防止重复点击提交状态
const is_loading = ref(false);
// 订单id
const order_id = ref('');
// 页面数据信息
const task_info = ref({});
// 旧的输入内容
let old_input_content = ref('');
// const isShow = ref(false)
// 粉丝相关数据
const fans_data = ref({
    total_fans_num: 0,
    rice_fans_num: 0,
    today_order_num: 0
})
// 跳转列表
const jump_list = ref([
    { text: '橱窗地址', icon: '/images/wx-applet/expert/vm-address.png', type: 'address' },
    // { text: '达人导师任务', icon: '/images/save-money/expert-mentor-icon1.png', type: 'expert' },
    { text: '达人勋章体系', icon: '/images/wx-applet/expert/vm-medal.png', type: 'expert' },
])


const listData = [
    { title: '发随记', type: 's_notes', iconUrl: imgUrlEvent('/images/publish/s_notes.png'), desb: '分享日常点滴', goUrl: '/views/pages/publish/s_notes' },
    { title: '发文章', type: 's_article', iconUrl: imgUrlEvent('/images/publish/s_article.png'), desb: '分享文字创作花火', goUrl: '/views/pages/publish/s_article' },
    { title: '发视频', type: 's_video', iconUrl: imgUrlEvent('/images/publish/s_video.png'), desb: '分享身边美好时刻', goUrl: '/views/pages/publish/s_video' },
]

// 自动登录middle_token
let middle_token = ref(null);

// 勋章提示内容数据
const medal_tip_data = computed(() => {
    let result = [];
    if (mission_store.expert_medal_list.list?.length) {
        let medal = mission_store.expert_medal_list.list.find(v => v.status == -1);
        if (medal) {
            let medal_info = medal_info_list.find(v => v.type == medal.classify);
            result = [medal.num, medal_info.text];
        }
    }
    return result;
})

// 任务完成进度(内容)
const progress_text = computed(() => {
    let total_num = other_info.value?.total_num || 0;
    let finish_num = other_info.value?.finish_num > other_info.value?.total_num ? other_info.value?.total_num : other_info.value?.finish_num;
    return `(${finish_num||0}/${total_num||0})`;
})

// 任务完成进度比例
const progress_ratio = computed(() => {
    return (other_info.value?.finish_num / other_info.value?.total_num);
})

// 完成任务数
const task_complete_num = computed(() => {
    return `已完成 ${other_info.value?.finish_num || 0} 个任务`;
})

// 还剩任务数
const task_surplus_num = computed(() => {
    let total_num = other_info.value?.total_num || 0;
    let finish_num = other_info.value?.finish_num || 0;
    return total_num - finish_num;
})

// 申请成为达人提示
const apply_expert_tip = computed(() => {
    return `完成${other_info.value?.expert_num||0}个任务，可申请成为达人`;
})


// 点击跳转
function goUrl({ goUrl: url }) {
    // 未登录跳转登录
    const isLogin = uni.getStorageSync("isLogin");
    if (!isLogin) {
        uni.navigateTo({
            url: '/views/pages/mine/login?isPublish=true'
        })
        return;
    }
    uni.navigateTo({
        url
    })
}

// 勋章按钮状态及文本
function medalBtnStatusOrText(medal, type) {
    const { status, is_lucky_draw } = medal;
    let text = '未达标';
    let class_str = 'no-get';
    if (status == 0) {
        text = '领取';
        class_str = 'wait-receive';
    } else if (status == 1) {
        if (is_lucky_draw == 0) {
            text = '抽奖';
            class_str = 'wait-receive';
        } else {
            text = '已领取';
            class_str = 'already-receive';
        }
    }
    console.log("text--->", text);
    if (type =='class') {
        return class_str;
    }
    return text;
} 

onShow(async () => {
    try {
    if (middle_token.value) {
        // 自动登录
        // uni.setStorageSync('login_mobile', login_mobile.value);
        await autoLogin(middle_token.value)
        middle_token.value = null;
    }
    // 清空输入框内容
    old_input_content.value = '';
    order_id.value = '';
    // 获取页面数据
    // getMissionTaskInfo();
    // 任务相关数据更新
    await updateTaskData();
    // getPromotion();
    // getCheckShow();
    // mobile.value = await getUserMobile();
    } catch(e) {
        middle_token.value = null;
    }
})

// 自动登录
async function autoLogin(token_) {
    const { data } = await mineApi.wxchatAutoLoginApi({ middle_token: token_ })
    console.log("data-->", data)
    uni.setStorageSync('middle_token', data.middle_token);
    uni.setStorageSync('token', data.token);
    uni.setStorageSync('isLogin', true);
    store.isLogin = true;
    store2.$patch((state) => {
        state.token = data.token;
        state.middle_token = data.middle_token;
    })
    
}

// 任务相关数据更新
async function updateTaskData() {
    await initPageList();
    // 获取用户信息(达人相关信息)
    await getUserInfo();
    // 获取勋章列表信息
    await getMedalList();
    // 粉丝相关数据
    await getStatFansNum();
}

// 完成任务进度
const complete_progress = computed(() => {
    return `${other_info.value?.finish_num || 0}/${other_info.value?.total_num || 0}`
})

// 描述按钮点击
function explainClick() {
    // 查看描述信息
    uni.navigateTo({
        url: '/views/pages/save-money/views/pages/mine/agreement?type=8',
    });
}

// 去完成任务按钮点击
function goCompleteTaskClick(item) {
    console.log("complete")
    // 缓存执行的达人任务信息
    uni.setStorageSync('expert_task_info', JSON.stringify(item));
    // 跳转到任务中心
    uni.navigateTo({
        url: '/views/pages/save-money/views/pages/mission/mission-center',
    });
}

// 获取任务列表信息
// async function getMissionTaskInfo() {
//     await mission_store.expertTaskList()
// }

// 点击成为达人按钮
async function becomingExpert() {
    // 判断是否已经是达人
    if (mine_store.my_info.shop_expert) {
        uni.showToast({
            title: '你已是达人',
            icon: 'none',
        });
        return;
    }

    // 判断是否任务完成
    if (other_info.value?.finish_num < other_info.value?.expert_num) {
        uni.showToast({
            title: '请先完成达人任务',
            icon: 'none',
        });
        return;
    }
    // 防止重复点击
    if (is_uploading.value) return;
    // 调用申请达人接口
    try {
        is_uploading.value = true;
        // 调用成为达人的接口
        await mission_store.expertBecomeExpert();
        // 成功提示
        uni.showToast({
            title: '恭喜你，成为达人!',
            icon:'none',
            duration: 1000,
        });
        // 跳转到橱窗地址页面
        let handle_time = setTimeout(() => {
            clearTimeout(handle_time);
            // 跳转橱窗地址
            toWindowAddress();
        }, 1000);
        is_uploading.value = false;
    } catch (e) {
        is_uploading.value = false;
    }
    
}

// 跳转入口
function jumpToPage({ type }) {
    if(type == 'expert') {
        toExpertMentor();
    } else if (type == 'address') {
        toWindowAddress();
    }
}

// 达人导师
function toExpertMentor() {
    uni.navigateTo({
        url: '/views/pages/save-money/views/pages/mission/expert-mentor',
    });
}

// 橱窗地址
function toWindowAddress() {
    uni.navigateTo({
        url: '/views/pages/save-money/views/pages/mission/window-address',
    });
}

// 获取用户信息(达人相关信息)
async function getUserInfo() {
    await mine_store.getUserMyInfo();
}

// 返回主页
const back=()=>{
    uni.navigateBack({ delta: 1 })
}

// 下拉更新
async function updateList() {
    console.log("pageInfo.value.status--->", pageInfo.value.status);
    if (!pageInfo.value.status) return;
    if (loading.value) return
    loading.value = true
    try {
        const res = await mission_store.expertTaskList2({
            page: pageInfo.value.page,
            pageSize: pageInfo.value.pageSize
        });
        loading.value = false
        other_info.value = res;
        let page_datas = res.list?.items;
        list.value.splice(0, top_length.value, ...res.latest_list);
        top_length.value = res.latest_list?.length;
        list.value = list.value.concat(page_datas);
        setDownStatusInfo(res.list);
    } catch(e) {
        loading.value = false
    }
    
}

// 下拉加载状态的数据
function setDownStatusInfo (res, is_clear) {
    if (is_clear) {
        pageInfo.value.status = true;
        pageInfo.value.page = 1;
        return;
    }
    pageInfo.value.status = pageInfo.value.page < res.pageInfo.totalPage;
    pageInfo.value.page++;
}

// 初始化页面列表数据
async function initPageList() {
    // list.value = [];
    pageInfo.value = {
        page: 1,
        pageSize: 15,
        status: true,
    }
    const data = await mission_store.expertTaskList2({ 
        page: 1,
        pageSize: 15
    });
    other_info.value = data;
    top_length.value = data.latest_list?.length;
    // 设置下拉加载状态的数据
    setDownStatusInfo(data.list);
    list.value = data.latest_list.concat(data.list?.items);
    // 设置当前任务信息
    task_info.value = list.value[0] || {};
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

async function getPromotion() {
store.promotionApi().then(() => {
    shareUrl.value = uni.$config.h5Domain+"/#/views/pages/save-money/views/pages/mission/video-matrix?parent_code=" + store.ShareInfo.user.user_code + "&expert_parent_code=" + store.ShareInfo.user.expert_user_code;
});
}

// 获取用户手机号
async function getUserMobile() {
    if (!user_info.value.mobile) {
        await store.baseInfoApi()
        const user = uni.getStorageSync('userInfo') || {}
        return user.mobile
    }
    return user_info.value.mobile;
}

// 获取分享图片
function getShareImage() {
store.shareImage().then((res) => {
    bannerList.value = res;
});
}

const openShare = (info,data)=>{
    uni.share({
    provider: "weixin",
    scene: data ? "WXSceneSession" : "WXSceneTimeline",
    type: 0,
    href: shareUrl.value,
    title: "看看宇宙",
    summary: info,
    imageUrl: "http://cdn-v3.kankanyz.com/images/mine/kkyzLogo.jpg",
    success: function (res) {
        uni.showToast({
        title: "分享成功",
        duration: 2000,
        });
    },
    fail: function (err) {
        uni.showToast({
        title: "分享失败",
        icon: "none",
        duration: 2000,
        });
    },
    });
}

// 微信分享
function wxShareFn(data) {
    store.getShareInfoApi().then((res) => {
        // console.log(res,'222222');
        openShare(res.info||'看见更好的未来',data)
    }).catch(() => {
        openShare('看见更好的未来',data)
    })
}

const saveShareImg = () => {
setTimeout(function () {
    uni.canvasToTempFilePath(
    {
        x: 0,
        y: 0,
        width: 600,
        height: 1000,
        destWidth: 600,
        destHeight: 1000,
        canvasId: "myCanvas",
        success: function (res) {
        uni.hideLoading();
        var tempFilePath = res.tempFilePath;
        // #ifdef H5 
        // create_poster.value = tempFilePath;
        uni.previewImage({
            urls: [tempFilePath],
        });
        // #endif
        // #ifndef H5 
        uni.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
            uni.showToast({
                title: "图片已保存到相册",
                icon: "none",
                duration: 2000,
            });
            },
            fail: function (res) {
            uni.showToast({
                title: "分享失败",
                icon: "none",
                duration: 2000,
            });
            },
        });
        // #endif
        },
    },
    instance
    );
}, 3000);
};

const createCanvas = (imgUrl1, imgUrl2, imgUrl3) => {
var ctx = uni.createCanvasContext("myCanvas", instance); //创建画布
uni
    .createSelectorQuery()
    .select("#canvas-container")
    .boundingClientRect(function (rect) {
    ctx.setFillStyle("#FFFFFF");
    ctx.fillRect(0, 0, 600, 1000);
    ctx.save();
    if (imgUrl1) {
        ctx.drawImage(imgUrl1, 0, 0, 600, 845);
        ctx.save();
    }
    // if (imgUrl2) {
    //   ctx.restore();
    //   ctx.drawImage(imgUrl2, 36, 888, 300, 80);
    //   ctx.save();
    // }

    ctx.setFillStyle('#000')
    ctx.font = '28px sans-serif';
    ctx.fillText('邀请您，加入视频号达人带货', 40, 910)
    
    // ctx.setFillStyle('#000')
    // ctx.font = '26px sans-serif';
    // ctx.fillText('达人带货', 40, 936)

    ctx.setFillStyle('#1827e9')
    ctx.font = '28px sans-serif';
    ctx.fillText(`分享员：${mobile.value}`, 40, 960)
    
    ctx.save();
    if (imgUrl3) {
        ctx.restore();
        ctx.drawImage(imgUrl3, 450, 867, 110, 110);
        ctx.save();
    }
    })
    .exec(() => {
    setTimeout(function () {
        ctx.draw(false, () => {
        saveShareImg();
        });
    }, 1000);
    });
};

const initCanvas = (img) => { 
uni.downloadFile({
    url: img,
    success(res1) {
    uni.downloadFile({
        // url: "http://cdn-v3.kankanyz.com/images/mine/kkyz_logo.png",
        url: "http://cdn-v3.kankanyz.com/images/mine/invite-text2.png",
        success(res2) {
        store.createQrcode({ url: shareUrl.value }).then((res) => {
            uni.downloadFile({
            url: res.qrcode_url,
            success(res3) {
                uni.showLoading({
                    title: "图片生成中...",
                    mask: true,
                });
                createCanvas(
                res1.tempFilePath,
                res2.tempFilePath,      
                res3.tempFilePath
                );
            },
            });
        });
        },
    });
    },
});
};

// 分享事件
function shareEvent (id) {
switch (id) {
    case 1:
    initCanvas(bannerList.value[0]);
    break;
    case 2:
    wxShareFn(true);
    break;
    case 3:
    wxShareFn(false);
    break;
    default:
    break;
}
};

const openPopup = () => {
uni.hideTabBar();
popup.value.open("bottom");
// shareEvent(1);
};

const outPopup = () => {
// popup.value.close();
uni.showTabBar();
console.log('2222')
};

onLoad((option) => {
// app->小程序自动登录
    let middle_token_ = uni.getStorageSync('middle_token_')
    if (option.middle_token) {
        middle_token.value = decodeURIComponent(option.middle_token);
        return
    }
    if (middle_token_) {
        middle_token.value = middle_token_;
    }
// getShareImage()
});

onMounted(()=>{
    // initCanvas('http://cdn-v3.kankanyz.com/post/20240614/660124597257084928.jpg');
})

// 订单输入监听事件
function orderInputValue(e) {
    // 字符、数字正则
    let reg = /^[A-Za-z0-9]+$/;
    let value = e.detail?.value;
    if (!value) {
        // 内容为空赋值
        old_input_content.value = '';
        order_id.value = '';
    } else if (reg.test(value)) {
        // 通过正则校验赋值
        old_input_content.value = value;
        order_id.value = value;
    } else {
        // 页面更新后立即更新数据
        nextTick(() => {
            // 赋值旧值
            order_id.value = old_input_content.value;
        })
    }

}

onUnload(() => {
    // 离开页面，关闭弹窗
    // storePopupClose();
})

onHide(() => {
    // 离开页面，关闭弹窗
    // storePopupClose();
})

// 进店下单
function storeCreateOrder() {
    if (task_info.value.video_id) {
        wx.openChannelsUserProfile({
            finderUserName: task_info.value.video_id,
            success(res) {},
            fail(err) {}
        });
    }
    
    // 打开店铺二维码
    // storePopupOpen();
}

// 店铺二维码弹窗打开
function storePopupOpen() {
    uni.hideTabBar();
    popup_store_qrcode.value.open();
}

// 店铺二维码弹窗关闭
function storePopupClose() {
    // popup_store_qrcode.value.close()
    uni.showTabBar();
    console.log('2222')
}

// 店铺二维码弹窗确认回调
async function storePopupConfirm() {
    try {
        if (is_loading.value) return;
        // 点击进行中
        is_loading.value = true;
        // #ifdef APP-PLUS
        // 二维码下载保存到相册
        await downloadImageSaveAlbum(task_info.value.image, storePopupClose)
        // #endif
        // #ifdef H5
        uni.showToast({
            title: "保存成功",
            icon: "success"
        })
        // storePopupClose();
        // #endif
        uni.showTabBar();
        popup_store_qrcode.value.close()
        // 点击完成
        is_loading.value = false;
        
    } catch (e) {
        // 点击完成
        uni.showTabBar();
        popup_store_qrcode.value.close()
        is_loading.value = false;
    }
    
}

// 提交订单提示弹窗打开
function sumbitOrderTipPopupOpen() {
    order_tip_modal.value.open();
}

// 提交订单提示弹窗确认回调
async function sumbitOrderConfirm() {
    // 关闭弹窗
    sumbitOrderClose();
    // 提交数据
    await mission_store.expertSubmitOrder({ order_id: order_id.value, id: task_info.value.id });
    // 提示完成
    uni.showToast({
        title: '提交成功',
        icon:'success',
    })
    // 清除缓存数据
    // uni.removeStorageSync('expert_task_info');
    let handle_time = setTimeout(() => {
        if (handle_time) {
            clearTimeout(handle_time);
            handle_time = null;
            // 刷新任务页面
            updateTaskData();
            // 请求输入框订单id
            order_id.value = '';
        }
    }, 2000);
}

// 提交订单提示弹窗取消回调
function sumbitOrderClose() {
    order_tip_modal.value.close();
}

// 提交按钮回调
function sumbitClick() {
    // 数据校验
    let flag = checkSumbitData();
    if (!flag) return;
    sumbitOrderTipPopupOpen();
}

// 提交数据校验
function checkSumbitData() {
    if (!order_id.value) {
        uni.showToast({
            title: '输入或粘贴订单号',
            icon: 'none',
        })
        return false;
    };
    return true;
}


// 获取粉丝相关数据
async function getStatFansNum() {
    const data = await mission_store.getStatFansNum();
    console.log('data--->', data);
    fans_data.value = data;
}
</script>

<style lang="less" scoped>
.head-title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    padding-left: 40rpx;
    .title-txt {
        text-align: left;
        line-height: 88rpx;
        height: 88rpx;
        font-weight: 500;
        font-size: 30rpx;
        color: #000000;
    }
    .txt-cs {
        line-height: 88rpx;
        text-align: center;
        color: #111111;
        font-size: 32rpx;
        font-style: normal;
        font-weight: 600;
    }
}
.head-help {
    position: absolute;
    top: 88rpx;
    right: 28rpx;
    z-index: 10;
}
.video-matrix-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 534rpx;
    width: 750rpx;
    z-index: 4;
}
.video-matrix {
    position: relative;
    z-index: 3;
    padding-top: 494rpx;
    .fans-version2-wrap {
        position: relative;
        margin: 0 28rpx 20rpx;
        .fans-left, .fans-right {
            height: 110rpx;
        }
        .fans-box {
            height: 100%;
            padding-left: 60rpx;
        }
        .fans-item {
            height: 100%;
        }
        .fans-line {
            width: 0;
            height: 70rpx;
            border: 2rpx solid #FFFFFF;
        }
        .fans-version2-box {
            padding: 40rpx;
            position: relative;
            z-index: 2;
            height: 190rpx;
        }
        .fans-bg {
            position: absolute;
            left: 0;
            right: 0;
            width: 694rpx;
            height: 190rpx;
            z-index: 1;
        }
        .today-order-num {
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            font-size: 48rpx;
            color: #712E01;
            margin-bottom: 8rpx;
        }
        .fans-num {
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            font-size: 36rpx;
            color: #712E01;
            margin-bottom: 12rpx;
        }
        .fans-count {
            color: #111111;
            font-size: 24rpx;
            font-weight: 400;
            .fans-box {
                max-width: 470rpx;
                .fans-item {
                    min-width: 160rpx;
                    &:nth-child(1) {
                        padding-right: 24rpx;
                    }
                    &:last-child {
                        padding-left: 24rpx;
                    }
                    .fans-num {
                        color: #FF4800;
                        font-weight: 600;
                        margin-left: 20rpx;
                    }
                }
                .space-line {
                    height: 24rpx;
                    width: 2rpx;
                    background-color: #FF4800; 
                }
            }
        }
        
    }
    .jump-box {
        padding: 0 28rpx 20rpx;
        position: relative;
    }
    .jump-bg {
        position: absolute;
        top: 0;
        height: 0;
        width: 694rpx;
        height: 160rpx;
        z-index: 1;
    }
    .jump-btns {
        position: relative;
        z-index: 2;
        padding: 40rpx;
        .jump-line {
            width: 0;
            height: 80rpx;
            border: 2rpx solid #FFFFFF;
        }
        .btn-item {
            .btn-icon {
                width: 80rpx;
                height: 80rpx;
                margin-right: 20rpx;
            }
            &:last-child {
                .btn-icon {
                    margin-left: 40rpx;
                    margin-right: 20rpx;
                }
            }
            .btn-text {
                font-family: PingFangSC-Medium;
                font-weight: 500;
                font-size: 26rpx;
                color: #000000;
            }
        }
    }
    .expert-head {
        height: 208rpx;
        .medal-task-icon {
            height: 208rpx;
        }
    }
    .expert-task {
        position: relative;
        padding: 0 28rpx;
        .task-bg {
            position: absolute;
            z-index: 1;
            width: 694rpx;
            height: 540rpx;
        }
        .task-buy-wrap {
            position: relative;
            z-index: 3;
            height: 540rpx;
            padding: 40rpx;
        }
        &.medal-task {
            padding: 0 32rpx 32rpx;
            border: 2rpx solid #FFF;
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
        &.fans-wrap {
            padding: 0 16rpx;
            .fans-box-bg {
                position: absolute;
                left: 0;
                top: 0;
                width: 686rpx;
                height: 240rpx;
                z-index: 1;
            }
            .fans-data-icon {
                position: absolute;
                z-index: 2;
                top: 0;
                left: 0;
                width: 176rpx;
                height: 76rpx;
            }
            .fans-box {
                position: relative;
                z-index: 3;
                margin: 72rpx 0 16rpx;
                background-color: #fff;
                padding: 32rpx 24rpx;
                border-radius: 32rpx;
                .fans-item {
                    width: 180rpx;
                    &.sign {
                        flex: 1;
                    }
                }
                .fans-title {
                    color: #111111;
                    font-size: 24rpx;
                    font-weight: 500;
                    margin-bottom: 8rpx;
                }
                .fans-today {
                    height: 32rpx;
                    padding: 0 8rpx;
                    border-radius: 8rpx;
                    background: #C5FE39;
                    color: #111111;
                    font-size: 20rpx;
                    font-weight: 500;
                    margin-right: 8rpx;
                }
                .fans-num {
                    color: #ff6a00;
                    font-size: 32rpx;
                    font-weight: 600;
                }
            }
        }
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
                    width: 216rpx;
                    height: 44rpx;
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
        .video-matrix-expert {
            height: 400rpx;
            width: 686rpx;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            &.medal-task-bg {
                height: 112rpx;
                top: -3rpx;
                left: 4rpx;
            }
        }
        .task-box {
            position: relative;
            z-index: 2;
            .task-head {
                font-family: STYuanti-SC-Bold;
                font-weight: 700;
                font-size: 32rpx;
                color: #000000;
                margin-bottom: 8rpx;
                position: relative;
                .video-matrix-task-upgrade {
                    width: 192rpx;
                    height: 40rpx;
                }
                .mission-center-upgrade {
                    width: 192rpx;
                    position: relative;
                    z-index: 2;
                }
                .task-progress {
                    color: #571f01;
                    font-size: 20rpx;
                    font-weight: 400;
                    .progress-num {
                        color: #FF3221;
                        font-size: 24rpx;
                        font-weight: 600;
                        margin-left: 8rpx;
                    }
                }
                .expert-code {
                    font-size: 28rpx;
                    color: #FF4200;
                    font-weight: 500;
                }
                .mark {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 72rpx;
                    height: 36rpx;
                    background: #C5FE39;
                    z-index: 1;
                    border-radius: 8rpx;
                }
            }
            .task-list {
                
                .task-item {
                    padding: 16rpx 0;
                    .item-info {
                        .item-img {
                            width: 64rpx;
                            height: 64rpx;
                            border-radius: 50%;
                            margin-right: 24rpx;
                        }
                        .item-store-name {
                            color: #000000;
                            font-size: 28rpx;
                            font-weight: 600;
                            max-width: 360rpx;
                        }
                    }
                    .item-btn {
                        width: 120rpx;
                        padding: 12rpx 0;
                        color: #FFF;
                        font-size: 24rpx;
                        font-weight: 400;
                        text-align: center;
                        border-radius: 16rpx;
                        background: linear-gradient(90deg, #FF7B14 0%, #FF4200 100%);
                        &.complete-acitve {
                            color: #ff6a00;
                            background: rgba(255, 106, 0, 0.1);
                        }
                    }
                }
            }
        }
        .buy-task {
            // margin: 16rpx 32rpx 0;
            // padding: 32rpx 24rpx;
            // border-radius: 24rpx;
            // border: 1rpx solid #ff6a001a;
            // background: linear-gradient(to bottom, #ffa15e1a, #ffa15e00);
            .complete-buy-num {
                color: #000000;
                font-size: 26rpx;
                font-weight: 400;
                .buy-num {
                    color: #fa6262;
                    font-size: 26rpx;
                    font-weight: 600;
                }
            }
            .complete-progress-total {
                margin: 16rpx 0 8rpx;
                border-radius: 4rpx;
                background: #ff6a0033;
                height: 8rpx;
                .complete-progress-num {
                    height: 8rpx;
                    border-radius: 4rpx;
                    background: linear-gradient(to right, #FF6A00, #FF6A00);
                }
            }
            .task-operate {
                padding: 24rpx 0 0;
                .task-item {
                    background: #FFFFFF;
                    border-radius: 16rpx;
                    padding: 24rpx;
                    &.task-order {
                        padding: 12rpx 24rpx 36rpx;
                        margin-top: 16rpx;
                    }
                    .mission-center-no1, .mission-center-no2 {
                        height: 36rpx;
                        margin-bottom: 24rpx;
                    }
                    .mission-center-no1 {
                        width: 200rpx;
                    }
                    .step-box {
                        .step-head-box {
                            width: 118rpx;
                            height: 44rpx;
                            position: relative;
                            margin-left: 14rpx;
                            margin-right: 12rpx;
                        }
                        .step-bg {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 118rpx;
                            height: 44rpx;
                            z-index: 1;
                        }
                        .step-num {
                            color: #9B4C00;
                            position: relative;
                            z-index: 3;
                            font-family: PingFangSC-Semibold;
                            font-weight: 600;
                            font-size: 26rpx;
                            line-height: 44rpx;
                            padding-left: 22rpx;
                        }
                        .step-name {
                            line-height: normal;
                            font-family: PingFangSC-Regular;
                            font-weight: 400;
                            font-size: 26rpx;
                            color: #000000;
                        }
                    }
                    .mission-center-no2 {
                        width: 228rpx;
                    }
                    .task-info {
                        background: #F9F9F9;
                        border-radius: 24rpx;
                        &.download-order {
                            
                            padding-left: 20rpx;
                            .store_info {
                                color: #111111;
                                font-size: 28rpx;
                                font-weight: 600;
                                height: 72rpx;
                                line-height: 72rpx;
                                .store_name {
                                    color: #1b9aff;
                                    font-size: 28rpx;
                                    font-weight: 600;
                                    padding: 0 8rpx;
                                    display: inline-block;
                                    max-width: 220rpx;
                                    vertical-align: bottom;
                                }
                            }
                            .execute-btn {
                                width: 152rpx;
                                height: 64rpx;
                                background-image: linear-gradient(180deg, #FFB872, #FF7F05);
                                box-shadow: 0 4rpx 8rpx 0 #ff9c39cc;
                                border-radius: 16rpx;
                                font-family: PingFangSC-Semibold;
                                font-weight: 600;
                                font-size: 28rpx;
                                color: #FFFFFF;
                                text-align: center;
                                line-height: 64rpx;
                            }
                        }
                        &.order-num {
                            // padding: 36rpx 32rpx;
                            // background: #fff;
                            .tip-head {
                                color: #111111;
                                font-size: 24rpx;
                                font-weight: 400;
                                margin-bottom: 26rpx;
                            }
                            .order-input {
                                background: #F9F9F9;
                                height: 72rpx;
                                border-radius: 24rpx;
                                padding: 0 24rpx;
                                
                            }
                            /deep/.input-tip {
                                color: #aaaaaa;
                                font-size: 28rpx;
                                font-weight: 400;
                            }
                            .sumbit-btn {
                                width: 152rpx;
                                height: 64rpx;
                                background-image: linear-gradient(180deg, #FFB872, #FF7F05);
                                box-shadow: 0 4rpx 8rpx 0 #ff9c39cc;
                                border-radius: 16rpx;
                                font-family: PingFangSC-Semibold;
                                font-weight: 600;
                                font-size: 28rpx;
                                color: #FFFFFF;
                                text-align: center;
                                line-height: 64rpx;
                            }
                        }
                    }
                }
                
            }
            .buy-task-list {
                .task-item {
                    padding: 16rpx 0;
                    .item-info {
                        .item-img {
                            width: 64rpx;
                            height: 64rpx;
                            border-radius: 50%;
                            margin-right: 24rpx;
                        }
                        .item-store-name {
                            color: #000000;
                            font-size: 28rpx;
                            font-weight: 600;
                            max-width: 320rpx;
                        }
                    }
                    .item-btn {
                        width: 120rpx;
                        padding: 12rpx 0;
                        color: #FFF;
                        font-size: 24rpx;
                        font-weight: 400;
                        text-align: center;
                        border-radius: 16rpx;
                        // background: linear-gradient(90deg, #FF7B14 0%, #FF4200 100%);
                        background: linear-gradient(103deg, #FF3221, #FFA32A);
                        &.complete-acitve {
                            color: #FF3221;
                            background: rgba(255, 106, 0, 0.1);
                        }
                    }
                }
            }
            .complete-all {
                padding-top: 20rpx;
                font-size: 32rpx;
                font-weight: 600;
                color: #ff6a00;
                text-align: center;
            }
            
        }
    }
    .tip-box {
        padding: 40rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 28rpx;
        color: #000000;
        .tip-title {
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            font-size: 34rpx;
            color: #111111;
        }
    }
}
.apply-expert-tip {
    font-size: 28rpx;
    color: #ff6a00;
    font-weight: 600;
    margin: 0 32rpx;
    text-align: center;
}
.complete-btn {
    position: fixed;
    left: 0;
    z-index: 99;
    width: 750rpx;
    padding: 0 32rpx;
    /* #ifndef H5 */
    bottom: 32rpx;
    /* #endif */
    /* #ifdef H5 */
    bottom: 122rpx;
    /* #endif */
    
    .video-matrix-complete-btn {
        height: 112rpx;
    }
    .expert-mentor-btns-address {
        width: 240rpx;
        height: 88rpx;
    }
    .expert-mentor-btns-task {
        width: 422rpx;
        height: 88rpx;
    }
}


.popup-bottom {
margin-left: 48rpx;
}

.share-list {
margin-right: 80rpx;
//   margin-top: 74rpx;
&.share-save {
    margin-right: 0;
}
.share-img {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 12rpx;
}
}

.kkyz_logo {
width: 300rpx;
height: 80rpx;
}

.swiper-bottom {
width: 480rpx;
height: 124rpx;
background: #fff;
padding: 0px 24rpx;
}

.swiper-item-box {
//   width: 480rpx;
display: flex;
justify-content: center;
}

.swiper {
height: 806rpx;
}

.swiper-item {
height: 806rpx;
// background: #1cdafe;
display: flex;
flex-direction: column;
align-items: center;
position: relative;

.swiper-img {
    width: 480rpx;
    height: 676rpx;
    border-radius: 20rpx 20rpx 0px 0px;
}
}

.popup-content-box {
//   width: 750rpx;
//   height: 1280rpx;
background-color: #fbfbfb;
border-radius: 20rpx 20rpx 0px 0px;
//   padding-top: 112rpx;
}
.invite-tip {
    // width: 268rpx;
    font-size: 24rpx;
    color: #111;
    font-weight: 400;

}
.mobile {
    margin-top: 8rpx;
    color: #1827e9;
    font-weight: 400;
    font-size: 24rpx;
}
.longpress-tip {
    font-size: 28rpx;
    color: #ff6a00;
    font-weight: 600;
    text-align: center;
}
.create-poster {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 480rpx;
}
.btn-tip {
    font-size: 24rpx;
    color: #ff6a00;
    font-weight: 600;
    text-align: center;
}

.store-content {
    .store-qrcode {
        width: 332rpx;
        height: 332rpx;
    }
    .store-tip {
        margin-top: 32rpx;
        color: #111111;
        font-size: 24rpx;
        font-weight: 400;
    }
}

.s_list {
    position: relative;
    padding: 32rpx;
    margin: -48rpx 24rpx 0;
    background: #FDFDFD;
    border-radius: 32rpx;
    box-shadow: 0 4px 32px 0 #eeeeee;
    z-index: 10;
    overflow: hidden;
}
.s_item {
    height: 160rpx;
    padding: 0 32rpx;
    border-radius: 16rpx;
    background: #FFF;
    box-shadow: 0 0 24px 0 #eeeeee;
    margin-bottom: 24rpx;
}
.last_item {
    margin-bottom: 0;
}
.item_img {
    width: 96rpx;
    height: 96rpx;
    margin-right: 32rpx;
}
.order_arrows {
    width: 24rpx;
    height: 24rpx;
}
.t_title {
    color: #111111;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
}
.t_desb {
    color: #999999;
    font-size: 24rpx;
    font-weight: 400;
}
</style>
