<template>
	<view class="body">
		<view class="datetimeBox">
			<uni-datetime-picker v-model="range" type="daterange" :border="false" :clear-icon="false"
				@maskClick="maskClick" />
		</view>
		<!-- 本次统计-饼状图 -->
		<view class="ringBox">
			<view class="title">
				<text class="titleLeft">本次统计</text>
				<text class="titleRight">85次</text>
			</view>
			<view class="ring">
				<qiun-data-charts type="ring" :opts="optsRing" :chartData="chartDataRing" />
			</view>
		</view>

		<!-- 正确率-折线图 -->
		<view class="ringBox">
			<view class="title">
				<text class="titleLeft">正确率</text>
			</view>
			<view class="ring">
				<qiun-data-charts type="area" :opts="optsArea" :chartData="chartDataArea" />
			</view>
		</view>




	</view>
</template>

<script setup>
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue';

	const userInfo = ref({})
	// 日期
	const range = ref(['2021-02-1', '2021-3-28'])

	// 日期点击事件
	const maskClick = (e) => {
		console.log('maskClick事件:', e);
	}

	const chartDataRing = ref({})
	const chartDataArea = ref({})
	const optsRing = {
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [5, 5, 5, 5],
		enableScroll: false,
		title: {
			name: "",
			fontSize: 15,
			color: "#666666"
		},
		subtitle: {
			name: "",
			fontSize: 25,
			color: "#7cb5ec"
		},
		extra: {
			ring: {
				ringWidth: 30,
				activeOpacity: 0.5,
				activeRadius: 10,
				offsetAngle: 0,
				labelWidth: 15,
				border: true,
				borderWidth: 2,
				borderColor: "#FFFFFF",
				centerColor: "#F8F8F8"
			}
		},
		legend: {
			show: false
		}
	}
	const optsArea = {
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [15, 15, 0, 15],
		enableScroll: false,
		legend: {
			show: false
		},
		xAxis: {
			disableGrid: true
		},
		yAxis: {
			gridType: "dash",
			dashLength: 2
		},
		extra: {
			area: {
				type: "straight",
				opacity: 0.2,
				addLine: true,
				width: 2,
				gradient: false,
				activeType: "hollow"
			}
		}
	}
	const getServerDataRing = () => {
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let res = {
				series: [{
					data: [{
						"name": "语文",
						"value": 50,
						"labelText": "四班:18"
					}, {
						"name": "数学",
						"value": 30,
						"labelText": "数学:30"
					}, {
						"name": "英语",
						"value": 20,
						"labelText": "英语:20"
					}, {
						"name": "物理",
						"value": 18,
						"labelText": "物理:18"
					}, {
						"name": "化学",
						"value": 8,
						"labelText": "四班:18"
					}]
				}]
			};
			chartDataRing.value = JSON.parse(JSON.stringify(res));
		}, 500);
	}
	const getServerDataArea = () => {
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let res = {
				categories: ["语文", "数学", "英语", "2021", "2022", "2023"],
				series: [{
					name: "成交量A",
					data: [35, 8, 25, 37, 4, 20]
				}]
			};
			chartDataArea.value = JSON.parse(JSON.stringify(res));
		}, 500);
	}

	onLoad((option) => {
		// 获取页面跳转传来的参数
		userInfo.value = JSON.parse(option.userInfo)
		// 设置当前页面的导航栏
		uni.setNavigationBarTitle({
			title: userInfo.value.userName + '的主页'
		});
	})
	onReady(() => {
		getServerDataRing()
		getServerDataArea()
	})
</script>

<style lang="less">
	.body {
		min-height: 100vh;
		background-color: #fff;

		.datetimeBox {
			position: relative;
			margin-left: 45rpx;
			width: 500rpx;
		}

		.ringBox {
			margin: 40rpx auto;
			padding: 20rpx 60rpx 60rpx;
			width: 680rpx;
			height: 500rpx;
			background-color: #F8F8F8;
			border-radius: 15px;
			box-sizing: border-box;

			.title {
				display: flex;
				justify-content: space-between;

				.titleLeft {
					position: relative;
					margin-bottom: 16rpx;
					font-size: 14px;
					font-weight: 700;

					&::before {
						content: '';
						display: block;
						width: 8rpx;
						height: 70%;
						background-color: #4095E5;
						position: absolute;
						left: -16rpx;
						top: 5rpx;
					}
				}

				.titleRight {
					font-size: 18px;
					color: #5F97BF;
				}
			}

			.ring {
				width: 100%;
				height: 100%;
			}
		}

		.lineBox {}
	}
</style>