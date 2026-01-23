<template>
  <c-tip-modal ref="modal_dialog" :modal_info="info" :popup_style="{ width: '440rpx'}">
    <view class="gold-coin-num" v-if="info.num"><text class="num-text">+{{info.num}}金币</text></view>
  </c-tip-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";
import { onLoad, onShow, onReady, onInit, onHide } from "@dcloudio/uni-app";
import mine_use_store from '/views/pages/save-money/store/modules/mine.ts';

const mine_store = mine_use_store();
const modal_dialog = ref();
const props = defineProps({
    // 弹窗相关数据(金币数据)
    modal_info: {
        type: Object,
        default: () => ({
            num: 0,
            text: "",
            icon: "/images/save-money/gold-coin-logo-middle.png",
        })
    },
})
const info = ref(props.modal_info.value || {
  num: 0,
  text: "",
  icon: "/images/save-money/gold-coin-logo-middle.png",
});

// 通过任务类型不同，触发不同回调
function triggerCbByType(data, type) {
  switch (type) {
    case 'rights_invite_user':
    case 'task_browse_video':
    case 'task_browse_territory_content':
      completeTask(type, data);
      break;
    case 'improve_personal_information':
    case 'kkyz_release_information':
    case 'kkyz_post_comment':
    case 'kkyz_like_information':
    case 'task_sign_in':
      coinsPopup(data);
      break;
    default:
      modal_dialog.value.open();
      break;
  }
}

// 任务完成金币弹窗
function coinsPopup(data) {
    if (data?.is_task_finish) {
        modal_dialog.value.open();
    }
}

// 任务触发接口
function completeTask(type, data = {}) {
  // 判断用户是否登录，如果未登录，则不触发
  const is_login = uni.getStorageSync("isLogin");
  if (!is_login) return;
  mine_store.completeTask({ task_tag: type, link_id: data.link_id }).then((res) => {
    const { task_desc, task_gold, is_task_finish } = res;
    info.value = {icon: "/images/save-money/gold-coin-logo-middle.png", text: task_desc, num: task_gold};
    coinsPopup({is_task_finish});
  });
}



// 打开
function _open(data = {}, type) {
    const { task_desc, task_gold } = data;
    info.value = {icon: "/images/save-money/gold-coin-logo-middle.png",...data, num: task_gold, text: task_desc};
    triggerCbByType(data, type);
    // modal_dialog.value.open();
}


// 暴露方法
defineExpose({
  open: _open,
});
</script>

<style lang="less" scoped>
.gold-coin-num {
  color: #ffffff;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  .num-text {
    color: #ffffff;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
  }
}

</style>
