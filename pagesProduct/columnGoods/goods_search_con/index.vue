<template>
	<view :style="localViewColor">
		<view class='productList'>
			<view class='search acea-row row-between-wrapper'>
				
				<view class='input acea-row row-between-wrapper'><text class='iconfont icon-sousuo'></text>
					<input placeholder='搜索商品名称' placeholder-class='placeholder' confirm-type='search' name="search" :value='where.keyword'
					 @confirm="searchSubmit" @input="inputChange"></input>
				</view>
				<view style="text-align: right;" v-if="tabIndex==1" class='iconfont' :class='is_switch==true?"icon-pailie":"icon-tupianpailie"'
				 @click='Changswitch'></view>
				<view v-else-if="mer_location == 1" style="text-align: right;" class='iconfont icon-dingwei' @click="showMaoLocation(latitude,longitude)"></view>
			</view>
			<view class="nav-wrapper">
				<!-- <view v-if="hide_mer_status == 0" class="tab-bar">
					<view class="tab-item" :class="{on:tabIndex==1}" @click="tabIndex = 1">商品</view>
					<view class="tab-item" :class="{on:tabIndex==2}" @click="tabIndex = 2">店铺</view>
				</view> -->
				<block v-if="tabIndex==1">
					<view class='nav acea-row row-middle'>
						<view class='item' @click="downStatus = !downStatus" :class="{'t-color':downKey>0 && firstKey == 0}">
							{{downMenu[downKey].title}}
							<text v-if="!downStatus" class="iconfont icon-xiala1 spin"></text>
							<text v-else class="iconfont icon-xiala1"></text>
						</view>
						<view class='item' :class="{'t-color': firstKey == 3}" @click='set_where(3)'>
							销量
							<image class="sort_img" :class="changeSortClass('sales', sales)" v-if="sales==1 || sales==2" :src="imgUrlEvent('/images/wx-applet/mine/sort_sub.png','aliyunImgUrl')"></image>
						    <image class="sort_img" v-else :src="imgUrlEvent('/images/wx-applet/mine/sort_default.png','aliyunImgUrl')"></image>
						</view>
						<view class='item' :class="{'t-color': firstKey == 2}" @click='set_where(2)'>
							价格
							<image class="sort_img" :class="changeSortClass('price', price)" v-if="price==1 || price==2" :src="imgUrlEvent('/images/wx-applet/mine/sort_sub.png','aliyunImgUrl')"></image>
						    <image class="sort_img" v-else :src="imgUrlEvent('/images/wx-applet/mine/sort_default.png','aliyunImgUrl')"></image>
						</view>
						<!-- down -->
						<view class='item' @click='bindRight'>
							筛选
							<text class="iconfont icon-shaixuan"></text>
						</view>
					</view>
				</block>
				<block v-if="tabIndex==2">
					<view class='nav acea-row row-middle'>
						<view class='item' v-for="item in shopTab" :key="item.key" :class=" {'t-color':storeKey==item.key}" @click="storeTab(item.key)">
							<template v-if="item.key==1">
						     	{{item.title}}
								<image class="sort_img" :class="changeSortClass('sales', storeSales)" v-if="storeSales==1 || storeSales==2" :src="imgUrlEvent('/images/wx-applet/mine/sort_sub.png','aliyunImgUrl')"></image>
								<image class="sort_img" v-else :src="imgUrlEvent('/images/wx-applet/mine/sort_default.png','aliyunImgUrl')"></image>
							</template>
							<template v-else>{{item.title}}</template>
						</view>
							<view class="line" :class="{'font-line':firstKey == 4}">
							</view>
					</view>
				</block>
			</view>
			<!-- 商品 -->
			<template v-if="tabIndex == 1">
				
				<view :style="{ height: '170rpx' }"></view>

				<CWaterfall ref="c_waterfall_ref" :productList="productList" :is_switch="!is_switch"></CWaterfall>


				<view class='loadingicon acea-row row-center-wrapper' v-if='loading'>
					<text class='loading iconfont icon-jiazai' v-if='loading'></text>{{loadTitle}}
				</view>
				<view class='noCommodity' v-if="productList.length==0 && !loading">
					<view class='pictrue' style="margin: 0 auto;">
						<image :src="domain+'/static/images/noSearch.png'"></image>
						<text>暂无商品，快去搜索其他商品吧</text>
					</view>
					<!-- <recommend v-if="recommend_switch == 1" :hostProduct="hostProduct" :isLogin="isLogin"></recommend> -->
				</view>
			</template>
			<!-- 店铺 -->
			<block v-if="tabIndex == 2">
				<view class="store-wrapper" :style="{ marginTop: '170rpx' }">
					<view class="store-item" v-show="storeList.length" v-for="(item,index) in storeList" :key="index">
						<view class="head">
							<view class="left-wrapper">
								<view class="logo">
									<image :src="item.mer_avatar" mode=""></image>
								</view>
								<view class="con-box">
									<view class="name acea-row row-between-wrapper line1">
										<text class="mer_name line1">{{item.mer_name}}</text>
										<image v-if="margin_ico_switch==1 && margin_ico && item.is_margin == 10" :src="margin_ico" class="store-margin"></image>
										<text v-if="item.type_name" class="font-bg-red b-color">{{item.type_name}}</text>
										<text v-else-if="item.is_trader" class="font-bg-red b-color">自营</text>
										<text v-if="item.is_rural" class="font-bg-red b-color">乡村振兴</text>
									</view>
									<view class="star-box">
										<view class="star">
											<view class="star-active" :style="{width: `${item.allScore}%`, backgroundImage: `url(${domain}/static/diy/score1${keyColor}.png)`}"></view>
										</view>
										<view class="num">{{item.product_score}}</view>
										<view class="line" v-if="item.distance"></view>
										<view class="distance" v-if="item.distance" @click="showMaoLocation(item.lat,item.long)">{{item.distance}}
											<view class="iconfont icon-xiangyou"></view>
										</view>
									</view>
								</view>
							</view>
							<view class="link" @click="goStore(item.mer_id)">进店</view>
						</view>
						<view class="pic-wrapper">
							<view class="pic-item" v-for="(goods,index) in item.recommend" :key="index">
								<navigator :url="`/pagesProduct/goods_details/index?id=${goods.product_id}`">
									<image :src="goods.image" mode=""></image>
									<view class="price">
										<text>￥</text>{{goods.price}}
									</view>
								</navigator>
							</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if='loading'>
					<text class='loading iconfont icon-jiazai' v-if='loading'></text>{{loadTitle}}
				</view>
				<view class='noCommodity' v-if="!storeList.length && !loading">
					<view class='pictrue' style="margin: 0 auto;">
						<image :src="domain+'/static/images/noSearch.png'"></image>
						<text>暂无商品，快去搜索其他商品吧</text>
					</view>
					<recommend v-if="recommend_switch == 1" :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
				</view>
			</block>
			<rightSlider1 v-if="rightBox" :status="rightBox" :activeIndex="activeIndex" :brandList="brandList" :price_on="where.price_on" :price_off="where.price_off"
			 @confirm="confirm" @close="close"></rightSlider1>
		</view>
		<view class="down-wrapper" v-if="downStatus">
			<view class="bg"></view>
			<view class="down-box" :style="{ top: '170rpx' }">
				<view class="down-item" v-for="(item,index) in downMenu" :key="item.key" :class="{'on':index == downKey}" @click="bindDown(item,index)">
					{{item.title}}
					<text v-if="index == downKey" class="iconfont icon-gou"></text>
				</view>
			</view>
		</view>
		<rightSlider2 v-if="rightBox2" :status="rightBox2" :activeIndex="activeIndex" :merList="merList" :storeTypeArr="storeTypeArr" @confirm="confirm2" @close="close"></rightSlider2>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
	</view>
