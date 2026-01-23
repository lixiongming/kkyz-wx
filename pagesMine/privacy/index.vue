<template>
	<view class="content">
		<uv-parse
          :content="content"
          :tagStyle="tagStyle"
        ></uv-parse>
	</view>
</template>

<script setup>
	import { ref, onMounted} from 'vue'
	import { mineApi } from "@/business/api/index.ts";

	const tagStyle = ref({
		img: 'width:100%;display:block;',
		table: 'width:100%',
		video: 'width:100%'
	})
	const content = ref(``)

	onMounted(() => {
		mineApi.getUserAgreeApi().then(res => {
			content.value = res.data.sys_user_agree
		})
	})
</script>

<style scoped>
	.content {
		padding: 40rpx 30rpx;
		line-height: 2;
	}
</style>