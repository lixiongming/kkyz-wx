<template>

	<view :class="
      bgTabVal == 2
        ? 'fullsize noRepeat'
        : bgTabVal == 1
        ? 'repeat ysize'
        : 'noRepeat ysize'
    " :style="
      'background-color:' +
      bgColor +
      ';background-image: url(' +
      bgPic +
      ');min-height:' +
      windowHeight +
      'px;'
    " id="home">
		<!-- <skeleton
      :show="showSkeleton"
      :isNodes="isNodes"
      ref="skeleton"
      loading="chiaroscuro"
      selector="skeleton"
      bgcolor="transparent"
    ></skeleton> -->
		<view v-if="!errorNetwork" :style="{
        visibility: showSkeleton ? 'hidden' : 'visible',
        pointerEvents: preview ? 'none' : 'auto',
      }">
			<!-- 头部背景 -->
			<view class="hd_box" v-if="hdBgPic || (hdBgColor1 && hdBgColor2)"
				:style="{ background: hdBgColor1 && hdBgColor2 ? `linear-gradient(to bottom, ${hdBgColor1}, ${hdBgColor2})` : 'unset'}">
				<!-- <image v-if="hdBgPic" :src="hdBgPic" alt="" /> -->
				<image mode="aspectFill" :src="`${imgUrl}/images/save-money/video-matrix-bg3.png`"></image>
			</view>
			<view class="page-index skeleton" :class="{ bgf: navIndex > 0 }">
				<block>
					<block v-for="(item, index) in styleConfig" :key="index">
						<view v-show="navIndex == 0">
							<liveBroadcast v-if="item.name == 'liveBroadcast'" :dataConfig="item"></liveBroadcast>
						</view>
					</block>
				</block>
				<view v-if="beian_sn" class="copyRight">{{ beian_sn }}</view>
			</view>
		</view>
		<view v-else>
			<view class="error-network">
				<image :src="`${domain}/static/images/error-network.png`"></image>
				<view class="title">网络连接断开</view>
				<view class="con">
					<view class="label">请检查情况：</view>
					<view class="item">· 在设置中是否已开启网络权限</view>
					<view class="item">· 当前是否处于弱网环境</view>
					<view class="item">· 版本是否过低，升级试试吧</view>
				</view>
				<view class="btn" @click="reconnect">重新连接</view>
			</view>
		</view>
		<!--自定义底部tab栏-->
		<!-- <customTab :newData="newData" :activeRouter="activeRouter"></customTab> -->
	</view>