</template>

<script setup>
	import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
	import {
		getProductslist,
		getProductHot,
		getBrandlist,
		storeMerchantList,
		getGeocoder,
		merClassifly,
		getStoreTypeApi
	} from '@/business/api/modules/store-old.ts';
	import { homeApi } from "@/business/api/index.ts";
	import {initiateAssistApi} from '@/business/api/modules/activity.ts';
	import recommend from '@/components/recommend/index.vue';
	import rightSlider1 from '@/components/rightSlider.vue';
	import rightSlider2 from '@/components/rightSlider/index.vue';
    // import WaterfallsFlow from '@/packages/mall/views/pages/columnGoods/components/WaterfallsFlow/WaterfallsFlow.vue'
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup/index.vue';
	// #endif

	import { toLogin } from '@/infrastructure/libs/login.js';
	import { HTTP_REQUEST_URL } from '@/infrastructure/config/app.js';
	import { goShopDetail } from '@/infrastructure/libs/order.js'
	import util  from '@/infrastructure/utils/utils.js'
    import { ref , watch, computed, onMounted, getCurrentInstance, nextTick} from 'vue'
	import { onLoad, onShow, onReady,onPullDownRefresh, onInit, onHide, onUnload,onReachBottom, onPageScroll } from "@dcloudio/uni-app";
	import store from '@/business/store/modules/mall.ts';
	import { decimalExchangeCoupons } from "@/infrastructure/utils/filter.js"
	import CWaterfall from "@/components/waterfall/index.vue";
	import _ from "lodash";


	const c_waterfall_ref = ref()
	const productListOrigin = ref()


	const Store = store()
	const domain = ref(HTTP_REQUEST_URL)
	const productList = ref([])
	const is_switch = ref(true)
	const where = ref({
		cate_id: '',
		order: 'price_asc',
		price_on: '',
		price_off: '',
		brand_id: '',
		keyword: '',
		is_trader: '',
		page: 1,
		limit: 30
	})
	const shopTabs = ref([
		{
			title: '默认',
			key: 0,
			order: ""
		},
		{
			title: '销量',
			key: 1,
			order: 'sales'
		},
		{
			title: '好评',
			key: 2,
			order: 'rate'
		},
		{
			title: '距离',
			key: 3,
			order: 'location'
		}
	])
	const sales = ref(0)
	const storeSales = ref(0)
	const price = ref(0)
	const stock = ref(0)
	const nows = ref(false)
	const loadend = ref(false)
	const loading = ref(false)
	const loadTitle = ref('加载更多')
	const title = ref('')
	const hostProduct = ref([])
	const hotPage = ref(1)
	const hotLimit = ref(10)
	const hotScroll = ref(false)
	const rightBox = ref(false)
	const rightBox2 = ref(false)
	const brandList = ref([])
	const downKey = ref(0)
	const downStatus = ref(false)
	const downMenu = ref([
		{
			title: '综合',
			key: 1,
		},
		{
			title: '评分',
			key: 2,
		},
		{
			title: '新品',
			key: 3,
		}
	])
	const firstKey = ref(0)
	const tabIndex = ref(1)
	const storeList = ref([])
	const sotreParam = ref({
		keyword: '',
		page: 1,
		limit: 10,
		order: '',
		category_id : '',
		type_id: ''
	})
	const storeKey = ref(0)
	const storeScroll = ref(true)
	const detaile_address = ref("") //详细地址
	const recommend_address = ref("") //当前地点
	const latitude = ref("")
	const longitude = ref("")
	const mer_location = ref(0)
	const count = ref(0) //店铺总条数
	const storeTypeArr = ref([]) //店铺类型
	const merList = ref([]) //商户分类
	const mTop = ref(0)
	const activeIndex = ref(0)
    const instance = getCurrentInstance();
    const $wechat =  ref({})
    if (instance) {
        console.log(instance)
        const globalProperties = instance.appContext.config.globalProperties
        $wechat.value = globalProperties.$wechat 
    }

	watch(()=>tabIndex.value, (nVal, oVal)=>{
	if (nVal == 1) {
		loadend.value = false;
		where.value.page = 1
	    get_product_list(true)
	} else {
		loadend.value = false;
		downStatus.value = false
		storeScroll.value = true
		storeList.value = []
		storeMerchantListEvent('')
	}
	})

	onLoad((options)=>{
		where.value.cate_id = options.id || ''
		title.value = options.title || ''
		where.value.keyword = options.searchValue || ''
		get_product_list(true)
		// get_host_product()
		getClassfication()
		getStoreType()
	})

	onMounted(() => {
	  uni.getStorage({
	  key: 'GLOBAL_DATA',
	  success: (res) => {
	  	if (res.data.mer_location == 1) {
	  		mer_location.value = res.data.mer_location
	  		selfLocation()
	  	}
	  }
	  });
	  mTop.value = hide_mer_status.value == 0 ? '238rpx' : '170rpx'
	});
    

	const margin_ico_switch = computed(()=>{
		return Store.globalData.margin_ico_switch || 0
	})

	const margin_ico = computed(()=>{
	 return Store.globalData.margin_ico_switch || 0
	})

	const hide_mer_status = computed(()=>{
	 return Store.globalData.hide_mer_status || 0
	})

	const recommend_switch = computed(()=>{
	 return Store.globalData.recommend_switch || 0
	})

	const uid = computed(()=>{
	 return Store.uid
	})

	const isLogin = computed(()=>{
	 return Store.isLogin 
	})

	const scrollTop = computed(()=>{
	 return Store.scrollTop
	})

	const localViewColor = computed(()=>{
	 return Store.localViewColor
	})

	const keyColor = computed(()=>{
	 return Store.keyColor
	})

	const shopTab = computed(()=>{
	return shopTabs.value.filter((item) => {
			 if (mer_location.value == 1) {
			 	return item
			 } else {
			 	return item.key < 3
			 }
		  })
	})

   onPageScroll(()=>{
	uni.$emit('scroll');
   })
   
   	//查看地图
	function showMaoLocation(lat, lon) {
	 if (!lat || !lon) return util.Tips({
	 	title: '请设置允许商城访问您的位置！'
	 });
    //#ifdef H5
	 console.log($wechat.value)
    	if ($wechat.value.isWeixin() === true) {
    		$wechat.value.seeLocation({
    			latitude: Number(lat),
    			longitude: Number(lon)
    		}).then(res=>{
    			console.log('success');
    		})
    	}else{
    		//#endif
    		uni.openLocation({
    			latitude: parseFloat(lat),
    			longitude: parseFloat(lon),
    			scale: 8,
    			geocode: true,
    			name: '当前位置',
    			address: detaile_address.value,
    			success: function(res) {
    				console.log(res)
    			},
    		});
    	// #ifdef H5
    	}
    	//#endif
	 }

	// 获取定位
	function selfLocation () {
		console.log('获取位置权限')
		uni.getLocation({
		type: 'wgs84',
		success: (res) => {
		console.log(res)
		let latitudes, longitudes;
		latitudes = res.latitude.toString();
		longitudes = res.longitude.toString();
		latitude.value = res.latitude
		longitude.value = res.longitude
		console.log(res)
		getGeocoder({
		lat: latitudes,
		long: longitudes
		}).then(res => {
		detaile_address.value = res.data.address;
		recommend_address.value = res.data.formatted_addresses.recommend;
		})
		},
		complete: function(e) {
		console.log('失败',e)
		// self.getList();
		}
		});
	}
			// 获取商户分类
	function getClassfication () {
	    let temp = []
	    merClassifly()
	    	.then(res => {
	    		temp = res.data.map(item => {
	    			return {
	    				...item,
	    				check: false
	    			}
	    		})
	    		if (sotreParam.value.category_id.length > 0) {
	    			sotreParam.value.category_id.forEach((ids, index) => {
	    				temp.forEach(el => {
	    					if (ids == el.merchant_category_id) {
	    						el.check = true
	    					}
	    				})
	    			})
	    		}
	    		merList.value= temp
	    	})
	    	.catch(res => {
	    		util.Tips({
	    			title: res
	    		});
	    	});
	 }
	// 获取店铺类型
	function getStoreType () {
	    let temp = []
	    getStoreTypeApi()
	    	.then(res => {
	    		temp = res.data.map(item => {
	    			return {
	    				...item,
	    				check: false
	    			}
	    		})
	    		if (sotreParam.value.type_id.length > 0) {
	    			sotreParam.value.type_id.forEach((ids, index) => {
	    				temp.forEach(el => {
	    					if (ids == el.mer_type_id) {
	    						el.check = true
	    					}
	    				})
	    			})
	    		}
	    		storeTypeArr.value = temp
	    	})
	    	.catch(res => {
	    		util.Tips({
	    			title: res
	    		});
	    	});
	}
	// 查找店铺
	function storeMerchantListEvent(type) {
		if (!storeScroll.value) return
		loading.value = true
		let serachData = {
			keyword: where.value.keyword,
			page: sotreParam.value.page,
			limit: sotreParam.value.limit,
			order: sotreParam.value.order,
			category_id: sotreParam.value.category_id,
			type_id: sotreParam.value.type_id
		}
		if (latitude.value) {
			serachData.location = latitude.value + ',' + longitude.value
		}
		storeMerchantList(serachData).then(res => {
			res.data.list.forEach(item => {
				var tempNum = parseFloat(item.product_score) + parseFloat(item.service_score) + parseInt(item.postage_score)
				tempNum = tempNum / 3 / 5 * 100
				item.allScore = tempNum.toFixed(2)
			})
			storeScroll.value = res.data.list.length >= sotreParam.value.limit
			storeList.value = storeList.value.concat(res.data.list)
			count.value = res.data.count
			loading.value = false
		})
	}
	// 店铺排序
	function storeTab(key) {
		if (loading.value) return
		storeKey.value = key
		sotreParam.value.order = shopTabs.value[key].order
		sotreParam.value.page = 1
		storeScroll.value = true
		storeList.value = []
		if(key==1){
			if (storeSales.value == 0) {
				storeSales.value = 1;
				sotreParam.value.order = 'sales_asc'
			} else if (storeSales.value == 1) {
				storeSales.value = 2;
				sotreParam.value.order = 'sales_desc'
			} else if (storeSales.value == 2) {
				storeSales.value = 0;
				sotreParam.value.order = ''
			}
		}else{
		    storeSales.value = 0;
		}
		storeMerchantListEvent()
	}
	// 右侧切换
	function bindRight() {
		price.value = 0;
		firstKey.value= 4
		getBrandlistEvent()
	}
	// 右侧切换
	function bindRight2() {
		price.value = 0;
		sotreParam.value.page = 1
		sotreParam.value.order = '',
		rightBox2.value = true
	}
	// 品牌列表
	function getBrandlistEvent() {
		let temp = []
		getBrandlist({
			cate_id: where.value.cate_id,
			keyword: where.value.keyword
		}).then(res => {
			temp = res.data.list.map(item => {
				return {
					...item,
					check: false
				}
			})
			if (where.value.brand_id.length > 0) {
				where.value.brand_id.forEach((ids, index) => {
					temp.forEach(el => {
						if (ids == el.brand_id) {
							el.check = true
						}
					})
				})
			}
			brandList.value = temp
			rightBox.value = true
		})
	}
	// 去详情页
	function godDetail(item) {
			
	   goShopDetail(item, uid.value).then(res => {
	   	if (isLogin.value) {
	   		initiateAssistApi(item.activity_id).then(res => {
	   			let id = res.data.product_assist_set_id;
	   			uni.hideLoading();
	   			uni.navigateTo({
	   				url: '/packages/mall/views/pages/activity/assist_detail/index?id=' + id
	   			});
	   		}).catch((err) => {
	   			uni.showToast({
	   				title: err,
	   				icon: 'none'
	   			})
	   		});
	   	} else {
	   		toLogin()
	   	}
	   })
	}
	// 组件确定
	function confirm(data,index) {
		let arr = []
		if (data.brandList.length == 0) {
			where.value.brand_id = ''
		} else {
			data.brandList.forEach(item => {
				arr.push(item.brand_id)
			})
			where.value.brand_id = arr
		}
		activeIndex.value = index
		rightBox.value = data.status
		where.value.price_on = data.price_on
		where.value.price_off = data.price_off
		where.value.is_trader = data.is_trader
		loadend.value = false;
		where.value.page = 1
		get_product_list(true);
	}
	// 组件确定
	function confirm2(data) {
		let arr1 = [],arr2 = []
		if (data.storeTypeArr.length == 0) {
			sotreParam.value.type_id = ''
		} else {
			data.storeTypeArr.forEach(item => {
				arr1.push(item.mer_type_id)
			})
			sotreParam.value.type_id = arr1.toString();
		}
		if (data.merList.length == 0) {
			sotreParam.value.category_id = ''
		} else {
			data.merList.forEach(item => {
				arr2.push(item.merchant_category_id)
			})
			sotreParam.value.category_id = arr2.toString();
		}
		rightBox2.value = data.status
		loadend.value = false;
		sotreParam.value.page = 1;
		storeList.value = [];
		storeScroll.value = true
		storeMerchantListEvent();
	}
	// 组件关闭
	function close() {
		rightBox.value = false
		rightBox2.value = false
	}
	// 下拉选项
	function bindDown(item, index) {
		firstKey.value = 0
		if (index == 0) {
			where.value.order = ''
		} else if (index == 1) {
			where.value.order = 'rate'
		} else if (index == 2) {
			where.value.order = 'is_new'
		}
		downKey.value = index
		downStatus.value = false
	    loadend.value = false;
		where.value.page = 1
		get_product_list(true);
	}
	function Changswitch() {
		is_switch.value = !is_switch.value
		productList.value = [];
		c_waterfall_ref.value.change()
		nextTick(() => {
			productList.value = productListOrigin.value
		})
	}

	function searchSubmit(e) {
		if (!e.detail.value.trim()) {
			uni.showToast({
				title: '请输入搜索内容',
				icon: 'none',
				duration: 1000
			});
			return
		}
		where.value.keyword = e.detail.value
		if (tabIndex.value == 1) {
			loadend.value = false;
			where.value.page = 1
			get_product_list(true);
		} else {
			sotreParam.value.page = 1
			storeScroll.value = true
			storeList.value = []
			storeMerchantListEvent('search')
		}
	}
	 function inputChange(e) {
		where.value.keyword = e.detail.value
	 }
    	/**
     * 获取我的推荐
     */
	 function get_host_product () {
		if (hotScroll.value) return
		getProductHot(hotPage.value,hotLimit.value).then(res => {
			hotPage.value++
			hotScroll.value = res.data.list.length < hotLimit.value
			hostProduct.value = hostProduct.value.concat(res.data.list)
		});
	  }
	//点击事件处理
	function set_where (e) {
	    downStatus.value = false
	    switch (e) {
	    	case 1:
	    		uni.navigateBack()
	    		break
	    	case 2:
	    		firstKey.value = e
				sales.value = 0;
	    		if (price.value == 0) {
	    			price.value = 1;
	    			where.value.order = 'price_asc'
	    		} else if (price.value == 1) {
	    			price.value = 2;
	    			where.value.order = 'price_desc'
	    		} else if (price.value == 2) {
	    			price.value = 0;
	    			where.value.order = ''
	    		}
				where.value.page = 1
	    		get_product_list(true);
	    		break;
	    	case 3:
	    		price.value = 0;
	    		loadend.value = false;
				firstKey.value = e
	    		if (sales.value == 0) {
	    			sales.value = 1;
	    			where.value.order = 'sales_asc'
	    		} else if (sales.value == 1) {
	    			sales.value = 2;
	    			where.value.order = 'sales_desc'
	    		} else if (sales.value == 2) {
	    			sales.value = 0;
	    			where.value.order = ''
	    		}
				where.value.page = 1
	    		get_product_list(true);
	    		firstKey.value = e
	    		break;
	    }
	    loadend.value = false;
	    where.value.page = 1
	    get_product_list(true);
	}
	//查找产品
	function get_product_list (isPage) {
		if (loadend.value) return;
		if (loading.value) return;
		if (isPage === true) productList.value = []
		loading.value = true;
		loadTitle.value = '';
		homeApi.getMallSpuLst(where.value).then(res => {
			let list = res.data.list;
			let productLists = util.SplitArray(list, productList.value);
			let loadends = list.length < where.value.limit;
			loadend.value = loadends;
			loading.value = false;
			loadTitle.value = loadend ? '已全部加载' : '加载更多';
			productListOrigin.value = _.cloneDeep(productLists);
			setTimeout(() => {
				if (isPage === true) {
					productList.value = []
					c_waterfall_ref.value.change()
				}
				nextTick(() => {
					productList.value = productLists
				})
			},50)
            where.value.page+=1
		}).catch(err => {
			console.log(err)
			loading.value = false;
			loadTitle.value = '加载更多';
		});
	}
	function goStore (id) {
		console.log(9999);
		if (hide_mer_status.value != 1) {
			uni.navigateTo({
				url: `/views/pages/home/store?mer_id=${id}`
			})
		}
	}
	function goStage_ (item) {
		// 跳转驿站
		uni.navigateTo({
			url: `/packages/mall/views/pages/users/post-station/shop?id=${item.welfare_post.mer_id}&welfare_post_id=${item.welfare_post.id}`,
		});
	}
    
	onReachBottom(()=>{
	  if (tabIndex.value == 1) {
	     if (productList.value.length > 0) {
	     	 get_product_list(false);
	     } else {
	        // get_host_product();
	     }
	  } else {
		if (count.value === storeList.value.length) {
		    if (count.value === 0) {
		    	return
		    }
		    uni.showToast({
		    	title: '已加载全部',
		    	icon: 'none',
		    	duration: 1000
		    });
		} else {
		   sotreParam.value.page += 1
		   storeMerchantListEvent()
		}
	 }
	})

	onPullDownRefresh(()=>{
	  setTimeout(()=>{
		const newList = productList.value.reverse();
		productList.value = newList;
		uni.stopPullDownRefresh();
	  },500)
	})
	
	// 商品排序方式字段样式
	function changeSortClass(name, type) {
		switch (type) {
			case 1:
				return 'up';
			case 2:
				return 'down';
			default:
				return '';
		}
	}
	// 更新自动调价商品
    uni.$on('changeAutoPro',(res)=>{
       console.log('最新价格',res)
       productList.value.forEach((item)=>{
           if(item.product_id == res.product_id){
              item.price = res.price
           }
       })
    })

