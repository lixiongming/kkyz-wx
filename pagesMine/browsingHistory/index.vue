<template>
	<view class="page-wrapper history" :style="localViewColor">
		<view class="history_count">
			<block v-if="list.length>0">
				<view class="history_header acea-row">
					<text>共{{total}}条</text>
					<view class="text" @click.stop="handleEdit">{{isEdit ? '完成' : '管理'}}</view>				
				</view>
				<view class="list" v-for="(item,index) in list">
					<view class="item_time">
						<view v-if="isEdit" class="checkbox" :class="item.allCheck ? 'check_ac' : ''" @click="historyAllCheck(item,index)">
							<image class="img_gou" :src="imgUrl + '/user/gou.png'" alt=""></image>
						</view>
						<view>{{item.date}}</view>
					</view>
					<view class="item_main acea-row">
						<view class="item acea-row" :class="{gary :(itemn.spu && itemn.spu.status ==1) }" v-for="(itemn,indexn) in item.list" :key="indexn">
							<view v-if="isEdit" class="item item_count" @click="historyCheck(itemn,indexn)">
								<view  class="checkbox" :class="itemn.check ? 'check_ac' : ''">
									<image class="img_gou" :src="imgUrl + '/user/gou.png'" alt=""></image>
								</view>
								<easy-loadimage class="easy-img" mode="widthFix" :image-src="itemn.spu?.image"></easy-loadimage>
								<view class="info">
									<view class="msg">
										<block v-if="itemn.spu?.status == 1">
											<view class="price"><text class="p_txt">￥</text>{{itemn.spu?.price}}</view>
										</block>
										<block v-else>
											<view class="tips">该商品已下架</view>
										</block>
									</view>
								</view>
							</view>			
							<view v-else class="item item_count" @click="goPage(itemn)" >
								<easy-loadimage class="easy-img" mode="widthFix" :image-src="itemn.spu?.image"></easy-loadimage>
								<view class="info">
									<view class="msg">
										<block v-if="itemn.spu && itemn.spu.status == 1">
											<view class="price"><text class="p_txt">￥</text>{{itemn.spu?.price}}</view>
										</block>
										<block v-else>
											<view class="tips">该商品已下架</view>
										</block>
									</view>
								</view>
							</view>			
						</view>
					</view>			
				</view>
			</block>
			<block v-else>
				<emptyPage title="暂无浏览记录~"></emptyPage>
			</block>
		</view>
		<view class='footer acea-row row-between-wrapper' v-if="isEdit">
			<view class="allcheck_wrap">
				<view class="checkbox" :class="isAllSelect ? 'check_ac' : ''" @click.stop="checkboxAllChange">
					<image class="img_gou" :src="imgUrl + '/user/gou.png'" alt=""></image>
				</view>
				<view class="allcheckbox">全选</view>
			</view>
			<view class='acea-row row-between-wrapper'>
				<!-- <view class='button acea-row row-middle' style="margin-right: 20rpx;">
					<form @submit="subCollect" report-submit='true'>
						<button class='bnt collect_btn' formType="submit">收藏</button>
					</form>
				</view> -->
				<view class='button acea-row row-middle'>
					<form @submit="subDel('batch')" report-submit='true'>
						<button class='bnt delete_btn' formType="submit">删除</button>
					</form>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad, onUnload,onReady,onShow,onReachBottom,onPageScroll} from "@dcloudio/uni-app";
import emptyPage from '@/components/emptyPage.vue'
// import { historyList, historyDelete, historyBatchDelete, historyBatchCollect } from '@/business/api/modules/user-old.ts'
import { historyList, historyBatchDelete } from '@/business/api/modules/user.ts'
import { goShopDetail } from '@/infrastructure/libs/order.js'
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import { IAMGES_URL } from "@/infrastructure/config/app.js";
import store from '@/business/store/modules/mall.ts';
const Store = store()
const title = ref('浏览记录');
const imgUrl = ref(IAMGES_URL);
const list = ref([]);
const isScroll = ref(true);
const page = ref(1);
const limit = ref(50);
const isAllSelect = ref(false);
const isEdit = ref(false);
const allArr = ref([]);
const total = ref(0);
const localViewColor = computed(()=>{
	return Store.localViewColor
})

onShow(()=>{
	list.value = [];
	allArr.value = [];
	isScroll.value = true;
	page.value = 1;
	getList();
	isAllSelect.value = false; 
	isEdit.value = false;
})

