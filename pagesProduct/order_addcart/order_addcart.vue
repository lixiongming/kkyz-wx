<template>
	<view :style="Store.localViewColor">
		
		<view class="header" :style="{ 'padding-top': (statusBarHeight * 2) + 'rpx', height: (statusBarHeight * 2) + 88 + 'rpx'}">
			<view class="hd_box">
				<image :src="imgUrl + '/home/headBg.png'" mode="aspectFill" alt="" />
			</view>
			<view class="hd_title">
				<uni-icons type="arrow-left" size="24" @click="backEvent" color="#111"></uni-icons>
                <view ><text class="text">购物车</text></view>
				<view style="width:24px;height:24px"></view>
			</view>
			
		</view>
		<!-- 头部背景 -->
		<view class="hd_box" >
			<image :src="imgUrl + '/home/headBg.png'" alt="" />
		</view>
		<view class='shoppingCart' :style="{ 'padding-top': (statusBarHeight * 2) + 88 + 'rpx',}">
			
			<view class='labelNav acea-row row-around row-middle'>
				<view class='item'><text class='iconfont icon-xuanzhong'></text>100%正品保证</view>
				<view class='item'><text class='iconfont icon-xuanzhong'></text>所有商品精挑细选</view>
				<view class='item'><text class='iconfont icon-xuanzhong'></text>售后无忧</view>
			</view>
			<view class='nav acea-row row-between-wrapper'>
				<view class="ft-12">购物数量 <text class='num t-color ml-5 fw-500'>{{cartTotalCount}}</text></view>
				<view v-if="cartList.valid.length > 0 || cartList.invalid.length > 0" class='administrate acea-row row-center-wrapper'
				 @click='manage'>{{ footerswitch ? '管理' : '取消'}}</view>
			</view>
			<view class="goods_box" v-if="cartList.valid.length > 0 || cartList.invalid.length > 0">
				<view class='list'>
					<block v-for="(item,index) in cartList.valid" :key="index">
						<view class='item acea-row row-between-wrapper goods-group'>
							<view class="store-title">
								<view class="checkbox" @click="storeAllCheck(item,index)">
									<text v-if="!item.allCheck" class="iconfont icon-weixuanzhong"></text>
									<text v-else class="iconfont icon-xuanzhong1"></text>
								</view>
								<navigator :url="hide_mer_status == 0 ? '/views/pages/home/store?mer_id='+item.mer_id : '#'" class="info" :render-link="false">
									<text class="iconfont icon-shangjiadingdan"></text>
									<view class="name">{{item.mer_name}}</view>
									<text class="iconfont icon-xiangyou"></text>
								</navigator>
								<view class="coupon-btn" v-if="item.hasCoupon>0" @click="giveCoupon(item)">优惠券</view>
							</view>
							<navigator v-for="goods in item.list" :key="goods.cart_id" :url='"/pagesProduct/goods_details/index?id="+goods.product.product_id'
							 hover-class='none' class='picTxt acea-row' :render-link="false">
								<view class="checkbox" @click.stop="goodsCheck(goods,index)">
									<text v-if="!goods.check" class="iconfont icon-weixuanzhong"></text>
									<text v-else class="iconfont icon-xuanzhong1"></text>
								</view>
								<view class='pictrue'>
									<image :src='(goods.productAttr && goods.productAttr.image) || goods.product.image'></image>
									<!-- <image v-else :src='item.productInfo.image'></image> -->
								</view>
								<view class='text'>
									<view class='store-name line1'>{{goods.product.store_name}}</view>
									<view class='infor line1' v-if="goods.productAttr.sku" @click.stop='changeCart(goods,goods.cart_id)'>
										{{goods.productAttr.sku}}
										<text class="iconfont icon-xiala1"></text>
									</view>
									<view v-if="goods.product.once_max_count>0 && goods.product.once_min_count>0" class="buy_limit">
										<text v-if="goods.product.once_min_count>0">{{goods.product.once_min_count}}件起购，</text><text v-if="goods.product.once_max_count>0">最多{{goods.product.once_max_count}}件</text>
									</view>
									<view class="no_txt" v-else-if="!goods.productAttr.sku"></view>
									<view class="p_num_box">
										<view class='money acea-row row-middle'>
											<text>￥{{goods.productAttr.price}}</text>
											<view v-if="goods.productAttr.show_svip_price"  class="vipImg">
												<image :src="imgUrlEvent('/images/wx-applet/mine/mine-bg.png','aliyunImgUrl')"></image>
											</view>
										</view>
										<view class='carnum acea-row row-center-wrapper'>
											<view class="reduce" :class="goods.numSub ? 'on' : ''" @click.stop='subCart(goods)'><text class="reduce_txt"></text></view>
											<view class='num'>{{goods.cart_num}}</view>
											<view class="plus" :class="(goods.numAdd || (goods.cart_num >= goods.productAttr.stock)) ? 'on' : ''" @click.stop='addCart(goods)'><text class="line_row"></text><text class="line_col"></text></view>
										</view>
									</view>
									
								</view>
								
							</navigator>
						</view>
					</block>
				</view>
				<view class='invalidGoods' v-if="cartList.invalid.length > 0">
					<view class='goodsNav acea-row row-between-wrapper'>
						<view @click='goodsOpen'><text class='iconfont' :class='goodsHidden==true?"icon-xiangxia":"icon-xiangshang"'></text>失效商品</view>
						<view class='del' @click='unsetCart'><text class='iconfont icon-shanchu1'></text>清空</view>
					</view>
					<view class='goodsList' v-if='goodsHidden'>
						<block v-for="(item,index) in cartList.invalid" :key='index'>
							<navigator v-if="item.product" :url="'/pagesProduct/goods_details/index?id='+item.product_id" class='item acea-row row-between-wrapper' hover-class='none' :render-link="false">
								<view class='invalid'>失效</view>
								<view class='pictrue'>
									<image :src='(item.productAttr && item.productAttr.image) || (item.product&&item.product.image)'></image>
								</view>
								<view class='text acea-row row-column-between'>
									<view class='line1 name'>{{item.product.store_name}}</view>
									<!-- <view class='infor line1' v-if="item.productInfo.attrInfo">属性：{{item.productInfo.attrInfo.suk}}</view> -->
									<view class='acea-row row-between-wrapper'>
										<!-- <view>￥{{item.truePrice}}</view> -->
										<view class='end'>该商品已失效</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
				</view>
			</view>
			<view class='noCart' v-if="recommend" :style="{marginTop:cartList.invalid.length ==0 && cartList.invalid.length == 0 ? '':'' }">
				<view class='pictrue'>
					<image :src="`${domain}/static/images/noCart.png`"></image>
					<view>暂无商品，去添加点什么吧</view>
				</view>	
				<!-- <recommendCpt v-if="recommend_switch == 1" :hostProduct='hostProduct' :isLogin="Store.isLogin"></recommendCpt> -->
				<view class='loadingicon acea-row row-center-wrapper' v-if="hostProduct.length>5 && recommend_switch == 1">
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</view>
			<view class='footer acea-row row-between-wrapper' :class="{on : isFooter}" v-if="cartList.valid.length > 0" :style="{ bottom: (safeAreaInsetsBottom * 2) + 102 + 'rpx'}">
				<view>
					<view class="allcheckbox" @click.stop="checkboxAllChange">
						<text v-if="!isAllSelect" class="iconfont icon-weixuanzhong"></text>
						<text v-else class="iconfont icon-xuanzhong1"></text>
						全选 ({{cartCount}})
					</view>
				</view>
				<view class='money acea-row row-middle' v-if="footerswitch==true">
					<text class='t-color money_num'>￥{{selectCountPrice}}</text>
					<form @submit="subOrder" report-submit='true'>
						<button class='placeOrder' formType="submit">去结算</button>
					</form>
				</view>
				<view class='button acea-row row-middle' v-else>
					<form @submit="subCollect" report-submit='true'>
						<button class='bnt bt-color' formType="submit">收藏</button>
					</form>
					<form @submit="subDel" report-submit='true'>
						<button class='bnt' formType="submit">删除</button>
					</form>
				</view>
			</view>
		</view>
		<!-- 优惠券弹窗 -->
		<block v-if="coupon.coupon">
			<couponListWindow
				:coupon='coupon'
				@ChangCouponsClone="ChangCouponsClone"
				@ChangCouponsUseState="ChangCouponsUseState"
			></couponListWindow>
		</block>
		<!-- 组件 -->
		<addcartWindow :attr="attr" :isShow='1' :iSplus='1' :destri='1' @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @goCat="goCat" @attrVal="attrVal" id='product-window'></addcartWindow>
	</view>
