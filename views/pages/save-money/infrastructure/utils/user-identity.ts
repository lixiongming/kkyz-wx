// 引入个人信息相关store
import store_use_mine from '@/views/pages/save-money/store/modules/mine.ts'


/**
 * 版本v2: 体验官、领主也视为会员
 * 判断用户是否为会员(发红包、幸运大抽奖相关使用)
 * @param 
 * @returns 
 */
export function userIsMember() {
    let store_mine = store_use_mine();
    return store_mine.my_info?.user_type == 2 || store_mine.my_info?.is_experience || store_mine.my_info?.is_landlord;
}