// 引入个人页store
import mine_use_store from '/views/pages/save-money/store/modules/mine.ts';

export function useCoinsTask() {
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
            uni.$nativeView.show({
                text1: data.num,
                text2: data.text
            })
            break;
        }
    }

    // 任务完成金币弹窗
    function coinsPopup(data) {
        // 金币任务相关字段
        const { task_desc, task_gold, is_task_finish } = data;
        if (is_task_finish) {
            uni.$nativeView.show({
                text1: `+${task_gold}金币`,
                text2: task_desc
            })
        }
    }

    // 任务触发接口
    function completeTask(type, data = {}) {
        // 判断用户是否登录，如果未登录，则不触发
        const is_login = uni.getStorageSync("isLogin");
        if (!is_login) return;
        // 调用触发任务方法
        mine_use_store().completeTask({ task_tag: type, link_id: data.link_id }).then((res) => {
            coinsPopup(res || {});
        });
    }

    // 对外暴露方法(通过传入方法，执行对应的代码)
    function taskEmit(data = {}, type) {
        triggerCbByType(data, type);
    }

    return taskEmit;
}