</template>

<script lang="js" setup>
	import { ref, onMounted, defineProps, computed, reactive } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide, onPullDownRefresh, onReachBottom, onPageScroll } from "@dcloudio/uni-app";
	import couponListWindow from '@/components/couponListWindow/index.vue';
	import addcartWindow from '@/components/addcartWindow/index.vue';
	import { getNavigation } from "@/business/api/modules/public.ts";
	import { cartDel } from '@/business/api/modules/order-new.ts';
	import { getCartList as getCartListApi,getCartCounts,changeCartNum } from '@/business/api/modules/order-new.ts';
	import { getCoupons,getShopCoupons } from '@/business/api/modules/api.ts';
	import { getProductHot,collectAll} from '@/business/api/modules/store.ts';
	// import recommendCpt from '@/packages/mall/views/components/recommend';
	import { configMap } from '@/infrastructure/utils/mall.js';
	import { HTTP_REQUEST_URL, IAMGES_URL } from '@/infrastructure/config/app.js';
	import { toLogin } from '@/infrastructure/libs/login.js';
	import util from '@/infrastructure/utils/utils.js'
	// const app = getApp();
	import store from '@/business/store/modules/mall.ts';
	import useMine from '@/business/store/modules/mine.ts';
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
    const Store = store()
    const mine_store = useMine()

	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
	let safeAreaInsetsBottom = uni.getSystemInfoSync().safeAreaInsets.bottom;

	const props = defineProps({
		image: {
			type: String,
			default: '',
		}
		
	})
	const domain = ref(HTTP_REQUEST_URL);
    const imgUrl = ref(IAMGES_URL);
    const loading = ref(false); // 是否加载中
    const loadend = ref(false); // 是否加载完毕
    const loadTitle = ref('加载更多'); // 提示语
    const isFooter = ref(false);
    const cartCount = ref(0);
    const goodsHidden = ref(true);
    const footerswitch = ref(true);
    const isAllSelect = ref(true); // 全选
    const selectCountPrice = ref(0.0);
    const hotScroll = ref(false);
    const hotPage = ref(1);
    const hotLimit = ref(10);
    const cartTotalCount = ref(0);
    const recommend = ref(false);
    const isOpen = ref(false); // 是否打开属性组件
    const source = ref('');
    const attrImage = ref('');
    const isCart = ref(true);
    const cart_id = ref('');
    const attrValue = ref(''); // 已选属性
    const uniqueValue = ref('');
    const activeRouter = ref('');

    // 使用 reactive 定义对象类型的响应式数据
    let hostProduct = reactive([]);
    let cartList = reactive({
      valid: [],
      invalid: [],
    });
    let selectValue = reactive([]); // 选中的数据
    let coupon = reactive({
      coupon: false,
      list: [],
    });
    let productValue = reactive([]); // 系统属性
    let attr = reactive({
      cartAttr: false,
      productAttr: [],
      productSelect: {},
    });
    let newVal = reactive({});
    let goods = reactive({});
    const currSku = ref('');
    // let newData = reactive({});
	let newData = ref({});
	const attrTxt = ref('');

	// 使用 configMap 生成计算属性
	const hide_mer_status = computed(() => Store.globalData.hide_mer_status || 1)
	const recommend_switch = computed(() => Store.globalData.recommend_switch || 0)
	const navigation = computed(() => Store.globalData.navigation || {})

	onMounted(() => {
		uni.getSystemInfo({
			success: function (info) {
			// 获取窗口高度
			let windowHeight = info.windowHeight;
			// 假设tabbar高度一般是40px或者90px（iOS+Android的标准高度）
			let tabbarHeight = 40;
			// 如果有tabbar的底部border或者shadow，可能需要加上相应的高度
			tabbarHeight += 10; // 假设有10px的border或shadow
			
			console.log(111);
			
			// 动态设置tabbar的高度
			uni.createSelectorQuery().select('.page-footer').boundingClientRect(data => {
				if (data) {
					console.log( data.height,' data.height');
				tabbarHeight = data.height;
				}
				// 此时tabbarHeight就是动态获取的tabbar高度
			}).exec();
			}
		});
	})

	onShow(() => {
		let routes = getCurrentPages();
		let curRoute = routes[routes.length - 1].route
		activeRouter.value = '/' + curRoute
		// getNav();
		if (mine_store.isLogin == true) {
			getCartList();
			getCartNum();
			goodsHidden.value = true;
			footerswitch.value = true;
			isAllSelect.value = true; //全选
			selectValue = []; //选中的数据
			uni.setStorage({
				key:'invoice_Data',
				data:{},
				success: function(){}
			})
		}else{
			let flag = setTimeout(() =>{
				toLogin()
				clearTimeout(flag)
			}, 300);
		}
	})

	function goRouter(item) {
		var pages = getCurrentPages();
		var page = (pages[pages.length - 1]).$page.fullPath;
		if (item.link == page) return
		uni.navigateTo({
			url: item.link,
			fail(err) {
				uni.redirectTo({
					url: item.link
				})
			}
		})
	}

	function getNav() {
		getNavigation().then(res => {
			newData.value = res.data
			if (newData.value.status && newData.value.status.status) {
				uni.hideTabBar()
				isFooter.value = true;
			} else {
				uni.showTabBar()
				isFooter.value = false;
			}
		})		
	}

	// 删除
	function subDel(event) {
		let type_id = []
		cartList.valid.forEach(el=>{
			el.list.forEach(goods=>{
				if(goods.check){
					type_id.push(goods.cart_id)
				}
			})
		})
		if(type_id.length == 0){
			return uni.showToast({
				title: '请选择产品',
				icon: 'none'
			})
		}else{
			cartDel({
				cart_id:type_id,
			}).then(res=>{
				getCartList();
				getCartNum();
				return uni.showToast({
					title: res.message,
                    icon: 'success'
				})
			}).catch(err => {
				return uni.showToast({
					title: err,
                    icon: 'none'
				})
			});
		}
	}

	// 收藏
	function subCollect(event) {
		let type_id = []
		cartList.valid.forEach(el=>{
			el.list.forEach(goods=>{
				if(goods.check){
					type_id.push(goods.spu.spu_id)
				}
			})
		})
		if(type_id.length == 0){
			return uni.showToast({
				title: '请选择产品',
				icon: 'none'
			})
		}else{
			collectAll({
				type_id:type_id,
				type:1
			}).then(res=>{
				return uni.showToast({
					title: res.message,
                    icon: 'success'
				})
			}).catch(err => {
				return uni.showToast({
					title: err,
                    icon: 'none'
				})
			});
		}
	}

	function onMyEvent() {
		attr.cartAttr = false;
		isOpen.value = false;
	}

	/*
		* 更改商品属性
		*/
	function changeCart(_goods, id) {
		let that = this;
		if(goods == _goods){
			isOpen.value = attr.cartAttr = true;
			return
		}else{
			goods = JSON.parse((JSON.stringify(_goods)));
			currSku.value = _goods.productAttr.sku.split(",");
			attr.productAttr = _goods.attr
			const sku = {}
			attrValue.value = _goods.productAttr.sku
			attrImage.value = _goods.product.image
			goods.attrValue.forEach((itemn)=>{
				sku[itemn.sku] = itemn;
			})
			productValue = sku;
			let	productSelect = sku[attrValue.value];
			isOpen.value = attr.cartAttr = true;
			//打开属性
			DefaultSelect(_goods)
		}	
	}

	/**
	 * 默认选中属性
	 *
	 */
	function DefaultSelect(_goods) {
		let productAttr = attr.productAttr;
		let value = [];
		let arr = []
		if(currSku.value){
			value = currSku.value
		}else{
			for (var key in productValue) {
				if (productValue[key].stock > 0) {
					value = attr.productAttr.length ? key.split(",") : [];
					break;
				}
			}
		}
		for (let i = 0; i < productAttr.length; i++) {
			// this.$set(productAttr[i], "index", value[i]);
			attr.productAttr[i].index = value[i];
		}
		let productSelect = productValue[value.join(",")];
		if (productSelect && productAttr.length) {
			uniqueValue.value = productSelect.unique;
			attrValue.value = value.join(",");
			attrTxt.value = "请选择";

			attr.productSelect.store_name = _goods.product.store_name;
			attr.productSelect = { 
				...attr.productSelect, 
				store_name: _goods.product.store_name,
				image: productSelect.image ? productSelect.image : _goods.product.image,
				price: productSelect.price,
				stock: productSelect.stock,
				unique: productSelect.unique,
				svip_price: productSelect.svip_price,
				cart_num: productSelect.stock == 0 ? 0 : 1,
			}
		} else if (!productSelect && productAttr.length) {
			attr.productSelect = {
				...attr.productSelect,
				store_name: _goods.product.store_name,
                image: _goods.product.image,
                price: _goods.product.price,
				svip_price: productSelect.svip_price,
                stock: 0,
                unique: "",
				cart_num: 0,
			}

			uniqueValue.value = "";
			attrValue.value = "";
			attrTxt.value = "请选择";
		} else if (!productSelect && !productAttr.length) {
			attr.productSelect = {
				...attr.productSelect,
				store_name: _goods.product.store_name,
                image: _goods.product.image,
                price: _goods.product.price,
				svip_price: productSelect.svip_price,
                stock: _goods.product.stock,
                unique: _goods.product.unique || "",
				cart_num: 1,
			}

			uniqueValue.value = _goods.product.unique || "";
			attrValue.value = "";
			attrTxt.value = "请选择";
		} else if (productSelect && !productAttr.length) {
			attr.productSelect = {
				...attr.productSelect,
				store_name: _goods.product.store_name,
                image: productSelect.image,
                price: productSelect.price,
				svip_price: productSelect.svip_price,
                stock: productSelect.stock,
                unique: productSelect.unique,
				cart_num: productSelect.stock == 0 ? 0 : 1,
			}

			uniqueValue.value = productSelect.unique;
			attrValue.value = value.join(",");
			attrTxt.value = "请选择";
		}
		goCart(productSelect);
	}

	function goCart(productSelect){
		//如果有属性,没有选择,提示用户选择
		if (
			attr.productAttr.length &&
			isOpen.value === true &&
			productSelect.stock == 0
		)
			return uni.showToast({
				title: "产品库存不足，请选择其它",
				icon: 'none'
			})
		if (attr.productSelect.cart_num == 0) {
			return uni.showToast({
				title: "购买个数不能为0！",
				icon: 'none'
			})
		}
	}

	function attrVal(val) {
		attr.productAttr[val.indexw].index = attr.productAttr[val.indexw].attr_values[val.indexn];
	}

	/**
	 * 属性变动赋值
	 *
	 */
	function ChangeAttr(res) {
		let productSelect  = productValue[res];
		currSku.value = res;
		newVal = productValue[res];
		if(productSelect) uniqueValue.value = productSelect.unique;
		if (productSelect && productSelect.stock > 0) {
			attr.productSelect = {
				...attr.productSelect,
				image: productSelect.image ? productSelect.image : attrImage.value,
				price: productSelect.price,
                stock: productSelect.stock,
                unique: productSelect.unique,
                cart_num: 1,
			}
			uniqueValue.value = productSelect.unique;
			attrValue.value = res;
		}
			else {
			attr.productSelect = {
				...attr.productSelect,
				image: productSelect.image ? productSelect.image : attrImage.value,
				price: productSelect.price,
                stock: 0,
                unique: "",
                cart_num: 0,
			}
			attrValue.value = "";
		}
	}

	// 立即下单
	function subOrder(event) {
		let selectValue = []
		cartList.valid.forEach(el=>{
			el.list.forEach(goods=>{
				if(goods.check){
					selectValue.push(goods.cart_id)
				}
			})
		})
		if (selectValue.length > 0) {
			uni.navigateTo({
				url: '/pagesProduct/order_confirm/index?cartId=' + selectValue.join(',')
			});
		} else {
			return uni.showToast({
				title: "请选择产品",
				icon: 'none'
			})
		}
	}

	// 购物车增加
	function addCart(_goods, index) {
		if (_goods.hasOwnProperty('productAttr') && _goods.cart_num >= _goods.productAttr.stock) {
			_goods.cart_num = _goods.productAttr.stock;
			_goods.numAdd = true;
			_goods.numSub = false;
			return
		}
		let that = this;
		changeCartNum(_goods.cart_id, {
			cart_num: _goods.cart_num + 1
		}).then(res => {
			_goods.cart_num = Number(_goods.cart_num) + 1
			cartTotalCount.value = Number(cartTotalCount.value) + 1;
			_goods.numAdd = false;
			_goods.numSub = false;	
			cartAllCheck('goodsCheck')
		}).catch(error => {
			return uni.showToast({
				title: error,
				icon: 'none'
			})
		})
	}

	function goCat() {
		changeCartNum(goods.cart_id, {
			cart_num: goods.cart_num,
			product_attr_unique: newVal.unique
		}).then(res => {
			if (goods.hasOwnProperty('productAttr') && goods.cart_num > goods.productAttr.stock) {
				goods.cart_num = goods.productAttr.stock;
				goods.numAdd = true;
				goods.numSub = false;
				return
			} else {
				goods.numAdd = false;
				goods.numSub = false;
			}
			onMyEvent();
			getCartList(true);
			isAllSelect.value = false

		}).catch(error => {
			return uni.showToast({
				title: error,
				icon: 'none'
			})
		})
	}

	// 购物车递减
	function subCart(_goods) {
		let status = false;
		if (_goods.cart_num < 1) status = true;
		if (_goods.cart_num <= 1) {
			_goods.cart_num = 1;
			_goods.numSub = true;
			status = true;
		} else {
			if (false == status) {
				changeCartNum(_goods.cart_id, {
					cart_num: Number(_goods.cart_num) - 1
				}).then(res => {
					_goods.numSub = false;
					_goods.numAdd = false;
					if(_goods.cart_num <= 1){
						_goods.numSub = true;
					}
					_goods.cart_num = Number(_goods.cart_num) - 1
					cartTotalCount.value = Number(cartTotalCount.value) - 1;
					cartAllCheck('goodsCheck')
				}).catch(error => {
					return uni.showToast({
						title: error,
						icon: 'none'
					})
				})
			}
		}
	}

	function getCartNum() {
		getCartCounts().then(res => {
			cartTotalCount.value = res.data[0].count || 0;
		});
	}

	// 购物车列表
	function getCartList(isChange) {
		getCartListApi().then(res => {
			res.data.list.forEach((item, index) => {
				item.allCheck = true
				item.list.forEach((_goods, j) => {
					_goods.check = true
					if (_goods.cart_num == 1) {
						_goods.numSub = true;
					} else {
						_goods.numSub = false;
					}
					if (_goods.cart_num == _goods.productAttr.stock) {
						_goods.numAdd = true;
					} else {
						_goods.numAdd = false;
					}
				})
			})
			cartList.valid = res.data.list
			cartList.invalid = res.data.fail
			if(res.data.list.length == 0 && res.data.list.length == 0){
				recommend.value = true;
				if(!hostProduct.length){
					// getHostProduct();
				}
			}else{
				recommend.value = false
			}
			const sku = {}
			// checkboxAllChange()
			cartAllCheck('cartCheck')
			uni.stopPullDownRefresh(); //结束下拉刷新
		});
	}

	// 商铺全选
	function storeAllCheck(item, index) {
		// 店铺取消
		if (item.allCheck) {
			item.allCheck = false
			item.list.forEach((el, index) => {
				el.check = false
			})
		} else {
			item.allCheck = true
			item.list.forEach((el, index) => {
				el.check = true
			})
		}
		cartAllCheck('goodsCheck')
	}

	// 商品选中
	function goodsCheck(_goods) {
		_goods.check = !_goods.check
		cartAllCheck('goodsCheck')
	}

	// 全选判断
	function cartAllCheck(type) {
		let allArr = [];
		let totalMoney = 0
		let totalNum = 0
		cartList.valid.forEach((el, index) => {
			if (type == 'goodsCheck') {
				let tempArr = el.list.filter(_goods => {
					return _goods.check == true
				})
				if (el.list.length == tempArr.length) {
					el.allCheck = true
					allArr.push(el)
				} else {
					el.allCheck = false
				}
			} else {
				el.list.forEach((_goods) => {
					_goods.check = isAllSelect.value
				})
				el.allCheck = isAllSelect.value
				if (el.allCheck) allArr.push(el)
			}
			// 总金额 //总数
			el.list.forEach(e => {
				if (e.check) {
					totalMoney = util.$h.Add(totalMoney, util.$h.Mul(e.productAttr.price, e.cart_num))
					totalNum += e.cart_num
				}
			})
		})
		console.log("totalMoney--->", totalMoney)
		cartCount.value = totalNum
		selectCountPrice.value = totalMoney
		// 全选
		isAllSelect.value = allArr.length == cartList.valid.length ? true : false
	}

	// 购物车全选
	function checkboxAllChange() {
		isAllSelect.value = !isAllSelect.value
		cartAllCheck('cartCheck')
	}

	// 推荐列表
	function getHostProduct() {
		if (loadend.value) return;
		if (hotScroll.value) return;
		loading.value = true;
		loadTitle.value = "加载更多";
		getProductHot(
			hotPage.value,
			hotLimit.value,
		).then(res => {
			let list = res.data.list || [];
			hotPage.value++
			hotScroll.value = res.data.list.length < hotLimit.value
			hostProduct = hostProduct.concat(res.data.list)
			loading.value = false;
			loadTitle.value = hotScroll.value ? "我也是有底线的" : '加载更多';
		});
	}

	// 失效商品展开
	function goodsOpen() {
		goodsHidden.value = !goodsHidden.value;
	}

	// 管理
	function manage() {
		let that = this;
		footerswitch.value = !footerswitch.value;
	}

	// 清空
	function unsetCart() {
		let ids = [];
		for (let i = 0, len = cartList.invalid.length; i < len; i++) {
			ids.push(cartList.invalid[i].cart_id);
		}
		cartDel({
			cart_id:ids
		}).then(res => {
			uni.showToast({
				title: '清除成功',
				icon: 'none'
			})
			getCartNum();
			cartList.invalid = [];
		}).catch(res => {});
	}

	// 店铺优惠券
	function giveCoupon(item){
		let goodsArr = []
		let couponList = [];
		let activeList = [];
		let ids = []
		item.list.map(el=>{
			ids.push(el.product_id)
		})
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		getCoupons({
			ids:ids.join(',')
		}).then(res => {
			goodsArr = res.data
			getShopCoupons(item.mer_id).then(({data})=>{
				uni.hideLoading();
				couponList = goodsArr.concat(data)
				coupon.list = couponList;
				coupon.coupon = true;
			}).catch(error=>{})
		});
	}

	function ChangCouponsClone() {
		coupon.coupon = false;
	}

	function ChangCouponsUseState(index) {
		coupon.list[index].issue = true;
	}

	onPullDownRefresh(() => {
		cartList = {
			valid: [],
			invalid: []
		}
		getCartNum();
		getCartList();
	})

	onReachBottom(() => {
		// recommend.value && getHostProduct();
	})

	// 滚动监听
	onPageScroll(() => {
		// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
		uni.$emit('scroll');
	})

    // 返回上一个页面
	function backEvent(){
	  uni.navigateBack({
	    delta: 1
      });
	}
	
	// 更新自动调价商品
