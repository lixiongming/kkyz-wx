<template>
	<view class="home-header">
		<u-navbar :title="props.title" @rightClick="rightClick" :autoBack="true">
			<slot name="left"></slot>
			<template #right>
				<slot name="right"></slot>
			</template>
		</u-navbar>
	</view>
</template>
<script setup lang="ts">
	import { ref, defineProps, watch, computed, useSlots } from "vue";

	const props = defineProps({
		show: {
			type: Boolean,
			default: true,
		},
		title: {
			type: String,
			default: "",
		},
		otherBackground: {
			type: String,
			default: "",
		},
	});

	const rightClick = () => {
		console.log('rightClick');
	};
</script>

<style lang="less" scoped>
	.home-header {
		height: 88rpx;
	}
</style>