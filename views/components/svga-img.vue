<template>
  <view
    class="tab-bar_item--box flex"
    :style="{ width: img_width + 'rpx', height: img_height + 'rpx' }"
  >
    <w-svga
      ref="home"
      class="tab-bar_item--svga flex-1"
      :url="url"
      :autoPlay="false"
      :loops="1"
      :begin="isShow ? 'end' : 'start'"
    ></w-svga>
  </view>
</template>

<script>
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
export default {
  data() {
    return {
      current: "home",
      previous: "",
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: "",
    },
    img_width: {
      type: Number,
      default: 80,
    },
    img_height: {
      type: Number,
      default: 80,
    },
  },

  computed: {},
  watch: {
    isShow: {
      immediate: true,
      handler(n, o) {
        console.log(n, o);
        if (n) {
          // #ifdef APP-PLUS
          // console.log(this.$refs[n]);
          this.$refs.home.play();
          // #endif
        } else {
          this.$refs.home.playReverse({
            location: 0,
            length: 6,
          });
        }
      },
    },
    // isShow(n, o) {

    //   // if (o !== "ai" && o !== "add") {
    //   //   // #ifdef APP-PLUS
    //   //   this.$refs[o].playReverse({
    //   //     location: 0,
    //   //     length: 6,
    //   //   });
    //   // #endif
    // },
  },

  created() {
    // this.$refs.home.play();
  },
  destroy() {},
  methods: {},
};
</script>

<style scoped>
.tab-bar_item--box {
  width: 80rpx;
  height: 80rpx;
  position: relative;
  background: rgba(0, 0, 0, 0);
}
</style>
