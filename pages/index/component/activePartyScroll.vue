<template>
  <view
    :style="'padding-top:' + mbConfig + 'rpx;'"
    v-if="explosiveMoney.length"
  >
    <view :style="'background-color:' + boxColor + ';'">
      <view class="hot-img single-box">
        <!--单行展示-->
        <block v-if="tabConfig == 0">
          <u-scroll-list
            class="scroll-list-wrap"
            indicatorWidth="50"
            :indicatorBarWidth="indicatorBarWidth"
            style="overflow: hidden; width: 100%"
            :indicator="indicatorBarWidth < 50"
          >
            <view
              class="item skeleton-rect"
              v-for="(item, index) in explosiveMoney"
              :key="index"
              @click="goDetail(item)"
            >
              <view class="img">
                <!-- <template>

                </template> -->
                <!-- <image class="scroll_img" mode="widthFix"
                  :src="item.img"></image> -->
                <easy-loadimage
                  mode="widthFix"
                  :image-src="item.img"
                ></easy-loadimage>
              </view>
              <view class="msg area-row line1" v-if="item.info[1].value">{{ item.info[1].value }}</view>
              <view class="title area-row">{{ item.info[0].value }}</view>
            </view>
          </u-scroll-list>
        </block>
        <!--多行展示-->
        <block v-if="tabConfig == 1">
          <u-scroll-list
            class="scroll-list-wrap"
            indicatorWidth="50"
            :indicatorBarWidth="indicatorBarWidth"
            style="overflow: hidden; width: 100%"
            :indicator="indicatorBarWidth < 50"
          >
            <view style="display: flex; flex-direction: column;">
              <view style="display: flex; flex-wrap: nowrap" v-for="(row, i) in levelExplosiveMoney" :key="i">
                <view
                  class="item skeleton-rect"
                  v-for="(item, index) in row"
                  :key="index"
                  @click="goDetail(item)"
                >
                  <view class="img">
                    <easy-loadimage
                      mode="widthFix"
                      :image-src="item.img"
                    ></easy-loadimage>
                  </view>
                  <view class="msg area-row line1" v-if="item.info[1].value">{{ item.info[1].value }}</view>
                  <view class="title area-row">{{ item.info[0].value }}</view>
                </view>
              </view>
            </view>
          </u-scroll-list>
        </block>
      </view>
    </view>
  </view>
</template>
<script>
import { merPath } from "@/utils/index";
import {
		IAMGES_URL
	} from '@/config/app';
export default {
  name: "activePartyScroll",
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
      explosiveMoney: this.dataConfig.menuConfig.list.map((item, i) => {
        if (i >= 0 && i <= 5) {
          return {
           ...item,
            img: `${IAMGES_URL}/home/tj_${i + 1}.gif`,
          };
        }
        return item;
      }),
      // 多行时，上下层数据
      levelExplosiveMoney: this.levelFilter(this.dataConfig.tabConfig.tabVal, this.dataConfig.menuConfig.list),
      themeColor: this.dataConfig.themeColor.color[0].item,
      bgColor: this.dataConfig.bgColor.color,
      mbConfig: this.dataConfig.mbConfig.val * 2,
      boxColor: this.dataConfig.boxColor.color[0].item,
      tabConfig: this.dataConfig.tabConfig.tabVal, //展示样式
    };
  },
  created(){
	
  },
  computed: {
	indicatorBarWidth() {
    if (this.tabConfig == 0) {
      return (this.explosiveMoney && this.explosiveMoney.length > 5 ? 5 / this.explosiveMoney.length * 50 : 50);
    }
    return (this.explosiveMoney && this.explosiveMoney.length > 10 ? 10 / this.explosiveMoney.length * 50 : 50);
	}
  },
  mounted() {
    // this.loopGif();
  },
  methods: {
    loopGif() {
      var gif = document.getElementsByClassName("scroll_img")[0];
      var interval = 5 * 1000; // 将x秒转换为毫秒
      setInterval(function() {
        gif.src = gif.src; // 通过更改src属性来重新加载gif图像
      }, interval);
    },
    goDetail(url) {
      console.log(url,'url')
      let urls = url.info[2].value;
      urls = merPath(urls, this.merId);
      this.$util.JumpPath(urls);
    },
    // 数据分层过滤方法
    levelFilter(type, list) {
      if(type == 0) return [];
      if(!(list && list.length)) return [];
      let topList = [];
      let bottomList = [];
      list.forEach((item, index) => {
        if (index % 2 === 0) {
          topList.push(item);
        } else {
          bottomList.push(item);
        }
      });
      return [topList, bottomList];
    }
  },
};
</script>

<style scoped lang="scss">
.hot-img {
  margin: 0 20rpx 0;
  padding: 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  .item {
    display: block;
    width: 23.5%;
    // background-color: #fefeff;
    padding: 20rpx 0 10rpx;
    // border-radius: 8rpx;
    text-align: center;
    // box-shadow: 2px 1px 6px 1px rgba(0, 0, 0, 0.03);
    box-sizing: border-box;
    .title {
      // font-weight: bold;
      color: #32312D;
      height: 40rpx;
    }
    .msg {
      margin: 5rpx auto 0;
      font-size: 20rpx;
      max-width: 150rpx;
      height: 40rpx;
    }
    .img {
      margin: 10rpx auto 16rpx;
      width: 112rpx;
      height: 112rpx;
      /deep/image,
      /deep/.easy-loadimage,
      /deep/uni-image,
      /deep/.loadfail-img {
        // width: 96rpx !important;
        // height: 96rpx !important;
        width: 112rpx !important;
        height: 112rpx !important;
      }
    }
    // &:first-child .msg {
    //   color: #8fbbe8;
    // }
    // &:nth-child(2) .msg {
    //   color: #d797b7;
    // }
    // &:nth-child(3) .msg {
    //   color: #c49bd1;
    // }
    // &:nth-child(4) .msg {
    //   color: #a3bf95;
    // }
  }
  &.single-box {
	padding: 0 0 20rpx;
	border-radius: 12rpx;
	// background: linear-gradient(0deg, #FFF 0%, #f0f0f0 100%);
	// box-shadow: 0 4px 4px 0 #0000001a;
	.scroll-list-wrap {
		padding-bottom: 0;
		/deep/.uni-scroll-view::-webkit-scrollbar,
    /deep/.uni-scroll-view-content::-webkit-scrollbar {
			display: none; /* Chrome Safari */
		}
		/deep/.uni-scroll-view,
    /deep/.uni-scroll-view-content{
			scrollbar-width: none;
		}
		/deep/.u-scroll-list__indicator {
			margin-top: 0;
		}
		/deep/.u-scroll-list__indicator__line {
			background-color: #e2e2e2;
      height: 12rpx;
		}
    /deep/.u-scroll-list__indicator__line__bar {
      height: 12rpx;
      background-color: #1CC8FE;
    }
    
    .item {
      padding: 0 0 10rpx;
    }
	}
	.item {
		width: 25%;
		&.skeleton-rect {
			min-width: 142rpx;
		}
	}
  }
}
.bd {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    display: flex;
    align-items: center;
    width: 49%;
    margin-right: 2%;
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    justify-content: space-between;
    &:nth-child(3),
    &:nth-child(4) {
      margin-top: 20rpx;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
    .left {
      width: 150rpx;
      align-items: center;
    }
    .img {
      margin: 0;
    }
    /deep/image,
    /deep/.easy-loadimage,
    /deep/uni-image,
    /deep/.loadfail-img {
      width: 120rpx !important;
      height: 120rpx !important;
    }
  }
}
</style>