</script>

<style lang="scss" scoped>
.exchange-text{
	font-size: 20rpx;
	margin-left: 16rpx;
	font-weight: 400;
	color: #111;
}
.contribute_txt{
	color: var(--view-priceColor);
	font-size: 24rpx;
	font-weight: 400;
}
	.b-color {
		background-color: var(--view-bgColor)!important;
		border: 1px solid var(--view-bgColor)!important;
	}
	.productList .search {
		width: 100%;
		height: 86rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: var(--window-top);
		/* #endif */
		z-index: 9;
		background-color: var(--view-bgColor);
		.icon-dingwei {
			color: #fff;
			font-weight: 0;
			font-size: 40rpx;
			line-height: 86rpx;
			width: 62rpx;
		}
	}
	.productList .search .back {
		display: flex;
		align-items: center;
		width: 40rpx;
		height: 60rpx;
		.iconfont {
			color: #fff;
			font-size: 36rpx;
		}
	}
	.productList .search .input {
		flex: 1;
		height: 60rpx;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.productList .search .input input {
		flex: 1;
		height: 100%;
		font-size: 26rpx;
		margin-left: 10rpx;
	}
	.productList .search .input .placeholder {
		color: #999;
	}
	.productList .search .input .iconfont {
		font-size: 35rpx;
		color: #555;
	}
	.productList .search .icon-pailie,
	.productList .search .icon-tupianpailie,
	.productList .search .iconempty {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
	}
	.productList .nav-wrapper {
		z-index: 9;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		margin-top: 86rpx;
		/* #ifdef H5 */
		margin-top: calc( var(--window-top) + 86rpx );
		/* #endif */
		background-color: var(--view-bgColor);
		.tab-bar {
			display: flex;
			align-items: center;
			.tab-item {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8rpx 0 20rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;
				&::after {
					content: ' ';
					position: absolute;
					left: 50%;
					bottom: 18rpx;
					width: 30rpx;
					height: 3rpx;
					background: transparent;
					transform: translateX(-50%);
				}
				&.on {
					&::after {
						background: #fff;
					}
				}
			}
		}
	}
	.productList .nav {
		height: 86rpx;
		color: #454545;
		font-size: 28rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 0 28rpx;
	}
	.productList .nav .item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		font-size: 26rpx;
	}
	.productList .nav .item .sort_img {
		width: 28rpx;
		height: 28rpx;
		margin-left: 4rpx;
		&.up {
			transform: rotate(0deg);
		}
		&.down {
			transform: rotate(180deg);
		}
	}
	.t-color {
		color: var(--view-bgColor);
		color: #454545;
	}
	.productList .nav .item.t-color {
		font-weight: bold;
		color: #454545;
	}
	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}
	.productList .list {
		padding: 0 20rpx;
	}
	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
	}
	.productList .list .item {
		position: relative;
		width: 345rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		.name{
			display: flex;
			align-items: center;		
			.name_text{
				// max-width: 420rpx;
			}
		}
	}
	.productList .list .item.on {
		width: 100%;
		display: flex;
		padding: 30rpx 0;
		margin: 0;
	}
	.productList .list .item .pictrue {
		position: relative;
		width: 100%;
		height: 345rpx;
	}
	.productList .list .item .pictrue.on {
		width: 260rpx;
		height: 260rpx;
		.sell_out {
			display: flex;
			width: 110rpx;
			height: 110rpx;
			align-items: center;
			justify-content: center;
			border-radius: 100%;
			background: rgba(0,0,0,.6);
			color: #fff;
			font-size: 24rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			margin: -55rpx 0 0 -55rpx;
			&::before{
				content: "";
				display: block;
				width: 100rpx;
				height: 100rpx;
				border-radius: 100%;
				border: 1px dashed #fff;
				position: absolute;
				top: 5rpx;
				left: 5rpx;
			}
		}
		.border-picture {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 16rpx;
			background: center/cover no-repeat;
		}
	}
	.productList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}
	.productList .list .item .pictrue image.on {
		border-radius: 16rpx;
		width: 260rpx;
		height: 260rpx;
	}
	.productList .list .item .text {
		padding: 20rpx 17rpx 26rpx 17rpx;
		font-size: 30rpx;
		color: #222;
	}
	.productList .list .item .text.on {
		width: 508rpx;
		padding: 0 0 0 22rpx;
		justify-content: space-between;
		.font-bg-red{
			max-width: 120rpx;
		}
		.bt-color {
			background-color: var(--view-bgColor);
			&.type2{
				background-color: #FD6523;
			}
		}
		.name,.item_bot{
			width: 100%;
		}
		.vip-money {
			color: #282828;
			font-size: 22rpx;
			margin-left: 6rpx;
			font-weight: bold;
		}
		.vipImg {
			width: 65rpx;
			height: 28rpx;
			margin-left: 4rpx;
			image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
		.item_bot{
			position: relative;
			&::after{
				content: '';
				display: block;
				width: 100%;
				border-bottom: 1px solid #f6f6f6;
				position: absolute;
				right: 20rpx;
				bottom: -30rpx;
			}
		}
	}
	.productList .list .item .text .money {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: bold;
		color: var(--view-bgColor);
	}
	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}
	.productList .distance {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999999;
		.icon-xiangyou {
			font-size: 24rpx;
			line-height: 24rpx;
		}
	}
	.productList .list .item .text .money .ticket {
		margin-left: 10rpx;
		padding: 0 5rpx;
		font-weight: initial;
		font-size: 20rpx;
		border: 1px solid var(--view-bgColor);
		border-radius: 4rpx;
	}
	.productList .list .item .item_tags{
		margin-top: 8rpx;
	}
	.productList .list .item .item_tags .tags_item {
		display: inline-block;
		font-size: 20rpx;
		text-align: center;
		border-radius: 5rpx;
		padding: 0 4rpx;
		line-height: 28rpx;
		margin-right:8rpx;
	}
	.productList .list .item .item_tags .tags_item.ticket{
		color: var(--view-bgColor);
		border: 1px solid var(--view-bgColor);
	}
	.item_tags .tags_item.delivery{
		color: #FF9000;
		border: 1px solid #FF9000;
	}
	.productList .list .item .text .score {
		margin-top: 10rpx;
		color: #737373;
		font-size: 20rpx;
	}
	.productList .list .item .text .company {
		display: flex;
		align-items: center;
		color: #737373;
		font-size: 20rpx;
		margin-top: 10rpx;
		// width: 300rpx;
		.name {
			display: inline-block;
			width: auto;
			max-width: 200rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			
		}
		.flex {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
			color: #282828;
			width: 100rpx;
			.iconfont {
				font-size: 16rpx;
				margin-top: 4rpx;
			}
		}
	}
	.productList .list .item .foot-bar {
		width: 100%;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: linear-gradient(-90deg, var(--view-bgColor) 0%, var(--view-bgColor) 100%);
		border-radius: 0px 0px 16rpx 16rpx;
		color: #fff;
		font-size: 24rpx;
		.icon-fenxiang {
			font-size: 24rpx;
			margin-right: 10rpx;
		}
		&.on {
			position: absolute;
			right: 0;
			bottom: 30rpx;
			width: 200rpx;
			height: 44rpx;
			border-radius: 22rpx;
		}
	}
	.noCommodity {
		background-color: #fff;
		.pictrue {
			height: 420rpx;
			// color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 336rpx;
			}
		}
	}
	.no-shop {
		margin-top: 240rpx;
		background-color: #fff;
		padding-bottom: calc(100% - 109rpx);
		.pictrue {
			display: flex;
			flex-direction: column;
			align-items: center;
			// color: $uni-nothing-text;
			image {
				width: 414rpx;
				height: 336rpx;
			}
		}
	}
	.spin {
		display: block;
		transform: rotate(180deg);
		font-size: 36rpx;
	}
	.icon-xiala1 {
		margin-top: 6rpx;
	}
	.icon-shaixuan {
		font-size: 30rpx;
		margin-left: 10rpx;
	}
	.down-wrapper {
		.bg {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
		}
		.down-box {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 238rpx;
			width: 100%;
			padding: 0 40rpx 28rpx 74rpx;
			background-color: #F8F8F8;
			border-radius: 0 0 24rpx 24rpx;
			.down-item {
				margin-top: 28rpx;
				font-size: 24rpx;
				color: #454545;
				&.on {
					color: var(--view-bgColor);
				}
				.iconfont{
					float: right;
				}
			}
		}
	}
	.store-wrapper {
		margin-top: 240rpx;
		border-top: 1px solid #F6F6F6;
		.star-box {
			display: flex;
			align-items: center;
			.line {
				width: 2rpx;
				height: 20rpx;
				background: #BFBFBF;
				margin: 0 12rpx;
			}
			.star {
				position: relative;
				width: 111rpx;
				height: 19rpx;
				background: url(~pages/columnGoods/images/star.png);
				background-size: 111rpx 19rpx;
			}
			.star-active {
				position: absolute;
				left: 0;
				top: 0;
				width: 111rpx;
				height: 19rpx;
				overflow: hidden;
				background: url(~pages/columnGoods/images/star_active.png);
				background-size: 111rpx 19rpx;
			}
			.num {
				color: var(--view-bgColor);
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}
		.store-item {
			margin-bottom: 12rpx;
			padding: 40rpx 20rpx;
			background-color: #fff;
			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left-wrapper {
					display: flex;
					align-items: center;
					.logo {
						width: 80rpx;
						height: 80rpx;
						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 6rpx;
						}
					}
					.con-box {
						margin-left: 20rpx;
						.font-bg-red {
							width: max-content;
							white-space: nowrap;
							margin-left: 20rpx;
							font-size: 18rpx;
							padding: 2rpx 10rpx;
							color: #FFFFFF;
							background-color: #E93323;
							border-radius: 13rpx;
						}
						.name {
							font-size: 30rpx;
							color: #333;
							font-weight: bold;
							margin-bottom: 10rpx;
							.store-margin{
								width: 28rpx;
								height: 30rpx;
								margin-left: 10rpx;
							}
							.mer_name{
								max-width: 360rpx;
							}
						}
					}
				}
				.link {
					width: 114rpx;
					height: 50rpx;
					line-height: 50rpx;
					background-image: linear-gradient(-90deg, var(--view-bgColor) 0%, var(--view-bgColor) 100%);
					border-radius: 25rpx;
					text-align: center;
					color: #fff;
					font-size: 24rpx;
				}
			}
			.pic-wrapper {
				display: flex;
				margin-top: 30rpx;
				.pic-item {
					position: relative;
					width: 226rpx;
					height: 226rpx;
					margin-right: 16rpx;
					image {
						width: 226rpx;
						height: 226rpx;
						border-radius: 16rpx;
					}
					.price {
						position: absolute;
						right: 0;
						bottom: 0;
						height: 36rpx;
						padding: 0 10rpx;
						line-height: 36rpx;
						text-align: center;
						background: rgba(0, 0, 0, .5);
						border-radius: 16rpx 2rpx 16rpx 2rpx;
						color: #fff;
						font-size: 24rpx;
						text {
							font-size: 18rpx;
						}
					}
					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