</template>
<script>
	import liveBroadcast from "./component/liveBroadcast";
	import {
		getDiy
	} from "@/business/api/modules/mall.ts";
	import mallStore from "@/business/store/modules/mall";
	
	// let mall_store = {}
	// let app = getApp();
	// import { getUserInfo } from "@/api/user.js";
	// import {
	//   getDiy,
	//   getPageDiy,
	//   getIndexData,
	//   getAppVersion,
	//   getCateData,
	// } from "@/api/api.js";
	// import { getNavigation } from "@/api/public.js";
	// import { getStorage } from "@/libs/uniApi.js";
	// import { goShopDetail } from "@/libs/order.js";
	// // import { mapGetters } from "vuex";
	// import { getProductslist, getProductHot } from "@/api/store.js";
	// import { initiateAssistApi } from "@/api/activity.js";
	// import { setVisit, spread } from "@/api/user.js";
	// 	import {get_ticket_warn} from '@/api/supply'




	// import { silenceBindingSpread, configMap, isWeixin } from "@/utils/index";
	// import shareScence from "@/libs/spread";
	// import { getNewPeopleCouponLst } from "@/api/activity.js";
	// import { HTTP_REQUEST_URL } from "@/config/app";
	let HTTP_REQUEST_URL = 'https://mall.mdd3.cn'
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + "px";

	export default {
    setup() {
      const mall_store = mallStore();
      return {
        isLogin: mall_store.isLogin,
        uid: mall_store.uid,
        keyColor: mall_store.keyColor,
        hide_mer_status: mall_store.globalData?.hide_mer_status || 0,
		    recommend_switch: mall_store.globalData?.recommend_switch || 0,
		    beian_sn: mall_store.globalData?.beian_sn || "",
		    share_title: mall_store.globalData?.share_title || "",
		    share_pic: mall_store.globalData?.share_pic || "",
		    site_name: mall_store.globalData?.site_name || "",
		    hot_ranking_switch: mall_store.globalData?.hot_ranking_switch || 0,
		    navigation: mall_store.globalData?.navigation || {},
      }
    },
		components: {
			// #ifdef MP || APP-PLUS
			liveBroadcast,
			// #endif
		},
		data() {
			return {
				imgUrl: 'https://kankan-cdn.mdd3.cn',
				domain: HTTP_REQUEST_URL,
				couponTypeMsg: {
					10: "通用券",
					11: "品类券",
					12: "跨店券",
				},
				styleConfig: [],
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				privacyStatus: false,
				errorNetwork: false,
				userInfo: {},
				loading: false,
				statusBarHeight: statusBarHeight,
				navIndex: 0,
				navTop: [],
				subscribe: false,
				followUrl: "",
				followHid: true,
				followCode: false,
				sortList: [],
				window: false,
				navH: "",
				couponList: [],
				marTop: 0,
				loadend: false,
				loading: false,
				loadTitle: "加载更多",
				sortProduct: [],
				where: {
					pid: 0,
					page: 1,
					limit: 6,
				},
				is_switch: true,
				hostProduct: [],
				hotPage: 1,
				hotLimit: 30,
				hotScroll: true,
				hotLoading: false,
				hotTitle: "加载更多",
				// #ifdef MP || APP-PLUS
				isFixed: true,
				// #endif
				// #ifdef H5
				isFixed: false,
				// #endif
				isScrolled: false,
				scrolled: false,
				tempArr: [], //精品推荐临时数组
				d: "",
				h: "",
				m: "",
				s: "",
				sum_h: "",
				sortMarTop: 0,
				globalDatas: {},
				// #ifdef MP || APP-PLUS
				mpHeight: 108,
				// #endif
				// #ifndef MP || APP-PLUS
				mpHeight: 0,
				// #endif
				currSpid: "",
				_options: {},
				isIntegral: false,
				appUpdate: {},
				sortMpTop: 0,
				bgColor: "",
				bgPic: "",
				hdBgPic: "",
				hdBgColor1: "",
				hdBgColor2: "",
				bgTabVal: "",
				windowHeight: 0,
				domHeight: 0,
				isHeaderSerch: false,
				showCoupon: false,
				couponArray: [],
				smallPage: false,
				isMenu: false,
				isScale: false,
				homeCombData: {},
				footerStatus: false,
				newData: {},
				activeRouter: "",
				overflow: false,
				diyId: 0,
				preview: false,
				isSupport: true,
				copyVal: "123",
			};
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			let that = this;
			wx.showShareMenu({
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"],
			});
			return {
				title: that.share_title,
				imageUrl: "",
				path: "/pages/index/index?spid=" + that.uid,
			};
		},
		onShareTimeline: function() {
			let that = this;

			return {
				title: that.share_title,
				query: {
					spid: that.uid,
				},
				imageUrl: "",
			};
		},
		// #endif
		onLoad(options) {
			let that = this;

			this._options = options;
			this.diyId = options.diyId || 0;
			this.preview = options.time ? true : false;
			that.$nextTick(function() {
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight;
					},
				});
			});
			console.log("1111")
			that._pageLoad(options);

		},
		created(options) {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route; //获取当前页面路由
			this.activeRouter = "/" + curRoute;

		},
		onShow() {
			let that = this;
			that.isIntegral = uni.getStorageSync("isIntegral");
			// #ifdef APP-PLUS
			if (that.appUpdate.openUpgrade == "1") {
				that.alertAppUpdate();
			}
			// #endif
			// that.getNav();
			// that.loadCoupon();
			that.$nextTick(function() {
				const query = uni.createSelectorQuery();
				query.select("#home").boundingClientRect(); //获取当前元素距离顶部的距离
				query.exec((res) => {
					that.isScrolled = res[0].top <= -60;
				});
			});
		},
		onHide() {
			uni.setStorageSync("isIntegral", false);
		},
		onReady() {},
		onPullDownRefresh() {
			this.overflow = true;
			this.reconnect();
		},
		methods: {
			loadCoupon() {
				if (
					!this.showCoupon &&
					!uni.getStorageSync("show_coupon") &&
					uni.getStorageSync("is_new_user")
				) {
					getNewPeopleCouponLst().then((res) => {
						this.couponArray = res.data;
						setTimeout(() => {
							this.showCoupon = this.couponArray.length > 0;
							uni.setStorageSync("show_coupon", "1");
						}, 1500);
					});
				}
			},
			_pageLoad(options) {
				this.reloadData();
				Promise.all([this.diyData(0)]);
			},
			pageLoad(options) {
				let that = this;
        const mall_store = mallStore();
				if (options.spid) {
					console.log(options.spid);
					that.currSpid = Number(options.spid);
          mall_store.globalData.spid = Number(options.spid);
					// app.globalData.spid = Number(options.spid);
				} else if (getStorage("spid")) {
					that.currSpid = getStorage("spid");
					// app.globalData.spid = getStorage("spid");
          mall_store.globalData.spid = getStorage("spid");
				}
				// #ifdef MP
				if (options.scene) {
					let value = that.$util.getUrlParams(decodeURIComponent(options.scene));
					if (value.id) options.id = value.id;
					//记录推广人uid
					if (value.spid) {
						that.currSpid = value.spid;
						// app.globalData.spid = value.spid;
            mall_store.globalData.spid = value.spid;
					} else if (getStorage("spid")) {
						that.currSpid = getStorage("spid");
						// app.globalData.spid = getStorage("spid");
            mall_store.globalData.spid = getStorage("spid");
					}
				}
				// #endif
				shareScence(that.currSpid, that.isLogin);
				that.isLogin && silenceBindingSpread();
				this.reloadData();
				Promise.all([this.diyData(0)]);
				if (that.isLogin) {
					this.getUserInfo();
				}
			},
			// 重新链接
			reconnect() {
				uni.getNetworkType({
					success: (res) => {
						this.errorNetwork = res.networkType === "none";
						if (!this.errorNetwork) {
							this.pageLoad(this._options);
						} else {
							// uni.stopPullDownRefresh();
							that.overflow = false;
						}
					},
				});
			},
			getNav() {
				getNavigation().then((res) => {
					this.newData = res.data;
					let menuListFilter = res.data.menuList.filter(item => item.name == '首页' || item.name == '我的');
					this.$set(this.newData, 'menuList', menuListFilter)
					if (res.data.status && res.data.status.status) {
						uni.hideTabBar();
					} else {
						uni.showTabBar();
					}
				});
			},
			// 对象转数组
			objToArr(data) {
				let obj = Object.keys(data).sort();
				let m = obj.map((key) => data[key]);
				return m;
			},
			diyData(id) {
				let that = this;
				let parmas = {
					id: id,
					did: that.diyId,
					version: "221",
				};
				that.styleConfig = [];
				that.smallPage = false;
				console.log("22222--->")
				getDiy(parmas)
					.then((res) => {
						console.log("res--->", res)
						setTimeout(() => {
							that.isNodes++;
						}, 0);
						that.errorNetwork = false;
						let data = res.data.data;
						// uni.setNavigationBarTitle({
						//   title: data.title,
						// });
						console.log("index-data--->", data);
						if (data.is_bg_color) {
							that.bgColor = data.color_picker;
						}
						if (data.is_bg_pic) {
							that.bgPic = data.bg_pic;
							that.bgTabVal = data.bg_tab_val;
						} else {
							that.bgPic = "";
						}
						if (data.head_background_image) {
							let hd_data = data.head_background_image;
							if (hd_data.is_hd_bg_color) {
								that.hdBgColor1 = hd_data.hd_color_picker1;
								that.hdBgColor2 = hd_data.hd_color_picker2;
							}
							if (hd_data.is_hd_bg_pic) {
								that.hdBgPic = hd_data.hd_bg_pic;
							}
						}
						that.styleConfig = that.objToArr(data.value);
						console.log("diy----->", that.styleConfig, res)
						that.styleConfig.forEach((item, index, arr) => {
							item.did = data.id;
							if (item.name == "pageFoot") {
								if (item.status && item.status.status) {
									this.newData = item;

									try {
										let menuListFilter = item.menuList.filter(item_ => item_.name ==
											'首页' || item_.name == '我的');
										this.$set(this.newData, 'menuList', menuListFilter)
									} catch (e) {}

									setTimeout((e) => {
										that.$set(that, "footerStatus", true);
									}, 50);
								}
								uni.setStorageSync(
									"FOOTER_BAR",
									item.status && item.status.status ? true : false
								);
								item.menuList.map((path, index) => {
									// if (path.link === "/pages/order_addcart/order_addcart") {
									//   uni.setStorageSync("FOOTER_ADDCART", index);
									// }
									if (path.link === "/pagesProduct/order_addcart/order_addcart") {
										uni.setStorageSync("FOOTER_ADDCART", index);
									}
								});
								arr.splice(index, 1);
							}
							if (item.name == "menus") {
								that.isMenu = true;
							}
							if (that.recommend_switch == 1) that.get_host_product();
							uni.pageScrollTo({
								scrollTop: 0,
							});
							that.overflow = false;
							uni.stopPullDownRefresh();
						});
						console.log(that.styleConfig, "that.styleConfig");
					})
					.catch((err) => {
						uni.showToast({
							title: err,
							icon: "none",
						});
						uni.stopPullDownRefresh();
					});
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then((res) => {
					that.userInfo = res.data;
				});
			},
			reloadData() {
				setTimeout(() => {
					this.showSkeleton = false;
				}, 500);
			},
			close_mode() {
				this.$refs.popup_model.close()
			},
			async get_credit() {

				const {
					data
				} = await get_ticket_warn()
				console.log('get_ticket_warn', data)
				if (data.ident) {
					setTimeout(() => {
						this.$refs.popup_model.open()
					}, 1000);
				}
			}
		},
		mounted() {
			let query = uni.createSelectorQuery().in(this);
			query.select("#home").boundingClientRect();
			query.exec((res) => {
				this.domHeight = res[0].height;
			});
			if (uni.getStorageSync('LOGIN_STATUS_TOKEN')) {
				this.get_credit()
			}

		},
		// 滚动到底部
		onReachBottom() {
			if (this.recommend_switch == 1 && this.navIndex == 0) {
				// 首页加载更多
				this.get_host_product();
			} else if (this.navIndex != 0) {
				// 分类栏目加载更多
				if (this.sortProduct.length > 0 && !this.loadend) {
					this.get_product_list();
				}
			} else if (this.navIndex == 0) {
				// 商品列表触发底部更新
				uni.$emit("product_load_more", true);
			}
		},
		// 滚动监听
		onPageScroll(e) {
			if (this.isHeaderSerch) {
				let isScroll = false;
				isScroll = e.scrollTop > 50;
				this.isScrolled = isScroll;
			} else {
				this.isScrolled = false;
			}
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit("scroll");
		},
	};