function getList(){
	historyList({
		page:page.value,
		pageSize:limit.value
	}).then(({data})=>{
		total.value = data.pageInfo.total
		if(!data.items) return ;
		data.items.forEach((item, index) => {
			item.check = false
		})
		isScroll.value = data.items.length>=limit.value					
		page.value+=1					
		list.value = list.value.concat(data.items)
		listFilter()
	})
}

// 数据结构重组
function listFilter(){
	list.value.forEach((item,index)=>{
		if(!item.allCheck){
			list.value[index]['allCheck'] = false;
		}
		item.list.forEach((itemn,indexn)=>{
			if(!itemn.check){
				list.value[index]['list'][indexn]['check'] = false
			}
		})
	})
	if(isAllSelect.value){cartAllCheck('allCheck')}
}

// 全选
function checkboxAllChange() {
	isAllSelect.value = !isAllSelect.value;
	cartAllCheck('allCheck')
}

function handleEdit(){
	isEdit.value = !isEdit.value;
}

// 商品选中
function historyCheck(item) {
	item.check = !item.check
	cartAllCheck('goodsCheck')
}

// 删除
function subDel(type) {
	let type_id
	let content = (type == 'empty') ? '确定清空浏览记录？' : '确定删除浏览记录？'
	if(type == 'batch'){
		type_id = []
		list.value.forEach(item=>{
			item.list.forEach(el=>{
				if(el.check){
					type_id.push(el.user_history_id)
				}
			})
			
		})
	}else{
		type_id = 1
	}
	if(type_id.length == 0 && type == 'batch'){
		return uni.showToast({
			title: '请选择记录',
			icon: 'none'
		})
	}else{
		uni.showModal({
			title: '提示',
			content: content,
			success: function (res) {
				if (res.confirm) {							
					historyBatchDelete({
						history_ids:type_id,						
					}).then(res=>{
						allArr.value = [];
						page.value = 1;
						list.value = [];
						isEdit.value = false;
						isScroll.value = true;
						getList();
						return uni.showToast({
							title: res.message,
							icon: 'none'
						})			
						}).catch(err => {
							return uni.showToast({
								title: err,
								icon: 'none'
							})					
						});  
				}else if (res.cancel) {
					return uni.showToast({
						title: '已取消',
						icon: 'none'
					})
				}							 					     	    				     	 					        
			}   
		});                          					
	}
}

function subCollect(){
	let type_id = []
	list.value.forEach(item=>{
		item.list.forEach(el=>{
			if(el.check){
				type_id.push(el.spu.spu_id)
			}
		})
	})
	historyBatchCollect({
		type_id:type_id,
		type: 1						
	}).then(res=>{
		allArr.value = [];
		page.value = 1;
		list.value = [];
		isEdit.value = false;
		isScroll.value = true;
		isAllSelect.value = false;
		getList();
		return uni.showToast({
			title: res.message,
			icon: 'none'
		})							
	}).catch(err => {
		return uni.showToast({
			title: err,
			icon: 'none'
		})							
	});  
}

// 商铺全选
function historyAllCheck(item, index) {
	// 店铺取消
	if (item.allCheck) {
		item.allCheck = false
		item.list.forEach((el, i) => {
			el.check = false
		})
	} else {
		item.allCheck = true
		item.list.forEach((el, i) => {
			el.check = true
		})
	}
	cartAllCheck('goodsCheck')
}

function goPage(item){
	goShopDetail(item.spu).then(res => {
		uni.navigateTo({
			url:`/pagesProduct/goods_details/index?id=${item.spu.product_id}`
		})
	})
}

// 全选判断
function cartAllCheck(type) {
	let allArr = [];
	list.value.forEach((el, index) => {
		if (type == 'goodsCheck') {
			let tempArr = el.list.filter(item => {
				return item.check == true
			})
			if (el.list.length == tempArr.length) {
				el.allCheck = true
				allArr.push(el)
			} else {
				el.allCheck = false
			}
		} else {
			el.list.forEach((item) => {
				item.check = isAllSelect.value
			})
			el.allCheck = isAllSelect.value
			if (el.allCheck) allArr.push(el)
		}					
	})
	// 全选
	isAllSelect.value = allArr.length == list.value.length ? true : false
}

onReachBottom(()=>{
	getList()
})

