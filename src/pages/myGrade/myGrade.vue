<template>
	<view>
		学生个人信息页
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		ref
	} from '@vue/runtime-core';


	const userInfo = ref({})

	onLoad((option) => {
		// 获取页面跳转传来的参数
		userInfo.value = JSON.parse(option.userInfo)
		// 设置当前页面的导航栏
		uni.setNavigationBarTitle({
			title: userInfo.value.userName + '的主页'
		});
	})
</script>

<style lang="less">

</style>