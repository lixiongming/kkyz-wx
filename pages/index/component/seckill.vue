<template>
  <view></view>
</template>

<script>
import { HTTP_REQUEST_URL } from "@/config/app";
import countDown from "@/components/countDown";
import easyLoadimage from "@/components/easy-loadimage/easy-loadimage.vue";
import { getSeckillData } from "@/api/api.js";
export default {
  name: "seckill",
  components: {
    countDown,
    easyLoadimage,
  },
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
      datatime: 0,
      color: "#E93323",
      spikeList: [],
      countDownColor: this.dataConfig.countDownColor.color[0].item,
      themeColor: this.dataConfig.themeColor.color[0].item,
      styleType: this.dataConfig.tabConfig.tabVal, //单行，多行，板块
      mbConfig: this.dataConfig.mbConfig.val * 2,
      bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
      bgColor: this.dataConfig.bgColor.color[0].item,
      conStyle: this.dataConfig.conStyle.type ? 16 : 0,
      conStyles: this.dataConfig.conStyle.type,
      priceShow: this.dataConfig.priceShow.val,
      progressShow: this.dataConfig.progressShow.val,
      titleShow: this.dataConfig.titleShow.val,
      diy_id: this.dataConfig.did,
      unique: this.dataConfig.timestamp,
    };
  },
  created() {},
  mounted() {
    this.getSeckillData();
  },
  methods: {
    getSeckillData() {
      let that = this;
      getSeckillData({
        diy_id: that.diy_id,
        unique: that.unique,
        mer_id: that.merId,
        limit: that.styleType == 2 ? 12 : 12,
      })
        .then((res) => {
          that.datatime = res.data.stop;
          that.spikeList = res.data.list;
          console.log("spikeList", res.data.list);
          that.spikeList.map((item) => {
            item.percent =
              item.stock === 0
                ? "0%"
                : ((item.sales * 100) / item.stock).toFixed(2) + "%";
          });
        })
        .catch((e) => {});
    },
    getProduct() {
      this.getSeckillData();
    },
  },
};
</script>

<style lang="scss" scoped>
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
.spike-count {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /*#ifdef MP*/
  // width: 180rpx;
  /*#endif*/
  padding-right: 12rpx;
  line-height: 28rpx;
}
/deep/.spike-bd .red {
  color: #e93323;
}
.dis-time {
  display: flex;
  align-items: center;
  margin-left: 24rpx;
  border-radius: 16rpx;
  height: 32rpx;
  overflow: hidden;
  text {
    font-size: 20rpx;
    text-align: center;
    line-height: 28rpx;
  }
  .text {
    color: #fff;
    padding-left: 16rpx;
    padding-right: 8rpx;
    line-height: 28rpx;
  }
  .num {
    color: #e93323;
    padding-right: 16rpx;
  }
  .triangle {
    height: 0;
    width: 0;
    border-width: 16rpx 8rpx;
    border-style: solid;
  }
}
</style>
