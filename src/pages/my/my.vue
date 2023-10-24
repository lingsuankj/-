<template>
	<view class="body clearfix">
		<view class="userInfo clearfix">
			<view class="userInfoTop">
				<image class="userPic" mode="aspectFill" src="../../static/logo.png"></image>
				<view class="nameBox">
					<view class="name">{{userInfo.name}}</view>
					<view class="classRoom">班级：23-1</view>
				</view>
			</view>
			<view class="userInfoBottom">
				<view class="position" v-if="userInfo.role_list">职位：{{userInfo.position}}</view>
				<view class="stuNum" v-if="userInfo.position === '学生'">学号：{{userInfo.name}}</view>
			</view>
		</view>
		<view class="tools">
			<view class="tool" @tap="toDetails" v-if="memberStore.userInfo.position === '学生'">
				<view class="imgBox">
					<image mode="aspectFill" src="../../static/images/grade.png"></image>
				</view>
				<view>我的成绩</view>
			</view>
			<view class="tool" @tap="toInquire" v-if="memberStore.userInfo.position !== '学生'">
				<view class="imgBox">
					<image mode="aspectFill" src="../../static/images/grade.png"></image>
				</view>
				<view>全部成绩</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue';
	import {
		loginAPI
	} from '@/utils/requests/my.js';
	import {
		useMemberStore
	} from '../../stores/modules/member.js'

	const memberStore = useMemberStore()

	const toDetails = () => {
		uni.navigateTo({
			url: `/pages/details/details?userInfo=${JSON.stringify({userId:userInfo.value.userid,userName:userInfo.value.name})}`
		})
	}
	const toInquire = () => {
		uni.navigateTo({
			url: `/pages/inquire/inquire?userInfo=${JSON.stringify({userId:userInfo.value.userid,userName:userInfo.value.name})}`
		})
	}

	const userInfo = ref({
		userId: 1563,
		userName: '李四'
	})
	// 获取用户信息接口
	const getUserData = async () => {
		const res = await loginAPI('hYLK98jkf0m')
		userInfo.value = res
		memberStore.userInfo = res
		memberStore.token = {
			access_token: res.access_token,
			expires_in: +new Date() + 2 * 60 * 60 * 1000
		}
	}

	onLoad(() => {
		getUserData()
	})
</script>

<style lang="scss">
	.clearfix::before,
	.clearfix::after {
		content: "";
		display: table;
	}

	.clearfix::after {
		clear: both;
	}

	.body {
		min-height: 100vh;
		background-color: #e0efec;
		// background-image: linear-gradient(to bottom, #D8F4F5, #FCFFFF);
		font-size: 28rpx;

		.userInfo {
			padding-left: 40rpx;
			padding-bottom: 16rpx;
			margin: 120rpx auto 40rpx;
			width: 680rpx;
			background-color: #FFF;
			border-radius: 15rpx;
			box-sizing: border-box;

			.userInfoTop {
				display: flex;
				justify-content: left;
				margin: -36rpx 0 0 0;

				.userPic {
					width: 130rpx;
					height: 130rpx;
					border-radius: 25rpx;
				}

				.nameBox {
					margin: 46rpx 0 0 40rpx;

					.name {
						font-size: 32rpx;
						font-weight: 700;
					}

					.classRoom {
						margin: 12rpx 0;
					}
				}
			}

			.userInfoBottom {

				.position,
				.stuNum {
					margin: 15rpx 0;
				}
			}
		}

		.tools {
			display: flex;
			justify-content: left;
			align-items: center;
			margin: 0 auto;
			padding-left: 40rpx;
			width: 680rpx;
			height: 160rpx;
			background-color: #FFF;
			border-radius: 15rpx;
			box-sizing: border-box;

			.tool {
				margin-right: 40rpx;

				.imgBox {
					margin: 0 auto 3rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 80rpx;
					height: 80rpx;
					background-color: #54BBBC;
					border-radius: 24rpx;

					image {
						width: 60%;
						height: 60%;
					}
				}
			}
		}
	}
</style>