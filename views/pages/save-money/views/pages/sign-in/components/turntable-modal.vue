<template>
  <uni-popup
    ref="modal_dialog"
    background-color="transparent"
    borderRadius="16px 16px 16px 16px"
    mask-background-color="rgba(0,0,0,0.6)"
  >
    
    <view class="popup-content flex flex-column flex-1">
        <image class="turntable-disc-outer" :src="$imgUrl('/images/save-money/turntable-disc-outer.png')"></image>
        <view class="turntable-disc-in-box" :style="{transform: `rotate(${turntable_result.deg}deg)`, transition: is_open_animation ? 'transform 5s' : 'none'}">
            <image class="turntable-disc-in" :src="$imgUrl('/images/save-money/turntable-disc-in1.png')"></image>
            <view class="turntable-box" >
                <view class="turntable-item" :class="`t-${i}`" v-for="(item, i) in turntable_list" :key="i" :style="item.style">
                    <view class="turntable-content">
                        <image class="info-icon" :src="item.icon"></image>
                        <view class="info-name">{{item.name}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="turntable-center-box">
            <image class="turntable-pointer" :src="$imgUrl('/images/save-money/turntable-pointer1.png')"></image>
            <image class="turntable-center-outer" :src="$imgUrl('/images/save-money/turntable-center-outer.png')"></image>
            <image class="turntable-center-in" :src="$imgUrl('/images/save-money/turntable-center-in.png')"></image>
            <view class="turntable-btn" @click="rotateClick">
                <image class="turntable-go" :class="`${animation_class.btn_size}`" :src="$imgUrl('/images/save-money/turntable-go.png')" ></image>
                <view class="gloss-wrap">
                    <view class="gloss-box" :class="`${animation_class.btn_gloss}`"></view>
                </view>
                
            </view>
        </view>
        
        <image class="turntable-close" :src="$imgUrl('/images/save-money/turntable-close.png')" @click="_close"></image>
    </view>
    
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import {imgUrlEvent} from '/views/pages/save-money/infrastructure/utils/imgUrls'
import {preloadImageAllSettled} from '/views/pages/save-money/infrastructure/utils/preload-image'
import mineUseStore from '/views/pages/save-money/store/modules/mine.ts';

const mineStore = mineUseStore();
const emits = defineEmits(["close", "confirm", "turntableResultCallback"]);
const props = defineProps({
    // 抽奖结果出来后，是否不关闭抽奖弹窗
    no_close_after_result: {
        type: Boolean,
        default: false
    },
    // 抽奖类型
    type: {
        type: String,
        default: ''
    },
})
const modal_dialog = ref();
const turntable_list = ref([])
// 抽奖的结果
const turntable_result = ref({
    type: null,
    deg: 0
})
// 控制页面动效class
const animation_class = ref({
    // 按钮大小动效
    btn_size: '',
    // 按钮光泽动效
    btn_gloss: ''
})
// 抽奖按钮是否正在进行中
const loading = ref(false);
// 图片
let imgs = [];
// 是否启动动画
const is_open_animation = ref(true);

// 根据传入的转盘的数据，生成每一转盘项坐标数据等
function createWheel(items, radius) {
  const angle_step = (2 * Math.PI) / items.length;
  const radius_step = 360 / items.length;
  console.log("angle_step: ", angle_step)

  items.forEach((item, index) => {
    const angle = angle_step * index;
    const x = radius * Math.cos(angle) + radius;
    const y = radius * Math.sin(angle) + radius;
    // 每项坐标
    item.style.left = `${x - 80}rpx`;
    item.style.top = `${y - 50}rpx`;
    // 旋转角度
    item.style.transform = `rotate(${radius_step * index + 90}deg)`;
    console.log("transform-->", 360- (radius_step * index + 60), 360 -  (radius_step * index + 120))
    // 当前项在圆盘角度范围
    item.deg_range = [360 -  (radius_step * index + 120), 360- (radius_step * index + 60)]
  });
  return items;
}



onLoad(async () => {
    // 获取礼品配置信息
    await getTurntableList();
    // 初始化奖品每项坐标, 半径设置为150px
    turntable_list.value = createWheel(turntable_list.value, 200);
    createImgs();
    preloadImageComplete();
})

// 获取礼品配置信息
async function getTurntableList() {
    const list = await mineStore.getLotteryConfig();
    turntable_list.value = list.map((item) => ({name: item.name, type: item.type, icon: item.icon, id: item.id, style: {},  deg_range: null }))
}

// 设置页面所需图片
function createImgs() {
    // 抽奖项图片
    let items = turntable_list.value.map((item) => item.icon);
    imgs = [imgUrlEvent('/images/save-money/turntable-disc-outer.png'), imgUrlEvent('/images/save-money/turntable-disc-in1.png'),imgUrlEvent('/images/save-money/turntable-pointer1.png'),imgUrlEvent('/images/save-money/turntable-center-outer.png'),imgUrlEvent('/images/save-money/turntable-center-in.png'), imgUrlEvent('/images/save-money/turntable-go.png'), imgUrlEvent('/images/save-money/turntable-close.png'), ...items];
}


// 预加载图片完成
function preloadImageComplete() {
    preloadImageAllSettled(imgs).then((res) => {
        console.log("res---->", res);
        console.log('图片预加载完成');
    }).catch((e) => {
        console.log('图片预加载失败', e);
    })
}

// 转盘旋转及旋转度数
function turnWheel(select_type) {
    // 随机生成旋转度数10-15
    const turm_num = Math.ceil(Math.random() * 5) + 10;
    let single_deg = 360;
    let degs = single_deg * turm_num;
    const select_list = turntable_list.value.filter(x => x.type == select_type);
    console.log("select_list", select_list);
    // 如果同类项，存在多个，则随机选中一个
    let select_item = select_list[0];
    if (select_list?.length > 1) {
        select_item = select_list[Math.ceil(Math.random() * 2) - 1];
    }
    console.log("select_item", select_item);
    const [min_deg, max_deg] = select_item.deg_range;
    // 随机落到当前选项的角度
    let select_turn_deg = min_deg + (Math.ceil(Math.random() * (max_deg - min_deg - 5)));
    let result = degs + select_turn_deg
    console.log("result -->", result);
    // 最终需要转动的度数
    return result;
}

// 旋转转盘按钮点击
async function rotateClick() {
    if (loading.value) return;
    loading.value = true;
    // 获取抽奖结果
    // let results = await mineStore.getLotteryResult();
    let results = await mineStore.getLotteryResultV1({ classify: props.type});
    turntable_result.value.type = results.type;
    turntable_result.value.deg = turnWheel(turntable_result.value.type);
    const is_win_prize = results.is_win_prize
    
    is_open_animation.value = true;
    // 关闭按钮动效
    animationSwitch(true);
    setTimeout(() => {
        loading.value = false;
        // 开启
        animationSwitch();
        !props.no_close_after_result && _close();
        // 转盘结果回调
        let result = turntable_list.value.find((item) => item.type == turntable_result.value.type);
        emits('turntableResultCallback', {...result, is_win_prize, title: is_win_prize ? '恭喜您中奖' : '很遗憾您没有中奖'})
        let timer = setTimeout(() => {
            // 清除定时器
            clearTimeout(timer);
            // 初始化数据
            turntable_result.value = {
                type: null,
                deg: 0
            }
            is_open_animation.value = false;
        }, 300);
    }, 5300);
}

// 动效开关
function animationSwitch(is_close) {
    let cls = '';
    if (is_close) {
        // 关闭按钮动效
        cls = 'close'
    }
    animation_class.value = {
        btn_size: cls,
        btn_gloss: cls,
    }
}

// 关闭
function _close() {
  modal_dialog.value.close();
}

// 打开
function _open() {
  modal_dialog.value.open();
}

// 确认按钮
function _confirm() {
  emits("confirm");
}

// 取消按钮
function _cancel() {
  emits("close");
}

// 暴露方法
defineExpose({
  open: _open,
  close: _close,
});
</script>

<style lang="less" scoped>
/deep/.uni-popup__wrapper {
  overflow: unset;
}
.popup-content {
//   width: 504rpx;
//   border-radius: 32rpx;
//   background: #fff;
//   padding: 32rpx;
//   overflow: unset;
}
.turntable-disc-outer {
    width: 656rpx;
    height: 656rpx;
    position: relative;
    z-index: 2;
}
.turntable-disc-in-box {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    // transition: transform 5s;
}
.turntable-disc-in {
    width: 584rpx;
    height: 584rpx;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.turntable-box {
    width: 400rpx;
    height: 400rpx;
    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .turntable-item {
        position: absolute;
        width: 160rpx;
        height: 100rpx;
        // background-color: red;
        &.t-0 {
            
        }
        &.t-1 {

        }
        .turntable-content {
            color: #ff6a00;
            text-align: center;
            font-size: 24rpx;
            font-weight: 700;
            .info-icon {
                width: 64rpx;
                height: 64rpx;
            }

        }
    }
}
.turntable-center-box {
    width: 240rpx;
    height: 264rpx;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 6;
    .turntable-center-outer {
        width: 240rpx;
        height: 264rpx;
    }
    .turntable-center-in {
        width: 216rpx;
        height: 216rpx;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 6;
    }
    .turntable-pointer {
        width: 72rpx;
        height: 80rpx;
        position: absolute;
        z-index: 5;
        top: -44rpx;
        left: 0;
        right: 0;
        margin: auto;
    }
}

.turntable-go {
    width: 160rpx;
    height: 160rpx;
    position: absolute;
    animation: scaleAnimation 2s infinite;
    &.close {
        animation: unset;
    }
}
.turntable-close {
    width: 56rpx;
    height: 56rpx;
    position: absolute;
    z-index: 7;
    bottom: -96rpx;
    left: 50%;
    transform: translateX(-50%);
}
.turntable-btn {
    width: 160rpx;
    height: 160rpx;
    position: absolute;
    z-index: 6;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    // border-radius: 50%;
    // overflow: hidden;
}
.gloss-wrap {
    position: absolute;
    width: 160rpx;
    height: 160rpx;
    z-index: 7;
    top: 0;
    left: 0;
    border-radius: 50%;
    transform: rotate(60deg);
    overflow: hidden;
}
.gloss-box {
    position: absolute;
    bottom: -20rpx;
    left: 0;
    background-color: rgba(255, 255, 255, 0.4);
    width: 160rpx;
    height: 20rpx;
    // transform: translate(-50%, -100%) rotate(30deg);
    animation: glossAnimation 2s infinite;
    &.close {
        animation: unset;
    }
}

// 光泽动画
@keyframes glossAnimation {
  0%, 100% {
    bottom: -20rpx;
  }
  40% {
    bottom: -20rpx;
  }
  100% {
    bottom: 160rpx;
  }
}
</style>
