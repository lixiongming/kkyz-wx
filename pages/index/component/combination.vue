<template>
  <view></view>
</template>

<script>
import { HTTP_REQUEST_URL } from "@/config/app";
import { getCombinationData } from "@/api/api.js";
export default {
  name: "combination",
  props: {
    dataConfig: {
      type: Object,
      default: () => {},
    },
    merId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      domain: HTTP_REQUEST_URL,
      combinationList: [],
      themeColor: this.dataConfig.themeColor.color[0].item, //主题颜色
      styleType: this.dataConfig.tabConfig.tabVal, //单行，多行，板块
      mbConfig: this.dataConfig.mbConfig.val * 2,
      bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
      bgColor: this.dataConfig.bgColor.color[0].item,
      txtColor: this.dataConfig.txtColor.color[0].item,
      conStyle: this.dataConfig.conStyle.type,
      priceShow: this.dataConfig.priceShow.val,
      bntShow: this.dataConfig.bntShow.val,
      titleShow: this.dataConfig.titleShow.val,
      pinkShow: this.dataConfig.pinkShow.val,
      diy_id: this.dataConfig.did,
      unique: this.dataConfig.timestamp,
      bannerIndex: 0,
      isTransiton: true,
    };
  },
  created() {},
  mounted() {
    this.getCombinationList();
    setTimeout(() => {
      console.log(this.bannerList);
      if (this.bannerList.length > 3) {
        this.swiperEvent();
      }
    }, 1000);
  },
  methods: {
    // 砍价列表
    getCombinationList() {
      let that = this;
      getCombinationData({
        diy_id: that.diy_id,
        unique: that.unique,
        mer_id: that.merId,
        page: 1,
        limit: that.styleType == 2 ? 3 : 12,
      }).then((res) => {
        that.combinationList = res.data.list;
        console.log(res.data.list, "res.data.list");
      });
    },
    // 轮播事件
    swiperEvent() {
      setInterval(() => {
        this.isTransiton = true;
        this.bannerIndex += -234;
        if (this.bannerIndex == (this.combinationList.length + 1) * -234) {
          this.isTransiton = false;
          this.bannerIndex = 0;
        }
      }, 3000);
    },
  },
  computed: {
    bannerList: {
      get() {
        return this.combinationList.length < 4
          ? this.combinationList
          : [...this.combinationList, ...this.combinationList.slice(0, 3)];
      },
    },
  },
};
</script>

<style lang="scss">
@import "../style/main.scss";
.seckill-count {
  background-color: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  padding: 24rpx 0 26rpx 20rpx;
  box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
  &.wrapper-count2 {
    padding: 24rpx 20rpx 26rpx;
  }
}

.comb-label {
  font-size: 24rpx;
  border-radius: 2rpx;
  padding: 1rpx 5rpx;
}
.com_btn {
  width: 96%;
  margin: 10rpx auto 0;
  height: 46rpx;
  line-height: 46rpx;
  background: linear-gradient(90deg, red 0%, #ff5400 100%);
  border-radius: 24rpx;
  text-align: center;
  color: #fff;
  font-size: 24rpx;
}

.combination-item:nth-child(1) .img-box {
  left: 20rpx;
  width: 300rpx;
  /deep/uni-image {
    width: 300rpx;
  }
}
.swiper-item {
  flex-shrink: 0;
  left: 0px;
  position: relative;

  width: 215rpx !important;
}
.swiper-box {
  overflow: hidden;
}
.com_btn-box {
  animation: bigBtn 1s infinite;
  width: 80%;
}

@keyframes bigBtn {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
