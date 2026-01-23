<template>
    <uni-popup ref="system_popup" mask-background-color="rgba(0,0,0,0.6)">
        <view>
			<view class="system_wrap flex flex-column flex-ac">
				
				<view class="system-content" :style="{ background: `#fff` }">
					<image
						class="system-bg"
						mode="widthFix"
						:src="imgUrlEvent('/images/kkyz/system-bg.png', 'aliyunImgUrl')"
						></image>
					<view class="content-wrap">
						<view class="flex jc-end flex-ac">
							<uni-icons class="close-btn" type="closeempty" color="#111111" size="24" @click="_close"></uni-icons>
						</view>
						<view class="title-box"><text class="title-text">{{ info.title|| '系统公告'}}</text></view>
						<scroll-view
							:scroll-y="true"
							class="scroll-view"
							:style="{
							maxHeight: (info.attachment_url ? 200 : 300) + 'px',
							overflow: 'hidden',
							paddingBottom: 10 + 'px',
							}"
						>
							<uv-parse
							:content="info.content"
							:tagStyle="styles"
							></uv-parse>
						</scroll-view>
						<view class="material-box">
							<video v-if="info.attachment_type == 'video'" class="video-box" :src="info.attachment_url" :poster="info.video_cover_url"></video>
							<image
							v-else
							class="image-box"
							mode="aspectFill"
							:src="info.attachment_url"
							@click="previewImage"
							></image>
						</view>
					</view>
					
				</view>
				<image
					class="system-notice-icon"
					mode="widthFix"
					:src="imgUrlEvent('/images/kkyz/system-notice-icon.png', 'aliyunImgUrl')"
					></image>
				<view class="confirm-btn flex flex-ac jc-ct">
					<view class="btn-box" @click="confirmPopup">
						<image
						class="system-confirm-img"
						mode="aspectFill"
						:src="imgUrlEvent('/images/kkyz/system-confirm-btn.png', 'aliyunImgUrl')"
						></image>
						<text class="btn-text">{{ info.mip_link_title || '确认' }}</text>
					</view>
				</view>
			</view>
		</view>
    </uni-popup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
// import { imgUrlEvent } from "@/views/pages/save-money/infrastructure/utils/imgUrls";
const emits = defineEmits(["close", "confirm"]);
const props = defineProps({
  info: {
    type: Object,
    default: () => ({
        content: "<p>体验官代理的地区，用户充值会员，都将获得充值总费用90%购买“兑换券”后，其中的20%“兑换券”平均奖励给体验官。<\/p>"
    })
  }
});

const system_popup = ref();

const styles = {
  img: "margin:32rpx 0px",
  text: "font-size:28rpx;text-align: justify;margin-top:0rpx;word-wrap: break-word;overflow-wrap: break-word;",
  span: "font-size:28rpx;margin-top:0rpx;word-wrap: break-word;overflow-wrap: break-word;",
  p: "font-size:28rpx;margin:0rpx;padding:0rpx;line-height:1.5;word-wrap: break-word;overflow-wrap: break-word;text-align: justify;",
};

function onVideoClick() {
    console.log("onVideoClick")
}

// 图片预览
function previewImage() {
    uni.previewImage({
        current: 1,
        urls: [props.info.attachment_url],
    })
}

// 关闭
function _close() {
  system_popup.value.close();
}

// 打开
function _open() {
  system_popup.value.open();
}

// 确认按钮
function _confirm() {
  emits("confirm");
}

// 取消按钮
function _cancel() {
  emits("close");
}

// 弹窗确认
function confirmPopup() {
    _close();
    if (props.info.mip_link_url) {
        let routes = [
            "/views/pages/home/index",
            "/views/pages/explore/index",
            "/views/pages/message/index",
            "/views/pages/mine/index",
        ];
        if (routes.includes(props.info.mip_link_url)) {
            uni.switchTab({
                url: props.info.mip_link_url,
            });
            return;
        }
        uni.navigateTo({
            url: props.info.mip_link_url,
        });
    }
    
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
.system_wrap {
    width: 590rpx;
	padding: 64rpx 0 100rpx;
	position: relative;
    .system-content {
        background: #fff;
        border-radius: 48rpx;
        // margin-top: -102rpx;
        padding: 32rpx 48rpx 80rpx;
		position: relative;
		z-index: 1;
		.content-wrap {
			position: relative;
			z-index: 2;
		}
		.system-bg {
			position: absolute;
			border-radius: 48rpx;
			width: 590rpx;
			top: 0;
			left: 0;

		}
        .title-box {
            text-align: center;
            margin: 24rpx 0 28rpx;
            .title-text {
				text-align: center;
                font-size: 44rpx;
                font-weight: 700;
                // #ifdef APP-NVUE
				color: #FF2B00;
                // #endif
				// #ifndef APP-NVUE
                background-image: linear-gradient(to right, #FF2B00, #FFC800);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
				// #endif
            }
        }
        .close-btn {
            width: 48rpx;
            height: 48rpx;
            margin-right: -12rpx;
        }
        .material-box {
            width: 494rpx;
            max-height: 256rpx;
            margin-bottom: 24rpx;
            border-radius: 16rpx;
            position: relative;
            z-index: 999;
            .video-wrap {
                max-height: 256rpx;
                width: 494rpx;
                border-radius: 16rpx;
            }
            .video-box {
                max-height: 256rpx;
                width: 494rpx;
                border-radius: 16rpx;
            }
            .image-box {
                width: 494rpx;
                max-height: 256rpx;
                border-radius: 16rpx;
            }
        }
        .scroll-view {
            margin-bottom: 24rpx;
        }
    }
    .system-notice-icon {
        width: 166rpx;
        height: 166rpx;
		// margin-bottom: -102rpx;
        position: absolute;
        z-index: 2;
		top: 0rpx;
    }
    .confirm-btn {
		position: absolute;
		z-index: 2;
		bottom: 0;
		height: 176rpx;
		
        .btn-box {
            min-width: 366rpx;
            text-align: center;
			position: relative;
        }
		.system-confirm-img {
			position: absolute;
			width: 366rpx;
			height: 176rpx;
			// min-width: 366rpx;

		}
        .btn-text {
            color: #ffffff;
            font-size: 36rpx;
            font-weight: 700;
            padding: 34rpx 72rpx 100rpx;
			text-align: center;
        }
    }
}
</style>