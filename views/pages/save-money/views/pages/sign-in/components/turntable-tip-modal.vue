<template>
    <c-modal 
        ref="modal_dialog" 
        :title="props.turntable_result.title" 
        confirmText="知道了"
        cancelText=""
        @confirm="_confirm"
        :confirmBtnStyles="confirm_btn_styles"
        @change="change"
        >
        <template v-slot:content>
            <view class="turntable-tip-content flex flex-column jc-ct flex-ac">
                <view id="fireworks" class="fireworks-box" v-if="props.turntable_result.is_win_prize">
                    <template v-for="(item, i) in fireworks_imgs" :key="item.id">
                        <image v-if="item.is_show" class="fireworks-img fireworks-img1" :class="item.class" :src="item.path"></image>
                    </template>
                </view>
                <image class="turntable-tip-img" :src="props.turntable_result.icon"></image>
                <view class="turntable-tip-txt">{{props.turntable_result.name}}</view>
            </view>
        </template>
    </c-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose, onMounted } from "vue";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import {imgUrlEvent} from '/views/pages/save-money/infrastructure/utils/imgUrls'
import {preloadImageAllSettled} from '/views/pages/save-money/infrastructure/utils/preload-image'
const emits = defineEmits(["close", "confirm", "turntableResultCallback", "checkAndShowTurntablePopup"]);
const props = defineProps({
    turntable_result: {
        type: Object,
        default: {}
    }
})
const modal_dialog = ref();
// 转盘结果弹窗按钮样式
const confirm_btn_styles = `background: linear-gradient(90deg, #FF3221, #FFA32A); width: 100%;`
// 烟花图片
const fireworks_imgs = ref([
    { id: 1, path: '', start_time: 0, end_time: 0, is_show: false, class: '' },
])
// 图片
let imgs = [];
// 烟花图片class
let classes = [];

onLoad(() => {
    console.log("触发--->")
    createImgs();
    createClasses();
    preloadImageComplete();
})

// 弹窗change事件
function change(e) {
    if (e.show && props.turntable_result.is_win_prize) {
        randomCreateFireworksData();
    } else {
        // 校验是否还有抽奖机会
        emits("checkAndShowTurntablePopup");
    }
}

// 预加载图片完成
function preloadImageComplete() {
    preloadImageAllSettled(imgs).then((res) => {
        console.log("res---->", res);
        console.log('图片预加载完成');
        // 去除掉预加载失败的图片
        imgs = imgs.filter((img, i) => res[i].status == "fulfilled")
    }).catch((e) => {
        console.log('图片预加载失败', e);
    })
}

// 生成烟花图片
function createImgs() {
    imgs = [imgUrlEvent('/images/save-money/blue.gif'), imgUrlEvent('/images/save-money/green.gif'),imgUrlEvent('/images/save-money/pink.gif'),imgUrlEvent('/images/save-money/purple.gif'),imgUrlEvent('/images/save-money/yellow.gif')];
}

// 生成烟花图片class
function createClasses() {
    let list = [];
    for(let i = 0; i < 10; i ++) {
        list.push(`img-${i + 1}`)
    }
    classes = list;
}

// 随机生成烟花开始时间及坐标等
function randomCreateFireworksData() {
    // 随机出现总个数(7-10)
    let sum_num = Math.ceil(Math.random() * 3 + 7);
    // 生成图片及展示相关信息
    let create_imgs = [];
    for(let i = 0; i < sum_num; i ++) {
        let cur_img = {};
        let index = Math.floor(Math.random() * imgs.length);
        console.log("index-->", index)
        cur_img.path = imgs[index];
        cur_img.id = i + 1;
        // class列表
        let class_list = JSON.parse(JSON.stringify(classes));
        let k = Math.floor(Math.random() * class_list.length);
        cur_img.class = class_list[k];
        class_list.splice(k, 1); 
        // 设置是否显示
        cur_img.is_show = false;
        // 随机开始时间
        cur_img.start_time = Math.floor(Math.random() * 1000) + 100;
        // 随机结束时间
        cur_img.end_time = cur_img.start_time + 1600;
        create_imgs.push(cur_img);
        // 开始显示图片定时器
        setTimeout(() => {
            fireworks_imgs.value[i].is_show = true;
        }, cur_img.start_time);
        // 结束显示图片定时器
        setTimeout(() => {
            fireworks_imgs.value[i].is_show = false;
        }, cur_img.end_time);
    }
    fireworks_imgs.value = create_imgs;
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
.turntable-tip-content {
    position: relative;
    .fireworks-box {
        position: absolute;
        left: -30rpx;
        top: -100rpx;
        width: 500rpx;
        height: 300rpx;
        .fireworks-img {
            position: absolute;
            left: 0;
            right: 0;
            width: 100rpx;
            height: 100rpx;
            // object-fit: cover;
            &.img-1 {
                left: 20rpx;
                top: 20rpx;
            }
            &.img-2 {
                left: 120rpx;
                top: 80rpx;
            }
            &.img-3 {
                left: 220rpx;
                top: 40rpx;
            }
            &.img-4 {
                left: 320rpx;
                top: 60rpx;
            }
            &.img-7 {
                left: 400rpx;
                top: 20rpx;
            }
            &.img-5 {
                left: 20rpx;
                top: 120rpx;
            }
            &.img-6 {
                left: 40rpx;
                top: 220rpx;
            }
            &.img-8 {
                left: 370rpx;
                top: 120rpx;
            }
            &.img-9 {
                left: 370rpx;
                top: 220rpx;
            }
            &.img-10 {
                left: 370rpx;
                top: 20rpx;
            }
        }
    }
    .turntable-tip-img {
        width: 128rpx;
        height: 128rpx;
        margin-bottom: 8rpx;
    }
    .turntable-tip-txt {
        color: #111111;
        text-align: center;
        font-size: 24rpx;
        font-weight: 400;
    }
}
</style>