// 滚动监听
onPageScroll((e)=>{
	uni.$emit('scroll');
})
</script>

<style lang="less" scoped>
page{background: #ffffff;}
.history{
	margin-bottom: 96rpx;
	.history_count{
		padding: 0 30rpx 0;
	}
	.history_header{
		justify-content: space-between;
		margin: 30rpx 0;
		font-size: 24rpx;
		text{
			color: var(--view-noSelectColor);
		}
		.text{
			color: var(--view-bgColor);
		}
	}
	.list{
		margin-top: 20rpx;
		.item_time{
			font-size: 32rpx;
			color: var(--view-assist);
			font-weight: 600;
			display: flex;
			align-items: center;
		}
		.item_main{
			margin-top: 30rpx;
		}
	}
	.item{
		width: 215rpx;
		border-radius: 16rpx;
		margin: 0 20rpx 20rpx 0;
		position: relative;
		&:nth-child(3n){
			margin-right: 0;
			.item{
				margin: 0 0 20rpx 0;
			}
		}
		/deep/image,/deep/.easy-loadimage,uni-image{
			width: 217rpx;
			height: 217rpx;
			border-radius: 8rpx;
		}
		.info{
			margin-top: 20rpx;
			color: var(--view-priceColor);
			font-size: 28rpx;
			font-weight: 600;
			.p_txt {
				font-size: 20rpx;
				font-weight: 600;
				padding-right: 4rpx;
			}
		}
	}
}
/deep/.loadfail-img, .easy-img{
	width: 217rpx;
	height: 217rpx;
	border-radius: 16rpx;
	display: block;
}
.item_time .checkbox .iconfont{
	font-size: 38rpx;
	color: #999999;
	margin-right: 10rpx;
	&.icon-xuanzhong1{
	    color: var(--view-theme);
	}
}
.item_time .checkbox {
	width: 36rpx;
	height: 36rpx;
	background-color: #fff;
	border: 2rpx solid #ccc; 
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 16rpx;
	&.check_ac {
		background-color: var(--view-theme);
		border: none; 
	}
	.img_gou {
		width: 30rpx;
        height: 30rpx;
	}
}
.item_main .checkbox {
	position: absolute;
	right: 16rpx;
	top: 16rpx;
	z-index: 10;
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	&.check_ac {
		background-color: var(--view-theme);
	}
	.img_gou {
		width: 30rpx;
        height: 30rpx;
	}
}
.allcheck_wrap {
	display: flex;
	align-items: center;
	.checkbox {
		width: 36rpx;
		height: 36rpx;
		background-color: #fff;
		border: 2rpx solid #ccc; 
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 24rpx;
		&.check_ac {
			background-color: var(--view-theme);
			border: none; 
		}
		.img_gou {
			width: 30rpx;
			height: 30rpx;
		}
	}
}
.item_main .checkbox .iconfont{
	font-size: 40rpx;
	color: #DEDEDE;
	border-radius: 100%;
}
.history .item .icon-xuanzhong1{
	color: var(--view-theme);
}
.history .footer {
	z-index: 99;
	width: 100%;
	height: 100rpx;
	height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
	height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	background-color: #ffffff;
	position: fixed;
	padding: 0 20rpx;
	box-sizing: border-box;
	border-top: 1px solid #eee;
	bottom: var(--window-bottom);
}
.area-edit{
	justify-content: center;
	.area-item{
		width: 50%;
		text-align: center;
		position: relative;	
		align-items: center;
		color: #333333;
		.text{
			position: relative;
			top: -1px;
		}
		.iconfont{
			color: #333333;
		}
		&:nth-child(1){
			&::after{
				content: '';
				display: inline-block;
				width: 2rpx;
				height: 42rpx;
				background: #CCCCCC;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}
}
.history .footer .checkAll {
	font-size: 28rpx;
	color: #282828;
	margin-left: 16rpx;
}
.allcheckbox .iconfont{
	margin-right: 11px;
	font-size: 40rpx;
	color: #cccccc;
}
.allcheckbox .icon-xuanzhong1{
	color: var(--view-theme);
}
.history .footer .button .bnt {
	font-size: 28rpx;
	color: var(--view-theme);
	border-radius: 50rpx;
	border: 1px solid var(--view-theme);
	width: 160rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
	&.collect_btn{
		color: var(--view-bgColor);
		border-color: var(--view-bgColore);
	}
}
	
</style>