uni.$on('changeAutoPro',(res)=>{
   console.log('最新价格',res)
   cartList.valid.forEach((item)=>{
	item.list.forEach(items=>{
      if(items.product_id == res.product_id){
         items.price = res.price
      }
	})
    
    })
})
</script>

<style scoped lang="scss">
	.shoppingCart .labelNav {
		height: 76rpx;
		padding: 0 30rpx;
		font-size: 22rpx;
		color: #8c8c8c;
		// position: fixed;
		// position: relative;
		// left: 0;
		width: 100%;
		box-sizing: border-box;
		// background-color: #f5f5f5;
		// z-index: 5;
		// top: 0;
	}
	.icon-xiala1{
		display: inline-block;
		transform: rotate(180deg);
		font-size: 14rpx;
		padding: 0 5rpx;
	}
	.shoppingCart .labelNav .item .iconfont {
		font-size: 25rpx;
		margin-right: 10rpx;
	}
	.ml-5 {
		margin-left: 10rpx;
	}
	.ft-12 {
		font-size: 24rpx;
	}
	.fw-500 {
		font-weight: 500;
	}
	.t-color {
		color: #2692FF;
	}
	.shoppingCart {
		position: relative;
		z-index: 2;
		padding-top: 88rpx;
		/* #ifndef MP */
		padding-bottom: 180rpx;
		/* #endif */
		/* #ifdef MP */
		padding-bottom: calc(180rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
		/* #endif */
	}
	.shoppingCart .nav {
		width: 100%;
		height: 80rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #282828;
	}
	.shoppingCart .nav .administrate {
		font-size: 24rpx;
		color: #282828;
		width: 80rpx;
		height: 40rpx;
		line-height: 38rpx;
		// border-radius: 6rpx;
		border-radius: 8rpx;
		border: 2rpx solid #868686;
	}
	.shoppingCart .noCart {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		// background-color: #fff;
		padding-top: 0.1rpx;
	}
	.shoppingCart .noCart .pictrue {
		text-align: center;
		margin: 78rpx auto 56rpx auto;
		padding-bottom: 60rpx;
	}
	.shoppingCart .noCart .pictrue image {
		width: 414rpx;
		height: 305rpx;
	}
	.shoppingCart .noCart .pictrue view{
		color: #999;
	}
	.shoppingCart .list {
		margin: 0rpx 0 20rpx;
	}
	.shoppingCart .list .item {
		margin-bottom: 15rpx;
		.store-title {
			display: flex;
			align-items: center;
			width: 100%;
			padding: 0 30rpx;
			height: 85rpx;
			border-bottom: 1px solid #f0f0f0;
			.checkbox {
				width: 60rpx;
				.iconfont {
					font-size: 40rpx;
					color: #CCCCCC;
				}
				.icon-xuanzhong1 {
					color: var(--view-assist);
				}
			}
			.info {
				flex: 1;
				display: flex;
				align-items: center;
				.iconfont {
					font-size: 36rpx;
				}
				.name {
					margin: 0 0 0 10rpx;
					font-size: 28rpx;
					color: #282828;
					font-weight: 400;
				}
				.icon-xiangyou {
					margin-top: 6rpx;
					font-size: 20rpx;
					color: var(--view-assist);
					font-weight: 600;
					margin-left: 8rpx;
				}
			}
			.coupon-btn {
				color: #fff;
				font-size: 22rpx;
				width: 100rpx;
				line-height: 36rpx;
				background: var(--view-bgColor);
				border-radius: 18rpx;
				text-align: center;
			}
		}
	}
	.vipImg {
		width: 65rpx;
		height: 28rpx;
		margin-left: 10rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.shoppingCart .list .item .picTxt {
		width: 100%;
		padding: 25rpx 30rpx;
		position: relative;
		align-items: center;
		.checkbox {
			width: 60rpx;
			.iconfont {
				font-size: 40rpx;
				color: #CCCCCC;
			}
			.icon-xuanzhong1 {
				color: var(--view-assist);
			}
		}
	}
	.shoppingCart .list .item .picTxt .pictrue {
		width: 128rpx;
		height: 128rpx;
	}
	.shoppingCart .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}
	.shoppingCart .list .item .picTxt .text {
		flex: 1;
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #282828;
		overflow: hidden;
	}

	.shoppingCart .list .item .picTxt .text .store-name {
		max-width: 460rpx;
	}
	.shoppingCart .list .item .picTxt .buy_limit {
		margin-top: 10rpx;
		color: #E93323;
		font-size: 22rpx;
	}
	.shoppingCart .list .item .picTxt .text .infor {
		display: inline-block;
		padding: 6rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #868686;
		margin-top: 8rpx;
		background-color: #F5F5F5;
		max-width: 460rpx;
	}
	.shoppingCart .list .item .picTxt .text .money {
		font-size: 28rpx;
		color: var(--view-theme);
		font-weight: 600;
	}
	.shoppingCart .list .item .picTxt .carnum {
		height: 47rpx;
	}
	.shoppingCart .list .item .picTxt .carnum view {
		border: 1px solid var(--view-noSelectColor);
		
		text-align: center;
		height: 100%;
		line-height: 46rpx;
		font-size: 28rpx;
		color: var(--view-theme);
	}
	.shoppingCart .list .item .picTxt .carnum .reduce {
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.shoppingCart .list .item .picTxt .carnum .reduce .reduce_txt {
		display: block;
		height: 4rpx;
		width: 20rpx;
		background: #282828;
	}
	.shoppingCart .list .item .picTxt .carnum .reduce.on,
	.shoppingCart .list .item .picTxt .carnum .plus.on {
		color: #dedede;
		
	}
	.shoppingCart .list .item .picTxt .carnum .reduce.on .reduce_txt{
		background: #dedede;
		
	}
	.shoppingCart .list .item .picTxt .carnum .plus .line_row,
	.shoppingCart .list .item .picTxt .carnum .plus .line_col {
		display: block;
		height: 4rpx;
		width: 20rpx;
		background: var(--view-theme);
		position: absolute;
		left: 50%;
		top: 50%;
	}
	.shoppingCart .list .item .picTxt .carnum .plus .line_row {

		transform: translate(-50%, -50%);
	}
	.shoppingCart .list .item .picTxt .carnum .plus .line_col {
		transform: translate(-50%, -50%) rotateZ(90deg);
	}
	.shoppingCart .list .item .picTxt .carnum .plus.on .line_row, 
	.shoppingCart .list .item .picTxt .carnum .plus.on .line_col {
		background: #dedede;
	}
	.shoppingCart .list .item .picTxt .carnum .plus {
		border-radius: 8rpx;
		font-size: 40rpx;
		width: 40rpx;
		height: 40rpx;
		position: relative;
	}
	.shoppingCart .list .item .picTxt .carnum .plus,
	.shoppingCart .list .item .picTxt .carnum .reduce {
		border-radius: 8rpx;
		font-size: 40rpx;
		width: 40rpx;
		height: 40rpx;
		font-weight: 500;
	}
	
	.shoppingCart .list .item .picTxt .carnum .num {
		color: #282828;
		border: none;
		min-width: 66rpx;
		padding: 0 8rpx;
	}
	.shoppingCart .invalidGoods {
		background-color: #fff;
		margin: 24rpx;
		border-radius: 30rpx;
	}
	.shoppingCart .invalidGoods .goodsNav {
		width: 100%;
		height: 66rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #282828;
	}
	.shoppingCart .invalidGoods .goodsNav .iconfont {
		color: #424242;
		font-size: 28rpx;
		margin-right: 17rpx;
	}
	.shoppingCart .invalidGoods .goodsNav .del {
		font-size: 26rpx;
		color: #999;
	}
	.shoppingCart .invalidGoods .goodsNav .del .icon-shanchu1 {
		color: #999;
		font-size: 33rpx;
		vertical-align: -2rpx;
		margin-right: 8rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item {
		padding: 20rpx 30rpx;
		border-top: 1px solid #f5f5f5;
	}
	.shoppingCart .invalidGoods .goodsList .item .invalid {
		font-size: 22rpx;
		color: #fff;
		width: 70rpx;
		height: 36rpx;
		background-color: #aaa;
		border-radius: 3rpx;
		text-align: center;
		line-height: 36rpx;
		margin-right: 20rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .pictrue {
		width: 128rpx;
		height: 128rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .text {
		flex: 1;
		font-size: 28rpx;
		color: #999;
		height: 140rpx;
		justify-content: space-around;
		margin-left: 20rpx;
		overflow: hidden;
	}
	.shoppingCart .invalidGoods .goodsList .item .text .name {
		width: 100%;
	}
	.shoppingCart .invalidGoods .goodsList .item .text .infor {
		font-size: 24rpx;
	}
	.shoppingCart .invalidGoods .goodsList .item .text .end {
		font-size: 26rpx;
		color: #bbb;
	}
	.p_num_box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.shoppingCart .footer {
		z-index: 9;
		width: 100%;
		height: 96rpx;
		background-color: #FFFFFF;
		position: fixed;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #eee;
		bottom: 0rpx !important;
	}
	.shoppingCart .footer.on {
		bottom: 98rpx;
		bottom: calc(98rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.shoppingCart .footer .checkAll {
		font-size: 28rpx;
		color: #282828;
		margin-left: 16rpx;
	}
	.shoppingCart .footer .money {
		font-size: 30rpx;
		.money_num {
			font-size: 28rpx;
			color: var(--view-priceColor);
			font-weight: 600;
		}
	}
	.shoppingCart .footer .placeOrder {
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		width: 192rpx;
		height: 72rpx;
		border-radius: 36rpx;
		text-align: center;
		line-height: 70rpx;
		margin-left: 32rpx;
		background-color: var(--view-bgColor);
	}
	.shoppingCart .footer .button .bnt {
		font-size: 28rpx;
		color: #999;
		border-radius: 50rpx;
		border: 1px solid #999;
		width: 160rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		&.bt-color {
			color: var(--view-bgColor);
			border: 1px solid var(--view-bgColor);
		}
	}
	.shoppingCart .footer .button form~form {
		margin-left: 17rpx;
	}
	.allcheckbox {
		display: flex;
		align-items: center;
		width: 210rpx;
		.iconfont {
			margin-right: 20rpx;
			font-size: 40rpx;
			color: #CCCCCC;
		}
		.icon-xuanzhong1 {
			color: var(--view-assist);
		}
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
		border-top: solid 1px #F3F3F3;
		background-color: #fff;
		box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		&.filter{
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
				background-color: #FD502F;
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
	.list {
		.goods-group {
			margin: 24rpx;
			background-color: #fff;
			border-radius: 30rpx;
		}
	}
	.no_txt {
		height: 40rpx;
	}
	.hd_box {
		position: absolute;
		width: 100%;
		height: 344rpx;
		left: 0;
		top: 0;
		z-index: 1;
		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.goods_box {
		overflow-y: auto;
	}
	.header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 20;
		width: 100%;
		// height: 88rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		.hd_box {
			position: absolute;
			top: 0;
			width: 100%;
			height: 280rpx;
		}

		.hd_img {
			position: absolute;
			top: 22rpx;
			left: 32rpx;
			width: 48rpx;
			height: 48rpx;
			z-index: 9;
		}

		.hd_title {
		    display: flex;
            width: 750rpx;
			justify-content: space-between;
			color: var(--view-theme);
			font-size: 32rpx;
			
			z-index: 9;
			padding: 0rpx 32rpx;
			.text{
               font-weight: 600;
			}
		}
	}

	
</style>

