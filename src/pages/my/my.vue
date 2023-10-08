<template>
	<view class="body clearfix">
		<view class="userInfo clearfix">
			<view class="userInfoTop">
				<image class="userPic" mode="aspectFill" src="../../static/logo.png"></image>
				<view class="nameBox">
					<view class="name">钉小帅</view>
					<view class="classRoom">班级：23-1</view>
				</view>

			</view>
			<view class="userInfoBottom">
				<view class="position">职位：班主任</view>
				<view class="stuNum">学号：21</view>
			</view>

		</view>
		<view class="tools">
			<view class="tool" @tap="toGrade">
				<view class="imgBox">
					<image mode="aspectFill" src="../../static/grade.png"></image>
				</view>
				<view>我的成绩</view>
			</view>
			<view class="tool">
				<view class="imgBox">
					<image mode="aspectFill" src="../../static/grade.png"></image>
				</view>
				<view>全部成绩</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from '@vue/runtime-core';
	const userInfo = ref({
		userId: 1563,
		userName: '李四'
	})
	const toGrade = () => {
		uni.navigateTo({
			url: `/pages/myGrade/myGrade?userInfo=${JSON.stringify(userInfo.value)}`
		})
	}
</script>

<style lang="less">
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
		background-image: linear-gradient(to bottom, #D0D5FC, #FCFFFF);

		.userInfo {
			padding-left: 40rpx;
			margin: 120rpx auto 40rpx;
			width: 680rpx;
			height: 250rpx;
			background-color: #FFF;
			border-radius: 15rpx;
			font-size: 14px;
			box-sizing: border-box;

			.userInfoTop {
				display: flex;
				justify-content: left;
				margin: -36rpx 0 0 0;

				.userPic {
					width: 140rpx;
					height: 140rpx;
					border-radius: 25rpx;
				}

				.nameBox {
					margin: 46rpx 0 0 40rpx;

					.name {
						font-size: 16px;
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
			font-size: 14px;
			box-sizing: border-box;

			.tool {
				margin-right: 40rpx;

				.imgBox {
					margin: 0 auto;
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