module.exports = {
  pages: require("./business/router/pages.ts"),
  subPackages: [],
  tabBar: {
    color: "#B9BECB",
    selectedColor: "#1CDAFE",
    borderStyle: "black",
    backgroundColor: "#000000",
    fontSize: "12px",
    iconWidth: "28px",
    midButton: {
      iconWidth: "40px",
      height: "45px",
      iconPath: "/static/images/tabbar/publish.png",
    },

    list: [
      {
        pagePath: "views/pages/home/index",
        iconPath: "/static/images/tabbar/home.png",
        selectedIconPath: "/static/images/tabbar/home-full.gif",
        text: "首页",
      },
      {
        pagePath: "views/pages/explore/index",
        iconPath: "/static/images/tabbar/explore.png",
        selectedIconPath: "/static/images/tabbar/explore-full.gif",
        text: "探索",
      },
      {
        pagePath: "views/pages/message/index",
        iconPath: "/static/images/tabbar/message.png",
        selectedIconPath: "/static/images/tabbar/message-full.gif",
        text: "消息",
      },
      {
        pagePath: "views/pages/mine/index",
        iconPath: "/static/images/tabbar/mine.png",
        selectedIconPath: "/static/images/tabbar/mine-full.gif",
        text: "我的",
      },
    ],
  },
  globalStyle: {
    "app-plus": {
      titleNView: false, //禁用原生导航栏
    },
    navigationBarTextStyle: "white",
    navigationBarTitleText: "uni-app",
    navigationBarBackgroundColor: "#000000",
    backgroundColor: "#FBFBFB",
    rpxCalcMaxDeviceWidth: 960, // rpx 计算所支持的最大设备宽度，单位 px，默认值为 960
    rpxCalcBaseDeviceWidth: 375, // rpx 计算使用的基准设备宽度，设备实际宽度超出 rpx 计算所支持的最大设备宽度时将按基准宽度计算，单位 px，默认值为 375
    rpxCalcIncludeWidth: 750, // rpx 计算特殊处理的值，始终按实际的设备宽度计算，单位 rpx，默认值为 750
  },
  easycom: {
    autoscan: true,
    custom: {
      "g-(.*)": "@/views/components/global/$1.vue",
      "^u-(.*)": "uview-plus/components/u-$1/u-$1.vue",
    },
  },
};
