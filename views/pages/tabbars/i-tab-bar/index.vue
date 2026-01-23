<template>
  <view
    class="flex tab-bar"
    :class="{
      'tab-bar_black':
        (current === 'home' && tbasIndex == 2) || current === 'explore',
    }"
    :style="{ 'padding-bottom': $safeAreaInsetsBottom + 'px' }"
  >
    <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('home')">
      <view class="tab-bar_item_warp flex flex-column jc-ct flex-ac">
        <view class="tab-bar_item--box flex">
          <!-- <w-svga
            ref="home"
            class="tab-bar_item--svga flex-1"
            url="/static/images/tabbar/home.svga"
            :autoPlay="false"
            :loops="1"
            :begin="current === 'home' ? 'end' : 'start'"
          ></w-svga> -->
        </view>
        <text
          class="tab_txt"
          :class="current === 'home' ? 'tab_txt_active' : ''"
          >首页</text
        >
      </view>
    </view>
    <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('explore')">
      <view class="tab-bar_item_warp flex flex-column jc-ct flex-ac">
        <view class="tab-bar_item--box flex">
          <!-- <w-svga
            ref="explore"
            class="tab-bar_item--svga flex-1"
            url="/static/images/tabbar/explore.svga"
            :autoPlay="false"
            :loops="1"
            :begin="current === 'explore' ? 'end' : 'start'"
          ></w-svga> -->
        </view>
        <text
          class="tab_txt"
          :class="current === 'explore' ? 'tab_txt_active' : ''"
          >探索</text
        >
      </view>
    </view>
    <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('publish')">
      <image
        class="tab_icon_center"
        src="/static/images/tabbar/publish.png"
      ></image>
    </view>
    <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('message')">
      <view class="tab-bar_item_warp flex flex-column jc-ct flex-ac">
        <view class="tab-bar_item--box flex">
          <!-- <w-svga
            ref="message"
            class="tab-bar_item--svga flex-1"
            url="/static/images/tabbar/message.svga"
            :autoPlay="false"
            :loops="1"
            :begin="current === 'message' ? 'end' : 'start'"
          ></w-svga> -->
        </view>
        <text
          class="tab_txt"
          :class="current === 'message' ? 'tab_txt_active' : ''"
          >消息</text
        >
      </view>
    </view>
    <view class="tab-bar_item flex flex-ac jc-ct" @click="tapTabbar('mine')">
      <view class="tab-bar_item_warp flex flex-column jc-ct flex-ac">
        <view class="tab-bar_item--box flex">
          <!-- <w-svga
            ref="mine"
            class="tab-bar_item--svga flex-1"
            url="/static/images/tabbar/mine.svga"
            :autoPlay="false"
            :loops="1"
            :begin="current === 'mine' ? 'end' : 'start'"
          ></w-svga> -->
        </view>
        <text
          class="tab_txt"
          :class="current === 'mine' ? 'tab_txt_active' : ''"
          >个人</text
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // current:'home',
      previous: "home",
      tbasIndex: 2,
      $safeAreaInsetsBottom: uni.getSystemInfoSync().safeAreaInsets.bottom,
    };
  },
  props: {
    current: {
      type: String,
      default: "home",
    },
  },
  computed: {},
  watch: {
    current(n, o) {
      console.log(n, o);
      if (n !== "add") {
        // #ifdef APP-PLUS
        // console.log(this.$refs[n]);
        // this.$refs[n].play();
        // #endif
      }
      if (o !== "ai" && o !== "add") {
        // #ifdef APP-PLUS
        // this.$refs[o].playReverse({
        //   location: 0,
        //   length: 6,
        // });
        // #endif
      }
    },
  },
  created() {
    uni.$on("tabbar-toggle-previous", this.tapTabbar);
    uni.$on("changeTabs", this.changeTabs);
  },
  destroy() {
    uni.$off("tabbar-toggle-previous", this.tapTabbar);
    uni.$off("changeTabs", this.changeTabs);
  },
  methods: {
    tapTabbar(newCurrent) {
      let cur = newCurrent;
      // 消息暂未开发
      if (cur === "message") {
        uni.showToast({
          icon: "none",
          title: "暂未开放，敬请期待",
          duration: 2000,
        });
        return;
      }

      console.log("点到了", cur, this.previous);
      if (!cur) {
        console.log("执行--------1");
        cur = this.previous;
        this.previous = "home";
      } else {
        console.log("执行--------2");
        this.previous = this.current;
      }

      // cur == "home" ? uni.$emit("enterHome") : uni.$emit("outHome", "");
      // this.current = cur
      // if (this.current == current && current !== 'square') return;
      // if (current == 'square' && this.current == current) {
      // 	this.$refs.square.play();
      // }
      this.$emit("change", cur);
    },
    changeTabs(data) {
      console.log(data,123232)
      this.tbasIndex = data;
      this.$emit("changeTabFn", data);
    },
  },
};
</script>

<style scoped>
.tab-bar {
  /* position: fixed;
		left: 0;
		bottom: 0; */
  /* border-radius: 32rpx 32rpx 0 0; */
  background-color: #ffffff;
}
.tab-bar_black {
  background-color: #1e1f20;
}
.tab-bar_item {
  width: 150rpx;
  height: 50px;
}
.tab-bar_item--box {
  width: 56rpx;
  height: 56rpx;
  /* height: 100rpx; */
  /* height: 64rpx; */
  position: relative;
  /* background-color: #FF6770 !important;
		z-index: 9999; */
}
.tab-bar_item--svga {
  /* width: 134rpx;
		height: 64rpx;
		position: absolute;
		top: 0;
		left: 0; */
  /* opacity: 0; */
  width: 56rpx;
  height: 56rpx;
}
.tab_txt {
  color: #777777;
  text-align: center;
  font-size: 20rpx;
  font-weight: 500;
}
.tab_txt_active {
  color: #1cdafe;
}
.tab_icon_center {
  width: 80rpx;
  height: 80rpx;
}
.tab-bar_item--dot {
  padding: 0 8rpx;
  height: 30rpx;
  background-color: #ff6770;
  border-radius: 26rpx;
  position: absolute;
  top: 0rpx;
  right: 6rpx;
}
.tab-bar_item--text {
  color: #fff;
  font-size: 24rpx;
  line-height: 30rpx;
}
.tab-bar_item--add {
  width: 96rpx;
  height: 96rpx;
  position: relative;
}
.tab-bar_item--ai {
  height: 80rpx;
}
.tab-bar_item--icon {
  width: 96rpx;
  height: 96rpx;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}
.show {
  opacity: 1;
}
</style>
