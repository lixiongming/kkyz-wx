import { defineStore } from "pinia";
import { homeApi } from '/business/api/index.ts'
interface userInfo {
  name: string
}
export default defineStore<any>("home", {
  state: () => {
    return {
      videoList: [],//当前选中的银行卡
      reviewList: {
        items:[],
        pageInfo:{}
      },//评论列表
      myAttention: [],//我的关注列表
      currentInfo: {},//当前查看的动态详情
      tabsIndex: 0,//当前tab索引
      isPUllBlock:false,
    };
  },
  actions: {
    // 视频列表
    async home_video(num: number) {
      const { data } = await homeApi.home_video(num)
      this.videoList = data
      if (uni.getStorageSync('isLogin')) {
        // 获取视频列表添加是否关注标识
        await this.myAttentionAPis({ page: 1, pageSize: 999 })
        this.videoList.forEach((item: any) => {
          if (this.myAttention.items.findIndex((myitem: any) => myitem.user_id == item.user_id) !== -1) {
            item.isAttention = true
          }
        })
      }

    },

    // 分享
    async shareVideoApi(val: object) {
      const { data } = await homeApi.shareVideoApi(val)
      console.log(data, '分享')
    },
    // 评论列表
    async commentListApi(val: object) {
      const { data } = await homeApi.commentListApi(val)
      return data

    },
    // 评论
    async commentApi(val: object) {
      const { data } = await homeApi.commentApi(val)
      console.log(data, '评论')
      return data;
    },
    // 评论回复列表
    async levelCommentApi(val: object) {
      const { data } = await homeApi.levelCommentApi(val)
      return data

    },
    // 收藏
    async favoriteApi(val: object) {
      try {
        const { data } = await homeApi.favoriteApi(val)
        console.log(data, '收藏')
        uni.showToast({
          icon: 'none',
          title: data.status == 1 ? "收藏成功" : '取消收藏',
          duration: 2000,
        });
        return data.status
      } catch (err) {
        if (err == '用户异常或未登录，请重新登录') {
          console.log(1)
          uni.navigateTo({
            url: '/views/pages/mine/login?isHome=true',
          });
        }
      }
    },
    // 点赞
    async likeApi(val: object) {
      try {
        const { data } = await homeApi.likeApi(val)
        console.log(data, '点赞')
        return data;
      } catch (err) {
        console.log(err)
        if (err == '用户异常或未登录，请重新登录') {
          console.log(1)
          uni.navigateTo({
            url: '/views/pages/mine/login?isHome=true',
          });
        }
      }


    },
    // 点赞评论
    async likeCommentApi(val: object) {
      const { data } = await homeApi.likeCommentApi(val)
      console.log(data, '点赞评论')
      return data
    },
    // 踩评论
    async treadCommentApi(val: object) {
      const { data } = await homeApi.treadCommentApi(val)
      console.log(data, '踩评论')
      return data
    },
    // 我的关注
    async myAttentionAPis(params: object) {
      const { data } = await homeApi.myAttentionAPi(params)
      console.log(data, '关注列表')
      this.myAttention = data
      return data;
    },
    // 我的粉丝
    async myFansAPI(params: object) {
      const { data } = await homeApi.myFansAPI(params)
      return data;
    },
    // 关注他人或者取消关注接口
    async attentionAPI(params: object) {
      try {
        const { data } = await homeApi.attentionAPI(params)
        return data;

      } catch (err) {
        if (err == '用户异常或未登录，请重新登录') {
          console.log(1)
          uni.navigateTo({
            url: '/views/pages/mine/login?isHome=true',
          });
        }
        throw ('用户异常或未登录，请重新登录')
      }


    },
    // 获取是否弹窗系统公告
    async getSystemNotice(page_tag: any) {
      const { data } = await homeApi.getSystemNoticeApi(page_tag)
      return data
    },
  }

});