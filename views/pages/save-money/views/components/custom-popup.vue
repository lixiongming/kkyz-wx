<template>
	<uni-popup ref="popup_ref" type="bottom" background-color="#fff" border-radius="48rpx 48rpx 0 0" :is-mask-click="props.is_mask_click" @change="change">
        <view class="popup-box">
            <view class="popup-header">
                <view class="header-left">
                    <slot name="left"></slot>
                </view>
                <view class="header-title">{{props.title}}</view>
                <view class="header-right">
                    <slot name="right">
                        <uni-icons type="closeempty" color="#111111" size="18" @click="closePopup"></uni-icons>
                    </slot>
                </view>
            </view>
            <view class="popup-content aa" :style="props.content_styles">
                <slot></slot>
            </view>
            <view class="popup-button" v-if="props.show_button">
                <slot name="button">
                    <view class="button-text" @click="confirmPopup">{{props.button_text || '确认'}}</view>
                </slot>
            </view>
        </view>
    </uni-popup>
</template>

<script setup>
    import { ref, computed, watch } from "vue";
	const hei = uni.getSystemInfoSync().windowHeight;
	const props = defineProps({
      // 标题
      title: {
        type: String,
        default: '',
      },
      // 确认按钮文本
      button_text: {
        type: String,
        default: '',
      },
      // 是否显示内容下方确认按钮
      show_button: {
        type: Boolean,
        default: true,
      },
      // 蒙版点击是否关闭弹窗
      is_mask_click: {
        type: Boolean,
        default: true,
      },
      // 点击确认按钮是否自动关闭弹窗
      click_confirm_close: {
        type: Boolean,
        default: true,
      },
      // 内容外层样式
      content_styles: {
        type: Object,
        default: () => ({}),
      },
	});
    const popup_ref = ref();
    /** 传入事件回调
     * onConfirm: 确认popup事件回调
     * onClose: 关闭popup事件回调
     */
    const emits = defineEmits(['onConfirm', 'onClose', 'onChange'])

    // 打开popup
    function openPopup() {
        popup_ref.value.open();
    }

    // 关闭popup
    function closePopup() {
        popup_ref.value.close();
        emits('onClose');
    }

    // 确认popup
    function confirmPopup() {
        props.click_confirm_close && popup_ref.value.close();
        emits('onConfirm');
    }

    function change(e) {
        emits('onChange', e.show);
    }

    // 对外暴露方法
    defineExpose({
        open: openPopup,
        close: closePopup,
        confirm: confirmPopup,
    })
</script>

<style lang="less">
.popup-box {
    .popup-header {
        height: 104rpx;
        line-height: 104rpx;
        text-align: center;
        font-size: 28rpx;
        display: flex;
        flex-direction: row;
        padding: 0 32rpx;
        justify-content: space-between;
        align-items: center;
        .header-title {
            flex: 1;
            color: #111111;
            text-align: center;
            font-size: 32rpx;
            font-weight: 500;
        }
        .header-left, .header-right {
            min-width: 48rpx;
            min-height: 48rpx;
        }
    }
    .popup-content {
        margin: 56rpx 40rpx;
    }
    .popup-button {
        margin: 0 40rpx 0;
        .button-text {
            background: linear-gradient(90deg, #FF3221, #FFA32A);
            line-height: 88rpx;
            text-align: center;
            color: #fff;
            border-radius: 24rpx;
            font-size: 32rpx;
            font-weight: 600;
        }
    }
}
</style>