</script>
<style></style>
<style lang="scss" scoped>
	.popup_model_box {
		width: 500rpx;
		background: #fff;
		padding: 32rpx;
		border-radius: 24rpx;

		.popup_model_box_title {
			text-align: center;
			font-size: 32rpx;
			font-weight: 600;
		}

		.popup_model_box_content {
			font-size: 28rpx;
			margin-top: 32rpx;
		}

		.popup_model_box_btn {
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(38, 146, 255, 1);
			color: #fff;
			border-radius: 24rpx;
			margin-top: 64rpx;
		}
	}

	.bnt1 {
		color: red;
	}

	.overflow-mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1001;
		width: 100%;
		height: 100vh;
		background: transparent;
		transition: all 0.5s;
	}

	page {
		display: flex;
		flex-direction: column;
	}

	::v-deep .home-comb .my-main {
		left: 0;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 30;
	}

	.main {
		padding: 0 20rpx;
	}

	.colum0 {
		white-space: nowrap;
		display: flex;
	}

	.ysize {
		background-size: 100%;
	}

	.fullsize {
		background-size: 100% 100%;
	}

	.repeat {
		background-repeat: repeat;
	}

	.noRepeat {
		background-repeat: no-repeat;
	}

	.privacy-wrapper {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: #7f7f7f;

		.privacy-box {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 560rpx;
			padding: 50rpx 45rpx 0;
			background: #fff;
			border-radius: 20rpx;

			.title {
				text-align: center;
				font-size: 32rpx;
				text-align: center;
				color: #333;
				font-weight: 700;
			}

			.content {
				margin-top: 20rpx;
				line-height: 1.5;
				font-size: 26rpx;
				color: #666;

				navigator {
					display: inline-block;
					color: #e93323;
				}
			}

			.btn-box {
				margin-top: 40rpx;
				text-align: center;
				font-size: 30rpx;

				.btn-item {
					height: 82rpx;
					line-height: 82rpx;
					background: linear-gradient(90deg, #f67a38 0%, #f11b09 100%);
					color: #fff;
					border-radius: 41rpx;
				}

				.btn {
					padding: 30rpx 0;
				}
			}
		}
	}

	.coupon_popups {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.con {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 680rpx;
			height: 900rpx;
			background-size: 100% 700rpx;
			background-repeat: no-repeat;

			scroll-view {
				width: 610rpx;
				height: 306rpx;
				padding: 20rpx 10rpx 0;
				margin: 300rpx auto 0;
				box-sizing: border-box;
			}

			.item {
				display: flex;
				align-items: center;
				width: 100%;
				height: 164rpx;
				background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABDgAAAFICAMAAACC1L7bAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA9xnrZyf0790ev4d1Egr7cl9TI+XNbVpAtKSUjX0NB6ucgnpDMdjRxUw7LdTK5bIiAAAF40lEQVR42uzcWW7CMBSF4UNImAIBEcpUKJQixt79b68qD1VLgNi8VHL+bxHH9tH1VUE+SeedVs1QkMmNAYGotTrzdNJWiSRtGe7J5aRnQFh2m1z3ndeGB05ycjYgOPNct2WLvuGRoZxMDAhPbbnSDQmPlDKpnCwMCNE+UsGxYSixl5MXA4JUP+lKbCgXyUHbgED1J/pjbHAwloONAcGKqfP8jVYqlTUNCNdQPxKDmw+V6hoQsEZOm+et0VOJHiUzwnbgjPQ3Uwlm6BC6WBcRZ6SHpa7QMqNimj19ezd42OqBLcO3CF/K2IG/5lR3Tbm8oQIuVd/S4CfmnYJqiyXtDJ5eM92QdAyohI6UG7zVB7qWpQZUxRufVJ4z6kb65dytG1AZR80NzzkMTkkkKY/XpAaqJWVqFICvmfiSBcDTp1hnDsDTiFX+AHzVCA4A3ggOAAQHgAKCA8D/Izi+2KmDAQAAAAZC/tYDGMB9CiJAHMARB9ATByAO4IgD6IkDEAdwxAH0xAGIAzjiAHriAMQBHHEAPXEA4gCOOICeOABxAEccQE8cgDiAIw6gJw5AHMARB9ATByAOxk4dDAAAADAQ8rcewADuUxDBEQfQEwcgDuCIA+iJAxAHcMQB9MQBiAM44gB64gDEARxxAD1xAOIAjjiAnjgAcQBHHEBPHIA4gCMOoCcOQBzAEQfQEwcgDuCIA+iJAxAHcMQB9MQBiAM44gB64gDEARxxAD1xAOIAjjiAnjgAcQBHHEBPHIA4gCMOoCcOQBzAEQfQEwcgDuCIA+iJAxAHcMQB9MQBjJ06GAAAAGAg5G89gAHcpyASB3DEAfTEAYgDOOIAeuIAxAEccQA9cQDiAI44gJ44AHEARxxATxyAOIAjDqAnDkAcwBEH0BMHIA7giAPoiQMQB3DEAfTEAYgDOOIAeuIAxAEccQA9cQDiAI44gJ44AHEARxxATxyAOIAjDqAnDkAcwBEH0BMHIA7giAPoiQMQB3DEAfTEAYgDOOIAeuIAxAEccQA9cTB26mAAAACAgZC/9QAOYJ+CCMQBhDiAP3EA4gBCHMCfOABxACEO4E8cgDiAEAfwJw5AHECIA/gTByAOIMQB/IkDEAcQ4gD+xAGIAwhxAH/iAMQBhDiAP3EA4gBCHMCfOABxACEO4E8cgDiAEAfwJw5AHECIA/gTByAOIMQB/IkDEAcQ4gD+xAGIAwhxAH/iAMQBhDiAP3EA4gBCHMCfOABxACEOYOzUwQAAAAADIX/rAQzgPgVRTxyAOIAjDqAnDkAcwBEH0BMHIA7giAPoiQMQB3DEAfTEAYgDOOIAeuIAxAEccQA9cQDiAI44gJ44AHEARxxATxyAOIAjDqAnDkAcwBEH0BMHIA7giAPoiQMQB3DEAfTEAYgDOOIAeuIAxAEccQA9cQDiAI44gJ44AHEARxxATxyAOIAjDqAnDkAcwBEH0BMHIA7giIOxU4cEAIBAEMBAIUny/esR4BTqzBZi0CcOQBxAEAfQJw5AHEAQB9AnDkAcQBAH0CcOQBxAEAfQJw5AHEAQB9AnDkAcQBAH0CcOQBxAEAfQt+4AfNnrDK+dO8tNGIaiMHwSoBAKlERAQ4FQhnSQeve/vaoPRVWayTza/7cI2/ecKwNwMtDEAMDJRFMDACdb7Qz3WZ3SRJqX2fJ1YEBI9no23GGyGemP8sLZgYBkig3uLqpaLDk6EIy5tDY42iaqsTgZEISppJnBSZSqwdKAEAwlZhVHg1KNcrZiEICHQhK9ipOoVIucRVz476wfcWToLVOroQGeG8wlkXI42akF7zeE4BbyvRv6WS3UoaCVhd+m+jUy9JPqhmoFQRrHukkNfUzU7bgywF+fXJPONmpFZATvDSttAD1it6hQMwY/+O8pVcWV3aVOW/XBFyfw1TjXP8mXod1MvewN8NE6Vo3jmU2wdrlaEDXDb9HhqHqjF0OLWL1cDfDOKVGz5PBmaCKJdBQhWl9idUiy/QczSy31UxjgjYfpYxar6hufchGebA48QgAAAABJRU5ErkJggg==");
				background-repeat: no-repeat;
				background-size: 100% 100%;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				position: relative;

				.left {
					width: 160rpx;
					text-align: center;

					&::after {
						content: "";
						display: block;
						height: 110rpx;
						border-right: 1px dashed #e6e6e6;
						position: absolute;
						left: 178rpx;
						top: 25rpx;
					}

					.price {
						color: #e93323;
						font-size: 26rpx;
						font-weight: bold;

						text {
							font-size: 46rpx;
						}
					}

					.max_price {
						color: #999999;
						font-size: 18rpx;
						margin-top: 8rpx;
					}
				}

				.right {
					width: 432rpx;
					padding: 0 20rpx;

					.title {
						color: #333333;
						font-size: 26rpx;
					}

					.time {
						color: #999999;
						font-size: 22rpx;
						margin-top: 20rpx;
					}

					.bnt1 {
						.titleSize {
							font-weight: 700;
							font-size: 33rpx;
						}

						.titleColor {
							margin-top: 20rpx;
							color: #999999;
						}
					}

					.coupon_type {
						position: absolute;
						color: #fff;
						font-size: 15rpx;
						width: 30rpx;
						text-align: center;
						height: auto;
						background: #e93323;
						top: 0;
						right: 20rpx;
						line-height: 26rpx;
						padding: 5rpx 0 15rpx;
						writing-mode: vertical-lr;
						word-wrap: break-word;
						display: flex;
						/*#ifdef MP*/
						align-items: center;
						/*#endif*/
						justify-content: center;

						&::after {
							content: "";
							width: 0;
							height: 0;
							border-left: 14rpx solid transparent;
							border-right: 14rpx solid transparent;
							border-bottom: 14rpx solid #fff;
							position: absolute;
							bottom: -4rpx;
							left: 2rpx;
						}
					}
				}
			}

			.text {
				width: 600rpx;
				margin: 30rpx auto 0;
				font-size: 20rpx;
				color: #ffffff;
			}

			.icon-guanbi3 {
				color: #ffffff;
				font-size: 70rpx;
				position: absolute;
				bottom: -80rpx;
				left: 320rpx;
			}
		}
	}

	.item_tags {
		margin-top: 8rpx;
		display: flex;
	}

	.item_tags .tags_item {
		display: inline-block;
		font-size: 20rpx;
		text-align: center;
		border-radius: 5rpx;
		padding: 0 4rpx;
		line-height: 28rpx;
		margin-right: 8rpx;
	}

	.item_tags .tags_item.ticket {
		color: var(--view-theme);
		border: 1px solid var(--view-theme);
	}

	.item_tags .tags_item.delivery {
		color: #ff9000;
		border: 1px solid #ff9000;
	}

	.copyRight {
		margin: 60rpx auto 20rpx;
		max-width: 690rpx;
		font-size: 20rpx;
		color: #707070;
		text-decoration: none;
	}

	.share-box {
		z-index: 1000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.error-network {
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-top: 40rpx;
		background: #fff;
		padding-top: 30%;

		image {
			width: 414rpx;
			height: 336rpx;
		}

		.title {
			position: relative;
			top: -40rpx;
			font-size: 32rpx;
			color: #666;
		}

		.con {
			font-size: 24rpx;
			color: #999;

			.label {
				margin-bottom: 20rpx;
			}

			.item {
				margin-bottom: 20rpx;
			}
		}

		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 508rpx;
			height: 86rpx;
			margin-top: 100rpx;
			border: 1px solid #d74432;
			color: #e93323;
			font-size: 30rpx;
			border-radius: 120rpx;
		}
	}

	.area-row {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		width: 100%;
		text-align: center;
	}

	.hd_box {
		position: absolute;
		width: 100%;
		height: 172px;
		// height: 216px;
		left: 0;
		top: 0;
		z-index: 1;

		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		position: relative;
		z-index: 2;

		.page_content {
			/* #ifdef MP || APP-PLUS */
			padding-top: 270rpx;

			/* #endif */
			.page_bg {
				background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);
			}

			.nav {
				padding: 0 0rpx 30rpx;
				flex-wrap: wrap;
				/* #ifdef MP */
				margin-top: 0;
				/* #endif */
				/* #ifdef H5 */
				margin-top: 0;

				/* #endif */
				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 20%;
					margin-top: 30rpx;

					image {
						width: 82rpx;
						height: 82rpx;
					}
				}
			}

			.index-product-wrapper {
				.nav-bd {
					display: flex;
					align-items: center;

					.item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						width: 25%;

						.txt {
							font-size: 32rpx;
							color: #282828;
						}

						.label {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 124rpx;
							height: 32rpx;
							margin-top: 5rpx;
							font-size: 24rpx;
							color: #999;
						}

						&.active {
							color: $theme-color;

							.label {
								background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
								border-radius: 16rpx;
								color: #fff;
							}
						}
					}
				}

				.list-box {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.item {
						width: 345rpx;
						margin-bottom: 20rpx;
						background-color: #fff;
						border-radius: 10px;
						overflow: hidden;

						image {
							width: 100%;
							height: 345rpx;
						}

						.text-info {
							padding: 10rpx 20rpx 15rpx;

							.title {
								color: #222222;
							}

							.old-price {
								margin-top: 8rpx;
								font-size: 26rpx;
								color: #aaaaaa;
								text-decoration: line-through;

								text {
									margin-right: 2px;
									font-size: 20rpx;
								}
							}

							.price {
								display: flex;
								align-items: flex-end;
								color: $theme-color;
								font-size: 34rpx;
								font-weight: 800;

								text {
									padding-bottom: 4rpx;
									font-size: 24rpx;
									font-weight: normal;
								}

								.txt {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 28rpx;
									height: 28rpx;
									margin-left: 15rpx;
									margin-bottom: 10rpx;
									border: 1px solid $theme-color;
									border-radius: 4rpx;
									font-size: 22rpx;
									font-weight: normal;
								}
							}
						}
					}

					&.on {
						display: flex;
					}
				}
			}
		}
	}

	.productList {
		background-color: #f1f1f1;
		min-height: 70vh;

		.sort {
			width: 710rpx;
			max-height: 380rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 16rpx;
			padding: 8rpx 0rpx 30rpx;
			flex-wrap: wrap;
			margin: 25rpx auto 0 auto;

			.item {
				width: 20%;
				margin-top: 30rpx;
				text-align: center;

				.pictrues {
					width: 90rpx;
					height: 90rpx;
					background: rgba(248, 248, 248, 1);
					border-radius: 50%;
					margin: 0 auto;
				}

				.easy-loadimage {
					width: 90rpx;
					height: 90rpx;
					display: inline-block;
				}

				.text {
					color: #272727;
					font-size: 24rpx;
					margin-top: 10rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.productList .list {
		padding: 0 20rpx;
	}

	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
	}

	.productList .list .item {
		width: 345rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.name {
			display: flex;
			align-items: center;
		}
	}

	.productList .list .item.on {
		width: 100%;
		display: flex;
		border-bottom: 1px solid #f6f6f6;
		padding: 30rpx 0;
		margin: 0;
	}

	.productList .list .item .pictrue {
		position: relative;
		width: 100%;
		height: 345rpx;
	}

	.productList .list .item .pictrue.on {
		width: 180rpx;
		height: 180rpx;
	}

	::v-deep.productList .list .item .pictrue image,
	::v-deep.productList .list .item .pictrue uni-image,
	::v-deep.productList .list .item .pictrue .easy-loadimage {
		width: 100%;
		height: 100%;
		border-radius: 10rpx 10rpx 0 0;
	}

	::v-deep.productList .list .item .pictrue uni-image.origin-img {
		border-radius: 10rpx 10rpx 0 0;
	}

	.productList .list .item .pictrue image.on {
		border-radius: 6rpx;
	}

	.productList .list .item .text {
		padding: 14rpx 17rpx 26rpx 17rpx;
		font-size: 28rpx;
		color: #212121;
	}

	.productList .list .item .text.on {
		width: 508rpx;
		padding: 0 0 0 22rpx;
	}

	.productList .list .item .text .money {
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 8rpx;
	}

	.productList .list .item .text .coupon {
		background: rgba(255, 248, 247, 1);
		border: 1px solid rgba(233, 51, 35, 1);
		border-radius: 4rpx;
		font-size: 20rpx;
		margin-left: 18rpx;
		padding: 1rpx 4rpx;
	}

	.productList .list .item .text .money.on {
		margin-top: 50rpx;
	}

	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}

	.pictrue {
		position: relative;

		.border-picture {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 10rpx 10rpx 0 0;
			background: center/cover no-repeat;
		}
	}

	.cate_pictrue,
	::v-deep.cate_pictrue image,
	::v-deep.cate_pictrue .easy-loadimage,
	::v-deep.cate_pictrue uni-image {
		width: 82rpx;
		height: 82rpx;
		margin: 0 auto;
	}

	.fixed {
		z-index: 100;
		position: fixed;
		left: 0;
		top: 0;
		background-color: #fff;
		box-shadow: 0 10rpx 20rpx -5rpx rgba(0, 0, 0, 0.06);
	}

	.page-footer {
		position: fixed;
		bottom: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: calc(98rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		box-sizing: border-box;
		border-top: 1px solid #f3f3f3;
		background-color: #fff;
		box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/

		&.filter {
			filter: blur(2rpx);
		}

		.foot-item {
			display: flex;
			width: max-content;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: relative;

			.count-num {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 40rpx;
				height: 40rpx;
				top: 0rpx;
				right: -15rpx;
				color: #fff;
				font-size: 20rpx;
				background-color: #fd502f;
				border-radius: 50%;
				padding: 4rpx;
			}
		}

		.foot-item image {
			height: 50rpx;
			width: 50rpx;
			text-align: center;
			margin: 0 auto;
		}

		.foot-item .txt {
			font-size: 24rpx;
		}
	}
</style>