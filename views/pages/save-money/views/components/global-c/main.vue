<template>
	<view :style="{height:hei+'px', ...props.styles }" :class="`g-main ${props.classs}`">
		  <slot></slot>
		  <!-- 分享弹框 -->
		  <uni-popup ref="popupShear" type="bottom" @maskClick="close" :safe-area="false" background-color="#fff" :animation="false" class="uni-popup">
			  <shrea @close_shear="close_shear"/>
		  </uni-popup>
	</view>
</template>

<script setup>
	import { ref, computed, watch } from "vue";
	import { onLoad, onShow, onReady, onInit, onHide, onBackPress, onUnload } from "@dcloudio/uni-app";
	import shrea from "@/views/pages/home/components/shrea.vue";
	const hei = uni.getSystemInfoSync().windowHeight ;
	const props = defineProps({
	  classs: {
	    type: String,
	    default: "",
	  },
	  styles: {
        type: Object,
        default: () => ({}),
      },
	});

	const popupShear = ref()

	const show_share = ref(false)

	const close_shear = () => {
		show_share.value = false;
		popupShear.value && popupShear.value.close();
	};
	// 打开分享
	const open_shear = () => {
		if (uni.getStorageSync("isLogin")) {
			show_share.value = true
			popupShear.value && popupShear.value.open("bottom");
			// let timeName = setTimeout(() => {
			// 	uni.hideTabBar();
			// 	clearTimeout(timeName);
			// }, 0);
			uni.hideTabBar();
		} else {
			uni.navigateTo({
				url: "/views/pages/mine/login?isHome=true",
			});
		}
	};

	uni.$on("open_shear", function (data) {
		open_shear();
	});

	uni.$on("close_shear", function (data) {
		close_shear();
	});


   const close=()=>{
	uni.$emit("close_shear",{mas:""})
   }

   onBackPress(() => {
	close()
   });

   onUnload(() => {
	close()
   });

</script>

<style lang="less" scoped>
	.g-main{
		overflow: hidden;
		width:750rpx;
		&.bg-f8 {
			background-color: #f8f8f8;
		}
		&.flex {
			display: flex;
			flex-direction: column;
		}
		&.flex-ac{
			align-items: center;
		}
		&.bf-a5{
				background-color: #FFDBA5;
		}
		&.bf-FEE8C9{
			background-color: #FEE8C9;
		}
		&.bg-c9 {
			background-color: #FEE8C9;
		}
		&.bg-C9EAEF {
			background-color: #C9EAEF;
		}
	}
</style>